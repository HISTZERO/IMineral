import { Routes, RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";

import { AdminRoutingName } from "src/app/routes/admin-routes-name";
import { BaocaoComponent } from "src/app/features/admin/baocao/baocao.component";
import { BaocaoDieutrakhaosatListComponent } from "src/app/features/admin/baocao/baocao-dieutrakhaosat/baocao-dieutrakhaosat-list/baocao-dieutrakhaosat-list.component";

const baocaoRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: "",
        children: [
          { path: "", component: BaocaoComponent },
          { path:  AdminRoutingName.danhsach +"/:key", component: BaocaoDieutrakhaosatListComponent}
        ],
      },
    ],
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(baocaoRoutes)],
  exports: [RouterModule],
})
export class BaocaoRoutingModule {}
