import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';

type ColorPreset = 'emerald' | 'ocean' | 'sunset' | 'purple' | 'rose';

interface PresetConfig {
  blob1: string;
  blob2: string;
  background: string;
  grid: string;
}

const COLOR_PRESETS: Record<ColorPreset, PresetConfig> = {
  emerald: {
    blob1: 'from-teal-300 to-lime-300',
    blob2: 'from-emerald-100 to-cyan-200',
    background: 'from-white via-slate-50 to-emerald-50',
    grid: 'rgba(16, 185, 129, 0.06)',
  },
  ocean: {
    blob1: 'from-blue-300 to-cyan-300',
    blob2: 'from-indigo-300 to-blue-400',
    background: 'from-white via-blue-50 to-cyan-50',
    grid: 'rgba(59, 130, 246, 0.06)',
  },
  sunset: {
    blob1: 'from-orange-300 to-pink-300',
    blob2: 'from-red-300 to-amber-300',
    background: 'from-white via-orange-50 to-pink-50',
    grid: 'rgba(249, 115, 22, 0.06)',
  },
  purple: {
    blob1: 'from-purple-300 to-fuchsia-300',
    blob2: 'from-violet-300 to-purple-400',
    background: 'from-white via-purple-50 to-fuchsia-50',
    grid: 'rgba(168, 85, 247, 0.06)',
  },
  rose: {
    blob1: 'from-rose-300 to-pink-300',
    blob2: 'from-red-300 to-rose-400',
    background: 'from-white via-rose-50 to-pink-50',
    grid: 'rgba(244, 63, 94, 0.06)',
  },
};

@Component({
  selector: 'app-animated-card',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div [class]="cardClasses()">
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div [class]="blob1Classes()" [style]="blob1Styles()"></div>

        <div [class]="blob2Classes()" [style]="blob2Styles()"></div>
      </div>

      <div class="absolute inset-0 pointer-events-none" [style]="gridStyles()"></div>

      <div class="relative z-10">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
      height: 100%;
    }

    .card-entrance {
      opacity: 1;
      height: 100%;
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

    @keyframes blob-motion-1 {
      0%,
      100% {
        transform: scale(1) rotate(0deg);
        opacity: 0.08;
      }
      50% {
        transform: scale(1.2) rotate(90deg);
        opacity: 0.15;
      }
    }

    .blob-anim-1 {
      opacity: 0.08;
      animation: blob-motion-1 20s linear infinite;
      will-change: transform, opacity;
    }

    @keyframes blob-motion-2 {
      0%,
      100% {
        transform: scale(1.2) rotate(90deg);
        opacity: 0.15;
      }
      50% {
        transform: scale(1) rotate(0deg);
        opacity: 0.08;
      }
    }

    .blob-anim-2 {
      opacity: 0.15;
      animation: blob-motion-2 15s linear infinite;
      will-change: transform, opacity;
    }

    .grid-pattern {
      opacity: 1;
      background-size: 50px 50px;
    }
  `,
})
export class AnimatedCard {
  preset = input<ColorPreset>('emerald');
  delay1 = input<number>(0);
  delay2 = input<number>(0);

  private config = computed(() => COLOR_PRESETS[this.preset()]);

  // Calcola posizioni base usando il delay come seed
  private blob2Position = computed(() => {
    const delay = this.delay2();
    // Usa il delay per calcolare offset di posizione
    // Variando tra -60% e -40% per top/bottom e left/right
    const topOffset = -50 + ((delay * 7) % 20) - 10; // range: -60% to -40%
    const leftOffset = -50 + ((delay * 11) % 20) - 10; // range: -60% to -40%
    const rotation = (delay * 37) % 360; // rotazione iniziale variabile

    return {
      top: `${topOffset}%`,
      left: `${leftOffset}%`,
      rotation: `${rotation}deg`,
    };
  });

  cardClasses = computed(
    () =>
      `card-entrance relative bg-gradient-to-br ${this.config().background} rounded-3xl shadow-[0_8px_32px_rgba(16,185,129,0.05),0_20px_60px_rgba(16,185,129,0.05)] border border-emerald-100/50 overflow-hidden max-w-5xl w-full p-8`,
  );

  blob1Classes = computed(
    () =>
      `blob-anim-1 absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br ${this.config().blob1} rounded-full`,
  );

  blob2Classes = computed(
    () =>
      `blob-anim-2 absolute w-full h-full bg-gradient-to-br ${this.config().blob2} rounded-full`,
  );

  blob1Styles = computed(() => ({
    'animation-delay': `${this.delay1()}s`,
  }));

  blob2Styles = computed(() => {
    const pos = this.blob2Position();
    return {
      'animation-delay': `${this.delay2()}s`,
      top: pos.top,
      left: pos.left,
      transform: `rotate(${pos.rotation})`,
    };
  });

  gridStyles = computed(() => {
    const gridColor = this.config().grid;
    return {
      'background-image': `linear-gradient(${gridColor} 1px, transparent 1px), linear-gradient(90deg, ${gridColor} 1px, transparent 1px)`,
      'background-size': '50px 50px',
    };
  });
}
