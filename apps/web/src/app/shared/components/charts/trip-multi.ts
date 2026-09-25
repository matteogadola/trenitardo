import { ChangeDetectionStrategy, Component, computed, effect, input, signal } from '@angular/core';

import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts/core';
import { BarChart } from 'echarts/charts';
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components';
import { ECharts, EChartsCoreOption } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { debounceTime, filter, skipUntil, skipWhile, tap } from 'rxjs';
import { Trip } from '@repo/types';

echarts.use([CanvasRenderer, BarChart, LegendComponent, GridComponent, TooltipComponent]);

type Data = {
  total: number;
  data: { value: number; name: string; itemStyle?: any }[];
};

interface TripStatusCount {
  onTime: number;
  delayed: number;
  rerouted: number;
  cancelled: number;
}

@Component({
  selector: 'trip-multi-chart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgxEchartsDirective],
  providers: [provideEchartsCore({ echarts })],
  template: `<div
    echarts
    [options]="options"
    (chartInit)="onChartInit($event)"
    class="chart"
    style="height: 400px;"
  ></div>`,
  styles: ``,
})
export class TripMultiChart {
  //readonly data = input.required<Data>();
  readonly trips = input.required<Trip[]>();
  private readonly echartsInstance = signal<ECharts | undefined>(undefined);

  private readonly tripsGrouped = computed(() => {
    const result: Record<string, TripStatusCount> = {};

    for (const trip of this.trips()) {
      if (!result[trip.date]) {
        result[trip.date] = { onTime: 0, delayed: 0, rerouted: 0, cancelled: 0 };
      }

      switch (trip.status) {
        case 'on-time':
          result[trip.date].onTime++;
          break;
        case 'delayed':
          result[trip.date].delayed++;
          break;
        case 'partially-cancelled':
          result[trip.date].rerouted++;
          break;
        case 'cancelled':
          result[trip.date].cancelled++;
          break;
      }
    }

    return result;
  });

  options: EChartsCoreOption = {
    legend: {
      show: true,
    },
    xAxis: {
      type: 'category',
      data: [],
    },
    yAxis: {
      type: 'value',
    },
    series: [],
  };

  mergeOption: EChartsCoreOption = this.options;

  onChartInit(ec: ECharts) {
    this.echartsInstance.set(ec);
  }

  constructor() {
    toObservable(this.tripsGrouped)
      .pipe(
        takeUntilDestroyed(),
        //debounceTime(100),
        //filter((data) => Object.keys(data).length !== 0),
      )
      .subscribe((data) => {
        console.log('NUOVO CHART', data);
        const dates = Object.keys(data).sort();

        const onTimeData = dates.map((date) => data[date]['onTime']);
        const delayedData = dates.map((date) => data[date]['delayed']);
        const cancelledData = dates.map((date) => data[date]['cancelled']);
        const divertedData = dates.map((date) => data[date]['rerouted']);

        const options: EChartsCoreOption = {
          tooltip: {
            trigger: 'item',
            formatter: '{b}<br/>{a}: {c}',
          },
          xAxis: {
            type: 'category',
            data: Object.keys(data)
              .sort()
              .map((date) => date.split('-').reverse().join('/')),
          },
          series: [
            {
              name: 'In orario',
              type: 'bar',
              stack: 'total',
              emphasis: {
                focus: 'series',
              },
              data: onTimeData,
              itemStyle: {
                color: '#6BCF8B',
              },
            },
            {
              name: 'Deviati',
              type: 'bar',
              stack: 'total',
              emphasis: {
                focus: 'series',
              },
              data: divertedData,
              itemStyle: {
                color: '#FFAB6B',
              },
            },
            {
              name: 'In ritardo',
              type: 'bar',
              stack: 'total',
              emphasis: {
                focus: 'series',
              },
              data: delayedData,
              itemStyle: {
                color: '#FF6B7A',
              },
            },
            {
              name: 'Soppressi',
              type: 'bar',
              stack: 'total',
              emphasis: {
                focus: 'series',
              },
              data: cancelledData,
              itemStyle: {
                color: '#353831',
              },
            },
          ],
        };

        this.echartsInstance()?.setOption(options, {
          replaceMerge: ['series', 'xAxis'],
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
