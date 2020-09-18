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
import { ThongtindangkyComponent } from './thamdokhoangsan/thongtindangky/thongtindangky.component';
import { DangkythamdokhoangsanIoComponent } from './thamdokhoangsan/thongtindangky/dangkythamdokhoangsan-io/dangkythamdokhoangsan-io.component';
import { DangkythamdogiahanIoComponent } from './thamdokhoangsan/thongtindangky/dangkythamdogiahan-io/dangkythamdogiahan-io.component';
import { DonvihanhchinhComponent } from './thamdokhoangsan/thongtindangky/donvihanhchinh/donvihanhchinh.component';
import { LoaikhoangsanComponent } from './thamdokhoangsan/thongtindangky/loaikhoangsan/loaikhoangsan.component';
import { KhuvucthamdoComponent } from './thamdokhoangsan/thongtindangky/khuvucthamdo/khuvucthamdo.component';
import { KhuvuctoadoComponent } from './thamdokhoangsan/thongtindangky/khuvuctoado/khuvuctoado.component';
import { DonvihanhchinhIoComponent } from './thamdokhoangsan/thongtindangky/donvihanhchinh/donvihanhchinh-io/donvihanhchinh-io.component';
import { DonvihanhchinhListComponent } from './thamdokhoangsan/thongtindangky/donvihanhchinh/donvihanhchinh-list/donvihanhchinh-list.component';
import { LoaikhoangsanIoComponent } from './thamdokhoangsan/thongtindangky/loaikhoangsan/loaikhoangsan-io/loaikhoangsan-io.component';
import { LoaikhoangsanListComponent } from './thamdokhoangsan/thongtindangky/loaikhoangsan/loaikhoangsan-list/loaikhoangsan-list.component';
import { KhuvucthamdoIoComponent } from './thamdokhoangsan/thongtindangky/khuvucthamdo/khuvucthamdo-io/khuvucthamdo-io.component';
import { KhuvucthamdoListComponent } from './thamdokhoangsan/thongtindangky/khuvucthamdo/khuvucthamdo-list/khuvucthamdo-list.component';
import { KhuvuctoadoIoComponent } from './thamdokhoangsan/thongtindangky/khuvuctoado/khuvuctoado-io/khuvuctoado-io.component';
import { KhuvuctoadoListComponent } from './thamdokhoangsan/thongtindangky/khuvuctoado/khuvuctoado-list/khuvuctoado-list.component';
import { CongtrinhthamdoComponent } from './thamdokhoangsan/thongtindangky/congtrinhthamdo/congtrinhthamdo.component';
import { CongtrinhthamdoIoComponent } from './thamdokhoangsan/thongtindangky/congtrinhthamdo/congtrinhthamdo-io/congtrinhthamdo-io.component';
import { CongtrinhthamdoListComponent } from './thamdokhoangsan/thongtindangky/congtrinhthamdo/congtrinhthamdo-list/congtrinhthamdo-list.component';
import { KhaithackhoangsanListComponent } from './khaithackhoangsan/khaithackhoangsan-list/khaithackhoangsan-list.component';
import { KhaithackhoangsanIoComponent } from './khaithackhoangsan/khaithackhoangsan-io/khaithackhoangsan-io.component';



@NgModule({
  declarations: [
  HosoListComponent,
  HosoIoComponent,
  ThamdokhoangsanIoComponent,
  ThamdokhoangsanListComponent,
  DangkyhoatdongkhoangsanComponent,
  HosotailieuListComponent,
  HosotailieuIoComponent,
  ThongtindangkyComponent,
  DangkythamdokhoangsanIoComponent,
  DangkythamdogiahanIoComponent,
  DonvihanhchinhComponent,
  LoaikhoangsanComponent,
  KhuvucthamdoComponent,
  KhuvuctoadoComponent,
  CongtrinhthamdoComponent,
  DonvihanhchinhIoComponent,
  DonvihanhchinhListComponent,
  LoaikhoangsanIoComponent,
  LoaikhoangsanListComponent,
  KhuvucthamdoIoComponent,
  KhuvucthamdoListComponent,
  KhuvuctoadoIoComponent,
  KhuvuctoadoListComponent,
  CongtrinhthamdoIoComponent,
  CongtrinhthamdoListComponent,
  KhaithackhoangsanListComponent,
  KhaithackhoangsanIoComponent,

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
    DmTochucOptionComponent,
    HosotailieuIoComponent,
    KhuvuctoadoIoComponent,
    KhuvucthamdoIoComponent,
    LoaikhoangsanIoComponent,
    DonvihanhchinhIoComponent,
    CongtrinhthamdoIoComponent,
    DangkythamdokhoangsanIoComponent,
    DangkythamdogiahanIoComponent,
    KhaithackhoangsanIoComponent
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
