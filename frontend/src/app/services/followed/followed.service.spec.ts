import { TestBed } from '@angular/core/testing';

import { FollowedService } from './followed.service';

describe('FollowedService', () => {
  let service: FollowedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FollowedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
