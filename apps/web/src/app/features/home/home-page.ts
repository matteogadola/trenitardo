import {
  Component,
  ChangeDetectionStrategy,
  inject,
  resource,
  signal,
  afterNextRender,
} from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { HomeFilters } from './home-filters';
import { HomeStats } from './home-stats';
import { HomeTripList } from './home-trip-list';
import { ApiService } from '@app/core/api/api-service';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { HomeHero } from './home-hero';
import { TODAY } from '@app/core/utils/date-util';
import { Analytics, logEvent } from '@angular/fire/analytics';
import { Spinner } from '@app/shared/components/spinner/spinner';
import { HomeFaq } from './home-faq';

@Component({
  selector: 'app-home-page',
  imports: [CommonModule, HomeFilters, HomeStats, HomeTripList, HomeHero, Spinner, HomeFaq],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
          <home-trip-list [trips]="tripsResource.value()" [date]="date()" />
        </div>
      } @placeholder {
        <app-spinner />
      }
      <section class="hidden pt-24">
        <home-faq />
      </section>
    </div>
  `,
  styles: ``,
})
export class HomePage {
  private readonly apiService = inject(ApiService);
  readonly lines$ = this.apiService.getLines();

  readonly date = signal<string>(TODAY);

  readonly tripsResource = rxResource({
    params: () => this.date(),
    stream: ({ params: date }) => this.apiService.getTrips({ date }),
    defaultValue: [],
  });

  onFilterUpdate(filter: any) {
    this.date.set(filter.date);
  }

  private analytics = inject(Analytics);

  constructor() {
    afterNextRender(() => {
      logEvent(this.analytics, 'landing_page_view', {
        campaign: 'launch_v1',
        timestamp: new Date().toISOString(),
      });
    });
  }
}
