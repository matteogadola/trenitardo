import { CommonModule } from '@angular/common';
import { Component, computed, input, OnInit } from '@angular/core';
import { TimePipe } from '../../pipes/time-pipe';

type CardColor = 'gray' | 'purple' | 'blue' | 'pink';

// voglio quesdta animazione
// https://cyberalchimista.it/effetto-hover-card-prodotto-css/

@Component({
  selector: 'app-time-delay',
  imports: [TimePipe],
  template: `
    @if (scheduledTime() !== null && actualTime() !== null) {
      <span>{{ actualTime() | time }}</span>

      <!--p-tag value="+20 minuti" /-->
      @if (delay() > 20) {
        <span class="bg-red-700 inline-flex items-center px-3 py-1 rounded-full text-xs"
          >+{{ delay() }} min</span
        >
      } @else if (delay() > 10) {
        <span class="bg-red-300 inline-flex items-center px-3 py-1 rounded-full text-xs"
          >+{{ delay() }} min</span
        >
      } @else if (delay() > 0) {
        <span class="bg-yellow-100 inline-flex items-center px-3 py-1 rounded-full text-xs"
          >+{{ delay() }} min</span
        >
      } @else if (delay() < -15) {
        <span class="bg-yellow-100 inline-flex items-center px-3 py-1 rounded-full text-xs"
          >-{{ delay() }} min</span
        >
      } @else if (delay() < -30) {
        <span class="bg-red-700 inline-flex items-center px-3 py-1 rounded-full text-xs"
          >-{{ delay() }} min</span
        >
      }
    } @else if (scheduledTime() !== null || actualTime() !== null) {
      <span>{{ actualTime() ?? scheduledTime() | time }}</span>
    } @else {
      <span>-</span>
    }
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
export class TimeDelay {
  scheduledTime = input.required<number | null>();
  actualTime = input.required<number | null>();
  delay = input<number>(0);

  //delay = computed(() => this.actualTime()! - this.scheduledTime()!);
}
