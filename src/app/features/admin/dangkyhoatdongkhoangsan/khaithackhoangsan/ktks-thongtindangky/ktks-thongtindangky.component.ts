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
import { MatSidenav } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DangKyHoatDongKhoangSanFacadeService } from 'src/app/services/admin/dangkyhoatdongkhoangsan/dangkyhoatdongkhoangsan-facade.service';
import { DangKyKhaiThacKhoangSanTabEnum, DangKyKhaiThacKsActionEnum, LoaiCapPhepEnum } from 'src/app/shared/constants/enum';
import { ContentContainerDirective } from 'src/app/shared/directives/content-container/content-container.directive';
import { CommonServiceShared } from 'src/app/services/utilities/common-service';
import { DangkykhaithackhoangsanIoComponent } from "src/app/features/admin/dangkyhoatdongkhoangsan/khaithackhoangsan/ktks-thongtindangky/dangkykhaithackhoangsan-io/dangkykhaithackhoangsan-io.component";
import { DangkykhaithacgiahanIoComponent } from "src/app/features/admin/dangkyhoatdongkhoangsan/khaithackhoangsan/ktks-thongtindangky/dangkykhaithacgiahan-io/dangkykhaithacgiahan-io.component";
import { DangkykhaithacvlxdIoComponent } from "src/app/features/admin/dangkyhoatdongkhoangsan/khaithackhoangsan/ktks-thongtindangky/dangkykhaithacvlxd-io/dangkykhaithacvlxd-io.component";
import { DangkykhaithackhoangsanduanIoComponent } from "src/app/features/admin/dangkyhoatdongkhoangsan/khaithackhoangsan/ktks-thongtindangky/dangkykhaithackhoangsanduan-io/dangkykhaithackhoangsanduan-io.component";
import { DangkykhaithaccaisoiIoComponent } from "src/app/features/admin/dangkyhoatdongkhoangsan/khaithackhoangsan/ktks-thongtindangky/dangkykhaithaccaisoi-io/dangkykhaithaccaisoi-io.component";
import { DangkykhaithacdieuchinhIoComponent } from "src/app/features/admin/dangkyhoatdongkhoangsan/khaithackhoangsan/ktks-thongtindangky/dangkykhaithacdieuchinh-io/dangkykhaithacdieuchinh-io.component";
import { KtksDonvihanhchinhListComponent } from "src/app/features/admin/dangkyhoatdongkhoangsan/khaithackhoangsan/ktks-thongtindangky/ktks-donvihanhchinh/ktks-donvihanhchinh-list/ktks-donvihanhchinh-list.component";
import { KtksLoaikhoangsanListComponent } from "src/app/features/admin/dangkyhoatdongkhoangsan/khaithackhoangsan/ktks-thongtindangky/ktks-loaikhoangsan/ktks-loaikhoangsan-list/ktks-loaikhoangsan-list.component";
import { KtksCongtrinhkhaithacListComponent } from "src/app/features/admin/dangkyhoatdongkhoangsan/khaithackhoangsan/ktks-thongtindangky/ktks-congtrinhkhaithac/ktks-congtrinhkhaithac-list/ktks-congtrinhkhaithac-list.component";
import { KhuvuckhaithacListComponent } from "src/app/features/admin/dangkyhoatdongkhoangsan/khaithackhoangsan/ktks-thongtindangky/khuvuckhaithac/khuvuckhaithac-list/khuvuckhaithac-list.component";


export const DangKyKhaiThacKhoangSanComponent: any = {
  [LoaiCapPhepEnum.KhaiThacKhoangSan]: DangkykhaithackhoangsanIoComponent,
  [LoaiCapPhepEnum.KhaiThacKhoangSanGiaHan]: DangkykhaithacgiahanIoComponent,
  [LoaiCapPhepEnum.KhaiThacKhoangSanLamVatLieuXayDung]: DangkykhaithacvlxdIoComponent,
  [LoaiCapPhepEnum.KhaiThacKhoangSanCoDuAnDauTu]: DangkykhaithackhoangsanduanIoComponent,
  [LoaiCapPhepEnum.ThuHoiCatSoiDuAnNaoVetKhoiThong]: DangkykhaithaccaisoiIoComponent,
  [LoaiCapPhepEnum.DieuChinhGiayPhepKhaiThac]: DangkykhaithacdieuchinhIoComponent
};

@Component({
  selector: 'app-ktks-thongtindangky',
  templateUrl: './ktks-thongtindangky.component.html',
  styleUrls: ['./ktks-thongtindangky.component.scss']
})
export class KtksThongtindangkyComponent implements OnInit {
  @ViewChild('thongTinDangKyKhaiThacTabs', { static: false }) thongTinDangKyKhaiThacTabs;
  @ViewChild(ContentContainerDirective, { static: true }) contentContainer: ContentContainerDirective;
  @ViewChild(Type, { static: true }) public matSidenav: MatSidenav;
  @ViewChild(Type, { read: ViewContainerRef, static: true }) public content: ViewContainerRef;
  @ViewChild("dangKyKhaiThacKsDvhc", { static: false }) dangKyKhaiThacKsDvhc: KtksDonvihanhchinhListComponent;
  @ViewChild("dangKyKhaiThacLoaiKhoangSan", { static: false }) dangKyKhaiThacLoaiKhoangSan: KtksLoaikhoangsanListComponent;
  @ViewChild("dangKyKhaiThacCongTrinh", { static: false }) dangKyKhaiThacCongTrinh: KtksCongtrinhkhaithacListComponent;
  @ViewChild("dangKyKhaiThacKhuVuc", { static: false }) dangKyKhaiThacKhuVuc: KhuvuckhaithacListComponent;
  // tslint:disable-next-line: no-input-rename
  @Input("allowAutoInit") allowAutoInit = true;
  // tslint:disable-next-line: no-output-rename
  @Output("selectCurrentFormStateEvent") selectCurrentFormStateEvent: EventEmitter<number> = new EventEmitter();
  // Lưu trữ thông tin đăng ký tab
  public TabType = DangKyKhaiThacKhoangSanTabEnum;
  // Lưu trữ dữ liệu id hồ sơ
  public idhoso;
  // Lưu trữ trạng thais tab được select
  public loadedTabState: any = {
    [DangKyKhaiThacKhoangSanTabEnum.ThongTinChiTiet]: true,
    [DangKyKhaiThacKhoangSanTabEnum.DonViHanhChinh]: false,
    [DangKyKhaiThacKhoangSanTabEnum.LoaiKhoangSan]: false,
    [DangKyKhaiThacKhoangSanTabEnum.KhuVucKhaiThac]: false,
    [DangKyKhaiThacKhoangSanTabEnum.CongTrinhKhaiThac]: false
  };

  public disabledTabState: any = {
    [DangKyKhaiThacKhoangSanTabEnum.ThongTinChiTiet]: false,
    [DangKyKhaiThacKhoangSanTabEnum.DonViHanhChinh]: false,
    [DangKyKhaiThacKhoangSanTabEnum.LoaiKhoangSan]: false,
    [DangKyKhaiThacKhoangSanTabEnum.KhuVucKhaiThac]: false,
    [DangKyKhaiThacKhoangSanTabEnum.CongTrinhKhaiThac]: false
  };

  // Lưu trữ dữ liệu action hiện tại
  public currentAction: number;
  // Chứa dữ liệu translate
  public dataTranslate: any;
  // Lưu trữ dữ liệu iddangkythamdo
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
      this.commonService.showDialogWarning(this.dataTranslate.DANGKYHOATDONGKHOANGSAN.thongtindangky.informedNotExistedHoSoDangKyKhaiThac);
      return;
    }

    this.itemHoSo = await this.getHoSoById(this.idhoso);

    if (!this.itemHoSo) {
      this.commonService.showDialogWarning(this.dataTranslate.DANGKYHOATDONGKHOANGSAN.thongtindangky.informedNotExistedHoSoDangKyKhaiThac);
      return;
    }

    await this.showDangKyViewComponent();

    this.thongTinDangKyKhaiThacTabs.realignInkBar();
    return true;
  }

  setKhaiThacKhoangSanDisabledTabState(actionType: number) {
    switch (actionType) {
      case DangKyKhaiThacKsActionEnum.Add: {
        this.disabledTabState[DangKyKhaiThacKhoangSanTabEnum.ThongTinChiTiet] = true;
        this.disabledTabState[DangKyKhaiThacKhoangSanTabEnum.DonViHanhChinh] = false;
        this.disabledTabState[DangKyKhaiThacKhoangSanTabEnum.LoaiKhoangSan] = false;
        this.disabledTabState[DangKyKhaiThacKhoangSanTabEnum.KhuVucKhaiThac] = false;
        this.disabledTabState[DangKyKhaiThacKhoangSanTabEnum.CongTrinhKhaiThac] = false;
        break;
      }
      case DangKyKhaiThacKsActionEnum.Edit: {
        this.disabledTabState[DangKyKhaiThacKhoangSanTabEnum.ThongTinChiTiet] = true;
        this.disabledTabState[DangKyKhaiThacKhoangSanTabEnum.DonViHanhChinh] = true;
        this.disabledTabState[DangKyKhaiThacKhoangSanTabEnum.LoaiKhoangSan] = true;
        this.disabledTabState[DangKyKhaiThacKhoangSanTabEnum.KhuVucKhaiThac] = true;
        this.disabledTabState[DangKyKhaiThacKhoangSanTabEnum.CongTrinhKhaiThac] = true;
        break;
      }
      default: {
        this.disabledTabState[DangKyKhaiThacKhoangSanTabEnum.ThongTinChiTiet] = false;
        this.disabledTabState[DangKyKhaiThacKhoangSanTabEnum.DonViHanhChinh] = false;
        this.disabledTabState[DangKyKhaiThacKhoangSanTabEnum.LoaiKhoangSan] = false;
        this.disabledTabState[DangKyKhaiThacKhoangSanTabEnum.KhuVucKhaiThac] = false;
        this.disabledTabState[DangKyKhaiThacKhoangSanTabEnum.CongTrinhKhaiThac] = false;
        break;
      }
    }
  }

  getDangKyKhaiThacKhoangSanFormState(action: number) {
    this.currentAction = action;
    this.setKhaiThacKhoangSanDisabledTabState(this.currentAction);
    this.selectCurrentFormStateEvent.emit(this.currentAction);
  }

  getIdDangKyKhaiThacKhoangSan(idDangKyKhaiThac: string) {
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

    if (this.itemHoSo) {
      factory = this.cfr.resolveComponentFactory(DangKyKhaiThacKhoangSanComponent[this.itemHoSo.loaicapphep]);
    }

    const viewContainerRef = this.contentContainer.viewContainerRef;
    const componentRef: any = viewContainerRef.createComponent(factory);
    componentRef.instance.idhoso = this.itemHoSo.idhoso;
    componentRef.instance.matSidenav = this.matSidenav;
    componentRef.instance.content = this.content;
    componentRef.instance.selectCurrentFormStateEvent.subscribe(event => this.getDangKyKhaiThacKhoangSanFormState(event));
    componentRef.instance.selectIdDangKyKhaiThacKhoangSanEvent.subscribe(event => this.getIdDangKyKhaiThacKhoangSan(event));
  }

  async tabChange(index: any) {
    if (index === DangKyKhaiThacKhoangSanTabEnum.DonViHanhChinh && !this.loadedTabState[DangKyKhaiThacKhoangSanTabEnum.DonViHanhChinh]) {
      this.dangKyKhaiThacKsDvhc.matSidenav = this.matSidenav;
      this.dangKyKhaiThacKsDvhc.content = this.content;
      this.dangKyKhaiThacKsDvhc.iddangkykhaithac = this.iddangkykhaithac;
      this.loadedTabState[DangKyKhaiThacKhoangSanTabEnum.DonViHanhChinh] = await this.dangKyKhaiThacKsDvhc.manualDataInit();
    } else if (index === DangKyKhaiThacKhoangSanTabEnum.LoaiKhoangSan && !this.loadedTabState[DangKyKhaiThacKhoangSanTabEnum.LoaiKhoangSan]) {
      this.dangKyKhaiThacLoaiKhoangSan.matSidenav = this.matSidenav;
      this.dangKyKhaiThacLoaiKhoangSan.content = this.content;
      this.dangKyKhaiThacLoaiKhoangSan.iddangkykhaithac = this.iddangkykhaithac;
      this.loadedTabState[DangKyKhaiThacKhoangSanTabEnum.LoaiKhoangSan] = await this.dangKyKhaiThacLoaiKhoangSan.manualDataInit();
    } else if (index === DangKyKhaiThacKhoangSanTabEnum.KhuVucKhaiThac && !this.loadedTabState[DangKyKhaiThacKhoangSanTabEnum.KhuVucKhaiThac]) {
      this.dangKyKhaiThacKhuVuc.matSidenav = this.matSidenav;
      this.dangKyKhaiThacKhuVuc.content = this.content;
      this.dangKyKhaiThacKhuVuc.iddangkykhaithac = this.iddangkykhaithac;
      this.loadedTabState[DangKyKhaiThacKhoangSanTabEnum.KhuVucKhaiThac] = await this.dangKyKhaiThacKhuVuc.manualDataInit();
    } else if (index === DangKyKhaiThacKhoangSanTabEnum.CongTrinhKhaiThac && !this.loadedTabState[DangKyKhaiThacKhoangSanTabEnum.CongTrinhKhaiThac]) {
      this.dangKyKhaiThacCongTrinh.matSidenav = this.matSidenav;
      this.dangKyKhaiThacCongTrinh.content = this.content;
      this.dangKyKhaiThacCongTrinh.iddangkykhaithac = this.iddangkykhaithac;
      this.loadedTabState[DangKyKhaiThacKhoangSanTabEnum.CongTrinhKhaiThac] = await this.dangKyKhaiThacCongTrinh.manualDataInit();
    }
  }
}
