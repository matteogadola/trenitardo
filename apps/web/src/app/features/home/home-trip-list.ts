import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { Trip } from '@repo/types';
import { TimePipe } from '../../shared/pipes/time-pipe';
import { AbsPipe } from '../../shared/pipes/abs-pipe';
import { TimeDelay } from '@shared/components/time-delay/time-delay';
import { TripTable } from '@shared/components/trip-table/trip-table';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { TripList } from '@app/shared/components/trip-list/trip-list';

@Component({
  selector: 'home-trip-list',
  imports: [CommonModule, TimePipe, AbsPipe, TimeDelay, TripTable, TripList],
  template: `
    <div class="py-12">
      <div
        class="bg-white/80 backdrop-blur-sm rounded-2xl border border-purple-200 overflow-hidden shadow-lg"
      >
        <!-- Header -->
        <div class="p-6 border-b border-purple-100 bg-gradient-to-r from-purple-50 to-pink-50">
          <h2 class="text-2xl font-bold text-slate-800">Dettaglio Tratte Analizzate</h2>
          @if (date()) {
            <p class="text-slate-600 mt-1">
              {{ trips().length }} treni monitorati per il {{ date() }}
            </p>
          }
        </div>

        <!-- Tabella -->
        <div class="hidden lg:flex">
          <app-trip-table [trips]="trips()" />
        </div>
        <div class="flex flex-col lg:hidden px-2 py-2">
          <app-trip-list [trips]="trips()" />
        </div>
      </div>
    </div>
  `,
  styles: ``,
})
export class HomeTripList {
  readonly trips = input.required<Trip[]>();
  readonly date = input<string>();

  //scheduledDepartureTime: null,
  //actualDepartureTime: null,
  //scheduledArrivalTime: null,
  //actualArrivalTime: null,
}
