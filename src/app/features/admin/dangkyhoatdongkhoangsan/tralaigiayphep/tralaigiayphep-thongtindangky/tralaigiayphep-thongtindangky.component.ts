import { TlgpKhaithactralaiIoComponent } from "./tlgp-khaithactralai-io/tlgp-khaithactralai-io.component";
import { TlgpTanthutralaiIoComponent } from "./tlgp-tanthutralai-io/tlgp-tanthutralai-io.component";
import { TlgpThamdotralaiIoComponent } from "./tlgp-thamdotralai-io/tlgp-thamdotralai-io.component";
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
import { DangKyTraLaiGiayPhepTabEnum, DangKyTraLaiGiayPhepActionEnum, LoaiCapPhepEnum } from 'src/app/shared/constants/enum';
import { ContentContainerDirective } from 'src/app/shared/directives/content-container/content-container.directive';
import { CommonServiceShared } from 'src/app/services/utilities/common-service';
import { KtksDonvihanhchinhListComponent } from "src/app/features/admin/dangkyhoatdongkhoangsan/khaithackhoangsan/ktks-thongtindangky/ktks-donvihanhchinh/ktks-donvihanhchinh-list/ktks-donvihanhchinh-list.component";
import { KtksLoaikhoangsanListComponent } from "src/app/features/admin/dangkyhoatdongkhoangsan/khaithackhoangsan/ktks-thongtindangky/ktks-loaikhoangsan/ktks-loaikhoangsan-list/ktks-loaikhoangsan-list.component";
import { KtksCongtrinhkhaithacListComponent } from "src/app/features/admin/dangkyhoatdongkhoangsan/khaithackhoangsan/ktks-thongtindangky/ktks-congtrinhkhaithac/ktks-congtrinhkhaithac-list/ktks-congtrinhkhaithac-list.component";
import { KhuvuckhaithacListComponent } from "src/app/features/admin/dangkyhoatdongkhoangsan/khaithackhoangsan/ktks-thongtindangky/khuvuckhaithac/khuvuckhaithac-list/khuvuckhaithac-list.component";

export const DangKyTraLaiGiayPhepComponent: any = {
  [LoaiCapPhepEnum.TraLaiGiayPhepKhaiThacKhoangSan]: TlgpKhaithactralaiIoComponent,
  [LoaiCapPhepEnum.TraLaiGiayPhepThamDoKhoangSan]: TlgpThamdotralaiIoComponent,
  [LoaiCapPhepEnum.TraLaiGiayPhepTanThuKhoangSan]: TlgpTanthutralaiIoComponent,
};

@Component({
  selector: 'app-tralaigiayphep-thongtindangky',
  templateUrl: './tralaigiayphep-thongtindangky.component.html',
  styleUrls: ['./tralaigiayphep-thongtindangky.component.scss']
})

export class TralaigiayphepThongtindangkyComponent implements OnInit {

  @ViewChild('thongTinDangKyTraLaiTabs', { static: false }) thongTinDangKyTraLaiTabs;
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
  public TabType = DangKyTraLaiGiayPhepTabEnum;

  // Lưu trữ dữ liệu id hồ sơ
  public idhoso;
  
  // Lưu trữ trạng thais tab được select
  public loadedTabState: any = {
    [DangKyTraLaiGiayPhepTabEnum.ThongTinChiTiet]: false,
    [DangKyTraLaiGiayPhepTabEnum.DonViHanhChinh]: false,
    [DangKyTraLaiGiayPhepTabEnum.LoaiKhoangSan]: false,
    [DangKyTraLaiGiayPhepTabEnum.KhuVucKhaiThac]: false,
    [DangKyTraLaiGiayPhepTabEnum.CongTrinhKhaiThac]: false,
  };

  public disabledTabState: any = {
    [DangKyTraLaiGiayPhepTabEnum.ThongTinChiTiet]: true,
    [DangKyTraLaiGiayPhepTabEnum.DonViHanhChinh]: true,
    [DangKyTraLaiGiayPhepTabEnum.LoaiKhoangSan]: true,
    [DangKyTraLaiGiayPhepTabEnum.KhuVucKhaiThac]: true,
    [DangKyTraLaiGiayPhepTabEnum.CongTrinhKhaiThac]: true,
  };

  // Lưu trữ dữ liệu action hiện tại
  public currentAction: number;
  // Chứa dữ liệu translate
  public dataTranslate: any;
  // Lưu trữ dữ liệu iddangkythamdo
  private iddangky: string;
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

  /**
   * Hàm chung khởi tạo dữ liệu
   */
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
    this.thongTinDangKyTraLaiTabs.selectedIndex = this.TabType.ThongTinChiTiet;
    this.thongTinDangKyTraLaiTabs.realignInkBar();
    return true;
  }

  /**
   * Thiết lập trạng thái tab theo các chức năng
   */
  setTraLaiGiayPhepDisabledTabState(actionType: number) {
    switch (actionType) {
      case DangKyTraLaiGiayPhepActionEnum.Add: {
        this.disabledTabState[DangKyTraLaiGiayPhepTabEnum.ThongTinChiTiet] = false;
        this.disabledTabState[DangKyTraLaiGiayPhepTabEnum.DonViHanhChinh] = true;
        this.disabledTabState[DangKyTraLaiGiayPhepTabEnum.LoaiKhoangSan] = true;
        this.disabledTabState[DangKyTraLaiGiayPhepTabEnum.KhuVucKhaiThac] = true;
        this.disabledTabState[DangKyTraLaiGiayPhepTabEnum.CongTrinhKhaiThac] = true;
        break;
      }
      case DangKyTraLaiGiayPhepActionEnum.Edit: {
        this.disabledTabState[DangKyTraLaiGiayPhepTabEnum.ThongTinChiTiet] = false;
        this.disabledTabState[DangKyTraLaiGiayPhepTabEnum.DonViHanhChinh] = false;
        this.disabledTabState[DangKyTraLaiGiayPhepTabEnum.LoaiKhoangSan] = false;
        this.disabledTabState[DangKyTraLaiGiayPhepTabEnum.KhuVucKhaiThac] = false;
        this.disabledTabState[DangKyTraLaiGiayPhepTabEnum.CongTrinhKhaiThac] = false;
        break;
      }
      default: {
        this.disabledTabState[DangKyTraLaiGiayPhepTabEnum.ThongTinChiTiet] = true;
        this.disabledTabState[DangKyTraLaiGiayPhepTabEnum.DonViHanhChinh] = true;
        this.disabledTabState[DangKyTraLaiGiayPhepTabEnum.LoaiKhoangSan] = true;
        this.disabledTabState[DangKyTraLaiGiayPhepTabEnum.KhuVucKhaiThac] = true;
        this.disabledTabState[DangKyTraLaiGiayPhepTabEnum.CongTrinhKhaiThac] = true;
        break;
      }
    }
  }

  /**
   * Lấy trạng thái form 
   */
  getDangKyTraLaiGiayPhepFormState(action: number) {
    this.currentAction = action;
    this.setTraLaiGiayPhepDisabledTabState(this.currentAction);
    this.resetLoadedTabState();
    this.selectCurrentFormStateEvent.emit(this.currentAction);
  }

  /**
   * Lấy id đăng ký trả lại
   */
  getIdDangKyTraLaiGiayPhep(idDangKyTraLai: string) {
    this.iddangky = idDangKyTraLai;
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

  /**
   * Hiển thị view đăng ký
   */
  private async showDangKyViewComponent() {
    let factory: any;
    this.contentContainer.viewContainerRef.clear();
    
    if (this.itemHoSo) {
      factory = this.cfr.resolveComponentFactory(DangKyTraLaiGiayPhepComponent[this.itemHoSo.loaicapphep]);
    }

    const viewContainerRef = this.contentContainer.viewContainerRef;
    const componentRef: any = viewContainerRef.createComponent(factory);
    componentRef.instance.idhoso = this.itemHoSo.idhoso;
    componentRef.instance.matSidenav = this.matSidenav;
    componentRef.instance.content = this.content;
    componentRef.instance.selectCurrentFormStateEvent.subscribe(event => this.getDangKyTraLaiGiayPhepFormState(event));
    componentRef.instance.selectIdDangKyKhaiThacTraLaiEvent.subscribe(event => this.getIdDangKyTraLaiGiayPhep(event));
  }

  /**
   * Reset Trạng thái load tab
   */
  private resetLoadedTabState() {
    this.loadedTabState[DangKyTraLaiGiayPhepTabEnum.DonViHanhChinh] = false;
    this.loadedTabState[DangKyTraLaiGiayPhepTabEnum.LoaiKhoangSan] = false;
    this.loadedTabState[DangKyTraLaiGiayPhepTabEnum.KhuVucKhaiThac] = false;
    this.loadedTabState[DangKyTraLaiGiayPhepTabEnum.CongTrinhKhaiThac] = false;
  }

  /**
   * Hàm chạy khi thay đổi tab
   * @param index 
   */
  async tabChange(index: any) {
    if (index === DangKyTraLaiGiayPhepTabEnum.DonViHanhChinh && !this.loadedTabState[DangKyTraLaiGiayPhepTabEnum.DonViHanhChinh]) {
      this.dangKyKhaiThacKsDvhc.matSidenav = this.matSidenav;
      this.dangKyKhaiThacKsDvhc.content = this.content;
      this.dangKyKhaiThacKsDvhc.iddangkykhaithac = this.iddangky;
      this.loadedTabState[DangKyTraLaiGiayPhepTabEnum.DonViHanhChinh] = await this.dangKyKhaiThacKsDvhc.manualDataInit();
    } else if (index === DangKyTraLaiGiayPhepTabEnum.LoaiKhoangSan && !this.loadedTabState[DangKyTraLaiGiayPhepTabEnum.LoaiKhoangSan]) {
      this.dangKyKhaiThacLoaiKhoangSan.matSidenav = this.matSidenav;
      this.dangKyKhaiThacLoaiKhoangSan.content = this.content;
      this.dangKyKhaiThacLoaiKhoangSan.iddangkykhaithac = this.iddangky;
      this.loadedTabState[DangKyTraLaiGiayPhepTabEnum.LoaiKhoangSan] = await this.dangKyKhaiThacLoaiKhoangSan.manualDataInit();
    } else if (index === DangKyTraLaiGiayPhepTabEnum.KhuVucKhaiThac && !this.loadedTabState[DangKyTraLaiGiayPhepTabEnum.KhuVucKhaiThac]) {
      this.dangKyKhaiThacKhuVuc.matSidenav = this.matSidenav;
      this.dangKyKhaiThacKhuVuc.content = this.content;
      this.dangKyKhaiThacKhuVuc.iddangkykhaithac = this.iddangky;
      this.dangKyKhaiThacKhuVuc.loaicapphep = this.itemHoSo.loaicapphep;
      this.loadedTabState[DangKyTraLaiGiayPhepTabEnum.KhuVucKhaiThac] = await this.dangKyKhaiThacKhuVuc.manualDataInit();
    } else if (index === DangKyTraLaiGiayPhepTabEnum.CongTrinhKhaiThac && !this.loadedTabState[DangKyTraLaiGiayPhepTabEnum.CongTrinhKhaiThac]) {
      this.dangKyKhaiThacCongTrinh.matSidenav = this.matSidenav;
      this.dangKyKhaiThacCongTrinh.content = this.content;
      this.dangKyKhaiThacCongTrinh.iddangkykhaithac = this.iddangky;
      this.loadedTabState[DangKyTraLaiGiayPhepTabEnum.CongTrinhKhaiThac] = await this.dangKyKhaiThacCongTrinh.manualDataInit();
    }
  }

}
