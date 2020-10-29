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
import { TranslateService } from "@ngx-translate/core";
import { ActivatedRoute } from "@angular/router";

import { ContentContainerDirective } from "src/app/shared/directives/content-container/content-container.directive";
import { DangKyTanThuKhoangSanTabEnum, DangKyThamDoActionEnum, LoaiCapPhepEnum } from "src/app/shared/constants/enum";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { DangKyHoatDongKhoangSanFacadeService } from "src/app/services/admin/dangkyhoatdongkhoangsan/dangkyhoatdongkhoangsan-facade.service";
import { MatSidenav } from "@angular/material/sidenav";
import { DangkytanthukhoangsanIoComponent } from "src/app/features/admin/dangkyhoatdongkhoangsan/tanthukhoangsan/ttks-thongtindangky/dangkytanthukhoangsan-io/dangkytanthukhoangsan-io.component";
import { DangkytanthugiahanIoComponent } from "src/app/features/admin/dangkyhoatdongkhoangsan/tanthukhoangsan/ttks-thongtindangky/dangkytanthugiahan-io/dangkytanthugiahan-io.component";
import { TtksDonvihanhchinhListComponent } from "src/app/features/admin/dangkyhoatdongkhoangsan/tanthukhoangsan/ttks-thongtindangky/ttks-donvihanhchinh/ttks-donvihanhchinh-list/ttks-donvihanhchinh-list.component";
import { TtksLoaikhoangsanListComponent } from "src/app/features/admin/dangkyhoatdongkhoangsan/tanthukhoangsan/ttks-thongtindangky/ttks-loaikhoangsan/ttks-loaikhoangsan-list/ttks-loaikhoangsan-list.component";
import { TtksKhuvuctanthuListComponent } from "src/app/features/admin/dangkyhoatdongkhoangsan/tanthukhoangsan/ttks-thongtindangky/ttks-khuvuctanthu/ttks-khuvuctanthu-list/ttks-khuvuctanthu-list.component";
import { HoSoGiayToFacadeService } from "src/app/services/admin/hosogiayto/hosogiayto-facade.service";

export const DangKyTanThuKhoangSanComponent: any = {
  [LoaiCapPhepEnum.KhaiThacTanThuKhoangSan]: DangkytanthukhoangsanIoComponent,
  [LoaiCapPhepEnum.KhaiThacTanThuKhoangSanGiaHan]: DangkytanthugiahanIoComponent,
};

@Component({
  selector: 'app-ttks-thongtindangky',
  templateUrl: './ttks-thongtindangky.component.html',
  styleUrls: ['./ttks-thongtindangky.component.scss']
})
export class TtksThongtindangkyComponent implements OnInit {

  @ViewChild('thongTinDangKyTanThuTabs', { static: false }) thongTinDangKyTanThuTabs;
  @ViewChild(ContentContainerDirective, { static: true }) contentContainer: ContentContainerDirective;
  @ViewChild(Type, { static: true }) public matSidenav: MatSidenav;
  @ViewChild(Type, { read: ViewContainerRef, static: true }) public content: ViewContainerRef;
  @ViewChild("dangKyTanThuKsDvhc", { static: false }) dangKyTanThuKsDvhc: TtksDonvihanhchinhListComponent;
  @ViewChild("dangKyTanThuLoaiKhoangSan", { static: false }) dangKyTanThuLoaiKhoangSan: TtksLoaikhoangsanListComponent;
  @ViewChild("dangKyTanThuKhuVuc", { static: false }) dangKyTanThuKhuVuc: TtksKhuvuctanthuListComponent;
  // tslint:disable-next-line: no-input-rename
  @Input("allowAutoInit") allowAutoInit = true;
  // tslint:disable-next-line: no-output-rename
  @Output("selectCurrentFormStateEvent") selectCurrentFormStateEvent: EventEmitter<number> = new EventEmitter();
  // Lưu trữ thông tin đăng ký tab
  public TabType = DangKyTanThuKhoangSanTabEnum;
  // Check đăng ký tận thu khoáng sản
  isDangKyTanThuKhoangSan = false;
  // Lưu trữ dữ liệu id hồ sơ
  public idhoso;
  // Chứa goemetry
  public geoMetry: string;
  // Lưu trữ trạng thais tab được select
  public loadedTabState: any = {
    [DangKyTanThuKhoangSanTabEnum.ThongTinChiTiet]: false,
    [DangKyTanThuKhoangSanTabEnum.DonViHanhChinh]: false,
    [DangKyTanThuKhoangSanTabEnum.LoaiKhoangSan]: false,
    [DangKyTanThuKhoangSanTabEnum.KhuVucTanThu]: false,
    [DangKyTanThuKhoangSanTabEnum.BanDoKhuVuc]: false,
  };

  public disabledTabState: any = {
    [DangKyTanThuKhoangSanTabEnum.ThongTinChiTiet]: true,
    [DangKyTanThuKhoangSanTabEnum.DonViHanhChinh]: true,
    [DangKyTanThuKhoangSanTabEnum.LoaiKhoangSan]: true,
    [DangKyTanThuKhoangSanTabEnum.KhuVucTanThu]: true,
    [DangKyTanThuKhoangSanTabEnum.BanDoKhuVuc]: true,
  };

  // Lưu trữ dữ liệu action hiện tại
  public currentAction: number;
  // Chứa dữ liệu translate
  public dataTranslate: any;
  // Lưu trữ dữ liệu iddangkytanthu
  private iddangkytanthu: string;
  // Lưu trữ dữ liệu hồ sơ
  private itemHoSo: any;

  constructor(private cfr: ComponentFactoryResolver,
    private translate: TranslateService,
    private activatedRoute: ActivatedRoute,
    public commonService: CommonServiceShared,
    private dangKyHoatDongKhoangSanFacadeService: DangKyHoatDongKhoangSanFacadeService,
    private hoSoGiayToFacadeService: HoSoGiayToFacadeService) {
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
      if (param && param.params && param.params.idhoso) {
        this.idhoso = param.params.idhoso;
      }
    });

    if (this.idhoso === null || this.idhoso === undefined) {
      this.commonService.showDialogWarning(this.dataTranslate.DANGKYHOATDONGKHOANGSAN.thongtindangky.informedNotExistedHoSoDangKyThamDo);
      return;
    }

    this.itemHoSo = await this.getHoSoById(this.idhoso);

    if (!this.itemHoSo) {
      this.commonService.showDialogWarning(this.dataTranslate.DANGKYHOATDONGKHOANGSAN.thongtindangky.informedNotExistedHoSoDangKyThamDo);
      return;
    }

    if (this.itemHoSo.loaicapphep === LoaiCapPhepEnum.KhaiThacTanThuKhoangSan) {
      this.isDangKyTanThuKhoangSan = true;
    }

    await this.showDangKyViewComponent();
    this.thongTinDangKyTanThuTabs.selectedIndex = this.TabType.ThongTinChiTiet;
    this.thongTinDangKyTanThuTabs.realignInkBar();
    return true;
  }

  setDisabledTabState(actionType: number) {
    switch (actionType) {
      case DangKyThamDoActionEnum.Add: {
        this.disabledTabState[DangKyTanThuKhoangSanTabEnum.ThongTinChiTiet] = false;
        this.disabledTabState[DangKyTanThuKhoangSanTabEnum.DonViHanhChinh] = true;
        this.disabledTabState[DangKyTanThuKhoangSanTabEnum.LoaiKhoangSan] = true;
        this.disabledTabState[DangKyTanThuKhoangSanTabEnum.KhuVucTanThu] = true;
        this.disabledTabState[DangKyTanThuKhoangSanTabEnum.BanDoKhuVuc] = true;
        break;
      }
      case DangKyThamDoActionEnum.Edit: {
        this.disabledTabState[DangKyTanThuKhoangSanTabEnum.ThongTinChiTiet] = false;
        this.disabledTabState[DangKyTanThuKhoangSanTabEnum.DonViHanhChinh] = false;
        this.disabledTabState[DangKyTanThuKhoangSanTabEnum.LoaiKhoangSan] = false;
        this.disabledTabState[DangKyTanThuKhoangSanTabEnum.KhuVucTanThu] = false;
        this.disabledTabState[DangKyTanThuKhoangSanTabEnum.BanDoKhuVuc] = false;
        break;
      }
      default: {
        this.disabledTabState[DangKyTanThuKhoangSanTabEnum.ThongTinChiTiet] = true;
        this.disabledTabState[DangKyTanThuKhoangSanTabEnum.DonViHanhChinh] = true;
        this.disabledTabState[DangKyTanThuKhoangSanTabEnum.LoaiKhoangSan] = true;
        this.disabledTabState[DangKyTanThuKhoangSanTabEnum.KhuVucTanThu] = true;
        this.disabledTabState[DangKyTanThuKhoangSanTabEnum.BanDoKhuVuc] = true;
        break;
      }
    }
  }

  getDangKyTanThuFormState(action: number) {
    this.currentAction = action;
    this.setDisabledTabState(this.currentAction);
    this.resetLoadedTabState();
    this.selectCurrentFormStateEvent.emit(this.currentAction);
  }

  getIdDangKyTanThu(idDangKyTanThu: string) {
    this.iddangkytanthu = idDangKyTanThu;
  }

  /**
   * Lấy dữ liệu hồ sơ theo IdHoSo
   * @param idHoSo
   */
  private async getHoSoById(idHoSo: string) {
    const hoSoService = this.hoSoGiayToFacadeService.getHoSoService();
    const itemHoSo = await hoSoService.getByid(idHoSo).toPromise();
    return itemHoSo;
  }

  private async showDangKyViewComponent() {
    let factory: any;
    this.contentContainer.viewContainerRef.clear();

    if (this.itemHoSo) {
      factory = this.cfr.resolveComponentFactory(DangKyTanThuKhoangSanComponent[this.itemHoSo.loaicapphep]);
      const viewContainerRef = this.contentContainer.viewContainerRef;
      const componentRef: any = viewContainerRef.createComponent(factory);
      componentRef.instance.idhoso = this.itemHoSo.idhoso;
      componentRef.instance.matSidenav = this.matSidenav;
      componentRef.instance.content = this.content;
      componentRef.instance.selectCurrentFormStateEvent.subscribe(event => this.getDangKyTanThuFormState(event));
      componentRef.instance.selectIdDangKyTanThuKhoangSanEvent.subscribe(event => this.getIdDangKyTanThu(event));
      componentRef.instance.selectGeometryEvent.subscribe(event => this.getGeometry(event));
    }
  }

  private resetLoadedTabState() {
    this.loadedTabState[DangKyTanThuKhoangSanTabEnum.DonViHanhChinh] = false;
    this.loadedTabState[DangKyTanThuKhoangSanTabEnum.LoaiKhoangSan] = false;
    this.loadedTabState[DangKyTanThuKhoangSanTabEnum.KhuVucTanThu] = false;
    this.loadedTabState[DangKyTanThuKhoangSanTabEnum.BanDoKhuVuc] = false;
  }

  async tabChange(index: any) {
    if (index === DangKyTanThuKhoangSanTabEnum.DonViHanhChinh && !this.loadedTabState[DangKyTanThuKhoangSanTabEnum.DonViHanhChinh]) {
      this.dangKyTanThuKsDvhc.matSidenav = this.matSidenav;
      this.dangKyTanThuKsDvhc.content = this.content;
      this.dangKyTanThuKsDvhc.iddangkytanthu = this.iddangkytanthu;
      this.loadedTabState[DangKyTanThuKhoangSanTabEnum.DonViHanhChinh] = await this.dangKyTanThuKsDvhc.manualDataInit();
    } else if (index === DangKyTanThuKhoangSanTabEnum.LoaiKhoangSan && !this.loadedTabState[DangKyTanThuKhoangSanTabEnum.LoaiKhoangSan]) {
      this.dangKyTanThuLoaiKhoangSan.matSidenav = this.matSidenav;
      this.dangKyTanThuLoaiKhoangSan.content = this.content;
      this.dangKyTanThuLoaiKhoangSan.iddangkytanthu = this.iddangkytanthu;
      this.loadedTabState[DangKyTanThuKhoangSanTabEnum.LoaiKhoangSan] = await this.dangKyTanThuLoaiKhoangSan.manualDataInit();
    } else if (index === DangKyTanThuKhoangSanTabEnum.KhuVucTanThu && !this.loadedTabState[DangKyTanThuKhoangSanTabEnum.KhuVucTanThu]) {
      this.dangKyTanThuKhuVuc.matSidenav = this.matSidenav;
      this.dangKyTanThuKhuVuc.content = this.content;
      this.dangKyTanThuKhuVuc.iddangkytanthu = this.iddangkytanthu;
      this.dangKyTanThuKhuVuc.loaicapphep = this.itemHoSo.loaicapphep;
      this.loadedTabState[DangKyTanThuKhoangSanTabEnum.KhuVucTanThu] = await this.dangKyTanThuKhuVuc.manualDataInit();
    }

  }

  /**
   * Lấy dữ liệu geometry
   */
  private getGeometry(geo: string) {
    this.geoMetry = geo;
  }

  /**
   * Hàm load lại dữ liệu tab thông tin chi tiết
   */
  public reloadDataTabThongTinChiTiet() {
    this.showDangKyViewComponent();
  }
}
