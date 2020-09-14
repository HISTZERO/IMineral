import {
  NgModule,
  CUSTOM_ELEMENTS_SCHEMA,
  ComponentFactoryResolver
} from "@angular/core";
import { CommonModule } from '@angular/common';
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { DateTimeAdapter, OWL_DATE_TIME_FORMATS, OWL_DATE_TIME_LOCALE, OwlDateTimeModule } from "ng-pick-datetime";
import { MomentDateTimeAdapter,  OwlMomentDateTimeModule, OWL_MOMENT_DATE_TIME_ADAPTER_OPTIONS } from "ng-pick-datetime-moment";
import { MY_CUSTOM_FORMATS } from "src/app/features/admin/admin-shared.module";
import { TranslateModule } from "@ngx-translate/core";
import { AdminSharedModule } from "src/app/features/admin/admin-shared.module";
import { ExComponentFactoryResolverService } from "src/app/services/utilities/ex-component-factory-resolver.service";
import { DangkyhoatdongkhoangsanRoutingModule } from 'src/app/features/admin/dangkyhoatdongkhoangsan/dangkyhoatdongkhoangsan-routing.module';
import { HosoListComponent } from 'src/app/features/admin/dangkyhoatdongkhoangsan/hoso/hoso-list/hoso-list.component';
import { HosoIoComponent } from 'src/app/features/admin/dangkyhoatdongkhoangsan/hoso/hoso-io/hoso-io.component';
import { ThamdokhoangsanIoComponent } from 'src/app/features/admin/dangkyhoatdongkhoangsan/thamdokhoangsan/thamdokhoangsan-io/thamdokhoangsan-io.component';
import { ThamdokhoangsanListComponent } from 'src/app/features/admin/dangkyhoatdongkhoangsan/thamdokhoangsan/thamdokhoangsan-list/thamdokhoangsan-list.component';
import { DangkyhoatdongkhoangsanComponent } from "src/app/features/admin/dangkyhoatdongkhoangsan/dangkyhoatdongkhoangsan.component";
import { DmCanhanOptionComponent } from "src/app/features/admin/danhmuc/canhan/canhan-option/canhan-option.component";
import { DanhmucModule } from "src/app/features/admin/danhmuc/danhmuc.module";
import { DmTochucOptionComponent } from "src/app/features/admin/danhmuc/tochuc/tochuc-option/tochuc-option.component";
import { HosotailieuListComponent } from './hosotailieu/hosotailieu-list/hosotailieu-list.component';
import { HosotailieuIoComponent } from './hosotailieu/hosotailieu-io/hosotailieu-io.component';


@NgModule({
  declarations: [
  HosoListComponent,
  HosoIoComponent,
  ThamdokhoangsanIoComponent,
  ThamdokhoangsanListComponent,
  DangkyhoatdongkhoangsanComponent,
  HosotailieuListComponent,
  HosotailieuIoComponent,
  ],
  exports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    DangkyhoatdongkhoangsanRoutingModule,
    NgbModule,
    AdminSharedModule,
    OwlDateTimeModule,
    OwlMomentDateTimeModule,
    TranslateModule,
    DanhmucModule,
  ],
  entryComponents: [
    DmCanhanOptionComponent,
    DmTochucOptionComponent
  ],
  providers: [
    { provide: OWL_MOMENT_DATE_TIME_ADAPTER_OPTIONS, useValue: { useUtc: true } },
    // { provide: OWL_DATE_TIME_LOCALE, useValue: 'vi' },
    // { provide: DateTimeAdapter, useClass: MomentDateTimeAdapter, deps: [OWL_DATE_TIME_LOCALE] },
    { provide: OWL_DATE_TIME_FORMATS, useValue: MY_CUSTOM_FORMATS },
  ]
})
export class DangkyhoatdongkhoangsanModule {
  constructor(
    exResolver: ExComponentFactoryResolverService,
    localResolver: ComponentFactoryResolver
  ) {
    exResolver.registerResolver(localResolver);
  }
}
