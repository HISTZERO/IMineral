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

import { DangKyThamDoActionEnum, DangKyThamDoKhoangSanTabEnum, LoaiCapPhepEnum } from 'src/app/shared/constants/enum';
import { ContentContainerDirective } from 'src/app/shared/directives/content-container/content-container.directive';
import { DangkythamdogiahanIoComponent } from 'src/app/features/admin/dangkyhoatdongkhoangsan/thamdokhoangsan/thongtindangky/dangkythamdogiahan-io/dangkythamdogiahan-io.component';
import { DangkythamdokhoangsanIoComponent } from 'src/app/features/admin/dangkyhoatdongkhoangsan/thamdokhoangsan/thongtindangky/dangkythamdokhoangsan-io/dangkythamdokhoangsan-io.component';
import { DonvihanhchinhListComponent } from 'src/app/features/admin/dangkyhoatdongkhoangsan/thamdokhoangsan/thongtindangky/donvihanhchinh/donvihanhchinh-list/donvihanhchinh-list.component';
import { LoaikhoangsanListComponent } from 'src/app/features/admin/dangkyhoatdongkhoangsan/thamdokhoangsan/thongtindangky/loaikhoangsan/loaikhoangsan-list/loaikhoangsan-list.component';
import { CongtrinhthamdoListComponent } from 'src/app/features/admin/dangkyhoatdongkhoangsan/thamdokhoangsan/thongtindangky/congtrinhthamdo/congtrinhthamdo-list/congtrinhthamdo-list.component';
import { CommonServiceShared } from 'src/app/services/utilities/common-service';
import { KhuvucthamdoListComponent } from "src/app/features/admin/dangkyhoatdongkhoangsan/thamdokhoangsan/thongtindangky/khuvucthamdo/khuvucthamdo-list/khuvucthamdo-list.component";
import { HoSoGiayToFacadeService } from "src/app/services/admin/hosogiayto/hosogiayto-facade.service";
import { DefaultValue } from 'src/app/shared/constants/global-var';
import { ToadokhuvucComponent } from "../../../../../shared/components/toadokhuvuc/toadokhuvuc.component";

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
  @ViewChild('thongTinDangKyThamDoTabs', { static: false }) thongTinDangKyThamDoTabs;
  @ViewChild(ContentContainerDirective, { static: true }) contentContainer: ContentContainerDirective;
  @ViewChild(Type, { static: true }) public matSidenav: MatSidenav;
  @ViewChild(Type, { read: ViewContainerRef, static: true }) public content: ViewContainerRef;
  @ViewChild("dangKyThamDoDvhc", { static: false }) dangKyThamDoDvhc: DonvihanhchinhListComponent;
  @ViewChild("dangKyThamDoLoaiKhoangSan", { static: false }) dangKyThamDoLoaiKhoangSan: LoaikhoangsanListComponent;
  @ViewChild("dangKyThamDoCongTrinh", { static: false }) dangKyThamDoCongTrinh: CongtrinhthamdoListComponent;
  @ViewChild("dangKyThamDoKhuVuc", { static: false }) dangKyThamDoKhuVuc: KhuvucthamdoListComponent;
  @ViewChild("banDoThamDoKhuVuc", { static: false }) banDoThamDoKhuVuc: ToadokhuvucComponent;
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
    [DangKyThamDoKhoangSanTabEnum.ThongTinChiTiet]: false,
    [DangKyThamDoKhoangSanTabEnum.DonViHanhChinh]: false,
    [DangKyThamDoKhoangSanTabEnum.LoaiKhoangSan]: false,
    [DangKyThamDoKhoangSanTabEnum.KhuVucThamDo]: false,
    [DangKyThamDoKhoangSanTabEnum.BanDoKhuVuc]: false,
    [DangKyThamDoKhoangSanTabEnum.CongTrinhThamDo]: false
  };

  public disabledTabState: any = {
    [DangKyThamDoKhoangSanTabEnum.ThongTinChiTiet]: true,
    [DangKyThamDoKhoangSanTabEnum.DonViHanhChinh]: true,
    [DangKyThamDoKhoangSanTabEnum.LoaiKhoangSan]: true,
    [DangKyThamDoKhoangSanTabEnum.KhuVucThamDo]: true,
    [DangKyThamDoKhoangSanTabEnum.BanDoKhuVuc]: true,
    [DangKyThamDoKhoangSanTabEnum.CongTrinhThamDo]: true
  };

  // Lưu trữ dữ liệu action hiện tại
  public currentAction: number;
  // Chứa dữ liệu translate
  public dataTranslate: any;
  // Lưu trữ dữ liệu iddangkythamdo
  private iddangkythamdo: string;
  // Lưu trữ dữ liệu hồ sơ
  private itemHoSo: any;
  // lưu dữ liệu hệ quy chiếu
  private heQuyChieu = DefaultValue.Empty;
  // lưu trữ componentRef
  private componentRef: any;

  constructor(
    private cfr: ComponentFactoryResolver,
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
      return false;
    }

    this.itemHoSo = await this.getHoSoById(this.idhoso);

    if (!this.itemHoSo) {
      this.commonService.showDialogWarning(this.dataTranslate.DANGKYHOATDONGKHOANGSAN.thongtindangky.informedNotExistedHoSoDangKyThamDo);
      return false;
    }

    await this.showDangKyViewComponent();
    this.thongTinDangKyThamDoTabs.selectedIndex = this.TabType.ThongTinChiTiet;
    this.thongTinDangKyThamDoTabs.realignInkBar();
    return true;
  }

  setDisabledTabState(actionType: number) {
    switch (actionType) {
      case DangKyThamDoActionEnum.Add: {
        this.disabledTabState[DangKyThamDoKhoangSanTabEnum.ThongTinChiTiet] = false;
        this.disabledTabState[DangKyThamDoKhoangSanTabEnum.DonViHanhChinh] = true;
        this.disabledTabState[DangKyThamDoKhoangSanTabEnum.LoaiKhoangSan] = true;
        this.disabledTabState[DangKyThamDoKhoangSanTabEnum.KhuVucThamDo] = true;
        this.disabledTabState[DangKyThamDoKhoangSanTabEnum.BanDoKhuVuc] = true;
        this.disabledTabState[DangKyThamDoKhoangSanTabEnum.CongTrinhThamDo] = true;
        break;
      }
      case DangKyThamDoActionEnum.Edit: {
        this.disabledTabState[DangKyThamDoKhoangSanTabEnum.ThongTinChiTiet] = false;
        this.disabledTabState[DangKyThamDoKhoangSanTabEnum.DonViHanhChinh] = false;
        this.disabledTabState[DangKyThamDoKhoangSanTabEnum.LoaiKhoangSan] = false;
        this.disabledTabState[DangKyThamDoKhoangSanTabEnum.KhuVucThamDo] = false;
        this.disabledTabState[DangKyThamDoKhoangSanTabEnum.BanDoKhuVuc] = false;
        this.disabledTabState[DangKyThamDoKhoangSanTabEnum.CongTrinhThamDo] = false;
        break;
      }
      default: {
        this.disabledTabState[DangKyThamDoKhoangSanTabEnum.ThongTinChiTiet] = true;
        this.disabledTabState[DangKyThamDoKhoangSanTabEnum.DonViHanhChinh] = true;
        this.disabledTabState[DangKyThamDoKhoangSanTabEnum.LoaiKhoangSan] = true;
        this.disabledTabState[DangKyThamDoKhoangSanTabEnum.KhuVucThamDo] = true;
        this.disabledTabState[DangKyThamDoKhoangSanTabEnum.BanDoKhuVuc] = true;
        this.disabledTabState[DangKyThamDoKhoangSanTabEnum.CongTrinhThamDo] = true;
        break;
      }
    }
  }

  private getDangKyThamDoFormState(action: number) {
    this.currentAction = action;
    this.setDisabledTabState(this.currentAction);
    this.resetLoadedTabState();
    this.selectCurrentFormStateEvent.emit(this.currentAction);
  }

  private getIdDangKyThamDo(idDangKyThamDo: string) {
    this.iddangkythamdo = idDangKyThamDo;
  }

  private getHeQuyChieu(heQuyChieu: string) {
    this.heQuyChieu = heQuyChieu;
  }

  getNumberOfDataKhuVucThamDo(data: any) {
    if (this.componentRef && this.componentRef.instance) {
      if (data) {
        if (data.count && data.count > DefaultValue.Zero) {
          this.componentRef.instance.disabledHeQuyChieu = true;
        } else {
          this.componentRef.instance.disabledHeQuyChieu = false;
        }

        if (data.hequychieu) {
          this.componentRef.instance.setDefaultHeQuyChieu(data.hequychieu);
        }
      }
    }
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
      factory = this.cfr.resolveComponentFactory(DangKyThamDoKhoangSanComponent[this.itemHoSo.loaicapphep]);
      const viewContainerRef = this.contentContainer.viewContainerRef;
      this.componentRef = viewContainerRef.createComponent(factory);
      this.componentRef.instance.idhoso = this.itemHoSo.idhoso;
      this.componentRef.instance.matSidenav = this.matSidenav;
      this.componentRef.instance.content = this.content;
      this.componentRef.instance.selectCurrentFormStateEvent.subscribe(event => this.getDangKyThamDoFormState(event));
      this.componentRef.instance.selectIdDangKyThamDoEvent.subscribe(event => this.getIdDangKyThamDo(event));
      this.componentRef.instance.selectHeQuyChieuEvent.subscribe(event => this.getHeQuyChieu(event));
    }
  }

  private resetLoadedTabState() {
    this.loadedTabState[DangKyThamDoKhoangSanTabEnum.DonViHanhChinh] = false;
    this.loadedTabState[DangKyThamDoKhoangSanTabEnum.LoaiKhoangSan] = false;
    this.loadedTabState[DangKyThamDoKhoangSanTabEnum.KhuVucThamDo] = false;
    this.loadedTabState[DangKyThamDoKhoangSanTabEnum.BanDoKhuVuc] = false;
    this.loadedTabState[DangKyThamDoKhoangSanTabEnum.CongTrinhThamDo] = false;
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
      this.dangKyThamDoKhuVuc.heQuyChieu = this.heQuyChieu;
      this.loadedTabState[DangKyThamDoKhoangSanTabEnum.KhuVucThamDo] = await this.dangKyThamDoKhuVuc.manualDataInit();
    } else if (index === DangKyThamDoKhoangSanTabEnum.BanDoKhuVuc && !this.loadedTabState[DangKyThamDoKhoangSanTabEnum.BanDoKhuVuc]) {
      // this.banDoThamDoKhuVuc.iddangkythamdo = this.iddangkythamdo;
      // this.loadedTabState[DangKyThamDoKhoangSanTabEnum.BanDoKhuVuc] = await this.banDoThamDoKhuVuc.manualDataInit();
    } else if (index === DangKyThamDoKhoangSanTabEnum.CongTrinhThamDo && !this.loadedTabState[DangKyThamDoKhoangSanTabEnum.CongTrinhThamDo]) {
      this.dangKyThamDoCongTrinh.matSidenav = this.matSidenav;
      this.dangKyThamDoCongTrinh.content = this.content;
      this.dangKyThamDoCongTrinh.iddangkythamdo = this.iddangkythamdo;
      this.loadedTabState[DangKyThamDoKhoangSanTabEnum.CongTrinhThamDo] = await this.dangKyThamDoCongTrinh.manualDataInit();
    }
  }
}
