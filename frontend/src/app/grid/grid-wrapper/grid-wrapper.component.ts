import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { GridElementType } from 'src/app/shared/constants';
import { StepDetails } from 'src/app/shared/models/details.models';
import { PeopleComponent } from '../people/people.component';
import { ContentComponent } from '../content/content.component';
import { EmbedVidComponent } from '../embed-vid/embed-vid.component';
import { ResourcesComponent } from '../resources/resources.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
@Component({
  selector: 'grid-wrapper',
  templateUrl: './grid-wrapper.component.html',
  styleUrls: ['./grid-wrapper.component.scss'],
  standalone:true,
  imports:[CommonModule,PeopleComponent, ContentComponent,EmbedVidComponent,ResourcesComponent,NgxSkeletonLoaderModule ]
})
export class GridWrapperComponent implements OnInit {
  @Input() step!: StepDetails;
  @Input() type!: GridElementType;
  
  constructor() {}

  ngOnInit(): void {
     
  }

  public get GridElementType() {
    return GridElementType; 
  }
}
