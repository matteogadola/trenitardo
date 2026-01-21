import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeStats } from './home-stats';

describe('HomeStats', () => {
  let component: HomeStats;
  let fixture: ComponentFixture<HomeStats>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeStats]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeStats);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
