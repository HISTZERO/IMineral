import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";

import { HethongComponent } from "./hethong.component";
import { AdminRoutingName } from "src/app/routes/admin-routes-name";
import { HethongLogComponent } from "./hethong-log/hethong-log.component";

const hethongRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: "",
        component: HethongComponent,
      },
      {
        path: AdminRoutingName.hethongLog,
        component: HethongLogComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(hethongRoutes)],
  exports: [RouterModule],
})
export class HethongRoutingModule {}
