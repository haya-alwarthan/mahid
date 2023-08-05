import { TestBed } from '@angular/core/testing';

import { RoadmapStepsService } from './roadmap-steps.service';

describe('RoadmapStepsService', () => {
  let service: RoadmapStepsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoadmapStepsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
