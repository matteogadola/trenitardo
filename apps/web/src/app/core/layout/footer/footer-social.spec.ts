import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterSocial } from './footer-social';

describe('FooterSocial', () => {
  let component: FooterSocial;
  let fixture: ComponentFixture<FooterSocial>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterSocial]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FooterSocial);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
