import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripStatus } from './trip-status';

describe('TripStatus', () => {
  let component: TripStatus;
  let fixture: ComponentFixture<TripStatus>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TripStatus]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TripStatus);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
