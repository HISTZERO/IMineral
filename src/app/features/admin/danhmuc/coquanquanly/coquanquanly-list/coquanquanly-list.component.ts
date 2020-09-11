import { Component, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { MatSidenav } from "@angular/material";
import { TranslateService } from "@ngx-translate/core";
import { HttpErrorResponse } from "@angular/common/http";
import { GridComponent, TextWrapSettingsModel } from "@syncfusion/ej2-angular-grids";
import { FormGroup, FormBuilder } from "@angular/forms";

import { SettingsCommon, ThietLapHeThong } from "src/app/shared/constants/setting-common";
import { OutputDmCoQuanQuanLyModel } from "src/app/models/admin/danhmuc/coquanquanly.model";
import { MenuDanhMucCoQuanQuanLy } from "src/app/shared/constants/sub-menus/danhmuc/danhmuc";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { DmFacadeService } from "src/app/services/admin/danhmuc/danhmuc-facade.service";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { ThietlapFacadeService } from "src/app/services/admin/thietlap/thietlap-facade.service";
import { DmCoquanquanlyIoComponent } from "src/app/features/admin/danhmuc/coquanquanly/coquanquanly-io/coquanquanly-io.component";
import { TrangThai } from "src/app/shared/constants/trangthai-constants";
import { GeneralClientService } from "src/app/services/admin/common/general-client.service";
import { TrangThaiEnum, Paging } from "src/app/shared/constants/enum";
import { OutputDmDvhcModel } from "src/app/models/admin/danhmuc/dvhc.model";


@Component({
  selector: 'app-coquanquanly-list',
  templateUrl: './coquanquanly-list.component.html',
  styleUrls: ['./coquanquanly-list.component.scss']
})
export class DmCoquanquanlyListComponent implements OnInit {

  // Viewchild template
  @ViewChild("gridCoQuanQuanLy", { static: false }) public gridCoQuanQuanLy: GridComponent;
  @ViewChild("aside", { static: true }) public matSidenav: MatSidenav;
  @ViewChild("compCoQuanQuanLyIO", { read: ViewContainerRef, static: true }) public content: ViewContainerRef;

  // Chứa thiết lập grid
  public settingsCommon = new SettingsCommon();

  // Chứa danh sách Cơ quan quản lý
  public listCoQuanQuanLy: OutputDmCoQuanQuanLyModel[];

  // Chứa dữ liệu đã chọn 
  public selectedItem: OutputDmCoQuanQuanLyModel;

  // Chứa dữ liệu translate
  public dataTranslate: any;

  // Chứa menu item trên subheader
  public navArray = MenuDanhMucCoQuanQuanLy;

  // Chứa thuộc tính form
  public formSearch: FormGroup;

  // Chứa danh sách item đã chọn
  public listDataSelect: any[];

  //Chứa data Trạng thái
  public trangthai = TrangThai;

  // disable delete button
  public disableDeleteButton = false;

  // disable active button
  public disableActiveButton = false;

  // disable unactive button
  public disableUnActiveButton = false;

  // Chứa danh sách Dvhc Tỉnh
  public allTinh: any;

  // Chứa danh sách Dvhc Huyện
  public allHuyen: any;

  // Chứa danh sách Dvhc Xã
  public allXa: any;

  // Filter Đơn vị hành chính Tỉnh
  public dvhcProvinceFilters: OutputDmDvhcModel[];

  // Filter Đơn vị hành chính Huyện
  public dvhcDistrictFilters: OutputDmDvhcModel[];

  // Filter Đơn vị hành chính Xã
  public dvhcWardFilters: OutputDmDvhcModel[];

  // Chứa kiểu wrap text trên grid
  public wrapSettings: TextWrapSettingsModel;

  // Contructor
  constructor(
    public matSidenavService: MatsidenavService,
    public cfr: ComponentFactoryResolver,
    public dmFacadeService: DmFacadeService,
    public commonService: CommonServiceShared,
    public thietlapFacadeService: ThietlapFacadeService,
    private translate: TranslateService,
    public generalClientService: GeneralClientService,
    public formBuilder: FormBuilder
  ) { }

  async ngOnInit() {
    // Khởi tạo form
    this.formInit();
    // Lấy danh sách Tỉnh
    this.showDvhcTinh();
    // Gọi hàm lấy dữ liệu translate
    await this.getDataTranslate();
    // Setting wrap mode
    this.wrapSettings = { wrapMode: 'Both' };
    // Khởi tạo sidenav
    this.matSidenavService.setSidenav(this.matSidenav, this, this.content, this.cfr);
    // Gọi hàm lấy dữ liệu pagesize
    await this.getDataPageSize();
    await this.setDisplayOfCheckBoxkOnGrid(true);
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
      this.settingsCommon.pageSettings.pageSize = dataSetting.settingValue;
    } else {
      this.settingsCommon.pageSettings.pageSize = 10;
    }
    // Gọi hàm lấy dữ liệu cơ quan quản lý
    await this.getAllCoQuanQuanLy();
  }

  /**
  * Hàm lấy dữ liệu Cơ Quan Quản Lý
  */
  async getAllCoQuanQuanLy(param: any = { PageNumber: 1, PageSize: -1 }) {
    if (this.listCoQuanQuanLy != null && this.listCoQuanQuanLy.length > 0) {
      this.gridCoQuanQuanLy.clearSelection();
    }
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
   * Hàm load lại dữ liệu grid
   */
  public reloadDataGrid() {
    this.formSearch.reset({
      Keyword: "",
      Idtinh: "",
      Idhuyen: "",
      Idxa: "",
      Trangthai: ""
    });
    this.getAllCoQuanQuanLy();
  }

  /**
   * Hàm thiết lập hiển thị hoặc ẩn checkbox trên grid
   */
  async setDisplayOfCheckBoxkOnGrid(status: boolean = false) {
    if (status) {
      this.settingsCommon.selectionOptions = { persistSelection: true };
    } else {
      this.settingsCommon.selectionOptions = null;
    }
  }

  /**
  * Form innit
  */
  public formInit() {
    this.formSearch = this.formBuilder.group({
      Keyword: [""],
      Idtinh: [""],
      Idhuyen: [""],
      Idxa: [""],
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
    this.getAllCoQuanQuanLy(dataSearch)
  }

  /**
   * Hàm lấy danh sách dữ liệu đã chọn trên grid
   */
  public getAllDataActive() {
    this.listDataSelect = this.gridCoQuanQuanLy.getSelectedRecords();
    if (this.listDataSelect.length > 0) {
      this.disableActiveButton = true;
      this.disableDeleteButton = true;
      this.disableUnActiveButton = true;
    } else {
      this.disableActiveButton = false;
      this.disableDeleteButton = false;
      this.disableUnActiveButton = false;
    }
  }

  /**
   * Hàm unActive mảng item đã chọn
   */
  public unActiveArrayItem() {
    const dialogRef = this.commonService.confirmDeleteDiaLogService("", "", this.dataTranslate.DANHMUC.coquanquanly.confirmedContentOfUnActiveDialog);
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === "confirm") {
        const dataParam: any = {
          listStatus: this.listDataSelect,
          status: TrangThaiEnum.NoActive
        };
        this.dmFacadeService.getDmCoQuanQuanLyService()
          .updateStatusItemsCoQuanQuanLy(dataParam)
          .subscribe(
            () => {
              this.getAllCoQuanQuanLy();
            },
            (error: HttpErrorResponse) => {
              this.commonService.showDialogWarning(error.error.errors);
            },
            () =>
              this.commonService.showeNotiResult(
                this.dataTranslate.COMMON.default.updateStatusSuccess,
                2000)
          );
      }
    });
  }

  /**
   * Hàm active mảng item đã chọn
   */
  public activeArrayItem() {
    const dialogRef = this.commonService.confirmDeleteDiaLogService("", "", this.dataTranslate.DANHMUC.coquanquanly.confirmedContentOfActiveDialog);
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === "confirm") {
        const dataParam: any = {
          listStatus: this.listDataSelect,
          status: TrangThaiEnum.Active
        };
        this.dmFacadeService.getDmCoQuanQuanLyService()
          .updateStatusItemsCoQuanQuanLy(dataParam)
          .subscribe(
            () => {
              this.getAllCoQuanQuanLy();
            },
            (error: HttpErrorResponse) => {
              this.commonService.showDialogWarning(error.error.errors);
            },
            () =>
              this.commonService.showeNotiResult(
                this.dataTranslate.COMMON.default.updateStatusSuccess,
                2000)
          );
      }
    });
  }

  /**
   * Hàm delete mảng item đã chọn
   */
  public deleteArrayItem() {
    let idItems: string[] = [];
    const dialogRef = this.commonService.confirmDeleteDiaLogService("", this.dataTranslate.DANHMUC.coquanquanly.confirmedContentOfDeleteDialog);
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === "confirm") {
        const data = this.generalClientService.findByKeyName<any>(this.listDataSelect, "trangthai", TrangThaiEnum.Active);

        if (data !== null) {
          const informationDialogRef = this.commonService.informationDiaLogService(
            "",
            this.dataTranslate.DANHMUC.coquanquanly.nameofobject + " (" + data.tencoquanquanly + ") " + this.dataTranslate.DANHMUC.coquanquanly.informedContentOfUnDeletedDialog,
            this.dataTranslate.DANHMUC.coquanquanly.informedDialogTitle,
          );
        } else {
          this.listDataSelect.map(res => {
            idItems.push(res.idcoquanquanly);
          });

          const dataBody: any = {
            listId: idItems,
          };

          this.dmFacadeService.getDmCoQuanQuanLyService()
            .deleteItemsCoQuanQuanLy(dataBody)
            .subscribe(
              () => {
                this.getAllCoQuanQuanLy();
              },
              (error: HttpErrorResponse) => {
                this.commonService.showDialogWarning(error.error.errors);
              },
              () =>
                this.commonService.showeNotiResult(
                  this.dataTranslate.COMMON.default.successDelete,
                  2000
                ));
        }
      }
    });
  }

  /**
   * Hàm lấy danh sách Dvhc Tỉnh
   */
  async showDvhcTinh() {
    const allTinhData: any = await this.dmFacadeService
      .getProvinceService()
      .getFetchAll({ Trangthai: TrangThaiEnum.Active });
    this.allTinh = allTinhData;
    this.dvhcProvinceFilters = allTinhData;
  }

  /**
   * Hàm lấy danh sách Dvhc Huyện
   */
  async showDvhcHuyen() {
    if (!this.formSearch.value.Idtinh === true) {
      this.allHuyen = [];
      this.dvhcDistrictFilters = [];
      this.allXa = [];
      this.dvhcWardFilters = [];
      this.formSearch.controls["Idhuyen"].setValue("");
    }
    if (!this.formSearch.value.Idtinh === false) {
      this.allXa = [];
      this.dvhcWardFilters = [];
      this.formSearch.controls["Idhuyen"].setValue("");
      this.allHuyen = await this.dmFacadeService
        .getDistrictService()
        .getFetchAll({ IdTinh: this.formSearch.value.Idtinh });
      this.dvhcDistrictFilters = this.allHuyen;
    }
  }

  /**
   * Hàm lấy danh sách Dvhc Xã
   */
  async showDvhcXa() {
    if (!this.formSearch.value.Idhuyen === true) {
      this.allXa = [];
      this.dvhcWardFilters = [];
      this.formSearch.controls["Idxa"].setValue("");
    }
    if (
      !this.formSearch.value.Idtinh === false &&
      !this.formSearch.value.Idhuyen === false
    ) {
      this.formSearch.controls["Idxa"].setValue("");
      this.allXa = await this.dmFacadeService
        .getWardService()
        .getFetchAll({ IdHuyen: this.formSearch.value.Idhuyen});
      this.dvhcWardFilters = this.allXa;
    }
  }

  /**
  * Hàm mở sidenav chức năng sửa dữ liệu
  * @param id
  */
  async editItemCoQuanQuanLy(id: string) {
    // Lấy dữ liệu cơ quan quản lý theo id
    const dataItem: any = await this.dmFacadeService
      .getDmCoQuanQuanLyService()
      .getByid(id).toPromise();
    await this.matSidenavService.setTitle(this.dataTranslate.DANHMUC.coquanquanly.titleEdit);
    await this.matSidenavService.setContentComp(DmCoquanquanlyIoComponent, "edit", dataItem);
    await this.matSidenavService.open();
  }

  /**
  * Hàm mở sidenav chức năng thêm mới
  */
  public openCoQuanQuanLyIOSidenav() {
    this.matSidenavService.setTitle(this.dataTranslate.DANHMUC.coquanquanly.titleAdd);
    this.matSidenavService.setContentComp(DmCoquanquanlyIoComponent, "new");
    this.matSidenavService.open();
  }

  /**
  * Hàm đóng sidenav
  */
  public closeCoQuanQuanLyIOSidenav() {
    this.matSidenavService.close();
  }


  /**
  *  Hàm xóa một bản ghi, được gọi khi nhấn nút xóa trên giao diện list
  */
  async deleteItemCoQuanQuanLy(data) {
    this.selectedItem = data;
    // Phải check xem dữ liệu muốn xóa có đang được dùng ko, đang dùng thì ko xóa
    // Trường hợp dữ liệu có thể xóa thì Phải hỏi người dùng xem có muốn xóa không
    // Nếu đồng ý xóa
    const canDelete: string = this.dmFacadeService
      .getDmCoQuanQuanLyService()
      .checkBeDeleted(+this.selectedItem.idcoquanquanly);
    this.canBeDeletedCheck(canDelete);
  }

  /**
  * Hàm check điều kiện xóa bản ghi
  * @param sMsg 
  */
  public canBeDeletedCheck(sMsg: string) {
    if (sMsg === "ok") {
      this.confirmDeleteDiaLog();
    } else {
      this.cantDeleteDialog(sMsg);
    }
  }

  /** 
  * Hàm thực hiện chức năng xóa bản ghi và thông báo xóa thành công
  */
  confirmDeleteDiaLog() {
    const dialogRef = this.commonService.confirmDeleteDiaLogService(
      this.dataTranslate.DANHMUC.coquanquanly.contentDelete,
      this.selectedItem.tencoquanquanly
    );
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === "confirm") {
        const data = this.generalClientService.findByKeyName<any>([this.selectedItem], "trangthai", TrangThaiEnum.Active);

        if (data !== null) {
          const informationDialogRef = this.commonService.informationDiaLogService(
            "",
            this.dataTranslate.DANHMUC.coquanquanly.nameofobject + " (" + data.tencoquanquanly + ") " + this.dataTranslate.DANHMUC.coquanquanly.informedContentOfUnDeletedDialog,
            this.dataTranslate.DANHMUC.coquanquanly.informedDialogTitle,
          );
        } else {
          await this.dmFacadeService
            .getDmCoQuanQuanLyService()
            .deleteItem({ idCoquanquanly: this.selectedItem.idcoquanquanly })
            .subscribe(
              () => this.getAllCoQuanQuanLy(),
              (error: HttpErrorResponse) => {
                this.commonService.showDialogWarning(error.error.errors);
              },
              () =>
                this.commonService.showeNotiResult(
                  this.dataTranslate.COMMON.default.successDelete,
                  2000
                )
            );
        }
      }
    });
  }



  /**
  * Hàm thông báo không thể xóa
  */
  cantDeleteDialog(sMsg: string) {
    this.commonService.canDeleteDialogService(sMsg);
  }

  // Hàm dùng để gọi các hàm khác, truyền vào tên hàm cần thực thi
  doFunction(methodName) {
    this[methodName]();
  }
}
