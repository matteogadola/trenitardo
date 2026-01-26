import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { HomeFilters } from './home-filters';
import { HomeStats } from './home-stats';
import { HomeTripList } from './home-trip-list';
import { ApiService } from '@app/core/api/api-service';
import { rxResource } from '@angular/core/rxjs-interop';
import { HomeHero } from './home-hero';
import { TODAY } from '@app/core/utils/date-util';
import { Spinner } from '@app/shared/components/spinner/spinner';
import { HomeFaq } from './home-faq';

@Component({
  selector: 'app-home-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HomeFilters, HomeStats, HomeTripList, HomeHero, Spinner, HomeFaq],
  template: `
    <div class="w-content pt-[80px]">
      <home-hero />

      @defer (when tripsResource.hasValue()) {
        <div class="flex flex-col gap-8">
          <home-stats [trips]="tripsResource.value()" />
          <home-filters
            [isLoading]="tripsResource.isLoading()"
            (filterSubmit)="onFilterUpdate($event)"
          />
          <home-trip-list [trips]="tripsResource.value()" />
        </div>
      } @placeholder {
        <app-spinner />
      }
      <section class="hidden pt-24">
        <home-faq />
      </section>
    </div>
  `,
})
export class HomePage {
  private readonly apiService = inject(ApiService);
  private readonly date = signal<string>(TODAY);
  readonly lines$ = this.apiService.getLines();

  readonly tripsResource = rxResource({
    params: () => this.date(),
    stream: ({ params: date }) => this.apiService.getTrips({ date }),
    defaultValue: [],
  });

  onFilterUpdate(filter: any) {
    this.date.set(filter.date);
  }
}
