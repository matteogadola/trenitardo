import { Component, input } from '@angular/core';
import { Trip } from '@repo/types';
import { TripMultiChart } from '@app/shared/components/charts/trip-multi';

@Component({
  selector: 'home-stats-multi',
  imports: [TripMultiChart],
  template: `<trip-multi-chart [trips]="trips()" />`,
  styles: ``,
})
export class HomeStatsMulti {
  readonly trips = input<Trip[]>([]);
  readonly isLoading = input<boolean>(false);
}
