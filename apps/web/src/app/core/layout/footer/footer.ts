import { Component } from '@angular/core';
import { FooterSocial } from './footer-social';
import { Logo } from '../logo';

@Component({
  selector: 'app-footer',
  imports: [FooterSocial, Logo],
  template: `
    <div class="flex flex-col items-center justify-center pt-24 pb-8 w-content gap-4">
      <app-logo [withIcon]="false" />
      <footer-social />
    </div>
  `,
  styles: ``,
})
export class Footer {}
