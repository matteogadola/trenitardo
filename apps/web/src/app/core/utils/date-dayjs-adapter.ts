/**
 * @license
 * Implementazione DayjsDateAdapter robusta e conforme alle best practices Angular.
 */
import { Injectable, InjectionToken, inject } from '@angular/core';
import { DateAdapter, MAT_DATE_LOCALE, MatDateFormats } from '@angular/material/core';
import dayjs, { Dayjs } from 'dayjs';

// Importa la tua istanza configurata (con i plugin caricati: utc, localeData, customParseFormat)
import { dt } from './date';

export interface DayjsDateAdapterOptions {
  strict?: boolean;
  useUtc?: boolean;
}

export const MAT_DAYJS_DATE_ADAPTER_OPTIONS = new InjectionToken<DayjsDateAdapterOptions>(
  'MAT_DAYJS_DATE_ADAPTER_OPTIONS',
  {
    providedIn: 'root',
    factory: () => ({ useUtc: false, strict: false }),
  },
);

export const MAT_DAYJS_FORMATS: MatDateFormats = {
  parse: {
    dateInput: 'L',
  },
  display: {
    dateInput: 'L',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

function range<T>(length: number, valueFunction: (index: number) => T): T[] {
  return Array.from({ length }, (_, i) => valueFunction(i));
}

@Injectable()
export class DayjsDateAdapter extends DateAdapter<Dayjs> {
  // Inject services moderni
  private readonly _dateLocale = inject<string>(MAT_DATE_LOCALE, { optional: true });
  private readonly _options = inject<DayjsDateAdapterOptions>(MAT_DAYJS_DATE_ADAPTER_OPTIONS, {
    optional: true,
  });

  private _localeData!: {
    firstDayOfWeek: number;
    longMonths: string[];
    shortMonths: string[];
    dates: string[];
    longDaysOfWeek: string[];
    shortDaysOfWeek: string[];
    narrowDaysOfWeek: string[];
  };

  constructor() {
    super();
    this.setLocale(this._dateLocale ?? dt.locale());
  }

  // --- CORE LOGIC: DESERIALIZE ---

  /**
   * Converte qualsiasi input in un oggetto Dayjs valido.
   * FIX CRITICO: Non chiamare mai super.deserialize() perché ritornerebbe Date native.
   */
  override deserialize(value: any): Dayjs | null {
    if (value == null) {
      return null;
    }

    // 1. È già un Dayjs? (Caso Submit / Log che hai visto)
    if (this.isDateInstance(value)) {
      return this.clone(value);
    }

    // 2. È una stringa? (Input manuale o attributo HTML)
    if (typeof value === 'string') {
      if (!value.trim()) return null;
      const date = this._createDayjs(value);
      return date.isValid() ? date : null;
    }

    // 3. È un numero? (Timestamp)
    if (typeof value === 'number') {
      const date = this._createDayjs(value);
      return date.isValid() ? date : null;
    }

    // 4. È una Date nativa? (Es. new Date() passato per sbaglio)
    if (value instanceof Date) {
      const date = this._createDayjs(value);
      return date.isValid() ? date : null;
    }

    // 5. Fallback: non sappiamo cos'è, ritorniamo null invece di crashare
    return null;
  }

  // --- DATE ADAPTER IMPLEMENTATION ---

  override setLocale(locale: string): void {
    super.setLocale(locale);

    // Usa istanza temporanea per estrarre i dati del locale
    const localeDataObj = this._createDayjs().locale(locale).localeData();

    this._localeData = {
      firstDayOfWeek: localeDataObj.firstDayOfWeek(),
      longMonths: localeDataObj.months(),
      shortMonths: localeDataObj.monthsShort(),
      dates: range(31, (i) => this._createDayjs([2017, 0, i + 1]).format('D')),
      longDaysOfWeek: localeDataObj.weekdays(),
      shortDaysOfWeek: localeDataObj.weekdaysShort(),
      narrowDaysOfWeek: localeDataObj.weekdaysMin(),
    };
  }

  getYear(date: Dayjs): number {
    return this.clone(date).year();
  }

  getMonth(date: Dayjs): number {
    return this.clone(date).month();
  }

  getDate(date: Dayjs): number {
    return this.clone(date).date();
  }

  getDayOfWeek(date: Dayjs): number {
    return this.clone(date).day();
  }

  getMonthNames(style: 'long' | 'short' | 'narrow'): string[] {
    return style === 'long' ? this._localeData.longMonths : this._localeData.shortMonths;
  }

  getDateNames(): string[] {
    return this._localeData.dates;
  }

  getDayOfWeekNames(style: 'long' | 'short' | 'narrow'): string[] {
    if (style === 'long') return this._localeData.longDaysOfWeek;
    if (style === 'short') return this._localeData.shortDaysOfWeek;
    return this._localeData.narrowDaysOfWeek;
  }

  getYearName(date: Dayjs): string {
    return this.clone(date).format('YYYY');
  }

  getFirstDayOfWeek(): number {
    return this._localeData.firstDayOfWeek;
  }

  getNumDaysInMonth(date: Dayjs): number {
    return this.clone(date).daysInMonth();
  }

  clone(date: Dayjs): Dayjs {
    return date.clone().locale(this.locale);
  }

  createDate(year: number, month: number, date: number): Dayjs {
    // Validazione strict stile Material
    if (month < 0 || month > 11) {
      throw Error(`Invalid month index "${month}". Month index has to be between 0 and 11.`);
    }
    if (date < 1) {
      throw Error(`Invalid date "${date}". Date has to be greater than 0.`);
    }

    const result = this._createDayjs([year, month, date]);

    if (!result.isValid() || result.month() !== month || result.date() !== date) {
      throw Error(`Invalid date "${date}" for month with index "${month}".`);
    }

    return result.startOf('day');
  }

  today(): Dayjs {
    return this._createDayjs().startOf('day');
  }

  parse(value: any, parseFormat: string | string[]): Dayjs | null {
    if (value == null || (typeof value === 'string' && !value.trim())) {
      return null;
    }

    const strict = this._options?.strict ?? false;

    if (typeof value === 'string') {
      const formats = Array.isArray(parseFormat) ? parseFormat : [parseFormat];
      for (const fmt of formats) {
        const date = this._createDayjs(value, fmt, strict);
        if (date.isValid()) return date;
      }
      return null;
    }

    return this.deserialize(value);
  }

  format(date: Dayjs, displayFormat: string): string {
    if (!this.isValid(date)) {
      throw Error('DayjsDateAdapter: Cannot format invalid date.');
    }
    return this.clone(date).format(displayFormat);
  }

  addCalendarYears(date: Dayjs, years: number): Dayjs {
    return this.clone(date).add(years, 'year');
  }

  addCalendarMonths(date: Dayjs, months: number): Dayjs {
    return this.clone(date).add(months, 'month');
  }

  addCalendarDays(date: Dayjs, days: number): Dayjs {
    return this.clone(date).add(days, 'day');
  }

  toIso8601(date: Dayjs): string {
    return this.clone(date).toISOString();
  }

  /**
   * Controlla se l'oggetto è una istanza Dayjs valida.
   */
  isDateInstance(obj: any): boolean {
    return dt.isDayjs(obj);
  }

  isValid(date: Dayjs): boolean {
    return this.clone(date).isValid();
  }

  invalid(): Dayjs {
    return dt(null); //.invalid();
  }

  // --- HELPER UNIFICATO ---
  private _createDayjs(
    input?: dayjs.ConfigType | [number, number, number],
    format?: string,
    strict: boolean = false,
  ): Dayjs {
    const useUtc = this._options?.useUtc ?? false;
    const factory = useUtc ? dt.utc : dt; // Usa la tua istanza dt configurata
    const currentLocale = this.locale;

    let date: Dayjs;

    if (Array.isArray(input) && input.length === 3) {
      // Uso .set() a catena per evitare problemi di tipo con l'oggetto
      const [year, month, d] = input;
      date = factory().set('year', year).set('month', month).set('date', d);
    } else {
      if (format) {
        date = (factory as any)(input, format, currentLocale, strict);
      } else {
        date = factory(input);
      }
    }

    return date.locale(currentLocale);
  }
}
