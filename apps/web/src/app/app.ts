import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './core/layout/header';
import { Footer } from './core/layout/footer';
import { ScreenTrackingService, UserTrackingService } from '@angular/fire/analytics';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer],
  providers: [ScreenTrackingService, UserTrackingService],
  template: `
    <div class="flex flex-col min-h-screen bg-linear-to-br from-green-50 via-blue-50 to-yellow-50">
      <app-header />
      <div class="grow">
        <router-outlet />
      </div>
      <app-footer />
    </div>
  `,
})
export class App {}
