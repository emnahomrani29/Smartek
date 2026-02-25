import { TestBed } from '@angular/core/testing';

import { SkillEvidenceService } from './skill-evidence.service';

describe('SkillEvidenceService', () => {
  let service: SkillEvidenceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SkillEvidenceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
