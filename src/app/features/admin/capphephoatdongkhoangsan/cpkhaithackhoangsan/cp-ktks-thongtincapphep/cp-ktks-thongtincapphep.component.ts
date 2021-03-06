import { Component, ComponentFactoryResolver, EventEmitter, Input, OnInit, Output, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { CommonServiceShared } from 'src/app/services/utilities/common-service';
import { CapPhepKhaiThacActionEnum, CpKhaiThacKhoangSanChiTietTabEnum, LoaiCapPhepEnum } from 'src/app/shared/constants/enum';
import { DefaultValue } from 'src/app/shared/constants/global-var';
import { HoSoGiayToFacadeService } from 'src/app/services/admin/hosogiayto/hosogiayto-facade.service';
import { ContentContainerDirective } from 'src/app/shared/directives/content-container/content-container.directive';
import { CpKtksKhaithackhoangsanIoComponent } from "src/app/features/admin/capphephoatdongkhoangsan/cpkhaithackhoangsan/cp-ktks-thongtincapphep/cp-ktks-khaithackhoangsan-io/cp-ktks-khaithackhoangsan-io.component";
import { CpKtksDonvihanhchinhListComponent } from "src/app/features/admin/capphephoatdongkhoangsan/cpkhaithackhoangsan/cp-ktks-thongtincapphep/cp-ktks-donvihanhchinh/cp-ktks-donvihanhchinh-list/cp-ktks-donvihanhchinh-list.component";
import { CpKtksLoaikhoangsanListComponent } from "src/app/features/admin/capphephoatdongkhoangsan/cpkhaithackhoangsan/cp-ktks-thongtincapphep/cp-ktks-loaikhoangsan/cp-ktks-loaikhoangsan-list/cp-ktks-loaikhoangsan-list.component";
import { CpKtksCongtrinhkhaithacListComponent } from "src/app/features/admin/capphephoatdongkhoangsan/cpkhaithackhoangsan/cp-ktks-thongtincapphep/cp-ktks-congtrinhkhaithac/cp-ktks-congtrinhkhaithac-list/cp-ktks-congtrinhkhaithac-list.component";
import { CpKtksKhuvuckhaithacListComponent } from "src/app/features/admin/capphephoatdongkhoangsan/cpkhaithackhoangsan/cp-ktks-thongtincapphep/cp-ktks-khuvuckhaithac/cp-ktks-khuvuckhaithac-list/cp-ktks-khuvuckhaithac-list.component";
import { CpKtksThietbikhaithacListComponent } from "src/app/features/admin/capphephoatdongkhoangsan/cpkhaithackhoangsan/cp-ktks-thongtincapphep/cp-ktks-thietbikhaithac/cp-ktks-thietbikhaithac-list/cp-ktks-thietbikhaithac-list.component";

@Component({
  selector: 'app-cp-ktks-thongtincapphep',
  templateUrl: './cp-ktks-thongtincapphep.component.html',
  styleUrls: ['./cp-ktks-thongtincapphep.component.scss']
})
export class CpKtksThongtincapphepComponent implements OnInit {
  @ViewChild('thongTinCapPhepKhaiThacTabs', { static: false }) thongTinCapPhepKhaiThacTabs;
  @ViewChild(ContentContainerDirective, { static: true }) contentContainer: ContentContainerDirective;
  @ViewChild(Type, { static: true }) public matSidenav: MatSidenav;
  @ViewChild(Type, { read: ViewContainerRef, static: true }) public content: ViewContainerRef;
  @ViewChild("capPhepKhaiThacDvhc", { static: false }) capPhepKhaiThacDvhc: CpKtksDonvihanhchinhListComponent;
  @ViewChild("capPhepKhaiThacLoaiKhoangSan", { static: false }) capPhepKhaiThacLoaiKhoangSan: CpKtksLoaikhoangsanListComponent;
  @ViewChild("capPhepCongTrinhKhaiThac", { static: false }) capPhepCongTrinhKhaiThac: CpKtksCongtrinhkhaithacListComponent;
  @ViewChild("capPhepKhaiThacKhuVuc", { static: false }) capPhepKhaiThacKhuVuc: CpKtksKhuvuckhaithacListComponent;
  @ViewChild("capPhepKhaiThacThietBi", { static: false }) capPhepKhaiThacThietBi: CpKtksThietbikhaithacListComponent;
  // tslint:disable-next-line: no-input-rename
  @Input("allowAutoInit") allowAutoInit = true;
  // tslint:disable-next-line: no-output-rename
  @Output("selectCurrentFormStateEvent") selectCurrentFormStateEvent: EventEmitter<number> = new EventEmitter();
  // Lưu trữ thông tin đăng ký tab
  public TabType = CpKhaiThacKhoangSanChiTietTabEnum;
  // Lưu trữ dữ liệu id giấy phép
  public idgiayphep;
  // Chứa thuộc tính hiển thị tab thiết bị
  public showTabThietBi: boolean = false;
  // Chứa geometry
  public geoMetry: string;
  // Lưu trữ trạng thais tab được select
  public loadedTabState: any = {
    [CpKhaiThacKhoangSanChiTietTabEnum.ThongTinChiTiet]: false,
    [CpKhaiThacKhoangSanChiTietTabEnum.DonViHanhChinh]: false,
    [CpKhaiThacKhoangSanChiTietTabEnum.LoaiKhoangSan]: false,
    [CpKhaiThacKhoangSanChiTietTabEnum.KhuVucKhaiThac]: false,
    [CpKhaiThacKhoangSanChiTietTabEnum.CongTrinhKhaiThac]: false,
    [CpKhaiThacKhoangSanChiTietTabEnum.ThietBiKhaiThac]: false,
    [CpKhaiThacKhoangSanChiTietTabEnum.BanDoKhuVuc]: false,
  };

  public disabledTabState: any = {
    [CpKhaiThacKhoangSanChiTietTabEnum.ThongTinChiTiet]: true,
    [CpKhaiThacKhoangSanChiTietTabEnum.DonViHanhChinh]: true,
    [CpKhaiThacKhoangSanChiTietTabEnum.LoaiKhoangSan]: true,
    [CpKhaiThacKhoangSanChiTietTabEnum.KhuVucKhaiThac]: true,
    [CpKhaiThacKhoangSanChiTietTabEnum.CongTrinhKhaiThac]: true,
    [CpKhaiThacKhoangSanChiTietTabEnum.ThietBiKhaiThac]: true,
    [CpKhaiThacKhoangSanChiTietTabEnum.BanDoKhuVuc]: true
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

    this.thongTinCapPhepKhaiThacTabs.realignInkBar();
    return true;
  }

  setDisabledTabState(actionType: number) {
    switch (actionType) {
      case CapPhepKhaiThacActionEnum.Add: {
        this.disabledTabState[CpKhaiThacKhoangSanChiTietTabEnum.ThongTinChiTiet] = false;
        this.disabledTabState[CpKhaiThacKhoangSanChiTietTabEnum.DonViHanhChinh] = true;
        this.disabledTabState[CpKhaiThacKhoangSanChiTietTabEnum.LoaiKhoangSan] = true;
        this.disabledTabState[CpKhaiThacKhoangSanChiTietTabEnum.KhuVucKhaiThac] = true;
        this.disabledTabState[CpKhaiThacKhoangSanChiTietTabEnum.CongTrinhKhaiThac] = true;
        this.disabledTabState[CpKhaiThacKhoangSanChiTietTabEnum.ThietBiKhaiThac] = true;
        this.disabledTabState[CpKhaiThacKhoangSanChiTietTabEnum.BanDoKhuVuc] = true;
        break;
      }
      case CapPhepKhaiThacActionEnum.Edit: {
        this.disabledTabState[CpKhaiThacKhoangSanChiTietTabEnum.ThongTinChiTiet] = false;
        this.disabledTabState[CpKhaiThacKhoangSanChiTietTabEnum.DonViHanhChinh] = false;
        this.disabledTabState[CpKhaiThacKhoangSanChiTietTabEnum.LoaiKhoangSan] = false;
        this.disabledTabState[CpKhaiThacKhoangSanChiTietTabEnum.KhuVucKhaiThac] = false;
        this.disabledTabState[CpKhaiThacKhoangSanChiTietTabEnum.CongTrinhKhaiThac] = false;
        this.disabledTabState[CpKhaiThacKhoangSanChiTietTabEnum.ThietBiKhaiThac] = false;
        this.disabledTabState[CpKhaiThacKhoangSanChiTietTabEnum.BanDoKhuVuc] = false;
        break;
      }
      default: {
        this.disabledTabState[CpKhaiThacKhoangSanChiTietTabEnum.ThongTinChiTiet] = true;
        this.disabledTabState[CpKhaiThacKhoangSanChiTietTabEnum.DonViHanhChinh] = true;
        this.disabledTabState[CpKhaiThacKhoangSanChiTietTabEnum.LoaiKhoangSan] = true;
        this.disabledTabState[CpKhaiThacKhoangSanChiTietTabEnum.KhuVucKhaiThac] = true;
        this.disabledTabState[CpKhaiThacKhoangSanChiTietTabEnum.CongTrinhKhaiThac] = true;
        this.disabledTabState[CpKhaiThacKhoangSanChiTietTabEnum.ThietBiKhaiThac] = true;
        this.disabledTabState[CpKhaiThacKhoangSanChiTietTabEnum.BanDoKhuVuc] = true;
        break;
      }
    }
  }

  private resetLoadedTabState() {
    this.loadedTabState[CpKhaiThacKhoangSanChiTietTabEnum.DonViHanhChinh] = false;
    this.loadedTabState[CpKhaiThacKhoangSanChiTietTabEnum.LoaiKhoangSan] = false;
    this.loadedTabState[CpKhaiThacKhoangSanChiTietTabEnum.KhuVucKhaiThac] = false;
    this.loadedTabState[CpKhaiThacKhoangSanChiTietTabEnum.CongTrinhKhaiThac] = false;
    this.loadedTabState[CpKhaiThacKhoangSanChiTietTabEnum.ThietBiKhaiThac] = false;
    this.loadedTabState[CpKhaiThacKhoangSanChiTietTabEnum.BanDoKhuVuc] = false;
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
      factory = this.cfr.resolveComponentFactory(CpKtksKhaithackhoangsanIoComponent);
    }

    const viewContainerRef = this.contentContainer.viewContainerRef;
    const componentRef: any = viewContainerRef.createComponent(factory);
    componentRef.instance.idgiayphep = this.itemGiayPhep.idgiayphep;
    componentRef.instance.matSidenav = this.matSidenav;
    componentRef.instance.content = this.content;
    componentRef.instance.itemGiayPhep = this.itemGiayPhep;
    componentRef.instance.selectCurrentFormStateEvent.subscribe(event => this.getCapPhepKhaiThacFormState(event));
    componentRef.instance.selectIdCapPhepKhaiThacEvent.subscribe(event => this.getIdCapPhepKhaiThac(event));
    componentRef.instance.selectGeometryEvent.subscribe(event => this.getGeometry(event));
  }

  async tabChange(index: any) {
    if (index === CpKhaiThacKhoangSanChiTietTabEnum.DonViHanhChinh && !this.loadedTabState[CpKhaiThacKhoangSanChiTietTabEnum.DonViHanhChinh]) {
      this.capPhepKhaiThacDvhc.matSidenav = this.matSidenav;
      this.capPhepKhaiThacDvhc.content = this.content;
      this.capPhepKhaiThacDvhc.idcapphepkhaithac = this.idcapphepkhaithac;
      this.loadedTabState[CpKhaiThacKhoangSanChiTietTabEnum.DonViHanhChinh] = await this.capPhepKhaiThacDvhc.manualDataInit();
    } else if (index === CpKhaiThacKhoangSanChiTietTabEnum.LoaiKhoangSan && !this.loadedTabState[CpKhaiThacKhoangSanChiTietTabEnum.LoaiKhoangSan]) {
      this.capPhepKhaiThacLoaiKhoangSan.matSidenav = this.matSidenav;
      this.capPhepKhaiThacLoaiKhoangSan.content = this.content;
      this.capPhepKhaiThacLoaiKhoangSan.idcapphepkhaithac = this.idcapphepkhaithac;
      this.loadedTabState[CpKhaiThacKhoangSanChiTietTabEnum.LoaiKhoangSan] = await this.capPhepKhaiThacLoaiKhoangSan.manualDataInit();
    } else if (index === CpKhaiThacKhoangSanChiTietTabEnum.KhuVucKhaiThac && !this.loadedTabState[CpKhaiThacKhoangSanChiTietTabEnum.KhuVucKhaiThac]) {
      this.capPhepKhaiThacKhuVuc.matSidenav = this.matSidenav;
      this.capPhepKhaiThacKhuVuc.content = this.content;
      this.capPhepKhaiThacKhuVuc.idcapphepkhaithac = this.idcapphepkhaithac;
      this.capPhepKhaiThacKhuVuc.loaicapphep = this.itemGiayPhep.loaicapphep;
      this.loadedTabState[CpKhaiThacKhoangSanChiTietTabEnum.KhuVucKhaiThac] = await this.capPhepKhaiThacKhuVuc.manualDataInit();
    } else if (index === CpKhaiThacKhoangSanChiTietTabEnum.CongTrinhKhaiThac && !this.loadedTabState[CpKhaiThacKhoangSanChiTietTabEnum.CongTrinhKhaiThac]) {
      this.capPhepCongTrinhKhaiThac.matSidenav = this.matSidenav;
      this.capPhepCongTrinhKhaiThac.content = this.content;
      this.capPhepCongTrinhKhaiThac.idcapphepkhaithac = this.idcapphepkhaithac;
      this.loadedTabState[CpKhaiThacKhoangSanChiTietTabEnum.CongTrinhKhaiThac] = await this.capPhepCongTrinhKhaiThac.manualDataInit();
    } else if (index === CpKhaiThacKhoangSanChiTietTabEnum.ThietBiKhaiThac && !this.loadedTabState[CpKhaiThacKhoangSanChiTietTabEnum.ThietBiKhaiThac]) {
      if (this.showTabThietBi) {
        this.capPhepKhaiThacThietBi.matSidenav = this.matSidenav;
        this.capPhepKhaiThacThietBi.content = this.content;
        this.capPhepKhaiThacThietBi.idcapphepkhaithac = this.idcapphepkhaithac;
        this.loadedTabState[CpKhaiThacKhoangSanChiTietTabEnum.ThietBiKhaiThac] = await this.capPhepKhaiThacThietBi.manualDataInit();
      }
    }
  }

  private getGeometry(geo: string) {
    this.geoMetry = geo;
  }

  /**
   * Hàm load lại dữ liệu tab thông tin chi tiết
   */
  public reloadDataTabThongTinChiTiet() {
    this.showCapPhepViewComponent();
  }
}
