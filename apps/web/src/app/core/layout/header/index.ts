import {
  Component,
  OnInit,
  inject,
  signal,
  DestroyRef,
  PLATFORM_ID,
  afterNextRender,
} from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { AvatarModule } from 'primeng/avatar';
import { isPlatformBrowser, NgOptimizedImage } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderLogo } from './header-logo';

import { ScrollDispatcher } from '@angular/cdk/scrolling';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

// container px-4 h-16
@Component({
  selector: 'app-header',
  imports: [MenubarModule, AvatarModule, NgOptimizedImage, RouterModule, HeaderLogo],
  template: `
    <!--header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'py-3 bg-background/80 backdrop-blur-lg border-b border-border/50'
          : 'py-6 bg-transparent'
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10">
              <Train className="w-5 h-5 text-primary" />
            </div>
            <span className="text-lg font-display font-bold text-foreground">
              TrainDelay.it
            </span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#statistics"
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Esplora
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-muted/50 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5 text-foreground" />
            ) : (
              <Menu className="w-5 h-5 text-foreground" />
            )}
          </button>
        </div>

        {/* Mobile Nav */}
        {isMobileMenuOpen && (
          <nav className="md:hidden mt-4 py-4 border-t border-border/50">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#statistics"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium text-center hover:opacity-90 transition-opacity"
              >
                Esplora i dati
              </a>
            </div>
          </nav>
        )}
      </div>
    </header-->

    <!-- flex items-center -->
    <!-- header-fixed ??? -->
    <header [style.--header-blur.px]="currentBlur()" [style.--header-opacity]="currentOpacity()">
      <div class="container mx-auto h-[80px] flex items-center px-6 w-full">
        <div class="flex items-center justify-between w-full">
          <span class=""></span>
          <span class=""><header-logo /></span>
          <!--<header-logo />-->
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

  currentBlur = signal<number>(0);
  currentOpacity = signal<number>(0);

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

    // Aggiorniamo i signal solo se i valori sono cambiati significativamente
    // (toFixed aiuta a evitare aggiornamenti per micro-variazioni decimali)
    if (this.currentBlur().toFixed(1) !== blur.toFixed(1)) {
      this.currentBlur.set(blur);
      this.currentOpacity.set(opacity);
    }
  }
}
