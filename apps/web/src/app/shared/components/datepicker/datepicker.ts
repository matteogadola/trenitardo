import {
  Component,
  inject,
  output,
  ChangeDetectionStrategy,
  input,
  effect,
  viewChild,
} from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormControl } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import {
  MatDatepickerModule,
  MatDatepicker,
  MatDateRangePicker,
} from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { dt } from '@app/core/utils/date';
import type { Dayjs } from 'dayjs';

export type DatePickerMode = 'daily' | 'weekly' | 'monthly' | 'range';

//export type DatePickerOutput<M extends DatePickerMode> = M extends 'daily'
//  ? { date: string }
//  : { startDate: string; endDate: string };

export type DatePickerOutput = {
  startDate: string;
  endDate?: string;
};

@Component({
  selector: 'app-datepicker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
  ],
  template: `
    <div class="selector-container">
      <div class="flex items-center justify-center w-full mx-auto">
        <button
          type="button"
          matIconButton
          (click)="previous()"
          aria-label="Example icon button with a vertical three dot icon"
          [disabled]="
            isLoading() ||
            (mode() === 'daily' && singleDateControl.value.isSame(minDate)) ||
            (mode() !== 'daily' && rangeGroup.value.startDate?.isSame(minDate))
          "
        >
          <mat-icon>chevron_left</mat-icon>
        </button>

        <button matButton="outlined" (click)="openCalendar()" [disabled]="isLoading()">
          {{ buttonLabel }}
        </button>

        <button
          type="button"
          matIconButton
          (click)="next()"
          aria-label="Example icon button with a vertical three dot icon"
          [disabled]="
            isLoading() ||
            (mode() === 'daily' && singleDateControl.value.isToday()) ||
            (mode() !== 'daily' && rangeGroup.value.endDate?.isToday())
          "
        >
          <mat-icon>chevron_right</mat-icon>
        </button>
      </div>

      <div class="hidden-inputs">
        <mat-form-field>
          <input
            matInput
            [matDatepicker]="picker"
            [formControl]="singleDateControl"
            (dateChange)="emitValue()"
            [min]="minDate"
            [max]="maxDate"
            [hidden]="true"
          />
          <mat-datepicker
            #picker
            [startView]="mode() === 'monthly' ? 'year' : 'month'"
            (monthSelected)="handleMonthSelected($event, picker)"
          >
          </mat-datepicker>
        </mat-form-field>

        <mat-form-field>
          <mat-date-range-input [rangePicker]="rangePicker" [formGroup]="rangeGroup">
            <input
              matStartDate
              formControlName="startDate"
              [min]="minDate"
              [max]="maxDate"
              [hidden]="true"
            />
            <input
              matEndDate
              formControlName="endDate"
              (dateChange)="emitValue()"
              [min]="minDate"
              [max]="maxDate"
              [hidden]="true"
            />
          </mat-date-range-input>
          <mat-date-range-picker #rangePicker></mat-date-range-picker>
        </mat-form-field>
      </div>
    </div>
  `,
  styles: `
    .selector-container {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      align-items: flex-start;
    }

    .trigger-btn {
      min-width: 220px;
      height: 45px;
      .btn-text {
        text-transform: capitalize;
        font-weight: 500;
      }
    }

    .hidden-inputs {
      /* Evita l'errore NG01352 mantenendo gli input "attivi" ma invisibili */
      visibility: hidden;
      height: 0;
      width: 0;
      overflow: hidden;
    }
  `,
})
export class Datepicker {
  private readonly fb = inject(FormBuilder);

  readonly mode = input<DatePickerMode>('daily');
  readonly isLoading = input<boolean>(false);
  readonly selected = output<DatePickerOutput>();

  picker = viewChild<MatDatepicker<Dayjs>>('picker');
  rangePicker = viewChild<MatDateRangePicker<Dayjs>>('rangePicker');

  readonly minDate = '2026-01-16';
  readonly maxDate = dt().format('YYYY-MM-DD');

  singleDateControl = new FormControl<Dayjs>(dt(), { nonNullable: true });
  rangeGroup = this.fb.nonNullable.group({
    startDate: [dt().startOf('week')],
    endDate: [dt()],
  });

  constructor() {
    effect(() => {
      const mode = this.mode();
      this.resetDates(mode);
    });
  }

  get buttonLabel(): string {
    const mode = this.mode();
    const fmt = 'DD/MM/YYYY';

    if (mode === 'daily') {
      return this.singleDateControl.value?.format(fmt) || 'Seleziona Data';
    }

    const { startDate, endDate } = this.rangeGroup.value;
    if (startDate && endDate) {
      //if (mode === 'monthly') {
      //  return startDate.format('MMMM YYYY');
      //}
      return `${startDate.format(fmt)} - ${endDate.format(fmt)}`;
    }

    return 'Seleziona Range';
  }

  /**
   * Apre il calendario corretto
   */
  openCalendar() {
    if (['weekly', 'range'].includes(this.mode())) {
      this.rangePicker()?.open();
    } else {
      this.picker()?.open();
    }
  }

  // --- Actions ---
  previous(): void {
    if (this.mode() === 'daily') {
      this.singleDateControl.setValue(this.singleDateControl.value?.subtract(1, 'day'));
    } else if (this.mode() === 'weekly') {
      this.rangeGroup.setValue({
        startDate: this.rangeGroup.value.startDate!.subtract(1, 'week'),
        endDate: this.rangeGroup.value.endDate!.subtract(1, 'week'),
      });
    } else if (this.mode() === 'monthly') {
      this.rangeGroup.setValue({
        startDate: this.rangeGroup.value.startDate!.subtract(1, 'month'),
        endDate: this.rangeGroup.value.endDate!.subtract(1, 'month'),
      });
    }
    this.emitValue();
    //this.singleDateControl.setValue(today);
    //this.filtersForm.date().value.update((d) => d.subtract(1, 'day'));
  }

  next(): void {
    if (this.mode() === 'daily') {
      this.singleDateControl.setValue(this.singleDateControl.value?.add(1, 'day'));
    }
    this.emitValue();
    //this.singleDateControl.setValue(today);
    //this.filtersForm.date().value.update((d) => d.add(1, 'day'));
  }

  handleMonthSelected(date: Dayjs, picker: MatDatepicker<Dayjs>) {
    if (this.mode() === 'monthly') {
      let startDate = date.startOf('month');
      let endDate = date.endOf('month');

      // Se è il mese corrente, ci fermiamo a oggi
      if (date.isSame(dt(), 'month')) {
        endDate = dt();
      }

      if (startDate.isBefore(this.minDate)) {
        startDate = dt(this.minDate);
      }

      this.rangeGroup.patchValue({ startDate, endDate });
      this.singleDateControl.setValue(startDate);
      picker.close();
      this.emitValue();
    }
  }

  private resetDates(mode: DatePickerMode) {
    const today = dt();

    if (mode === 'daily') {
      this.singleDateControl.setValue(today);
    } else if (mode === 'weekly') {
      this.rangeGroup.setValue({
        startDate: today.startOf('week'),
        endDate: today,
      });
    } else if (mode === 'monthly') {
      this.handleMonthSelected(today, this.picker()!);
    }
    this.emitValue();
  }

  emitValue() {
    const mode = this.mode();

    const value =
      mode === 'daily'
        ? { startDate: this.singleDateControl.value!.format('YYYY-MM-DD') }
        : {
            startDate: this.rangeGroup.value.startDate!.format('YYYY-MM-DD'),
            endDate: this.rangeGroup.value.endDate!.format('YYYY-MM-DD'),
          };

    this.selected.emit(value);
  }
}
