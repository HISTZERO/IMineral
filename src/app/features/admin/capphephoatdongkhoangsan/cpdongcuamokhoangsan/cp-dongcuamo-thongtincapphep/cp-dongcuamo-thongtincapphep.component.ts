import { Component, ComponentFactoryResolver, EventEmitter, Input, OnInit, Output, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { CommonServiceShared } from 'src/app/services/utilities/common-service';
import { CapPhepKhaiThacActionEnum, CpDongCuaMoChiTietTabEnum, LoaiCapPhepEnum } from 'src/app/shared/constants/enum';
import { DefaultValue } from 'src/app/shared/constants/global-var';
import { HoSoGiayToFacadeService } from 'src/app/services/admin/hosogiayto/hosogiayto-facade.service';
import { ContentContainerDirective } from 'src/app/shared/directives/content-container/content-container.directive';
import { CpKtksKhaithackhoangsanIoComponent } from "src/app/features/admin/capphephoatdongkhoangsan/cpkhaithackhoangsan/cp-ktks-thongtincapphep/cp-ktks-khaithackhoangsan-io/cp-ktks-khaithackhoangsan-io.component";
import { CpKtksDonvihanhchinhListComponent } from "src/app/features/admin/capphephoatdongkhoangsan/cpkhaithackhoangsan/cp-ktks-thongtincapphep/cp-ktks-donvihanhchinh/cp-ktks-donvihanhchinh-list/cp-ktks-donvihanhchinh-list.component";
import { CpKtksLoaikhoangsanListComponent } from "src/app/features/admin/capphephoatdongkhoangsan/cpkhaithackhoangsan/cp-ktks-thongtincapphep/cp-ktks-loaikhoangsan/cp-ktks-loaikhoangsan-list/cp-ktks-loaikhoangsan-list.component";
import { CpKtksCongtrinhkhaithacListComponent } from "src/app/features/admin/capphephoatdongkhoangsan/cpkhaithackhoangsan/cp-ktks-thongtincapphep/cp-ktks-congtrinhkhaithac/cp-ktks-congtrinhkhaithac-list/cp-ktks-congtrinhkhaithac-list.component";
import { CpKtksKhuvuckhaithacListComponent } from "src/app/features/admin/capphephoatdongkhoangsan/cpkhaithackhoangsan/cp-ktks-thongtincapphep/cp-ktks-khuvuckhaithac/cp-ktks-khuvuckhaithac-list/cp-ktks-khuvuckhaithac-list.component";


@Component({
  selector: 'app-cp-dongcuamo-thongtincapphep',
  templateUrl: './cp-dongcuamo-thongtincapphep.component.html',
  styleUrls: ['./cp-dongcuamo-thongtincapphep.component.scss']
})
export class CpDongcuamoThongtincapphepComponent implements OnInit {

  @ViewChild('thongTinDongCuaMoTabs', { static: false }) thongTinDongCuaMoTabs;
  @ViewChild(ContentContainerDirective, { static: true }) contentContainer: ContentContainerDirective;
  @ViewChild(Type, { static: true }) public matSidenav: MatSidenav;
  @ViewChild(Type, { read: ViewContainerRef, static: true }) public content: ViewContainerRef;
  @ViewChild("capPhepDongCuaMoDvhc", { static: false }) capPhepDongCuaMoDvhc: CpKtksDonvihanhchinhListComponent;
  @ViewChild("capPhepDongCuaMoLoaiKhoangSan", { static: false }) capPhepDongCuaMoLoaiKhoangSan: CpKtksLoaikhoangsanListComponent;
  @ViewChild("capPhepCongTrinhDongCuaMo", { static: false }) capPhepCongTrinhDongCuaMo: CpKtksCongtrinhkhaithacListComponent;
  @ViewChild("capPhepDongCuaMoKhuVuc", { static: false }) capPhepDongCuaMoKhuVuc: CpKtksKhuvuckhaithacListComponent;
  // tslint:disable-next-line: no-input-rename
  @Input("allowAutoInit") allowAutoInit = true;
  // tslint:disable-next-line: no-output-rename
  @Output("selectCurrentFormStateEvent") selectCurrentFormStateEvent: EventEmitter<number> = new EventEmitter();
  // Lưu trữ thông tin đăng ký tab
  public TabType = CpDongCuaMoChiTietTabEnum;
  // Lưu trữ dữ liệu id giấy phép
  public idgiayphep;
  // Chứa tên tab khu vực đóng cửa mỏ 1 phần
  public titleNameTabKhuVuc: string = "";
  // Lưu trữ trạng thais tab được select
  public loadedTabState: any = {
    [CpDongCuaMoChiTietTabEnum.ThongTinChiTiet]: false,
    [CpDongCuaMoChiTietTabEnum.DonViHanhChinh]: false,
    [CpDongCuaMoChiTietTabEnum.LoaiKhoangSan]: false,
    [CpDongCuaMoChiTietTabEnum.KhuVucDongCuaMo]: false,
    [CpDongCuaMoChiTietTabEnum.CongTrinhDongCuaMo]: false,
  };

  public disabledTabState: any = {
    [CpDongCuaMoChiTietTabEnum.ThongTinChiTiet]: true,
    [CpDongCuaMoChiTietTabEnum.DonViHanhChinh]: true,
    [CpDongCuaMoChiTietTabEnum.LoaiKhoangSan]: true,
    [CpDongCuaMoChiTietTabEnum.KhuVucDongCuaMo]: true,
    [CpDongCuaMoChiTietTabEnum.CongTrinhDongCuaMo]: true,
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

    if (this.itemGiayPhep && this.itemGiayPhep.loaicapphep === LoaiCapPhepEnum.DongCuaMotPhanDienTichKhuVucKhaiThacKhoangSan) {
      this.titleNameTabKhuVuc = this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.thongtincapphep.khuVucDongCuaMoMotPhanTabTile;
    } else {
      this.titleNameTabKhuVuc = this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.thongtincapphep.khuVucDongCuaMoTabTile;
    }

    if (!this.itemGiayPhep) {
      this.commonService.showDialogWarning(this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.thongtincapphep.informedNotExistedGiayPhepKhaiThac);
      return;
    }

    await this.showCapPhepViewComponent();

    this.thongTinDongCuaMoTabs.realignInkBar();
    return true;
  }

  setDisabledTabState(actionType: number) {
    switch (actionType) {
      case CapPhepKhaiThacActionEnum.Add: {
        this.disabledTabState[CpDongCuaMoChiTietTabEnum.ThongTinChiTiet] = false;
        this.disabledTabState[CpDongCuaMoChiTietTabEnum.DonViHanhChinh] = true;
        this.disabledTabState[CpDongCuaMoChiTietTabEnum.LoaiKhoangSan] = true;
        this.disabledTabState[CpDongCuaMoChiTietTabEnum.KhuVucDongCuaMo] = true;
        this.disabledTabState[CpDongCuaMoChiTietTabEnum.CongTrinhDongCuaMo] = true;
        break;
      }
      case CapPhepKhaiThacActionEnum.Edit: {
        this.disabledTabState[CpDongCuaMoChiTietTabEnum.ThongTinChiTiet] = false;
        this.disabledTabState[CpDongCuaMoChiTietTabEnum.DonViHanhChinh] = false;
        this.disabledTabState[CpDongCuaMoChiTietTabEnum.LoaiKhoangSan] = false;
        this.disabledTabState[CpDongCuaMoChiTietTabEnum.KhuVucDongCuaMo] = false;
        this.disabledTabState[CpDongCuaMoChiTietTabEnum.CongTrinhDongCuaMo] = false;
        break;
      }
      default: {
        this.disabledTabState[CpDongCuaMoChiTietTabEnum.ThongTinChiTiet] = true;
        this.disabledTabState[CpDongCuaMoChiTietTabEnum.DonViHanhChinh] = true;
        this.disabledTabState[CpDongCuaMoChiTietTabEnum.LoaiKhoangSan] = true;
        this.disabledTabState[CpDongCuaMoChiTietTabEnum.KhuVucDongCuaMo] = true;
        this.disabledTabState[CpDongCuaMoChiTietTabEnum.CongTrinhDongCuaMo] = true;
        break;
      }
    }
  }

  private resetLoadedTabState() {
    this.loadedTabState[CpDongCuaMoChiTietTabEnum.DonViHanhChinh] = false;
    this.loadedTabState[CpDongCuaMoChiTietTabEnum.LoaiKhoangSan] = false;
    this.loadedTabState[CpDongCuaMoChiTietTabEnum.KhuVucDongCuaMo] = false;
    this.loadedTabState[CpDongCuaMoChiTietTabEnum.CongTrinhDongCuaMo] = false;
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
  }

  async tabChange(index: any) {
    if (index === CpDongCuaMoChiTietTabEnum.DonViHanhChinh && !this.loadedTabState[CpDongCuaMoChiTietTabEnum.DonViHanhChinh]) {
      this.capPhepDongCuaMoDvhc.matSidenav = this.matSidenav;
      this.capPhepDongCuaMoDvhc.content = this.content;
      this.capPhepDongCuaMoDvhc.idcapphepkhaithac = this.idcapphepkhaithac;
      this.loadedTabState[CpDongCuaMoChiTietTabEnum.DonViHanhChinh] = await this.capPhepDongCuaMoDvhc.manualDataInit();
    } else if (index === CpDongCuaMoChiTietTabEnum.LoaiKhoangSan && !this.loadedTabState[CpDongCuaMoChiTietTabEnum.LoaiKhoangSan]) {
      this.capPhepDongCuaMoLoaiKhoangSan.matSidenav = this.matSidenav;
      this.capPhepDongCuaMoLoaiKhoangSan.content = this.content;
      this.capPhepDongCuaMoLoaiKhoangSan.idcapphepkhaithac = this.idcapphepkhaithac;
      this.loadedTabState[CpDongCuaMoChiTietTabEnum.LoaiKhoangSan] = await this.capPhepDongCuaMoLoaiKhoangSan.manualDataInit();
    } else if (index === CpDongCuaMoChiTietTabEnum.KhuVucDongCuaMo && !this.loadedTabState[CpDongCuaMoChiTietTabEnum.KhuVucDongCuaMo]) {
      this.capPhepDongCuaMoKhuVuc.matSidenav = this.matSidenav;
      this.capPhepDongCuaMoKhuVuc.content = this.content;
      this.capPhepDongCuaMoKhuVuc.idcapphepkhaithac = this.idcapphepkhaithac;
      this.capPhepDongCuaMoKhuVuc.loaicapphep = this.itemGiayPhep.loaicapphep;
      this.loadedTabState[CpDongCuaMoChiTietTabEnum.KhuVucDongCuaMo] = await this.capPhepDongCuaMoKhuVuc.manualDataInit();
    } else if (index === CpDongCuaMoChiTietTabEnum.CongTrinhDongCuaMo && !this.loadedTabState[CpDongCuaMoChiTietTabEnum.CongTrinhDongCuaMo]) {
      this.capPhepCongTrinhDongCuaMo.matSidenav = this.matSidenav;
      this.capPhepCongTrinhDongCuaMo.content = this.content;
      this.capPhepCongTrinhDongCuaMo.idcapphepkhaithac = this.idcapphepkhaithac;
      this.loadedTabState[CpDongCuaMoChiTietTabEnum.CongTrinhDongCuaMo] = await this.capPhepCongTrinhDongCuaMo.manualDataInit();
    }
  }

}
