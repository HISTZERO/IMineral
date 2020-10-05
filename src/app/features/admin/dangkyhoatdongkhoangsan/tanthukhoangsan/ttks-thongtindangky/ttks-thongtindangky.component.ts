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
import {DangKyTanThuKhoangSanTabEnum, DangKyThamDoActionEnum, LoaiCapPhepEnum} from "src/app/shared/constants/enum";
import {TranslateService} from "@ngx-translate/core";
import {ActivatedRoute} from "@angular/router";
import {CommonServiceShared} from "src/app/services/utilities/common-service";
import {DangKyHoatDongKhoangSanFacadeService} from "src/app/services/admin/dangkyhoatdongkhoangsan/dangkyhoatdongkhoangsan-facade.service";
import {MatSidenav} from "@angular/material/sidenav";
import {DangkytanthukhoangsanIoComponent} from "src/app/features/admin/dangkyhoatdongkhoangsan/tanthukhoangsan/ttks-thongtindangky/dangkytanthukhoangsan-io/dangkytanthukhoangsan-io.component";
import {DangkytanthugiahanIoComponent} from "src/app/features/admin/dangkyhoatdongkhoangsan/tanthukhoangsan/ttks-thongtindangky/dangkytanthugiahan-io/dangkytanthugiahan-io.component";
import {TtksDonvihanhchinhListComponent} from "src/app/features/admin/dangkyhoatdongkhoangsan/tanthukhoangsan/ttks-thongtindangky/ttks-donvihanhchinh/ttks-donvihanhchinh-list/ttks-donvihanhchinh-list.component";
import {TtksLoaikhoangsanListComponent} from "src/app/features/admin/dangkyhoatdongkhoangsan/tanthukhoangsan/ttks-thongtindangky/ttks-loaikhoangsan/ttks-loaikhoangsan-list/ttks-loaikhoangsan-list.component";

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

  @ViewChild('thongTinDangKyTanThuTabs', {static: false}) thongTinDangKyTanThuTabs;
  @ViewChild(ContentContainerDirective, {static: true}) contentContainer: ContentContainerDirective;
  @ViewChild(Type, {static: true}) public matSidenav: MatSidenav;
  @ViewChild(Type, {read: ViewContainerRef, static: true}) public content: ViewContainerRef;
  @ViewChild("dangKyTanThuKsDvhc", {static: false}) dangKyTanThuKsDvhc: TtksDonvihanhchinhListComponent;
  @ViewChild("dangKyTanThuLoaiKhoangSan", {static: false}) dangKyTanThuLoaiKhoangSan: TtksLoaikhoangsanListComponent;
  // @ViewChild("dangKyKhaiThacCongTrinh", {static: false}) dangKyKhaiThacCongTrinh: KtksCongtrinhkhaithacListComponent;
  // @ViewChild("dangKyThamDoKhuVuc", { static: false }) dangKyThamDoKhuVuc: KhuvucthamdoListComponent;
  // tslint:disable-next-line: no-input-rename
  @Input("allowAutoInit") allowAutoInit = true;
  // tslint:disable-next-line: no-output-rename
  @Output("selectCurrentFormStateEvent") selectCurrentFormStateEvent: EventEmitter<number> = new EventEmitter();
  // Lưu trữ thông tin đăng ký tab
  public TabType = DangKyTanThuKhoangSanTabEnum;
  // Lưu trữ dữ liệu id hồ sơ
  public idhoso;
  // Lưu trữ trạng thais tab được select
  public loadedTabState: any = {
    [DangKyTanThuKhoangSanTabEnum.ThongTinChiTiet]: true,
    [DangKyTanThuKhoangSanTabEnum.DonViHanhChinh]: false,
    [DangKyTanThuKhoangSanTabEnum.LoaiKhoangSan]: false,
    [DangKyTanThuKhoangSanTabEnum.KhuVucThamDo]: false,
  };

  public disabledTabState: any = {
    [DangKyTanThuKhoangSanTabEnum.ThongTinChiTiet]: false,
    [DangKyTanThuKhoangSanTabEnum.DonViHanhChinh]: false,
    [DangKyTanThuKhoangSanTabEnum.LoaiKhoangSan]: false,
    [DangKyTanThuKhoangSanTabEnum.KhuVucThamDo]: false,
  };

  // Lưu trữ dữ liệu action hiện tại
  public currentAction: number;
  // Chứa dữ liệu translate
  public dataTranslate: any;
  // Lưu trữ dữ liệu iddangkythamdo
  private iddangkytanthu: string;
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
      this.commonService.showDialogWarning(this.dataTranslate.DANGKYHOATDONGKHOANGSAN.thongtindangky.informedNotExistedHoSoDangKyKhaiThac);
      return;
    }

    this.itemHoSo = await this.getHoSoById(this.idhoso);

    if (!this.itemHoSo) {
      this.commonService.showDialogWarning(this.dataTranslate.DANGKYHOATDONGKHOANGSAN.thongtindangky.informedNotExistedHoSoDangKyKhaiThac);
      return;
    }

    await this.showDangKyViewComponent();

    this.thongTinDangKyTanThuTabs.realignInkBar();
    return true;
  }

  setTanThuKhoangSanDisabledTabState(actionType: number) {
    switch (actionType) {
      case DangKyThamDoActionEnum.Add: {
        this.disabledTabState[DangKyTanThuKhoangSanTabEnum.ThongTinChiTiet] = true;
        this.disabledTabState[DangKyTanThuKhoangSanTabEnum.DonViHanhChinh] = false;
        this.disabledTabState[DangKyTanThuKhoangSanTabEnum.LoaiKhoangSan] = false;
        this.disabledTabState[DangKyTanThuKhoangSanTabEnum.KhuVucThamDo] = false;
        break;
      }
      case DangKyThamDoActionEnum.Edit: {
        this.disabledTabState[DangKyTanThuKhoangSanTabEnum.ThongTinChiTiet] = true;
        this.disabledTabState[DangKyTanThuKhoangSanTabEnum.DonViHanhChinh] = true;
        this.disabledTabState[DangKyTanThuKhoangSanTabEnum.LoaiKhoangSan] = true;
        this.disabledTabState[DangKyTanThuKhoangSanTabEnum.KhuVucThamDo] = true;
        break;
      }
      default: {
        this.disabledTabState[DangKyTanThuKhoangSanTabEnum.ThongTinChiTiet] = false;
        this.disabledTabState[DangKyTanThuKhoangSanTabEnum.DonViHanhChinh] = false;
        this.disabledTabState[DangKyTanThuKhoangSanTabEnum.LoaiKhoangSan] = false;
        this.disabledTabState[DangKyTanThuKhoangSanTabEnum.KhuVucThamDo] = false;
        break;
      }
    }
  }

  getDangKyTanThuKhoangSanFormState(action: number) {
    this.currentAction = action;
    this.setTanThuKhoangSanDisabledTabState(this.currentAction);
    this.selectCurrentFormStateEvent.emit(this.currentAction);
  }

  getIdDangKyTanThuKhoangSan(idDangKyTanThu: string) {
    this.iddangkytanthu = idDangKyTanThu;
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

    if (this.itemHoSo) {
      factory = this.cfr.resolveComponentFactory(DangKyTanThuKhoangSanComponent[this.itemHoSo.loaicapphep]);
    }

    const viewContainerRef = this.contentContainer.viewContainerRef;
    const componentRef: any = viewContainerRef.createComponent(factory);
    componentRef.instance.idhoso = this.itemHoSo.idhoso;
    componentRef.instance.matSidenav = this.matSidenav;
    componentRef.instance.content = this.content;
    componentRef.instance.selectCurrentFormStateEvent.subscribe(event => this.getDangKyTanThuKhoangSanFormState(event));
    componentRef.instance.selectIdDangKyTanThuKhoangSanEvent.subscribe(event => this.getIdDangKyTanThuKhoangSan(event));
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
      }//  else if (index === DangKyTanThuKhoangSanTabEnum.KhuVucThamDo && !this.loadedTabState[DangKyTanThuKhoangSanTabEnum.KhuVucThamDo]) {
      //     //   this.dangKyThamDoKhuVuc.matSidenav = this.matSidenav;
      //     //   this.dangKyThamDoKhuVuc.content = this.content;
      //     //   this.dangKyThamDoKhuVuc.iddangkythamdo = this.iddangkythamdo;
      //     //   this.loadedTabState[DangKyTanThuKhoangSanTabEnum.KhuVucThamDo] = await this.dangKyThamDoKhuVuc.manualDataInit();
      //   } else if (index === DangKyTanThuKhoangSanTabEnum.CongTrinhThamDo && !this.loadedTabState[DangKyTanThuKhoangSanTabEnum.CongTrinhThamDo]) {
      //     this.dangKyKhaiThacCongTrinh.matSidenav = this.matSidenav;
      //     this.dangKyKhaiThacCongTrinh.content = this.content;
      //     this.dangKyKhaiThacCongTrinh.iddangkykhaithac = this.iddangkykhaithac;
      //     this.loadedTabState[DangKyTanThuKhoangSanTabEnum.CongTrinhThamDo] = await this.dangKyKhaiThacCongTrinh.manualDataInit();
      //   }
    }

  }
