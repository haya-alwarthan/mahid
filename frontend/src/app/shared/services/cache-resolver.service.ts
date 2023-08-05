import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class CacheResolverService {
  //Store the https responses against keys(the API calls used to generate these responses)
  // key = > (time to live , response)
  private cache = new Map<string, [Date | null, HttpResponse<any>]>();
  constructor() {}
  set(key: any, value: any, timeToLive: number | null = null) {
    console.log('Set Chache Key: ', key);

    //if timetolive is present
    if (timeToLive) {
      const expiresIn = new Date();
      expiresIn.setSeconds(expiresIn.getSeconds() + timeToLive);
      this.cache.set(key, [expiresIn, value]);
    } else this.cache.set(key, [null, value]);
  }
  get(key: any) {
    const tuple = this.cache.get(key);
    if (!tuple) return null;
    const expiresIn = tuple[0];
    const res = tuple[1];
    const now = new Date();
    ///if the expire date is (before) the current date then remove the reponse from the cache
    if (expiresIn! && expiresIn.getTime() < now.getTime()) {
      this.cache.delete(key);
      return null;
    }
    return res;
  }
}
