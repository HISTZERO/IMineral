import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";

import { AdminRoutingName } from "src/app/routes/admin-routes-name";
import { nameNhomBaoCao } from "src/app/shared/constants/nhombaocao-constants";
import { BaocaoFacadeService } from "src/app/services/admin/baocao/baocao-facade.service";

@Component({
  selector: 'app-baocao-info',
  templateUrl: './baocao-info.component.html',
  styleUrls: ['./baocao-info.component.scss']
})
export class BaocaoInfoComponent implements OnInit, AfterViewInit {

  // Chứa dữ liệu báo cáo
  public databaoCao: any;
  
  // Chứa menu item trên subheader
  public navArray: any[] = [];

  // Chứa mảng button trên subheader
  public btnArray: any[] = [];

  // Chứa key báo cáo
  public keyBaoCao: string;

  // Chứa tên danh sách
  public tenBaoCao: string;

  // Chứa dữ liệu select tab
  public selectTab: number;

  constructor(
    private activatedRoute: ActivatedRoute,
    public baocaoFacadeService: BaocaoFacadeService,
  ) { }

  ngOnInit() {

    // Lấy dữ liệu trên url
    this.getDataByUrl();
  }

  ngAfterViewInit() {
    this.selectTab = 0;
  }

  /**
   * Hàm lấy dữ liệu trên url
   */
  public getDataByUrl() {
    this.activatedRoute.paramMap.subscribe((res: any) => {
      this.keyBaoCao = res.params.key;
      this.navArray = [
        { title: "Quản trị", url: `/${AdminRoutingName.adminUri}` },
        {
          title: "Báo cáo",
          url: `/${AdminRoutingName.adminUri}/${AdminRoutingName.baocaoUri}`,
        },
        {
          title: nameNhomBaoCao[this.keyBaoCao],
          url: `/${AdminRoutingName.adminUri}/${AdminRoutingName.baocaoUri}/${AdminRoutingName.danhsach}/${this.keyBaoCao}`,
        },
        {
          title: "Chi tiết",
          url: ``,
        }
      ];
      this.getDataBaoCao(res.params.id);
    });
  }

  /**
   * Hàm lấy dữ liệu báo cáo bằng id trên url
   */
  async getDataBaoCao(id: string) {
    await this.baocaoFacadeService
      .getBaoCaoService()
      .getByid(id)
      .subscribe(res => {
        this.tenBaoCao = res.tenbaocao;
        this.databaoCao = res;
      });
  }


}
