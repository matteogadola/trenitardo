import { Component, inject } from '@angular/core';
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
      <!-- Background decorativo -->
      <!--div class="absolute inset-0">
        <div class="absolute top-0 left-0 w-96 h-96 bg-purple-200/40 rounded-full blur-3xl"></div>
        <div class="absolute top-20 right-0 w-96 h-96 bg-pink-200/40 rounded-full blur-3xl"></div>
        <div
          class="absolute bottom-0 left-1/3 w-96 h-96 bg-blue-200/40 rounded-full blur-3xl"
        ></div>
      </div-->
      <app-header />
      <div class="grow">
        <router-outlet />
      </div>
      <app-footer />
    </div>
  `,
  styles: [],
})
export class App {}
