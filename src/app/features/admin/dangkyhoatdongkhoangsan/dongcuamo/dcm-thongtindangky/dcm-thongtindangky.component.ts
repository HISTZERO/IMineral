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
import {DangKyDongCuaMoTabEnum, DangKyThamDoActionEnum, LoaiCapPhepEnum} from "src/app/shared/constants/enum";
import {TranslateService} from "@ngx-translate/core";
import {ActivatedRoute} from "@angular/router";
import {CommonServiceShared} from "src/app/services/utilities/common-service";
import {DangKyHoatDongKhoangSanFacadeService} from "src/app/services/admin/dangkyhoatdongkhoangsan/dangkyhoatdongkhoangsan-facade.service";
import {MatSidenav} from "@angular/material/sidenav";
import {DangkydongcuamoIoComponent} from "src/app/features/admin/dangkyhoatdongkhoangsan/dongcuamo/dcm-thongtindangky/dangkydongcuamo-io/dangkydongcuamo-io.component";
import {DangkydongcuadientichIoComponent} from "src/app/features/admin/dangkyhoatdongkhoangsan/dongcuamo/dcm-thongtindangky/dangkydongcuadientich-io/dangkydongcuadientich-io.component";

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
  @ViewChild('thongTinDangKyDongCuaMoTabs', {static: false}) thongTinDangKyDongCuaMoTabs;
  @ViewChild(ContentContainerDirective, {static: true}) contentContainer: ContentContainerDirective;
  @ViewChild(Type, {static: true}) public matSidenav: MatSidenav;
  @ViewChild(Type, {read: ViewContainerRef, static: true}) public content: ViewContainerRef;
  // @ViewChild("dangKyTanThuKsDvhc", {static: false}) dangKyTanThuKsDvhc: TtksDonvihanhchinhListComponent;
  // @ViewChild("dangKyTanThuLoaiKhoangSan", {static: false}) dangKyTanThuLoaiKhoangSan: TtksLoaikhoangsanListComponent;
  // @ViewChild("dangKyTanThuKhuVuc", { static: false }) dangKyTanThuKhuVuc: TtksKhuvuctanthuListComponent;
  // tslint:disable-next-line: no-input-rename
  @Input("allowAutoInit") allowAutoInit = true;
  // tslint:disable-next-line: no-output-rename
  @Output("selectCurrentFormStateEvent") selectCurrentFormStateEvent: EventEmitter<number> = new EventEmitter();
  // Lưu trữ thông tin đăng ký tab
  public TabType = DangKyDongCuaMoTabEnum;
  // Lưu trữ dữ liệu id hồ sơ
  public idhoso;
  // Lưu trữ trạng thais tab được select
  public loadedTabState: any = {
    [DangKyDongCuaMoTabEnum.ThongTinChiTiet]: false,
    [DangKyDongCuaMoTabEnum.DonViHanhChinh]: false,
    [DangKyDongCuaMoTabEnum.LoaiKhoangSan]: false,
    [DangKyDongCuaMoTabEnum.KhuVucKhaiThac]: false,
    [DangKyDongCuaMoTabEnum.CongTrinhKhaiThac]: false,
  };

  public disabledTabState: any = {
    [DangKyDongCuaMoTabEnum.ThongTinChiTiet]: true,
    [DangKyDongCuaMoTabEnum.DonViHanhChinh]: true,
    [DangKyDongCuaMoTabEnum.LoaiKhoangSan]: true,
    [DangKyDongCuaMoTabEnum.KhuVucKhaiThac]: true,
    [DangKyDongCuaMoTabEnum.CongTrinhKhaiThac]: true,
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
              private dangKyHoatDongKhoangSanFacadeService: DangKyHoatDongKhoangSanFacadeService) {
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
        break;
      }
      case DangKyThamDoActionEnum.Edit: {
        this.disabledTabState[DangKyDongCuaMoTabEnum.ThongTinChiTiet] = false;
        this.disabledTabState[DangKyDongCuaMoTabEnum.DonViHanhChinh] = false;
        this.disabledTabState[DangKyDongCuaMoTabEnum.LoaiKhoangSan] = false;
        this.disabledTabState[DangKyDongCuaMoTabEnum.KhuVucKhaiThac] = false;
        this.disabledTabState[DangKyDongCuaMoTabEnum.CongTrinhKhaiThac] = false;
        break;
      }
      default: {
        this.disabledTabState[DangKyDongCuaMoTabEnum.ThongTinChiTiet] = true;
        this.disabledTabState[DangKyDongCuaMoTabEnum.DonViHanhChinh] = true;
        this.disabledTabState[DangKyDongCuaMoTabEnum.LoaiKhoangSan] = true;
        this.disabledTabState[DangKyDongCuaMoTabEnum.KhuVucKhaiThac] = true;
        this.disabledTabState[DangKyDongCuaMoTabEnum.CongTrinhKhaiThac] = true;
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
    const hoSoService = this.dangKyHoatDongKhoangSanFacadeService.getHoSoService();
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
    }
  }

  private resetLoadedTabState() {
    this.loadedTabState[DangKyDongCuaMoTabEnum.DonViHanhChinh] = false;
    this.loadedTabState[DangKyDongCuaMoTabEnum.LoaiKhoangSan] = false;

  }

  async tabChange(index: any) {
    //   if (index === DangKyDongCuaMoTabEnum.DonViHanhChinh && !this.loadedTabState[DangKyDongCuaMoTabEnum.DonViHanhChinh]) {
    //     this.dangKyTanThuKsDvhc.matSidenav = this.matSidenav;
    //     this.dangKyTanThuKsDvhc.content = this.content;
    //     this.dangKyTanThuKsDvhc.iddangkytanthu = this.iddangkytanthu;
    //     this.loadedTabState[DangKyDongCuaMoTabEnum.DonViHanhChinh] = await this.dangKyTanThuKsDvhc.manualDataInit();
    //   } else if (index === DangKyDongCuaMoTabEnum.LoaiKhoangSan && !this.loadedTabState[DangKyDongCuaMoTabEnum.LoaiKhoangSan]) {
    //     this.dangKyTanThuLoaiKhoangSan.matSidenav = this.matSidenav;
    //     this.dangKyTanThuLoaiKhoangSan.content = this.content;
    //     this.dangKyTanThuLoaiKhoangSan.iddangkytanthu = this.iddangkytanthu;
    //     this.loadedTabState[DangKyDongCuaMoTabEnum.LoaiKhoangSan] = await this.dangKyTanThuLoaiKhoangSan.manualDataInit();
    //   } else if (index === DangKyDongCuaMoTabEnum.KhuVucTanThu && !this.loadedTabState[DangKyDongCuaMoTabEnum.KhuVucTanThu]) {
    //     this.dangKyTanThuKhuVuc.matSidenav = this.matSidenav;
    //     this.dangKyTanThuKhuVuc.content = this.content;
    //     this.dangKyTanThuKhuVuc.iddangkytanthu = this.iddangkytanthu;
    //     this.dangKyTanThuKhuVuc.loaicapphep = this.itemHoSo.loaicapphep;
    //     this.loadedTabState[DangKyDongCuaMoTabEnum.KhuVucTanThu] = await this.dangKyTanThuKhuVuc.manualDataInit();
    //   }
    //
  }

}
