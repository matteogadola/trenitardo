import {
  afterNextRender,
  Directive,
  ElementRef,
  input,
  OnDestroy,
  Renderer2,
  effect,
  signal,
} from '@angular/core';

export type AnimationType =
  | 'fade-in'
  | 'slide-up'
  | 'slide-down'
  | 'slide-left'
  | 'slide-right'
  | 'scale'
  | 'scale-up'
  | 'scale-down';

@Directive({
  selector: '[animate]',
  standalone: true,
  host: {
    '[class.animate-trigger]': 'true',
  },
})
export class AnimateDirective implements OnDestroy {
  animationType = input<AnimationType>('fade-in');
  animateDelay = input<string>('50ms');
  animateDuration = input<string>('0.8s');
  animateThreshold = input<number>(0.5);
  animateRepeat = input<boolean>(true);

  private observer: IntersectionObserver | null = null;
  private lastAnimationClass = '';

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
  ) {
    effect(() => {
      const element = this.el.nativeElement;

      // Applichiamo la durata personalizzata tramite variabile CSS
      this.renderer.setStyle(element, '--animate-duration', this.animateDuration());

      // Resto della logica per le classi (come prima)
      this.updateAnimationStyles();
    });

    afterNextRender(() => {
      this.setupObserver();
    });
  }

  private updateAnimationStyles(): void {
    const element = this.el.nativeElement;
    const currentType = this.animationType();

    // Rimuoviamo la vecchia classe se presente
    if (this.lastAnimationClass) {
      this.renderer.removeClass(element, this.lastAnimationClass);
    }

    // Aggiungiamo la nuova classe
    this.lastAnimationClass = `animate-${currentType}`;
    this.renderer.addClass(element, this.lastAnimationClass);

    // Applichiamo il delay
    this.renderer.setStyle(element, 'animation-delay', this.animateDelay());
  }

  private setupObserver(): void {
    // Se esiste già un observer (es. per cambi di soglia), lo scolleghiamo
    this.observer?.disconnect();

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.activateAnimation();
            if (!this.animateRepeat()) {
              this.observer?.unobserve(this.el.nativeElement);
            }
          } else if (this.animateRepeat()) {
            this.deactivateAnimation();
          }
        });
      },
      { threshold: this.animateThreshold() },
    );

    this.observer.observe(this.el.nativeElement);
  }

  private activateAnimation(): void {
    this.renderer.addClass(this.el.nativeElement, 'is-visible');
  }

  private deactivateAnimation(): void {
    this.renderer.removeClass(this.el.nativeElement, 'is-visible');
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }
}
