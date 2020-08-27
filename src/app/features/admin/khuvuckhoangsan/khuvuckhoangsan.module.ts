import {
  NgModule,
  CUSTOM_ELEMENTS_SCHEMA,
  ComponentFactoryResolver
} from "@angular/core";
import { CommonModule } from '@angular/common';
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { DateTimeAdapter, OWL_DATE_TIME_FORMATS, OWL_DATE_TIME_LOCALE, OwlDateTimeModule } from "ng-pick-datetime";
import { MomentDateTimeAdapter } from "ng-pick-datetime-moment";
import { MY_CUSTOM_FORMATS } from "src/app/features/admin/admin-shared.module";
import { TranslateModule } from "@ngx-translate/core";

import { AdminSharedModule } from "src/app/features/admin/admin-shared.module";
import { ExComponentFactoryResolverService } from "src/app/services/utilities/ex-component-factory-resolver.service";
import { KhuvuckhoangsanRoutingModule } from 'src/app/features/admin/khuvuckhoangsan/khuvuckhoangsan-routing.module';
import { KhuvuckhoangsanComponent } from 'src/app/features/admin/khuvuckhoangsan/khuvuckhoangsan.component';
import { KhuvucdaugiaListComponent } from 'src/app/features/admin/khuvuckhoangsan/khuvucdaugia/khuvucdaugia-list/khuvucdaugia-list.component';
import { KhuvucdaugiaIoComponent } from 'src/app/features/admin/khuvuckhoangsan/khuvucdaugia/khuvucdaugia-io/khuvucdaugia-io.component';
import { KhuvuckhoangsandochaiIoComponent } from 'src/app/features/admin/khuvuckhoangsan/khuvuckhoangsandochai/khuvuckhoangsandochai-io/khuvuckhoangsandochai-io.component';
import { KhuvuckhoangsandochaiListComponent } from 'src/app/features/admin/khuvuckhoangsan/khuvuckhoangsandochai/khuvuckhoangsandochai-list/khuvuckhoangsandochai-list.component';
import { KhuvuckhongdaugiaIoComponent } from 'src/app/features/admin/khuvuckhoangsan/khuvuckhongdaugia/khuvuckhongdaugia-io/khuvuckhongdaugia-io.component';
import { KhuvuckhongdaugiaListComponent } from 'src/app/features/admin/khuvuckhoangsan/khuvuckhongdaugia/khuvuckhongdaugia-list/khuvuckhongdaugia-list.component';
import { KhuvuctoadoIoComponent } from 'src/app/features/admin/khuvuckhoangsan/khuvuctoado/khuvuctoado-io/khuvuctoado-io.component';
import { KhuvuctoadoListComponent } from 'src/app/features/admin/khuvuckhoangsan/khuvuctoado/khuvuctoado-list/khuvuctoado-list.component';
import { KhuvuccamTamcamListComponent } from "src/app/features/admin/khuvuckhoangsan/khuvuccam-tamcam/khuvuccam-tamcam-list/khuvuccam-tamcam-list.component";
import { KhuvuccamTamcamIoComponent } from "src/app/features/admin/khuvuckhoangsan/khuvuccam-tamcam/khuvuccam-tamcam-io/khuvuccam-tamcam-io.component";
import { KhuvuccamTamcamDulieuComponent } from "src/app/features/admin/khuvuckhoangsan/khuvuccam-tamcam/khuvuccam-tamcam-dulieu/khuvuccam-tamcam-dulieu.component";
import { KhuvuccamTamcamChitietComponent } from "src/app/features/admin/khuvuckhoangsan/khuvuccam-tamcam/khuvuccam-tamcam-dulieu/khuvuccam-tamcam-chitiet/khuvuccam-tamcam-chitiet.component";
import { KhuvuckhoangsandochaiDulieuComponent } from "src/app/features/admin/khuvuckhoangsan/khuvuckhoangsandochai/khuvuckhoangsandochai-dulieu/khuvuckhoangsandochai-dulieu.component";
import { KhuvuckhoangsandochaiChitietComponent } from "src/app/features/admin/khuvuckhoangsan/khuvuckhoangsandochai/khuvuckhoangsandochai-dulieu/khuvuckhoangsandochai-chitiet/khuvuckhoangsandochai-chitiet.component";


@NgModule({
  declarations: [
    KhuvuckhoangsanComponent,
    KhuvuccamTamcamListComponent,
    KhuvuccamTamcamIoComponent,
    KhuvuccamTamcamDulieuComponent,
    KhuvuccamTamcamChitietComponent,
    KhuvucdaugiaListComponent,
    KhuvucdaugiaIoComponent,
    KhuvuckhoangsandochaiIoComponent,
    KhuvuckhoangsandochaiListComponent,
    KhuvuckhoangsandochaiDulieuComponent,
    KhuvuckhoangsandochaiChitietComponent,
    KhuvuckhongdaugiaIoComponent,
    KhuvuckhongdaugiaListComponent,
    KhuvuctoadoIoComponent,
    KhuvuctoadoListComponent
  ],
  exports: [],
  imports: [
    CommonModule,
    KhuvuckhoangsanRoutingModule,
    NgbModule,
    AdminSharedModule,
    OwlDateTimeModule,
    TranslateModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [
    KhuvuccamTamcamIoComponent,
    KhuvucdaugiaIoComponent,
    KhuvuckhoangsandochaiIoComponent,
    KhuvuckhongdaugiaIoComponent,
    KhuvuctoadoIoComponent,
  ],
  providers: [
    { provide: OWL_DATE_TIME_LOCALE, useValue: 'vi' },
    { provide: DateTimeAdapter, useClass: MomentDateTimeAdapter, deps: [OWL_DATE_TIME_LOCALE] },
    { provide: OWL_DATE_TIME_FORMATS, useValue: MY_CUSTOM_FORMATS },
  ]
})
export class KhuvuckhoangsanModule {
  constructor(
    exResolver: ExComponentFactoryResolverService,
    localResolver: ComponentFactoryResolver
  ) {
    exResolver.registerResolver(localResolver);
  }
}
