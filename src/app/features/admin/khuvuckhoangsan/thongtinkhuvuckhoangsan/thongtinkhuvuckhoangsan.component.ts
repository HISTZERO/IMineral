import { Component, OnInit } from '@angular/core';
import { AdminRoutingName } from "src/app/routes/admin-routes-name";

@Component({
  selector: 'app-thongtinkhuvuckhoangsan',
  templateUrl: './thongtinkhuvuckhoangsan.component.html',
  styleUrls: ['./thongtinkhuvuckhoangsan.component.scss']
})
export class ThongtinkhuvuckhoangsanComponent implements OnInit {

  public navArray = [
    { title: "Quản trị", url: `/${AdminRoutingName.adminUri}` },
    {
      title: "Khu vực khoáng sản",
      url: `/${AdminRoutingName.adminUri}/${AdminRoutingName.khuvuckhoangsanUri}`,
    },
    {
      title: "Thông tin khu vực khoáng sản",
      url: "",
    },
  ];
  constructor() { }

  ngOnInit() {
  }

}
