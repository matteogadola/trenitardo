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
import { ChartModule } from 'primeng/chart';
import { AnimatedCard } from '@app/shared/components/card/animated-card';
import { MathCeilPipe } from '../../shared/pipes/math-pipe';

@Component({
  selector: 'home-stats',
  imports: [ChartModule, AnimatedCard, MathCeilPipe],
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
      <app-animated-card [delay2]="2">
        <div class="flex flex-col gap-4">
          <div class="flex justify-between">
            <div>
              @if (totalDelay() > 0) {
                <h3 class="text-slate-600 uppercase">Ritardo totale</h3>
                <p class="text-3xl text-slate-800">{{ totalDelay() }} minuti</p>
              }
            </div>
            <div>
              @if (avgDelay() > 0) {
                <h3 class="text-slate-600 uppercase">Ritardo medio</h3>
                <p class="text-3xl text-slate-800">{{ avgDelay() | ceil }} minuti</p>
              }
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
              @if (medianDelay() > 0) {
                <h3 class="text-slate-600 uppercase">Ritardo mediano</h3>
                <p class="text-3xl text-slate-800">{{ medianDelay() }} minuti</p>
              }
            </div>
          </div>
        </div>
      </app-animated-card>
    </div>
  `,
  styles: `
    .stats-grid {
      display: grid;
      gap: 2rem;
      grid-template-columns: repeat(1, minmax(0, 1fr));

      @media (width >= 64rem /* 1024px */) {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }
  `,
})
export class HomeStats {
  readonly trips = input<Trip[]>([]);
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
