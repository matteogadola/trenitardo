import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ApiService } from '@app/core/api/api-service';
import { TimePipe } from '../../shared/pipes/time-pipe';

@Component({
  selector: 'app-runs-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TimePipe],
  template: `
    <div class="w-content pt-[80px]">
      <h1>Runs</h1>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div
          class="bg-white/80 backdrop-blur-sm rounded-2xl border border-purple-200 overflow-hidden shadow-lg"
        >
          <!-- Header -->
          <div class="p-6 border-b border-purple-100 bg-gradient-to-r from-purple-50 to-pink-50">
            <h2 class="text-2xl font-bold text-slate-800">Dettaglio Tratte Analizzate</h2>

            <p class="text-slate-600 mt-1">{{ runs().length }} treni monitorati</p>
          </div>

          <!-- Tabella -->
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-purple-50">
                <tr>
                  <th
                    class="px-6 py-4 text-left text-xs font-medium text-slate-600 uppercase tracking-wider"
                  >
                    Treno
                  </th>
                  <th
                    class="px-6 py-4 text-left text-xs font-medium text-slate-600 uppercase tracking-wider"
                  >
                    Tratta
                  </th>
                  <th
                    class="px-6 py-4 text-left text-xs font-medium text-slate-600 uppercase tracking-wider"
                  >
                    Partenza
                  </th>
                  <th
                    class="px-6 py-4 text-left text-xs font-medium text-slate-600 uppercase tracking-wider"
                  >
                    Ritardo
                  </th>
                  <th
                    class="px-6 py-4 text-left text-xs font-medium text-slate-600 uppercase tracking-wider"
                  >
                    Stato
                  </th>
                </tr>
              </thead>

              <tbody class="divide-y divide-purple-100">
                @for (run of runs(); track $index) {
                  <tr class="hover:bg-purple-50/50 transition-colors">
                    <!-- Treno -->
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        @switch (run.line.type) {
                          @case ('RegioExpress') {
                            <span
                              class="h-8 w-8 bg-red-700 text-white rounded-lg flex items-center justify-center"
                              >RE</span
                            >
                          }
                          @case ('Regionale') {
                            <span
                              class="h-8 w-8 bg-green-700 text-white rounded-lg flex items-center justify-center"
                              >REG</span
                            >
                          }
                          @default {
                            <span class="">?</span>
                          }
                        }
                        <div class="ml-4">
                          <div class="text-sm font-medium text-slate-800">
                            {{ run.code }}
                          </div>
                        </div>
                      </div>
                    </td>

                    <!-- Tratta -->
                    <td class="px-6 py-4">
                      <div class="flex items-center text-sm text-slate-700">
                        <!--app-map-pin-icon class="w-4 h-4 mr-2 text-slate-500"></app-map-pin-icon-->
                        <span>{{ run.origin }} → {{ run.destination }}</span>
                      </div>
                    </td>

                    <!-- Partenza -->
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                      {{ run.departureTime | time }}
                    </td>

                    <!-- Ritardo -->
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span
                        class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                      >
                        +{{ run.arrivalTime | time }} min
                      </span>
                    </td>

                    <!-- Stato -->
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="inline-flex items-center text-sm text-orange-600">
                        <!--app-alert-circle-icon class="w-4 h-4 mr-1"></app-alert-circle-icon-->
                        In Ritardo
                      </span>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: ``,
})
export class RunsPage {
  private readonly apiService = inject(ApiService);
  readonly runs = toSignal(this.apiService.getRuns(), { initialValue: [] });
}
