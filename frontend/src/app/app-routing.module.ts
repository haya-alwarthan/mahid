import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { RoadmapComponent } from './roadmap/roadmap.component';
import { StepDetailsComponent } from './step-details/step-details.component';


const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'roadmap', component: RoadmapComponent },
  { path: 'step', component: StepDetailsComponent },
  { path: '**', redirectTo:''},
  

];

@NgModule({
  imports: [RouterModule.forRoot(routes,{onSameUrlNavigation: 'ignore'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
