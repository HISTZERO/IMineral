import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminRoutingName } from 'src/app/routes/admin-routes-name';
import { CpthamdokhoangsanIoComponent } from 'src/app/features/admin/capphephoatdongkhoangsan/cpthamdokhoangsan/cpthamdokhoangsan-io/cpthamdokhoangsan-io.component';
import { CpthamdokhoangsanListComponent } from 'src/app/features/admin/capphephoatdongkhoangsan/cpthamdokhoangsan/cpthamdokhoangsan-list/cpthamdokhoangsan-list.component';
import { CpkhaithackhoangsanListComponent } from 'src/app/features/admin/capphephoatdongkhoangsan/cpkhaithackhoangsan/cpkhaithackhoangsan-list/cpkhaithackhoangsan-list.component';
import { CpkhaithackhoangsanIoComponent } from 'src/app/features/admin/capphephoatdongkhoangsan/cpkhaithackhoangsan/cpkhaithackhoangsan-io/cpkhaithackhoangsan-io.component';
import { CppheduyettruluongkhoangsanListComponent } from './cppheduyettruluongkhoangsan/cppheduyettruluongkhoangsan-list/cppheduyettruluongkhoangsan-list.component';
import { CppheduyettruluongkhoangsanIoComponent } from './cppheduyettruluongkhoangsan/cppheduyettruluongkhoangsan-io/cppheduyettruluongkhoangsan-io.component';


const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "",
        children: [
          { path: AdminRoutingName.cpthamdokhoangsanUri, component: CpthamdokhoangsanListComponent },
          { path: AdminRoutingName.cpthamdokhoangsanchitietUri, component: CpthamdokhoangsanIoComponent },
          { path: AdminRoutingName.cpkhaithackhoangsanUri, component: CpkhaithackhoangsanListComponent },
          { path: AdminRoutingName.cpkhaithackhoangsanchitietUri, component: CpkhaithackhoangsanIoComponent },
          { path: AdminRoutingName.cppheduyettruluongkhoangsanUri, component: CppheduyettruluongkhoangsanListComponent },
          { path: AdminRoutingName.cppheduyettruluongkhoangsanchitietUri, component: CppheduyettruluongkhoangsanIoComponent }
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

