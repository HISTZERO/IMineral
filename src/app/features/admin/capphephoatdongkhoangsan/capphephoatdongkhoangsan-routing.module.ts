import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminRoutingName } from 'src/app/routes/admin-routes-name';


const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "",
        // children: [
        //   { path: AdminRoutingName.dkthamdokhoangsanUri, component: ThamdokhoangsanListComponent }
        // ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CapphephoatdongkhoangsanRoutingModule { }
