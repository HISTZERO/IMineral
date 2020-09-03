import { Component, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { MatSidenav } from "@angular/material";
import { TranslateService } from "@ngx-translate/core";

import { OutputKhuVucDauGiaModel } from "src/app/models/admin/khuvuckhoangsan/khuvucdaugia.model";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { CommonFacadeService } from "src/app/services/admin/common/common-facade.service";
import { KhuVucKhoangSanFacadeService } from "src/app/services/admin/khuvuckhoangsan/khuvuckhoangsan-facade.service";
import { KhuvucdaugiaIoComponent } from "src/app/features/admin/khuvuckhoangsan/khuvucdaugia/khuvucdaugia-io/khuvucdaugia-io.component";
import { DmFacadeService } from "src/app/services/admin/danhmuc/danhmuc-facade.service";

@Component({
  selector: 'app-khuvucdaugia-chitiet',
  templateUrl: './khuvucdaugia-chitiet.component.html',
  styleUrls: ['./khuvucdaugia-chitiet.component.scss']
})
export class KhuvucdaugiaChitietComponent implements OnInit {

  @ViewChild("aside", { static: true }) public matSidenav: MatSidenav;
  @ViewChild("compKvDauGiaIO", { read: ViewContainerRef, static: true }) public content: ViewContainerRef;

  // Chứa id khu vực đấu giá
  public idKhuVuc: string;

  // Các biến translate
  public dataTranslate: any;

  // Chứa dữ liệu khu vực đấu giá
  public obj: OutputKhuVucDauGiaModel;

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
    await this.getKhuVucDauGiaById();
  }

  /**
   * Lấy dữ liệu khu vực đấu giá theo id
   */
  async getKhuVucDauGiaById() {
    await this.khuvuckhoangsanFacadeService
      .getKhuVucDauGiaService()
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
   * Hàm load lại dữ liệu
   */
  public reloadDataGrid() {
    this.getKhuVucDauGiaById();
  }

  /**
   * Hàm chuyển đến chế độ sửa
   */
  toEditMode() {
    // Cấu hình sidenav io
    this.matSidenavService.setSidenav(this.matSidenav, this, this.content, this.cfr);
    this.matSidenavService.setTitle(this.dataTranslate.KHUVUCKHOANGSAN.khuvucdaugia.titleEdit);
    this.matSidenavService.setContentComp(KhuvucdaugiaIoComponent, "edit", this.obj);
    this.matSidenavService.open();
  }

  /**
   * Hàm close SideNav khu vực đấu giá
   */
  public closeKhuVucDauGiaIOSidebar() {
    this.matSidenavService.close();
  }

  // Hàm dùng để gọi các hàm khác, truyền vào tên hàm cần thực thi
  doFunction(methodName) {
    this[methodName]();
  }


}
