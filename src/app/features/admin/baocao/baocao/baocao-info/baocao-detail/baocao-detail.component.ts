import { Component, OnInit, Input, ViewChild, ViewContainerRef, ComponentFactoryResolver, Output, EventEmitter } from '@angular/core';
import { MatSidenav } from "@angular/material";
import { TranslateService } from "@ngx-translate/core";

import { OutputBaoCaoModel } from "src/app/models/admin/baocao/baocao.model";
import { BaocaoIoComponent } from "src/app/features/admin/baocao/baocao/baocao-io/baocao-io.component";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { DoiTuongBaoCao } from "src/app/shared/constants/common-constants";
import { NhomBaoCao } from "src/app/shared/constants/nhombaocao-constants";

@Component({
  selector: 'app-baocao-detail',
  templateUrl: './baocao-detail.component.html',
  styleUrls: ['./baocao-detail.component.scss']
})
export class BaocaoDetailComponent implements OnInit {

  @Input() public obj: OutputBaoCaoModel;
  @ViewChild("aside", { static: true }) public matSidenav: MatSidenav;
  @ViewChild("compBaoCaoIO", { read: ViewContainerRef, static: true }) public content: ViewContainerRef;
  @Output("getDataBaoCao") getDataBaoCao: EventEmitter<any> = new EventEmitter();

  // Chứa dữ liệu đối tượng báo cáo
  public doiTuongBaoCao = DoiTuongBaoCao;

  // Chứa nhóm báo cáo
  public nhomBaoCao = NhomBaoCao;

  // Các biến translate
  public dataTranslate: any;

  constructor(
    public matSidenavService: MatsidenavService,
    public cfr: ComponentFactoryResolver,
    private translate: TranslateService,
  ) {
  }

  async ngOnInit() {
    // Get all langs
    this.dataTranslate = await this.translate
      .getTranslation(this.translate.getDefaultLang())
      .toPromise();

  }

  /**
   * Hàm load lại dữ liệu
   */
  public reloadDataGrid() {
    this.getDataBaoCao.emit();
  }


  /**
   * Hàm chuyển đến chế độ sửa
   */
  toEditMode() {
    // Cấu hình sidenav io
    this.matSidenavService.setSidenav(this.matSidenav, this, this.content, this.cfr);
    this.matSidenavService.setTitle(this.dataTranslate.BAOCAO.baocao.titleEdit);
    this.matSidenavService.setContentComp(BaocaoIoComponent, "edit", this.obj);
    this.matSidenavService.open();
  }

  /**
   * Hàm close SideNav báo cáo
   */
  public closeBaoCaoIOSidebar() {
    this.matSidenavService.close();
  }

  // Hàm dùng để gọi các hàm khác, truyền vào tên hàm cần thực thi
  doFunction(methodName) {
    this[methodName]();
  }

}
