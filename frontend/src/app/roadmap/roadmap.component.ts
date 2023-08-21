import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RoadmapStepsService } from '../shared/services/roadmap-steps.service';
import { Step } from '../shared/models/step.model';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { LoadingMaskComponent } from '../loading-mask/loading-mask.component';
@Component({
  selector: 'roadmap',
  standalone: true,
  templateUrl: './roadmap.component.html',
  styleUrls: ['./roadmap.component.scss'],
  imports: [MatCardModule, CommonModule, RouterModule, LoadingMaskComponent],
})
export class RoadmapComponent implements OnInit {
  steps: Step[] = [];
  title: string = '';
  id: string = '';
  loading: boolean = false;
  constructor(
    private roadmapService: RoadmapStepsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    //Get the steps and assign the prev and next to each
    this.loading = true;
    const t = this.route.snapshot.queryParamMap.get('q') ?? '';
    
    this.roadmapService.getRoadmap(t).subscribe((e: any) => {
       
       
       

      this.id = e.body._id.$oid;
      this.title = e.body.title;


      this.steps = e.body.steps.map((step: any, index: number) => {
        return new Step(index, index, step.subtitle, step.desc);
      });
      this.loading = false;
    });

    const extended: Step[] = this.steps.map((step, index) => {
      const prev = step.order > 1 ? this.steps[index - 1] : null;
      const next =  step.order < this.steps.length ? this.steps[index + 1] : null;
      step.setNext(next);
      step.setPrev(prev);
      return step;
    });
    this.steps = extended;
  }
}
