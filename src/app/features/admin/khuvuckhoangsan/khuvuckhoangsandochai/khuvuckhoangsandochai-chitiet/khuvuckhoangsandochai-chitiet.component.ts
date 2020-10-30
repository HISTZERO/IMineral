import { Component, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver, Output, EventEmitter } from '@angular/core';
import { MatSidenav } from "@angular/material";
import { TranslateService } from "@ngx-translate/core";

import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { CommonFacadeService } from "src/app/services/admin/common/common-facade.service";
import { OutputKhuVucKhoangSanDocHaiModel } from "src/app/models/admin/khuvuckhoangsan/khuvuckhoangsandochai.model";
import { KhuVucKhoangSanFacadeService } from "src/app/services/admin/khuvuckhoangsan/khuvuckhoangsan-facade.service";
import { KhuvuckhoangsandochaiIoComponent } from "src/app/features/admin/khuvuckhoangsan/khuvuckhoangsandochai/khuvuckhoangsandochai-io/khuvuckhoangsandochai-io.component";
import { DmFacadeService } from "src/app/services/admin/danhmuc/danhmuc-facade.service";

@Component({
  selector: 'app-khuvuckhoangsandochai-chitiet',
  templateUrl: './khuvuckhoangsandochai-chitiet.component.html',
  styleUrls: ['./khuvuckhoangsandochai-chitiet.component.scss']
})
export class KhuvuckhoangsandochaiChitietComponent implements OnInit {

  @ViewChild("aside", { static: true }) public matSidenav: MatSidenav;
  @ViewChild("compKvKhoangSanDocHaiIO", { read: ViewContainerRef, static: true }) public content: ViewContainerRef;
  // Output geometry event
  @Output("selectGeometryEvent") selectGeometryEvent: EventEmitter<any> = new EventEmitter();

  // Chứa id khu vực khoáng sản độc hại
  public idKhuVuc: string;

  // Các biến translate
  public dataTranslate: any;

  // Chứa dữ liệu khu vực khoáng sản độc hại
  public obj: OutputKhuVucKhoangSanDocHaiModel;

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
    this.getKhuVucKhoangSanDocHaiById();
  }

  /**
   * Lấy dữ liệu Khu vực khoáng sản độc hại theo id
   */
  async getKhuVucKhoangSanDocHaiById() {
    await this.khuvuckhoangsanFacadeService
      .getKhuVucKhoangSanDocHaiService()
      .getByid(this.idKhuVuc).subscribe(res => {
        this.obj = res;
        this.selectGeometryEvent.emit(res.geowgs);
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
    this.getKhuVucKhoangSanDocHaiById();
  }

  /**
   * hàm chuyển đến chế độ sửa
   */
  public toEditMode() {
    // Cấu hình sidenav io
    this.matSidenavService.setSidenav(this.matSidenav, this, this.content, this.cfr);
    this.matSidenavService.setTitle(this.dataTranslate.KHUVUCKHOANGSAN.khuvuccamtamcam.titleEdit);
    this.matSidenavService.setContentComp(KhuvuckhoangsandochaiIoComponent, "edit", this.obj);
    this.matSidenavService.open();
  }

  /**
   * Hàm close SideNav khu vực khoáng sản độc hại
   */
  public closeKhuVucKhoangSanDocHaiIOSidebar() {
    this.matSidenavService.close();
  }

  // Hàm dùng để gọi các hàm khác, truyền vào tên hàm cần thực thi
  doFunction(methodName) {
    this[methodName]();
  }


}
