import { TestBed } from '@angular/core/testing';

import { ApirutasService } from './apirutas.service';

describe('ApirutasService', () => {
  let service: ApirutasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApirutasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
