import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { CoreRoutingName } from "src/app/routes/core-routes-name";
import { AdminRoutingName } from "src/app/routes/admin-routes-name";
import { PublicRoutingName } from "src/app/routes/public-routes-name";

const appRoutes: Routes = [
  {
    path: "",
    pathMatch: "full",
    redirectTo: PublicRoutingName.taiNguyenNuoc,
  },
  {
    path: AdminRoutingName.adminUri,
    loadChildren: () =>
      import("src/app/features/admin/admin.module").then((m) => m.AdminModule),
  },
  {
    path: AdminRoutingName.bandoUri,
    loadChildren: () =>
      import("src/app/features/map/map.module").then((m) => m.MapModule),
  },
  {
    path: CoreRoutingName.ErrorUri,
    loadChildren: () =>
      import("src/app/shared/modules/error/error.module").then(
        (m) => m.ErrorModule
      ),
  },
  {
    path: "tim-kiem",
    loadChildren: () =>
      import("src/app/shared/modules/search/search.module").then(
        (m) => m.SearchModule
      ),
  },
  {
    path: "",
    loadChildren: () =>
      import("src/app/features/public/public.module").then(
        (m) => m.PublicModule
      ),
  },
  {
    path: "**",
    redirectTo: `${CoreRoutingName.ErrorUri}/${CoreRoutingName.NotFoundUri}`,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, {
      onSameUrlNavigation: "reload",
      enableTracing: false,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
