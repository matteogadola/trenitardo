import { afterNextRender, Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ScrollDispatcher } from '@angular/cdk/scrolling';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Logo } from '../logo';
import { AuthService } from '@app/core/auth/auth-service';

@Component({
  selector: 'app-header',
  imports: [RouterModule, Logo],
  template: `
    <header [style.--header-blur.px]="currentBlur()" [style.--header-opacity]="currentOpacity()">
      <div class="container mx-auto h-[80px] flex items-center px-6 w-full">
        <div class="flex items-center justify-between w-full">
          <span class=""></span>
          <app-logo [scaleIcon]="isScrolled()" />
          <div class="flex items-center gap-3">
            @if (authService.isAuthenticated()) {
              <span class="hidden sm:inline text-sm text-slate-700">{{ displayName() }}</span>
              <button
                class="text-sm text-slate-600 hover:text-slate-900 transition-colors"
                type="button"
                (click)="signOut()"
              >
                Esci
              </button>
            } @else {
              <a
                class="text-sm text-slate-600 hover:text-slate-900 transition-colors"
                routerLink="/login"
              >
                Accedi
              </a>
            }
          </div>
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
  readonly authService = inject(AuthService);

  readonly displayName = computed(
    () => this.authService.user()?.displayName ?? this.authService.user()?.email ?? 'Account',
  );

  async signOut(): Promise<void> {
    await this.authService.signOut();
  }

  private readonly MAX_SCROLL_PX = 50;
  private readonly MAX_BLUR_PX = 12;
  private readonly MAX_OPACITY = 0.7;
  private readonly MAX_SCALE = 1;

  readonly currentBlur = signal<number>(0);
  readonly currentOpacity = signal<number>(0);
  readonly currentScale = signal<number>(0);

  readonly isScrolled = signal<boolean>(false);

  constructor() {
    afterNextRender(() => {
      this.scrollDispatcher
        .scrolled()
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => {
          this.calculateStyles();
        });

      this.calculateStyles();
    });
  }

  private calculateStyles(): void {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;

    // Calcoliamo una percentuale di completamento da 0 a 1
    // Clampiamo il valore tra 0 e 1 usando Math.min e Math.max
    let progress = Math.min(scrollTop / this.MAX_SCROLL_PX, 1);
    progress = Math.max(progress, 0);

    const blur = progress * this.MAX_BLUR_PX;
    const opacity = progress * this.MAX_OPACITY;
    const scale = progress * this.MAX_SCALE;

    if (this.currentBlur().toFixed(1) !== blur.toFixed(1)) {
      this.currentBlur.set(blur);
      this.currentOpacity.set(opacity);
      this.currentScale.set(scale);
    }
  }
}
