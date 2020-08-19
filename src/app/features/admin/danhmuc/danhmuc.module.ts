import {
  NgModule,
  CUSTOM_ELEMENTS_SCHEMA,
  ComponentFactoryResolver
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { DateTimeAdapter, OWL_DATE_TIME_FORMATS, OWL_DATE_TIME_LOCALE, OwlDateTimeModule } from "ng-pick-datetime";
import { MomentDateTimeAdapter } from "ng-pick-datetime-moment";
import { TranslateModule } from "@ngx-translate/core";

import { ExComponentFactoryResolverService } from "src/app/services/utilities/ex-component-factory-resolver.service";
import { DmRoutingModule } from "src/app/features/admin/danhmuc/danhmuc-routing.module";
import { DmDvhcListComponent } from "src/app/features/admin/danhmuc/dvhc/dvhc-list/dvhc-list.component";
import { DmDvhcIoComponent } from "src/app/features/admin/danhmuc/dvhc/dvhc-io/dvhc-io.component";
import { AdminSharedModule } from "src/app/features/admin/admin-shared.module";
import { DanhmucComponent } from "src/app/features/admin/danhmuc/danhmuc.component";
import { MY_CUSTOM_FORMATS } from "src/app/features/admin/admin-shared.module";
import { DmCanhanListComponent } from "src/app/features/admin/danhmuc/canhan/canhan-list/canhan-list.component";
import { DmCanhanIoComponent } from "src/app/features/admin/danhmuc/canhan/canhan-io/canhan-io.component";
import { CapquanlyListComponent } from "src/app/features/admin/danhmuc/capquanly/capquanly-list/capquanly-list.component";
import { CapquanlyIoComponent } from "src/app/features/admin/danhmuc/capquanly/capquanly-io/capquanly-io.component";
import { CaptainguyenListComponent } from "src/app/features/admin/danhmuc/captainguyen/captainguyen-list/captainguyen-list.component";
import { CaptainguyenIoComponent } from "src/app/features/admin/danhmuc/captainguyen/captainguyen-io/captainguyen-io.component";
import { CaptruluongListComponent } from "src/app/features/admin/danhmuc/captruluong/captruluong-list/captruluong-list.component";
import { CaptruluongIoComponent } from "src/app/features/admin/danhmuc/captruluong/captruluong-io/captruluong-io.component";
import { CoquanquanlyListComponent } from "src/app/features/admin/danhmuc/coquanquanly/coquanquanly-list/coquanquanly-list.component";
import { CoquanquanlyIoComponent } from "src/app/features/admin/danhmuc/coquanquanly/coquanquanly-io/coquanquanly-io.component";
import { LoaibaocaoListComponent } from "src/app/features/admin/danhmuc/loaibaocao/loaibaocao-list/loaibaocao-list.component";
import { LoaibaocaoIoComponent } from "src/app/features/admin/danhmuc/loaibaocao/loaibaocao-io/loaibaocao-io.component";
import { LoaigiayphepListComponent } from "src/app/features/admin/danhmuc/loaigiayphep/loaigiayphep-list/loaigiayphep-list.component";
import { LoaigiayphepIoComponent } from "src/app/features/admin/danhmuc/loaigiayphep/loaigiayphep-io/loaigiayphep-io.component";
import { LoaicapphepListComponent } from "src/app/features/admin/danhmuc/loaicapphep/loaicapphep-list/loaicapphep-list.component";
import { LoaicapphepIoComponent } from "src/app/features/admin/danhmuc/loaicapphep/loaicapphep-io/loaicapphep-io.component";
import { LoaikhoangsanListComponent } from "src/app/features/admin/danhmuc/loaikhoangsan/loaikhoangsan-list/loaikhoangsan-list.component";
import { LoaikhoangsanIoComponent } from "src/app/features/admin/danhmuc/loaikhoangsan/loaikhoangsan-io/loaikhoangsan-io.component";
import { LoaitailieuListComponent } from "src/app/features/admin/danhmuc/loaitailieu/loaitailieu-list/loaitailieu-list.component";
import { LoaitailieuIoComponent } from "src/app/features/admin/danhmuc/loaitailieu/loaitailieu-io/loaitailieu-io.component";
import { LoaitochucListComponent } from "src/app/features/admin/danhmuc/loaitochuc/loaitochuc-list/loaitochuc-list.component";
import { LoaitochucIoComponent } from "src/app/features/admin/danhmuc/loaitochuc/loaitochuc-io/loaitochuc-io.component";
import { NguongocmoListComponent } from "src/app/features/admin/danhmuc/nguongocmo/nguongocmo-list/nguongocmo-list.component";
import { NguongocmoIoComponent } from "src/app/features/admin/danhmuc/nguongocmo/nguongocmo-io/nguongocmo-io.component";
import { NhomkhoangsanListComponent } from "src/app/features/admin/danhmuc/nhomkhoangsan/nhomkhoangsan-list/nhomkhoangsan-list.component";
import { NhomkhoangsanIoComponent } from "src/app/features/admin/danhmuc/nhomkhoangsan/nhomkhoangsan-io/nhomkhoangsan-io.component";
import { ThutuchanhchinhListComponent } from "src/app/features/admin/danhmuc/thutuchanhchinh/thutuchanhchinh-list/thutuchanhchinh-list.component";
import { ThutuchanhchinhIoComponent } from "src/app/features/admin/danhmuc/thutuchanhchinh/thutuchanhchinh-io/thutuchanhchinh-io.component";
import { TochucListComponent } from "src/app/features/admin/danhmuc/tochuc/tochuc-list/tochuc-list.component";
import { TochucIoComponent } from "src/app/features/admin/danhmuc/tochuc/tochuc-io/tochuc-io.component";

@NgModule({
  declarations: [
    DanhmucComponent,
    DmDvhcListComponent,
    DmDvhcIoComponent,
    DmCanhanListComponent,
    DmCanhanIoComponent,
    CapquanlyListComponent,
    CapquanlyIoComponent,
    CaptainguyenListComponent,
    CaptainguyenIoComponent,
    CaptruluongListComponent,
    CaptruluongIoComponent,
    CoquanquanlyListComponent,
    CoquanquanlyIoComponent,
    LoaibaocaoListComponent,
    LoaibaocaoIoComponent,
    LoaigiayphepListComponent,
    LoaigiayphepIoComponent,
    LoaicapphepListComponent,
    LoaicapphepIoComponent,
    LoaikhoangsanListComponent,
    LoaikhoangsanIoComponent,
    LoaitailieuListComponent,
    LoaitailieuIoComponent,
    LoaitochucListComponent,
    LoaitochucIoComponent,
    NguongocmoListComponent,
    NguongocmoIoComponent,
    NhomkhoangsanListComponent,
    NhomkhoangsanIoComponent,
    ThutuchanhchinhListComponent,
    ThutuchanhchinhIoComponent,
    TochucListComponent,
    TochucIoComponent
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
    DmDvhcIoComponent,
    DmCanhanIoComponent,
    CapquanlyIoComponent,
    CaptainguyenIoComponent,
    CaptruluongIoComponent,
    CoquanquanlyIoComponent,
    LoaibaocaoIoComponent,
    LoaigiayphepIoComponent,
    LoaicapphepIoComponent,
    LoaikhoangsanIoComponent,
    LoaitailieuIoComponent,
    LoaitochucIoComponent,
    NguongocmoIoComponent,
    NhomkhoangsanIoComponent,
    ThutuchanhchinhIoComponent,
    TochucIoComponent
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
