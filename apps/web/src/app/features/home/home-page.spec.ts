import { ComponentFixture, TestBed, DeferBlockBehavior } from '@angular/core/testing';
import { of } from 'rxjs';
import { ApiService } from '@app/core/api/api-service';

import { HomePage } from './home-page';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomePage],
      providers: [
        {
          provide: ApiService,
          useValue: { getLines: () => of([]), getRuns: () => of([]), getTrips: () => of([]) },
        },
      ],
      // I blocchi @defer caricano figli che iniettano servizi Firebase: in unit
      // test non li vogliamo renderizzare.
      deferBlockBehavior: DeferBlockBehavior.Manual,
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
