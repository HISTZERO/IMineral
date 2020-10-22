import { Component, ComponentFactoryResolver, EventEmitter, Input, OnInit, Output, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { CommonServiceShared } from 'src/app/services/utilities/common-service';
import { CapPhepKhaiThacActionEnum, CpChuyenNhuongThamDoKhaiThacChiTietTabEnum, LoaiCapPhepEnum } from 'src/app/shared/constants/enum';
import { DefaultValue } from 'src/app/shared/constants/global-var';
import { HoSoGiayToFacadeService } from 'src/app/services/admin/hosogiayto/hosogiayto-facade.service';
import { ContentContainerDirective } from 'src/app/shared/directives/content-container/content-container.directive';
import { CpTdksDonvihanhchinhListComponent } from "src/app/features/admin/capphephoatdongkhoangsan/cpthamdokhoangsan/cp-tdks-thongtincapphep/cp-tdks-donvihanhchinh/cp-tdks-donvihanhchinh-list/cp-tdks-donvihanhchinh-list.component";

@Component({
  selector: 'app-cp-chuyennhuong-thongtincapphep',
  templateUrl: './cp-chuyennhuong-thongtincapphep.component.html',
  styleUrls: ['./cp-chuyennhuong-thongtincapphep.component.scss']
})
export class CpChuyennhuongThongtincapphepComponent implements OnInit {
  @ViewChild('thongTinChuyenNhuongThamDoKhaiThacTabs', { static: false }) thongTinChuyenNhuongThamDoKhaiThacTabs;
  @ViewChild(ContentContainerDirective, { static: true }) contentContainer: ContentContainerDirective;
  @ViewChild(Type, { static: true }) public matSidenav: MatSidenav;
  @ViewChild(Type, { read: ViewContainerRef, static: true }) public content: ViewContainerRef;
  @ViewChild("capPhepChuyenNhuongDvhc", { static: false }) capPhepChuyenNhuongDvhc: CpTdksDonvihanhchinhListComponent;
  // tslint:disable-next-line: no-input-rename
  @Input("allowAutoInit") allowAutoInit = true;
  // tslint:disable-next-line: no-output-rename
  @Output("selectCurrentFormStateEvent") selectCurrentFormStateEvent: EventEmitter<number> = new EventEmitter();
  // Lưu trữ thông tin đăng ký tab
  public TabType = CpChuyenNhuongThamDoKhaiThacChiTietTabEnum;
  // Lưu trữ dữ liệu id giấy phép
  public idgiayphep;
  // Chứa thuộc tính hiển thị tab thiết bị
  public showTabThietBi: boolean = false;
  // Lưu trữ trạng thais tab được select
  public loadedTabState: any = {
    [CpChuyenNhuongThamDoKhaiThacChiTietTabEnum.ThongTinChiTiet]: false,
    [CpChuyenNhuongThamDoKhaiThacChiTietTabEnum.DonViHanhChinh]: false,
    [CpChuyenNhuongThamDoKhaiThacChiTietTabEnum.LoaiKhoangSan]: false,
    [CpChuyenNhuongThamDoKhaiThacChiTietTabEnum.KhuVucKhaiThac]: false,
    [CpChuyenNhuongThamDoKhaiThacChiTietTabEnum.CongTrinhKhaiThac]: false
  };

  public disabledTabState: any = {
    [CpChuyenNhuongThamDoKhaiThacChiTietTabEnum.ThongTinChiTiet]: true,
    [CpChuyenNhuongThamDoKhaiThacChiTietTabEnum.DonViHanhChinh]: true,
    [CpChuyenNhuongThamDoKhaiThacChiTietTabEnum.LoaiKhoangSan]: true,
    [CpChuyenNhuongThamDoKhaiThacChiTietTabEnum.KhuVucKhaiThac]: true,
    [CpChuyenNhuongThamDoKhaiThacChiTietTabEnum.CongTrinhKhaiThac]: true,
  };

  // Lưu trữ dữ liệu action hiện tại
  public currentAction: number;
  // Chứa dữ liệu translate
  public dataTranslate: any;
  // Lưu trữ dữ liệu idcapphepkhaithac
  private idcapphepkhaithac: string;
  // Lưu trữ dữ liệu giấy phép
  private itemGiayPhep: any;

  constructor(private cfr: ComponentFactoryResolver,
    private translate: TranslateService,
    private activatedRoute: ActivatedRoute,
    public commonService: CommonServiceShared,
    private hoSoGiayToFacadeService: HoSoGiayToFacadeService,) { }

  async ngOnInit() {
    // Lấy dữ liệu translate
    await this.getDataTranslate();
    console.log(this.allowAutoInit);
    if (this.allowAutoInit) {
      await this.manualDataInit();
    }
  }

  /**
   * hàm lấy dữ liệu translate
   */
  async getDataTranslate() {
    // Lấy ra biến translate của hệ thống
    this.dataTranslate = await this.translate
      .getTranslation(this.translate.getDefaultLang())
      .toPromise();
  }

  async manualDataInit() {
    this.activatedRoute.queryParamMap.subscribe((param: any) => {
      if (param && param.params && param.params.idgiayphep) {
        this.idgiayphep = param.params.idgiayphep;
      }
    });

    if (this.idgiayphep === DefaultValue.Null || this.idgiayphep === DefaultValue.Undefined || this.idgiayphep.trim() === DefaultValue.Empty) {
      this.commonService.showDialogWarning(this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.thongtincapphep.informedNotExistedGiayPhepKhaiThac);
      return;
    }

    this.itemGiayPhep = await this.getGiayPhepById(this.idgiayphep);

    if (this.itemGiayPhep && (this.itemGiayPhep.loaicapphep === LoaiCapPhepEnum.KhaiThacKhoangSanLamVatLieuXayDung || this.itemGiayPhep.loaicapphep === LoaiCapPhepEnum.ThuHoiCatSoiDuAnNaoVetKhoiThong)) {
      this.showTabThietBi = true;
    }

    if (!this.itemGiayPhep) {
      this.commonService.showDialogWarning(this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.thongtincapphep.informedNotExistedGiayPhepKhaiThac);
      return;
    }

    await this.showCapPhepViewComponent();

    this.thongTinChuyenNhuongThamDoKhaiThacTabs.realignInkBar();
    return true;
  }

  setDisabledTabState(actionType: number) {
    switch (actionType) {
      case CapPhepKhaiThacActionEnum.Add: {
        this.disabledTabState[CpChuyenNhuongThamDoKhaiThacChiTietTabEnum.ThongTinChiTiet] = false;
        this.disabledTabState[CpChuyenNhuongThamDoKhaiThacChiTietTabEnum.DonViHanhChinh] = true;
        this.disabledTabState[CpChuyenNhuongThamDoKhaiThacChiTietTabEnum.LoaiKhoangSan] = true;
        this.disabledTabState[CpChuyenNhuongThamDoKhaiThacChiTietTabEnum.KhuVucKhaiThac] = true;
        this.disabledTabState[CpChuyenNhuongThamDoKhaiThacChiTietTabEnum.CongTrinhKhaiThac] = true;
        break;
      }
      case CapPhepKhaiThacActionEnum.Edit: {
        this.disabledTabState[CpChuyenNhuongThamDoKhaiThacChiTietTabEnum.ThongTinChiTiet] = false;
        this.disabledTabState[CpChuyenNhuongThamDoKhaiThacChiTietTabEnum.DonViHanhChinh] = false;
        this.disabledTabState[CpChuyenNhuongThamDoKhaiThacChiTietTabEnum.LoaiKhoangSan] = false;
        this.disabledTabState[CpChuyenNhuongThamDoKhaiThacChiTietTabEnum.KhuVucKhaiThac] = false;
        this.disabledTabState[CpChuyenNhuongThamDoKhaiThacChiTietTabEnum.CongTrinhKhaiThac] = false;
        break;
      }
      default: {
        this.disabledTabState[CpChuyenNhuongThamDoKhaiThacChiTietTabEnum.ThongTinChiTiet] = true;
        this.disabledTabState[CpChuyenNhuongThamDoKhaiThacChiTietTabEnum.DonViHanhChinh] = true;
        this.disabledTabState[CpChuyenNhuongThamDoKhaiThacChiTietTabEnum.LoaiKhoangSan] = true;
        this.disabledTabState[CpChuyenNhuongThamDoKhaiThacChiTietTabEnum.KhuVucKhaiThac] = true;
        this.disabledTabState[CpChuyenNhuongThamDoKhaiThacChiTietTabEnum.CongTrinhKhaiThac] = true;
        break;
      }
    }
  }

  private resetLoadedTabState() {
    this.loadedTabState[CpChuyenNhuongThamDoKhaiThacChiTietTabEnum.DonViHanhChinh] = false;
    this.loadedTabState[CpChuyenNhuongThamDoKhaiThacChiTietTabEnum.LoaiKhoangSan] = false;
    this.loadedTabState[CpChuyenNhuongThamDoKhaiThacChiTietTabEnum.KhuVucKhaiThac] = false;
    this.loadedTabState[CpChuyenNhuongThamDoKhaiThacChiTietTabEnum.CongTrinhKhaiThac] = false;
  }

  getCapPhepKhaiThacFormState(action: number) {
    this.currentAction = action;
    this.setDisabledTabState(this.currentAction);
    this.resetLoadedTabState();
    this.selectCurrentFormStateEvent.emit(this.currentAction);
  }

  getIdCapPhepKhaiThac(idCapPhepKhaiThac: string) {
    this.idcapphepkhaithac = idCapPhepKhaiThac;
  }

  /**
   * Lấy dữ liệu hồ sơ theo IdGiayPhep
   * @param IdGiayPhep
   */
  private async getGiayPhepById(IdGiayPhep: string) {
    const giayPhepService = this.hoSoGiayToFacadeService.getGiayPhepService();
    const itemGiayPhep = await giayPhepService.getByid(IdGiayPhep).toPromise();
    return itemGiayPhep;
  }

  private async showCapPhepViewComponent() {
    let factory: any;
    this.contentContainer.viewContainerRef.clear();
    if (this.itemGiayPhep) {
     // factory = this.cfr.resolveComponentFactory(CpCnThamdokhaithacIoComponent);
    }
    const viewContainerRef = this.contentContainer.viewContainerRef;
    const componentRef: any = viewContainerRef.createComponent(factory);
    componentRef.instance.idgiayphep = this.itemGiayPhep.idgiayphep;
    componentRef.instance.matSidenav = this.matSidenav;
    componentRef.instance.content = this.content;
    componentRef.instance.itemGiayPhep = this.itemGiayPhep;
    componentRef.instance.selectCurrentFormStateEvent.subscribe(event => this.getCapPhepKhaiThacFormState(event));
    componentRef.instance.selectIdCapPhepKhaiThacEvent.subscribe(event => this.getIdCapPhepKhaiThac(event));
  }

  async tabChange(index: any) {
    if (index === CpChuyenNhuongThamDoKhaiThacChiTietTabEnum.DonViHanhChinh && !this.loadedTabState[CpChuyenNhuongThamDoKhaiThacChiTietTabEnum.DonViHanhChinh]) {
      // this.capPhepChuyenNhuongDvhc.matSidenav = this.matSidenav;
      // this.capPhepChuyenNhuongDvhc.content = this.content;
      // this.capPhepChuyenNhuongDvhc.idcapphepkhaithac = this.idcapphepkhaithac;
      //this.loadedTabState[CpChuyenNhuongThamDoKhaiThacChiTietTabEnum.DonViHanhChinh] = await this.capPhepChuyenNhuongDvhc.manualDataInit();
    } else if (index === CpChuyenNhuongThamDoKhaiThacChiTietTabEnum.LoaiKhoangSan && !this.loadedTabState[CpChuyenNhuongThamDoKhaiThacChiTietTabEnum.LoaiKhoangSan]) {
      // this.capPhepChuyenNhuongLoaiKhoangSan.matSidenav = this.matSidenav;
      // this.capPhepChuyenNhuongLoaiKhoangSan.content = this.content;
      // this.capPhepChuyenNhuongLoaiKhoangSan.idcapphepkhaithac = this.idcapphepkhaithac;
      //this.loadedTabState[CpChuyenNhuongThamDoKhaiThacChiTietTabEnum.LoaiKhoangSan] = await this.capPhepChuyenNhuongLoaiKhoangSan.manualDataInit();
    } else if (index === CpChuyenNhuongThamDoKhaiThacChiTietTabEnum.KhuVucKhaiThac && !this.loadedTabState[CpChuyenNhuongThamDoKhaiThacChiTietTabEnum.KhuVucKhaiThac]) {
      // this.capPhepChuyenNhuongKhuVuc.matSidenav = this.matSidenav;
      // this.capPhepChuyenNhuongKhuVuc.content = this.content;
      // this.capPhepChuyenNhuongKhuVuc.idcapphepkhaithac = this.idcapphepkhaithac;
      // this.capPhepChuyenNhuongKhuVuc.loaicapphep = this.itemGiayPhep.loaicapphep;
      // this.loadedTabState[CpChuyenNhuongThamDoKhaiThacChiTietTabEnum.KhuVucKhaiThac] = await this.capPhepChuyenNhuongKhuVuc.manualDataInit();
    } else if (index === CpChuyenNhuongThamDoKhaiThacChiTietTabEnum.CongTrinhKhaiThac && !this.loadedTabState[CpChuyenNhuongThamDoKhaiThacChiTietTabEnum.CongTrinhKhaiThac]) {
      // this.capPhepChuyenNhuongCongTrinh.matSidenav = this.matSidenav;
      // this.capPhepChuyenNhuongCongTrinh.content = this.content;
      // this.capPhepChuyenNhuongCongTrinh.idcapphepkhaithac = this.idcapphepkhaithac;
      // this.loadedTabState[CpChuyenNhuongThamDoKhaiThacChiTietTabEnum.CongTrinhKhaiThac] = await this.capPhepChuyenNhuongCongTrinh.manualDataInit();
    } 
  }

}
