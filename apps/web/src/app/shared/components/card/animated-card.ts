import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'app-animated-card',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div
      class="card-entrance relative bg-linear-to-br from-white via-slate-50 to-emerald-50 rounded-3xl shadow-[0_8px_32px_rgba(16,185,129,0.05),0_20px_60px_rgba(16,185,129,0.05)] border border-emerald-100/50 overflow-hidden max-w-5xl w-full p-8"
    >
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          class="blob-anim-1 absolute -top-1/2 -right-1/2 w-full h-full bg-linear-to-br from-teal-300 to-lime-300 rounded-full"
        ></div>

        <div
          class="blob-anim-2 absolute -bottom-1/2 -left-1/2 w-full h-full bg-linear-to-br from-emerald-300 to-cyan-300 rounded-full"
        ></div>
      </div>

      <div class="grid-pattern-light absolute inset-0 pointer-events-none"></div>

      <div class="relative z-10">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: `
    /* 1. ENTRANCE ANIMATION (Unchanged logic)
    */
    .card-entrance {
      opacity: 1;
      transform: translateY(0) scale(1);
      transition:
        opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1),
        transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
    }

    @starting-style {
      .card-entrance {
        opacity: 0;
        transform: translateY(30px) scale(0.95);
      }
    }

    /* 2. LOOPING BACKGROUND ANIMATIONS
      Changes: Increased opacity slightly.
      On dark mode, opacity varied between 0.03 and 0.06.
      On light mode, we need a bit more presence: let's try 0.08 to 0.15.
    */

    @keyframes blob-motion-1-light {
      0%,
      100% {
        transform: scale(1) rotate(0deg);
        opacity: 0.08; /* Slightly increased from 0.03 */
      }
      50% {
        transform: scale(1.2) rotate(90deg);
        opacity: 0.15; /* Slightly increased from 0.06 */
      }
    }

    .blob-anim-1 {
      opacity: 0.08;
      transform: scale(1) rotate(0deg);
      animation: blob-motion-1-light 20s linear infinite;
      will-change: transform, opacity;
    }

    @keyframes blob-motion-2-light {
      0%,
      100% {
        transform: scale(1.2) rotate(90deg);
        opacity: 0.15; /* Slightly increased from 0.06 */
      }
      50% {
        transform: scale(1) rotate(0deg);
        opacity: 0.08; /* Slightly increased from 0.03 */
      }
    }

    .blob-anim-2 {
      opacity: 0.15;
      transform: scale(1.2) rotate(90deg);
      animation: blob-motion-2-light 15s linear infinite;
      will-change: transform, opacity;
    }

    /* 3. GRID PATTERN
      Change: The lines must be dark (or colored) to show on white.
      Using a very subtle emerald green rgba.
    */
    .grid-pattern-light {
      opacity: 1; /* Controlled by the rgba below instead of main opacity */
      /* Using rgba(16, 185, 129, 0.06) which is Tailwind emerald-500 at low opacity */
      background-image:
        linear-gradient(rgba(16, 185, 129, 0.06) 1px, transparent 1px),
        linear-gradient(90deg, rgba(16, 185, 129, 0.06) 1px, transparent 1px);
      background-size: 50px 50px;
    }
  `,
})
export class AnimatedCard {
  /**
   * Palette via Signal:
   * [0] -> Colore Blob 1
   * [1] -> Colore Blob 2
   * [2] -> Colore Sfondo Card
   */
  colors = input<string[]>(['#f472b6', '#fb923c', '#0f172a']);

  // Generiamo le variabili CSS dinamicamente
  paletteStyles = computed(() => {
    const c = this.colors();
    return {
      '--p-1': c[0] ?? '#f472b6',
      '--p-2': c[1] ?? '#fb923c',
      '--p-3': c[2] ?? '#0f172a',
    };
  });
}
