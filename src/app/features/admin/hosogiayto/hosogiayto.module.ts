import {
  NgModule,
  CUSTOM_ELEMENTS_SCHEMA,
  ComponentFactoryResolver
} from "@angular/core";
import { CommonModule } from '@angular/common';
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { DateTimeAdapter, OWL_DATE_TIME_FORMATS, OWL_DATE_TIME_LOCALE, OwlDateTimeModule } from "ng-pick-datetime";
import { MomentDateTimeAdapter, OwlMomentDateTimeModule, OWL_MOMENT_DATE_TIME_ADAPTER_OPTIONS } from "ng-pick-datetime-moment";
import { MY_CUSTOM_FORMATS } from "src/app/features/admin/admin-shared.module";
import { TranslateModule } from "@ngx-translate/core";
import { AdminSharedModule } from "src/app/features/admin/admin-shared.module";
import { ExComponentFactoryResolverService } from "src/app/services/utilities/ex-component-factory-resolver.service";
import { DanhmucModule } from "src/app/features/admin/danhmuc/danhmuc.module";
import { GiayphepListComponent } from 'src/app/features/admin/hosogiayto/giayphep/giayphep-list/giayphep-list.component';
import { GiayphepIoComponent } from 'src/app/features/admin/hosogiayto/giayphep/giayphep-io/giayphep-io.component';
import { GiayphepOptionComponent } from 'src/app/features/admin/hosogiayto/giayphep/giayphep-option/giayphep-option.component';
import { HosoOptionComponent } from 'src/app/features/admin/hosogiayto/hoso/hoso-option/hoso-option.component';
import { HosoListComponent } from 'src/app/features/admin/hosogiayto/hoso/hoso-list/hoso-list.component';
import { HosoIoComponent } from 'src/app/features/admin/hosogiayto/hoso/hoso-io/hoso-io.component';
import { HosotailieuIoComponent } from 'src/app/features/admin/hosogiayto/hosotailieu/hosotailieu-io/hosotailieu-io.component';
import { HosotailieuListComponent } from 'src/app/features/admin/hosogiayto/hosotailieu/hosotailieu-list/hosotailieu-list.component';
import { DmCanhanOptionComponent } from 'src/app/features/admin/danhmuc/canhan/canhan-option/canhan-option.component';
import { DmTochucOptionComponent } from 'src/app/features/admin/danhmuc/tochuc/tochuc-option/tochuc-option.component';
import { GiaypheptailieuIoComponent } from 'src/app/features/admin/hosogiayto/giaypheptailieu/giaypheptailieu-io/giaypheptailieu-io.component';
import { GiaypheptailieuListComponent } from 'src/app/features/admin/hosogiayto/giaypheptailieu/giaypheptailieu-list/giaypheptailieu-list.component';
import { QuyetdinhtinhtiencapquyenListComponent } from 'src/app/features/admin/hosogiayto/quyetdinhtinhtiencapquyen/quyetdinhtinhtiencapquyen-list/quyetdinhtinhtiencapquyen-list.component';
import { QuyetdinhtinhtiencapquyenIoComponent } from 'src/app/features/admin/hosogiayto/quyetdinhtinhtiencapquyen/quyetdinhtinhtiencapquyen-io/quyetdinhtinhtiencapquyen-io.component';


@NgModule({
  declarations: [
    GiayphepListComponent,
    GiayphepIoComponent,
    GiayphepOptionComponent,
    HosoListComponent,
    HosoIoComponent,
    HosoOptionComponent,
    HosotailieuIoComponent,
    HosotailieuListComponent,
    GiaypheptailieuIoComponent,
    GiaypheptailieuListComponent,
    QuyetdinhtinhtiencapquyenListComponent,
    QuyetdinhtinhtiencapquyenIoComponent
  ],
  exports: [
    GiayphepListComponent,
    GiayphepIoComponent,
    GiayphepOptionComponent,
    HosoListComponent,
    HosoIoComponent,
    HosoOptionComponent,
    HosotailieuIoComponent,
    HosotailieuListComponent,
    GiaypheptailieuIoComponent,
    GiaypheptailieuListComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    NgbModule,
    AdminSharedModule,
    OwlDateTimeModule,
    OwlMomentDateTimeModule,
    TranslateModule,
    DanhmucModule,
  ],
  entryComponents: [
    DmCanhanOptionComponent,
    DmTochucOptionComponent,
    HosoOptionComponent,
    HosotailieuIoComponent,
    GiayphepOptionComponent,
    GiaypheptailieuIoComponent
  ],
  providers: [
    { provide: OWL_MOMENT_DATE_TIME_ADAPTER_OPTIONS, useValue: { useUtc: true } },
    // { provide: OWL_DATE_TIME_LOCALE, useValue: 'vi' },
    // { provide: DateTimeAdapter, useClass: MomentDateTimeAdapter, deps: [OWL_DATE_TIME_LOCALE] },
    { provide: OWL_DATE_TIME_FORMATS, useValue: MY_CUSTOM_FORMATS },
  ]
})
export class HosoGiaytoModule {
  constructor(
    exResolver: ExComponentFactoryResolverService,
    localResolver: ComponentFactoryResolver
  ) {
    exResolver.registerResolver(localResolver);
  }
}
