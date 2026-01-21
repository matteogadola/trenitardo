import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterCoffee } from './footer-coffee';

describe('FooterCoffee', () => {
  let component: FooterCoffee;
  let fixture: ComponentFixture<FooterCoffee>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterCoffee]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FooterCoffee);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
