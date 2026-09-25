import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ApiService } from '@app/core/api/api-service';

import { RunsPage } from './runs-page';

describe('RunsPage', () => {
  let component: RunsPage;
  let fixture: ComponentFixture<RunsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RunsPage],
      providers: [{ provide: ApiService, useValue: { getRuns: () => of([]) } }],
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
