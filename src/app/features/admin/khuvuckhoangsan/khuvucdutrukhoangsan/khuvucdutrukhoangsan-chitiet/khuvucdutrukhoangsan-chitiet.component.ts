import { Component, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { MatSidenav } from "@angular/material";
import { TranslateService } from "@ngx-translate/core";

import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { CommonFacadeService } from "src/app/services/admin/common/common-facade.service";
import { OutputKhuVucDuTruKhoangSanModel } from "src/app/models/admin/khuvuckhoangsan/khuvucdutrukhoangsan.model";
import { KhuVucKhoangSanFacadeService } from "src/app/services/admin/khuvuckhoangsan/khuvuckhoangsan-facade.service";
import { KhuvucdutrukhoangsanIoComponent } from "src/app/features/admin/khuvuckhoangsan/khuvucdutrukhoangsan/khuvucdutrukhoangsan-io/khuvucdutrukhoangsan-io.component";
import { DmFacadeService } from "src/app/services/admin/danhmuc/danhmuc-facade.service";

@Component({
  selector: 'app-khuvucdutrukhoangsan-chitiet',
  templateUrl: './khuvucdutrukhoangsan-chitiet.component.html',
  styleUrls: ['./khuvucdutrukhoangsan-chitiet.component.scss']
})
export class KhuvucdutrukhoangsanChitietComponent implements OnInit {

  @ViewChild("aside", { static: true }) public matSidenav: MatSidenav;
  @ViewChild("compKvDuTruKhoangSanIO", { read: ViewContainerRef, static: true }) public content: ViewContainerRef;

  // Chứa id khu vực dự trữ khoáng sản
  public idKhuVuc: string;

  // Các biến translate
  public dataTranslate: any;

  // Chứa dữ liệu khu vực dự trữ khoáng sản
  public obj: OutputKhuVucDuTruKhoangSanModel;

  // Chứa dữ liệu hệ quy chiếu
  public heQuyChieu: any;

  constructor(
    public matSidenavService: MatsidenavService,
    public cfr: ComponentFactoryResolver,
    public commonFacadeService: CommonFacadeService,
    private translate: TranslateService,
    public khuvuckhoangsanFacadeService: KhuVucKhoangSanFacadeService,
    public dmFacadeService: DmFacadeService
  ) {
  }

  async ngOnInit() {
    // Get all langs
    this.dataTranslate = await this.translate
      .getTranslation(this.translate.getDefaultLang())
      .toPromise();
    this.getKhuVucDuTruKhoangSanById();
  }

  /**
   * Lấy dữ liệu khu vực dự trữ khoáng sản
   */
  async getKhuVucDuTruKhoangSanById() {
    await this.khuvuckhoangsanFacadeService
      .getKhuVucDuTruKhoangSanService()
      .getByid(this.idKhuVuc).subscribe(res => {
        this.obj = res;
        this.getHeQuyChieuBySrid(res.hequychieu);
      });
  }

  /**
   * Hàm lấy dữ liệu Hệ quy chiếu theo id
   */
  async getHeQuyChieuBySrid(srid: number) {
    if (srid) {
      this.heQuyChieu = await this.dmFacadeService
        .getDmHeQuyChieuService()
        .getByid(srid).toPromise();
    }
  }

  /**
   * Hàm load lại dữ liệu grid
   */
  public reloadDataGrid() {
    this.getKhuVucDuTruKhoangSanById();
  }

  /**
   * hàm chuyển đến chế độ sửa
   */
  toEditMode() {
    // Cấu hình sidenav io
    this.matSidenavService.setSidenav(this.matSidenav, this, this.content, this.cfr);
    this.matSidenavService.setTitle(this.dataTranslate.KHUVUCKHOANGSAN.khuvucdutrukhoangsan.titleEdit);
    this.matSidenavService.setContentComp(KhuvucdutrukhoangsanIoComponent, "edit", this.obj);
    this.matSidenavService.open();
  }

  /**
   * Hàm close SideNav khu vực dự trữ khoáng sản
   */
  public closeKhuVucDuTruKhoangSanIOSidebar() {
    this.matSidenavService.close();
  }

  // Hàm dùng để gọi các hàm khác, truyền vào tên hàm cần thực thi
  doFunction(methodName) {
    this[methodName]();
  }


}
