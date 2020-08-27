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
import { KhuvuckhoangsanRoutingModule } from './khuvuckhoangsan-routing.module';
import { KhuvuckhoangsanComponent } from './khuvuckhoangsan.component';
import { KhuvucamTamcamIoComponent } from './khuvucam-tamcam/khuvucam-tamcam-io/khuvucam-tamcam-io.component';
import { KhuvucamTamcamListComponent } from './khuvucam-tamcam/khuvucam-tamcam-list/khuvucam-tamcam-list.component';
import { KhuvucdaugiaListComponent } from './khuvucdaugia/khuvucdaugia-list/khuvucdaugia-list.component';
import { KhuvucdaugiaIoComponent } from './khuvucdaugia/khuvucdaugia-io/khuvucdaugia-io.component';
import { KhuvuckhoangsandochaiIoComponent } from './khuvuckhoangsandochai/khuvuckhoangsandochai-io/khuvuckhoangsandochai-io.component';
import { KhuvuckhoangsandochaiListComponent } from './khuvuckhoangsandochai/khuvuckhoangsandochai-list/khuvuckhoangsandochai-list.component';
import { KhuvuckhongdaugiaIoComponent } from './khuvuckhongdaugia/khuvuckhongdaugia-io/khuvuckhongdaugia-io.component';
import { KhuvuckhongdaugiaListComponent } from './khuvuckhongdaugia/khuvuckhongdaugia-list/khuvuckhongdaugia-list.component';
import { KhuvuctoadoIoComponent } from './khuvuctoado/khuvuctoado-io/khuvuctoado-io.component';
import { KhuvuctoadoListComponent } from './khuvuctoado/khuvuctoado-list/khuvuctoado-list.component';


@NgModule({
  declarations: [
    KhuvuckhoangsanComponent,
    KhuvucamTamcamIoComponent,
    KhuvucamTamcamListComponent,
    KhuvucdaugiaListComponent,
    KhuvucdaugiaIoComponent,
    KhuvuckhoangsandochaiIoComponent,
    KhuvuckhoangsandochaiListComponent,
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
    KhuvucamTamcamIoComponent,
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
