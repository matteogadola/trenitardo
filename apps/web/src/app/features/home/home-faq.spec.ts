import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeFaq } from './home-faq';

describe('HomeFaq', () => {
  let component: HomeFaq;
  let fixture: ComponentFixture<HomeFaq>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeFaq]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeFaq);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
