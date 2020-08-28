import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminRoutingName } from 'src/app/routes/admin-routes-name';
import { KhuvucdaugiaListComponent } from 'src/app/features/admin/khuvuckhoangsan/khuvucdaugia/khuvucdaugia-list/khuvucdaugia-list.component';
import { KhuvuckhongdaugiaListComponent } from 'src/app/features/admin/khuvuckhoangsan/khuvuckhongdaugia/khuvuckhongdaugia-list/khuvuckhongdaugia-list.component';
import { KhuvuckhoangsandochaiListComponent } from 'src/app/features/admin/khuvuckhoangsan/khuvuckhoangsandochai/khuvuckhoangsandochai-list/khuvuckhoangsandochai-list.component';
import { KhuvuccamTamcamListComponent } from "src/app/features/admin/khuvuckhoangsan/khuvuccam-tamcam/khuvuccam-tamcam-list/khuvuccam-tamcam-list.component";
import { ThongtinkhuvuckhoangsanComponent } from "./thongtinkhuvuckhoangsan/thongtinkhuvuckhoangsan.component";


const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "",
        children: [
          {path: AdminRoutingName.khuvuccamtamcamUri, component: KhuvuccamTamcamListComponent},
          {path: AdminRoutingName.khuvucdaugiaUri, component: KhuvucdaugiaListComponent},
          {path: AdminRoutingName.khuvuckhongdaugiaUri, component: KhuvuckhongdaugiaListComponent},
          {path: AdminRoutingName.khuvuckhoangsandochaiUri, component: KhuvuckhoangsandochaiListComponent},
          {path: AdminRoutingName.thongtinkhuvuckhoangsanUri, component: ThongtinkhuvuckhoangsanComponent},
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KhuvuckhoangsanRoutingModule { }
