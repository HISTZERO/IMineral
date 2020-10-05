import {
  NgModule,
  CUSTOM_ELEMENTS_SCHEMA,
  ComponentFactoryResolver
} from "@angular/core";
import {CommonModule} from '@angular/common';
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {DateTimeAdapter, OWL_DATE_TIME_FORMATS, OWL_DATE_TIME_LOCALE, OwlDateTimeModule} from "ng-pick-datetime";
import {
  MomentDateTimeAdapter,
  OwlMomentDateTimeModule,
  OWL_MOMENT_DATE_TIME_ADAPTER_OPTIONS
} from "ng-pick-datetime-moment";
import {MY_CUSTOM_FORMATS} from "src/app/features/admin/admin-shared.module";
import {TranslateModule} from "@ngx-translate/core";
import {AdminSharedModule} from "src/app/features/admin/admin-shared.module";
import {ExComponentFactoryResolverService} from "src/app/services/utilities/ex-component-factory-resolver.service";
import {DangkyhoatdongkhoangsanRoutingModule} from 'src/app/features/admin/dangkyhoatdongkhoangsan/dangkyhoatdongkhoangsan-routing.module';
import {ThamdokhoangsanIoComponent} from 'src/app/features/admin/dangkyhoatdongkhoangsan/thamdokhoangsan/thamdokhoangsan-io/thamdokhoangsan-io.component';
import {ThamdokhoangsanListComponent} from 'src/app/features/admin/dangkyhoatdongkhoangsan/thamdokhoangsan/thamdokhoangsan-list/thamdokhoangsan-list.component';
import {DangkyhoatdongkhoangsanComponent} from "src/app/features/admin/dangkyhoatdongkhoangsan/dangkyhoatdongkhoangsan.component";
import {DmCanhanOptionComponent} from "src/app/features/admin/danhmuc/canhan/canhan-option/canhan-option.component";
import {DanhmucModule} from "src/app/features/admin/danhmuc/danhmuc.module";
import {DmTochucOptionComponent} from "src/app/features/admin/danhmuc/tochuc/tochuc-option/tochuc-option.component";
import {ThongtindangkyComponent} from 'src/app/features/admin/dangkyhoatdongkhoangsan/thamdokhoangsan/thongtindangky/thongtindangky.component';
import {DangkythamdokhoangsanIoComponent} from 'src/app/features/admin/dangkyhoatdongkhoangsan/thamdokhoangsan/thongtindangky/dangkythamdokhoangsan-io/dangkythamdokhoangsan-io.component';
import {DangkythamdogiahanIoComponent} from 'src/app/features/admin/dangkyhoatdongkhoangsan/thamdokhoangsan/thongtindangky/dangkythamdogiahan-io/dangkythamdogiahan-io.component';
import {DonvihanhchinhComponent} from 'src/app/features/admin/dangkyhoatdongkhoangsan/thamdokhoangsan/thongtindangky/donvihanhchinh/donvihanhchinh.component';
import {LoaikhoangsanComponent} from 'src/app/features/admin/dangkyhoatdongkhoangsan/thamdokhoangsan/thongtindangky/loaikhoangsan/loaikhoangsan.component';
import {KhuvucthamdoComponent} from 'src/app/features/admin/dangkyhoatdongkhoangsan/thamdokhoangsan/thongtindangky/khuvucthamdo/khuvucthamdo.component';
import {KhuvuctoadoComponent} from 'src/app/features/admin/dangkyhoatdongkhoangsan/thamdokhoangsan/thongtindangky/khuvuctoado/khuvuctoado.component';
import {DonvihanhchinhIoComponent} from 'src/app/features/admin/dangkyhoatdongkhoangsan/thamdokhoangsan/thongtindangky/donvihanhchinh/donvihanhchinh-io/donvihanhchinh-io.component';
import {DonvihanhchinhListComponent} from 'src/app/features/admin/dangkyhoatdongkhoangsan/thamdokhoangsan/thongtindangky/donvihanhchinh/donvihanhchinh-list/donvihanhchinh-list.component';
import {LoaikhoangsanIoComponent} from 'src/app/features/admin/dangkyhoatdongkhoangsan/thamdokhoangsan/thongtindangky/loaikhoangsan/loaikhoangsan-io/loaikhoangsan-io.component';
import {LoaikhoangsanListComponent} from 'src/app/features/admin/dangkyhoatdongkhoangsan/thamdokhoangsan/thongtindangky/loaikhoangsan/loaikhoangsan-list/loaikhoangsan-list.component';
import {KhuvucthamdoIoComponent} from 'src/app/features/admin/dangkyhoatdongkhoangsan/thamdokhoangsan/thongtindangky/khuvucthamdo/khuvucthamdo-io/khuvucthamdo-io.component';
import {KhuvucthamdoListComponent} from 'src/app/features/admin/dangkyhoatdongkhoangsan/thamdokhoangsan/thongtindangky/khuvucthamdo/khuvucthamdo-list/khuvucthamdo-list.component';
import {KhuvuctoadoIoComponent} from 'src/app/features/admin/dangkyhoatdongkhoangsan/thamdokhoangsan/thongtindangky/khuvuctoado/khuvuctoado-io/khuvuctoado-io.component';
import {KhuvuctoadoListComponent} from 'src/app/features/admin/dangkyhoatdongkhoangsan/thamdokhoangsan/thongtindangky/khuvuctoado/khuvuctoado-list/khuvuctoado-list.component';
import {CongtrinhthamdoComponent} from 'src/app/features/admin/dangkyhoatdongkhoangsan/thamdokhoangsan/thongtindangky/congtrinhthamdo/congtrinhthamdo.component';
import {CongtrinhthamdoIoComponent} from 'src/app/features/admin/dangkyhoatdongkhoangsan/thamdokhoangsan/thongtindangky/congtrinhthamdo/congtrinhthamdo-io/congtrinhthamdo-io.component';
import {CongtrinhthamdoListComponent} from 'src/app/features/admin/dangkyhoatdongkhoangsan/thamdokhoangsan/thongtindangky/congtrinhthamdo/congtrinhthamdo-list/congtrinhthamdo-list.component';
import {KhaithackhoangsanListComponent} from 'src/app/features/admin/dangkyhoatdongkhoangsan/khaithackhoangsan/khaithackhoangsan-list/khaithackhoangsan-list.component';
import {KhaithackhoangsanIoComponent} from 'src/app/features/admin/dangkyhoatdongkhoangsan/khaithackhoangsan/khaithackhoangsan-io/khaithackhoangsan-io.component';
import {KtksThongtindangkyComponent} from "src/app/features/admin/dangkyhoatdongkhoangsan/khaithackhoangsan/ktks-thongtindangky/ktks-thongtindangky.component";
import {DangkykhaithacgiahanIoComponent} from "src/app/features/admin/dangkyhoatdongkhoangsan/khaithackhoangsan/ktks-thongtindangky/dangkykhaithacgiahan-io/dangkykhaithacgiahan-io.component";
import {DangkykhaithackhoangsanIoComponent} from "src/app/features/admin/dangkyhoatdongkhoangsan/khaithackhoangsan/ktks-thongtindangky/dangkykhaithackhoangsan-io/dangkykhaithackhoangsan-io.component";
import {TanthukhoangsanListComponent} from 'src/app/features/admin/dangkyhoatdongkhoangsan/tanthukhoangsan/tanthukhoangsan-list/tanthukhoangsan-list.component';
import {TanthukhoangsanIoComponent} from 'src/app/features/admin/dangkyhoatdongkhoangsan/tanthukhoangsan/tanthukhoangsan-io/tanthukhoangsan-io.component';
import {TralaigiayphepListComponent} from 'src/app/features/admin/dangkyhoatdongkhoangsan/tralaigiayphep/tralaigiayphep-list/tralaigiayphep-list.component';
import {TralaigiayphepIoComponent} from 'src/app/features/admin/dangkyhoatdongkhoangsan/tralaigiayphep/tralaigiayphep-io/tralaigiayphep-io.component';
import {DongcuamoListComponent} from 'src/app/features/admin/dangkyhoatdongkhoangsan/dongcuamo/dongcuamo-list/dongcuamo-list.component';
import {DongcuamoIoComponent} from 'src/app/features/admin/dangkyhoatdongkhoangsan/dongcuamo/dongcuamo-io/dongcuamo-io.component';
import {ChuyennhuongquyenListComponent} from 'src/app/features/admin/dangkyhoatdongkhoangsan/chuyennhuongquyen/chuyennhuongquyen-list/chuyennhuongquyen-list.component';
import {ChuyennhuongquyenIoComponent} from 'src/app/features/admin/dangkyhoatdongkhoangsan/chuyennhuongquyen/chuyennhuongquyen-io/chuyennhuongquyen-io.component';
import {PheduyettruluongkhoangsanListComponent} from "src/app/features/admin/dangkyhoatdongkhoangsan/pheduyettruluongkhoangsan/pheduyettruluongkhoangsan-list/pheduyettruluongkhoangsan-list.component";
import {PheduyettruluongkhoangsanIoComponent} from "src/app/features/admin/dangkyhoatdongkhoangsan/pheduyettruluongkhoangsan/pheduyettruluongkhoangsan-io/pheduyettruluongkhoangsan-io.component";
import {DaugiaquyenListComponent} from "src/app/features/admin/dangkyhoatdongkhoangsan/daugiaquyen/daugiaquyen-list/daugiaquyen-list.component";
import {DaugiaquyenIoComponent} from "src/app/features/admin/dangkyhoatdongkhoangsan/daugiaquyen/daugiaquyen-io/daugiaquyen-io.component";
import { DangkykhaithaccaisoiIoComponent } from 'src/app/features/admin/dangkyhoatdongkhoangsan/khaithackhoangsan/ktks-thongtindangky/dangkykhaithaccaisoi-io/dangkykhaithaccaisoi-io.component';
import { DangkykhaithacdieuchinhIoComponent } from 'src/app/features/admin/dangkyhoatdongkhoangsan/khaithackhoangsan/ktks-thongtindangky/dangkykhaithacdieuchinh-io/dangkykhaithacdieuchinh-io.component';
import { DangkykhaithacvlxdIoComponent } from 'src/app/features/admin/dangkyhoatdongkhoangsan/khaithackhoangsan/ktks-thongtindangky/dangkykhaithacvlxd-io/dangkykhaithacvlxd-io.component';
import { DangkykhaithackhoangsanduanIoComponent } from 'src/app/features/admin/dangkyhoatdongkhoangsan/khaithackhoangsan/ktks-thongtindangky/dangkykhaithackhoangsanduan-io/dangkykhaithackhoangsanduan-io.component';
import {HosoGiaytoModule} from "src/app/features/admin/hosogiayto/hosogiayto.module";
import { GiayphepOptionComponent } from 'src/app/features/admin/hosogiayto/giayphep/giayphep-option/giayphep-option.component';
import { HosotailieuIoComponent } from 'src/app/features/admin/hosogiayto/hosotailieu/hosotailieu-io/hosotailieu-io.component';
import { KtksCongtrinhkhaithacComponent } from './khaithackhoangsan/ktks-thongtindangky/ktks-congtrinhkhaithac/ktks-congtrinhkhaithac.component';
import { KtksCongtrinhkhaithacIoComponent } from './khaithackhoangsan/ktks-thongtindangky/ktks-congtrinhkhaithac/ktks-congtrinhkhaithac-io/ktks-congtrinhkhaithac-io.component';
import { KtksCongtrinhkhaithacListComponent } from './khaithackhoangsan/ktks-thongtindangky/ktks-congtrinhkhaithac/ktks-congtrinhkhaithac-list/ktks-congtrinhkhaithac-list.component';
import { KhuvuckhaithacListComponent } from 'src/app/features/admin/dangkyhoatdongkhoangsan/khaithackhoangsan/ktks-thongtindangky/khuvuckhaithac/khuvuckhaithac-list/khuvuckhaithac-list.component';
import { KhuvuckhaithacIoComponent } from 'src/app/features/admin/dangkyhoatdongkhoangsan/khaithackhoangsan/ktks-thongtindangky/khuvuckhaithac/khuvuckhaithac-io/khuvuckhaithac-io.component';
import { KtksDonvihanhchinhComponent } from 'src/app/features/admin/dangkyhoatdongkhoangsan/khaithackhoangsan/ktks-thongtindangky/ktks-donvihanhchinh/ktks-donvihanhchinh.component';
import { KtksDonvihanhchinhIoComponent } from 'src/app/features/admin/dangkyhoatdongkhoangsan/khaithackhoangsan/ktks-thongtindangky/ktks-donvihanhchinh/ktks-donvihanhchinh-io/ktks-donvihanhchinh-io.component';
import { KtksDonvihanhchinhListComponent } from 'src/app/features/admin/dangkyhoatdongkhoangsan/khaithackhoangsan/ktks-thongtindangky/ktks-donvihanhchinh/ktks-donvihanhchinh-list/ktks-donvihanhchinh-list.component';
import { KtksLoaikhoangsanComponent } from 'src/app/features/admin/dangkyhoatdongkhoangsan/khaithackhoangsan/ktks-thongtindangky/ktks-loaikhoangsan/ktks-loaikhoangsan.component';
import { KtksLoaikhoangsanIoComponent } from 'src/app/features/admin/dangkyhoatdongkhoangsan/khaithackhoangsan/ktks-thongtindangky/ktks-loaikhoangsan/ktks-loaikhoangsan-io/ktks-loaikhoangsan-io.component';
import { KtksLoaikhoangsanListComponent } from 'src/app/features/admin/dangkyhoatdongkhoangsan/khaithackhoangsan/ktks-thongtindangky/ktks-loaikhoangsan/ktks-loaikhoangsan-list/ktks-loaikhoangsan-list.component';
import { TtksThongtindangkyComponent } from './tanthukhoangsan/ttks-thongtindangky/ttks-thongtindangky.component';
import { DangkytanthukhoangsanIoComponent } from './tanthukhoangsan/ttks-thongtindangky/dangkytanthukhoangsan-io/dangkytanthukhoangsan-io.component';
import { DangkytanthugiahanIoComponent } from './tanthukhoangsan/ttks-thongtindangky/dangkytanthugiahan-io/dangkytanthugiahan-io.component';


@NgModule({
  declarations: [
    ThamdokhoangsanIoComponent,
    ThamdokhoangsanListComponent,
    DangkyhoatdongkhoangsanComponent,
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
    KtksThongtindangkyComponent,
    DangkykhaithacgiahanIoComponent,
    DangkykhaithackhoangsanIoComponent,
    TanthukhoangsanListComponent,
    TanthukhoangsanIoComponent,
    TralaigiayphepListComponent,
    TralaigiayphepIoComponent,
    DongcuamoListComponent,
    DongcuamoIoComponent,
    ChuyennhuongquyenListComponent,
    ChuyennhuongquyenIoComponent,
    PheduyettruluongkhoangsanIoComponent,
    PheduyettruluongkhoangsanListComponent,
    DaugiaquyenIoComponent,
    DaugiaquyenListComponent,
    DangkykhaithaccaisoiIoComponent,
    DangkykhaithacdieuchinhIoComponent,
    DangkykhaithacvlxdIoComponent,
    DangkykhaithackhoangsanduanIoComponent,
    KhuvuckhaithacListComponent,
    KhuvuckhaithacIoComponent,
    KtksDonvihanhchinhComponent,
    KtksDonvihanhchinhIoComponent,
    KtksDonvihanhchinhListComponent,
    KtksLoaikhoangsanComponent,
    KtksLoaikhoangsanIoComponent,
    KtksLoaikhoangsanListComponent,
    KtksCongtrinhkhaithacComponent,
    KtksCongtrinhkhaithacIoComponent,
    KtksCongtrinhkhaithacListComponent,
    TtksThongtindangkyComponent,
    DangkytanthukhoangsanIoComponent,
    DangkytanthugiahanIoComponent,
  ],
  exports: [
  ],
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
    HosoGiaytoModule
  ],
  entryComponents: [
    DmCanhanOptionComponent,
    DmTochucOptionComponent,
    KhuvuctoadoIoComponent,
    KhuvucthamdoIoComponent,
    LoaikhoangsanIoComponent,
    DonvihanhchinhIoComponent,
    CongtrinhthamdoIoComponent,
    DangkythamdokhoangsanIoComponent,
    DangkythamdogiahanIoComponent,
    KhaithackhoangsanIoComponent,
    DangkykhaithacgiahanIoComponent,
    DangkykhaithackhoangsanIoComponent,
    DangkykhaithaccaisoiIoComponent,
    DangkykhaithacdieuchinhIoComponent,
    DangkykhaithacvlxdIoComponent,
    DangkykhaithackhoangsanduanIoComponent,
    GiayphepOptionComponent,
    KtksDonvihanhchinhIoComponent,
    KtksLoaikhoangsanIoComponent,
    KtksCongtrinhkhaithacIoComponent,
    DangkytanthukhoangsanIoComponent,
  ],
  providers: [
    {provide: OWL_MOMENT_DATE_TIME_ADAPTER_OPTIONS, useValue: {useUtc: true}},
    // { provide: OWL_DATE_TIME_LOCALE, useValue: 'vi' },
    // { provide: DateTimeAdapter, useClass: MomentDateTimeAdapter, deps: [OWL_DATE_TIME_LOCALE] },
    {provide: OWL_DATE_TIME_FORMATS, useValue: MY_CUSTOM_FORMATS},
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
