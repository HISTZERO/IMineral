import { Component, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { MatSidenav } from "@angular/material";
import { TranslateService } from "@ngx-translate/core";
import { HttpErrorResponse } from "@angular/common/http";
import { FormGroup, FormBuilder } from "@angular/forms";
import { GridComponent } from "@syncfusion/ej2-angular-grids";

import { SettingsCommon, ThietLapHeThong } from "src/app/shared/constants/setting-common";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { DmFacadeService } from "src/app/services/admin/danhmuc/danhmuc-facade.service";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { ThietlapFacadeService } from "src/app/services/admin/thietlap/thietlap-facade.service";
import { DmCapquanlyIoComponent } from "src/app/features/admin/danhmuc/capquanly/capquanly-io/capquanly-io.component";
import { OutputDmCapQuanLyModel } from "src/app/models/admin/danhmuc/capquanly.model";
import { MenuDanhMucCapQuanLy } from "src/app/shared/constants/sub-menus/danhmuc/danhmuc";
import { GeneralClientService } from "src/app/services/admin/common/general-client.service";
import { TrangThaiEnum, Paging } from "src/app/shared/constants/enum";
import { TrangThai } from "src/app/shared/constants/trangthai-constants";

@Component({
  selector: 'app-capquanly-list',
  templateUrl: './capquanly-list.component.html',
  styleUrls: ['./capquanly-list.component.scss']
})
export class DmCapquanlyListComponent implements OnInit {

  // Viewchild template
  @ViewChild("gridCapQuanLy", { static: false }) public gridCapQuanLy: GridComponent;
  @ViewChild("aside", { static: true }) public matSidenav: MatSidenav;
  @ViewChild("compCapQuanlyIO", { read: ViewContainerRef, static: true }) public content: ViewContainerRef;

  // Chứa thiết lập grid
  public settingsCommon = new SettingsCommon();

  // Chứa thuộc tính form
  public formSearch: FormGroup;

  // Chứa danh sách Cấp quản lý
  public listCapQuanLy: OutputDmCapQuanLyModel[];

  // Chứa dữ liệu đã chọn 
  public selectedItem: OutputDmCapQuanLyModel;

  // Chứa dữ liệu translate
  public dataTranslate: any;

  // Chứa danh sách item đã chọn
  public listDataSelect: any[];

  //Chứa data Trạng thái
  public trangthai = TrangThai;

  // Chứa menu item trên subheader
  public navArray = MenuDanhMucCapQuanLy;

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
    public generalClientService: GeneralClientService,
    public formBuilder: FormBuilder
  ) { }

  async ngOnInit() {
    this.formInit();
    // Gọi hàm lấy dữ liệu translate
    await this.getDataTranslate();
    // Khởi tạo sidenav
    this.matSidenavService.setSidenav( this.matSidenav, this, this.content, this.cfr );
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
   * Form innit
   */
  public formInit() {
    this.formSearch = this.formBuilder.group({
      Keyword: [""],
      Trangthai: [""]
    });
  }

  /**
   * Hàm lấy dữ liệu pagesize số bản ghi hiển thị trên 1 trang
   */
  async getDataPageSize() {
    const pageSize: any = await this.thietlapFacadeService
    .getThietLapHeThongService()
    .getSettingKey({ key: ThietLapHeThong.defaultPageSize });
    if (pageSize) {
      this.settingsCommon.pageSettings.pageSize = +pageSize;
    } else {
      this.settingsCommon.pageSettings.pageSize = 10;
    }
    // Gọi hàm lấy dữ liệu cấp quản lý
    await this.getAllCapQuanLy();
  }

  /**
   * Hàm lấy dữ liệu Cấp quản lý
   */
  async getAllCapQuanLy(param: any = { PageNumber: 1, PageSize: -1 }) {
    const listData: any = await this.dmFacadeService
      .getDmCapQuanLyService()
      .getFetchAll(param);
    if (listData.items) {
      listData.items.map((capquanly, index) => {
        capquanly.serialNumber = index + 1;
      });
    }
    this.listCapQuanLy = listData.items;
  }

  /**
   * Hàm mở sidenav chức năng sửa dữ liệu
   * @param id
   */
  async editItemCapQuanLy(id: string) {
    // Lấy dữ liệu cấp quản lý theo id
    const dataItem: any = await this.dmFacadeService
    .getDmCapQuanLyService()
    .getByid(id).toPromise();
    await this.matSidenavService.setTitle( this.dataTranslate.DANHMUC.capquanly.titleEdit );
    await this.matSidenavService.setContentComp( DmCapquanlyIoComponent, "edit", dataItem);
    await this.matSidenavService.open();
  }

   /**
   * Tìm kiếm nâng cao
   */
  public searchAdvance() {
    let dataSearch = this.formSearch.value;
    dataSearch['PageNumber'] = Paging.PageNumber;
    dataSearch['PageSize'] = Paging.PageSize;
    this.getAllCapQuanLy(dataSearch);
  }

  /**
   * Hàm lấy danh sách dữ liệu đã chọn trên grid
   */
  public getAllDataActive() {
    this.listDataSelect = this.gridCapQuanLy.getSelectedRecords();

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
    const dialogRef = this.commonService.confirmDeleteDiaLogService("", "",  this.dataTranslate.DANHMUC.capquanly.confirmedContentOfUnActiveDialog);
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === "confirm") {

      }
    });
  }

  /**
   * Hàm active mảng item đã chọn
   */
  public activeArrayItem() {
    const dialogRef = this.commonService.confirmDeleteDiaLogService("", "", this.dataTranslate.DANHMUC.capquanly.confirmedContentOfActiveDialog);
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === "confirm") {
        if (this.listDataSelect.length === 0) {

        }
      }
    });
  }

  /**
   * Hàm delete mảng item đã chọn
   */
  public deleteArrayItem() {
    const dialogRef = this.commonService.confirmDeleteDiaLogService("", this.dataTranslate.DANHMUC.linhvuc.confirmedContentOfDeleteDialog);
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === "confirm") {
        const data = this.generalClientService.findByKeyName<any>(this.listDataSelect, "trangthai", TrangThaiEnum.Active);

        if (data !== null) {
          const informationDialogRef = this.commonService.informationDiaLogService(
            "",
            this.dataTranslate.DANHMUC.capquanly.nameofobject + " (" + data.tencapquanly + ") " + this.dataTranslate.DANHMUC.capquanly.informedContentOfUnDeletedDialog,
            this.dataTranslate.DANHMUC.capquanly.informedDialogTitle,
          );

          informationDialogRef.afterClosed().subscribe(() => {});
        }
      }
    });
  }


  /**
   * Hàm mở sidenav chức năng thêm mới
   */
  public openCapQuanLyIOSidenav() {
    this.matSidenavService.setTitle(this.dataTranslate.DANHMUC.capquanly.titleAdd);
    this.matSidenavService.setContentComp(DmCapquanlyIoComponent, "new");
    this.matSidenavService.open();
  }

  /**
   * Hàm đóng sidenav
   */
  public closeCapQuanLyIOSidenav() {
    this.matSidenavService.close();
  }


  /**
   *  Hàm xóa một bản ghi, được gọi khi nhấn nút xóa trên giao diện list
   */
  async deleteItemCapQuanLy(data) {
    this.selectedItem = data;
    // Phải check xem dữ liệu muốn xóa có đang được dùng ko, đang dùng thì ko xóa
    // Trường hợp dữ liệu có thể xóa thì Phải hỏi người dùng xem có muốn xóa không
    // Nếu đồng ý xóa
    const canDelete: string = this.dmFacadeService
      .getDmCapQuanLyService()
      .checkBeDeleted(+this.selectedItem.idcapquanly);
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
      this.dataTranslate.DANHMUC.capquanly.contentDelete,
      this.selectedItem.tencapquanly
    );
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === "confirm") {
        await this.dmFacadeService
          .getDmCapQuanLyService()
          .deleteItem({ idCapquanly: this.selectedItem.idcapquanly })
          .subscribe(
            () => this.getAllCapQuanLy(),
            (error: HttpErrorResponse) => {
              this.commonService.showeNotiResult(error.message, 2000);
            },
            () =>
              this.commonService.showeNotiResult(
                this.dataTranslate.COMMON.default.successDelete,
                2000
              )
          );
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
