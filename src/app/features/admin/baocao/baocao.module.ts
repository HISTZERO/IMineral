import { TranslateModule } from "@ngx-translate/core";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OwlDateTimeModule } from "ng-pick-datetime";
import { OwlMomentDateTimeModule } from "ng-pick-datetime-moment";

import { BaocaoComponent } from 'src/app/features/admin/baocao/baocao.component';
import { BaocaoRoutingModule } from 'src/app/features/admin/baocao/baocao-routing.module';
import { AdminSharedModule } from "src/app/features/admin/admin-shared.module";
import { BaocaoListComponent } from "src/app/features/admin/baocao/baocao/baocao-list/baocao-list.component";
import { BaocaoIoComponent } from "src/app/features/admin/baocao/baocao/baocao-io/baocao-io.component";
import { BaocaoInfoComponent } from "src/app/features/admin/baocao/baocao/baocao-info/baocao-info.component";
import { BaocaoDetailComponent } from "src/app/features/admin/baocao/baocao/baocao-info/baocao-detail/baocao-detail.component";
import { TailieudinhkemListComponent } from "src/app/features/admin/baocao/baocao/tailieudinhkem/tailieudinhkem-list/tailieudinhkem-list.component";
import { TailieudinhkemIoComponent } from "src/app/features/admin/baocao/baocao/tailieudinhkem/tailieudinhkem-io/tailieudinhkem-io.component";

@NgModule({
  declarations: [
    BaocaoComponent,
    BaocaoListComponent,
    BaocaoIoComponent,
    BaocaoInfoComponent,
    BaocaoDetailComponent,
    TailieudinhkemListComponent,
    TailieudinhkemIoComponent
  ],
  imports: [
    CommonModule,
    BaocaoRoutingModule,
    AdminSharedModule,
    OwlDateTimeModule,
    OwlMomentDateTimeModule,
    TranslateModule
  ],
  entryComponents: [
    BaocaoIoComponent,
    TailieudinhkemIoComponent
  ]
})
export class BaocaoModule { }
