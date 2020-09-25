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
import { CapphephoatdongkhoangsanRoutingModule } from 'src/app/features/admin/capphephoatdongkhoangsan/capphephoatdongkhoangsan-routing.module';
import { DanhmucModule } from "src/app/features/admin/danhmuc/danhmuc.module";
import { GiayphepListComponent } from './giayphep/giayphep-list/giayphep-list.component';
import { GiayphepIoComponent } from './giayphep/giayphep-io/giayphep-io.component';
import { GiayphepOptionComponent } from './giayphep/giayphep-option/giayphep-option.component';
import { CapphephoatdongkhoangsanComponent } from "./capphephoatdongkhoangsan.component";
import { CpthamdokhoangsanListComponent } from './cpthamdokhoangsan/cpthamdokhoangsan-list/cpthamdokhoangsan-list.component';


@NgModule({
  declarations: [
  GiayphepListComponent,
  GiayphepIoComponent,
  GiayphepOptionComponent,
  CapphephoatdongkhoangsanComponent,
  CpthamdokhoangsanListComponent

  ],
  exports: [
    GiayphepOptionComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    CapphephoatdongkhoangsanRoutingModule,
    NgbModule,
    AdminSharedModule,
    OwlDateTimeModule,
    OwlMomentDateTimeModule,
    TranslateModule,
    DanhmucModule,
  ],
  entryComponents: [
    GiayphepOptionComponent
  ],
  providers: [
    { provide: OWL_MOMENT_DATE_TIME_ADAPTER_OPTIONS, useValue: { useUtc: true } },
    // { provide: OWL_DATE_TIME_LOCALE, useValue: 'vi' },
    // { provide: DateTimeAdapter, useClass: MomentDateTimeAdapter, deps: [OWL_DATE_TIME_LOCALE] },
    { provide: OWL_DATE_TIME_FORMATS, useValue: MY_CUSTOM_FORMATS },
  ]
})
export class CapphephoatdongkhoangsanModule {
  constructor(
    exResolver: ExComponentFactoryResolverService,
    localResolver: ComponentFactoryResolver
  ) {
    exResolver.registerResolver(localResolver);
  }
}
