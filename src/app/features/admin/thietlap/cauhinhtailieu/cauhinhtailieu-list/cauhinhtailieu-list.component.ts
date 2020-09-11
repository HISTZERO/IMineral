import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { MatSidenav, MatDialog } from "@angular/material";
import { TranslateService } from "@ngx-translate/core";
import { HttpErrorResponse } from "@angular/common/http";
import { GridComponent, TextWrapSettingsModel } from "@syncfusion/ej2-angular-grids";
import { FormGroup, FormBuilder } from "@angular/forms";

import { SettingsCommon, ThietLapHeThong } from "src/app/shared/constants/setting-common";
import { DmFacadeService } from "src/app/services/admin/danhmuc/danhmuc-facade.service";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { ThietlapFacadeService } from "src/app/services/admin/thietlap/thietlap-facade.service";
import { DmLoaicapphepIoComponent } from "src/app/features/admin/danhmuc/loaicapphep/loaicapphep-io/loaicapphep-io.component";
import { TrangThai } from "src/app/shared/constants/trangthai-constants";
import { TrangThaiEnum, Paging, TrangThaiCauHinh } from "src/app/shared/constants/enum";
import { NhomLoaiCapPhep } from "src/app/shared/constants/nhomloaicapphep-constants";
import { OutputCauHinhTaiLieuModel } from "src/app/models/admin/thietlap/cauhinhtailieu.model";
import { MenuCauHinhTaiLieu } from "src/app/shared/constants/sub-menus/thietlap/cauhinhtailieu";
import { MatdialogService } from "../../../../../services/utilities/matdialog.service";
import { CauhinhtailieuIoComponent } from "../cauhinhtailieu-io/cauhinhtailieu-io.component";

@Component({
  selector: 'app-cauhinhtailieu-list',
  templateUrl: './cauhinhtailieu-list.component.html',
  styleUrls: ['./cauhinhtailieu-list.component.scss']
})
export class CauhinhtailieuListComponent implements OnInit {

  // Viewchild template
  @ViewChild("gridCauHinhTaiLieu", { static: false }) public gridCauHinhTaiLieu: GridComponent;
  @ViewChild("aside", { static: true }) public matSidenav: MatSidenav;
  @ViewChild("compCauHinhTaiLieuIO", { read: ViewContainerRef, static: true }) public content: ViewContainerRef;

  // Chứa thiết lập grid
  public settingsCommon = new SettingsCommon();

  // Chứa danh sách loại cấp phép chứa trạng thái cấu hình
  public listLoaiCapPhep: OutputCauHinhTaiLieuModel[];

  // Chứa dữ liệu đã chọn 
  public selectedItem: OutputCauHinhTaiLieuModel;

  // Chứa dữ liệu translate
  public dataTranslate: any;

  // Chứa menu item trên subheader
  public navArray = MenuCauHinhTaiLieu;

  // Chứa thuộc tính form
  public formSearch: FormGroup;

  //Chứa data Trạng thái
  public trangthai = TrangThai;

  // Chứa dữ liệu Nhóm loại cấp phép
  public nhomLoaiCapPhep = NhomLoaiCapPhep;

  // Chứa kiểu wrap text trên grid
  public wrapSettings: TextWrapSettingsModel;

  // Chứa dữ liệu thủ tục hành chính
  public listThuTucHanhChinh: any;

  // Chứa trạng thái cấu hình
  public trangThaiCauHinh = TrangThaiCauHinh;

  // Chứa service dialog
  public mDialog: any;

  // Contructor
  constructor(
    public commonService: CommonServiceShared,
    public thietlapFacadeService: ThietlapFacadeService,
    private translate: TranslateService,
    public formBuilder: FormBuilder,
    public dmFacadeService: DmFacadeService,
    private imDialog: MatDialog,
    public imDialogService: MatdialogService,
  ) {
    this.mDialog = imDialogService;
    this.mDialog.initDialg(imDialog);

  }

  async ngOnInit() {
    // Khởi tạo form
    this.formInit();
    // Gọi hàm lấy dữ liệu translate
    await this.getDataTranslate();
    // Lấy dữ liệu thủ tục hành chính
    this.getAllThuTucHanhChinh();
    // Setting wrap mode
    this.wrapSettings = { wrapMode: 'Both' };
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
    let dataSetting: any = await this.thietlapFacadeService
      .getThietLapHeThongService()
      .getByid(ThietLapHeThong.defaultPageSize).toPromise();
    if (dataSetting) {
      this.settingsCommon.pageSettings.pageSize = dataSetting.settingValue;
    } else {
      this.settingsCommon.pageSettings.pageSize = 10;
    }
    // Gọi hàm lấy dữ liệu Loại cấp phép
    await this.getAllLoaiCapPhep();
  }

  /**
   * Hàm lấy dữ liệu Loại cấp phép
   */
  async getAllLoaiCapPhep(param: any = { PageNumber: 1, PageSize: -1 }) {
    const listData: any = await this.thietlapFacadeService
      .getCauHinhTaiLieuService()
      .getAllStatusCauHinhTaiLieu();
    if (listData) {
      listData.map((loaiCP, index) => {
        loaiCP.serialNumber = index + 1;
      });
    }
    this.listLoaiCapPhep = listData;
  }

  /**
   * Hàm lấy dữ liệu Thủ tục hành chính
   */
  async getAllThuTucHanhChinh() {
    const listData: any = await this.dmFacadeService
      .getDmThuTucHanhChinhService()
      .getFetchAll({ PageNumber: 1, PageSize: -1 });
    this.listThuTucHanhChinh = listData.items;
  }

  /**
   * Hàm load lại dữ liệu và reset form tìm kiếm
   */
  public reloadDataGrid() {
    this.formSearch.reset({
      Keyword: "",
      Idthutuchanhchinh: "",
      Nhomloaicapphep: "",
      Trangthai: ""
    });
    this.getAllLoaiCapPhep();
  }

  /**
   * Form innit
   */
  public formInit() {
    this.formSearch = this.formBuilder.group({
      Keyword: [""],
      Idthutuchanhchinh: [""],
      Nhomloaicapphep: [""],
      Trangthai: [""]
    });
  }

  /**
  * Tìm kiếm nâng cao
  */
  public searchAdvance() {
    let dataSearch = this.formSearch.value;
    dataSearch['PageNumber'] = Paging.PageNumber;
    dataSearch['PageSize'] = Paging.PageSize;
    this.getAllLoaiCapPhep(dataSearch);
  }

  /**
     * Hàm mở dialog
     */
  public showMatDialog() {
    this.mDialog.setDialog(this, CauhinhtailieuIoComponent, "", "closeMatDialog", "", "75%");
    this.mDialog.open();
  }

  /**
   * Hàm đóng mat dialog
   */
  closeMatDialog() {
    this.imDialog.closeAll();
  }


  // Hàm dùng để gọi các hàm khác, truyền vào tên hàm cần thực thi
  doFunction(methodName) {
    this[methodName]();
  }
}
