import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripStatusChart } from './trip-status';

describe('TripStatusChart', () => {
  let component: TripStatusChart;
  let fixture: ComponentFixture<TripStatusChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TripStatusChart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TripStatusChart);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('trips', []);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
