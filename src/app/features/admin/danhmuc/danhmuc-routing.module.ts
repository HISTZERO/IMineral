import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { DmDvhcListComponent } from "src/app/features/admin/danhmuc/dvhc/dvhc-list/dvhc-list.component";
import { AdminRoutingName } from "src/app/routes/admin-routes-name";
import { DmCanhanListComponent } from "src/app/features/admin/danhmuc/canhan/canhan-list/canhan-list.component";
import { CapquanlyListComponent } from "src/app/features/admin/danhmuc/capquanly/capquanly-list/capquanly-list.component";
import { CaptainguyenListComponent } from "src/app/features/admin/danhmuc/captainguyen/captainguyen-list/captainguyen-list.component";
import { CaptruluongListComponent } from "src/app/features/admin/danhmuc/captruluong/captruluong-list/captruluong-list.component";
import { CoquanquanlyListComponent } from "src/app/features/admin/danhmuc/coquanquanly/coquanquanly-list/coquanquanly-list.component";
import { LoaibaocaoListComponent } from "src/app/features/admin/danhmuc/loaibaocao/loaibaocao-list/loaibaocao-list.component";
import { LoaicapphepListComponent } from "src/app/features/admin/danhmuc/loaicapphep/loaicapphep-list/loaicapphep-list.component";
import { LoaigiayphepListComponent } from "src/app/features/admin/danhmuc/loaigiayphep/loaigiayphep-list/loaigiayphep-list.component";
import { LoaikhoangsanListComponent } from "src/app/features/admin/danhmuc/loaikhoangsan/loaikhoangsan-list/loaikhoangsan-list.component";
import { LoaitailieuListComponent } from "src/app/features/admin/danhmuc/loaitailieu/loaitailieu-list/loaitailieu-list.component";
import { LoaitochucListComponent } from "src/app/features/admin/danhmuc/loaitochuc/loaitochuc-list/loaitochuc-list.component";
import { NguongocmoListComponent } from "src/app/features/admin/danhmuc/nguongocmo/nguongocmo-list/nguongocmo-list.component";
import { NhomkhoangsanListComponent } from "src/app/features/admin/danhmuc/nhomkhoangsan/nhomkhoangsan-list/nhomkhoangsan-list.component";
import { ThutuchanhchinhListComponent } from "src/app/features/admin/danhmuc/thutuchanhchinh/thutuchanhchinh-list/thutuchanhchinh-list.component";
import { TochucListComponent } from "src/app/features/admin/danhmuc/tochuc/tochuc-list/tochuc-list.component";


const dmRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: "",
        children: [
          { path: AdminRoutingName.canhanUri, component: DmCanhanListComponent},
          { path: AdminRoutingName.dvhcUri, component: DmDvhcListComponent },
          { path: AdminRoutingName.capquanlyUri, component: CapquanlyListComponent },
          { path: AdminRoutingName.captainguyenUri, component: CaptainguyenListComponent },
          { path: AdminRoutingName.captruluongUri, component: CaptruluongListComponent },
          { path: AdminRoutingName.coquanquanlyUri, component: CoquanquanlyListComponent },
          { path: AdminRoutingName.loaibaocaoUri, component: LoaibaocaoListComponent },
          { path: AdminRoutingName.loaicapphepUri, component: LoaicapphepListComponent },
          { path: AdminRoutingName.loaigiayphepUri, component: LoaigiayphepListComponent },
          { path: AdminRoutingName.loaikhoangsanUri, component: LoaikhoangsanListComponent },
          { path: AdminRoutingName.loaitailieuUri, component: LoaitailieuListComponent },
          { path: AdminRoutingName.loaitochucUri, component: LoaitochucListComponent },
          { path: AdminRoutingName.nguongocmoUri, component: NguongocmoListComponent },
          { path: AdminRoutingName.nhomkhoangsanUri, component: NhomkhoangsanListComponent },
          { path: AdminRoutingName.thutuchanhchinhUri, component: ThutuchanhchinhListComponent},
          { path: AdminRoutingName.tochucUri, component: TochucListComponent}
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
