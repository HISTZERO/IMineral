import { Component, OnInit, Input, Output, ViewChild, EventEmitter, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { MatSidenav } from "@angular/material";
import { TranslateService } from "@ngx-translate/core";

import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { CommonFacadeService } from "src/app/services/admin/common/common-facade.service";
import { KhuvucdutrukhoangsanIoComponent } from "src/app/features/admin/khuvuckhoangsan/khuvucdutrukhoangsan/khuvucdutrukhoangsan-io/khuvucdutrukhoangsan-io.component";

@Component({
  selector: 'app-khuvucdutrukhoangsan-chitiet',
  templateUrl: './khuvucdutrukhoangsan-chitiet.component.html',
  styleUrls: ['./khuvucdutrukhoangsan-chitiet.component.scss']
})
export class KhuvucdutrukhoangsanChitietComponent implements OnInit {

  @Input() public obj: any;
  @Output("getInformation") getInformation: EventEmitter<any> = new EventEmitter();
  @ViewChild("aside", { static: true }) public matSidenav: MatSidenav;
  @ViewChild("compKvDuTruKhoangSanIO", { read: ViewContainerRef, static: true }) public content: ViewContainerRef;
  public dvqlData: any;
  public dvql: any;
  public tenHeToaDo: any;
  public projection: any;

  // Các biến translate
  public dataTranslate: any;

  constructor(
    public matSidenavService: MatsidenavService,
    public cfr: ComponentFactoryResolver,
    public commonFacadeService: CommonFacadeService,
    private translate: TranslateService
  ) {
  }

  async ngOnInit() {
    // Get all langs
    this.dataTranslate = await this.translate
      .getTranslation(this.translate.getDefaultLang())
      .toPromise();

  }

  /**
   * hàm chuyển đến chế độ sửa
   */
  toEditMode() {
    // Cấu hình sidenav io
    this.matSidenavService.setSidenav(this.matSidenav, this, this.content, this.cfr);
    this.matSidenavService.setTitle(this.dataTranslate.KHUVUCKHOANGSAN.khuvuckhoangsandochai.titleEdit);
    this.matSidenavService.setContentComp(KhuvucdutrukhoangsanIoComponent, "edit", this.obj);
    this.matSidenavService.open();
  }

  /**
   * Hàm close SideNav khu vực dự trữ khoáng sản
   */
  public closeKhuVucDuTruKhoangSanIOSidebar() {
    this.matSidenavService.close();
  }


  /**
   * Hàm refresh lại dữ liệu công trình
   */
  public refreshData() {
    this.getInformation.emit();
  }

  /**
   * Call method
   * @param methodName
   */
  doFunction(methodName) {
    this[methodName]();
  }


}
