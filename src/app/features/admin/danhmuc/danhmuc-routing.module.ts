import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { DmDvhcListComponent } from "src/app/features/admin/danhmuc/dvhc/dvhc-list/dvhc-list.component";
import { AdminRoutingName } from "src/app/routes/admin-routes-name";
import { DmCanhanListComponent } from "src/app/features/admin/danhmuc/canhan/canhan-list/canhan-list.component";
import { DmCapquanlyListComponent } from "src/app/features/admin/danhmuc/capquanly/capquanly-list/capquanly-list.component";
import { DmCaptainguyenListComponent } from "src/app/features/admin/danhmuc/captainguyen/captainguyen-list/captainguyen-list.component";
import { DmCaptruluongListComponent } from "src/app/features/admin/danhmuc/captruluong/captruluong-list/captruluong-list.component";
import { DmCoquanquanlyListComponent } from "src/app/features/admin/danhmuc/coquanquanly/coquanquanly-list/coquanquanly-list.component";
import { DmLoaibaocaoListComponent } from "src/app/features/admin/danhmuc/loaibaocao/loaibaocao-list/loaibaocao-list.component";
import { DmLoaicapphepListComponent } from "src/app/features/admin/danhmuc/loaicapphep/loaicapphep-list/loaicapphep-list.component";
import { DmLoaigiayphepListComponent } from "src/app/features/admin/danhmuc/loaigiayphep/loaigiayphep-list/loaigiayphep-list.component";
import { DmLoaikhoangsanListComponent } from "src/app/features/admin/danhmuc/loaikhoangsan/loaikhoangsan-list/loaikhoangsan-list.component";
import { DmLoaitailieuListComponent } from "src/app/features/admin/danhmuc/loaitailieu/loaitailieu-list/loaitailieu-list.component";
import { DmLoaiDmTochucListComponent } from "src/app/features/admin/danhmuc/loaitochuc/loaitochuc-list/loaitochuc-list.component";
import { DmNguongocmoListComponent } from "src/app/features/admin/danhmuc/nguongocmo/nguongocmo-list/nguongocmo-list.component";
import { DmNhomkhoangsanListComponent } from "src/app/features/admin/danhmuc/nhomkhoangsan/nhomkhoangsan-list/nhomkhoangsan-list.component";
import { DmThutuchanhchinhListComponent } from "src/app/features/admin/danhmuc/thutuchanhchinh/thutuchanhchinh-list/thutuchanhchinh-list.component";
import { DmTochucListComponent } from "src/app/features/admin/danhmuc/tochuc/tochuc-list/tochuc-list.component";


const dmRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: "",
        children: [
          { path: AdminRoutingName.canhanUri, component: DmCanhanListComponent},
          { path: AdminRoutingName.dvhcUri, component: DmDvhcListComponent },
          { path: AdminRoutingName.capquanlyUri, component: DmCapquanlyListComponent },
          { path: AdminRoutingName.captainguyenUri, component: DmCaptainguyenListComponent },
          { path: AdminRoutingName.captruluongUri, component: DmCaptruluongListComponent },
          { path: AdminRoutingName.coquanquanlyUri, component: DmCoquanquanlyListComponent },
          { path: AdminRoutingName.loaibaocaoUri, component: DmLoaibaocaoListComponent },
          { path: AdminRoutingName.loaicapphepUri, component: DmLoaicapphepListComponent },
          { path: AdminRoutingName.loaigiayphepUri, component: DmLoaigiayphepListComponent },
          { path: AdminRoutingName.loaikhoangsanUri, component: DmLoaikhoangsanListComponent },
          { path: AdminRoutingName.loaitailieuUri, component: DmLoaitailieuListComponent },
          { path: AdminRoutingName.loaitochucUri, component: DmLoaiDmTochucListComponent },
          { path: AdminRoutingName.nguongocmoUri, component: DmNguongocmoListComponent },
          { path: AdminRoutingName.nhomkhoangsanUri, component: DmNhomkhoangsanListComponent },
          { path: AdminRoutingName.thutuchanhchinhUri, component: DmThutuchanhchinhListComponent},
          { path: AdminRoutingName.tochucUri, component: DmTochucListComponent}
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
