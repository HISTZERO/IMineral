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
import { CapphephoatdongkhoangsanComponent } from "src/app/features/admin/capphephoatdongkhoangsan/capphephoatdongkhoangsan.component";
import { CpthamdokhoangsanListComponent } from 'src/app/features/admin/capphephoatdongkhoangsan/cpthamdokhoangsan/cpthamdokhoangsan-list/cpthamdokhoangsan-list.component';
import { CpthamdokhoangsanIoComponent } from 'src/app/features/admin/capphephoatdongkhoangsan/cpthamdokhoangsan/cpthamdokhoangsan-io/cpthamdokhoangsan-io.component';
import {HosoGiaytoModule} from "src/app/features/admin/hosogiayto/hosogiayto.module";
import { HosoOptionComponent } from 'src/app/features/admin/hosogiayto/hoso/hoso-option/hoso-option.component';
import { CpkhaithackhoangsanListComponent } from 'src/app/features/admin/capphephoatdongkhoangsan/cpkhaithackhoangsan/cpkhaithackhoangsan-list/cpkhaithackhoangsan-list.component';
import { CpkhaithackhoangsanIoComponent } from 'src/app/features/admin/capphephoatdongkhoangsan/cpkhaithackhoangsan/cpkhaithackhoangsan-io/cpkhaithackhoangsan-io.component';
import { CppheduyettruluongkhoangsanListComponent } from 'src/app/features/admin/capphephoatdongkhoangsan/cppheduyettruluongkhoangsan/cppheduyettruluongkhoangsan-list/cppheduyettruluongkhoangsan-list.component';
import { CppheduyettruluongkhoangsanIoComponent } from 'src/app/features/admin/capphephoatdongkhoangsan/cppheduyettruluongkhoangsan/cppheduyettruluongkhoangsan-io/cppheduyettruluongkhoangsan-io.component';
import { CptanthukhoangsanIoComponent } from 'src/app/features/admin/capphephoatdongkhoangsan/cptanthukhoangsan/cptanthukhoangsan-io/cptanthukhoangsan-io.component';
import { CptanthukhoangsanListComponent } from 'src/app/features/admin/capphephoatdongkhoangsan/cptanthukhoangsan/cptanthukhoangsan-list/cptanthukhoangsan-list.component';
import { CpdongcuamokhoangsanIoComponent } from 'src/app/features/admin/capphephoatdongkhoangsan/cpdongcuamokhoangsan/cpdongcuamokhoangsan-io/cpdongcuamokhoangsan-io.component';
import { CpdongcuamokhoangsanListComponent } from 'src/app/features/admin/capphephoatdongkhoangsan/cpdongcuamokhoangsan/cpdongcuamokhoangsan-list/cpdongcuamokhoangsan-list.component';
import { CpdaugiaquyenkhaithackhoangsanIoComponent } from 'src/app/features/admin/capphephoatdongkhoangsan/cpdaugiaquyenkhaithackhoangsan/cpdaugiaquyenkhaithackhoangsan-io/cpdaugiaquyenkhaithackhoangsan-io.component';
import { CpdaugiaquyenkhaithackhoangsanListComponent } from 'src/app/features/admin/capphephoatdongkhoangsan/cpdaugiaquyenkhaithackhoangsan/cpdaugiaquyenkhaithackhoangsan-list/cpdaugiaquyenkhaithackhoangsan-list.component';
import { CptralaigiayphepthamdokhaithackhoangsanIoComponent } from 'src/app/features/admin/capphephoatdongkhoangsan/cptralaigiayphepthamdokhaithackhoangsan/cptralaigiayphepthamdokhaithackhoangsan-io/cptralaigiayphepthamdokhaithackhoangsan-io.component';
import { CptralaigiayphepthamdokhaithackhoangsanListComponent } from 'src/app/features/admin/capphephoatdongkhoangsan/cptralaigiayphepthamdokhaithackhoangsan/cptralaigiayphepthamdokhaithackhoangsan-list/cptralaigiayphepthamdokhaithackhoangsan-list.component';
import { CpchuyennhuongquyenthamdokhaithackhoangsanIoComponent } from 'src/app/features/admin/capphephoatdongkhoangsan/cpchuyennhuongquyenthamdokhaithackhoangsan/cpchuyennhuongquyenthamdokhaithackhoangsan-io/cpchuyennhuongquyenthamdokhaithackhoangsan-io.component';
import { CpchuyennhuongquyenthamdokhaithackhoangsanListComponent } from 'src/app/features/admin/capphephoatdongkhoangsan/cpchuyennhuongquyenthamdokhaithackhoangsan/cpchuyennhuongquyenthamdokhaithackhoangsan-list/cpchuyennhuongquyenthamdokhaithackhoangsan-list.component';
import { CpTdksThongtincapphepComponent } from 'src/app/features/admin/capphephoatdongkhoangsan/cpthamdokhoangsan/cp-tdks-thongtincapphep/cp-tdks-thongtincapphep.component';
import { CpTdksThamdokhoangsanIoComponent } from 'src/app/features/admin/capphephoatdongkhoangsan/cpthamdokhoangsan/cp-tdks-thongtincapphep/cp-tdks-thamdokhoangsan-io/cp-tdks-thamdokhoangsan-io.component';
import { CpTdksDonvihanhchinhIoComponent } from 'src/app/features/admin/capphephoatdongkhoangsan/cpthamdokhoangsan/cp-tdks-thongtincapphep/cp-tdks-donvihanhchinh/cp-tdks-donvihanhchinh-io/cp-tdks-donvihanhchinh-io.component';
import { CpTdksDonvihanhchinhListComponent } from 'src/app/features/admin/capphephoatdongkhoangsan/cpthamdokhoangsan/cp-tdks-thongtincapphep/cp-tdks-donvihanhchinh/cp-tdks-donvihanhchinh-list/cp-tdks-donvihanhchinh-list.component';
import { CpTdksDonvihanhchinhComponent } from 'src/app/features/admin/capphephoatdongkhoangsan/cpthamdokhoangsan/cp-tdks-thongtincapphep/cp-tdks-donvihanhchinh/cp-tdks-donvihanhchinh.component';
import { CpTdksLoaikhoangsanComponent } from 'src/app/features/admin/capphephoatdongkhoangsan/cpthamdokhoangsan/cp-tdks-thongtincapphep/cp-tdks-loaikhoangsan/cp-tdks-loaikhoangsan.component';
import { CpTdksLoaikhoangsanIoComponent } from 'src/app/features/admin/capphephoatdongkhoangsan/cpthamdokhoangsan/cp-tdks-thongtincapphep/cp-tdks-loaikhoangsan/cp-tdks-loaikhoangsan-io/cp-tdks-loaikhoangsan-io.component';
import { CpTdksLoaikhoangsanListComponent } from 'src/app/features/admin/capphephoatdongkhoangsan/cpthamdokhoangsan/cp-tdks-thongtincapphep/cp-tdks-loaikhoangsan/cp-tdks-loaikhoangsan-list/cp-tdks-loaikhoangsan-list.component';
import { CpTdksCongtrinhthamdoComponent } from 'src/app/features/admin/capphephoatdongkhoangsan/cpthamdokhoangsan/cp-tdks-thongtincapphep/cp-tdks-congtrinhthamdo/cp-tdks-congtrinhthamdo.component';
import { CpTdksCongtrinhthamdoIoComponent } from 'src/app/features/admin/capphephoatdongkhoangsan/cpthamdokhoangsan/cp-tdks-thongtincapphep/cp-tdks-congtrinhthamdo/cp-tdks-congtrinhthamdo-io/cp-tdks-congtrinhthamdo-io.component';
import { CpTdksCongtrinhthamdoListComponent } from 'src/app/features/admin/capphephoatdongkhoangsan/cpthamdokhoangsan/cp-tdks-thongtincapphep/cp-tdks-congtrinhthamdo/cp-tdks-congtrinhthamdo-list/cp-tdks-congtrinhthamdo-list.component';
import { CpTdksKhuvucthamdoComponent } from 'src/app/features/admin/capphephoatdongkhoangsan/cpthamdokhoangsan/cp-tdks-thongtincapphep/cp-tdks-khuvucthamdo/cp-tdks-khuvucthamdo.component';
import { CpTdksKhuvucthamdoIoComponent } from 'src/app/features/admin/capphephoatdongkhoangsan/cpthamdokhoangsan/cp-tdks-thongtincapphep/cp-tdks-khuvucthamdo/cp-tdks-khuvucthamdo-io/cp-tdks-khuvucthamdo-io.component';
import { CpTdksKhuvucthamdoListComponent } from 'src/app/features/admin/capphephoatdongkhoangsan/cpthamdokhoangsan/cp-tdks-thongtincapphep/cp-tdks-khuvucthamdo/cp-tdks-khuvucthamdo-list/cp-tdks-khuvucthamdo-list.component';

@NgModule({
  declarations: [
  CapphephoatdongkhoangsanComponent,
  CpthamdokhoangsanListComponent,
  CpthamdokhoangsanIoComponent,
  CpkhaithackhoangsanListComponent,
  CpkhaithackhoangsanIoComponent,
  CppheduyettruluongkhoangsanListComponent,
  CppheduyettruluongkhoangsanIoComponent,
  CptanthukhoangsanListComponent,
  CptanthukhoangsanIoComponent,
  CpdongcuamokhoangsanListComponent,
  CpdongcuamokhoangsanIoComponent,
  CpdaugiaquyenkhaithackhoangsanListComponent,
  CpdaugiaquyenkhaithackhoangsanIoComponent,
  CptralaigiayphepthamdokhaithackhoangsanListComponent,
  CptralaigiayphepthamdokhaithackhoangsanIoComponent,
  CpchuyennhuongquyenthamdokhaithackhoangsanListComponent,
  CpchuyennhuongquyenthamdokhaithackhoangsanIoComponent,
  CpTdksThongtincapphepComponent,
  CpTdksThamdokhoangsanIoComponent,
  CpTdksDonvihanhchinhComponent,
  CpTdksDonvihanhchinhListComponent,
  CpTdksDonvihanhchinhIoComponent,
  CpTdksLoaikhoangsanComponent,
  CpTdksLoaikhoangsanListComponent,
  CpTdksLoaikhoangsanIoComponent,
  CpTdksCongtrinhthamdoComponent,
  CpTdksCongtrinhthamdoListComponent,
  CpTdksCongtrinhthamdoIoComponent,
  CpTdksKhuvucthamdoComponent,
  CpTdksKhuvucthamdoListComponent,
  CpTdksKhuvucthamdoIoComponent
  ],
  exports: [
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
    HosoGiaytoModule
  ],
  entryComponents: [
    HosoOptionComponent,
    CpTdksThamdokhoangsanIoComponent,
    CpTdksDonvihanhchinhIoComponent,
    CpTdksLoaikhoangsanIoComponent,
    CpTdksCongtrinhthamdoIoComponent,
    CpTdksKhuvucthamdoIoComponent
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
