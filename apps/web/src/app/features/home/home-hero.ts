import { Component } from '@angular/core';

@Component({
  selector: 'home-hero',
  imports: [],
  template: `
    <div class="pt-24 lg:pt-32 pb-12 lg:pb-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <!-- Header -->
        <div class="text-center mb-16">
          <h1 class="text-5xl md:text-7xl font-bold text-slate-800 mb-6 tracking-tight">
            Statistiche di puntualità
            <span
              class="block text-transparent bg-clip-text bg-linear-to-r from-green-500 to-blue-500"
            >
              in Valtellina
            </span>
          </h1>

          <p class="text-xl text-slate-600 max-w-2xl mx-auto">
            Trasformiamo dati effimeri in statistiche accessibili.
            <span class="block">
              Una sguardo immediato sulla viabilità ferroviaria valtellinese.
            </span>
          </p>
        </div>
      </div>
    </div>
  `,
  styles: ``,
})
export class HomeHero {
  stats: any[] = [];
}
