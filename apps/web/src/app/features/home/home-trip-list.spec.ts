import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeTripList } from './home-trip-list';

describe('HomeTripList', () => {
  let component: HomeTripList;
  let fixture: ComponentFixture<HomeTripList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeTripList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeTripList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
