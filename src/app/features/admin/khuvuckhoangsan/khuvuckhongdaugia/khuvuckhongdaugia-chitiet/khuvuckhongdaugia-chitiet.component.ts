import { Component, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver, Output, EventEmitter } from '@angular/core';
import { MatSidenav } from "@angular/material";
import { TranslateService } from "@ngx-translate/core";

import { OutputKhuVucKhongDauGiaModel } from "src/app/models/admin/khuvuckhoangsan/khuvuckhongdaugia.model";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { CommonFacadeService } from "src/app/services/admin/common/common-facade.service";
import { KhuVucKhoangSanFacadeService } from "src/app/services/admin/khuvuckhoangsan/khuvuckhoangsan-facade.service";
import { KhuvuckhongdaugiaIoComponent } from "src/app/features/admin/khuvuckhoangsan/khuvuckhongdaugia/khuvuckhongdaugia-io/khuvuckhongdaugia-io.component";
import { DmFacadeService } from "src/app/services/admin/danhmuc/danhmuc-facade.service";

@Component({
  selector: 'app-khuvuckhongdaugia-chitiet',
  templateUrl: './khuvuckhongdaugia-chitiet.component.html',
  styleUrls: ['./khuvuckhongdaugia-chitiet.component.scss']
})
export class KhuvuckhongdaugiaChitietComponent implements OnInit {

  @ViewChild("aside", { static: true }) public matSidenav: MatSidenav;
  @ViewChild("compKvKhongDauGiaIO", { read: ViewContainerRef, static: true }) public content: ViewContainerRef;
  // Output geometry event
  @Output("selectGeometryEvent") selectGeometryEvent: EventEmitter<any> = new EventEmitter();

  // Chứa id khu vực không đấu giá
  public idKhuVuc: string;

  // Các biến translate
  public dataTranslate: any;

  // Chứa dữ liệu khu vực không đấu giá
  public obj: OutputKhuVucKhongDauGiaModel;

  // Chứa hệ quy chiếu
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
    await this.getKhuVucKhongDauGiaById();
  }

  /**
   * Lấy dữ liệu khu vực không đấu giá theo id
   */
  async getKhuVucKhongDauGiaById() {
    await this.khuvuckhoangsanFacadeService
      .getKhuVucKhongDauGiaService()
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
    this.getKhuVucKhongDauGiaById();
  }

  /**
   * hàm chuyển đến chế độ sửa
   */
  public toEditMode() {
    // Cấu hình sidenav io
    this.matSidenavService.setSidenav(this.matSidenav, this, this.content, this.cfr);
    this.matSidenavService.setTitle(this.dataTranslate.KHUVUCKHOANGSAN.khuvucdaugia.titleEdit);
    this.matSidenavService.setContentComp(KhuvuckhongdaugiaIoComponent, "edit", this.obj);
    this.matSidenavService.open();
  }

  /**
   * Hàm close SideNav khu vực không đấu giá
   */
  public closeKhuVucKhongDauGiaIOSidebar() {
    this.matSidenavService.close();
  }

  // Hàm dùng để gọi các hàm khác, truyền vào tên hàm cần thực thi
  doFunction(methodName) {
    this[methodName]();
  }


}
