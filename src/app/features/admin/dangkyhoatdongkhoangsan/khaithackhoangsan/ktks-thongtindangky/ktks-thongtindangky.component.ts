import { Component, ComponentFactoryResolver, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { DangKyHoatDongKhoangSanFacadeService } from 'src/app/services/admin/dangkyhoatdongkhoangsan/dangkyhoatdongkhoangsan-facade.service';

import { ContentContainerDirective } from 'src/app/shared/directives/content-container/content-container.directive';
import { DangKyThamDoKhoangSanTabEnum, LoaiCapPhepEnum } from "../../../../../shared/constants/enum";
import { DangkykhaithacgiahanIoComponent } from "./dangkykhaithacgiahan-io/dangkykhaithacgiahan-io.component";
import { DangkykhaithackhoangsanIoComponent } from "./dangkykhaithackhoangsan-io/dangkykhaithackhoangsan-io.component";

export const DangKyKhaiThacKhoangSanComponent: any = {
  [LoaiCapPhepEnum.KhaiThacKhoangSan]: DangkykhaithackhoangsanIoComponent,
  [LoaiCapPhepEnum.KhaiThacKhoangSanGiaHan]: DangkykhaithacgiahanIoComponent
};

@Component({
  selector: 'app-ktks-thongtindangky',
  templateUrl: './ktks-thongtindangky.component.html',
  styleUrls: ['./ktks-thongtindangky.component.scss']
})
export class KtksThongtindangkyComponent implements OnInit {

  @ViewChild(ContentContainerDirective, { static: true }) contentContainer: ContentContainerDirective;
  // @ViewChild("aside", { static: true }) public matSidenav: MatSidenav;
  // @ViewChild("comp", { read: ViewContainerRef, static: true }) public content: ViewContainerRef;
  // tslint:disable-next-line: no-input-rename
  @Input("allowAutoInit") allowAutoInit = true;
  // Lưu trữ dữ liệu id hồ sơ
  public idhoso;
  // Chứa data select tab mặc định
  public selectedDefaultTab: number;
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
      factory = this.cfr.resolveComponentFactory(DangKyKhaiThacKhoangSanComponent[itemHoSo.loaicapphep]);

    }

    const viewContainerRef = this.contentContainer.viewContainerRef;
    const componentRef: any = viewContainerRef.createComponent(factory);
    componentRef.instance.idhoso = itemHoSo.idhoso;
    this.selectedDefaultTab = DangKyThamDoKhoangSanTabEnum.ThongTinChiTiet;
  }

}
