import { Component, input } from '@angular/core';
import { Trip } from '@repo/types';
import { TimePipe } from '@shared/pipes/time-pipe';
import { LineTypeIcon } from '../line-type-icon/line-type-icon';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { MatTableModule } from '@angular/material/table';
import { TripStatusPipe } from '../../pipes/trip-pipe';

@Component({
  selector: 'app-trip-table',
  imports: [MatTableModule, ButtonModule, TimePipe, LineTypeIcon, ChipModule, TripStatusPipe],
  template: `
    <table mat-table [dataSource]="trips()" class="mat-elevation-z8">
      <!--- Note that these columns can be defined in any order.
        The actual rendered columns are set as a property on the row definition" -->

      <!-- Position Column -->
      <ng-container matColumnDef="position">
        <th mat-header-cell *matHeaderCellDef>No.</th>
        <td mat-cell *matCellDef="let element" class="w-20">
          <div class="flex items-center gap-2">
            <app-line-type-icon [type]="element.line.type" />
            <span class="ml-2">{{ element.run.code }}</span>
          </div>
        </td>
      </ng-container>

      <!-- Name Column -->
      <ng-container matColumnDef="name">
        <th mat-header-cell *matHeaderCellDef>Tratta</th>
        <td mat-cell *matCellDef="let element">
          {{ element.run.origin }} → {{ element.run.destination }}
        </td>
      </ng-container>

      <!-- Weight Column -->
      <ng-container matColumnDef="weight">
        <th mat-header-cell *matHeaderCellDef>Partenza</th>
        <td mat-cell *matCellDef="let element">{{ element.departureTime | time }}</td>
      </ng-container>

      <!-- Symbol Column -->
      <ng-container matColumnDef="symbol">
        <th mat-header-cell *matHeaderCellDef>Arrivo</th>
        <td mat-cell *matCellDef="let element">{{ element.arrivalTime | time }}</td>
      </ng-container>

      <ng-container matColumnDef="status">
        <th mat-header-cell *matHeaderCellDef>Stato</th>
        <td mat-cell *matCellDef="let element">
          <span
            class="text-lg font-bold leading-none uppercase"
            [class.text-red-400]="element.status !== 'on-time'"
            [class.text-[#005965]]="element.status === 'on-time'"
          >
            {{ element.status | mapTripStatus }}
          </span>
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
    </table>
  `,
  styles: `
    :root {
      @include mat.table-overrides(
        (
          background-color: orange,
          header-headline-color: red,
        )
      );
    }
  `,
})
export class TripTable {
  trips = input<Trip[]>([]);

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'status'];
}
