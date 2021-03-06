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
import { MatSidenav } from "@angular/material/sidenav";

import { ContentContainerDirective } from "src/app/shared/directives/content-container/content-container.directive";
import {
  DangKyDongCuaMoTabEnum,
  DangKyKhaiThacKhoangSanTabEnum,
  DangKyThamDoActionEnum,
  LoaiCapPhepEnum
} from "src/app/shared/constants/enum";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { DangkydongcuamoIoComponent } from "src/app/features/admin/dangkyhoatdongkhoangsan/dongcuamo/dcm-thongtindangky/dangkydongcuamo-io/dangkydongcuamo-io.component";
import { DangkydongcuadientichIoComponent } from "src/app/features/admin/dangkyhoatdongkhoangsan/dongcuamo/dcm-thongtindangky/dangkydongcuadientich-io/dangkydongcuadientich-io.component";
import { DcmKhuvuckhaithacListComponent } from "src/app/features/admin/dangkyhoatdongkhoangsan/dongcuamo/dcm-thongtindangky/dcm-khuvuckhaithac/dcm-khuvuckhaithac-list/dcm-khuvuckhaithac-list.component";
import { DcmDonvihanhchinhListComponent } from "src/app/features/admin/dangkyhoatdongkhoangsan/dongcuamo/dcm-thongtindangky/dcm-donvihanhchinh/dcm-donvihanhchinh-list/dcm-donvihanhchinh-list.component";
import { DcmLoaikhoangsanListComponent } from "src/app/features/admin/dangkyhoatdongkhoangsan/dongcuamo/dcm-thongtindangky/dcm-loaikhoangsan/dcm-loaikhoangsan-list/dcm-loaikhoangsan-list.component";
import { DcmCongtrinhkhaithacListComponent } from "src/app/features/admin/dangkyhoatdongkhoangsan/dongcuamo/dcm-thongtindangky/dcm-congtrinhkhaithac/dcm-congtrinhkhaithac-list/dcm-congtrinhkhaithac-list.component";
import { HoSoGiayToFacadeService } from "src/app/services/admin/hosogiayto/hosogiayto-facade.service";

export const DangKyDongCuaMoComponent: any = {
  [LoaiCapPhepEnum.DongCuaMoKhoangSan]: DangkydongcuamoIoComponent,
  [LoaiCapPhepEnum.DongCuaMotPhanDienTichKhuVucKhaiThacKhoangSan]: DangkydongcuadientichIoComponent,
};

@Component({
  selector: 'app-dcm-thongtindangky',
  templateUrl: './dcm-thongtindangky.component.html',
  styleUrls: ['./dcm-thongtindangky.component.scss']
})
export class DcmThongtindangkyComponent implements OnInit {
  @ViewChild('thongTinDangKyDongCuaMoTabs', { static: false }) thongTinDangKyDongCuaMoTabs;
  @ViewChild(ContentContainerDirective, { static: true }) contentContainer: ContentContainerDirective;
  @ViewChild(Type, { static: true }) public matSidenav: MatSidenav;
  @ViewChild(Type, { read: ViewContainerRef, static: true }) public content: ViewContainerRef;
  @ViewChild("dangKyKhaiThacDvhc", { static: false }) dangKyKhaiThacDvhc: DcmDonvihanhchinhListComponent;
  @ViewChild("dangKyKhaiThacLoaiKhoangSan", { static: false }) dangKyKhaiThacLoaiKhoangSan: DcmLoaikhoangsanListComponent;
  @ViewChild("dangKyKhaiThacKhuVuc", { static: false }) dangKyKhaiThacKhuVuc: DcmKhuvuckhaithacListComponent;
  @ViewChild("dangKyKhaiThacCongTrinh", { static: false }) dangKyKhaiThacCongTrinh: DcmCongtrinhkhaithacListComponent;
  // tslint:disable-next-line: no-input-rename
  @Input("allowAutoInit") allowAutoInit = true;
  // tslint:disable-next-line: no-output-rename
  @Output("selectCurrentFormStateEvent") selectCurrentFormStateEvent: EventEmitter<number> = new EventEmitter();
  // Lưu trữ thông tin đăng ký tab
  public TabType = DangKyDongCuaMoTabEnum;
  // Lưu trữ dữ liệu id hồ sơ
  public idhoso;
  // Chứa goemetry
  public geoMetry: string;
  // Chứa thuộc tính xác định có phải loại cấp phép đóng cửa mỏ diện tích khai thác
  public isDongCuaDienTich = false;
  // Lưu trữ trạng thais tab được select
  public loadedTabState: any = {
    [DangKyDongCuaMoTabEnum.ThongTinChiTiet]: false,
    [DangKyDongCuaMoTabEnum.DonViHanhChinh]: false,
    [DangKyDongCuaMoTabEnum.LoaiKhoangSan]: false,
    [DangKyDongCuaMoTabEnum.KhuVucKhaiThac]: false,
    [DangKyDongCuaMoTabEnum.CongTrinhKhaiThac]: false,
    [DangKyDongCuaMoTabEnum.BanDoKhuVuc]: false,
  };

  public disabledTabState: any = {
    [DangKyDongCuaMoTabEnum.ThongTinChiTiet]: true,
    [DangKyDongCuaMoTabEnum.DonViHanhChinh]: true,
    [DangKyDongCuaMoTabEnum.LoaiKhoangSan]: true,
    [DangKyDongCuaMoTabEnum.KhuVucKhaiThac]: true,
    [DangKyDongCuaMoTabEnum.CongTrinhKhaiThac]: true,
    [DangKyDongCuaMoTabEnum.BanDoKhuVuc]: true,
  };

  // Lưu trữ dữ liệu action hiện tại
  public currentAction: number;
  // Chứa dữ liệu translate
  public dataTranslate: any;
  // Lưu trữ dữ liệu iddangkykhaithac
  private iddangkykhaithac: string;
  // Lưu trữ dữ liệu hồ sơ
  private itemHoSo: any;

  constructor(private cfr: ComponentFactoryResolver,
    private translate: TranslateService,
    private activatedRoute: ActivatedRoute,
    public commonService: CommonServiceShared,
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

    if (this.itemHoSo.loaicapphep === LoaiCapPhepEnum.DongCuaMotPhanDienTichKhuVucKhaiThacKhoangSan) {
      this.isDongCuaDienTich = true;
    }

    await this.showDangKyViewComponent();
    this.thongTinDangKyDongCuaMoTabs.selectedIndex = this.TabType.ThongTinChiTiet;
    this.thongTinDangKyDongCuaMoTabs.realignInkBar();
    return true;
  }

  setDisabledTabState(actionType: number) {
    switch (actionType) {
      case DangKyThamDoActionEnum.Add: {
        this.disabledTabState[DangKyDongCuaMoTabEnum.ThongTinChiTiet] = false;
        this.disabledTabState[DangKyDongCuaMoTabEnum.DonViHanhChinh] = true;
        this.disabledTabState[DangKyDongCuaMoTabEnum.LoaiKhoangSan] = true;
        this.disabledTabState[DangKyDongCuaMoTabEnum.KhuVucKhaiThac] = true;
        this.disabledTabState[DangKyDongCuaMoTabEnum.CongTrinhKhaiThac] = true;
        this.disabledTabState[DangKyDongCuaMoTabEnum.BanDoKhuVuc] = true;
        break;
      }
      case DangKyThamDoActionEnum.Edit: {
        this.disabledTabState[DangKyDongCuaMoTabEnum.ThongTinChiTiet] = false;
        this.disabledTabState[DangKyDongCuaMoTabEnum.DonViHanhChinh] = false;
        this.disabledTabState[DangKyDongCuaMoTabEnum.LoaiKhoangSan] = false;
        this.disabledTabState[DangKyDongCuaMoTabEnum.KhuVucKhaiThac] = false;
        this.disabledTabState[DangKyDongCuaMoTabEnum.CongTrinhKhaiThac] = false;
        this.disabledTabState[DangKyDongCuaMoTabEnum.BanDoKhuVuc] = false;
        break;
      }
      default: {
        this.disabledTabState[DangKyDongCuaMoTabEnum.ThongTinChiTiet] = true;
        this.disabledTabState[DangKyDongCuaMoTabEnum.DonViHanhChinh] = true;
        this.disabledTabState[DangKyDongCuaMoTabEnum.LoaiKhoangSan] = true;
        this.disabledTabState[DangKyDongCuaMoTabEnum.KhuVucKhaiThac] = true;
        this.disabledTabState[DangKyDongCuaMoTabEnum.CongTrinhKhaiThac] = true;
        this.disabledTabState[DangKyDongCuaMoTabEnum.BanDoKhuVuc] = true;
        break;
      }
    }
  }

  getDangKyDongCuaMoFormState(action: number) {
    this.currentAction = action;
    this.setDisabledTabState(this.currentAction);
    this.resetLoadedTabState();
    this.selectCurrentFormStateEvent.emit(this.currentAction);
  }

  getIdDangKyKhaiThac(idDangKyKhaiThac: string) {
    this.iddangkykhaithac = idDangKyKhaiThac;
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
      factory = this.cfr.resolveComponentFactory(DangKyDongCuaMoComponent[this.itemHoSo.loaicapphep]);
      const viewContainerRef = this.contentContainer.viewContainerRef;
      const componentRef: any = viewContainerRef.createComponent(factory);
      componentRef.instance.idhoso = this.itemHoSo.idhoso;
      componentRef.instance.matSidenav = this.matSidenav;
      componentRef.instance.content = this.content;
      componentRef.instance.selectCurrentFormStateEvent.subscribe(event => this.getDangKyDongCuaMoFormState(event));
      componentRef.instance.selectIdDangKyDongCuaMoEvent.subscribe(event => this.getIdDangKyKhaiThac(event));
      componentRef.instance.selectGeometryEvent.subscribe(event => this.getGeometry(event));
    }
  }

  private resetLoadedTabState() {
    this.loadedTabState[DangKyDongCuaMoTabEnum.DonViHanhChinh] = false;
    this.loadedTabState[DangKyDongCuaMoTabEnum.LoaiKhoangSan] = false;

  }

  async tabChange(index: any) {
    if (index === DangKyDongCuaMoTabEnum.DonViHanhChinh && !this.loadedTabState[DangKyDongCuaMoTabEnum.DonViHanhChinh]) {
      if (this.itemHoSo.loaicapphep === LoaiCapPhepEnum.DongCuaMotPhanDienTichKhuVucKhaiThacKhoangSan) {
        this.dangKyKhaiThacDvhc.matSidenav = this.matSidenav;
        this.dangKyKhaiThacDvhc.content = this.content;
        this.dangKyKhaiThacDvhc.iddangkykhaithac = this.iddangkykhaithac;
        this.loadedTabState[DangKyDongCuaMoTabEnum.DonViHanhChinh] = await this.dangKyKhaiThacDvhc.manualDataInit();
      }
    } else if (index === DangKyDongCuaMoTabEnum.LoaiKhoangSan && !this.loadedTabState[DangKyDongCuaMoTabEnum.LoaiKhoangSan]) {
      this.dangKyKhaiThacLoaiKhoangSan.matSidenav = this.matSidenav;
      this.dangKyKhaiThacLoaiKhoangSan.content = this.content;
      this.dangKyKhaiThacLoaiKhoangSan.iddangkykhaithac = this.iddangkykhaithac;
      this.loadedTabState[DangKyDongCuaMoTabEnum.LoaiKhoangSan] = await this.dangKyKhaiThacLoaiKhoangSan.manualDataInit();
    } else if (index === DangKyDongCuaMoTabEnum.KhuVucKhaiThac && !this.loadedTabState[DangKyDongCuaMoTabEnum.KhuVucKhaiThac]) {
      this.dangKyKhaiThacKhuVuc.matSidenav = this.matSidenav;
      this.dangKyKhaiThacKhuVuc.content = this.content;
      this.dangKyKhaiThacKhuVuc.iddangkykhaithac = this.iddangkykhaithac;
      this.dangKyKhaiThacKhuVuc.loaicapphep = this.itemHoSo.loaicapphep;
      this.dangKyKhaiThacKhuVuc[DangKyDongCuaMoTabEnum.KhuVucKhaiThac] = await this.dangKyKhaiThacKhuVuc.manualDataInit();
    } else if (index === DangKyKhaiThacKhoangSanTabEnum.CongTrinhKhaiThac && !this.loadedTabState[DangKyKhaiThacKhoangSanTabEnum.CongTrinhKhaiThac]) {
      this.dangKyKhaiThacCongTrinh.matSidenav = this.matSidenav;
      this.dangKyKhaiThacCongTrinh.content = this.content;
      this.dangKyKhaiThacCongTrinh.iddangkykhaithac = this.iddangkykhaithac;
      this.loadedTabState[DangKyKhaiThacKhoangSanTabEnum.CongTrinhKhaiThac] = await this.dangKyKhaiThacCongTrinh.manualDataInit();
      //
    }
  }

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
