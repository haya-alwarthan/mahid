import { Component, Input, OnInit } from '@angular/core';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss'],
  standalone:true
})
export class ContentComponent implements OnInit {
@Input() content:string | undefined 
  constructor() { }

  ngOnInit(): void {
 
  }

}
