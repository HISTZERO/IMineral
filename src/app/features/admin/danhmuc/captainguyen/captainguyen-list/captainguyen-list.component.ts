import { Component, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { MatSidenav, MatDialog } from "@angular/material";
import { TranslateService } from "@ngx-translate/core";
import { HttpErrorResponse } from "@angular/common/http";
import { GridComponent, TextWrapSettingsModel } from "@syncfusion/ej2-angular-grids";
import { FormGroup, FormBuilder } from "@angular/forms";

import { SettingsCommon, ThietLapHeThong } from "src/app/shared/constants/setting-common";
import { OutputDmCapTaiNguyenModel } from "src/app/models/admin/danhmuc/captainguyen.model";
import { MenuDanhMucCapTaiNguyen } from "src/app/shared/constants/sub-menus/danhmuc/danhmuc";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { DmFacadeService } from "src/app/services/admin/danhmuc/danhmuc-facade.service";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { ThietlapFacadeService } from "src/app/services/admin/thietlap/thietlap-facade.service";
import { DmCaptainguyenIoComponent } from "src/app/features/admin/danhmuc/captainguyen/captainguyen-io/captainguyen-io.component";
import { NhomCapTaiNguyen } from "src/app/shared/constants/common-constants";
import { TrangThai } from "src/app/shared/constants/trangthai-constants";
import { GeneralClientService } from "src/app/services/admin/common/general-client.service";
import { TrangThaiEnum, Paging } from "src/app/shared/constants/enum";
import { MyAlertDialogComponent } from "src/app/shared/components/my-alert-dialog/my-alert-dialog.component";

@Component({
  selector: 'app-captainguyen-list',
  templateUrl: './captainguyen-list.component.html',
  styleUrls: ['./captainguyen-list.component.scss']
})
export class DmCaptainguyenListComponent implements OnInit {

  // Viewchild template
  @ViewChild("gridCapTaiNguyen", { static: false }) public gridCapTaiNguyen: GridComponent;
  @ViewChild("aside", { static: true }) public matSidenav: MatSidenav;
  @ViewChild("compCapTaiNguyenIO", { read: ViewContainerRef, static: true }) public content: ViewContainerRef;

  // Chứa thiết lập grid
  public settingsCommon = new SettingsCommon();

  // Chứa danh sách Cấp tài nguyên
  public listCapTaiNguyen: OutputDmCapTaiNguyenModel[];

  // Chứa dữ liệu đã chọn 
  public selectedItem: OutputDmCapTaiNguyenModel;

  // Chứa danh sách dữ liệu
  public listData: any;

  // Chứa dữ liệu translate
  public dataTranslate: any;

  // Chứa menu item trên subheader
  public navArray = MenuDanhMucCapTaiNguyen;

  // Chứa nhóm cấp tài nguyên
  public nhomCapTainguyen = NhomCapTaiNguyen;

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
    public formBuilder: FormBuilder,
    public modalDialog: MatDialog
  ) { }

  async ngOnInit() {
    // Khởi tạo form
    this.formInit();
    this.setDisplayOfCheckBoxkOnGrid(true);
    // Gọi hàm lấy dữ liệu translate
    await this.getDataTranslate();
    // Setting wrap mode
    this.wrapSettings = { wrapMode: 'Both' };
    // Khởi tạo sidenav
    this.matSidenavService.setSidenav(this.matSidenav, this, this.content, this.cfr);
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
      this.settingsCommon.pageSettings.pageSize = dataSetting.settingValue;
    } else {
      this.settingsCommon.pageSettings.pageSize = 10;
    }
    // Gọi hàm lấy dữ liệu cấp tài nguyên
    await this.getAllCapTaiNguyen();
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
      Nhomcaptainguyen: [""],
      Trangthai: [""]
    });
  }

  /**
   * Hàm load lại dữ liệu và reset form tìm kiếm
   */
  public reloadDataGrid() {
    this.formSearch.reset({
      Keyword: "",
      Nhomcaptainguyen: "",
      Trangthai: ""
    });
    this.getAllCapTaiNguyen();
  }

  /**
   * Hàm lấy dữ liệu Cấp tài nguyên
   */
  async getAllCapTaiNguyen(param: any = { PageNumber: 1, PageSize: -1 }) {
    if (this.listCapTaiNguyen != null && this.listCapTaiNguyen.length > 0) {
      this.gridCapTaiNguyen.clearSelection();
    }
    const listData: any = await this.dmFacadeService
      .getDmCapTaiNguyenService()
      .getFetchAll(param);
    if (listData.items) {
      listData.items.map((captainguyen, index) => {
        captainguyen.serialNumber = index + 1;
      });
    }
    this.listCapTaiNguyen = listData.items;
  }

  /**
  * Tìm kiếm nâng cao
  */
  public searchAdvance() {
    let dataSearch = this.formSearch.value;
    dataSearch['PageNumber'] = Paging.PageNumber;
    dataSearch['PageSize'] = Paging.PageSize;
    this.getAllCapTaiNguyen(dataSearch);
  }

  /**
   * Hàm lấy danh sách dữ liệu đã chọn trên grid
   */
  public getAllDataActive() {
    this.listDataSelect = this.gridCapTaiNguyen.getSelectedRecords();

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
    const dialogRef = this.commonService.confirmDeleteDiaLogService("", "", this.dataTranslate.DANHMUC.captainguyen.confirmedContentOfUnActiveDialog);
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === "confirm") {
        const dataParam: any = {
          listStatus: this.listDataSelect,
          status: TrangThaiEnum.NoActive
        };
        this.dmFacadeService.getDmCapTaiNguyenService()
          .updateStatusItemsCapTaiNguyen(dataParam)
          .subscribe(
            () => {
              this.getAllCapTaiNguyen();
            },
            (error: HttpErrorResponse) => {
              this.showDialogWarning(error.error.errors);
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
    const dialogRef = this.commonService.confirmDeleteDiaLogService("", "", this.dataTranslate.DANHMUC.captainguyen.confirmedContentOfActiveDialog);
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === "confirm") {
        const dataParam: any = {
          listStatus: this.listDataSelect,
          status: TrangThaiEnum.Active
        };
        this.dmFacadeService.getDmCapTaiNguyenService()
          .updateStatusItemsCapTaiNguyen(dataParam)
          .subscribe(
            () => {
              this.getAllCapTaiNguyen();
            },
            (error: HttpErrorResponse) => {
              this.showDialogWarning(error.error.errors);
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
    const dialogRef = this.commonService.confirmDeleteDiaLogService("", this.dataTranslate.DANHMUC.linhvuc.confirmedContentOfDeleteDialog);
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === "confirm") {
        const data = this.generalClientService.findByKeyName<any>(this.listDataSelect, "trangthai", TrangThaiEnum.Active);

        if (data !== null) {
          const informationDialogRef = this.commonService.informationDiaLogService(
            "",
            this.dataTranslate.DANHMUC.captainguyen.nameofobject + " (" + data.tencaptainguyen + ") " + this.dataTranslate.DANHMUC.captainguyen.informedContentOfUnDeletedDialog,
            this.dataTranslate.DANHMUC.captainguyen.informedDialogTitle,
          );
        } else {
          this.listDataSelect.map(res => {
            idItems.push(res.idcaptainguyen);
          });

          const dataBody: any = {
            listId: idItems,
          };

          this.dmFacadeService.getDmCapTaiNguyenService()
            .deleteItemsCapTaiNguyen(dataBody)
            .subscribe(
              () => {
                this.getAllCapTaiNguyen();
              },
              (error: HttpErrorResponse) => {
                this.showDialogWarning(error.error.errors);
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
  async editItemCapTaiNguyen(id: string) {
    // Lấy dữ liệu cấp tài nguyên theo id
    const dataItem: any = await this.dmFacadeService
      .getDmCapTaiNguyenService()
      .getByid(id).toPromise();
    await this.matSidenavService.setTitle(this.dataTranslate.DANHMUC.captainguyen.titleEdit);
    await this.matSidenavService.setContentComp(DmCaptainguyenIoComponent, "edit", dataItem);
    await this.matSidenavService.open();
  }

  /**
   * Hàm mở sidenav chức năng thêm mới
   */
  public openCapTaiNguyenIOSidenav() {
    this.matSidenavService.setTitle(this.dataTranslate.DANHMUC.captainguyen.titleAdd);
    this.matSidenavService.setContentComp(DmCaptainguyenIoComponent, "new");
    this.matSidenavService.open();
  }

  /**
   * Hàm đóng sidenav
   */
  public closeCapTaiNguyenIOSidenav() {
    this.matSidenavService.close();
  }


  /**
   *  Hàm xóa một bản ghi, được gọi khi nhấn nút xóa trên giao diện list
   */
  async deleteItemCapTaiNguyen(data) {
    this.selectedItem = data;
    // Phải check xem dữ liệu muốn xóa có đang được dùng ko, đang dùng thì ko xóa
    // Trường hợp dữ liệu có thể xóa thì Phải hỏi người dùng xem có muốn xóa không
    // Nếu đồng ý xóa
    const canDelete: string = this.dmFacadeService
      .getDmCapTaiNguyenService()
      .checkBeDeleted(+this.selectedItem.idcaptainguyen);
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
      this.dataTranslate.DANHMUC.captainguyen.contentDelete,
      this.selectedItem.tencaptainguyen
    );
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === "confirm") {
        const data = this.generalClientService.findByKeyName<any>([this.selectedItem], "trangthai", TrangThaiEnum.Active);

        if (data !== null) {
          const informationDialogRef = this.commonService.informationDiaLogService(
            "",
            this.dataTranslate.DANHMUC.captainguyen.nameofobject + " (" + data.tencaptainguyen + ") " + this.dataTranslate.DANHMUC.captainguyen.informedContentOfUnDeletedDialog,
            this.dataTranslate.DANHMUC.captainguyen.informedDialogTitle,
          );
        } else {
          await this.dmFacadeService
            .getDmCapTaiNguyenService()
            .deleteItem({ idCaptainguyen: this.selectedItem.idcaptainguyen })
            .subscribe(
              () => this.getAllCapTaiNguyen(),
              (error: HttpErrorResponse) => {
                this.showDialogWarning(error.error.errors);
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
   * Hàm hiển thị cảnh báo error
   */
  public showDialogWarning(error: any) {
    const dialog = this.modalDialog.open(MyAlertDialogComponent);
    dialog.componentInstance.header = this.dataTranslate.COMMON.default.warnings;
    dialog.componentInstance.content =
      "<b>" + error + "</b>";
    dialog.componentInstance.visibleOkButton = false;
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
