import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { HomeFilters, Range } from './home-filters';
import { HomeStats } from './home-stats';
import { HomeStatsMulti } from './home-stats-multi';
import { HomeTripList } from './home-trip-list';
import { ApiService } from '@app/core/api/api-service';
import { rxResource, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { HomeHero } from './home-hero';
import { TODAY } from '@app/core/utils/date-util';
import { Spinner } from '@app/shared/components/spinner/spinner';
import { HomeFaq } from './home-faq';
import { filter, map, startWith } from 'rxjs';

@Component({
  selector: 'app-home-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HomeFilters, HomeStats, HomeTripList, HomeHero, Spinner, HomeFaq, HomeStatsMulti],
  template: `
    <main role="main" class="w-content pt-[80px]">
      <home-hero />

      @defer (when tripsResource.hasValue()) {
        <div class="flex flex-col gap-4 lg:gap-8">
          <home-stats [trips]="trips()" [isLoading]="tripsResource.isLoading()" />
          <home-filters [isLoading]="tripsResource.isLoading()" (rangeChange)="range.set($event)" />
          @if (range().startDate && range().endDate) {
            <home-stats-multi [trips]="trips()" [isLoading]="tripsResource.isLoading()" />
          }
          <home-trip-list [trips]="trips()" />
        </div>
      } @placeholder {
        <div class="flex items-center justify-center">
          <app-spinner />
        </div>
      }
      <section class="hidden pt-24">
        <home-faq />
      </section>
    </main>
  `,
})
export class HomePage {
  private readonly apiService = inject(ApiService);
  readonly range = signal<Range>({ startDate: TODAY });
  readonly lines$ = this.apiService.getLines();

  readonly tripsResource = rxResource({
    params: () => this.range(),
    stream: ({ params: range }) => this.apiService.getTrips({ range }),
    defaultValue: [],
  });

  // Evito che rxResource emetta [] ad ogni ricaricamento
  trips = toSignal(
    toObservable(this.tripsResource.isLoading).pipe(
      startWith(true),
      filter((isLoading) => !isLoading),
      map(() => this.tripsResource.value()),
    ),
    { initialValue: [] },
  );
}
