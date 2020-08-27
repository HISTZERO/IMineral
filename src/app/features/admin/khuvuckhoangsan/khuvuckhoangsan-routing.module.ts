import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminRoutingName } from 'src/app/routes/admin-routes-name';
import { KhuvucamTamcamListComponent } from './khuvucam-tamcam/khuvucam-tamcam-list/khuvucam-tamcam-list.component';
import { KhuvucdaugiaListComponent } from './khuvucdaugia/khuvucdaugia-list/khuvucdaugia-list.component';
import { KhuvuckhongdaugiaListComponent } from './khuvuckhongdaugia/khuvuckhongdaugia-list/khuvuckhongdaugia-list.component';
import { KhuvuckhoangsandochaiListComponent } from './khuvuckhoangsandochai/khuvuckhoangsandochai-list/khuvuckhoangsandochai-list.component';


const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "",
        children: [
          {path: AdminRoutingName.khuvuccamtamcamUri, component: KhuvucamTamcamListComponent},
          {path: AdminRoutingName.khuvucdaugiaUri, component: KhuvucdaugiaListComponent},
          {path: AdminRoutingName.khuvuckhongdaugiaUri, component: KhuvuckhongdaugiaListComponent},
          {path: AdminRoutingName.khuvuckhoangsandochaiUri, component: KhuvuckhoangsandochaiListComponent},
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
