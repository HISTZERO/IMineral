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
import {KtksDonvihanhchinhListComponent} from "src/app/features/admin/dangkyhoatdongkhoangsan/khaithackhoangsan/ktks-thongtindangky/ktks-donvihanhchinh/ktks-donvihanhchinh-list/ktks-donvihanhchinh-list.component";
import {KtksLoaikhoangsanListComponent} from "src/app/features/admin/dangkyhoatdongkhoangsan/khaithackhoangsan/ktks-thongtindangky/ktks-loaikhoangsan/ktks-loaikhoangsan-list/ktks-loaikhoangsan-list.component";
import {KtksCongtrinhkhaithacListComponent} from "src/app/features/admin/dangkyhoatdongkhoangsan/khaithackhoangsan/ktks-thongtindangky/ktks-congtrinhkhaithac/ktks-congtrinhkhaithac-list/ktks-congtrinhkhaithac-list.component";
import {DangKyThamDoActionEnum, DangKyThamDoKhoangSanTabEnum, LoaiCapPhepEnum} from "src/app/shared/constants/enum";
import {TranslateService} from "@ngx-translate/core";
import {ActivatedRoute} from "@angular/router";
import {CommonServiceShared} from "src/app/services/utilities/common-service";
import {DangKyHoatDongKhoangSanFacadeService} from "src/app/services/admin/dangkyhoatdongkhoangsan/dangkyhoatdongkhoangsan-facade.service";
import {DangKyKhaiThacKhoangSanComponent} from "src/app/features/admin/dangkyhoatdongkhoangsan/khaithackhoangsan/ktks-thongtindangky/ktks-thongtindangky.component";
import {MatSidenav} from "@angular/material/sidenav";
import {DangkykhaithackhoangsanIoComponent} from "src/app/features/admin/dangkyhoatdongkhoangsan/khaithackhoangsan/ktks-thongtindangky/dangkykhaithackhoangsan-io/dangkykhaithackhoangsan-io.component";
import {DangkykhaithacgiahanIoComponent} from "src/app/features/admin/dangkyhoatdongkhoangsan/khaithackhoangsan/ktks-thongtindangky/dangkykhaithacgiahan-io/dangkykhaithacgiahan-io.component";
import {DangkykhaithacvlxdIoComponent} from "src/app/features/admin/dangkyhoatdongkhoangsan/khaithackhoangsan/ktks-thongtindangky/dangkykhaithacvlxd-io/dangkykhaithacvlxd-io.component";
import {DangkykhaithackhoangsanduanIoComponent} from "src/app/features/admin/dangkyhoatdongkhoangsan/khaithackhoangsan/ktks-thongtindangky/dangkykhaithackhoangsanduan-io/dangkykhaithackhoangsanduan-io.component";
import {DangkykhaithaccaisoiIoComponent} from "src/app/features/admin/dangkyhoatdongkhoangsan/khaithackhoangsan/ktks-thongtindangky/dangkykhaithaccaisoi-io/dangkykhaithaccaisoi-io.component";
import {DangkykhaithacdieuchinhIoComponent} from "src/app/features/admin/dangkyhoatdongkhoangsan/khaithackhoangsan/ktks-thongtindangky/dangkykhaithacdieuchinh-io/dangkykhaithacdieuchinh-io.component";
import {DangkytanthukhoangsanIoComponent} from "src/app/features/admin/dangkyhoatdongkhoangsan/tanthukhoangsan/ttks-thongtindangky/dangkytanthukhoangsan-io/dangkytanthukhoangsan-io.component";

export const DangKyTanThuKhoangSanComponent: any = {
  [LoaiCapPhepEnum.KhaiThacTanThuKhoangSan]: DangkytanthukhoangsanIoComponent,
  // [LoaiCapPhepEnum.KhaiThacTanThuKhoangSanGiaHan]: DangkytanthukhoangsanIoComponent,
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
  // @ViewChild("dangKyKhaiThacKsDvhc", {static: false}) dangKyKhaiThacKsDvhc: KtksDonvihanhchinhListComponent;
  // @ViewChild("dangKyKhaiThacLoaiKhoangSan", {static: false}) dangKyKhaiThacLoaiKhoangSan: KtksLoaikhoangsanListComponent;
  // @ViewChild("dangKyKhaiThacCongTrinh", {static: false}) dangKyKhaiThacCongTrinh: KtksCongtrinhkhaithacListComponent;
  // @ViewChild("dangKyThamDoKhuVuc", { static: false }) dangKyThamDoKhuVuc: KhuvucthamdoListComponent;
  // tslint:disable-next-line: no-input-rename
  @Input("allowAutoInit") allowAutoInit = true;
  // tslint:disable-next-line: no-output-rename
  @Output("selectCurrentFormStateEvent") selectCurrentFormStateEvent: EventEmitter<number> = new EventEmitter();
  // Lưu trữ thông tin đăng ký tab
  public TabType = DangKyThamDoKhoangSanTabEnum;
  // Lưu trữ dữ liệu id hồ sơ
  public idhoso;
  // Lưu trữ trạng thais tab được select
  public loadedTabState: any = {
    [DangKyThamDoKhoangSanTabEnum.ThongTinChiTiet]: true,
    [DangKyThamDoKhoangSanTabEnum.DonViHanhChinh]: false,
    [DangKyThamDoKhoangSanTabEnum.LoaiKhoangSan]: false,
    [DangKyThamDoKhoangSanTabEnum.KhuVucThamDo]: false,
    [DangKyThamDoKhoangSanTabEnum.CongTrinhThamDo]: false
  };

  public disabledTabState: any = {
    [DangKyThamDoKhoangSanTabEnum.ThongTinChiTiet]: false,
    [DangKyThamDoKhoangSanTabEnum.DonViHanhChinh]: false,
    [DangKyThamDoKhoangSanTabEnum.LoaiKhoangSan]: false,
    [DangKyThamDoKhoangSanTabEnum.KhuVucThamDo]: false,
    [DangKyThamDoKhoangSanTabEnum.CongTrinhThamDo]: false
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
        this.disabledTabState[DangKyThamDoKhoangSanTabEnum.ThongTinChiTiet] = true;
        this.disabledTabState[DangKyThamDoKhoangSanTabEnum.DonViHanhChinh] = false;
        this.disabledTabState[DangKyThamDoKhoangSanTabEnum.LoaiKhoangSan] = false;
        this.disabledTabState[DangKyThamDoKhoangSanTabEnum.KhuVucThamDo] = false;
        this.disabledTabState[DangKyThamDoKhoangSanTabEnum.CongTrinhThamDo] = false;
        break;
      }
      case DangKyThamDoActionEnum.Edit: {
        this.disabledTabState[DangKyThamDoKhoangSanTabEnum.ThongTinChiTiet] = true;
        this.disabledTabState[DangKyThamDoKhoangSanTabEnum.DonViHanhChinh] = true;
        this.disabledTabState[DangKyThamDoKhoangSanTabEnum.LoaiKhoangSan] = true;
        this.disabledTabState[DangKyThamDoKhoangSanTabEnum.KhuVucThamDo] = true;
        this.disabledTabState[DangKyThamDoKhoangSanTabEnum.CongTrinhThamDo] = true;
        break;
      }
      default: {
        this.disabledTabState[DangKyThamDoKhoangSanTabEnum.ThongTinChiTiet] = false;
        this.disabledTabState[DangKyThamDoKhoangSanTabEnum.DonViHanhChinh] = false;
        this.disabledTabState[DangKyThamDoKhoangSanTabEnum.LoaiKhoangSan] = false;
        this.disabledTabState[DangKyThamDoKhoangSanTabEnum.KhuVucThamDo] = false;
        this.disabledTabState[DangKyThamDoKhoangSanTabEnum.CongTrinhThamDo] = false;
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
  //   if (index === DangKyThamDoKhoangSanTabEnum.DonViHanhChinh && !this.loadedTabState[DangKyThamDoKhoangSanTabEnum.DonViHanhChinh]) {
  //     this.dangKyKhaiThacKsDvhc.matSidenav = this.matSidenav;
  //     this.dangKyKhaiThacKsDvhc.content = this.content;
  //     this.dangKyKhaiThacKsDvhc.iddangkykhaithac = this.iddangkykhaithac;
  //     this.loadedTabState[DangKyThamDoKhoangSanTabEnum.DonViHanhChinh] = await this.dangKyKhaiThacKsDvhc.manualDataInit();
  //   } else if (index === DangKyThamDoKhoangSanTabEnum.LoaiKhoangSan && !this.loadedTabState[DangKyThamDoKhoangSanTabEnum.LoaiKhoangSan]) {
  //     this.dangKyKhaiThacLoaiKhoangSan.matSidenav = this.matSidenav;
  //     this.dangKyKhaiThacLoaiKhoangSan.content = this.content;
  //     this.dangKyKhaiThacLoaiKhoangSan.iddangkykhaithac = this.iddangkykhaithac;
  //     this.loadedTabState[DangKyThamDoKhoangSanTabEnum.LoaiKhoangSan] = await this.dangKyKhaiThacLoaiKhoangSan.manualDataInit();
  //     // }//  else if (index === DangKyThamDoKhoangSanTabEnum.KhuVucThamDo && !this.loadedTabState[DangKyThamDoKhoangSanTabEnum.KhuVucThamDo]) {
  //     //   this.dangKyThamDoKhuVuc.matSidenav = this.matSidenav;
  //     //   this.dangKyThamDoKhuVuc.content = this.content;
  //     //   this.dangKyThamDoKhuVuc.iddangkythamdo = this.iddangkythamdo;
  //     //   this.loadedTabState[DangKyThamDoKhoangSanTabEnum.KhuVucThamDo] = await this.dangKyThamDoKhuVuc.manualDataInit();
  //   } else if (index === DangKyThamDoKhoangSanTabEnum.CongTrinhThamDo && !this.loadedTabState[DangKyThamDoKhoangSanTabEnum.CongTrinhThamDo]) {
  //     this.dangKyKhaiThacCongTrinh.matSidenav = this.matSidenav;
  //     this.dangKyKhaiThacCongTrinh.content = this.content;
  //     this.dangKyKhaiThacCongTrinh.iddangkykhaithac = this.iddangkykhaithac;
  //     this.loadedTabState[DangKyThamDoKhoangSanTabEnum.CongTrinhThamDo] = await this.dangKyKhaiThacCongTrinh.manualDataInit();
  //   }
   }

}
