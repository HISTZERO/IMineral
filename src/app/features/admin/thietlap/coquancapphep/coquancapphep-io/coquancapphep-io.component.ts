import { HttpErrorResponse } from "@angular/common/http";
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { TranslateService } from "@ngx-translate/core";
import { GridComponent, TextWrapSettingsModel } from "@syncfusion/ej2-angular-grids";
import * as cloneDeep from "lodash.cloneDeep";

import { DmFacadeService } from "src/app/services/admin/danhmuc/danhmuc-facade.service";
import { ThietlapFacadeService } from "src/app/services/admin/thietlap/thietlap-facade.service";
import { SettingsCommon, ThietLapHeThong } from "src/app/shared/constants/setting-common";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { OutputDmCoQuanQuanLyModel } from "src/app/models/admin/danhmuc/coquanquanly.model";
import { TrangThaiEnum } from "src/app/shared/constants/enum";

@Component({
  selector: 'app-coquancapphep-io',
  templateUrl: './coquancapphep-io.component.html',
  styleUrls: ['./coquancapphep-io.component.scss']
})
export class CoquancapphepIoComponent implements OnInit {


  // Viewchild template
  @ViewChild('gridCoQuanQuanLy', { static: false }) public gridCoQuanQuanLy: GridComponent;
  @ViewChild('gridCoQuanCapPhep', { static: false }) public gridCoQuanCapPhep: GridComponent;

  // Chứa thiết lập grid
  public settingsCommon = new SettingsCommon();

  // Chứa kiểu wrap text trên grid
  public wrapSettings: TextWrapSettingsModel;

  // Chứa danh sách Cơ quan quản lý
  public listCoQuanQuanLy: OutputDmCoQuanQuanLyModel[];

  // Chứa danh sách cơ quan tiếp nhận
  public listCoQuanCapPhep: any = [];

  // Chứa danh sách loại tài liệu đã chọn
  public listCoQuanQuanLySelected: any;

  // Chứa danh sách cơ quan tiếp nhận đã chọn
  public listCoQuanCapPhepSelected: any;

  // Chứa dữ liệu translate
  public dataTranslate: any;

  // Chứa thuộc tính disable button
  public disableBtnRight: boolean = true;
  public disableBtnLeft: boolean = true;


  constructor(
    public dialogRef: MatDialogRef<CoquancapphepIoComponent>,
    public commonService: CommonServiceShared,
    public dmFacadeService: DmFacadeService,
    public thietlapFacadeService: ThietlapFacadeService,
    private translate: TranslateService
  ) { }

  async ngOnInit() {

    // Setting wrap mode
    this.wrapSettings = { wrapMode: 'Both' };

    // hàm lấy dữ liệu translate
    await this.getDataTranslate();

    // Gọi hàm lấy dữ liệu pagesize
    await this.getDataPageSize();
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
      .getByid(ThietLapHeThong.defaultPageSize).toPromise();
    if (dataSetting) {
      this.settingsCommon.pageSettings.pageSize = +dataSetting.settingValue;
    } else {
      this.settingsCommon.pageSettings.pageSize = 10;
    }

    // Gọi hàm lấy dữ liệu cơ quan quản lý
    await this.getAllCoQuanQuanLy();
    await this.getAllCoQuanCapPhep();
  }

  /**
   * Hàm lấy dữ liệu cơ quan quản lý
   */
  async getAllCoQuanQuanLy(param: any = { PageNumber: 1, PageSize: -1 , Trangthai: TrangThaiEnum.Active}) {
    const listData: any = await this.dmFacadeService
      .getDmCoQuanQuanLyService()
      .getFetchAll(param);
    if (listData.items) {
      listData.items.map((coquan, index) => {
        coquan.serialNumber = index + 1;
      });
    }
    this.listCoQuanQuanLy = listData.items;
  }

  /**
   * Lấy danh sách loại tài liệu đã cấu hình
   */
  async getAllCoQuanCapPhep() {
    const listDataCoQuanCapPhep: any = await this.thietlapFacadeService
      .getCoQuanCapPhepService()
      .getAllCoQuanCapPhep({});

    if (listDataCoQuanCapPhep) {
      // gán dữ liệu
      this.listCoQuanCapPhep = listDataCoQuanCapPhep;

      // map dữ liệu 2 grid
      for (let i = this.listCoQuanQuanLy.length; i--;) {
        if (this.listCoQuanCapPhep.find(item => item.idcoquanquanly === this.listCoQuanQuanLy[i].idcoquanquanly)) {
          this.listCoQuanQuanLy.splice(i, 1);
        }
      }
      this.gridCoQuanQuanLy.refresh();
    }

  }

  /**
   * Hàm lấy dữ liệu khi click vào row trên grid coq quan quản lý
   */
  public rowSelectedCoQuanQuanLy() {
    this.listCoQuanQuanLySelected = cloneDeep(this.gridCoQuanQuanLy.getSelectedRecords());
    if (this.listCoQuanQuanLySelected && this.listCoQuanQuanLySelected.length >= 1) {
      this.disableBtnRight = false;
    } else {
      this.disableBtnRight = true;
    }
  }

  /**
   * Hàm lấy dữ liệu khi click vào row trên grid cơ quan cấp phép
   */
  public rowSelectedCoQuanCapPhep() {
    this.listCoQuanCapPhepSelected = cloneDeep(this.gridCoQuanCapPhep.getSelectedRecords());
    if (this.listCoQuanCapPhepSelected && this.listCoQuanCapPhepSelected.length >= 1) {
      this.disableBtnLeft = false;
    } else {
      this.disableBtnLeft = true;
    }
  }

  /**
   * Nút chuyển toàn bộ dữ liệu grid loại tài liệu đã chọn sang grid cấu hình tài liệu
   */
  public btnDoubleRight() {
    this.listCoQuanCapPhep = Array.prototype.concat.call(this.listCoQuanQuanLySelected, this.listCoQuanCapPhep);
    for (let i = this.listCoQuanQuanLy.length; i--;) {
      if (this.listCoQuanQuanLySelected.find(item => item.idcoquanquanly === this.listCoQuanQuanLy[i].idcoquanquanly)) {
        this.listCoQuanQuanLy.splice(i, 1);
      }
    }
    this.gridCoQuanQuanLy.refresh();
    this.gridCoQuanQuanLy.clearSelection();
  }

  /**
   * Nút chuyển toàn bộ dữ liệu grid loại tài liệu đã chọn sang grid cấu hình tài liệu
   */
  public btnDoubleLeft() {
    this.listCoQuanQuanLy = Array.prototype.concat.call(this.listCoQuanCapPhepSelected, this.listCoQuanQuanLy);
    for (let i = this.listCoQuanCapPhep.length; i--;) {
      if (this.listCoQuanCapPhepSelected.find(item => item.idcoquanquanly === this.listCoQuanCapPhep[i].idcoquanquanly)) {
        this.listCoQuanCapPhep.splice(i, 1);
      }
    }
    this.gridCoQuanCapPhep.refresh();
    this.gridCoQuanCapPhep.clearSelection();

  }

  /**
   * Lưu dữ liệu cấu hình
   */
  public cauHinhHsCoQuanCapPhep() {
    const dataCoQuanCapPhep: any = this.gridCoQuanCapPhep.dataSource;
    let dataBody = {
      list: dataCoQuanCapPhep
    };
    this.thietlapFacadeService.getCoQuanCapPhepService()
      .updateItem(dataBody).subscribe(
      res => {
      },
      (error: HttpErrorResponse) => {
        this.commonService.showDialogWarning(error.error.errors);
      },
      () =>
        this.commonService.showeNotiResult(
          this.dataTranslate.COMMON.default.successEdit,
          2000
        ));
  }

  /**
   * Hàm đóng dialog
   */
  public closeMatDialog() {
    this.dialogRef.close();
  }


}
