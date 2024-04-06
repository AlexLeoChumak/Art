import { TestBed } from '@angular/core/testing';

import { MocDataService } from './moc-data.service';

describe('MocDataService', () => {
  let service: MocDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MocDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
