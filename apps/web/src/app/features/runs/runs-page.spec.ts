import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RunsPage } from './runs-page';

describe('RunsPage', () => {
  let component: RunsPage;
  let fixture: ComponentFixture<RunsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RunsPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RunsPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
