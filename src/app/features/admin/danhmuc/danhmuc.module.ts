import {
  NgModule,
  CUSTOM_ELEMENTS_SCHEMA,
  ComponentFactoryResolver
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ExComponentFactoryResolverService } from "src/app/services/utilities/ex-component-factory-resolver.service";

import { DmCanhanListComponent } from "src/app/features/admin/danhmuc/canhan/canhan-list.component";
import { DmCanhanIoComponent } from "src/app/features/admin/danhmuc/canhan/canhan-io.component";
import { DmRoutingModule } from "src/app/features/admin/danhmuc/danhmuc-routing.module";
import { DmNhomthamsoListComponent } from "src/app/features/admin/danhmuc/nhomthamso/nhomthamso-list.component";
import { DmNhomthamsoIoComponent } from "src/app/features/admin/danhmuc/nhomthamso/nhomthamso-io.component";
import { DmDvhcListComponent } from "src/app/features/admin/danhmuc/dvhc/dvhc-list.component";
import { DmDvhcIoComponent } from "src/app/features/admin/danhmuc/dvhc/dvhc-io.component";
import { DmCongtyListComponent } from "src/app/features/admin/danhmuc/congty/congty-list.component";
import { DmCongtyIoComponent } from "src/app/features/admin/danhmuc/congty/congty-io.component";
import { DmCoquanListComponent } from "src/app/features/admin/danhmuc/coquan/coquan-list.component";
import { DmCoquanIoComponent } from "src/app/features/admin/danhmuc/coquan/coquan-io.component";
import { DmTangchuanuocListComponent } from "src/app/features/admin/danhmuc/tangchuanuoc/tangchuanuoc-list.component";
import { DmTangchuanuocIoComponent } from "src/app/features/admin/danhmuc/tangchuanuoc/tangchuanuoc-io.component";
import { DmTieuchuanListComponent } from "src/app/features/admin/danhmuc/tieuchuan/tieuchuan-list.component";
import { DmTieuchuanIoComponent } from "src/app/features/admin/danhmuc/tieuchuan/tieuchuan-io.component";
import { DmThamsoListComponent } from "src/app/features/admin/danhmuc/thamso/thamso-list.component";
import { DmThamsoIoComponent } from "src/app/features/admin/danhmuc/thamso/thamso-io.component";
import { DmTcclListComponent } from "src/app/features/admin/danhmuc/tccl/tccl-list.component";
import { DmTcclIoComponent } from "src/app/features/admin/danhmuc/tccl/tccl-io.component";
import { DmDuanListComponent } from "src/app/features/admin/danhmuc/duan/duan-list.component";
import { DmDuanIoComponent } from "src/app/features/admin/danhmuc/duan/duan-io.component";
import { DmLoaisolieuListComponent } from "src/app/features/admin/danhmuc/loaisolieu/loaisolieu-list.component";
import { DmLoaisolieuIoComponent } from "src/app/features/admin/danhmuc/loaisolieu/loaisolieu-io.component";
import { AdminSharedModule } from "src/app/features/admin/admin-shared.module";
import { DanhmucComponent } from "src/app/features/admin/danhmuc/danhmuc.component";
import { DateTimeAdapter, OWL_DATE_TIME_FORMATS, OWL_DATE_TIME_LOCALE, OwlDateTimeModule } from "ng-pick-datetime";
import { MomentDateTimeAdapter } from "ng-pick-datetime-moment";
import { MY_CUSTOM_FORMATS } from "src/app/features/admin/admin-shared.module";
import { DmDonvidoIoComponent } from 'src/app/features/admin/danhmuc/donvido/donvido-io.component';
import { DmDonvidoListComponent } from "src/app/features/admin/danhmuc/donvido/donvido-list.component";
import { HuonggioListComponent } from 'src/app/features/admin/danhmuc/huonggio/huonggio-list/huonggio-list.component';
import { HuonggioIoComponent } from 'src/app/features/admin/danhmuc/huonggio/huonggio-io/huonggio-io.component';
import { DmThietbiquantracListComponent } from 'src/app/features/admin/danhmuc/thietbiquantrac/thietbiquantrac-list.component';
import { DmThietbiquantracIoComponent } from "src/app/features/admin/danhmuc/thietbiquantrac/thietbiquantrac-io.component";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [
    DmThietbiquantracListComponent,
    DmThietbiquantracIoComponent,
    DmCanhanListComponent,
    DmCanhanIoComponent,
    DmNhomthamsoListComponent,
    DmNhomthamsoIoComponent,
    DmDvhcListComponent,
    DmDvhcIoComponent,
    DmCongtyListComponent,
    DmCongtyIoComponent,
    DmCoquanListComponent,
    DmCoquanIoComponent,
    DmTangchuanuocListComponent,
    DmTangchuanuocIoComponent,
    DmTieuchuanListComponent,
    DmTieuchuanIoComponent,
    DmThamsoListComponent,
    DmThamsoIoComponent,
    DmTcclListComponent,
    DmTcclIoComponent,
    DmDuanListComponent,
    DmDuanIoComponent,
    DmLoaisolieuListComponent,
    DmLoaisolieuIoComponent,
    DanhmucComponent,
    DmDonvidoListComponent,
    DmDonvidoIoComponent,
    HuonggioListComponent,
    HuonggioIoComponent,
  ],
  exports: [],
  imports: [
    CommonModule,
    DmRoutingModule,
    NgbModule,
    AdminSharedModule,
    OwlDateTimeModule,
    TranslateModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [
    DmNhomthamsoIoComponent,
    DmCanhanIoComponent,
    DmDvhcIoComponent,
    DmCongtyIoComponent,
    DmTangchuanuocIoComponent,
    DmThamsoIoComponent,
    DmTieuchuanIoComponent,
    DmTcclIoComponent,
    DmDuanIoComponent,
    DmLoaisolieuIoComponent,
    DmCoquanIoComponent,
    DmDonvidoIoComponent,
    HuonggioIoComponent,
    DmThietbiquantracIoComponent
  ],
  providers: [
    { provide: OWL_DATE_TIME_LOCALE, useValue: 'vi' },
    { provide: DateTimeAdapter, useClass: MomentDateTimeAdapter, deps: [OWL_DATE_TIME_LOCALE] },
    { provide: OWL_DATE_TIME_FORMATS, useValue: MY_CUSTOM_FORMATS },
  ]
})
export class DanhmucModule {
  constructor(
    exResolver: ExComponentFactoryResolverService,
    localResolver: ComponentFactoryResolver
  ) {
    exResolver.registerResolver(localResolver);
  }
}
