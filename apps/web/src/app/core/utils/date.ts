import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import minMax from 'dayjs/plugin/minMax';
import isToday from 'dayjs/plugin/isToday';
import isBetween from 'dayjs/plugin/isBetween';
import localeData from 'dayjs/plugin/localeData';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import 'dayjs/locale/it';
import 'dayjs/locale/en';

dayjs.locale('it');
dayjs.extend(utc);
dayjs.extend(minMax);
dayjs.extend(isToday);
dayjs.extend(isBetween);
dayjs.extend(localeData);
dayjs.extend(quarterOfYear);
dayjs.extend(localizedFormat);
dayjs.extend(customParseFormat);

// -----------------------------
// Plugin extension
// -----------------------------

declare module 'dayjs' {
  interface Dayjs {
    isBusinessDay(): boolean;
  }

  interface DayjsStatic {
    invalid(): Dayjs;
  }
}

dayjs.extend((_opts: unknown, dayjsClass: any) => {
  dayjsClass.prototype.isBusinessDay = function (): boolean {
    return isBusinessDay(this);
  };
});

// -----------------------------
// Business logic
// -----------------------------

const isBusinessDay = (date: Dayjs): boolean => {
  // 0 (Sunday) to 6 (Saturday)
  if ([0, 6].includes(date.day())) {
    return false;
  }

  const year = date.year();
  const easter = getEasterDate(year);

  const holidays = [
    { date: `${year}-01-01`, name: 'Capodanno' },
    { date: `${year}-01-06`, name: 'Epifania' },
    { date: easter.format('YYYY-MM-DD'), name: 'Pasqua' },
    { date: easter.add(1, 'day').format('YYYY-MM-DD'), name: "Lunedì dell'Angelo" },
    { date: `${year}-04-25`, name: 'Festa della Liberazione' },
    { date: `${year}-05-01`, name: 'Festa dei Lavoratori' },
    { date: `${year}-06-02`, name: 'Festa della Repubblica' },
    { date: `${year}-08-15`, name: 'Ferragosto' },
    { date: `${year}-10-04`, name: 'San Francesco' },
    { date: `${year}-11-01`, name: 'Ognissanti' },
    { date: `${year}-12-08`, name: 'Immacolata Concezione' },
    { date: `${year}-12-25`, name: 'Natale' },
    { date: `${year}-12-26`, name: 'Santo Stefano' },
  ];

  for (const holiday of holidays) {
    if (date.isSame(holiday.date, 'day')) return false;
  }

  return true;
};

const getEasterDate = (y?: number): Dayjs => {
  const year = y ?? dayjs().year();

  let m: number;
  let n: number;

  if (year >= 1900 && year < 2100) {
    m = 24;
    n = 5;
  } else if (year >= 1583 && year < 1700) {
    m = 22;
    n = 2;
  } else if (year >= 1700 && year < 1800) {
    m = 23;
    n = 3;
  } else if (year >= 1800 && year < 1900) {
    m = 23;
    n = 4;
  } else if (year >= 2100 && year < 2200) {
    m = 24;
    n = 6;
  } else if (year >= 2200 && year < 2300) {
    m = 25;
    n = 0;
  } else if (year >= 2300 && year < 2400) {
    m = 26;
    n = 1;
  } else if (year >= 2400 && year < 2500) {
    m = 25;
    n = 1;
  } else {
    throw new Error('Errore nel calcolo della pasqua');
  }

  const a = year % 19;
  const b = year % 4;
  const c = year % 7;
  const d = (19 * a + m) % 30;
  const e = (2 * b + 4 * c + 6 * d + n) % 7;

  let pasqua: Dayjs;

  if (d + e < 10) {
    const day = d + e + 22;
    pasqua = dayjs(`${year}-03-${day}`, 'YYYY-MM-DD');
  } else {
    let day = d + e - 9;

    if (day === 26) day = 19;
    if (day === 25 && d === 28 && e === 6 && a > 10) day = 18;

    pasqua = dayjs(`${year}-04-${day}`, 'YYYY-MM-DD');
  }

  return pasqua;
};

export const dt = dayjs;
