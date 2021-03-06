import {Component, OnInit, ViewChild} from '@angular/core';
import {CoquanbanhanhIoComponent} from "src/app/features/admin/thietlap/coquanbanhanh/coquanbanhanh-io/coquanbanhanh-io.component";
import {GridComponent, TextWrapSettingsModel} from "@syncfusion/ej2-angular-grids";
import {MatSidenav} from "@angular/material/sidenav";
import {SettingsCommon, ThietLapHeThong} from "src/app/shared/constants/setting-common";
import {OutputHsCoQuanBanHanhModel} from "src/app/models/admin/thietlap/coquanbanhanh.model";
import {MenuCoQuanBanHanh} from "src/app/shared/constants/sub-menus/thietlap/coquanbanhanh";
import {CommonServiceShared} from "src/app/services/utilities/common-service";
import {ThietlapFacadeService} from "src/app/services/admin/thietlap/thietlap-facade.service";
import {TranslateService} from "@ngx-translate/core";
import {MatDialog} from "@angular/material/dialog";
import {MatdialogService} from "src/app/services/utilities/matdialog.service";


@Component({
  selector: 'app-coquanbanhanh-list',
  templateUrl: './coquanbanhanh-list.component.html',
  styleUrls: ['./coquanbanhanh-list.component.scss']
})
export class CoquanbanhanhListComponent implements OnInit {

  // Viewchild template
  @ViewChild("gridCoQuanBanHanh", {static: false}) public gridCoQuanBanHanh: GridComponent;
  @ViewChild("aside", {static: true}) public matSidenav: MatSidenav;

  // Chứa thiết lập grid
  public settingsCommon = new SettingsCommon();

  // Chứa danh sách cơ quan tiếp nhận
  public listCoQuanBanHanh: OutputHsCoQuanBanHanhModel[];

  // Chứa dữ liệu đã chọn
  public selectedItem: OutputHsCoQuanBanHanhModel;

  // Chứa dữ liệu translate
  public dataTranslate: any;

  // Chứa menu item trên subheader
  public navArray = MenuCoQuanBanHanh;

  // Chứa kiểu wrap text trên grid
  public wrapSettings: TextWrapSettingsModel;

  // Chứa service dialog
  public mDialog: any;

  // Contructor
  constructor(
    public commonService: CommonServiceShared,
    public thietlapFacadeService: ThietlapFacadeService,
    private translate: TranslateService,
    private imDialog: MatDialog,
    public imDialogService: MatdialogService,
  ) {
    this.mDialog = imDialogService;
    this.mDialog.initDialg(imDialog);

  }

  async ngOnInit() {

    // Gọi hàm lấy dữ liệu translate
    await this.getDataTranslate();

    // Setting wrap mode
    this.wrapSettings = {wrapMode: 'Both'};

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
      this.settingsCommon.pageSettings.pageSize = +dataSetting.settingValue;
    } else {
      this.settingsCommon.pageSettings.pageSize = 10;
    }
    // Gọi hàm lấy dữ liệu cơ quan tiếp nhận
    await this.getAllCoQuanBanHanh();
  }

  /**
   * Hàm lấy dữ liệu cơ quan tiếp nhận
   */
  async getAllCoQuanBanHanh(param: any = {PageNumber: 1, PageSize: -1}) {
    const listData: any = await this.thietlapFacadeService
      .getCoQuanBanHanhService()
      .getAllCoQuanBanHanh(param);
    if (listData) {
      listData.map((coquanbanhanh, index) => {
        coquanbanhanh.serialNumber = index + 1;
      });
    }
    this.listCoQuanBanHanh = listData;
  }

  /**
   * Hàm load lại dữ liệu và reset form tìm kiếm
   */
  public reloadDataGrid() {
    this.getAllCoQuanBanHanh();
  }


  /**
   * Hàm mở dialog
   */
  public showMatDialog() {
    this.mDialog.setDialog(this, CoquanbanhanhIoComponent, "", "closeMatDialog", "", "80%", "80%");
    this.mDialog.open();
  }

  /**
   * Hàm đóng mat dialog
   */
  closeMatDialog() {
    this.imDialog.closeAll();
    this.getAllCoQuanBanHanh();
  }


  // Hàm dùng để gọi các hàm khác, truyền vào tên hàm cần thực thi
  doFunction(methodName) {
    this[methodName]();
  }
}
