import { Component, input } from '@angular/core';
import { CardModule } from 'primeng/card';
import { Trip } from '@repo/types';
import { LineTypeIcon } from '../line-type-icon/line-type-icon';
import { TimePipe, ReadableDurationPipe } from '../../pipes/time-pipe';
import { TripStatusPipe } from '../../pipes/trip-pipe';

@Component({
  selector: 'app-trip-list',
  imports: [CardModule, LineTypeIcon, TimePipe, ReadableDurationPipe, TripStatusPipe],
  template: `
    <div>
      @for (trip of trips(); track trip.id) {
        <div
          class="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 p-4 mb-4"
        >
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div class="flex flex-col grow">
              <!-- Treno -->
              <div class="flex items-center gap-2 mb-3">
                <app-line-type-icon [type]="trip.line.type" />
                <span class="ml-2">{{ trip.run.code }}</span>

                <!--span class="text-sm font-extrabold text-gray-800 tracking-tight uppercase">
                  {{ trip.run.code }}
                </span-->
              </div>

              <div class="grid grid-cols-3 items-start">
                <div class="flex flex-col">
                  <span class="text-[22px] font-bold text-[#005965] leading-none">
                    {{ trip.actualDepartureTime | time }}
                  </span>
                  <span class="text-base text-gray-600 font-medium leading-tight">
                    {{ trip.origin }}
                  </span>
                </div>
                <div class="flex flex-col items-center">
                  <!--span class="text-sm text-gray-600 font-medium leading-tight">
                    {{ trip.duration | readableDuration }}
                  </span-->
                  <span
                    class="text-lg font-bold leading-none uppercase"
                    [class.text-red-400]="trip.status !== 'on-time'"
                    [class.text-[#005965]]="trip.status === 'on-time'"
                  >
                    {{ trip.status | mapTripStatus }}
                  </span>
                  @if (trip.delay > 0) {
                    <span class="text-red-400 uppercase"> +{{ trip.delay }} min </span>
                  }
                </div>
                <div class="flex flex-col items-end">
                  <span
                    class="text-[22px]  text-[#005965] leading-none"
                    [class.font-bold]="trip.isCompleted"
                  >
                    {{ trip.actualArrivalTime | time }}
                  </span>
                  <span class="text-base text-gray-600 font-medium leading-tight">
                    {{ trip.destination }}
                  </span>
                </div>
              </div>
              <div class="mt-4 text-sm text-gray-600">
                {{ trip.statusMessage }}
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: ``,
})
export class TripList {
  trips = input<Trip[]>([]);
}
