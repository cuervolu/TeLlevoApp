import { TestBed } from '@angular/core/testing';

import { EsPasajeroGuard } from './es-pasajero.guard';

describe('EsPasajeroGuard', () => {
  let guard: EsPasajeroGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(EsPasajeroGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
