import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { CoreRoutingName } from "src/app/routes/core-routes-name";
import { NotAuthorizedComponent } from "./not-authorized/not-authorized.component";
import { NotAuthenticatedComponent } from "./not-authenticated/not-authenticated.component";
import { NotFoundComponent } from "src/app/shared/modules/error/not-found/not-found.component";

const errorRoutes: Routes = [
  {
    path: "",
    children: [
      { path: CoreRoutingName.NotFoundUri, component: NotFoundComponent },
      {
        path: CoreRoutingName.NotAuthenticatedUri,
        component: NotAuthenticatedComponent,
      },
      {
        path: CoreRoutingName.NotAuthorizedUri,
        component: NotAuthorizedComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(errorRoutes)],
  exports: [RouterModule],
})
export class ErrorRoutingModule { }
