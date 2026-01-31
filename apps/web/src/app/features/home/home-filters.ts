import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggle, MatButtonToggleModule } from '@angular/material/button-toggle';
import {
  Datepicker,
  DatePickerMode,
  DatePickerOutput,
} from '@app/shared/components/datepicker/datepicker';
import { toSignal } from '@angular/core/rxjs-interop';
import { AnimateDirective } from '@app/shared/animations/animate-directive';

interface FilterData {
  mode: DatePickerMode;
  //date: Dayjs;
  //startDate: Dayjs;
  //endDate: Dayjs;
  //lineId: string;
}
export interface Range {
  startDate: string;
  endDate?: string;
}

@Component({
  selector: 'home-filters',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatButtonToggleModule,
    Datepicker,
    AnimateDirective,
  ],
  template: `
    <div
      class="app-filter bg-white/60 backdrop-blur-sm rounded-xl border border-gray-100 shadow-sm pt-8 pb-4"
      animate
      [animateRepeat]="false"
    >
      <div class="max-w-xl mx-auto">
        <div class="flex flex-col gap-8">
          <!--form (submit)="$event.preventDefault()" class="flex flex-col gap-8"-->
          <mat-button-toggle-group
            name="mode"
            aria-label="Font Style"
            [hideSingleSelectionIndicator]="true"
            [formControl]="modeControl"
            class="min-w-xs sm:min-w-md mx-auto"
          >
            <mat-button-toggle value="daily">Giorno</mat-button-toggle>
            <!--mat-button-toggle value="weekly" class="w-1/4">Settimana</mat-button-toggle-->
            <mat-button-toggle value="monthly">Mese</mat-button-toggle>
            <mat-button-toggle value="range">Range</mat-button-toggle>
          </mat-button-toggle-group>
          <div class="">
            <app-datepicker
              [mode]="mode()"
              [isLoading]="isLoading()"
              (selected)="onDateChange($event)"
            />
          </div>
        </div>
        <!--/form-->
      </div>
    </div>
  `,
  styles: ``,
})
export class HomeFilters {
  isLoading = input<boolean>(false);
  rangeChange = output<Range>();

  // in attesa che mat-button-toggle-group inizi a supportare [formField]
  modeControl = new FormControl<DatePickerMode>('daily', { nonNullable: true });
  mode = toSignal(this.modeControl.valueChanges, { initialValue: 'daily' });

  onDateChange(event: DatePickerOutput) {
    this.rangeChange.emit({ ...event });
  }
}
