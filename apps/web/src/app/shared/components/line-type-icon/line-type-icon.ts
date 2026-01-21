import { Component, input } from '@angular/core';

type LineType = 'RegioExpress' | 'Regionale';

@Component({
  selector: 'app-line-type-icon',
  imports: [],
  template: `
    <div class="flex items-center text-white text-[10px]">
      @switch (type()) {
        @case ('RegioExpress') {
          <span class="h-7 w-7 bg-red-700 rounded-lg flex items-center justify-center">RE</span>
        }
        @case ('Regionale') {
          <span class="h-7 w-7 bg-green-700 rounded-lg flex items-center justify-center">REG</span>
        }
        @default {
          <span class="">?</span>
        }
      }
    </div>
  `,
  styles: ``,
})
export class LineTypeIcon {
  type = input.required<LineType>();
}
