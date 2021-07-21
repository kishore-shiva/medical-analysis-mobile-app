import { TestBed } from '@angular/core/testing';

import { ChartgoingService } from './chartgoing.service';

describe('ChartgoingService', () => {
  let service: ChartgoingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChartgoingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
