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
import { AnimatedCard } from '@app/shared/components/card/animated-card';
import { MathCeilPipe } from '../../shared/pipes/math-pipe';

@Component({
  selector: 'home-stats',
  imports: [Card, ChartModule, AnimatedCard, MathCeilPipe],
  template: `
    <div class="stats-grid">
      <app-animated-card>
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
          <p-chart
            type="pie"
            [data]="statusData()"
            [options]="options()"
            [plugins]="chartPlugins"
            class="w-50"
          />
        </div>
      </app-animated-card>
      <app-animated-card>
        <div class="flex flex-col gap-4">
          <div class="flex justify-between">
            <div>
              <h3 class="text-slate-600 uppercase">Ritardo totale</h3>
              <p class="text-3xl text-slate-800">{{ totalDelay() }} minuti</p>
            </div>
            <div>
              <h3 class="text-slate-600 uppercase">Ritardo medio</h3>
              <p class="text-3xl text-slate-800">
                {{ totalDelay() / trips().length | ceil }} minuti
              </p>
            </div>
          </div>
          <div class="flex justify-between">
            <div>
              <h3 class="text-slate-600 uppercase">Treni in orario</h3>
              <p class="text-3xl text-slate-800">
                {{ ((onTimeTrips().length / trips().length) * 100).toFixed(0) }}%
              </p>
            </div>
            <div>
              <h3 class="text-slate-600 uppercase">Ritardo mediano</h3>
              <p class="text-3xl text-slate-800">{{ medianDelay() }} minuti</p>
            </div>
          </div>
        </div>
      </app-animated-card>
      <!--app-card
        title="Treni Monitorati"
        value="{{ trips().length }}"
        trend="+5.2%"
        icon="Clock"
        color="blue"
        [data]="[12, 19, 23, 18, 28, 20, 23]"
      >
        <div class="flex justify-between">
          <div>
            <h3 class="text-sm font-semibold text-slate-600 mb-1">Treni</h3>
            <p class="text-3xl font-bold text-slate-800 mb-6">{{ trips().length }}</p>
            dui cui {{ delayedTrips().length }} in ritardo
            @if (delayedTrips().length > 0) {
              @let text = 'in ritardo';
              <p>e {{ delayedTrips().length }} {{ text }}</p>
            }
            @if (cancelledTrips().length > 0) {
              @let text = cancelledTrips().length === 1 ? 'cancellato' : 'cancellati';
              <p>e {{ cancelledTrips().length }} {{ text }}</p>
            }
            @if (modifiedTrips().length > 0) {
              @let text = modifiedTrips().length === 1 ? 'deviato' : 'deviati';
              <p>e {{ modifiedTrips().length }} {{ text }}</p>
            }
          </div>
          <div class="w-1/2 flex justify-center items-center">
            <p-chart
              type="pie"
              [data]="statusData()"
              [options]="options()"
              [plugins]="chartPlugins"
              class="w-35"
            />
          </div>
        </div>
      </app-card-->
    </div>
  `,
  styles: `
    .stats-grid {
      display: grid;
      gap: 1rem;
      grid-template-columns: repeat(1, minmax(0, 1fr));

      @media (width >= 64rem /* 1024px */) {
        grid-template-columns: repeat(2, minmax(0, 1fr));
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
  readonly modifiedTrips = computed(() =>
    this.trips().filter((trip) => trip.status === 'partially-cancelled'),
  );
  readonly totalDelay = computed(() => this.delayedTrips().reduce((a, v) => a + (v.delay ?? 0), 0));
  readonly medianDelay = computed(() => {
    const delays = this.delayedTrips()
      .filter((trip) => trip.delay)
      .map((trip) => trip.delay);
    delays.sort((a, b) => a - b);
    const mid = Math.floor(delays.length / 2);
    return delays.length % 2 === 0 ? (delays[mid - 1] + delays[mid]) / 2 : delays[mid];
  });

  data = [];
  statusData = computed(() => {
    return {
      labels: ['In orario', 'In ritardo', 'Soppressi'],
      datasets: [
        {
          data: [
            this.onTimeTrips().length,
            this.delayedTrips().length,
            this.cancelledTrips().length,
            this.modifiedTrips().length,
          ],
          backgroundColor: ['#6BCF8B', '#FF6B7A', '#353831', '#FFAB6B'],
          hoverOffset: 4,
          responsive: true,
        },
      ],
    };
  });
  options = computed(() => {
    return {
      cutout: '60%',
      borderWidth: 1,
      plugins: {
        legend: {
          display: false,
        },
        nTrips: { value: this.trips().length.toString() },
      },
    };
  });

  chartPlugins = [
    {
      id: 'centerText',
      afterDraw: (chart: any) => {
        const {
          ctx,
          chartArea: { left, top, width, height },
        } = chart;
        ctx.save();

        const centerX = left + width / 2;
        const centerY = top + height / 2;

        const text = chart.config.options.plugins.nTrips.value;
        const line1 = {
          text: text,
          fontSize: (height / 50).toFixed(2),
          color: '#000000',
          fontWeight: '600',
        };

        const line2 = {
          text: 'TRENI',
          fontSize: (height / 150).toFixed(2),
          color: '#000000',
          fontWeight: '',
        };

        // --- DISEGNO PRIMA RIGA (Superiore) ---
        ctx.font = `${line1.fontWeight} ${line1.fontSize}em sans-serif`;
        ctx.fillStyle = line1.color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom'; // Si appoggia sulla linea centrale
        ctx.fillText(line1.text, centerX, centerY + 12);

        // --- DISEGNO SECONDA RIGA (Inferiore) ---
        ctx.font = `${line2.fontWeight} ${line2.fontSize}em sans-serif`;
        ctx.fillStyle = line2.color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top'; // Parte dalla linea centrale verso il basso
        ctx.fillText(line2.text, centerX, centerY + 12);

        ctx.restore();
      },
    },
  ];
}
