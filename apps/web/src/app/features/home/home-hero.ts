import { Component } from '@angular/core';

@Component({
  selector: 'home-hero',
  imports: [],
  template: `
    <div class="py-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 relative">
        <!-- Header -->
        <div class="text-center mb-16">
          <h1 class="text-5xl md:text-7xl font-bold text-slate-800 mb-6 tracking-tight">
            Statistiche di puntualità
            <span
              class="block text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500"
            >
              in Valtellina
            </span>
          </h1>

          <p class="text-xl text-slate-600 max-w-2xl mx-auto">
            Trasformiamo dati effimeri in statistiche accessibili.
            <span class="block"
              >Una dashboard visiva per comprendere l'andamento della linea valtellinese.</span
            >
          </p>
        </div>

        <!-- Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!--app-stat-card
        title="Ritardo Medio"
        value="23.5 min"
        trend="+5.2%"
        [icon]="Clock"
        color="purple"
        [data]="[12, 19, 23, 18, 28, 20, 23]"
      ></app-stat-card>

      <app-stat-card
        title="Treni Monitorati"
        value="1,247"
        trend="+12.3%"
        [icon]="Train"
        color="blue"
        [data]="[800, 950, 1100, 980, 1200, 1150, 1247]"
      ></app-stat-card>

      <app-stat-card
        title="Puntualità"
        value="76.8%"
        trend="-3.1%"
        [icon]="TrendingUp"
        color="pink"
        [data]="[80, 78, 82, 77, 79, 75, 76.8]"
      ></app-stat-card-->
        </div>
      </div>
    </div>
  `,
  styles: ``,
})
export class HomeHero {
  stats: any[] = [];
}
