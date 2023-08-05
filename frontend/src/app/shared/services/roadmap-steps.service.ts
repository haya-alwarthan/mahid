import { Injectable } from '@angular/core';
import { Step } from '../models/step.model';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoadmapStepsService {
  steps=[
    new Step(1, 1, "تعلم الغرز الأساسية","ابدأ بالغرز الأساسية للكروشيه مثل الحلقة والغرزة الواحدة والمزدوجة."),
    new Step(2, 2, "تعلم الغرز الأساسية","ابدأ بالغرز الأساسية للكروشيه مثل الحلقة والغرزة الواحدة والمزدوجة."),
    new Step(3, 3, "تعلم الغرز الأساسية","ابدأ بالغرز الأساسية للكروشيه مثل الحلقة والغرزة الواحدة والمزدوجة."),
    new Step(4, 4, "تعلم الغرز الأساسية","ابدأ بالغرز الأساسية للكروشيه مثل الحلقة والغرزة الواحدة والمزدوجة."),
    new Step(5, 5, "تعلم الغرز الأساسية","ابدأ بالغرز الأساسية للكروشيه مثل الحلقة والغرزة الواحدة والمزدوجة."),
    new Step(6, 6, "تعلم الغرز الأساسية","ابدأ بالغرز الأساسية للكروشيه مثل الحلقة والغرزة الواحدة والمزدوجة."),
  ]

  searchedTerm= new BehaviorSubject<string>('')
 
  constructor() { }


  getRoadMapSteps(){
    return this.steps
  }

  getSearchedTerm(){
    return this.searchedTerm.asObservable()
  }

  setSearchedTerm(term:string){
    console.log(term)
    this.searchedTerm.next(term)
  }
}
