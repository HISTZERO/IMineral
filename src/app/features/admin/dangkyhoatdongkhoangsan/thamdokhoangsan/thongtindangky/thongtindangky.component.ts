import { Component, ComponentFactoryResolver, EventEmitter, Input, OnInit, Output, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DangKyHoatDongKhoangSanFacadeService } from 'src/app/services/admin/dangkyhoatdongkhoangsan/dangkyhoatdongkhoangsan-facade.service';
import { DangKyThamDoActionEnum, DangKyThamDoKhoangSanTabEnum, LoaiCapPhepEnum } from 'src/app/shared/constants/enum';
import { ContentContainerDirective } from 'src/app/shared/directives/content-container/content-container.directive';
import { DangkythamdogiahanIoComponent } from 'src/app/features/admin/dangkyhoatdongkhoangsan/thamdokhoangsan/thongtindangky/dangkythamdogiahan-io/dangkythamdogiahan-io.component';
import { DangkythamdokhoangsanIoComponent } from 'src/app/features/admin/dangkyhoatdongkhoangsan/thamdokhoangsan/thongtindangky/dangkythamdokhoangsan-io/dangkythamdokhoangsan-io.component';
import { DonvihanhchinhListComponent } from 'src/app/features/admin/dangkyhoatdongkhoangsan/thamdokhoangsan/thongtindangky/donvihanhchinh/donvihanhchinh-list/donvihanhchinh-list.component';
import { LoaikhoangsanListComponent } from 'src/app/features/admin/dangkyhoatdongkhoangsan/thamdokhoangsan/thongtindangky/loaikhoangsan/loaikhoangsan-list/loaikhoangsan-list.component';
import { CongtrinhthamdoListComponent } from './congtrinhthamdo/congtrinhthamdo-list/congtrinhthamdo-list.component';
import { CommonServiceShared } from 'src/app/services/utilities/common-service';
import { KhuvucthamdoListComponent } from "./khuvucthamdo/khuvucthamdo-list/khuvucthamdo-list.component";

export const DangKyThamDoKhoangSanComponent: any = {
  [LoaiCapPhepEnum.ThamDoKhoangSan]: DangkythamdokhoangsanIoComponent,
  [LoaiCapPhepEnum.ThamDoGiaHan]: DangkythamdogiahanIoComponent
};

@Component({
  selector: 'app-thongtindangky',
  templateUrl: './thongtindangky.component.html',
  styleUrls: ['./thongtindangky.component.scss']
})
export class ThongtindangkyComponent implements OnInit {
  @ViewChild('thongTinDangKyThamDoTabs', {static: false}) thongTinDangKyThamDoTabs;
  @ViewChild(ContentContainerDirective, { static: true }) contentContainer: ContentContainerDirective;
  @ViewChild(Type, { static: true }) public matSidenav: MatSidenav;
  @ViewChild(Type, { read: ViewContainerRef, static: true }) public content: ViewContainerRef;
  @ViewChild("dangKyThamDoDvhc", { static: false }) dangKyThamDoDvhc: DonvihanhchinhListComponent;
  @ViewChild("dangKyThamDoLoaiKhoangSan", { static: false }) dangKyThamDoLoaiKhoangSan: LoaikhoangsanListComponent;
  @ViewChild("dangKyThamDoCongTrinh", { static: false }) dangKyThamDoCongTrinh: CongtrinhthamdoListComponent;
  @ViewChild("dangKyThamDoKhuVuc", { static: false }) dangKyThamDoKhuVuc: KhuvucthamdoListComponent;
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
    [DangKyThamDoKhoangSanTabEnum.ThongTinChiTiet] : true,
    [DangKyThamDoKhoangSanTabEnum.DonViHanhChinh] : false,
    [DangKyThamDoKhoangSanTabEnum.LoaiKhoangSan] : false,
    [DangKyThamDoKhoangSanTabEnum.KhuVucThamDo] : false,
    [DangKyThamDoKhoangSanTabEnum.CongTrinhThamDo] : false
  };

  public disabledTabState: any = {
    [DangKyThamDoKhoangSanTabEnum.ThongTinChiTiet] : false,
    [DangKyThamDoKhoangSanTabEnum.DonViHanhChinh] : false,
    [DangKyThamDoKhoangSanTabEnum.LoaiKhoangSan] : false,
    [DangKyThamDoKhoangSanTabEnum.KhuVucThamDo] : false,
    [DangKyThamDoKhoangSanTabEnum.CongTrinhThamDo] : false
  };

  // Lưu trữ dữ liệu action hiện tại
  public currentAction: number;
  // Chứa dữ liệu translate
  public dataTranslate: any;
  // Lưu trữ dữ liệu iddangkythamdo
  private iddangkythamdo: string;
  // Lưu trữ dữ liệu hồ sơ
  private itemHoSo: any;

  constructor(private cfr: ComponentFactoryResolver,
              private translate: TranslateService,
              private activatedRoute: ActivatedRoute,
              public commonService: CommonServiceShared,
              private dangKyHoatDongKhoangSanFacadeService: DangKyHoatDongKhoangSanFacadeService) { }

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

    this.itemHoSo =  await this.getHoSoById(this.idhoso);

    if (!this.itemHoSo) {
      this.commonService.showDialogWarning(this.dataTranslate.DANGKYHOATDONGKHOANGSAN.thongtindangky.informedNotExistedHoSoDangKyThamDo);
      return;
    }

    await this.showDangKyViewComponent();

    this.thongTinDangKyThamDoTabs.realignInkBar();
    return true;
  }

  setThamDoKhoangSanDisabledTabState(actionType: number) {
    switch (actionType) {
      case DangKyThamDoActionEnum.Add: {
        this.disabledTabState[DangKyThamDoKhoangSanTabEnum.ThongTinChiTiet] = true;
        this.disabledTabState[DangKyThamDoKhoangSanTabEnum.DonViHanhChinh] = false,
        this.disabledTabState[DangKyThamDoKhoangSanTabEnum.LoaiKhoangSan] = false;
        this.disabledTabState[DangKyThamDoKhoangSanTabEnum.KhuVucThamDo] = false;
        this.disabledTabState[DangKyThamDoKhoangSanTabEnum.CongTrinhThamDo] = false;
        break;
      }
      case DangKyThamDoActionEnum.Edit: {
        this.disabledTabState[DangKyThamDoKhoangSanTabEnum.ThongTinChiTiet] = true;
        this.disabledTabState[DangKyThamDoKhoangSanTabEnum.DonViHanhChinh] = true,
        this.disabledTabState[DangKyThamDoKhoangSanTabEnum.LoaiKhoangSan] = true;
        this.disabledTabState[DangKyThamDoKhoangSanTabEnum.KhuVucThamDo] = true;
        this.disabledTabState[DangKyThamDoKhoangSanTabEnum.CongTrinhThamDo] = true;
        break;
      }
      default: {
        this.disabledTabState[DangKyThamDoKhoangSanTabEnum.ThongTinChiTiet] = false;
        this.disabledTabState[DangKyThamDoKhoangSanTabEnum.DonViHanhChinh] = false,
        this.disabledTabState[DangKyThamDoKhoangSanTabEnum.LoaiKhoangSan] = false;
        this.disabledTabState[DangKyThamDoKhoangSanTabEnum.KhuVucThamDo] = false;
        this.disabledTabState[DangKyThamDoKhoangSanTabEnum.CongTrinhThamDo] = false;
        break;
      }
    }
  }

  getDangKyThamDoFormState(action: number) {
    this.currentAction = action;
    this.setThamDoKhoangSanDisabledTabState(this.currentAction);
    this.selectCurrentFormStateEvent.emit(this.currentAction);
  }

  getIdDangKyThamDo(idDangKyThamDo: string) {
    this.iddangkythamdo = idDangKyThamDo;
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
      factory = this.cfr.resolveComponentFactory(DangKyThamDoKhoangSanComponent[this.itemHoSo.loaicapphep]);
    }

    const viewContainerRef = this.contentContainer.viewContainerRef;
    const componentRef: any = viewContainerRef.createComponent(factory);
    componentRef.instance.idhoso = this.itemHoSo.idhoso;
    componentRef.instance.matSidenav =  this.matSidenav;
    componentRef.instance.content = this.content;
    componentRef.instance.selectCurrentFormStateEvent.subscribe(event => this.getDangKyThamDoFormState(event));
    componentRef.instance.selectIdDangKyThamDoEvent.subscribe(event => this.getIdDangKyThamDo(event));
  }

  async tabChange(index: any) {
    if (index === DangKyThamDoKhoangSanTabEnum.DonViHanhChinh && !this.loadedTabState[DangKyThamDoKhoangSanTabEnum.DonViHanhChinh]) {
      this.dangKyThamDoDvhc.matSidenav = this.matSidenav;
      this.dangKyThamDoDvhc.content = this.content;
      this.dangKyThamDoDvhc.iddangkythamdo = this.iddangkythamdo;
      this.loadedTabState[DangKyThamDoKhoangSanTabEnum.DonViHanhChinh] = await this.dangKyThamDoDvhc.manualDataInit();
    } else if (index === DangKyThamDoKhoangSanTabEnum.LoaiKhoangSan && !this.loadedTabState[DangKyThamDoKhoangSanTabEnum.LoaiKhoangSan]) {
      this.dangKyThamDoLoaiKhoangSan.matSidenav = this.matSidenav;
      this.dangKyThamDoLoaiKhoangSan.content = this.content;
      this.dangKyThamDoLoaiKhoangSan.iddangkythamdo = this.iddangkythamdo;
      this.loadedTabState[DangKyThamDoKhoangSanTabEnum.LoaiKhoangSan] = await this.dangKyThamDoLoaiKhoangSan.manualDataInit();
    } else if (index === DangKyThamDoKhoangSanTabEnum.KhuVucThamDo && !this.loadedTabState[DangKyThamDoKhoangSanTabEnum.KhuVucThamDo]) {
      this.dangKyThamDoKhuVuc.matSidenav = this.matSidenav;
      this.dangKyThamDoKhuVuc.content = this.content;
      this.dangKyThamDoKhuVuc.iddangkythamdo = this.iddangkythamdo;
      this.dangKyThamDoKhuVuc.loaicapphep = this.itemHoSo.loaicapphep;
      this.loadedTabState[DangKyThamDoKhoangSanTabEnum.KhuVucThamDo] = await this.dangKyThamDoKhuVuc.manualDataInit();
    } else if (index === DangKyThamDoKhoangSanTabEnum.CongTrinhThamDo && !this.loadedTabState[DangKyThamDoKhoangSanTabEnum.CongTrinhThamDo]) {
      this.dangKyThamDoCongTrinh.matSidenav = this.matSidenav;
      this.dangKyThamDoCongTrinh.content = this.content;
      this.dangKyThamDoCongTrinh.iddangkythamdo = this.iddangkythamdo;
      this.loadedTabState[DangKyThamDoKhoangSanTabEnum.CongTrinhThamDo] = await this.dangKyThamDoCongTrinh.manualDataInit();
    }
  }
}
