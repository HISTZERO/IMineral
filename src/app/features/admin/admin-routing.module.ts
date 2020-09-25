import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AdminComponent } from "./admin.component";
import { CoreRoutingName } from "src/app/routes/core-routes-name";
import { AdminRoutingName } from "src/app/routes/admin-routes-name";
import { DashboardComponent } from "src/app/features/admin/dashboard/dashboard.component";
import { PheduyetDulieuComponent } from "src/app/shared/components/pheduyet-dulieu/pheduyet-dulieu.component";

const adminRoutes: Routes = [
  {
    path: "",
    component: AdminComponent,
    children: [
      {
        path: "",
        component: DashboardComponent,
      },
      {
        path: AdminRoutingName.danhmucUri,
        loadChildren: () =>
          import("src/app/features/admin/danhmuc/danhmuc.module").then(
            (mod) => mod.DanhmucModule
          ),
      },
      {
        path: AdminRoutingName.khuvuckhoangsanUri,
        loadChildren: () =>
          import("src/app/features/admin/khuvuckhoangsan/khuvuckhoangsan.module").then(
            (mod) => mod.KhuvuckhoangsanModule
          ),
      },
      {
        path: AdminRoutingName.diemquangmoquangUri,
        loadChildren: () =>
          import("src/app/features/admin/diemquang-moquang/diemquang-moquang.module").then(
            (mod) => mod.DiemquangMoquangModule
          ),
      },
      {
        path: AdminRoutingName.dangkyhoatdongkhoangsanUri,
        loadChildren: () =>
          import("src/app/features/admin/dangkyhoatdongkhoangsan/dangkyhoatdongkhoangsan.module").then(
            (mod) => mod.DangkyhoatdongkhoangsanModule
          ),
      },
      {
        path: AdminRoutingName.capphephoatdongkhoangsanUri,
        loadChildren: () =>
          import("src/app/features/admin/capphephoatdongkhoangsan/capphephoatdongkhoangsan.module").then(
            (mod) => mod.CapphephoatdongkhoangsanModule
          ),
      },
      {
        path: AdminRoutingName.mapUri,
        loadChildren: () =>
          import("src/app/features/admin/map/map.module").then(
            (mod) => mod.MapModule
          ),
      },
      {
        path: AdminRoutingName.baocaoUri,
        loadChildren: () =>
          import("src/app/features/admin/baocao/baocao.module").then(
            (mod) => mod.BaocaoModule
          ),
      },
      {
        path: AdminRoutingName.thietlapUri,
        loadChildren: () =>
          import("src/app/features/admin/thietlap/thietlap.module").then(
            (mod) => mod.ThietlapModule
          ),
      },
      {
        path: AdminRoutingName.thuvienUri,
        loadChildren: () =>
          import("src/app/features/admin/thuvien/thuvien.module").then(
            (mod) => mod.ThuvienModule
          ),
      },
      {
        path: AdminRoutingName.tinbaiUri,
        loadChildren: () =>
          import("src/app/features/admin/tinbai/tinbai.module").then(
            (mod) => mod.TinbaiModule
          ),
      },
      {
        path: AdminRoutingName.hethongUri,
        loadChildren: () =>
          import("src/app/features/admin/tinbai/tinbai.module").then(
            (mod) => mod.TinbaiModule
          ),
      },
      {
        path: AdminRoutingName.PheDuyetDuLieu,
        component: PheduyetDulieuComponent,
      },
      {
        path: CoreRoutingName.ErrorUri,
        loadChildren: () =>
          import("src/app/shared/modules/error/error.module").then(
            (m) => m.ErrorModule
          ),
      },
    ],
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(adminRoutes)],
  exports: [RouterModule],
})
export class QuantriRoutingModule { }
