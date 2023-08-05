import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { Step } from '../shared/models/step.model';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
}
@Component({
  selector: 'app-step-details',
  templateUrl: './step-details.component.html',
  styleUrls: ['./step-details.component.scss'],
  standalone: true,
  imports: [MatGridListModule, CommonModule],
})
export class StepDetailsComponent implements OnInit {
  tiles: Tile[] = [
    { text: 'One', cols: 3, rows: 4, color: '#F9F9F9' },
    { text: 'Two', cols: 3, rows: 3, color: '#F9F9F9' },
    { text: 'Three', cols: 2, rows: 1, color: '#F9F9F9' },
    { text: 'Four', cols: 1, rows: 1, color: '#F9F9F9' },
  ];

  currentStep!: Step;
  disablePrev:boolean=false;
  disableNext:boolean=false

  constructor(private router: Router,private route:ActivatedRoute) {

    this.route.params.subscribe(val=>{
      const navigation = this.router.getCurrentNavigation();
      console.log(navigation)
      if(navigation){
      const state = navigation?.extras.state as Step;
      // console.log("cons:  ", state)
      this.currentStep = state;
      this.disablePrev= this.currentStep.getPrev()==null
    this.disableNext= this.currentStep.getNext()==null
    console.log(this.disableNext,this.disablePrev)
    }
      
    })


  }

  ngOnInit(): void {
    ///TODO: fetch details from the LLM
    ///Getting the step object from the url
    console.log("init!!",history.state)
    
  

  }

  goToPrev() {
    // this.currentStep=this.currentStep.prev
    // this.router.navigate(['/step',this.currentStep.id])
    const navigationExtras: NavigationExtras = {state: this.currentStep.getPrev()};
    this.router.navigate(['/step',this.currentStep.id-1],navigationExtras)
  }

  goToNext() {
    // this.currentStep= this.currentStep.getNext()
    // this.router.navigate(['/step',this.currentStep.id])
    const navigationExtras: NavigationExtras = {state: this.currentStep.getNext()};
    this.router.navigate(['/step',this.currentStep.id+1],navigationExtras)
  }
}
