import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  effect,
  untracked,
  linkedSignal,
} from '@angular/core';
import { HomeFilters } from './home-filters';
import { HomeStats } from './home-stats';
import { HomeTripList } from './home-trip-list';
import { ApiService } from '@app/core/api/api-service';
import { rxResource } from '@angular/core/rxjs-interop';
import { HomeHero } from './home-hero';
import { TODAY } from '@app/core/utils/date-util';
import { Spinner } from '@app/shared/components/spinner/spinner';
import { HomeFaq } from './home-faq';
import { debounceTime, distinctUntilChanged, filter, Observable, skipWhile, startWith } from 'rxjs';
import { Trip } from '@repo/types';

@Component({
  selector: 'app-home-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HomeFilters, HomeStats, HomeTripList, HomeHero, Spinner, HomeFaq],
  template: `
    <div class="w-content pt-[80px]">
      <home-hero />

      @defer (when tripsResource.hasValue()) {
        <div class="flex flex-col gap-8">
          <home-stats [trips]="tripsResource.value()" [isLoading]="tripsResource.isLoading()" />
          <home-filters [isLoading]="tripsResource.isLoading()" (change)="onFilterChange($event)" />
          <home-trip-list [trips]="tripsResource.value()" />
        </div>
      } @placeholder {
        <div class="flex items-center justify-center">
          <app-spinner />
        </div>
      }
      <section class="hidden pt-24">
        <home-faq />
      </section>
    </div>
  `,
})
export class HomePage {
  private readonly apiService = inject(ApiService);
  private readonly range = signal<{ startDate: string; endDate?: string }>({ startDate: TODAY });
  readonly lines$ = this.apiService.getLines();

  readonly tripsResource = rxResource({
    params: () => this.range(),
    stream: ({ params: range }) => this.apiService.getTrips({ range }),
    defaultValue: [],
  });

  onFilterChange(filter: any) {
    this.range.set(filter);
  }
}
