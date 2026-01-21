import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineTypeIcon } from './line-type-icon';

describe('LineTypeIcon', () => {
  let component: LineTypeIcon;
  let fixture: ComponentFixture<LineTypeIcon>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LineTypeIcon]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LineTypeIcon);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
