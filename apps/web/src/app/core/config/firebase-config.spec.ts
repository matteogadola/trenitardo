import { TestBed } from '@angular/core/testing';

import { FirebaseConfig } from './firebase-config';

describe('FirebaseConfig', () => {
  let service: FirebaseConfig;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirebaseConfig);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
