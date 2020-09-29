import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav, MatDialog } from "@angular/material";
import { TranslateService } from "@ngx-translate/core";
import { GridComponent, TextWrapSettingsModel } from "@syncfusion/ej2-angular-grids";

import { SettingsCommon, ThietLapHeThong } from "src/app/shared/constants/setting-common";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { ThietlapFacadeService } from "src/app/services/admin/thietlap/thietlap-facade.service";
import { MatdialogService } from "src/app/services/utilities/matdialog.service";
import { MenuCoQuanCapPhep } from "src/app/shared/constants/sub-menus/thietlap/coquancapphep";
import {OutputHsCoQuanCapPhepModel} from "src/app/models/admin/thietlap/coquancapphep.model";
import {CoquancapphepIoComponent} from "src/app/features/admin/thietlap/coquancapphep/coquancapphep-io/coquancapphep-io.component";

@Component({
  selector: 'app-coquancapphep-list',
  templateUrl: './coquancapphep-list.component.html',
  styleUrls: ['./coquancapphep-list.component.scss']
})
export class CoquancapphepListComponent implements OnInit {


  // Viewchild template
  @ViewChild("gridCoQuanCapPhep", { static: false }) public gridCoQuanCapPhep: GridComponent;
  @ViewChild("aside", { static: true }) public matSidenav: MatSidenav;

  // Chứa thiết lập grid
  public settingsCommon = new SettingsCommon();

  // Chứa danh sách cơ quan tiếp nhận
  public listCoQuanCapPhep: OutputHsCoQuanCapPhepModel[];

  // Chứa dữ liệu đã chọn
  public selectedItem: OutputHsCoQuanCapPhepModel;

  // Chứa dữ liệu translate
  public dataTranslate: any;

  // Chứa menu item trên subheader
  public navArray = MenuCoQuanCapPhep;

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
      this.settingsCommon.pageSettings.pageSize = +dataSetting.settingValue;
    } else {
      this.settingsCommon.pageSettings.pageSize = 10;
    }
    // Gọi hàm lấy dữ liệu cơ quan tiếp nhận
    await this.getAllCoQuanCapPhep();
  }

  /**
   * Hàm lấy dữ liệu cơ quan tiếp nhận
   */
  async getAllCoQuanCapPhep(param: any = { PageNumber: 1, PageSize: -1 }) {
    const listData: any = await this.thietlapFacadeService
      .getCoQuanCapPhepService()
      .getFetchAll(param);
    if (listData) {
      listData.items.map((coquancapphep, index) => {
        coquancapphep.serialNumber = index + 1;
      });
    }
    this.listCoQuanCapPhep = listData.items;
  }

  /**
   * Hàm load lại dữ liệu và reset form tìm kiếm
   */
  public reloadDataGrid() {
    this.getAllCoQuanCapPhep();
  }


  /**
   * Hàm mở dialog
   */
  public showMatDialog() {
    this.mDialog.setDialog(this, CoquancapphepIoComponent, "", "closeMatDialog", "", "80%", "80%");
    this.mDialog.open();
  }

  /**
   * Hàm đóng mat dialog
   */
  closeMatDialog() {
    this.imDialog.closeAll();
    this.getAllCoQuanCapPhep();
  }


  // Hàm dùng để gọi các hàm khác, truyền vào tên hàm cần thực thi
  doFunction(methodName) {
    this[methodName]();
  }


}
