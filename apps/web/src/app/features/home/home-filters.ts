import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  linkedSignal,
  output,
  signal,
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { AutoCompleteModule, AutoCompleteSelectEvent } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FluidModule } from 'primeng/fluid';
import { form, FormField, submit } from '@angular/forms/signals';
import { TODAY } from '@app/core/utils/date-util';
import type { Line } from '@repo/types';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { dt } from '@app/core/utils/date';
import dayjs, { Dayjs } from 'dayjs';

interface FilterData {
  date: Dayjs;
  lineId: string;
}
export interface FilterState {
  date: string;
  searchText: string | null;
}

@Component({
  selector: 'home-filters',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormField,
    AutoCompleteModule,
    ButtonModule,
    FloatLabelModule,
    FluidModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatDatepickerModule,
    MatFormFieldModule,
  ],
  template: `
    <!--div class="pt-12 pb-6">
      <div class="bg-white/80 backdrop-blur-sm rounded-2xl border border-purple-200 p-6 shadow-lg">
        <div class="flex items-center gap-3 mb-6">
          <h2 class="text-xl font-semibold text-slate-800">Filtra i Dati</h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">
             Data
            </label>

            <input
              type="date"
              [formField]="filtersForm.date"
              class="w-full px-4 py-3 bg-purple-50 border border-purple-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
            />
          </div>

          <div>
            @if (lines().length > 0) {
              <label class="block text-sm font-medium text-slate-700 mb-2">
                Tipologia Tratta
              </label>

              <select
                [formField]="filtersForm.lineId"
                class="w-full px-4 py-3 bg-purple-50 border border-purple-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all cursor-pointer"
              >
                <option [value]="''">Tutte le tratte</option>
                @for (line of lines(); track line.id) {
                  <option [value]="line.id">
                    <span class="text-purple-600">{{ line.code }}</span>
                    {{ line.name }}
                  </option>
                }
              </select>
            }
          </div>
        </div>
      </div>
    </div-->
    <div [class]="'app-filter ' + class()">
      <form
        (submit)="onSubmit($event)"
        class="flex flex-col gap-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-100 shadow-sm sm:flex-row sm:items-end"
      >
        <div class="flex flex-col gap-1 w-full sm:w-auto mx-auto">
          <!--div class="flex items-center gap-3 mb-6">
            <h2 class="text-xl font-semibold text-slate-800">Filtra i Dati</h2>
          </div-->
          <div class="flex items-center justify-center">
            <button
              type="button"
              matIconButton
              (click)="prevDay()"
              aria-label="Example icon button with a vertical three dot icon"
              [disabled]="
                isLoading() || filtersForm.date().value().format('YYYY-MM-DD') === '2026-01-16'
              "
            >
              <mat-icon>chevron_left</mat-icon>
            </button>

            <!--p-button
            icon="pi pi-chevron-left"
            [rounded]="true"
            [text]="true"
            severity="secondary"
            ariaLabel="Giorno precedente"
            (onClick)="shiftDate(-1)"
            [disabled]="isRangeMode()"
          /-->

            <!--p-datepicker
            name="dateRange"
            [(ngModel)]="date"
            selectionMode="range"
            [readonlyInput]="true"
            placeholder="Oggi"
            styleClass="w-full sm:w-60"
            dateFormat="dd/mm/yy"
            [numberOfMonths]="2"
            [showIcon]="false"
            ariaLabelledBy="date-label"
          >
            <ng-template #footer>
              <div class="flex flex-wrap gap-2 p-3 border-t border-gray-200 justify-between">
                <p-button
                  label="Oggi"
                  size="small"
                  [text]="true"
                  (onClick)="applyPreset('today')"
                />
                <p-button
                  label="7 gg"
                  size="small"
                  [text]="true"
                  (onClick)="applyPreset('last7')"
                />
                <p-button
                  label="Mese"
                  size="small"
                  [text]="true"
                  (onClick)="applyPreset('month')"
                />
                <p-button
                  label="30 gg"
                  size="small"
                  [text]="true"
                  (onClick)="applyPreset('last30')"
                />
              </div>
            </ng-template>
          </p-datepicker-->
            <mat-form-field appearance="outline">
              <!--mat-label>Choose a date</mat-label>
            <input matInput [matDatepicker]="picker" [formControl]="dateControl" />
            <mat-datepicker #picker></mat-datepicker-->

              <input
                matInput
                [matDatepicker]="picker"
                placeholder="Seleziona una data"
                (click)="picker.open()"
                (keydown)="$event.stopPropagation()"
                [formField]="filtersForm.date"
                min="2026-01-16"
                class="text-center cursor-pointer"
                [disabled]="isLoading()"
              />
              <mat-datepicker #picker></mat-datepicker>
            </mat-form-field>
            <button
              type="button"
              matIconButton
              (click)="nextDay()"
              aria-label="Example icon button with a vertical three dot icon"
              [disabled]="isLoading() || filtersForm.date().value().isToday()"
            >
              <mat-icon>chevron_right</mat-icon>
            </button>

            <!--button matButton="filled"><span class="text-lg">Esegui</span></button-->
          </div>
        </div>

        <!--div class="w-full sm:flex-1">
        <p-floatLabel variant="on">
          <p-autoComplete
            name="searchText"
            [(ngModel)]="text"
            [suggestions]="suggestions()"
            (completeMethod)="onSearch.emit($event.query)"
            inputId="autocomplete-filter"
            styleClass="w-full"
            [dropdown]="false"
          />
          <label for="autocomplete-filter">Cerca cliente o pratica...</label>
        </p-floatLabel>
      </div-->
      </form>
    </div>
  `,
  styles: ``,
})
export class HomeFilters {
  class = input<string>('');
  /*date = input<string>(TODAY);
  lines = input<Line[]>([]);

  protected readonly filterModel = signal<FilterData>({
    date: this.date(),
    lineId: '',
  });
  protected readonly filtersForm = form(this.filterModel);

  selectedDate: string = '';
  selectedRoute: string = '';*/

  isLoading = input<boolean>(false);

  protected readonly filterModel = signal<FilterData>({
    date: dt(),
    lineId: '',
  });
  protected readonly filtersForm = form(this.filterModel);

  protected readonly dateControl = new FormControl('', {
    nonNullable: true,
  });

  constructor() {
    effect(() => {
      const date = this.filtersForm.date().value();
      this.filterSubmit.emit({
        date: date.format('YYYY-MM-DD'),
      });
    });
  }

  // --- Inputs / Outputs ---
  //readonly suggestions = input<string[]>([]);
  //readonly initialState = input<FilterState | null>(null);

  //readonly onSearch = output<string>();
  readonly filterSubmit = output<Partial<FilterState>>();

  // --- State (Signal Forms) ---
  // linkedSignal syncs with initialState input if it changes, otherwise holds local state
  /*readonly date = linkedSignal<Date | Date[] | null>(
    () => this.initialState()?.dateRange ?? new Date(),
  );*/

  //readonly text = linkedSignal<string | null>(() => this.initialState()?.searchText ?? '');

  // --- Computed Helpers ---
  /*readonly isRangeMode = computed(() => {
    const d = this.date();
    // PrimeNG range mode returns an array. If array has 2 valid dates, it's a range.
    return Array.isArray(d) && d[0] && d[1];
  });*/

  // --- Actions ---
  prevDay(): void {
    this.filtersForm.date().value.update((d) => d.subtract(1, 'day'));
  }

  nextDay(): void {
    this.filtersForm.date().value.update((d) => d.add(1, 'day'));
  }

  applyPreset(type: 'today' | 'last7' | 'month' | 'last30'): void {
    const today = new Date();
    let newVal: Date | Date[];

    switch (type) {
      case 'today':
        newVal = today;
        break;
      case 'last7':
        //newVal = [subDays(today, 7), today];
        break;
      case 'month':
        //newVal = [startOfMonth(today), today];
        break;
      case 'last30':
        //newVal = [subDays(today, 30), today];
        break;
    }

    // Update signal directly
    //this.date.set(newVal);
  }

  onSubmit(event: Event): void {
    event.preventDefault();
  }

  //onSubmit(event: Event): void {
  //  event.preventDefault();
  //  const date = this.filtersForm.date().value();

  //  this.filterSubmit.emit({
  //    date: date.format('YYYY-MM-DD'),
  //    searchText: this.text(),
  //  });

  //submit(this.filtersForm, async () => {
  //console.log('Format!', val.format()); // undefined (Ha perso i metodi)
  //const { date } = this.filterModel();
  //console.log(date.format());
  /*
      console.log('ORIGINALE', this.filtersForm.date().value());
      console.log('VALORE', val.format('YYYY-MM-DD'));
      this.filterSubmit.emit({
        date: dt(this.filtersForm.date().value()).format('YYYY-MM-DD'),
        searchText: this.text(),
      });*/
  //});
  //}
}
