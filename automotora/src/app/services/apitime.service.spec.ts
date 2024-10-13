import { TestBed } from '@angular/core/testing';

import { ApitimeService } from './apitime.service';

describe('ApitimeService', () => {
  let service: ApitimeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApitimeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
