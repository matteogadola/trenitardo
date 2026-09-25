import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNativeDateAdapter } from '@angular/material/core';
import { RemoteConfigService } from '@app/core/config/remote-config';

import { HomeFilters } from './home-filters';

describe('HomeFilters', () => {
  let component: HomeFilters;
  let fixture: ComponentFixture<HomeFilters>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeFilters],
      providers: [
        provideNativeDateAdapter(),
        {
          provide: RemoteConfigService,
          useValue: {
            whenReady: () => Promise.resolve(),
            getBoolean: () => false,
            getString: () => '',
          },
        },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeFilters);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
