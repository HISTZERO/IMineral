import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbAlertModule } from "@ng-bootstrap/ng-bootstrap";
import { MatSidenavModule, MatSlideToggleModule } from "@angular/material";
import { GridModule } from "@syncfusion/ej2-angular-grids";

import { ThietlapComponent } from './thietlap.component';
import { ThietlaphethongListComponent } from './thietlaphethong/thietlaphethong-list/thietlaphethong-list.component';
import { ThietlaphethongIoComponent } from './thietlaphethong/thietlaphethong-io/thietlaphethong-io.component';
import { ThietlapRoutingModule } from "src/app/features/admin/thietlap/thietlap-routing.module";
import { AdminSharedModule } from "src/app/features/admin/admin-shared.module";
import { ThietlaptramListComponent } from './thietlaptram/thietlaptram-list/thietlaptram-list.component';
import { ThietlaptramIoComponent } from './thietlaptram/thietlaptram-io/thietlaptram-io.component';
import { DoituongthietlapListComponent } from './thietlaptram/doituongthietlap/doituongthietlap-list/doituongthietlap-list.component';
import { DoituongthietlapIoComponent } from './thietlaptram/doituongthietlap/doituongthietlap-io/doituongthietlap-io.component';
import { ThietlapdulieuListComponent } from './thietlapdulieu/thietlapdulieu-list/thietlapdulieu-list.component';
import { ThietlapdulieuIoComponent } from './thietlapdulieu/thietlapdulieu-io/thietlapdulieu-io.component';
import { TranslateModule } from "@ngx-translate/core";

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
  declarations: [ThietlapComponent, ThietlaphethongListComponent, ThietlaphethongIoComponent, ThietlaptramListComponent, ThietlaptramIoComponent, DoituongthietlapListComponent, DoituongthietlapIoComponent, ThietlapdulieuListComponent, ThietlapdulieuIoComponent],
  entryComponents: [ThietlaphethongIoComponent,
    ThietlaptramIoComponent,
    DoituongthietlapIoComponent,
    ThietlapdulieuIoComponent]
})
export class ThietlapModule { }
