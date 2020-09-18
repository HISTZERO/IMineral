import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminRoutingName } from 'src/app/routes/admin-routes-name';
import {ThamdokhoangsanListComponent} from 'src/app/features/admin/dangkyhoatdongkhoangsan/thamdokhoangsan/thamdokhoangsan-list/thamdokhoangsan-list.component'
import { ThamdokhoangsanIoComponent } from './thamdokhoangsan/thamdokhoangsan-io/thamdokhoangsan-io.component';
import { KhaithackhoangsanListComponent } from "./khaithackhoangsan/khaithackhoangsan-list/khaithackhoangsan-list.component";
import { KhaithackhoangsanIoComponent } from "./khaithackhoangsan/khaithackhoangsan-io/khaithackhoangsan-io.component";


const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "",
        children: [
          {path: AdminRoutingName.dkthamdokhoangsanUri, component: ThamdokhoangsanListComponent},
          {path: AdminRoutingName.dkthamdokhoangsanchitietUri, component: ThamdokhoangsanIoComponent},
          {path: AdminRoutingName.dkKhaithackhoangsanUri, component: KhaithackhoangsanListComponent},
          {path: AdminRoutingName.dkKhaithackhoangsanChitiet, component: KhaithackhoangsanIoComponent}
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DangkyhoatdongkhoangsanRoutingModule { }
