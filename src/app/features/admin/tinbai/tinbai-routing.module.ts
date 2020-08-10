import { ReviewComponent } from "src/app/features/admin/tinbai/tintuc/review/review.component";
import { ChudeComponent } from "src/app/features/admin/tinbai/chude/chude.component";
import { TintucComponent } from "src/app/features/admin/tinbai/tintuc/tintuc.component";
import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";

import { TinbaiComponent } from "src/app/features/admin/tinbai/tinbai.component";
import { AdminRoutingName } from "src/app/routes/admin-routes-name";
import { TintucIoComponent } from "src/app/features/admin/tinbai/tintuc/tintuc-io.component";

const tinbaiRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: "",
        component: TinbaiComponent,
      },
      {
        path: AdminRoutingName.chuDe,
        component: ChudeComponent,
      },
      {
        path: AdminRoutingName.tinTuc,
        component: TintucComponent,
      },
      {
        path: AdminRoutingName.tinTuc + "/" + AdminRoutingName.addTinTuc,
        component: TintucIoComponent,
      },
      {
        path:
          AdminRoutingName.tinTuc + "/:id" + "/" + AdminRoutingName.editTinTuc,
        component: TintucIoComponent,
      },
      {
        path:
          AdminRoutingName.tinTuc +
          "/:id" +
          "/" +
          AdminRoutingName.reviewTinTuc,
        component: ReviewComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(tinbaiRoutes)],
  exports: [RouterModule],
})
export class TinbaiRoutingModule {}
