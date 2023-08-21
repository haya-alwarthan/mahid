import { Injectable } from '@angular/core';
import { Step } from '../models/step.model';
import {
  BehaviorSubject,
  Subject,
  catchError,
  shareReplay,
  throwError,
} from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class RoadmapStepsService {
  GET_TITLE_API = `${environment.SERVER_URL}get_title/`;
  GET_ROADMAP_API = `${environment.SERVER_URL}get_roadmap/`;
  GET_DETAILS_API = `${environment.SERVER_URL}get_details/`;

  searchedTerm = new BehaviorSubject<string>('');

  constructor(private http: HttpClient) {}

  getTitle(desc: string) {
    const queryParams = { desc: desc };
    return this.http.get(this.GET_TITLE_API, { params: queryParams }).pipe(
      shareReplay(1),
      catchError((e: any) => {
        console.log("error in service : "+JSON.stringify(e))
        return throwError(() => {
          if(e.message != 'Invalid Input'){
      
              Swal.fire({
                icon: 'error',
                title: 'ثم خطب ما!',
                text: 'يرجى معاودة المحاولة مرة أخرى في وقت لاحق',
                confirmButtonColor: '#FF9863',
      
              }).then(()=>{
                window.location.href = environment.SERVER_URL;
              })
            }
          
         
return e
        });
      })
    );
  }

  getRoadmap(title: string) {
    const queryParams = { title: title };
    return this.http
      .get(this.GET_ROADMAP_API, { params: queryParams })
      .pipe(shareReplay(1));
  }

  getStepDetails(id: string, order: number) {
    const queryParams = { id: id, order: order };
    return this.http
      .get(this.GET_DETAILS_API, { params: queryParams })
      .pipe(shareReplay(1));
  }

  getSearchedTerm() {
    return this.searchedTerm.asObservable();
  }

  setSearchedTerm(term: string) {
    this.searchedTerm.next(term);
  }
}
