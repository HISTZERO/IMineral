import { TranslateModule } from "@ngx-translate/core";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OwlDateTimeModule } from "ng-pick-datetime";
import { OwlMomentDateTimeModule } from "ng-pick-datetime-moment";

import { BaocaoComponent } from 'src/app/features/admin/baocao/baocao.component';
import { BaocaoRoutingModule } from 'src/app/features/admin/baocao/baocao-routing.module';
import { BaocaoDieutrakhaosatListComponent } from "src/app/features/admin/baocao/baocao-dieutrakhaosat/baocao-dieutrakhaosat-list/baocao-dieutrakhaosat-list.component";
import { BaocaoDieutrakhaosatIoComponent } from "src/app/features/admin/baocao/baocao-dieutrakhaosat/baocao-dieutrakhaosat-io/baocao-dieutrakhaosat-io.component";
import { BaocaoDieutrakhaosatDetailComponent } from "src/app/features/admin/baocao/baocao-dieutrakhaosat/baocao-dieutrakhaosat-detail/baocao-dieutrakhaosat-detail.component";
import { AdminSharedModule } from "src/app/features/admin/admin-shared.module";

@NgModule({
  declarations: [
    BaocaoComponent,
    BaocaoDieutrakhaosatListComponent,
    BaocaoDieutrakhaosatIoComponent,
    BaocaoDieutrakhaosatDetailComponent
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
    BaocaoDieutrakhaosatIoComponent
  ]
})
export class BaocaoModule { }
