import { Component, Input, OnInit } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatChipsModule} from '@angular/material/chips';
import { CommonModule } from '@angular/common';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { SafePipe } from 'src/app/shared/safe.pipe';
import { LinkTitlePipe } from 'src/app/shared/title.pipe';
@Component({
  selector: 'resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.scss'],
  standalone:true,
  imports:[MatIconModule,MatChipsModule,CommonModule,NgxSkeletonLoaderModule,SafePipe,LinkTitlePipe]
})
export class ResourcesComponent implements OnInit {
@Input() resources!:string[]
@Input() keywords!:string[]
  constructor() { }

  ngOnInit(): void {
  }

}
