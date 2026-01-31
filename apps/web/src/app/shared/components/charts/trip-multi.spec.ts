import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripMulti } from './trip-multi';

describe('TripMulti', () => {
  let component: TripMulti;
  let fixture: ComponentFixture<TripMulti>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TripMulti]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TripMulti);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
