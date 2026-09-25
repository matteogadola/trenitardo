import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule, MatExpansionPanel } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'home-faq',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatExpansionModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
  ],
  template: `
    <div [class]="class()">
      <h1 class="pb-12 text-4xl md:text-6xl font-bold text-slate-800 text-center tracking-tight">
        FAQ
      </h1>
      <mat-accordion class="home-faq">
        <mat-expansion-panel [expanded]="step() === 0" (opened)="setStep(0)" hideToggle>
          <mat-expansion-panel-header>
            <mat-panel-title>Da cosa nasce l'idea?</mat-panel-title>
          </mat-expansion-panel-header>

          L'idea è stata ruba da Alfredo che blablabla
        </mat-expansion-panel>

        <mat-expansion-panel [expanded]="step() === 1" (opened)="setStep(1)" hideToggle>
          <mat-expansion-panel-header>
            <mat-panel-title>Come vengono calcolati i dati?</mat-panel-title>
          </mat-expansion-panel-header>
          ...
        </mat-expansion-panel>

        <mat-expansion-panel [expanded]="step() === 2" (opened)="setStep(2)" hideToggle>
          <mat-expansion-panel-header>
            <mat-panel-title>Altre domande...</mat-panel-title>
          </mat-expansion-panel-header>
          ...
        </mat-expansion-panel>
      </mat-accordion>
    </div>
  `,
  styles: ``,
})
export class HomeFaq {
  class = input<string>('');
  step = signal(-1);

  setStep(index: number) {
    this.step.set(index);
  }

  nextStep() {
    this.step.update((i) => i + 1);
  }

  prevStep() {
    this.step.update((i) => i - 1);
  }
}
