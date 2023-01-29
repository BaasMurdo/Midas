import { TestBed } from '@angular/core/testing';

import { TensorHelperService } from './tensor-helper.service';

describe('TensorHelperService', () => {
  let service: TensorHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TensorHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
