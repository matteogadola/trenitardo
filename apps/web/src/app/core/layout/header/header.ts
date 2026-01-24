import { Component, inject, signal, DestroyRef, afterNextRender } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { AvatarModule } from 'primeng/avatar';
import { RouterModule } from '@angular/router';
import { ScrollDispatcher } from '@angular/cdk/scrolling';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Logo } from '../logo';

@Component({
  selector: 'app-header',
  imports: [MenubarModule, AvatarModule, RouterModule, Logo],
  template: `
    <header [style.--header-blur.px]="currentBlur()" [style.--header-opacity]="currentOpacity()">
      <div class="container mx-auto h-[80px] flex items-center px-6 w-full">
        <div class="flex items-center justify-between w-full">
          <span class=""></span>
          <app-logo [scaleIcon]="isScrolled()" />
          <span class=""></span>
        </div>
      </div>

      <!--span class="text-7xl font-semibold font-anton">TRENI</span>
        <a routerLink="/" aria-label="Vai alla Home Page" class="mx-auto">
          <img ngSrc="/images/logo-256.webp" width="72" height="72" alt="Trenitardo Logo" priority />
        </a>
        <span class="text-7xl font-semibold font-anton">TARDO</span-->

      <!--nav aria-label="Navigazione principale">
          <ul class="flex gap-6">
            @for (item of items; track $index) {
              <li>
                <a [routerLink]="item.label"
                  routerLinkActive="text-blue-600 font-semibold"
                  [routerLinkActiveOptions]="{ exact: true }"
                  class="text-gray-600 hover:text-blue-600 transition-colors">
                  {{ item.label }}
                </a>
              </li>
            }
          </ul>
        </nav-->
    </header>
  `,
  styles: `
    :host {
      display: block;
    }

    header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      padding: 1rem 2rem;
      width: 100%;

      /* Valori di default (per quando siamo sul server o inizio pagina) */
      background-color: rgba(255, 255, 255, var(--header-opacity, 0));
      backdrop-filter: blur(var(--header-blur, 0px));
      -webkit-backdrop-filter: blur(var(--header-blur, 0px));
      border-bottom: 1px solid rgba(0, 0, 0, calc(var(--header-opacity, 0) * 0.1));

      transition: all 0.1s linear;
    }

    .nav-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      max-width: 1200px;
      margin: 0 auto;
    }

    .logo {
      font-weight: bold;
      font-size: 1.5rem;
      color: #333;
    }
    .links a {
      margin-left: 20px;
      text-decoration: none;
      color: #333;
      font-weight: 500;
    }
  `,
})
export class Header {
  private scrollDispatcher = inject(ScrollDispatcher);
  private destroyRef = inject(DestroyRef);

  private readonly MAX_SCROLL_PX = 50; // Dopo 300px l'effetto è al massimo
  private readonly MAX_BLUR_PX = 12; // Blur massimo richiesto
  private readonly MAX_OPACITY = 0.7; // Opacità massima sfondo (0.7 = 70%)
  private readonly MAX_SCALE = 1;

  currentBlur = signal<number>(0);
  currentOpacity = signal<number>(0);
  currentScale = signal<number>(0);

  isScrolled = signal<boolean>(false);

  constructor() {
    afterNextRender(() => {
      this.scrollDispatcher
        .scrolled()
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => {
          this.calculateStyles();
        });

      // Lanciamo un calcolo iniziale nel caso l'utente aggiorni la pagina già scrollata
      this.calculateStyles();
    });
  }

  private calculateStyles(): void {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;

    // Calcoliamo una percentuale di completamento da 0 a 1
    // Clampiamo il valore tra 0 e 1 usando Math.min e Math.max
    let progress = Math.min(scrollTop / this.MAX_SCROLL_PX, 1);
    progress = Math.max(progress, 0);

    // Calcoliamo i valori precisi
    const blur = progress * this.MAX_BLUR_PX;
    const opacity = progress * this.MAX_OPACITY;
    const scale = progress * this.MAX_SCALE;

    // Aggiorniamo i signal solo se i valori sono cambiati significativamente
    // (toFixed aiuta a evitare aggiornamenti per micro-variazioni decimali)
    if (this.currentBlur().toFixed(1) !== blur.toFixed(1)) {
      this.currentBlur.set(blur);
      this.currentOpacity.set(opacity);
      this.currentScale.set(scale);
    }
  }
}
