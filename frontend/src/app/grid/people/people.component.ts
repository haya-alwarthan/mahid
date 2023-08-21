import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.scss'],
  standalone:true
})
export class PeopleComponent implements OnInit {
@Input() people!:string[]
  constructor() { }

  ngOnInit(): void {
  }

}
