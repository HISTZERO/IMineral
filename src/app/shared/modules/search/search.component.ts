import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  public objkeyTo: any;
  public keyvalueTo: any;
  public versionTo: any;

  constructor() { }

  // Lấy dữ liệu objKey từ bên search box
  receiveobj($event) {
    this.objkeyTo = $event;
  }

  // Lấy dữ liệu keyValue từ bên search box
  receivekeyvalue($event) {
    this.keyvalueTo = $event;
  }
  receiveVersion($event) {
    this.versionTo = $event;
  }
  ngOnInit() {
  }

}
