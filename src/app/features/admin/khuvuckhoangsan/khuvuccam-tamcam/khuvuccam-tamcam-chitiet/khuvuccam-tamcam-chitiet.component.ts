import { Component, OnInit, Output, ViewChild, EventEmitter, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { MatSidenav } from "@angular/material";
import { TranslateService } from "@ngx-translate/core";

import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { CommonFacadeService } from "src/app/services/admin/common/common-facade.service";
import { KhuvuccamTamcamIoComponent } from "src/app/features/admin/khuvuckhoangsan/khuvuccam-tamcam/khuvuccam-tamcam-io/khuvuccam-tamcam-io.component";
import { OutputKhuVucCamTamCamModel } from "src/app/models/admin/khuvuckhoangsan/khuvuccamtamcam.model";
import { KhuVucKhoangSanFacadeService } from "src/app/services/admin/khuvuckhoangsan/khuvuckhoangsan-facade.service";

@Component({
  selector: 'app-khuvuccam-tamcam-chitiet',
  templateUrl: './khuvuccam-tamcam-chitiet.component.html',
  styleUrls: ['./khuvuccam-tamcam-chitiet.component.scss']
})
export class KhuvuccamTamcamChitietComponent implements OnInit {
  @Output("getInformation") getInformation: EventEmitter<any> = new EventEmitter();
  @ViewChild("aside", { static: true }) public matSidenav: MatSidenav;
  @ViewChild("compKvCamTamCamIO", { read: ViewContainerRef, static: true }) public content: ViewContainerRef;

  // Chứa id khu vực cấm, tạm cấm
  public idKhuVuc: string;

  // Các biến translate
  public dataTranslate: any;

  // Chứa dữ liệu khu vực cấm, tạm cấm
  public obj: OutputKhuVucCamTamCamModel;

  constructor(
    public matSidenavService: MatsidenavService,
    public cfr: ComponentFactoryResolver,
    public commonFacadeService: CommonFacadeService,
    private translate: TranslateService,
    public khuvuckhoangsanFacadeService: KhuVucKhoangSanFacadeService,
  ) {
    console.log("constructor - khuvuccam-tamcam-chitiet");
  }

  async ngOnInit() {
    console.log("ngOnInit - khuvuccam-tamcam-chitiet");
    // Get all langs
    this.dataTranslate = await this.translate
      .getTranslation(this.translate.getDefaultLang())
      .toPromise();
    console.log(this.idKhuVuc);
    this.getAllKhuVucCamTamCam();
  }

  /**
   * Lấy dữ liệu
   */
  async getAllKhuVucCamTamCam() {
    await this.khuvuckhoangsanFacadeService
      .getKhuVucCamTamCamService()
      .getByid(this.idKhuVuc).subscribe(res => {
        this.obj = res;
        this.getInformation.emit(res.tenkhuvuc);
      });
  }

  /**
   * hàm chuyển đến chế độ sửa
   */
  toEditMode() {
    // Cấu hình sidenav io
    this.matSidenavService.setSidenav( this.matSidenav, this, this.content, this.cfr);
    this.matSidenavService.setTitle(this.dataTranslate.KHUVUCKHOANGSAN.khuvuccamtamcam.titleEdit);
    this.matSidenavService.setContentComp( KhuvuccamTamcamIoComponent,"edit", this.obj );
    this.matSidenavService.open();
  }

  /**
   * Hàm close SideNav khu vực cấm tạm cấm
   */
  public closeKhuVucCamTamCamIOSidebar() {
    this.matSidenavService.close();
  }

  // Hàm dùng để gọi các hàm khác, truyền vào tên hàm cần thực thi
  doFunction(methodName) {
    this[methodName]();
  }


}
