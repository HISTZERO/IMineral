import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ThietlaphethongListComponent } from "src/app/features/admin/thietlap/thietlaphethong/thietlaphethong-list/thietlaphethong-list.component";

const thietlapRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: "",
        component: ThietlaphethongListComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(thietlapRoutes)],
  exports: [RouterModule],
})
export class ThietlapRoutingModule {}
