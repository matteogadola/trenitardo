import { ChangeDetectionStrategy, Component, effect, input, signal } from '@angular/core';

import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts/core';
import { PieChart } from 'echarts/charts';
import { LegendComponent, TooltipComponent } from 'echarts/components';
import { ECharts, EChartsCoreOption } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { debounceTime, skipUntil, skipWhile, tap } from 'rxjs';

echarts.use([CanvasRenderer, PieChart, LegendComponent, TooltipComponent]);

@Component({
  selector: 'trip-status-chart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgxEchartsDirective],
  providers: [provideEchartsCore({ echarts })],
  template: `<div
    echarts
    [options]="options"
    (chartInit)="onChartInit($event)"
    class="chart"
    style="height: 200px;"
  ></div>`,
  styles: ``,
})
export class TripStatusChart {
  readonly data = input.required<{ value: number; name: string; itemStyle?: any }[]>();
  private readonly echartsInstance = signal<ECharts | undefined>(undefined);

  options: EChartsCoreOption = {
    tooltip: {
      show: false,
    },
    legend: {
      show: false,
    },
    series: [
      {
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          show: false,
          position: 'center',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 16,
            fontWeight: 'bold',
            formatter: '{c}\n{b}',
          },
        },
        labelLine: {
          show: false,
        },
        data: [],
        //  { value: 12, name: 'In orario' },
        //  { value: 13, name: 'In ritardo' },
        //  { value: 1, name: 'Soppressi' },
        //  { value: 4, name: 'Deviati' },
        //],
      },
    ],
  };

  mergeOption: EChartsCoreOption = this.options;

  onChartInit(ec: ECharts) {
    this.echartsInstance.set(ec);
  }

  constructor() {
    toObservable(this.data)
      .pipe(
        takeUntilDestroyed(),
        skipWhile((data) => data.reduce((a, v) => a + v.value, 0) === 0),
        debounceTime(100),
      )
      .subscribe((data) => {
        const options: EChartsCoreOption = {
          series: [
            {
              name: 'Access From',
              type: 'pie',
              radius: ['55%', '95%'],
              avoidLabelOverlap: false,
              itemStyle: {
                borderRadius: 10,
                borderColor: '#fff',
                borderWidth: 2,
              },
              label: {
                show: false,
                position: 'center',
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: 16,
                  fontWeight: 'bold',
                  formatter: '{c}\n{b}',
                },
              },
              labelLine: {
                show: false,
              },
              data,
            },
          ],
        };

        this.echartsInstance()?.setOption(options, {
          replaceMerge: ['series'],
        });
      });

    /*effect(() => {
      const data = this.data();

      console.log(data);

      const options: EChartsCoreOption = {
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: ['55%', '95%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2,
            },
            label: {
              show: false,
              position: 'center',
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 20,
                //fontWeight: 'bold',
                formatter: '{c}\n{b}',
              },
            },
            labelLine: {
              show: false,
            },
            data,
          },
        ],
      };

      this.mergeOption = { ...options };
      this.echartsInstance()?.setOption(options, {
        replaceMerge: ['series'],
      });
    });*/
  }
}
