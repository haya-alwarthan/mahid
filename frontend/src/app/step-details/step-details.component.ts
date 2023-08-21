import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { ActivatedRoute, Router } from '@angular/router';
import { RoadmapStepsService } from '../shared/services/roadmap-steps.service';
import { StepDetails } from '../shared/models/details.models';
import { GridElementType } from '../shared/constants';
import { GridWrapperComponent } from '../grid/grid-wrapper/grid-wrapper.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { BreakpointObserver,Breakpoints } from '@angular/cdk/layout';
import { Subject,takeUntil } from 'rxjs';
import { environment } from 'src/environments/environment';
export type shape = 'circle' | 'line' | ''
export interface Tile {
  color: string;
  cols: number;
  rows: number;
  skeltonType:shape;
  count:number
  type: any;
  height:string;
 
}
@Component({
  selector: 'app-step-details',
  templateUrl: './step-details.component.html',
  styleUrls: ['./step-details.component.scss'],
  standalone: true,
  imports: [MatGridListModule, CommonModule, GridWrapperComponent,NgxSkeletonLoaderModule],
})
export class StepDetailsComponent implements OnInit,OnDestroy {
  tiles: Tile[] = [
    { type: GridElementType.Content, cols: 3, rows: 4, color: '#F9F9F9' ,skeltonType:'line' as shape, count:18,height:'20px'},
    { type: GridElementType.Videos, cols: 3, rows: 3, color: '#F9F9F9',skeltonType:'line' as shape,count:1,height:'480px'},
    { type: GridElementType.Resources, cols: 3, rows: 1, color: '#F9F9F9' ,skeltonType:'line' as shape,count:3,height:'25px' },
  ];
  displayNameMap = new Map([
    [Breakpoints.XSmall, 'XSmall'],
    [Breakpoints.Small, 'Small'],
    [Breakpoints.Medium, 'Medium'],
    [Breakpoints.Large, 'Large'],
    [Breakpoints.XLarge, 'XLarge'],
  ]);




  destroyed = new Subject<void>();
  isSmallScreen: boolean =false;
  currentStep!: StepDetails;
  id!: string;
  order!: number;
  length!: number;
  disablePrev: boolean = false;
  disableNext: boolean = false;
  detection:boolean=true
  title: string = '';
  imgs_url = environment.IMGS_URL;


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private roadmapService: RoadmapStepsService,
    private breakpointObserver: BreakpointObserver,
  ) {

    this.breakpointObserver
    .observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium,
      Breakpoints.Large,
      Breakpoints.XLarge,
    ])
    .pipe(takeUntil(this.destroyed))
    .subscribe((result) => {
             this.isSmallScreen = breakpointObserver.isMatched('(max-width: 960px)');
            
              this.tiles= this.tiles.map((tile)=>{return {...tile, cols:(this.isSmallScreen? 6:3)}})

             
        
      
    });
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.queryParamMap.get('id') ?? '';
    this.order = Number(this.route.snapshot.queryParamMap.get('order')) ?? 1;
    this.length = Number(this.route.snapshot.queryParamMap.get('l')) ?? 1;
     
    this.disableNext = this.order >= this.length;
    this.disablePrev = this.order <= 1;

    this.roadmapService
      .getStepDetails(this.id, this.order).pipe()
      .subscribe((e: any) => {
         
    
        this.title = e.body.subtitle;
     
       

        this.currentStep = {...e.body.details};
        this.currentStep = Object.assign({},this.currentStep)

      });
  }
  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  goToPrev() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['/step'], {
      queryParams: { id: this.id, order: this.order - 1, l: this.length },
    });
  }

  goToNext() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['/step'], {
      queryParams: { id: this.id, order: this.order + 1, l: this.length },
    });
  }
}
