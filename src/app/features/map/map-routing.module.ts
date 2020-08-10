import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { MapComponent } from "./map.component";
import { CoreRoutingName } from "src/app/routes/core-routes-name";
import { MapDetailComponent } from "./map-detail/map-detail.component";

const mapRoutes: Routes = [
  {
    path: "",
    component: MapComponent,
    children: [
      {
        path: "",
        component: MapDetailComponent,
      },
      { path: ":id", component: MapDetailComponent },
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
  imports: [RouterModule.forChild(mapRoutes)],
  exports: [RouterModule],
})
export class MapRoutingModule { }
