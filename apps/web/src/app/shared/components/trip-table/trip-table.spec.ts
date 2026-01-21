import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripTable } from './trip-table';

describe('TripTable', () => {
  let component: TripTable;
  let fixture: ComponentFixture<TripTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TripTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TripTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
