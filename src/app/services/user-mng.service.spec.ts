import { TestBed } from '@angular/core/testing';

import { UserMngService } from './user-mng.service';

describe('UserMngService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserMngService = TestBed.get(UserMngService);
    expect(service).toBeTruthy();
  });
});
