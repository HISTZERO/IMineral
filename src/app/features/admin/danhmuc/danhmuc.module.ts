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
import { DmCapquanlyListComponent } from "src/app/features/admin/danhmuc/capquanly/capquanly-list/capquanly-list.component";
import { DmCapquanlyIoComponent } from "src/app/features/admin/danhmuc/capquanly/capquanly-io/capquanly-io.component";
import { DmCaptainguyenListComponent } from "src/app/features/admin/danhmuc/captainguyen/captainguyen-list/captainguyen-list.component";
import { DmCaptainguyenIoComponent } from "src/app/features/admin/danhmuc/captainguyen/captainguyen-io/captainguyen-io.component";
import { DmCaptruluongListComponent } from "src/app/features/admin/danhmuc/captruluong/captruluong-list/captruluong-list.component";
import { DmCaptruluongIoComponent } from "src/app/features/admin/danhmuc/captruluong/captruluong-io/captruluong-io.component";
import { DmCoquanquanlyListComponent } from "src/app/features/admin/danhmuc/coquanquanly/coquanquanly-list/coquanquanly-list.component";
import { DmCoquanquanlyIoComponent } from "src/app/features/admin/danhmuc/coquanquanly/coquanquanly-io/coquanquanly-io.component";
import { DmLoaibaocaoListComponent } from "src/app/features/admin/danhmuc/loaibaocao/loaibaocao-list/loaibaocao-list.component";
import { DmLoaibaocaoIoComponent } from "src/app/features/admin/danhmuc/loaibaocao/loaibaocao-io/loaibaocao-io.component";
import { DmLoaigiayphepListComponent } from "src/app/features/admin/danhmuc/loaigiayphep/loaigiayphep-list/loaigiayphep-list.component";
import { DmLoaigiayphepIoComponent } from "src/app/features/admin/danhmuc/loaigiayphep/loaigiayphep-io/loaigiayphep-io.component";
import { DmLoaicapphepListComponent } from "src/app/features/admin/danhmuc/loaicapphep/loaicapphep-list/loaicapphep-list.component";
import { DmLoaicapphepIoComponent } from "src/app/features/admin/danhmuc/loaicapphep/loaicapphep-io/loaicapphep-io.component";
import { DmLoaikhoangsanListComponent } from "src/app/features/admin/danhmuc/loaikhoangsan/loaikhoangsan-list/loaikhoangsan-list.component";
import { DmLoaikhoangsanIoComponent } from "src/app/features/admin/danhmuc/loaikhoangsan/loaikhoangsan-io/loaikhoangsan-io.component";
import { DmLoaitailieuListComponent } from "src/app/features/admin/danhmuc/loaitailieu/loaitailieu-list/loaitailieu-list.component";
import { DmLoaitailieuIoComponent } from "src/app/features/admin/danhmuc/loaitailieu/loaitailieu-io/loaitailieu-io.component";
import { DmLoaiDmTochucListComponent } from "src/app/features/admin/danhmuc/loaitochuc/loaitochuc-list/loaitochuc-list.component";
import { DmLoaiDmTochucIoComponent } from "src/app/features/admin/danhmuc/loaitochuc/loaitochuc-io/loaitochuc-io.component";
import { DmNguongocmoListComponent } from "src/app/features/admin/danhmuc/nguongocmo/nguongocmo-list/nguongocmo-list.component";
import { DmNguongocmoIoComponent } from "src/app/features/admin/danhmuc/nguongocmo/nguongocmo-io/nguongocmo-io.component";
import { DmNhomkhoangsanListComponent } from "src/app/features/admin/danhmuc/nhomkhoangsan/nhomkhoangsan-list/nhomkhoangsan-list.component";
import { DmNhomkhoangsanIoComponent } from "src/app/features/admin/danhmuc/nhomkhoangsan/nhomkhoangsan-io/nhomkhoangsan-io.component";
import { DmThutuchanhchinhListComponent } from "src/app/features/admin/danhmuc/thutuchanhchinh/thutuchanhchinh-list/thutuchanhchinh-list.component";
import { DmThutuchanhchinhIoComponent } from "src/app/features/admin/danhmuc/thutuchanhchinh/thutuchanhchinh-io/thutuchanhchinh-io.component";
import { DmTochucListComponent } from "src/app/features/admin/danhmuc/tochuc/tochuc-list/tochuc-list.component";
import { DmTochucIoComponent } from "src/app/features/admin/danhmuc/tochuc/tochuc-io/tochuc-io.component";
import { DmLinhvucIoComponent } from "src/app/features/admin/danhmuc/linhvuc/linhvuc-io/linhvuc-io.component";
import { DmLinhvucListComponent } from "src/app/features/admin/danhmuc/linhvuc/linhvuc-list/linhvuc-list.component";

@NgModule({
  declarations: [
    DanhmucComponent,
    DmDvhcListComponent,
    DmDvhcIoComponent,
    DmCanhanListComponent,
    DmCanhanIoComponent,
    DmCapquanlyListComponent,
    DmCapquanlyIoComponent,
    DmCaptainguyenListComponent,
    DmCaptainguyenIoComponent,
    DmCaptruluongListComponent,
    DmCaptruluongIoComponent,
    DmCoquanquanlyListComponent,
    DmCoquanquanlyIoComponent,
    DmLoaibaocaoListComponent,
    DmLoaibaocaoIoComponent,
    DmLoaigiayphepListComponent,
    DmLoaigiayphepIoComponent,
    DmLoaicapphepListComponent,
    DmLoaicapphepIoComponent,
    DmLoaikhoangsanListComponent,
    DmLoaikhoangsanIoComponent,
    DmLoaitailieuListComponent,
    DmLoaitailieuIoComponent,
    DmLoaiDmTochucListComponent,
    DmLoaiDmTochucIoComponent,
    DmNguongocmoListComponent,
    DmNguongocmoIoComponent,
    DmNhomkhoangsanListComponent,
    DmNhomkhoangsanIoComponent,
    DmThutuchanhchinhListComponent,
    DmThutuchanhchinhIoComponent,
    DmTochucListComponent,
    DmTochucIoComponent,
    DmLinhvucIoComponent,
    DmLinhvucListComponent
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
    DmCapquanlyIoComponent,
    DmCaptainguyenIoComponent,
    DmCaptruluongIoComponent,
    DmCoquanquanlyIoComponent,
    DmLoaibaocaoIoComponent,
    DmLoaigiayphepIoComponent,
    DmLoaicapphepIoComponent,
    DmLoaikhoangsanIoComponent,
    DmLoaitailieuIoComponent,
    DmLoaiDmTochucIoComponent,
    DmNguongocmoIoComponent,
    DmNhomkhoangsanIoComponent,
    DmThutuchanhchinhIoComponent,
    DmTochucIoComponent,
    DmLinhvucIoComponent
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
