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
      <div class="flex gap-4">
        <a
          href="https://www.iubenda.com/privacy-policy/35857468"
          title="Privacy Policy"
          class="hover:text-primary hover:scale-105"
          target="_blank"
          >Privacy Policy
        </a>
        <a
          href="https://www.iubenda.com/privacy-policy/35857468/cookie-policy"
          title="Cookie Policy"
          target="_blank"
          class="hover:text-primary hover:scale-105"
          >Cookie Policy
        </a>
      </div>
    </div>
  `,
  styles: ``,
})
export class Footer {}
