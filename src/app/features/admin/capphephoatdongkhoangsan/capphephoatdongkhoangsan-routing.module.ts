import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminRoutingName } from 'src/app/routes/admin-routes-name';
import { CpthamdokhoangsanIoComponent } from 'src/app/features/admin/capphephoatdongkhoangsan/cpthamdokhoangsan/cpthamdokhoangsan-io/cpthamdokhoangsan-io.component';
import { CpthamdokhoangsanListComponent } from 'src/app/features/admin/capphephoatdongkhoangsan/cpthamdokhoangsan/cpthamdokhoangsan-list/cpthamdokhoangsan-list.component';


const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "",
        children: [
          { path: AdminRoutingName.cpthamdokhoangsanUri, component: CpthamdokhoangsanListComponent },
          { path: AdminRoutingName.cpThamdokhoangsanchitietUri, component: CpthamdokhoangsanIoComponent }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CapphephoatdongkhoangsanRoutingModule { }
