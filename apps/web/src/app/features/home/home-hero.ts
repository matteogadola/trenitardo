import { Component } from '@angular/core';

@Component({
  selector: 'home-hero',
  imports: [],
  template: `
    <div class="pt-10 pb-5">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 relative">
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

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6"></div>
      </div>
    </div>
  `,
  styles: ``,
})
export class HomeHero {
  stats: any[] = [];
}
