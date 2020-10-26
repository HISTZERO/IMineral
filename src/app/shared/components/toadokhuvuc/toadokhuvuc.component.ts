import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-toadokhuvuc',
  templateUrl: './toadokhuvuc.component.html',
  styleUrls: ['./toadokhuvuc.component.scss']
})
export class ToadokhuvucComponent implements OnInit {

  // Chứa geometry dạng text
  @Input() GeometryText: any;

  constructor() { }

  ngOnInit() {
  }

  public convertGeoTextToGeoJson() {
    
  }
}
