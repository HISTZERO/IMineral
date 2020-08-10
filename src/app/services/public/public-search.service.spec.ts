import { TestBed } from '@angular/core/testing';

import { PublicSearchService } from './public-search.service';

describe('PublicSearchService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PublicSearchService = TestBed.get(PublicSearchService);
    expect(service).toBeTruthy();
  });
});
