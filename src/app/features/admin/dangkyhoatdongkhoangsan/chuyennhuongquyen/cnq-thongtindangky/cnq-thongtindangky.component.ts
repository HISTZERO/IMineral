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
import {MatSidenav} from "@angular/material/sidenav";
import {DangKyTanThuKhoangSanTabEnum, LoaiCapPhepEnum} from "src/app/shared/constants/enum";
import {TranslateService} from "@ngx-translate/core";
import {ActivatedRoute} from "@angular/router";
import {DangKyHoatDongKhoangSanFacadeService} from "src/app/services/admin/dangkyhoatdongkhoangsan/dangkyhoatdongkhoangsan-facade.service";
import {HoSoGiayToFacadeService} from "src/app/services/admin/hosogiayto/hosogiayto-facade.service";
import {CommonServiceShared} from "src/app/services/utilities/common-service";
import {DangkythamdochuyennhuongIoComponent} from "src/app/features/admin/dangkyhoatdongkhoangsan/chuyennhuongquyen/cnq-thongtindangky/dangkythamdochuyennhuong-io/dangkythamdochuyennhuong-io.component";
import {DangkykhaithacchuyennhuongIoComponent} from "src/app/features/admin/dangkyhoatdongkhoangsan/chuyennhuongquyen/cnq-thongtindangky/dangkykhaithacchuyennhuong-io/dangkykhaithacchuyennhuong-io.component";


export const DangKyChuyenNhuongQuyenComponent: any = {
  [LoaiCapPhepEnum.ChuyenNhuongQuyenThamDoKhoangSan]: DangkythamdochuyennhuongIoComponent,
  [LoaiCapPhepEnum.ChuyenNhuongQuyenKhaiThacKhoangSan]: DangkykhaithacchuyennhuongIoComponent,
};

@Component({
  selector: 'app-cnq-thongtindangky',
  templateUrl: './cnq-thongtindangky.component.html',
  styleUrls: ['./cnq-thongtindangky.component.scss']
})
export class CnqThongtindangkyComponent implements OnInit {


  // @ViewChild('thongTinDangKyTanThuTabs', {static: false}) thongTinDangKyTanThuTabs;
  @ViewChild(ContentContainerDirective, {static: true}) contentContainer: ContentContainerDirective;
  @ViewChild(Type, {static: true}) public matSidenav: MatSidenav;
  @ViewChild(Type, {read: ViewContainerRef, static: true}) public content: ViewContainerRef;
  // tslint:disable-next-line: no-input-rename
  @Input("allowAutoInit") allowAutoInit = true;
  // tslint:disable-next-line: no-output-rename
  @Output("selectCurrentFormStateEvent") selectCurrentFormStateEvent: EventEmitter<number> = new EventEmitter();
  // Lưu trữ thông tin đăng ký tab
  public TabType = DangKyTanThuKhoangSanTabEnum;
  // Lưu trữ dữ liệu id hồ sơ
  public idhoso;
  // Lưu trữ trạng thais tab được select
  // public loadedTabState: any = {
  //   [DangKyTanThuKhoangSanTabEnum.ThongTinChiTiet]: false,
  //   [DangKyTanThuKhoangSanTabEnum.DonViHanhChinh]: false,
  //   [DangKyTanThuKhoangSanTabEnum.LoaiKhoangSan]: false,
  //   [DangKyTanThuKhoangSanTabEnum.KhuVucTanThu]: false,
  // };
  //
  // public disabledTabState: any = {
  //   [DangKyTanThuKhoangSanTabEnum.ThongTinChiTiet]: true,
  //   [DangKyTanThuKhoangSanTabEnum.DonViHanhChinh]: true,
  //   [DangKyTanThuKhoangSanTabEnum.LoaiKhoangSan]: true,
  //   [DangKyTanThuKhoangSanTabEnum.KhuVucTanThu]: true,
  // };

  // Lưu trữ dữ liệu action hiện tại
  public currentAction: number;
  // Chứa dữ liệu translate
  public dataTranslate: any;
  // Lưu trữ dữ liệu iddangkythamdo
  private iddangkythamdo: string;
  private iddangkykhaithac: string;
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

    await this.showDangKyViewComponent();
    // this.thongTinDangKyTanThuTabs.selectedIndex = this.TabType.ThongTinChiTiet;
    // this.thongTinDangKyTanThuTabs.realignInkBar();
    return true;
  }


  getDangKyChuyenNhuongFormState(action: number) {
    this.currentAction = action;
    // this.setDisabledTabState(this.currentAction);
    // this.resetLoadedTabState();
    this.selectCurrentFormStateEvent.emit(this.currentAction);
  }

  getIdDangKyThamDoChuyenNhuong(idDangKyThamDo: string) {
    this.iddangkythamdo = idDangKyThamDo;
  }

  getIdDangKyKhaiThacChuyenNhuong(idDangKyKhaiThac: string) {
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
      factory = this.cfr.resolveComponentFactory(DangKyChuyenNhuongQuyenComponent[this.itemHoSo.loaicapphep]);
      const viewContainerRef = this.contentContainer.viewContainerRef;
      const componentRef: any = viewContainerRef.createComponent(factory);
      componentRef.instance.idhoso = this.itemHoSo.idhoso;
      componentRef.instance.matSidenav = this.matSidenav;
      componentRef.instance.content = this.content;
      componentRef.instance.selectCurrentFormStateEvent.subscribe(event => this.getDangKyChuyenNhuongFormState(event));
      if (this.itemHoSo.loaicapphep === LoaiCapPhepEnum.ChuyenNhuongQuyenThamDoKhoangSan) {
        componentRef.instance.selectIdDangKyChuyenNhuongEvent.subscribe(event => this.getIdDangKyThamDoChuyenNhuong(event));
      } else {
        componentRef.instance.selectIdDangKyChuyenNhuongEvent.subscribe(event => this.getIdDangKyKhaiThacChuyenNhuong(event));
      }

    }
  }


}
