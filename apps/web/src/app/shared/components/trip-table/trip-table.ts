import { Component, input } from '@angular/core';
import { Trip } from '@repo/types';
import { Table, TableModule } from 'primeng/table';
import { TimePipe } from '@shared/pipes/time-pipe';
import { LineTypeIcon } from '../line-type-icon/line-type-icon';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';

@Component({
  selector: 'app-trip-table',
  imports: [TableModule, ButtonModule, TimePipe, LineTypeIcon, ChipModule],
  template: `
    <p-table class="text-base" [value]="trips()" [tableStyle]="{ 'min-width': '50rem' }">
      <ng-template #header>
        <tr>
          <th>Treno</th>
          <th>Tratta</th>
          <th>Partenza</th>
          <th>Arrivo</th>
          <th>Stato</th>
        </tr>
      </ng-template>
      <ng-template #body let-trip>
        <tr>
          <td>
            <div class="flex items-center">
              <app-line-type-icon [type]="trip.line.type" />
              <span class="ml-2">{{ trip.run.code }}</span>
              <!-- potrebbe diventare un link -->
            </div>
          </td>
          <td>{{ trip.run.origin }} → {{ trip.run.destination }}</td>
          <td class="w-[196px]">
            <span [class.line-through]="trip.status === 'cancelled'">
              {{ trip.actualDepartureTime | time }}
            </span>
          </td>
          <td class="w-[150px]">
            @if (trip.isDeparted || trip.isCompleted) {
              <div class="flex items-center justify-between">
                {{ trip.actualArrivalTime | time }}
                @if (trip.delay > 0) {
                  <div
                    class="flex items-center rounded-full ml-2 bg-red-700 text-white text-sm px-2 py-[2px]"
                  >
                    +{{ trip.delay }} min
                  </div>
                }
              </div>
            }
          </td>
          <td>{{ trip.status }}</td>
        </tr>
      </ng-template>
    </p-table>
  `,
  styles: ``,
})
export class TripTable {
  trips = input<Trip[]>([]);
}
