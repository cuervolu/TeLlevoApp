import { TestBed } from '@angular/core/testing';

import { EsChoferGuard } from './es-chofer.guard';

describe('EsChoferGuard', () => {
  let guard: EsChoferGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(EsChoferGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
