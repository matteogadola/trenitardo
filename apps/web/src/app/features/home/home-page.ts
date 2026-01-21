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

@Component({
  selector: 'app-home-page',
  imports: [CommonModule, HomeFilters, HomeStats, HomeTripList, HomeHero],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="w-content pt-[80px]">
      <home-hero />

      @defer (when tripsResource.hasValue()) {
        <home-stats [trips]="tripsResource.value()" />
      }

      <div class="">
        <home-filters [lines]="(lines$ | async) ?? []" [date]="date()" />
      </div>
      @defer (when tripsResource.hasValue()) {
        <div class="mt-8">
          <home-trip-list [trips]="tripsResource.value()" [date]="date()" />
        </div>
      }
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

  onDateChange(date: string) {
    this.date.set(date);
  }

  private analytics = inject(Analytics);

  constructor() {
    afterNextRender(() => {
      logEvent(this.analytics, 'landing_page_view', {
        campaign: 'launch_v1',
        timestamp: new Date().toISOString(),
      });
      console.debug('Evento custom inviato');
    });
  }
}
