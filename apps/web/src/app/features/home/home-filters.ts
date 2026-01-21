import { Component, input, model, signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { TODAY } from '@app/core/utils/date-util';
import type { Line } from '@repo/types';

interface FilterData {
  date: string;
  lineId: string;
}

@Component({
  selector: 'home-filters',
  imports: [FormField],
  template: `
    <div class="pt-12 pb-6">
      <div class="bg-white/80 backdrop-blur-sm rounded-2xl border border-purple-200 p-6 shadow-lg">
        <div class="flex items-center gap-3 mb-6">
          <!--app-filter-icon class="w-5 h-5 text-purple-600"></app-filter-icon-->
          <h2 class="text-xl font-semibold text-slate-800">Filtra i Dati</h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Filtro Data -->
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">
              <!--app-calendar-icon class="w-4 h-4 inline mr-2"></app-calendar-icon-->
              Data
            </label>

            <input
              type="date"
              [formField]="filtersForm.date"
              class="w-full px-4 py-3 bg-purple-50 border border-purple-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
            />
          </div>

          <!-- Filtro Tratta -->
          <div>
            @if (lines().length > 0) {
              <label class="block text-sm font-medium text-slate-700 mb-2">
                <!--app-filter-icon class="w-4 h-4 inline mr-2"></app-filter-icon-->
                Tipologia Tratta
              </label>

              <select
                [formField]="filtersForm.lineId"
                class="w-full px-4 py-3 bg-purple-50 border border-purple-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all cursor-pointer"
              >
                <option [value]="''">Tutte le tratte</option>
                @for (line of lines(); track line.id) {
                  <option [value]="line.id">
                    <span class="text-purple-600">{{ line.code }}</span>
                    {{ line.name }}
                  </option>
                }
              </select>
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: ``,
})
export class HomeFilters {
  date = input<string>(TODAY);
  lines = input<Line[]>([]);

  protected readonly filterModel = signal<FilterData>({
    date: this.date(),
    lineId: '',
  });
  protected readonly filtersForm = form(this.filterModel);

  selectedDate: string = '';
  selectedRoute: string = '';
}
