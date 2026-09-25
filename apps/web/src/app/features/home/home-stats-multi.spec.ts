import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeStatsMulti } from './home-stats-multi';

describe('HomeStatsMulti', () => {
  let component: HomeStatsMulti;
  let fixture: ComponentFixture<HomeStatsMulti>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeStatsMulti]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeStatsMulti);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
