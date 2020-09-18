import { Component, ComponentFactoryResolver, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { DangKyHoatDongKhoangSanFacadeService } from 'src/app/services/admin/dangkyhoatdongkhoangsan/dangkyhoatdongkhoangsan-facade.service';
import { LoaiCapPhepEnum } from 'src/app/shared/constants/enum';
import { ContentContainerDirective } from 'src/app/shared/directives/content-container/content-container.directive';
import { DangkythamdogiahanIoComponent } from './dangkythamdogiahan-io/dangkythamdogiahan-io.component';
import { DangkythamdokhoangsanIoComponent } from './dangkythamdokhoangsan-io/dangkythamdokhoangsan-io.component';

@Component({
  selector: 'app-thongtindangky',
  templateUrl: './thongtindangky.component.html',
  styleUrls: ['./thongtindangky.component.scss']
})
export class ThongtindangkyComponent implements OnInit {
  @ViewChild(ContentContainerDirective, { static: true }) contentContainer: ContentContainerDirective;
  // @ViewChild("aside", { static: true }) public matSidenav: MatSidenav;
  // @ViewChild("comp", { read: ViewContainerRef, static: true }) public content: ViewContainerRef;
  // tslint:disable-next-line: no-input-rename
  @Input("allowAutoInit") allowAutoInit = true;
  // Lưu trữ dữ liệu id hồ sơ
  public idhoso;
  private hsHoSo: any;
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

    await this.getHoSoById(this.idhoso);
    await this.showDangKyViewComponent();
    return true;
  }

  /**
   * Lấy dữ liệu hồ sơ theo IdHoSo
   * @param idHoSo
   */
  private async getHoSoById(idHoSo: string) {
    const hoSoService = this.dangKyHoatDongKhoangSanFacadeService.getHoSoService();
    this.hsHoSo = await hoSoService.getByid(idHoSo).toPromise();
  }

  private showDangKyViewComponent() {
    let factory: any;

    if (this.hsHoSo) {
      if (this.hsHoSo.loaicapphep === LoaiCapPhepEnum.ThamDoKhoangSan) {
        factory = this.cfr.resolveComponentFactory(DangkythamdokhoangsanIoComponent);
      } else if (this.hsHoSo.loaicapphep === LoaiCapPhepEnum.ThamDoGiaHan) {
        factory = this.cfr.resolveComponentFactory(DangkythamdogiahanIoComponent);
      }
    }

    const viewContainerRef = this.contentContainer.viewContainerRef;
    const componentRef: any = viewContainerRef.createComponent(factory);
    componentRef.instance.idhoso = this.hsHoSo.idhoso;
  }
}
