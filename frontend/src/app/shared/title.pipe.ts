import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'linktit',
  standalone:true
})
export class LinkTitlePipe implements PipeTransform {

  transform(url:string): string {
    const regex=  /(-|_)/g
    const extra = /(https|www\.?|\.$|\/$|:|\.^|\d*)/g
    const cleaned= url.replaceAll(extra,'')
    let  dest =cleaned.split('/').pop() ??cleaned
    dest = dest.split('.')[0].replaceAll(regex,' ')

    return dest;
  }

}
