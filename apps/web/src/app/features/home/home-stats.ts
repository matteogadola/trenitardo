import {
  afterNextRender,
  Component,
  computed,
  inject,
  input,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { Trip } from '@repo/types';
import { Card } from '@app/shared/components/card/card';
import { ChartModule } from 'primeng/chart';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'home-stats',
  imports: [Card, ChartModule],
  template: `
    <div class="stats-grid">
      <app-card
        title="Treni Monitorati"
        value="{{ trips().length }}"
        trend="+5.2%"
        icon="Clock"
        color="blue"
        [data]="[12, 19, 23, 18, 28, 20, 23]"
      >
        <div class="flex justify-between">
          <div>
            <h3 class="text-sm font-medium text-slate-600 mb-1">Treni</h3>
            <p class="text-3xl font-bold text-slate-800 mb-6">{{ trips().length }}</p>
            dui cui {{ delayedTrips().length }} in ritardo
            @if (cancelledTrips().length > 0) {
              @let text = cancelledTrips().length === 1 ? 'cancellato' : 'cancellati';
              <p>e {{ cancelledTrips().length }} {{ text }}</p>
            }
          </div>
          <div class="w-1/2 flex justify-center items-center">
            <p-chart type="pie" [data]="statusData()" [options]="options" class="w-30" />
          </div>
        </div>
      </app-card>
      <app-card
        title="Ritardo"
        value="1,247"
        trend="+12.3%"
        icon="Clock"
        color="purple"
        [data]="[800, 950, 1100, 980, 1200, 1150, 1247]"
      >
        <div class="flex justify-between">
          <div>
            <h3 class="text-sm font-medium text-slate-600 mb-1">Ritardo totale</h3>
            <p class="text-3xl font-bold text-slate-800 mb-6">{{ totalDelay() }} min</p>
          </div>
          <div class="w-1/2 flex justify-center items-center">
            <p-chart type="pie" [data]="data" [options]="options" class="w-30" />
          </div>
        </div>
      </app-card>
      <app-card
        title="Ritardo Mediano"
        value="23.5 min"
        trend="+5.2%"
        icon="Clock"
        color="purple"
        [data]="[12, 19, 23, 18, 28, 20, 23]"
      >
        <h3 class="text-sm font-medium text-slate-600 mb-1">Treni Monitorati</h3>
        <p class="text-3xl font-bold text-slate-800 mb-6">{{ trips().length }}</p>
        dui cui {{ delayedTrips().length }} in ritardo
      </app-card>
    </div>
  `,
  styles: `
    .stats-grid {
      display: grid;
      gap: 1rem;
      grid-template-columns: repeat(1, minmax(0, 1fr));

      @media (width >= 64rem /* 1024px */) {
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }
    }
  `,
})
export class HomeStats {
  readonly trips = input<Trip[]>([]);

  readonly onTimeTrips = computed(() => this.trips().filter((trip) => trip.status === 'on-time'));
  readonly delayedTrips = computed(() => this.trips().filter((trip) => trip.status === 'delayed'));
  readonly cancelledTrips = computed(() =>
    this.trips().filter((trip) => trip.status === 'cancelled'),
  );
  readonly totalDelay = computed(() => this.delayedTrips().reduce((a, v) => a + (v.delay ?? 0), 0));

  statusData = computed(() => {
    return {
      labels: ['In orario', 'In ritardo', 'Soppressi'],
      datasets: [
        {
          data: [
            this.onTimeTrips().length,
            this.delayedTrips().length,
            this.cancelledTrips().length,
          ],
          backgroundColor: ['#C8D96F', '#DC602E', '#353831'],
          hoverOffset: 4,
        },
      ],
    };
  });
  data = [];
  options = {
    cutout: '40%',
    borderWidth: 0,
    plugins: {
      legend: {
        display: false,
      },
    },
  };
}
