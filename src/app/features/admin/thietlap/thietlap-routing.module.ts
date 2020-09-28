import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { ThietlaphethongListComponent } from "src/app/features/admin/thietlap/thietlaphethong/thietlaphethong-list/thietlaphethong-list.component";
import { CauhinhtailieuListComponent } from "src/app/features/admin/thietlap/cauhinhtailieu/cauhinhtailieu-list/cauhinhtailieu-list.component";
import { AdminRoutingName } from "src/app/routes/admin-routes-name";
import { CoquantiepnhanListComponent } from "src/app/features/admin/thietlap/coquantiepnhan/coquantiepnhan-list/coquantiepnhan-list.component";
import {CoquancapphepListComponent} from "src/app/features/admin/thietlap/coquancapphep/coquancapphep-list/coquancapphep-list.component";

const thietlapRoutes: Routes = [
  {
    path: "",
    children: [
      { path: AdminRoutingName.ThietLapHeThong, component: ThietlaphethongListComponent},
      { path: AdminRoutingName.CauHinhTaiLieu, component: CauhinhtailieuListComponent},
      { path: AdminRoutingName.CoQuanTiepNhan, component: CoquantiepnhanListComponent},
      { path: AdminRoutingName.CoQuanCapPhep, component: CoquancapphepListComponent},
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(thietlapRoutes)],
  exports: [RouterModule],
})
export class ThietlapRoutingModule { }
