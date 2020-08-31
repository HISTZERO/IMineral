import { Component, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver, AfterViewInit } from '@angular/core';
import { AdminRoutingName } from "src/app/routes/admin-routes-name";
import { KhuvuccamTamcamChitietComponent } from "../khuvuccam-tamcam/khuvuccam-tamcam-chitiet/khuvuccam-tamcam-chitiet.component";
import { ActivatedRoute } from "@angular/router";
import { detailComponentKhuVucKhoangSan } from "../../../../shared/constants/khuvuckhoangsan-constants";
import { KhuVucKhoangSanFacadeService } from "../../../../services/admin/khuvuckhoangsan/khuvuckhoangsan-facade.service";
import { MatTabGroup } from "@angular/material";

@Component({
  selector: 'app-thongtinkhuvuckhoangsan',
  templateUrl: './thongtinkhuvuckhoangsan.component.html',
  styleUrls: ['./thongtinkhuvuckhoangsan.component.scss']
})
export class ThongtinkhuvuckhoangsanComponent implements OnInit, AfterViewInit {
  @ViewChild("tab",{static: true}) tab: MatTabGroup;
  @ViewChild('detailComponent', { static: true, read: ViewContainerRef }) public detailComponent: ViewContainerRef;

  public entryComponentFactory: any;

  // Chứa key khu vực khoáng sản
  public keyKhuVuc: string;

  // Chứa id khu vực khoáng sản
  public idKhuVuc: string;

  // Chứa dữ liệu khu vực khoáng sản
  public dataKhuVuc: any;

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
  ) { }

  ngOnInit() {
    this.activatedRoute.queryParamMap.subscribe((param: any) => {
      this.keyKhuVuc = param.params.keykhuvuc;
      this.idKhuVuc = param.params.idkhuvuc;
      this.showViewDetailComponent();
    });

  }

  ngAfterViewInit() {
    
  }


  /**
   * Hàm hiển thị content component chi tiết các khu vực
   */
  public showViewDetailComponent() {
    if (this.entryComponentFactory) this.entryComponentFactory.destroy();

    const factory = this.cfr.resolveComponentFactory(KhuvuccamTamcamChitietComponent);
    this.entryComponentFactory = this.detailComponent.createComponent(factory);
    this.entryComponentFactory.instance.idKhuVuc = this.idKhuVuc;
  }
}
