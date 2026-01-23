import { Component, input } from '@angular/core';
import { Trip } from '@repo/types';
import { TripList } from '@app/shared/components/trip-list/trip-list';

@Component({
  selector: 'home-trip-list',
  imports: [TripList],
  template: `
    <div [class]="class()">
      <h1
        class="text-4xl my-18 lg:mt-32 lg:mb-24 md:text-6xl font-bold text-slate-800 text-center tracking-tight"
      >
        Corse in
        <span class="text-transparent bg-clip-text bg-linear-to-r from-blue-300 to-green-200">
          dettaglio
        </span>
      </h1>
      <app-trip-list [trips]="trips()" class="max-w-4xl mx-auto" />
    </div>
  `,
  styles: ``,
})
export class HomeTripList {
  readonly trips = input.required<Trip[]>();
  readonly date = input<string>();
  readonly class = input<string>('');
}
