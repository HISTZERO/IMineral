import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { NotFoundComponent } from "./not-found/not-found.component";
import { NotAuthorizedComponent } from "./not-authorized/not-authorized.component";
import { ErrorRoutingModule } from "src/app/shared/modules/error/error-routing.module";
import { NotAuthenticatedComponent } from "./not-authenticated/not-authenticated.component";

@NgModule({
  declarations: [NotFoundComponent, NotAuthenticatedComponent, NotAuthorizedComponent],
  imports: [CommonModule, ErrorRoutingModule],
})
export class ErrorModule { }
