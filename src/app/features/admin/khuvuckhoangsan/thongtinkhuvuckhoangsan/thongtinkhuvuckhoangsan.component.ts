import { Component, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver, AfterViewInit } from '@angular/core';
import { AdminRoutingName } from "src/app/routes/admin-routes-name";
import { ActivatedRoute } from "@angular/router";
import { MatTabGroup } from "@angular/material";

import { detailComponentKhuVucKhoangSan, nameKhuVucKhoangSan } from "src/app/shared/constants/khuvuckhoangsan-constants";
import { KhuVucKhoangSanFacadeService } from "src/app/services/admin/khuvuckhoangsan/khuvuckhoangsan-facade.service";
import { ContentContainerDirective } from "../../../../shared/directives/content-container/content-container.directive";
import { KhuvuccamTamcamChitietComponent } from "../khuvuccam-tamcam/khuvuccam-tamcam-chitiet/khuvuccam-tamcam-chitiet.component";

enum TabEnum {
  ThongTinChung = 0,
  ToaDo = 1
}

@Component({
  selector: 'app-thongtinkhuvuckhoangsan',
  templateUrl: './thongtinkhuvuckhoangsan.component.html',
  styleUrls: ['./thongtinkhuvuckhoangsan.component.scss']
})
export class ThongtinkhuvuckhoangsanComponent implements OnInit {
  @ViewChild("tab", { static: true }) khuVucKhoangSanTab: MatTabGroup;
  @ViewChild(ContentContainerDirective, { static: true }) contentContainer: ContentContainerDirective;

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

  // Chứa tên khu vực
  public tenKhuVuc: string;

  constructor(
    public khuVucKhoangSanFacedeService: KhuVucKhoangSanFacadeService,
    public cfr: ComponentFactoryResolver,
    private activatedRoute: ActivatedRoute
  ) {
    console.log("constructor - thongtinkhuvuckhoangsan");
  }

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
        url: "",
      },
    ]
    console.log("ngOnInit - thongtinkhuvuckhoangsan");
    this.selectedDefaultTab = TabEnum.ThongTinChung;
    this.showViewDetailComponent();
  }

  /**
   * Hàm hiển thị content component chi tiết các khu vực
   */
  public showViewDetailComponent() {
    const factory = this.cfr.resolveComponentFactory(detailComponentKhuVucKhoangSan[this.keyKhuVuc]);
    const viewContainerRef = this.contentContainer.viewContainerRef;
    const componentRef:any = viewContainerRef.createComponent(factory);
    componentRef.instance.idKhuVuc = this.idKhuVuc;
  }

  /**
   * Hàm thay đổi tên khu vực
   */
  public changeName(data: string) {
    this.tenKhuVuc = data;
  }
}
