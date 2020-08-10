import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ThietlaphethongListComponent } from "src/app/features/admin/thietlap/thietlaphethong/thietlaphethong-list/thietlaphethong-list.component";
import { ThietlaptramListComponent } from "src/app/features/admin/thietlap/thietlaptram/thietlaptram-list/thietlaptram-list.component";
import { AdminRoutingName } from "src/app/routes/admin-routes-name";
import { DoituongthietlapListComponent } from "src/app/features/admin/thietlap/thietlaptram/doituongthietlap/doituongthietlap-list/doituongthietlap-list.component";
import { ThietlapdulieuListComponent } from "src/app/features/admin/thietlap/thietlapdulieu/thietlapdulieu-list/thietlapdulieu-list.component";

const thietlapRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: "",
        component: ThietlaphethongListComponent,
      },
      {
        path: AdminRoutingName.ThietLapHeThong,
        component: ThietlaphethongListComponent,
      },
      {
        path: AdminRoutingName.ThietLapTram,
        component: ThietlaptramListComponent,
      },
      {
        path:
          AdminRoutingName.ThietLapTram +
          "/" +
          AdminRoutingName.DoiTuongTram +
          "/:id",
        component: DoituongthietlapListComponent,
      },
      {
        path: AdminRoutingName.ThietLapDuLieu,
        component: ThietlapdulieuListComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(thietlapRoutes)],
  exports: [RouterModule],
})
export class ThietlapRoutingModule {}
