import { Routes, RouterModule } from "@angular/router";
import { AdminRoutingName } from "src/app/routes/admin-routes-name";
import { BaocaoComponent } from "./baocao.component";
import { NgModule } from "@angular/core";

const baocaoRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: "",
        children: [
          { path: "", component: BaocaoComponent },
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
