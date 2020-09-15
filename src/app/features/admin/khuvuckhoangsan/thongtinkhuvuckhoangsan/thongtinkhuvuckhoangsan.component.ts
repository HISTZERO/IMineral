import { Component, OnInit, ViewChild, ComponentFactoryResolver, AfterViewInit } from '@angular/core';
import { AdminRoutingName } from "src/app/routes/admin-routes-name";
import { ActivatedRoute } from "@angular/router";
import { MatTabGroup } from "@angular/material";

import { detailComponentKhuVucKhoangSan, nameKhuVucKhoangSan } from "src/app/shared/constants/khuvuckhoangsan-constants";
import { KhuVucKhoangSanFacadeService } from "src/app/services/admin/khuvuckhoangsan/khuvuckhoangsan-facade.service";
import { ContentContainerDirective } from "src/app/shared/directives/content-container/content-container.directive";
import { KhuvuctoadoListComponent } from '../khuvuctoado/khuvuctoado-list/khuvuctoado-list.component';
import { ThongTinKhoangSanTabEnum } from 'src/app/shared/constants/enum';


@Component({
  selector: 'app-thongtinkhuvuckhoangsan',
  templateUrl: './thongtinkhuvuckhoangsan.component.html',
  styleUrls: ['./thongtinkhuvuckhoangsan.component.scss']
})
export class ThongtinkhuvuckhoangsanComponent implements OnInit {
  @ViewChild("tab", { static: true }) khuVucKhoangSanTab: MatTabGroup;
  @ViewChild(ContentContainerDirective, { static: true }) contentContainer: ContentContainerDirective;
  @ViewChild("khuVucToaDoListComp", { static: false }) khuVucToaDoListComp: KhuvuctoadoListComponent;

  public loadedTabState: any = {
    [ThongTinKhoangSanTabEnum.ThongTinChung]: false,
    [ThongTinKhoangSanTabEnum.ToaDo]: false
  };

  public entryComponentFactory: any;

  // Chứa key khu vực khoáng sản
  public keyKhuVuc: string;

  // Chứa id khu vực khoáng sản
  public idKhuVuc: string;

  // Chứa dữ liệu khu vực khoáng sản
  public dataKhuVuc: any;

  // Chứa data select tab mặc định
  public selectedDefaultTab: number;

  // Chứa dữ liệu menu item trên subheader
  public navArray = [];

  // Chứa data nút quai lại trang list
  public btnArr = [];

  // Chứa tên khu vực
  public tenKhuVuc: string;

  constructor(
    public khuVucKhoangSanFacedeService: KhuVucKhoangSanFacadeService,
    public cfr: ComponentFactoryResolver,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.activatedRoute.queryParamMap.subscribe((param: any) => {
      this.keyKhuVuc = param.params.keykhuvuc;
      this.idKhuVuc = param.params.idkhuvuc;
    });
    this.navArray = [
      { title: "Quản trị", url: `/${AdminRoutingName.adminUri}` },
      {
        title: "Khu vực khoáng sản",
        url: `/${AdminRoutingName.adminUri}/${AdminRoutingName.khuvuckhoangsanUri}`,
      },
      {
        title: `${nameKhuVucKhoangSan[this.keyKhuVuc]}`,
        url: `/${AdminRoutingName.adminUri}/${AdminRoutingName.khuvuckhoangsanUri}/${this.keyKhuVuc}`,
      },
      {
        title: `Chi tiết`,
        url: ``
      }
    ];
    this.btnArr = [
      {
        title: `${nameKhuVucKhoangSan[this.keyKhuVuc]}`,
        icon: "fad fa-chevron-double-left",
        color: "btn-primary",
        url: `/${AdminRoutingName.adminUri}/${AdminRoutingName.khuvuckhoangsanUri}/${this.keyKhuVuc}`
      },

    ];
    this.selectedDefaultTab = ThongTinKhoangSanTabEnum.ThongTinChung;
    this.showViewDetailComponent();
  }

  /**
   * Hàm hiển thị content component chi tiết các khu vực
   */
  showViewDetailComponent() {
    if (this.idKhuVuc === null || this.idKhuVuc === undefined) {
      return;
    }

    const comp = detailComponentKhuVucKhoangSan[this.keyKhuVuc];

    if (comp === null || comp === undefined) {
      return;
    }

    const factory = this.cfr.resolveComponentFactory(comp);
    const viewContainerRef = this.contentContainer.viewContainerRef;
    const componentRef: any = viewContainerRef.createComponent(factory);
    componentRef.instance.idKhuVuc = this.idKhuVuc;
  }

  async tabChange(index: any) {
    if (index === ThongTinKhoangSanTabEnum.ToaDo && !this.loadedTabState[ThongTinKhoangSanTabEnum.ToaDo]) {
      this.loadedTabState[ThongTinKhoangSanTabEnum.ToaDo] = await this.khuVucToaDoListComp.manualDataInit();
    }
  }
}
