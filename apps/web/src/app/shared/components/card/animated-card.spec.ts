import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimatedCard } from './animated-card';

describe('AnimatedCard', () => {
  let component: AnimatedCard;
  let fixture: ComponentFixture<AnimatedCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnimatedCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnimatedCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
