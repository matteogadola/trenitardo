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
      <!-- h-full w-content -->
      <home-hero />

      @if (tripsResource.hasValue()) {
        <home-stats [trips]="tripsResource.value()" />
      }

      <div class="hidden relative h-[390px] w-full">
        <!--img ngSrc="/images/background-5.png" fill alt="Trenitardo Logo" class="object-cover" priority /-->
        <div class="pt-5 px-8 flex space-x-2 text-white items-center">
          <!--div class="mt-[calc(320px+32px)] font-poppins text-black space-x-2">
          <span class="text-2xl font-semibold">
            Nuova Schedulazione
          </span>
          <homepage-filters />
        </div-->
        </div>
      </div>
      <div class="mt-16 lg:max-w-6xl mx-auto"></div>
      <div class="">
        <home-filters [lines]="(lines$ | async) ?? []" [date]="date()" />
      </div>
      @if (tripsResource.hasValue()) {
        <div class="mt-16">
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
