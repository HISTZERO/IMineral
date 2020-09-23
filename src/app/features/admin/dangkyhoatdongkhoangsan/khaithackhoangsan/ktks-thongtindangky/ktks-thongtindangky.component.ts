import { Component, ComponentFactoryResolver, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DangKyHoatDongKhoangSanFacadeService } from 'src/app/services/admin/dangkyhoatdongkhoangsan/dangkyhoatdongkhoangsan-facade.service';

import { ContentContainerDirective } from 'src/app/shared/directives/content-container/content-container.directive';
import { DangKyThamDoKhoangSanTabEnum, LoaiCapPhepEnum } from "src/app/shared/constants/enum";
import { DangkykhaithaccaisoiIoComponent } from "src/app/features/admin/dangkyhoatdongkhoangsan/khaithackhoangsan/ktks-thongtindangky/dangkykhaithaccaisoi-io/dangkykhaithaccaisoi-io.component";
import { DangkykhaithacdieuchinhIoComponent } from "src/app/features/admin/dangkyhoatdongkhoangsan/khaithackhoangsan/ktks-thongtindangky/dangkykhaithacdieuchinh-io/dangkykhaithacdieuchinh-io.component";
import { DangkykhaithacgiahanIoComponent } from "src/app/features/admin/dangkyhoatdongkhoangsan/khaithackhoangsan/ktks-thongtindangky/dangkykhaithacgiahan-io/dangkykhaithacgiahan-io.component";
import { DangkykhaithackhoangsanIoComponent } from "src/app/features/admin/dangkyhoatdongkhoangsan/khaithackhoangsan/ktks-thongtindangky/dangkykhaithackhoangsan-io/dangkykhaithackhoangsan-io.component";
import { DangkykhaithackhoangsanduanIoComponent } from "src/app/features/admin/dangkyhoatdongkhoangsan/khaithackhoangsan/ktks-thongtindangky/dangkykhaithackhoangsanduan-io/dangkykhaithackhoangsanduan-io.component";
import { DangkykhaithacvlxdIoComponent } from "src/app/features/admin/dangkyhoatdongkhoangsan/khaithackhoangsan/ktks-thongtindangky/dangkykhaithacvlxd-io/dangkykhaithacvlxd-io.component";

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
