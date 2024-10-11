import { TestBed } from '@angular/core/testing';

import { ApivaloresService } from './apivalores.service';

describe('ApivaloresService', () => {
  let service: ApivaloresService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApivaloresService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
