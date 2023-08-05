import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RoadmapStepsService } from '../shared/services/roadmap-steps.service';
import { Step } from '../shared/models/step.model';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'roadmap',
  standalone: true,
  templateUrl: './roadmap.component.html',
  styleUrls: ['./roadmap.component.scss'],
  imports: [MatCardModule, CommonModule, RouterModule],
})
export class RoadmapComponent implements OnInit {
  steps: Step[] = [];
  title: string = '';
  constructor(private roadmapService: RoadmapStepsService) {}

  ngOnInit(): void {
    //Get the steps and assign the prev and next to each
    ///TODO:Gotta use a service to fetch stuff
    this.roadmapService.getSearchedTerm().subscribe((e)=>{console.log("hjj",e)})
    this.steps = this.roadmapService.getRoadMapSteps();
    const extended: Step[] = this.steps.map((step, index) => {
      const prev = step.order > 1 ? this.steps[index - 1] : null;
      const next =
        step.order < this.steps.length ? this.steps[index + 1] : null;
      step.setNext(next);
      step.setPrev(prev);
      return step;
    });
    this.steps = extended;
    ///TODO: get the title from the input later
    this.title = 'طريقك نحو احتراف الكروشيه';
  }
}
