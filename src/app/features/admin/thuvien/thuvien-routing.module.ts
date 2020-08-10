import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {ThuvienComponent} from "./thuvien.component";

const thietlapRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: "",
        component: ThuvienComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(thietlapRoutes)],
  exports: [RouterModule]
})
export class ThuvienRoutingModule {
}
