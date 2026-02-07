import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { Trip } from '@repo/types';
import { AnimatedCard } from '@app/shared/components/card/animated-card';
import { MathCeilPipe } from '../../shared/pipes/math-pipe';
import { AnimateDirective } from '@app/shared/animations/animate-directive';
import { TripStatusChart } from '@app/shared/components/charts/trip-status';
import { debounceTime } from 'rxjs';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'home-stats',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AnimatedCard, MathCeilPipe, AnimateDirective, TripStatusChart],
  template: `
    <div class="stats-grid">
      <app-animated-card animate [animateRepeat]="false">
        <h2 class="sr-only">Statistiche Generali</h2>
        @if (trips().length > 0) {
          <div class="flex justify-between">
            <div class="flex flex-col gap-4">
              @if (delayedTrips().length > 0) {
                <div>
                  <h3 class="text-slate-600 uppercase">In ritardo</h3>
                  <p class="text-3xl text-slate-800">{{ delayedTrips().length }}</p>
                </div>
              }
              @if (cancelledTrips().length > 0) {
                @let text = cancelledTrips().length === 1 ? 'cancellato' : 'cancellati';
                <div>
                  <h3 class="text-slate-600 uppercase">{{ text }}</h3>
                  <p class="text-3xl text-slate-800">{{ cancelledTrips().length }}</p>
                </div>
              }
              @if (modifiedTrips().length > 0) {
                @let text = modifiedTrips().length === 1 ? 'deviato' : 'deviati';
                <div>
                  <h3 class="text-slate-600 uppercase">{{ text }}</h3>
                  <p class="text-3xl text-slate-800">{{ modifiedTrips().length }}</p>
                </div>
              }
            </div>
            <div class="w-1/2 h-full" [class.w-full]="trips().length === onTimeTrips().length">
              <trip-status-chart [data]="statusChartData()" style="height: 200px;" />
            </div>
          </div>
        } @else {
          <h3 class="text-slate-600 uppercase">Nessuna corsa trovata</h3>
        }
      </app-animated-card>
      @if (trips().length > 0) {
        <app-animated-card
          [delay2]="2"
          animate
          animationType="slide-left"
          animateDelay="400ms"
          [animateRepeat]="false"
        >
          <div class="flex flex-col gap-4">
            <div class="flex justify-between">
              <div class="min-h-[52px]">
                @if (totalDelay() > 0) {
                  <h3 class="text-slate-600 uppercase">Ritardo totale</h3>
                  <p class="text-3xl text-slate-800">{{ totalDelay() }} minuti</p>
                }
              </div>
              <div class="min-h-[52px]">
                @if (avgDelay() > 0) {
                  <h3 class="text-slate-600 uppercase">Ritardo medio</h3>
                  <p class="text-3xl text-slate-800">{{ avgDelay() | ceil }} minuti</p>
                }
              </div>
            </div>
            <div class="flex justify-between">
              <div class="min-h-[52px]">
                @if (trips().length > 0) {
                  <h3 class="text-slate-600 uppercase">Treni in orario</h3>
                  <p class="text-3xl text-slate-800">
                    {{ ((onTimeTrips().length / trips().length) * 100).toFixed(0) }}%
                  </p>
                }
              </div>
              <div class="min-h-[52px]">
                @if (medianDelay() > 0) {
                  <h3 class="text-slate-600 uppercase">Ritardo mediano</h3>
                  <p class="text-3xl text-slate-800">{{ medianDelay() }} minuti</p>
                }
              </div>
            </div>
          </div>
        </app-animated-card>
      }
    </div>
  `,
  styles: `
    .stats-grid {
      display: grid;
      gap: 1rem;
      grid-template-columns: repeat(1, minmax(0, 1fr));

      @media (width >= 64rem) {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 2rem;
      }
    }
  `,
})
export class HomeStats {
  readonly trips = input<Trip[]>([]);
  readonly isLoading = input<boolean>(false);
  readonly onTimeTrips = computed(() => this.trips().filter((t) => t.status === 'on-time'));
  readonly delayedTrips = computed(() => this.trips().filter((t) => t.status === 'delayed'));
  readonly realDelayedTrips = computed(() => this.trips().filter((t) => t.delay > 0));
  readonly cancelledTrips = computed(() => this.trips().filter((t) => t.status === 'cancelled'));
  readonly modifiedTrips = computed(() =>
    this.trips().filter((t) => t.status === 'partially-cancelled'),
  );

  readonly totalDelay = computed(() => this.realDelayedTrips().reduce((a, v) => a + v.delay, 0));
  readonly avgDelay = computed(() => this.totalDelay() / this.realDelayedTrips().length);
  readonly medianDelay = computed(() => {
    const delays = this.realDelayedTrips().map((trip) => trip.delay);
    delays.sort((a, b) => a - b);
    const mid = Math.floor(delays.length / 2);
    return delays.length % 2 === 0 ? (delays[mid - 1] + delays[mid]) / 2 : delays[mid];
  });

  readonly statusChartData = computed(() => {
    return {
      total: this.trips().length,
      data: [
        { value: this.onTimeTrips().length, name: 'In orario', itemStyle: { color: '#6BCF8B' } },
        { value: this.delayedTrips().length, name: 'In ritardo', itemStyle: { color: '#FF6B7A' } },
        {
          value: this.cancelledTrips().length,
          name: 'Cancellati',
          itemStyle: { color: '#353831' },
        },
        { value: this.modifiedTrips().length, name: 'Deviati', itemStyle: { color: '#FFAB6B' } },
      ],
    };
  });
}
