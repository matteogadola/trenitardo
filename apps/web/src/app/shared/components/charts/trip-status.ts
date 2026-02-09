import { ChangeDetectionStrategy, Component, effect, input, signal } from '@angular/core';

import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts/core';
import { PieChart } from 'echarts/charts';
import { GraphicComponent, LegendComponent, TooltipComponent } from 'echarts/components';
import { ECharts, EChartsCoreOption } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { combineLatest, filter } from 'rxjs';

echarts.use([CanvasRenderer, PieChart, LegendComponent, GraphicComponent]);

type Data = {
  total: number;
  data: { value: number; name: string; itemStyle?: any }[];
};

@Component({
  selector: 'trip-status-chart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgxEchartsDirective],
  providers: [provideEchartsCore({ echarts })],
  template: `<div
    echarts
    [options]="options"
    (chartInit)="onChartInit($event)"
    (chartMouseOver)="onChartMouseOver($event)"
    (chartMouseOut)="onChartMouseOut()"
    class="chart"
    style="height: 200px;"
  ></div>`,
  styles: ``,
})
export class TripStatusChart {
  readonly data = input.required<Data>();
  private readonly echartsInstance = signal<ECharts | undefined>(undefined);

  options: EChartsCoreOption = {
    legend: {
      show: false,
    },
    series: [],
    graphic: [],
  };

  mergeOption: EChartsCoreOption = this.options;

  onChartInit(ec: ECharts) {
    this.echartsInstance.set(ec);
  }

  onChartMouseOver(event: any) {
    if (event.componentType === 'series') {
      const name = event.name;
      const value = event.value;

      this.updateCenterText(`${value}\n${name}`);
    }
  }

  // Funzione che gestisce l'uscita del mouse dallo spicchio
  onChartMouseOut() {
    this.updateCenterText(`${this.data().total}\nTreni`);
  }

  // Metodo di supporto per aggiornare solo il testo centrale
  private updateCenterText(newText: string) {
    if (this.echartsInstance) {
      this.echartsInstance()?.setOption({
        graphic: [
          {
            style: {
              text: newText,
              // Ripetiamo l'allineamento qui per evitare che si resetti
              textAlign: 'center',
              textVerticalAlign: 'middle',
            },
          },
        ],
      });
    }
  }

  constructor() {
    // Uso combineLatest per aspettare che sia i dati che l'istanza ECharts siano pronti
    combineLatest([toObservable(this.data), toObservable(this.echartsInstance)])
      .pipe(
        takeUntilDestroyed(),
        // Filtra: i dati devono avere total > 0 e echartsInstance deve essere definito
        filter(([data, instance]) => data.total !== 0 && instance !== undefined),
      )
      .subscribe(([data, instance]) => {
        const options: EChartsCoreOption = {
          series: [
            {
              name: 'Access From',
              type: 'pie',
              radius: ['55%', '95%'],
              avoidLabelOverlap: false,
              emphasis: {
                label: { show: false },
              },
              label: {
                show: false,
                position: 'center',
              },
              labelLine: {
                show: false,
              },
              data: data.data,
            },
          ],
          graphic: [
            {
              type: 'text',
              silent: true,
              left: 'center',
              top: 'center',
              style: {
                text: `${data.total}\nTreni`,
                textAlign: 'center',
                textVerticalAlign: 'middle',
                fill: '#333', // Colore del testo
                fontSize: 20,
                fontWeight: 'bold',
              },
            },
          ],
        };

        instance!.setOption(options, {
          replaceMerge: ['series', 'graphic'],
        });
      });
  }
}
