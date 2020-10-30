import { Component, ComponentFactoryResolver, EventEmitter, Input, OnInit, Output, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { CommonServiceShared } from 'src/app/services/utilities/common-service';
import { CapPhepKhaiThacActionEnum, CpDauGiaKhaiThacKhoangSanTabEnum, LoaiCapPhepEnum } from 'src/app/shared/constants/enum';
import { DefaultValue } from 'src/app/shared/constants/global-var';
import { HoSoGiayToFacadeService } from 'src/app/services/admin/hosogiayto/hosogiayto-facade.service';
import { ContentContainerDirective } from 'src/app/shared/directives/content-container/content-container.directive';
import { CpDaugiakhaithacIoComponent } from "src/app/features/admin/capphephoatdongkhoangsan/cpdaugiaquyenkhaithackhoangsan/cp-daugia-thongtincapphep/cp-daugiakhaithac-io/cp-daugiakhaithac-io.component";
import { CpDaugiakhaithacKhuvucListComponent } from "src/app/features/admin/capphephoatdongkhoangsan/cpdaugiaquyenkhaithackhoangsan/cp-daugia-thongtincapphep/cp-daugiakhaithac-khuvuc/cp-daugiakhaithac-khuvuc-list/cp-daugiakhaithac-khuvuc-list.component";

@Component({
  selector: 'app-cp-daugia-thongtincapphep',
  templateUrl: './cp-daugia-thongtincapphep.component.html',
  styleUrls: ['./cp-daugia-thongtincapphep.component.scss']
})
export class CpDaugiaThongtincapphepComponent implements OnInit {
    @ViewChild('thongTinCapPhepKhaiThacTabs', { static: false }) thongTinCapPhepKhaiThacTabs;
    @ViewChild(ContentContainerDirective, { static: true }) contentContainer: ContentContainerDirective;
    @ViewChild(Type, { static: true }) public matSidenav: MatSidenav;
    @ViewChild(Type, { read: ViewContainerRef, static: true }) public content: ViewContainerRef;
    @ViewChild("capPhepDauGiaKhuVuc", { static: false }) capPhepDauGiaKhuVuc: CpDaugiakhaithacKhuvucListComponent;
    // tslint:disable-next-line: no-input-rename
    @Input("allowAutoInit") allowAutoInit = true;
    // tslint:disable-next-line: no-output-rename
    @Output("selectCurrentFormStateEvent") selectCurrentFormStateEvent: EventEmitter<number> = new EventEmitter();
    // Lưu trữ thông tin đăng ký tab
    public TabType = CpDauGiaKhaiThacKhoangSanTabEnum;
    // Lưu trữ dữ liệu id giấy phép
    public idgiayphep;
  
    // Lưu trữ trạng thais tab được select
    public loadedTabState: any = {
      [CpDauGiaKhaiThacKhoangSanTabEnum.ThongTinChiTiet]: false,
      [CpDauGiaKhaiThacKhoangSanTabEnum.KhuVucDauGia]: false
    };
  
    public disabledTabState: any = {
      [CpDauGiaKhaiThacKhoangSanTabEnum.ThongTinChiTiet]: true,
      [CpDauGiaKhaiThacKhoangSanTabEnum.KhuVucDauGia]: true,
    };
  
    // Lưu trữ dữ liệu action hiện tại
    public currentAction: number;
    // Chứa dữ liệu translate
    public dataTranslate: any;
    // Lưu trữ dữ liệu idcapphepkhaithac
    private idcapphepkhaithac: string;
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
        this.commonService.showDialogWarning(this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.thongtincapphep.informedNotExistedGiayPhepKhaiThac);
        return;
      }
  
      this.itemGiayPhep = await this.getGiayPhepById(this.idgiayphep);
  
      if (!this.itemGiayPhep) {
        this.commonService.showDialogWarning(this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.thongtincapphep.informedNotExistedGiayPhepKhaiThac);
        return;
      }
      await this.showCapPhepViewComponent();
  
      this.thongTinCapPhepKhaiThacTabs.realignInkBar();
      return true;
    }
  
    setDisabledTabState(actionType: number) {
      switch (actionType) {
        case CapPhepKhaiThacActionEnum.Add: {
          this.disabledTabState[CpDauGiaKhaiThacKhoangSanTabEnum.ThongTinChiTiet] = true;
          this.disabledTabState[CpDauGiaKhaiThacKhoangSanTabEnum.KhuVucDauGia] = false;
          break;
        }
        case CapPhepKhaiThacActionEnum.Edit: {
          this.disabledTabState[CpDauGiaKhaiThacKhoangSanTabEnum.ThongTinChiTiet] = false;
          this.disabledTabState[CpDauGiaKhaiThacKhoangSanTabEnum.KhuVucDauGia] = false;
          break;
        }
        default: {
          this.disabledTabState[CpDauGiaKhaiThacKhoangSanTabEnum.ThongTinChiTiet] = true;
          this.disabledTabState[CpDauGiaKhaiThacKhoangSanTabEnum.KhuVucDauGia] = true;
          break;
        }
      }
    }
  
    private resetLoadedTabState() {
      this.loadedTabState[CpDauGiaKhaiThacKhoangSanTabEnum.KhuVucDauGia] = false;
    }
  
    getThongTinDauGiaKhaiThacFormState(action: number) {
      this.currentAction = action;
      this.setDisabledTabState(this.currentAction);
      this.resetLoadedTabState();
      this.selectCurrentFormStateEvent.emit(this.currentAction);
    }
  
    getIdCapPhepKhaiThac(idCapPhepKhaiThac: string) {
      this.idcapphepkhaithac = idCapPhepKhaiThac;
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
        factory = this.cfr.resolveComponentFactory(CpDaugiakhaithacIoComponent);
      }
  
      const viewContainerRef = this.contentContainer.viewContainerRef;
      const componentRef: any = viewContainerRef.createComponent(factory);
      componentRef.instance.idgiayphep = this.itemGiayPhep.idgiayphep;
      componentRef.instance.matSidenav = this.matSidenav;
      componentRef.instance.content = this.content;
      componentRef.instance.itemGiayPhep = this.itemGiayPhep;
      componentRef.instance.selectCurrentFormStateEvent.subscribe(event => this.getThongTinDauGiaKhaiThacFormState(event));
      componentRef.instance.selectIdCapPhepKhaiThacEvent.subscribe(event => this.getIdCapPhepKhaiThac(event));
    }
  
    async tabChange(index: any) {
     if (index === CpDauGiaKhaiThacKhoangSanTabEnum.KhuVucDauGia && !this.loadedTabState[CpDauGiaKhaiThacKhoangSanTabEnum.KhuVucDauGia]) {
        this.capPhepDauGiaKhuVuc.matSidenav = this.matSidenav;
        this.capPhepDauGiaKhuVuc.content = this.content;
        this.capPhepDauGiaKhuVuc.idcapphepkhaithac = this.idcapphepkhaithac;
        this.capPhepDauGiaKhuVuc.loaicapphep = this.itemGiayPhep.loaicapphep;
       this.loadedTabState[CpDauGiaKhaiThacKhoangSanTabEnum.KhuVucDauGia] = await this.capPhepDauGiaKhuVuc.manualDataInit();
      } 
    }
  
  }
  