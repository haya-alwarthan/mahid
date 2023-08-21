import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingComponent } from './landing/landing.component';
import { RoadmapComponent } from './roadmap/roadmap.component';
import { StepDetailsComponent } from './step-details/step-details.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CacheResolverService } from './shared/services/cache-resolver.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { CacheInterceptor } from './shared/interceptors/cache-interceptor';
import { ErrorInterceptor } from './shared/interceptors/error-interceptor';
import { FormsModule } from '@angular/forms';
import { LoadingMaskComponent } from './loading-mask/loading-mask.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
@NgModule({
    declarations: [
        AppComponent,
        LandingComponent,
    ],
    providers: [
        CacheResolverService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: CacheInterceptor,
            multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ErrorInterceptor,
            multi: true
        }
    ],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        RoadmapComponent,
        StepDetailsComponent,
        HttpClientModule,
        FormsModule,
        LoadingMaskComponent,
        SweetAlert2Module
        
    ]
})
export class AppModule { }
