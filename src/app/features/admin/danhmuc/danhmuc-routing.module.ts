import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { DmCanhanListComponent } from "src/app/features/admin/danhmuc/canhan/canhan-list.component";
import { DmNhomthamsoListComponent } from "src/app/features/admin/danhmuc/nhomthamso/nhomthamso-list.component";
import { DmDvhcListComponent } from "src/app/features/admin/danhmuc/dvhc/dvhc-list.component";
import { DmCongtyListComponent } from "src/app/features/admin/danhmuc/congty/congty-list.component";
import { DmCoquanListComponent } from "src/app/features/admin/danhmuc/coquan/coquan-list.component";
import { DmTangchuanuocListComponent } from "src/app/features/admin/danhmuc/tangchuanuoc/tangchuanuoc-list.component";
import { DmTieuchuanListComponent } from "src/app/features/admin/danhmuc/tieuchuan/tieuchuan-list.component";
import { DmThamsoListComponent } from "src/app/features/admin/danhmuc/thamso/thamso-list.component";
import { DmTcclListComponent } from "src/app/features/admin/danhmuc/tccl/tccl-list.component";
import { DmDuanListComponent } from "src/app/features/admin/danhmuc/duan/duan-list.component";
import { DmLoaisolieuListComponent } from "src/app/features/admin/danhmuc/loaisolieu/loaisolieu-list.component";
import { AdminRoutingName } from "src/app/routes/admin-routes-name";
import { DmDonvidoListComponent } from "src/app/features/admin/danhmuc/donvido/donvido-list.component";
import { HuonggioListComponent } from "src/app/features/admin/danhmuc/huonggio/huonggio-list/huonggio-list.component";
import { DmThietbiquantracListComponent } from "src/app/features/admin/danhmuc/thietbiquantrac/thietbiquantrac-list.component";

const dmRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: "",
        children: [
          { path: "", component: DmCanhanListComponent },
          {
            path: AdminRoutingName.canhanUri,
            component: DmCanhanListComponent,
          },
          {
            path: AdminRoutingName.nhomthamsoUri,
            component: DmNhomthamsoListComponent,
          },
          { path: AdminRoutingName.dvhcUri, component: DmDvhcListComponent },
          {
            path: AdminRoutingName.congtyUri,
            component: DmCongtyListComponent,
          },
          {
            path: AdminRoutingName.coquanUri,
            component: DmCoquanListComponent,
          },
          {
            path: AdminRoutingName.tangchuanuocUri,
            component: DmTangchuanuocListComponent,
          },
          {
            path: AdminRoutingName.donvidoUri,
            component: DmDonvidoListComponent,
          },
          {
            path: AdminRoutingName.tieuchuanUri,
            component: DmTieuchuanListComponent,
          },
          {
            path: AdminRoutingName.huonggioUri,
            component: HuonggioListComponent,
          },
          {
            path: AdminRoutingName.thamsoUri,
            component: DmThamsoListComponent,
          },
          { path: AdminRoutingName.tcclUri, component: DmTcclListComponent },
          { path: AdminRoutingName.duanUri, component: DmDuanListComponent },
          {
            path: AdminRoutingName.loaisolieuUri,
            component: DmLoaisolieuListComponent,
          },
          {
            path: AdminRoutingName.thietbiquantracUri,
            component: DmThietbiquantracListComponent,
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(dmRoutes)],
  exports: [RouterModule],
})
export class DmRoutingModule {}
