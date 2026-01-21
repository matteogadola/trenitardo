import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RunTable } from './run-table';

describe('RunTable', () => {
  let component: RunTable;
  let fixture: ComponentFixture<RunTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RunTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RunTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
