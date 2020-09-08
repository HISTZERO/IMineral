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
import { DangkyhoatdongkhoangsanRoutingModule } from './dangkyhoatdongkhoangsan-routing.module';
import { HosoListComponent } from './hoso/hoso-list/hoso-list.component';
import { HosoIoComponent } from './hoso/hoso-io/hoso-io.component';
import { ThamdokhoangsanIoComponent } from './thamdokhoangsan/thamdokhoangsan-io/thamdokhoangsan-io.component';
import { ThamdokhoangsanListComponent } from './thamdokhoangsan/thamdokhoangsan-list/thamdokhoangsan-list.component';


@NgModule({
  declarations: [
  HosoListComponent,
  HosoIoComponent,
  ThamdokhoangsanIoComponent,
  ThamdokhoangsanListComponent
  ],
  exports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    DangkyhoatdongkhoangsanRoutingModule,
    NgbModule,
    AdminSharedModule,
    OwlDateTimeModule,
    TranslateModule
  ],
  entryComponents: [
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
