import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingComponent } from './landing/landing.component';
import { RoadmapComponent } from './roadmap/roadmap.component';
import { StepDetailsComponent } from './step-details/step-details.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CacheResolverService } from './shared/services/cache-resolver.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { CacheInterceptor } from './shared/interceptors/cache-interceptor';
@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    RoadmapComponent,
    StepDetailsComponent,
  ],
  providers: [
    CacheResolverService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CacheInterceptor,
      multi:true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
