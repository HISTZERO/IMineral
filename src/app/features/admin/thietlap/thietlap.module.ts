import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbAlertModule } from "@ng-bootstrap/ng-bootstrap";
import { MatSidenavModule, MatSlideToggleModule } from "@angular/material";
import { GridModule } from "@syncfusion/ej2-angular-grids";
import { TranslateModule } from "@ngx-translate/core";

import { ThietlapComponent } from 'src/app/features/admin/thietlap/thietlap.component';
import { ThietlaphethongListComponent } from 'src/app/features/admin/thietlap/thietlaphethong/thietlaphethong-list/thietlaphethong-list.component';
import { ThietlaphethongIoComponent } from 'src/app/features/admin/thietlap/thietlaphethong/thietlaphethong-io/thietlaphethong-io.component';
import { ThietlapRoutingModule } from "src/app/features/admin/thietlap/thietlap-routing.module";
import { AdminSharedModule } from "src/app/features/admin/admin-shared.module";
import { CauhinhtailieuListComponent } from "src/app/features/admin/thietlap/cauhinhtailieu/cauhinhtailieu-list/cauhinhtailieu-list.component";
import { CauhinhtailieuIoComponent } from "src/app/features/admin/thietlap/cauhinhtailieu/cauhinhtailieu-io/cauhinhtailieu-io.component";
import { CoquantiepnhanListComponent } from "src/app/features/admin/thietlap/coquantiepnhan/coquantiepnhan-list/coquantiepnhan-list.component";
import { CoquantiepnhanIoComponent } from "src/app/features/admin/thietlap/coquantiepnhan/coquantiepnhan-io/coquantiepnhan-io.component";

@NgModule({
  imports: [
    CommonModule,
    ThietlapRoutingModule,
    GridModule,
    MatSidenavModule,
    AdminSharedModule,
    MatSlideToggleModule,
    NgbAlertModule,
    TranslateModule
  ],
  declarations: [
    ThietlapComponent,
    ThietlaphethongListComponent,
    ThietlaphethongIoComponent,
    CauhinhtailieuListComponent,
    CauhinhtailieuIoComponent,
    CoquantiepnhanListComponent,
    CoquantiepnhanIoComponent
  ],
  entryComponents: [
    ThietlaphethongIoComponent,
    CauhinhtailieuIoComponent,
    CoquantiepnhanIoComponent
  ]
})
export class ThietlapModule { }
