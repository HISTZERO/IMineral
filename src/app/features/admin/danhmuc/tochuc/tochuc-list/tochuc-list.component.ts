import { Component, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { MatSidenav, MatDialog } from "@angular/material";
import { TranslateService } from "@ngx-translate/core";
import { HttpErrorResponse } from "@angular/common/http";
import { FormGroup, FormBuilder } from "@angular/forms";
import { GridComponent } from "@syncfusion/ej2-angular-grids";

import { SettingsCommon, ThietLapHeThong } from "src/app/shared/constants/setting-common";
import { OutputDmToChucModel } from "src/app/models/admin/danhmuc/tochuc.model";
import { MenuDanhMucToChuc } from "src/app/shared/constants/sub-menus/danhmuc/danhmuc";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { DmFacadeService } from "src/app/services/admin/danhmuc/danhmuc-facade.service";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { ThietlapFacadeService } from "src/app/services/admin/thietlap/thietlap-facade.service";
import { DmTochucIoComponent } from "src/app/features/admin/danhmuc/tochuc/tochuc-io/tochuc-io.component";
import { GeneralClientService } from "src/app/services/admin/common/general-client.service";
import { TrangThaiEnum } from "src/app/shared/constants/enum";
import { TrangThai } from "src/app/shared/constants/trangthai-constants";
import { OutputDmDvhcModel } from "src/app/models/admin/danhmuc/dvhc.model";


@Component({
  selector: 'app-tochuc-list',
  templateUrl: './tochuc-list.component.html',
  styleUrls: ['./tochuc-list.component.scss']
})
export class DmTochucListComponent implements OnInit {

  // Viewchild template
  @ViewChild("gridToChuc", { static: false }) public gridToChuc: GridComponent;
  @ViewChild("aside", { static: true }) public matSidenav: MatSidenav;
  @ViewChild("compToChucIO", { read: ViewContainerRef, static: true }) public content: ViewContainerRef;
  // Chứa thuộc tính form
  public formSearch: FormGroup;
  // Chứa thiết lập grid
  public settingsCommon = new SettingsCommon();

  // Chứa danh sách item đã chọn
  public listDataSelect: any[];

  // Chứa danh sách Tổ chức
  public listToChuc: OutputDmToChucModel[];

  // Chứa dữ liệu đã chọn
  public selectedItem: OutputDmToChucModel;

  // Chứa danh sách dữ liệu
  public listData: any;

  // Chứa danh sách Dvhc Tỉnh
  public allTinh: any;

  // Chứa danh sách Dvhc Huyện
  public allHuyen: any;

  // Chứa danh sách Dvhc Xã
  public allXa: any;

  // Chứa dữ liệu translate
  public dataTranslate: any;

  // Filter Đơn vị hành chính Tỉnh
  public dvhcProvinceFilters: OutputDmDvhcModel[];

  // Filter Đơn vị hành chính Huyện
  public dvhcDistrictFilters: OutputDmDvhcModel[];

  // Filter Đơn vị hành chính Xã
  public dvhcWardFilters: OutputDmDvhcModel[];

  // Chứa trạng thái
  public trangthai = TrangThai;

  // Chứa menu item trên subheader
  public navArray = MenuDanhMucToChuc;

  // disable delete button
  public disableDeleteButton = false;

  // disable active button
  public disableActiveButton = false;

  // disable unactive button
  public disableUnActiveButton = false;

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
    await this.showDvhcTinh();
    // Gọi hàm lấy dữ liệu translate
    await this.getDataTranslate();
    // Khởi tạo sidenav
    this.matSidenavService.setSidenav(this.matSidenav, this, this.content, this.cfr);
    // Gọi hàm lấy dữ liệu pagesize
    await this.getDataPageSize();
    // Gọi hàm thiêt lập hiển thị nút check box trên Grid
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
      this.settingsCommon.pageSettings.pageSize = +dataSetting.settingValue;
    } else {
      this.settingsCommon.pageSettings.pageSize = 10;
    }
    // Gọi hàm lấy dữ liệu Tổ chức
    await this.getAllToChuc();
  }

  /**
   * Hàm lấy dữ liệu Tổ chức
   */
  async getAllToChuc() {
    if (this.listToChuc != null && this.listToChuc.length > 0) {
      this.gridToChuc.clearSelection();
    }

    const searchModel = this.formSearch.value;
    searchModel.PageNumber = 1;
    searchModel.PageSize = -1;

    const listData: any = await this.dmFacadeService
      .getDmToChucService()
      .getFetchAll(searchModel);
    if (listData.items) {
      listData.items.map((tochuc, index) => {
        tochuc.serialNumber = index + 1;
      });
    }
    this.listToChuc = listData.items;
  }

  /**
   * Hàm load lại dữ liệu grid
   */
  public reloadDataGrid() {
    this.formSearch.reset({ Keyword: "", Idtinh: "", Idhuyen: "", Idxa: "", Trangthai: "" });
    this.getAllToChuc();
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
      .getFetchAll();
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
    }
    if (!this.formSearch.value.Idtinh === false) {
      this.allXa = [];
      this.dvhcWardFilters = [];
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
    }
    if (
      !this.formSearch.value.Idtinh === false &&
      !this.formSearch.value.Idhuyen === false
    ) {
      this.allXa = await this.dmFacadeService
        .getWardService()
        .getFetchAll({ IdHuyen: this.formSearch.value.Idhuyen });
      this.dvhcWardFilters = this.allXa;
    }
  }


  /**
   * Hàm lấy danh sách dữ liệu đã chọn trên grid
   */
  public getAllDataActive() {
    this.listDataSelect = this.gridToChuc.getSelectedRecords();

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
    const dialogRef = this.commonService.confirmDeleteDiaLogService("", "", this.dataTranslate.DANHMUC.tochuc.confirmedContentOfUnActiveDialog);
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === "confirm") {
        const dataParam: any = {
          listStatus: this.listDataSelect,
          status: TrangThaiEnum.NoActive
        };
        this.dmFacadeService.getDmToChucService().updateStatusArrayItem(dataParam)
          .subscribe(res => {
            this.getAllToChuc();
          }, (error: HttpErrorResponse) => {
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
    const dialogRef = this.commonService.confirmDeleteDiaLogService("", "", this.dataTranslate.DANHMUC.tochuc.confirmedContentOfActiveDialog);
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === "confirm") {
        const dataParam: any = {
          listStatus: this.listDataSelect,
          status: TrangThaiEnum.Active
        };
        this.dmFacadeService.getDmToChucService().updateStatusArrayItem(dataParam)
          .subscribe(res => {
            this.getAllToChuc();
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
    const idItems: string[] = [];
    const dialogRef = this.commonService.confirmDeleteDiaLogService("", this.dataTranslate.DANHMUC.tochuc.confirmedContentOfDeleteDialog);
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === "confirm") {
        const data = this.generalClientService.findByKeyName<any>(this.listDataSelect, "trangthai", TrangThaiEnum.Active);

        if (data !== null) {
          const informationDialogRef = this.commonService.informationDiaLogService(
            "",
            this.dataTranslate.DANHMUC.tochuc.nameofobject + " (" + data.tentochuc + ") " + this.dataTranslate.DANHMUC.tochuc.informedContentOfUnDeletedDialog,
            this.dataTranslate.DANHMUC.tochuc.informedDialogTitle,
          );

          informationDialogRef.afterClosed().subscribe(() => { });
        } else {
          this.listDataSelect.map(res => {
            idItems.push(res.idtochuc);
          });

          const dataBody: any = {
            listId: idItems,
          };

          this.dmFacadeService.getDmToChucService()
            .deleteItemsToChuc(dataBody)
            .subscribe(
              () => {
                this.getAllToChuc();
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
  async editItemToChuc(id: string) {
    // Lấy dữ liệu tổ chức theo id
    const dataItem: any = await this.dmFacadeService
      .getDmToChucService()
      .getByid(id).toPromise();
    await this.matSidenavService.setTitle(this.dataTranslate.DANHMUC.tochuc.titleEdit);
    await this.matSidenavService.setContentComp(DmTochucIoComponent, "edit", dataItem);
    await this.matSidenavService.open();
  }

  /**
   * Hàm mở sidenav chức năng thêm mới
   */
  public openToChucIOSidenav() {
    this.matSidenavService.setTitle(this.dataTranslate.DANHMUC.tochuc.titleAdd);
    this.matSidenavService.setContentComp(DmTochucIoComponent, "new");
    this.matSidenavService.open();
  }

  /**
   * Hàm đóng sidenav
   */
  public closeToChucIOSidenav() {
    this.matSidenavService.close();
  }


  /**
   *  Hàm xóa một bản ghi, được gọi khi nhấn nút xóa trên giao diện list
   */
  async deleteItemToChuc(data) {
    this.selectedItem = data;
    // Phải check xem dữ liệu muốn xóa có đang được dùng ko, đang dùng thì ko xóa
    // Trường hợp dữ liệu có thể xóa thì Phải hỏi người dùng xem có muốn xóa không
    // Nếu đồng ý xóa
    const canDelete: string = this.dmFacadeService
      .getDmToChucService()
      .checkBeDeleted(+this.selectedItem.idtochuc);
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
      this.dataTranslate.DANHMUC.tochuc.contentDelete,
      this.selectedItem.tentochuc
    );
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === "confirm") {
        const data = this.generalClientService.findByKeyName<any>(this.listDataSelect, "trangthai", TrangThaiEnum.Active);

        if (data !== null) {
          const informationDialogRef = this.commonService.informationDiaLogService(
            "",
            this.dataTranslate.DANHMUC.tochuc.nameofobject + " (" + data.tentochuc + ") " + this.dataTranslate.DANHMUC.tochuc.informedContentOfUnDeletedDialog,
            this.dataTranslate.DANHMUC.tochuc.informedDialogTitle,
          );

          informationDialogRef.afterClosed().subscribe(() => { });
        } else {
          await this.dmFacadeService
            .getDmToChucService()
            .deleteItem({ id: this.selectedItem.idtochuc })
            .subscribe(
              () => this.getAllToChuc(),
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
