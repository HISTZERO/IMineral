import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminRoutingName } from 'src/app/routes/admin-routes-name';
import { TinhtiencapquyenListComponent } from 'src/app/features/admin/tinhtiencapquyen/tinhtiencapquyen-list/tinhtiencapquyen-list.component';
import { TinhtiencapquyenIoComponent } from 'src/app/features/admin/tinhtiencapquyen/tinhtiencapquyen-io/tinhtiencapquyen-io.component';

const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "",
        children: [
          {path: AdminRoutingName.danhsachtinhtiencapquyennUri, component: TinhtiencapquyenListComponent},
          {path: AdminRoutingName.tinhtiencapquyenchitietnUri, component: TinhtiencapquyenIoComponent}
        ]
      }
    ]
  }
];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TinhtiencapquyenRoutingModule { }
