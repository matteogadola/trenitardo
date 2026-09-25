import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNativeDateAdapter } from '@angular/material/core';

import { Datepicker } from './datepicker';

describe('Datepicker', () => {
  let component: Datepicker;
  let fixture: ComponentFixture<Datepicker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Datepicker],
      providers: [provideNativeDateAdapter()],
    })
    .compileComponents();

    fixture = TestBed.createComponent(Datepicker);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
