import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpResponse,HttpRequest, HttpEvent, HttpHandler } from '@angular/common/http';
import { CacheResolverService } from '../services/cache-resolver.service';
import { Observable, of, tap } from 'rxjs';


const TIME_TO_LIVE=10
@Injectable({
  providedIn: 'root',
})
export class CacheInterceptor implements HttpInterceptor  {

    constructor(private cacheResolver:CacheResolverService){}


    
    intercept(req:HttpRequest<any>, next:HttpHandler):Observable<HttpEvent<any>>{
        //Cache only the GET requests
        if(req.method !== 'GET'){
            return next.handle(req)
        }

        const cachedResponse = this.cacheResolver.get(req.urlWithParams)
         
        return cachedResponse ? of(cachedResponse) : this.sendRequest(req,next)
    

    }
    sendRequest(req:HttpRequest<any>, next:HttpHandler):Observable<HttpEvent<any>>{
        return next.handle(req).pipe(
            tap((e)=>{
                if(e instanceof HttpResponse){
                     
                    this.cacheResolver.set(req.urlWithParams, e, TIME_TO_LIVE)
                }
            })
        )


    }

}
