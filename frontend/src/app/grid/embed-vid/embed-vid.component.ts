import { NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { SafePipe } from 'src/app/shared/safe.pipe';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'embed-vid',
  templateUrl: './embed-vid.component.html',
  styleUrls: ['./embed-vid.component.scss'],
  standalone:true,
  imports:[ SafePipe,NgIf],
  
})
export class EmbedVidComponent implements OnInit {
  @Input() videos!:string[]  
  currentIndex=0;
  imgs_url = environment.IMGS_URL;

  constructor() { }

  ngOnInit(): void {

  }

}
