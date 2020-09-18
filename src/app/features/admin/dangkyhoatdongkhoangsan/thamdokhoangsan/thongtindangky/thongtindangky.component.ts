import { Component, ComponentFactoryResolver, Input, OnInit, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { DangKyHoatDongKhoangSanFacadeService } from 'src/app/services/admin/dangkyhoatdongkhoangsan/dangkyhoatdongkhoangsan-facade.service';
import { DangKyThamDoActionEnum, DangKyThamDoKhoangSanTabEnum, LoaiCapPhepEnum } from 'src/app/shared/constants/enum';
import { ContentContainerDirective } from 'src/app/shared/directives/content-container/content-container.directive';
import { DangkythamdogiahanIoComponent } from './dangkythamdogiahan-io/dangkythamdogiahan-io.component';
import { DangkythamdokhoangsanIoComponent } from './dangkythamdokhoangsan-io/dangkythamdokhoangsan-io.component';

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
  @ViewChild(ContentContainerDirective, { static: true }) contentContainer: ContentContainerDirective;
  @ViewChild(Type, { static: true }) public matSidenav: MatSidenav;
  @ViewChild(Type, { read: ViewContainerRef, static: true }) public content: ViewContainerRef;
  // tslint:disable-next-line: no-input-rename
  @Input("allowAutoInit") allowAutoInit = true;
  // Lưu trữ thông tin đăng ký tab
  public dangKyThamDoKhoangSanTabEnum = DangKyThamDoKhoangSanTabEnum;
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

  public currentAction: number;

  constructor(private cfr: ComponentFactoryResolver,
              private activatedRoute: ActivatedRoute,
              private dangKyHoatDongKhoangSanFacadeService: DangKyHoatDongKhoangSanFacadeService) { }

  async ngOnInit() {
    if (this.allowAutoInit) {
      await this.manualDataInit();
    }
  }

  async manualDataInit() {
    this.activatedRoute.queryParamMap.subscribe((param: any) => {
      if (param && param.params && param.params.idhoso) {
        this.idhoso = param.params.idhoso;
      }
    });

    if (this.idhoso === null || this.idhoso === undefined) {
      return;
    }

    await this.showDangKyViewComponent();
    return true;
  }

  setThamDoKhoangSanDisabledTabState(actionType: number) {
    switch(actionType) {
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
    const itemHoSo = await this.getHoSoById(this.idhoso);

    if (itemHoSo) {
      factory = this.cfr.resolveComponentFactory(DangKyThamDoKhoangSanComponent[itemHoSo.loaicapphep]);
      // if (itemHoSo.loaicapphep === LoaiCapPhepEnum.ThamDoKhoangSan) {
      //   factory = this.cfr.resolveComponentFactory(DangkythamdokhoangsanIoComponent);
      // } else if (itemHoSo.loaicapphep === LoaiCapPhepEnum.ThamDoGiaHan) {
      //   factory = this.cfr.resolveComponentFactory(DangkythamdogiahanIoComponent);
      // }
    }

    const viewContainerRef = this.contentContainer.viewContainerRef;
    const componentRef: any = viewContainerRef.createComponent(factory);
    componentRef.instance.idhoso = itemHoSo.idhoso;
    componentRef.instance.selectCurrentFormStateEvent.subscribe(event => this.getDangKyThamDoFormState(event));
  }

  async tabChange(index: any) {
    if (index === DangKyThamDoKhoangSanTabEnum.DonViHanhChinh && !this.loadedTabState[DangKyThamDoKhoangSanTabEnum.DonViHanhChinh]) {

    } else if (index === DangKyThamDoKhoangSanTabEnum.LoaiKhoangSan && !this.loadedTabState[DangKyThamDoKhoangSanTabEnum.LoaiKhoangSan]) {

    } else if (index === DangKyThamDoKhoangSanTabEnum.KhuVucThamDo && !this.loadedTabState[DangKyThamDoKhoangSanTabEnum.KhuVucThamDo]) {

    } else if (index === DangKyThamDoKhoangSanTabEnum.CongTrinhThamDo && !this.loadedTabState[DangKyThamDoKhoangSanTabEnum.CongTrinhThamDo]) {

    }
  }
}
