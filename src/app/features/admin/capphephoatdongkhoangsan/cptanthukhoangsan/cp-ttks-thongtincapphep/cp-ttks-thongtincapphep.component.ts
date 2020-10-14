import {
  Component,
  ComponentFactoryResolver,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Type,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {ContentContainerDirective} from "src/app/shared/directives/content-container/content-container.directive";
import {CpTdksDonvihanhchinhListComponent} from "src/app/features/admin/capphephoatdongkhoangsan/cpthamdokhoangsan/cp-tdks-thongtincapphep/cp-tdks-donvihanhchinh/cp-tdks-donvihanhchinh-list/cp-tdks-donvihanhchinh-list.component";
import {CpTdksLoaikhoangsanListComponent} from "src/app/features/admin/capphephoatdongkhoangsan/cpthamdokhoangsan/cp-tdks-thongtincapphep/cp-tdks-loaikhoangsan/cp-tdks-loaikhoangsan-list/cp-tdks-loaikhoangsan-list.component";
import {CpTdksCongtrinhthamdoListComponent} from "src/app/features/admin/capphephoatdongkhoangsan/cpthamdokhoangsan/cp-tdks-thongtincapphep/cp-tdks-congtrinhthamdo/cp-tdks-congtrinhthamdo-list/cp-tdks-congtrinhthamdo-list.component";
import {CpTdksKhuvucthamdoListComponent} from "src/app/features/admin/capphephoatdongkhoangsan/cpthamdokhoangsan/cp-tdks-thongtincapphep/cp-tdks-khuvucthamdo/cp-tdks-khuvucthamdo-list/cp-tdks-khuvucthamdo-list.component";
import {CapPhepThamDoActionEnum, CpTanThuKhoangSanTabEnum, LoaiCapPhepEnum} from "src/app/shared/constants/enum";
import {TranslateService} from "@ngx-translate/core";
import {ActivatedRoute} from "@angular/router";
import {CommonServiceShared} from "src/app/services/utilities/common-service";
import {HoSoGiayToFacadeService} from "src/app/services/admin/hosogiayto/hosogiayto-facade.service";
import {DefaultValue} from "src/app/shared/constants/global-var";
import {CapPhepThamDoKhoangSanComponent} from "src/app/features/admin/capphephoatdongkhoangsan/cpthamdokhoangsan/cp-tdks-thongtincapphep/cp-tdks-thongtincapphep.component";
import {MatSidenav} from "@angular/material/sidenav";

@Component({
  selector: 'app-cp-ttks-thongtincapphep',
  templateUrl: './cp-ttks-thongtincapphep.component.html',
  styleUrls: ['./cp-ttks-thongtincapphep.component.scss']
})
export class CpTtksThongtincapphepComponent implements OnInit {

  @ViewChild('thongTinCapPhepThamDoTabs', {static: false}) thongTinCapPhepThamDoTabs;
  @ViewChild(ContentContainerDirective, {static: true}) contentContainer: ContentContainerDirective;
  @ViewChild(Type, {static: true}) public matSidenav: MatSidenav;
  @ViewChild(Type, {read: ViewContainerRef, static: true}) public content: ViewContainerRef;
  @ViewChild("capPhepThamDoDvhc", {static: false}) capPhepThamDoDvhc: CpTdksDonvihanhchinhListComponent;
  @ViewChild("capPhepThamDoLoaiKhoangSan", {static: false}) capPhepThamDoLoaiKhoangSan: CpTdksLoaikhoangsanListComponent;
  @ViewChild("capPhepThamDoCongTrinh", {static: false}) capPhepThamDoCongTrinh: CpTdksCongtrinhthamdoListComponent;
  @ViewChild("capPhepThamDoKhuVuc", {static: false}) capPhepThamDoKhuVuc: CpTdksKhuvucthamdoListComponent;
  // tslint:disable-next-line: no-input-rename
  @Input("allowAutoInit") allowAutoInit = true;
  // tslint:disable-next-line: no-output-rename
  @Output("selectCurrentFormStateEvent") selectCurrentFormStateEvent: EventEmitter<number> = new EventEmitter();
  // Lưu trữ thông tin đăng ký tab
  public TabType = CpTanThuKhoangSanTabEnum;
  // Lưu trữ dữ liệu id giấy phép
  public idgiayphep;
  // Lưu trữ trạng thais tab được select
  public loadedTabState: any = {
    [CpTanThuKhoangSanTabEnum.ThongTinChiTiet]: false,
    [CpTanThuKhoangSanTabEnum.DonViHanhChinh]: false,
    [CpTanThuKhoangSanTabEnum.LoaiKhoangSan]: false,
    [CpTanThuKhoangSanTabEnum.KhuVucTanThu]: false,
  };

  public disabledTabState: any = {
    [CpTanThuKhoangSanTabEnum.ThongTinChiTiet]: true,
    [CpTanThuKhoangSanTabEnum.DonViHanhChinh]: true,
    [CpTanThuKhoangSanTabEnum.LoaiKhoangSan]: true,
    [CpTanThuKhoangSanTabEnum.KhuVucTanThu]: true,
  };

  // Lưu trữ dữ liệu action hiện tại
  public currentAction: number;
  // Chứa dữ liệu translate
  public dataTranslate: any;
  // Lưu trữ dữ liệu idcappheptanthu
  private idcappheptanthu: string;
  // Lưu trữ dữ liệu giấy phép
  private itemGiayPhep: any;

  constructor(private cfr: ComponentFactoryResolver,
              private translate: TranslateService,
              private activatedRoute: ActivatedRoute,
              public commonService: CommonServiceShared,
              private hoSoGiayToFacadeService: HoSoGiayToFacadeService,) {
  }

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
      this.commonService.showDialogWarning(this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.thongtincapphep.informedNotExistedGiayPhepThamDo);
      return;
    }

    this.itemGiayPhep = await this.getGiayPhepById(this.idgiayphep);

    if (!this.itemGiayPhep) {
      this.commonService.showDialogWarning(this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.thongtincapphep.informedNotExistedGiayPhepThamDo);
      return;
    }

    await this.showCapPhepViewComponent();

    this.thongTinCapPhepThamDoTabs.realignInkBar();
    return true;
  }

  setDisabledTabState(actionType: number) {
    switch (actionType) {
      case CapPhepThamDoActionEnum.Add: {
        this.disabledTabState[CpTanThuKhoangSanTabEnum.ThongTinChiTiet] = false;
        this.disabledTabState[CpTanThuKhoangSanTabEnum.DonViHanhChinh] = true;
        this.disabledTabState[CpTanThuKhoangSanTabEnum.LoaiKhoangSan] = true;
        this.disabledTabState[CpTanThuKhoangSanTabEnum.KhuVucTanThu] = true;
        break;
      }
      case CapPhepThamDoActionEnum.Edit: {
        this.disabledTabState[CpTanThuKhoangSanTabEnum.ThongTinChiTiet] = false;
        this.disabledTabState[CpTanThuKhoangSanTabEnum.DonViHanhChinh] = false;
        this.disabledTabState[CpTanThuKhoangSanTabEnum.LoaiKhoangSan] = false;
        this.disabledTabState[CpTanThuKhoangSanTabEnum.KhuVucTanThu] = false;
        break;
      }
      default: {
        this.disabledTabState[CpTanThuKhoangSanTabEnum.ThongTinChiTiet] = true;
        this.disabledTabState[CpTanThuKhoangSanTabEnum.DonViHanhChinh] = true;
        this.disabledTabState[CpTanThuKhoangSanTabEnum.LoaiKhoangSan] = true;
        this.disabledTabState[CpTanThuKhoangSanTabEnum.KhuVucTanThu] = true;
        break;
      }
    }
  }

  private resetLoadedTabState() {
    this.loadedTabState[CpTanThuKhoangSanTabEnum.DonViHanhChinh] = false;
    this.loadedTabState[CpTanThuKhoangSanTabEnum.LoaiKhoangSan] = false;
    this.loadedTabState[CpTanThuKhoangSanTabEnum.KhuVucTanThu] = false;
  }

  getCapPhepTanThuFormState(action: number) {
    this.currentAction = action;
    this.setDisabledTabState(this.currentAction);
    this.resetLoadedTabState();
    this.selectCurrentFormStateEvent.emit(this.currentAction);
  }

  getIdCapPhepTanThu(idCapPhepTanThu: string) {
    this.idcappheptanthu = idCapPhepTanThu;
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
      factory = this.cfr.resolveComponentFactory(CapPhepThamDoKhoangSanComponent[this.itemGiayPhep.loaicapphep]);
    }

    const viewContainerRef = this.contentContainer.viewContainerRef;
    const componentRef: any = viewContainerRef.createComponent(factory);
    componentRef.instance.idgiayphep = this.itemGiayPhep.idgiayphep;
    componentRef.instance.matSidenav = this.matSidenav;
    componentRef.instance.content = this.content;
    componentRef.instance.itemGiayPhep = this.itemGiayPhep;

    if (this.itemGiayPhep.loaicapphep === LoaiCapPhepEnum.ThamDoGiaHan) {
      componentRef.instance.disabledDienTichTraLai = false;
    } else {
      componentRef.instance.disabledDienTichTraLai = true;
    }

    componentRef.instance.selectCurrentFormStateEvent.subscribe(event => this.getCapPhepTanThuFormState(event));
    componentRef.instance.selectIdCapPhepThamDoEvent.subscribe(event => this.getIdCapPhepTanThu(event));
  }

  async tabChange(index: any) {
  //   if (index === CpTanThuKhoangSanTabEnum.DonViHanhChinh && !this.loadedTabState[CpTanThuKhoangSanTabEnum.DonViHanhChinh]) {
  //     this.capPhepThamDoDvhc.matSidenav = this.matSidenav;
  //     this.capPhepThamDoDvhc.content = this.content;
  //     this.capPhepThamDoDvhc.idcappheptanthu = this.idcappheptanthu;
  //     this.loadedTabState[CpTanThuKhoangSanTabEnum.DonViHanhChinh] = await this.capPhepThamDoDvhc.manualDataInit();
  //   } else if (index === CpTanThuKhoangSanTabEnum.LoaiKhoangSan && !this.loadedTabState[CpTanThuKhoangSanTabEnum.LoaiKhoangSan]) {
  //     this.capPhepThamDoLoaiKhoangSan.matSidenav = this.matSidenav;
  //     this.capPhepThamDoLoaiKhoangSan.content = this.content;
  //     this.capPhepThamDoLoaiKhoangSan.idcappheptanthu = this.idcappheptanthu;
  //     this.loadedTabState[CpTanThuKhoangSanTabEnum.LoaiKhoangSan] = await this.capPhepThamDoLoaiKhoangSan.manualDataInit();
  //   } else if (index === CpTanThuKhoangSanTabEnum.KhuVucTanThu && !this.loadedTabState[CpTanThuKhoangSanTabEnum.KhuVucTanThu]) {
  //     this.capPhepThamDoKhuVuc.matSidenav = this.matSidenav;
  //     this.capPhepThamDoKhuVuc.content = this.content;
  //     this.capPhepThamDoKhuVuc.idcappheptanthu = this.idcappheptanthu;
  //     this.capPhepThamDoKhuVuc.loaicapphep = this.itemGiayPhep.loaicapphep;
  //     this.loadedTabState[CpTanThuKhoangSanTabEnum.KhuVucTanThu] = await this.capPhepThamDoKhuVuc.manualDataInit();
  //   }
  }
}
