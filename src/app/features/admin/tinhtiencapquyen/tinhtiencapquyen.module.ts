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
import {HosoGiaytoModule} from "src/app/features/admin/hosogiayto/hosogiayto.module";
import { TinhtiencapquyenRoutingModule } from 'src/app/features/admin/tinhtiencapquyen/tinhtiencapquyen-routing.module';
import { TinhtiencapquyenComponent } from 'src/app/features/admin/tinhtiencapquyen/tinhtiencapquyen.component';
import { TinhtiencapquyenListComponent } from 'src/app/features/admin/tinhtiencapquyen/tinhtiencapquyen-list/tinhtiencapquyen-list.component';
import { TinhtiencapquyenIoComponent } from 'src/app/features/admin/tinhtiencapquyen/tinhtiencapquyen-io/tinhtiencapquyen-io.component';
import { TinhtiencapquyentheonamIoComponent } from 'src/app/features/admin/tinhtiencapquyen/tinhtiencapquyentheonam-io/tinhtiencapquyentheonam-io.component';
import { ChitiettinhtiencapquyentheonamComponent } from 'src/app/features/admin/tinhtiencapquyen/tinhtiencapquyentheonam-io/chitiettinhtiencapquyentheonam/chitiettinhtiencapquyentheonam.component';
import { ChitiettinhtiencapquyentheonamListComponent } from 'src/app/features/admin/tinhtiencapquyen/tinhtiencapquyentheonam-io/chitiettinhtiencapquyentheonam/chitiettinhtiencapquyentheonam-list/chitiettinhtiencapquyentheonam-list.component';
import { ChitiettinhtiencapquyentheonamIoComponent } from 'src/app/features/admin/tinhtiencapquyen/tinhtiencapquyentheonam-io/chitiettinhtiencapquyentheonam/chitiettinhtiencapquyentheonam-io/chitiettinhtiencapquyentheonam-io.component';

@NgModule({
  declarations: [
    TinhtiencapquyenComponent,
    TinhtiencapquyenListComponent,
    TinhtiencapquyenIoComponent,
    TinhtiencapquyentheonamIoComponent,
    ChitiettinhtiencapquyentheonamComponent,
    ChitiettinhtiencapquyentheonamListComponent,
    ChitiettinhtiencapquyentheonamIoComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    TinhtiencapquyenRoutingModule,
    AdminSharedModule,
    OwlDateTimeModule,
    OwlMomentDateTimeModule,
    TranslateModule,
    DanhmucModule,
    HosoGiaytoModule
  ],
  entryComponents: [
    ChitiettinhtiencapquyentheonamIoComponent
  ],
  providers: [
    { provide: OWL_MOMENT_DATE_TIME_ADAPTER_OPTIONS, useValue: { useUtc: true } },
    // { provide: OWL_DATE_TIME_LOCALE, useValue: 'vi' },
    // { provide: DateTimeAdapter, useClass: MomentDateTimeAdapter, deps: [OWL_DATE_TIME_LOCALE] },
    { provide: OWL_DATE_TIME_FORMATS, useValue: MY_CUSTOM_FORMATS },
  ]
})
export class TinhtiencapquyenModule {
  constructor(
    exResolver: ExComponentFactoryResolverService,
    localResolver: ComponentFactoryResolver
  ) {
    exResolver.registerResolver(localResolver);
  }
 }
