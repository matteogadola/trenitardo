import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Trip } from '@repo/types';
import { TripList } from '@app/shared/components/trip-list/trip-list';
import { AnimateDirective } from '@app/shared/animations/animate-directive';

@Component({
  selector: 'home-trip-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TripList, AnimateDirective],
  template: `
    <div animate [animateThreshold]="0">
      <h1
        class="text-4xl my-18 lg:mt-32 lg:mb-24 md:text-6xl font-bold text-slate-800 text-center tracking-tight"
      >
        Corse
        <span class="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-green-300">
          in dettaglio
        </span>
      </h1>
      <app-trip-list [trips]="trips()" class="max-w-4xl mx-auto" />
    </div>
  `,
  styles: ``,
})
export class HomeTripList {
  readonly trips = input.required<Trip[]>();
}
