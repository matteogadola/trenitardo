import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  imports: [],
  template: `
    <div class="h-30 w-content">
      <div class="h-full hidden justify-center items-center">
        <a href="https://ko-fi.com/L4L61SFX9K" target="_blank"
          ><img
            height="36"
            style="border:0px;height:36px;"
            src="https://storage.ko-fi.com/cdn/kofi2.png?v=6"
            [border]="0"
            alt="Buy Me a Coffee at ko-fi.com"
        /></a>
      </div>
    </div>
  `,
  styles: ``,
})
export class Footer {}
