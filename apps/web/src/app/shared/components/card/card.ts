import { CommonModule } from '@angular/common';
import { Component, input, OnInit } from '@angular/core';

type CardColor = 'gray' | 'purple' | 'blue' | 'pink';

// voglio quesdta animazione
// https://cyberalchimista.it/effetto-hover-card-prodotto-css/

@Component({
  selector: 'app-card',
  imports: [CommonModule],
  template: `
    <div
      animate.enter="fade-in"
      animate.leave="fade-out"
      class="relative overflow-hidden rounded-2xl border backdrop-blur-sm shadow-lg bg-linear-to-br"
      [ngClass]="colors[color()].border + ' ' + colors[color()].bg"
    >
      <div class="p-6">
        <ng-content />
      </div>

      <!-- Decorazione overflow -->
      <div class="absolute -bottom-2 -right-2 w-32 h-32 bg-white/40 rounded-full blur-2xl"></div>
    </div>
  `,
  styles: `
    /* Fade In */
    .fade-in {
      opacity: 0;
      transform: translateY(10px);
      transition:
        opacity 0.4s ease,
        transform 0.4s ease;
    }

    /* Final state applied immediately */
    div {
      opacity: 1;
      transform: translateY(0);
    }

    /* Fade Out */
    .fade-out {
      opacity: 1;
      transform: translateY(0);
      transition:
        opacity 0.4s ease,
        transform 0.4s ease;
    }

    .fade-out.leave-active {
      opacity: 0;
      transform: translateY(-10px);
    }
  `,
})
export class Card implements OnInit {
  color = input<CardColor>('gray');
  icon = input<any>();

  title = input.required<string>();
  value = input.required<string>();
  trend = input.required<string>();

  data = input.required<number[]>();

  isPositive = false;
  chartData: { value: number; index: number }[] = [];

  currentState: 'normal' | 'hover' = 'normal';

  ngOnInit() {
    this.isPositive = this.trend().startsWith('+');
    this.chartData = this.data().map((value, index) => ({ value, index }));
  }

  colors = {
    purple: {
      bg: 'from-purple-50 to-purple-100',
      border: 'border-purple-200',
      icon: 'text-purple-600',
      chart: '#a78bfa',
      bgIcon: 'bg-purple-100',
    },
    blue: {
      bg: 'from-blue-50 to-blue-100',
      border: 'border-blue-200',
      icon: 'text-blue-600',
      chart: '#60a5fa',
      bgIcon: 'bg-blue-100',
    },
    pink: {
      bg: 'from-pink-50 to-pink-100',
      border: 'border-pink-200',
      icon: 'text-pink-600',
      chart: '#f472b6',
      bgIcon: 'bg-pink-100',
    },
    gray: {
      bg: 'from-pink-50 to-pink-100',
      border: 'border-pink-200',
      icon: 'text-pink-600',
      chart: '#f472b6',
      bgIcon: 'bg-pink-100',
    },
  };
}
