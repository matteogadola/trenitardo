import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripMultiChart } from './trip-multi';

describe('TripMultiChart', () => {
  let component: TripMultiChart;
  let fixture: ComponentFixture<TripMultiChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TripMultiChart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TripMultiChart);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('trips', []);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
