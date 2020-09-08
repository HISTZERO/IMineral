import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminRoutingName } from 'src/app/routes/admin-routes-name';
import {ThamdokhoangsanListComponent} from 'src/app/features/admin/dangkyhoatdongkhoangsan/thamdokhoangsan/thamdokhoangsan-list/thamdokhoangsan-list.component'


const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "",
        children: [
          {path: AdminRoutingName.thamdokhoangsanUri, component: ThamdokhoangsanListComponent},
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
