import { Component, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver, AfterViewInit } from '@angular/core';
import { AdminRoutingName } from "src/app/routes/admin-routes-name";
import { KhuvuccamTamcamChitietComponent } from "../khuvuccam-tamcam/khuvuccam-tamcam-chitiet/khuvuccam-tamcam-chitiet.component";
import { ActivatedRoute } from "@angular/router";
import { detailComponentKhuVucKhoangSan } from "../../../../shared/constants/khuvuckhoangsan-constants";
import { KhuVucKhoangSanFacadeService } from "../../../../services/admin/khuvuckhoangsan/khuvuckhoangsan-facade.service";
import { MatTabGroup } from "@angular/material";

enum TabEnum {
  ThongTinChung = 0,
  ToaDo = 1
}

@Component({
  selector: 'app-thongtinkhuvuckhoangsan',
  templateUrl: './thongtinkhuvuckhoangsan.component.html',
  styleUrls: ['./thongtinkhuvuckhoangsan.component.scss']
})
export class ThongtinkhuvuckhoangsanComponent implements OnInit, AfterViewInit {
  @ViewChild("tab", {static: true}) khuVucKhoangSanTab: MatTabGroup;
  @ViewChild('detailComponent', { static: false, read: ViewContainerRef }) public detailComponent: ViewContainerRef;

  public entryComponentFactory: any;

  // Chứa key khu vực khoáng sản
  public keyKhuVuc: string;

  // Chứa id khu vực khoáng sản
  public idKhuVuc: string;

  // Chứa dữ liệu khu vực khoáng sản
  public dataKhuVuc: any;

  public selectedDefaultTab: number;

  // Chứa dữ liệu menu item trên subheader
  public navArray = [
    { title: "Quản trị", url: `/${AdminRoutingName.adminUri}` },
    {
      title: "Khu vực khoáng sản",
      url: `/${AdminRoutingName.adminUri}/${AdminRoutingName.khuvuckhoangsanUri}`,
    },
    {
      title: "Thông tin khu vực khoáng sản",
      url: "",
    },
  ];
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

    this.selectedDefaultTab = TabEnum.ThongTinChung;
    console.log("ngOnInit - thongtinkhuvuckhoangsan");
  }

  ngAfterViewInit() {
    console.log("ngAfterViewInit - thongtinkhuvuckhoangsan");
    if (this.selectedDefaultTab === TabEnum.ThongTinChung) {
      setTimeout(() => {
        this.showViewDetailComponent();
      });
    }
  }

  public khuVucKhoangSanTabChange(index: number) {
    if (index === TabEnum.ThongTinChung) {
      setTimeout(() => {
        this.showViewDetailComponent();
      });
    }
  }


  /**
   * Hàm hiển thị content component chi tiết các khu vực
   */
  public showViewDetailComponent() {
    if (this.entryComponentFactory) {
      this.entryComponentFactory.destroy();
    }

    // this.detailComponent.clear();
    const factory = this.cfr.resolveComponentFactory(KhuvuccamTamcamChitietComponent);
    this.entryComponentFactory = this.detailComponent.createComponent(factory);
    this.entryComponentFactory.instance.idKhuVuc = this.idKhuVuc;
  }
}
