import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'header-logo',
  imports: [NgOptimizedImage],
  template: `
    <div class="relative flex items-center gap-2 group">
      <span
        class="text-black whitespace-nowrap text-5xl font-semibold font-anton group-hover:scale-105"
        >TRENI--TARDO</span
      >
      <img
        ngSrc="/images/logo-256.webp"
        width="64"
        height="64"
        alt="Trenitardo Logo"
        priority
        class="absolute left-19 group-hover:scale-120"
      />
    </div>
  `,
  styles: ``,
})
export class HeaderLogo {}
