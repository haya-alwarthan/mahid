import { Component, OnDestroy, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { RoadmapStepsService } from '../shared/services/roadmap-steps.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
@Component({
  selector: 'landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})
export class LandingComponent implements OnInit, OnDestroy {
  // Create a map to display breakpoint names for demonstration purposes.
  destroyed = new Subject<void>();
  currentScreenSize: string | undefined;
  showTitleError: boolean = false;
  entry: string = '';
  loading: boolean = false;
  imgs_url = environment.IMGS_URL;
  displayNameMap = new Map([
    [Breakpoints.XSmall, 'XSmall'],
    [Breakpoints.Small, 'Small'],
    [Breakpoints.Medium, 'Medium'],
    [Breakpoints.Large, 'Large'],
    [Breakpoints.XLarge, 'XLarge'],
  ]);

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private roadService: RoadmapStepsService
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
        for (const query of Object.keys(result.breakpoints)) {
          if (result.breakpoints[query]) {
            this.currentScreenSize =
              this.displayNameMap.get(query) ?? 'Unknown';
          }
        }
      });
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  ngOnInit(): void {}

  generateMap(val: string) {
    (this.loading = true), this.roadService.setSearchedTerm(val);

    this.roadService.getTitle(val).subscribe({
      next: (v: any) => {
        this.router.navigate(['/roadmap'], { queryParams: { q: v.body } });
      },
      error: (e: any) => {
        if (e.message == 'Invalid Input') this.showTitleError = true;
        else
          Swal.fire({
            icon: 'error',
            title: 'ثم خطب ما!',
            text: 'يرجى معاودة المحاولة مرة أخرى في وقت لاحق',
            confirmButtonColor: '#FF9863',
          });
        this.loading = false;
      },
      complete: () => (this.loading = false),
    });
  }
}
