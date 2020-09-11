import { Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef } from "@angular/core";
import { MatSidenav } from "@angular/material/sidenav";
import { TranslateService } from "@ngx-translate/core";
import { HttpErrorResponse } from "@angular/common/http";
import { GridComponent, TextWrapSettingsModel } from "@syncfusion/ej2-angular-grids";
import { FormGroup, FormBuilder } from "@angular/forms";

import { SettingsCommon, ThietLapHeThong } from "src/app/shared/constants/setting-common";
import { OutputDmCanhanModel } from "src/app/models/admin/danhmuc/canhan.model";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { DmFacadeService } from "src/app/services/admin/danhmuc/danhmuc-facade.service";
import { DmCanhanIoComponent } from "src/app/features/admin/danhmuc/canhan/canhan-io/canhan-io.component";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { ThietlapFacadeService } from "src/app/services/admin/thietlap/thietlap-facade.service";
import { MenuDanhMucCaNhan } from "src/app/shared/constants/sub-menus/danhmuc/danhmuc";
import { TrangThai } from "src/app/shared/constants/trangthai-constants";
import { OutputDmDvhcModel } from "src/app/models/admin/danhmuc/dvhc.model";
import { GeneralClientService } from "src/app/services/admin/common/general-client.service";
import { TrangThaiEnum, Paging } from "src/app/shared/constants/enum";


@Component({
  selector: "app-canhan-list",
  templateUrl: "./canhan-list.component.html",
  styleUrls: ["./canhan-list.component.scss"],
})
export class DmCanhanListComponent implements OnInit {
  // Viewchild template
  @ViewChild("gridCaNhan", { static: false }) public gridCaNhan: GridComponent;
  @ViewChild("aside", { static: true }) public matSidenav: MatSidenav;
  @ViewChild("compcanhanio", { read: ViewContainerRef, static: true }) public content: ViewContainerRef;

  // Chứa thuộc tính form
  public formSearch: FormGroup;

  // Chứa thiết lập grid
  public settingsCommon = new SettingsCommon();

  // Chứa danh sách item đã chọn
  public listDataSelect: any[];

  // Chứa danh sách Cá nhân
  public listCanhan: OutputDmCanhanModel[];

  // Chứa dữ liệu đã chọn
  public selectedItem: OutputDmCanhanModel;

  // Chứa danh sách dữ liệu
  public listData: any;

  // Chứa dữ liệu translate
  public dataTranslate: any;

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

  // Chứa trạng thái
  public trangthai = TrangThai;

  // Chứa menu item trên subheader
  public navArray = MenuDanhMucCaNhan;

  // disable delete button
  public disableDeleteButton = false;

  // disable active button
  public disableActiveButton = false;

  // disable unactive button
  public disableUnActiveButton = false;

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
    public formBuilder: FormBuilder,
    public generalClientService: GeneralClientService
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
    // Gọi hàm lấy dữ liệu cá nhân
    await this.getAllCanhan();
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
    this.getAllCanhan();
  }

  /**
   * Hàm lấy dữ liệu Cá nhân
   */
  async getAllCanhan(param: any = { PageNumber: 1, PageSize: -1 }) {
    if (this.listCanhan != null && this.listCanhan.length > 0) {
      this.gridCaNhan.clearSelection();
    }
    const listData: any = await this.dmFacadeService
      .getDmCanhanService()
      .getFetchAll(param);
    if (listData.items) {
      listData.items.map((canhan, index) => {
        canhan.serialNumber = index + 1;
      });
    }
    this.listCanhan = listData.items;
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
        .getFetchAll({ IdTinh: this.formSearch.value.Idtinh});
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
   * Tìm kiếm nâng cao
   */
  public searchAdvance() {
    let dataSearch = this.formSearch.value;
    dataSearch['PageNumber'] = Paging.PageNumber;
    dataSearch['PageSize'] = Paging.PageSize;
    this.getAllCanhan(dataSearch);
  }

  /**
   * Hàm lấy danh sách dữ liệu đã chọn trên grid
   */
  public getAllDataActive() {
    this.listDataSelect = this.gridCaNhan.getSelectedRecords();
    this.checkDisableButton();
  }

  /**
   * Hàm check disable button active, unactive, delete multi items
   */
  public checkDisableButton() {
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
    const dialogRef = this.commonService.confirmDeleteDiaLogService("", "", this.dataTranslate.DANHMUC.canhan.confirmedContentOfUnActiveDialog);
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === "confirm") {
        const dataParam: any = {
          listStatus: this.listDataSelect,
          status: TrangThaiEnum.NoActive
        };
        this.dmFacadeService.getDmCanhanService()
          .updateStatusArrayItem(dataParam)
          .subscribe(
            () => {
              this.getAllCanhan();
            },
            (error: HttpErrorResponse) => {
              this.commonService.showDialogWarning(error.error.errors);
            },
            () =>
              this.commonService.showeNotiResult(
                this.dataTranslate.COMMON.default.updateStatusSuccess,
                2000
              ));
      }
    });
  }

  /**
   * Hàm active mảng item đã chọn
   */
  public activeArrayItem() {
    const dialogRef = this.commonService.confirmDeleteDiaLogService("", "", this.dataTranslate.DANHMUC.canhan.confirmedContentOfActiveDialog);
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === "confirm") {
        const dataParam: any = {
          listStatus: this.listDataSelect,
          status: TrangThaiEnum.Active
        };
        this.dmFacadeService.getDmCanhanService()
          .updateStatusArrayItem(dataParam)
          .subscribe(
            () => {
              this.getAllCanhan();
            },
            (error: HttpErrorResponse) => {
              this.commonService.showDialogWarning(error.error.errors);
            },
            () =>
              this.commonService.showeNotiResult(
                this.dataTranslate.COMMON.default.updateStatusSuccess,
                2000
              ));
      }
    });
  }

  /**
   * Hàm delete mảng item đã chọn
   */
  public deleteArrayItem() {
    let idItems: string[] = [];
    const dialogRef = this.commonService.confirmDeleteDiaLogService("", this.dataTranslate.DANHMUC.canhan.confirmedContentOfDeleteDialog);
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === "confirm") {
        const data = this.generalClientService.findByKeyName<any>(this.listDataSelect, "trangthai", TrangThaiEnum.Active);

        if (data !== null) {
          const informationDialogRef = this.commonService.informationDiaLogService(
            "",
            this.dataTranslate.DANHMUC.canhan.nameofobject + " (" + data.hovaten + ") " + this.dataTranslate.DANHMUC.canhan.informedContentOfUnDeletedDialog,
            this.dataTranslate.DANHMUC.canhan.informedDialogTitle,
          );

          informationDialogRef.afterClosed().subscribe(() => { });
        } else {
          this.listDataSelect.map(res => {
            idItems.push(res.idcanhan);
          });
          const dataBody: any = {
            listId: idItems,
          };
          this.dmFacadeService.getDmCanhanService()
            .deleteArrayItem(dataBody)
            .subscribe(
              () => {
                this.getAllCanhan();
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
   * Hàm mở sidenav chức năng sửa dữ liệu
   * @param id
   */
  async editItemCanhan(id: any) {
    // Lấy dữ liệu cá nhân theo id
    const dataItem: any = await this.dmFacadeService
      .getDmCanhanService()
      .getByid(id).toPromise();
    await this.matSidenavService.setTitle(this.dataTranslate.DANHMUC.canhan.titleEdit);
    await this.matSidenavService.setContentComp(DmCanhanIoComponent, "edit", dataItem);
    await this.matSidenavService.open();
  }

  /**
   * Hàm mở sidenav chức năng thêm mới
   */
  public openCanhanIOSidenav() {
    this.matSidenavService.setTitle(this.dataTranslate.DANHMUC.canhan.titleAdd);
    this.matSidenavService.setContentComp(DmCanhanIoComponent, "new");
    this.matSidenavService.open();
  }

  /**
   * Hàm đóng sidenav
   */
  public closeCanhanIOSidenav() {
    this.matSidenavService.close();
  }


  /**
   *  Hàm xóa một bản ghi, được gọi khi nhấn nút xóa trên giao diện list
   */
  async deleteItemCanhan(data) {
    this.selectedItem = data;
    // Phải check xem dữ liệu muốn xóa có đang được dùng ko, đang dùng thì ko xóa
    // Trường hợp dữ liệu có thể xóa thì Phải hỏi người dùng xem có muốn xóa không
    // Nếu đồng ý xóa
    const canDelete: string = this.dmFacadeService
      .getDmCanhanService()
      .checkBeDeleted(this.selectedItem.idcanhan);
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
      this.dataTranslate.DANHMUC.canhan.contentDelete,
      this.selectedItem.hovaten
    );
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === "confirm") {
        const data = this.generalClientService.findByKeyName<any>([this.selectedItem], "trangthai", TrangThaiEnum.Active);

        if (data !== null) {
          const informationDialogRef = this.commonService.informationDiaLogService(
            "",
            this.dataTranslate.DANHMUC.canhan.nameofobject + " (" + data.hovaten + ") " + this.dataTranslate.DANHMUC.canhan.informedContentOfUnDeletedDialog,
            this.dataTranslate.DANHMUC.canhan.informedDialogTitle,
          );

          informationDialogRef.afterClosed().subscribe(() => { });
        } else {
          await this.dmFacadeService
            .getDmCanhanService()
            .deleteItem({ idCanhan: this.selectedItem.idcanhan })
            .subscribe(
              () => this.getAllCanhan(),
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
