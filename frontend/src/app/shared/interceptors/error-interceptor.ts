import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpResponse,
  HttpRequest,
  HttpEvent,
  HttpHandler,
  HttpErrorResponse,
} from '@angular/common/http';
import { CacheResolverService } from '../services/cache-resolver.service';
import { Observable, catchError, of, retry, tap, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';

const TIME_TO_LIVE = 10;
@Injectable({
  providedIn: 'root',
})
export class ErrorInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      // retry(1),
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
          //Client Side error
          errorMessage = error.error.message;
        }
        //Server-side error
        else {
          errorMessage = `error code ${error.status} message : ${error.message}`;
        }

        return throwError(() => error.error);
      })
    );
  }
}
