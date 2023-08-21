import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'loading-mask',
  templateUrl: './loading-mask.component.html',
  styleUrls: ['./loading-mask.component.scss'],
  standalone:true
})
export class LoadingMaskComponent implements OnInit {
  imgs_url = environment.IMGS_URL;
  constructor() { }

  ngOnInit(): void {
  }

}
