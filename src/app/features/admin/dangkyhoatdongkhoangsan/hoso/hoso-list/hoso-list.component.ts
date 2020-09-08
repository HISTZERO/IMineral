import { Component, OnInit, Input, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { DataStateChangeEventArgs } from "@syncfusion/ej2-angular-grids";
import { Observable } from "rxjs";
import { MatSidenav, MatDialog } from "@angular/material";
import { HttpErrorResponse } from "@angular/common/http";
import { TranslateService } from "@ngx-translate/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { GridComponent } from "@syncfusion/ej2-angular-grids";
import { SettingsCommon, ThietLapHeThong } from "src/app/shared/constants/setting-common";
import { OutputHoSoModel } from "src/app/models/admin/dangkyhoatdongkhoangsan/hoso.model";
import { DmFacadeService } from "src/app/services/admin/danhmuc/danhmuc-facade.service";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { ThietlapFacadeService } from "src/app/services/admin/thietlap/thietlap-facade.service";
import { GeneralClientService } from "src/app/services/admin/common/general-client.service";
import {NhomLoaiCapPhep} from 'src/app/shared/constants/enum';

import { DangKyHoatDongKhoangSanFacadeService } from 'src/app/services/admin/dangkyhoatdongkhoangsan/dangkyhoatdongkhoangsan-facade.service';


@Component({
  selector: 'app-hoso-list',
  templateUrl: './hoso-list.component.html',
  styleUrls: ['./hoso-list.component.scss']
})
export class HosoListComponent implements OnInit {
  // tslint:disable-next-line: no-input-rename
  @Input("nhomLoaiCapPhep") nhomLoaiCapPhep: number;

  // tslint:disable-next-line: no-input-rename
  @Input("title") title: string;

  // Viewchild template
  @ViewChild("gridHoSo", { static: false }) public gridHoSo: GridComponent;

  // Chứa thiết lập grid
  public settingsCommon = new SettingsCommon();

  // Chứa thuộc tính form
  public formSearch: FormGroup;

  // Chứa danh sách hồ sơ
  public listHoSo: Observable<DataStateChangeEventArgs>;

  // Chứa dữ liệu đã chọn
  public selectedItem: OutputHoSoModel;

  // Service
  public itemService: any;

  // Paging
  public state: DataStateChangeEventArgs;

  // Chứa dữ liệu translate
  public dataTranslate: any;


  constructor(public dangKyHoatDongKhoangSanFacadeService: DangKyHoatDongKhoangSanFacadeService,
              public commonService: CommonServiceShared,
              public thietlapFacadeService: ThietlapFacadeService,
              private translate: TranslateService,
              public formBuilder: FormBuilder,
              public generalClientService: GeneralClientService,
              public modalDialog: MatDialog) {
    this.itemService = this.dangKyHoatDongKhoangSanFacadeService.getHoSoService();
  }

  async ngOnInit() {
    if (this.nhomLoaiCapPhep === NhomLoaiCapPhep.ThamDoKhoangSan) {
      // Khởi tạo form
      this.formInit();
      // Gọi hàm lấy dữ liệu translate
      await this.getDataTranslate();
      // Gọi hàm lấy dữ liệu pagesize
      await this.getDataPageSize();
    }
  }

  /**
   * Form innit
   */
  public formInit() {
    this.formSearch = this.formBuilder.group({
      gtequalngaytiepnhan: [""],
      ltequalngaytiepnhan: [""],
      Keyword: [""],
    });
  }

  /**
   * Hàm lấy dữ liệu translate
   */
  async getDataTranslate() {
    // Get all langs
    this.dataTranslate = await this.translate
      .getTranslation(this.translate.getDefaultLang())
      .toPromise();
  }

  /**
   * Hàm lấy dữ liệu pagesize số bản ghi hiển thị trên 1 trang
   */
  async getDataPageSize() {
    const dataSetting: any = await this.thietlapFacadeService
      .getThietLapHeThongService()
      .getByid(ThietLapHeThong.listPageSize).toPromise();
    if (dataSetting) {
      this.settingsCommon.pageSettings.pageSize = dataSetting.settingValue;
    } else {
      this.settingsCommon.pageSettings.pageSize = 10;
    }

    this.getAllHoSo();
  }

  /**
   * Hàm lấy dữ liệu Cá nhân
   */
  async getAllHoSo() {
    this.listHoSo = this.itemService;
    const searchModel = this.formSearch.value;
    this.itemService
      .getDataFromServer({ skip: 0, take: this.settingsCommon.pageSettings.pageSize }, searchModel);
  }

  /*
   * When page item clicked
   */
  public dataStateChange(state: DataStateChangeEventArgs): void {
    const searchModel = this.formSearch.value;
    this.itemService.getDataFromServer(state, searchModel);
  }

  /**
   * Hàm load lại dữ liệu grid
   */
  public reloadDataGrid() {
    this.formSearch.reset({ Keyword: "" });
    this.getAllHoSo();
  }

  /**
   * Hàm mở sidenav chức năng thêm mới
   */
  public addItemHoSo() {

  }

  /**
   * Hàm mở sidenav chức năng sửa dữ liệu
   * @param id
   */
  async editItemHoSo(id: any) {

  }

  /**
   *  Hàm xóa một bản ghi, được gọi khi nhấn nút xóa trên giao diện list
   */
  async deleteItemHoSo(data) {
    this.selectedItem = data;
  }
}
