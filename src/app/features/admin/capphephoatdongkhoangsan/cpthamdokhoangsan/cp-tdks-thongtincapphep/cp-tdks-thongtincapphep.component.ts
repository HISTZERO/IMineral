import { Component, ComponentFactoryResolver, EventEmitter, Input, OnInit, Output, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CommonServiceShared } from 'src/app/services/utilities/common-service';
import { CapPhepThamDoActionEnum, CpThamDoKhoangSanTabEnum, LoaiCapPhepEnum } from 'src/app/shared/constants/enum';
import { DefaultValue } from 'src/app/shared/constants/global-var';
import {HoSoGiayToFacadeService} from 'src/app/services/admin/hosogiayto/hosogiayto-facade.service';
import { ContentContainerDirective } from 'src/app/shared/directives/content-container/content-container.directive';
import { CpTdksThamdokhoangsanIoComponent } from 'src/app/features/admin/capphephoatdongkhoangsan/cpthamdokhoangsan/cp-tdks-thongtincapphep/cp-tdks-thamdokhoangsan-io/cp-tdks-thamdokhoangsan-io.component';

export const CapPhepThamDoKhoangSanComponent: any = {
  [LoaiCapPhepEnum.ThamDoKhoangSan]: CpTdksThamdokhoangsanIoComponent,
  [LoaiCapPhepEnum.ThamDoGiaHan]: CpTdksThamdokhoangsanIoComponent
};

@Component({
  selector: 'app-cp-tdks-thongtincapphep',
  templateUrl: './cp-tdks-thongtincapphep.component.html',
  styleUrls: ['./cp-tdks-thongtincapphep.component.scss']
})
export class CpTdksThongtincapphepComponent implements OnInit {
  @ViewChild('thongTinCapPhepThamDoTabs', {static: false}) thongTinCapPhepThamDoTabs;
  @ViewChild(ContentContainerDirective, { static: true }) contentContainer: ContentContainerDirective;
  @ViewChild(Type, { static: true }) public matSidenav: MatSidenav;
  @ViewChild(Type, { read: ViewContainerRef, static: true }) public content: ViewContainerRef;
  @ViewChild("capPhepThamDoDvhc", { static: false }) capPhepThamDoDvhc: any;
  @ViewChild("capPhepThamDoLoaiKhoangSan", { static: false }) capPhepThamDoLoaiKhoangSan: any;
  @ViewChild("capPhepThamDoCongTrinh", { static: false }) capPhepThamDoCongTrinh: any;
  @ViewChild("capPhepThamDoKhuVuc", { static: false }) capPhepThamDoKhuVuc: any;
  // tslint:disable-next-line: no-input-rename
  @Input("allowAutoInit") allowAutoInit = true;
  // tslint:disable-next-line: no-output-rename
  @Output("selectCurrentFormStateEvent") selectCurrentFormStateEvent: EventEmitter<number> = new EventEmitter();
  // Lưu trữ thông tin đăng ký tab
  public TabType = CpThamDoKhoangSanTabEnum;
  // Lưu trữ dữ liệu id giấy phép
  public idgiayphep;
  // Lưu trữ trạng thais tab được select
  public loadedTabState: any = {
    [CpThamDoKhoangSanTabEnum.ThongTinChiTiet] : false,
    [CpThamDoKhoangSanTabEnum.DonViHanhChinh] : false,
    [CpThamDoKhoangSanTabEnum.LoaiKhoangSan] : false,
    [CpThamDoKhoangSanTabEnum.KhuVucThamDo] : false,
    [CpThamDoKhoangSanTabEnum.CongTrinhThamDo] : false
  };

  public disabledTabState: any = {
    [CpThamDoKhoangSanTabEnum.ThongTinChiTiet] : true,
    [CpThamDoKhoangSanTabEnum.DonViHanhChinh] : true,
    [CpThamDoKhoangSanTabEnum.LoaiKhoangSan] : true,
    [CpThamDoKhoangSanTabEnum.KhuVucThamDo] : true,
    [CpThamDoKhoangSanTabEnum.CongTrinhThamDo] : true
  };

   // Lưu trữ dữ liệu action hiện tại
   public currentAction: number;
   // Chứa dữ liệu translate
   public dataTranslate: any;
   // Lưu trữ dữ liệu idcapphepthamdo
   private idcapphepthamdo: string;
   // Lưu trữ dữ liệu giấy phép
   private itemGiayPhep: any;

  constructor(private cfr: ComponentFactoryResolver,
              private translate: TranslateService,
              private activatedRoute: ActivatedRoute,
              public commonService: CommonServiceShared,
              private hoSoGiayToFacadeService: HoSoGiayToFacadeService,) { }

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
      if (param && param.params && param.params.idgiayphep) {
        this.idgiayphep = param.params.idgiayphep;
      }
    });

    if (this.idgiayphep === DefaultValue.Null || this.idgiayphep === DefaultValue.Undefined || this.idgiayphep.trim() === DefaultValue.Empty) {
      this.commonService.showDialogWarning(this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.thongtincapphep.informedNotExistedGiayPhepThamDo);
      return;
    }

    this.itemGiayPhep =  await this.getGiayPhepById(this.idgiayphep);

    if (!this.itemGiayPhep) {
      this.commonService.showDialogWarning(this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.thongtincapphep.informedNotExistedGiayPhepThamDo);
      return;
    }

    await this.showCapPhepViewComponent();

    this.thongTinCapPhepThamDoTabs.realignInkBar();
    return true;
  }

  setDisabledTabState(actionType: number) {
    switch (actionType) {
      case CapPhepThamDoActionEnum.Add: {
        this.disabledTabState[CpThamDoKhoangSanTabEnum.ThongTinChiTiet] = false;
        this.disabledTabState[CpThamDoKhoangSanTabEnum.DonViHanhChinh] = true;
        this.disabledTabState[CpThamDoKhoangSanTabEnum.LoaiKhoangSan] = true;
        this.disabledTabState[CpThamDoKhoangSanTabEnum.KhuVucThamDo] = true;
        this.disabledTabState[CpThamDoKhoangSanTabEnum.CongTrinhThamDo] = true;
        break;
      }
      case CapPhepThamDoActionEnum.Edit: {
        this.disabledTabState[CpThamDoKhoangSanTabEnum.ThongTinChiTiet] = false;
        this.disabledTabState[CpThamDoKhoangSanTabEnum.DonViHanhChinh] = false;
        this.disabledTabState[CpThamDoKhoangSanTabEnum.LoaiKhoangSan] = false;
        this.disabledTabState[CpThamDoKhoangSanTabEnum.KhuVucThamDo] = false;
        this.disabledTabState[CpThamDoKhoangSanTabEnum.CongTrinhThamDo] = false;
        break;
      }
      default: {
        this.disabledTabState[CpThamDoKhoangSanTabEnum.ThongTinChiTiet] = true;
        this.disabledTabState[CpThamDoKhoangSanTabEnum.DonViHanhChinh] = true;
        this.disabledTabState[CpThamDoKhoangSanTabEnum.LoaiKhoangSan] = true;
        this.disabledTabState[CpThamDoKhoangSanTabEnum.KhuVucThamDo] = true;
        this.disabledTabState[CpThamDoKhoangSanTabEnum.CongTrinhThamDo] = true;
        break;
      }
    }
  }

  private resetLoadedTabState() {
    this.loadedTabState[CpThamDoKhoangSanTabEnum.DonViHanhChinh] = false;
    this.loadedTabState[CpThamDoKhoangSanTabEnum.LoaiKhoangSan] = false;
    this.loadedTabState[CpThamDoKhoangSanTabEnum.KhuVucThamDo] = false;
    this.loadedTabState[CpThamDoKhoangSanTabEnum.CongTrinhThamDo] = false;
  }

  getCapPhepThamDoFormState(action: number) {
    this.currentAction = action;
    this.setDisabledTabState(this.currentAction);
    this.resetLoadedTabState();
    this.selectCurrentFormStateEvent.emit(this.currentAction);
  }

  getIdCapPhepThamDo(idCapPhepThamDo: string) {
    this.idcapphepthamdo = idCapPhepThamDo;
  }

  /**
   * Lấy dữ liệu hồ sơ theo IdGiayPhep
   * @param IdGiayPhep
   */
  private async getGiayPhepById(IdGiayPhep: string) {
    const giayPhepService = this.hoSoGiayToFacadeService.getGiayPhepService();
    const itemGiayPhep = await giayPhepService.getByid(IdGiayPhep).toPromise();
    return itemGiayPhep;
  }

  private async showCapPhepViewComponent() {
    let factory: any;
    this.contentContainer.viewContainerRef.clear();

    if (this.itemGiayPhep) {
      factory = this.cfr.resolveComponentFactory(CapPhepThamDoKhoangSanComponent[this.itemGiayPhep.loaicapphep]);
    }

    const viewContainerRef = this.contentContainer.viewContainerRef;
    const componentRef: any = viewContainerRef.createComponent(factory);
    componentRef.instance.idgiayphep = this.itemGiayPhep.idgiayphep;
    componentRef.instance.matSidenav =  this.matSidenav;
    componentRef.instance.content = this.content;
    componentRef.instance.itemGiayPhep = this.itemGiayPhep;

    if (this.itemGiayPhep.loaicapphep === LoaiCapPhepEnum.ThamDoGiaHan) {
      componentRef.instance.disabledDienTichTraLai = false;
    } else {
      componentRef.instance.disabledDienTichTraLai = true;
    }

    componentRef.instance.selectCurrentFormStateEvent.subscribe(event => this.getCapPhepThamDoFormState(event));
    componentRef.instance.selectIdCapPhepThamDoEvent.subscribe(event => this.getIdCapPhepThamDo(event));
  }

  async tabChange(index: any) {
    if (index === CpThamDoKhoangSanTabEnum.DonViHanhChinh && !this.loadedTabState[CpThamDoKhoangSanTabEnum.DonViHanhChinh]) {
      this.capPhepThamDoDvhc.matSidenav = this.matSidenav;
      this.capPhepThamDoDvhc.content = this.content;
      this.capPhepThamDoDvhc.idcapphepthamdo = this.idcapphepthamdo;
      this.loadedTabState[CpThamDoKhoangSanTabEnum.DonViHanhChinh] = await this.capPhepThamDoDvhc.manualDataInit();
    } else if (index === CpThamDoKhoangSanTabEnum.LoaiKhoangSan && !this.loadedTabState[CpThamDoKhoangSanTabEnum.LoaiKhoangSan]) {
      this.capPhepThamDoLoaiKhoangSan.matSidenav = this.matSidenav;
      this.capPhepThamDoLoaiKhoangSan.content = this.content;
      this.capPhepThamDoLoaiKhoangSan.idcapphepthamdo = this.idcapphepthamdo;
      this.loadedTabState[CpThamDoKhoangSanTabEnum.LoaiKhoangSan] = await this.capPhepThamDoLoaiKhoangSan.manualDataInit();
    } else if (index === CpThamDoKhoangSanTabEnum.KhuVucThamDo && !this.loadedTabState[CpThamDoKhoangSanTabEnum.KhuVucThamDo]) {
      this.capPhepThamDoKhuVuc.matSidenav = this.matSidenav;
      this.capPhepThamDoKhuVuc.content = this.content;
      this.capPhepThamDoKhuVuc.idcapphepthamdo = this.idcapphepthamdo;
      this.capPhepThamDoKhuVuc.loaicapphep = this.itemGiayPhep.loaicapphep;
      this.loadedTabState[CpThamDoKhoangSanTabEnum.KhuVucThamDo] = await this.capPhepThamDoKhuVuc.manualDataInit();
    } else if (index === CpThamDoKhoangSanTabEnum.CongTrinhThamDo && !this.loadedTabState[CpThamDoKhoangSanTabEnum.CongTrinhThamDo]) {
      this.capPhepThamDoCongTrinh.matSidenav = this.matSidenav;
      this.capPhepThamDoCongTrinh.content = this.content;
      this.capPhepThamDoCongTrinh.idcapphepthamdo = this.idcapphepthamdo;
      this.loadedTabState[CpThamDoKhoangSanTabEnum.CongTrinhThamDo] = await this.capPhepThamDoCongTrinh.manualDataInit();
    }
  }
}
