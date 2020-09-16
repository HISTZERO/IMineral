import { HttpErrorResponse } from "@angular/common/http";
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from "@angular/material";
import { TranslateService } from "@ngx-translate/core";
import { EditService, EditSettingsModel, GridComponent, QueryCellInfoEventArgs, TextWrapSettingsModel } from "@syncfusion/ej2-angular-grids";
import * as cloneDeep from "lodash.cloneDeep";

import { OutputDmLoaiTaiLieuModel } from "src/app/models/admin/danhmuc/loaitailieu.model";
import { DmFacadeService } from "src/app/services/admin/danhmuc/danhmuc-facade.service";
import { ThietlapFacadeService } from "src/app/services/admin/thietlap/thietlap-facade.service";
import { SettingsCommon, ThietLapHeThong } from "src/app/shared/constants/setting-common";
import { CommonServiceShared } from "../../../../../services/utilities/common-service";

@Component({
  selector: 'app-cauhinhtailieu-io',
  templateUrl: './cauhinhtailieu-io.component.html',
  styleUrls: ['./cauhinhtailieu-io.component.scss']
})
export class CauhinhtailieuIoComponent implements OnInit {

  // Viewchild template
  @ViewChild('gridLoaiTaiLieu', { static: false }) public gridLoaiTaiLieu: GridComponent;
  @ViewChild('gridCauHinhTaiLieu', { static: false }) public gridCauHinhTaiLieu: GridComponent;

  // Chứa thiết lập grid
  public settingsCommon = new SettingsCommon();

  // edit setting grid
  public editSettings: EditSettingsModel;

  // Chứa kiểu wrap text trên grid
  public wrapSettings: TextWrapSettingsModel;

  // Chứa danh sách Loại tài liệu
  public listLoaitaiLieu: OutputDmLoaiTaiLieuModel[];

  // Chứa danh sách cấu hình tài liệu
  public listCauHinhTaiLieu: any = [];

  // Chứa danh sách loại tài liệu đã chọn
  public listLoaiTaiLieuSelected: any;

  // Chứa danh sách cấu hình tài liệu đã chọn
  public listCauHinhTaiLieuSelected: any;

  // Chứa dữ liệu đã chọn 
  public selectedItem: OutputDmLoaiTaiLieuModel;

  // Chứa dữ liệu translate
  public dataTranslate: any;

  // Chứa thuộc tính disable button
  public disableBtnRight: boolean = true;
  public disableBtnLeft: boolean = true;


  constructor(
    public commonService: CommonServiceShared,
    public dmFacadeService: DmFacadeService,
    public thietlapFacadeService: ThietlapFacadeService,
    private translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) public dataGetIO: any,
  ) { }

  async ngOnInit() {
    // Cấu hình chức năng edit grid
    this.editSettings = { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Batch' };

    // Setting wrap mode
    this.wrapSettings = { wrapMode: 'Both' };
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

    // Gọi hàm lấy dữ liệu loại tài liệu
    await this.getAllLoaiTaiLieu();
  }

  /**
    * Hàm lấy dữ liệu loại tài liệu
    */
  async getAllLoaiTaiLieu(param: any = { PageNumber: 1, PageSize: -1 }) {
    if (this.listLoaitaiLieu != null && this.listLoaitaiLieu.length > 0) {
      this.gridLoaiTaiLieu.clearSelection();
    }
    const listData: any = await this.dmFacadeService
      .getDmLoaiTaiLieuService()
      .getFetchAll(param);
    if (listData.items) {
      listData.items.map((loaiTL, index) => {
        loaiTL.serialNumber = index + 1;
      });
    }
    this.listLoaitaiLieu = listData.items;
  }

  /**
   * Hàm lấy dữ liệu khi click vào row trên grid Loại tài liệu
   */
  public rowSelectedLoaiTaiLieu() {
    this.listLoaiTaiLieuSelected = cloneDeep(this.gridLoaiTaiLieu.getSelectedRecords());
    if (this.listLoaiTaiLieuSelected && this.listLoaiTaiLieuSelected.length >= 1) {
      this.disableBtnRight = false;
    } else {
      this.disableBtnRight = true;
    }
  }

  /**
   * Hàm lấy dữ liệu khi click vào row trên grid cấu hình tài liệu
   */
  public rowSelectedCauHinhTaiLieu() {
    this.listCauHinhTaiLieuSelected = cloneDeep(this.gridCauHinhTaiLieu.getSelectedRecords());
    if (this.listCauHinhTaiLieuSelected && this.listCauHinhTaiLieuSelected.length >= 1) {
      this.disableBtnLeft = false;
    } else {
      this.disableBtnLeft = true;
    }
  }

  /**
   * Nút chuyển toàn bộ dữ liệu grid loại tài liệu đã chọn sang grid cấu hình tài liệu
   */
  public btnDoubleRight() {
    this.listCauHinhTaiLieu = Array.prototype.concat.call(this.listLoaiTaiLieuSelected, this.listCauHinhTaiLieu);
    for (let i = this.listLoaitaiLieu.length; i--;) {
      if (this.listLoaiTaiLieuSelected.indexOf(this.listLoaitaiLieu[i]) !== -1) {
        this.listLoaitaiLieu.splice(i, 1);
      }
    }
    this.gridLoaiTaiLieu.refresh();
    this.gridLoaiTaiLieu.clearSelection();
  }

  /**
   * Nút chuyển toàn bộ dữ liệu grid loại tài liệu đã chọn sang grid cấu hình tài liệu
   */
  public btnDoubleLeft() {
    this.listLoaitaiLieu = Array.prototype.concat.call(this.listCauHinhTaiLieuSelected, this.listLoaitaiLieu);
    for (let i = this.listCauHinhTaiLieu.length; i--;) {
      if (this.listCauHinhTaiLieuSelected.indexOf(this.listCauHinhTaiLieu[i]) !== -1) {
        this.listCauHinhTaiLieu.splice(i, 1);
      }
    }
    console.log(this.listCauHinhTaiLieu);
    this.gridCauHinhTaiLieu.refresh();
    this.gridCauHinhTaiLieu.clearSelection();

  }

  /**
   * Lưu dữ liệu cấu hình
   */
  public getAllDataCauHinh() {
    const dataCauHinhTaiLieu: any = this.gridCauHinhTaiLieu.getBatchChanges();
    dataCauHinhTaiLieu.changedRecords.map(value => {
      value.loaicapphep = this.dataGetIO.model;
    })
    let dataBody = {
      list: dataCauHinhTaiLieu.changedRecords
    };
    this.thietlapFacadeService.getCauHinhTaiLieuService()
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
}
