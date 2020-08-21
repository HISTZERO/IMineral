import { Component, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { MatSidenav } from "@angular/material";
import { HttpErrorResponse } from "@angular/common/http";
import { TranslateService } from "@ngx-translate/core";
import { SettingsCommon, ThietLapHeThong } from "src/app/shared/constants/setting-common";
import { OutputDmThuTucHanhChinhModel } from "src/app/models/admin/danhmuc/thutuchanhchinh.model";
import { MenuDanhMucThuTucHanhChinh } from "src/app/shared/constants/sub-menus/danhmuc/danhmuc";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { DmFacadeService } from "src/app/services/admin/danhmuc/danhmuc-facade.service";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { ThietlapFacadeService } from "src/app/services/admin/thietlap/thietlap-facade.service";
import { DmThutuchanhchinhIoComponent } from "src/app/features/admin/danhmuc/thutuchanhchinh/thutuchanhchinh-io/thutuchanhchinh-io.component";
import {GeneralClientService} from "src/app/services/admin/common/general-client.service";
import {TrangThaiEnum} from "src/app/shared/constants/enum";
import { FormGroup, FormBuilder } from "@angular/forms";
import { GridComponent } from "@syncfusion/ej2-angular-grids";
import { TrangThai } from "src/app/shared/constants/trangthai-constants";
import { OutputDmLinhvucModel } from "src/app/models/admin/danhmuc/linhvuc.model";
import { OutputDmCapQuanLyModel } from 'src/app/models/admin/danhmuc/capquanly.model';

@Component({
  selector: 'app-thutuchanhchinh-list',
  templateUrl: './thutuchanhchinh-list.component.html',
  styleUrls: ['./thutuchanhchinh-list.component.scss']
})
export class DmThutuchanhchinhListComponent implements OnInit {

  // Viewchild template
  @ViewChild("gridThuTucHanhChinh", { static: false }) public gridThuTucHanhChinh: GridComponent;
  @ViewChild("aside", { static: true }) public matSidenav: MatSidenav;
  @ViewChild("compThuTucHanhChinhIO", { read: ViewContainerRef, static: true }) public content: ViewContainerRef;

  // Chứa thuộc tính form
  public formSearch: FormGroup;

  // Chứa thiết lập grid
  public settingsCommon = new SettingsCommon();

   // Chứa danh sách item đã chọn
   public listDataSelect: any[];

  // Chứa danh sách Thủ tục hành chính
  public listThuTucHanhChinh: OutputDmThuTucHanhChinhModel[];

  // Chứa dữ liệu đã chọn
  public selectedItem: OutputDmThuTucHanhChinhModel;

  // Chứa dữ liệu translate
  public dataTranslate: any;

  // Chứa menu item trên subheader
  public navArray = MenuDanhMucThuTucHanhChinh;

  // Chứa trạng thái
  public trangthai = TrangThai;

  // Chứa menu item trên subheader

  // disable delete button
  public disableDeleteButton = false;

  // disable active button
  public disableActiveButton = false;

  // disable unactive button
  public disableUnActiveButton = false;

  // Chứa danh sách Lĩnh Vực
  public allLinhVuc: OutputDmLinhvucModel;

   // Filter Lĩnh Vực
  public linhVucFilters: OutputDmLinhvucModel[];

  // Chứa danh sách cấp quản lý
  public allCapQuanLy: OutputDmCapQuanLyModel;

   // Filter cấp quản lý
  public capQuanLyFilters: OutputDmCapQuanLyModel[];

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
    // Gọi hàm lấy dữ liệu Lĩnh Vực
    await this.getLinhVuc();
    // Gọi hàm lấy dữ liệu cấp quản lý
    await this.getCapQuanLy();
    // Gọi hàm lấy dữ liệu translate
    await this.getDataTranslate();
    // Khởi tạo sidenav
    this.matSidenavService.setSidenav( this.matSidenav, this, this.content, this.cfr );
    // Gọi hàm lấy dữ liệu pagesize
    await this.getDataPageSize();
    // Gọi hàm thiêt lập hiển thị nút check box trên Grid
    await this.setDisplayOfCheckBoxkOnGrid(true);
  }

  /**
   * Form innit
   */
  public formInit() {
    this.formSearch = this.formBuilder.group({
      Capthuchien: [""],
      Linhvuc: [""],
      Keyword: [""],
      Trangthai: [""]
    });
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
    const pageSize: any = await this.thietlapFacadeService
    .getThietLapHeThongService()
    .getSettingKey({ key: ThietLapHeThong.defaultPageSize });
    if (pageSize) {
      this.settingsCommon.pageSettings.pageSize = +pageSize;
    } else {
      this.settingsCommon.pageSettings.pageSize = 10;
    }
    // Gọi hàm lấy dữ liệu thử tục hành chính
    await this.getAllThuTucHanhChinh();
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
   * Hàm lấy danh sách Lĩnh Vực
   */
  async getLinhVuc() {
    const allLinhVucData: any = await this.dmFacadeService
      .getDmLinhvucService()
      .getFetchAll({ PageNumber: 1, PageSize: -1 });
    this.allLinhVuc = allLinhVucData.items;
    this.linhVucFilters = allLinhVucData.items;
  }

  /**
   * Hàm lấy danh sách cấp quản lý
   */
  async getCapQuanLy() {
    const allCapQuanLyData: any = await this.dmFacadeService
      .getDmCapQuanLyService()
      .getFetchAll({ PageNumber: 1, PageSize: -1 });
    this.allCapQuanLy = allCapQuanLyData.items;
    this.capQuanLyFilters = allCapQuanLyData.items;
  }

  /**
   * Hàm lấy dữ liệu Thủ tục hành chính
   */
  async getAllThuTucHanhChinh() {
    const listData: any = await this.dmFacadeService
      .getDmThuTucHanhChinhService()
      .getFetchAll({ PageNumber: 1, PageSize: -1 });
    if (listData.items) {
      listData.items.map((thutucHC, index) => {
        thutucHC.serialNumber = index + 1;
      });
    }
    this.listThuTucHanhChinh = listData.items;
  }

  /**
   * Hàm lấy danh sách dữ liệu đã chọn trên grid
   */
  public getAllDataActive() {
    this.listDataSelect = this.gridThuTucHanhChinh.getSelectedRecords();

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
    const dialogRef = this.commonService.confirmDeleteDiaLogService("", "", this.dataTranslate.DANHMUC.thutuchanhchinh.confirmedContentOfUnActiveDialog);
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === "confirm") {

      }
    });
  }

  /**
   * Hàm active mảng item đã chọn
   */
  public activeArrayItem() {
    const dialogRef = this.commonService.confirmDeleteDiaLogService("", "", this.dataTranslate.DANHMUC.thutuchanhchinh.confirmedContentOfActiveDialog);
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
    const dialogRef = this.commonService.confirmDeleteDiaLogService("", this.dataTranslate.DANHMUC.thutuchanhchinh.confirmedContentOfDeleteDialog);
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === "confirm") {
        const data = this.generalClientService.findByKeyName<any>(this.listDataSelect, "trangthai", TrangThaiEnum.Active);

        if (data !== null) {
          const informationDialogRef = this.commonService.informationDiaLogService(
            "",
            this.dataTranslate.DANHMUC.thutuchanhchinh.nameofobject + " (" + data.tenlinhvuc + ") " + this.dataTranslate.DANHMUC.thutuchanhchinh.informedContentOfUnDeletedDialog,
            this.dataTranslate.DANHMUC.thutuchanhchinh.informedDialogTitle,
          );

          informationDialogRef.afterClosed().subscribe(() => {});
        }
      }
    });
  }

  /**
   * Hàm mở sidenav chức năng sửa dữ liệu
   * @param id
   */
  async editItemThuTucHanhChinh(id: string) {
    // Lấy dữ liệu nhóm khoáng sản theo id
    const dataItem: any = await this.dmFacadeService
    .getDmThuTucHanhChinhService()
    .getByid(id).toPromise();
    await this.matSidenavService.setTitle( this.dataTranslate.DANHMUC.thutuchanhchinh.titleEdit );
    await this.matSidenavService.setContentComp( DmThutuchanhchinhIoComponent, "edit", dataItem);
    await this.matSidenavService.open();
  }

  /**
   * Hàm mở sidenav chức năng thêm mới
   */
  public openThuTucHanhChinhIOSidenav() {
    this.matSidenavService.setTitle(this.dataTranslate.DANHMUC.thutuchanhchinh.titleAdd);
    this.matSidenavService.setContentComp( DmThutuchanhchinhIoComponent, "new");
    this.matSidenavService.open();
  }

  /**
   * Hàm đóng sidenav
   */
  public closeThuTucHanhChinhIOSidenav() {
    this.matSidenavService.close();
  }


  /**
   *  Hàm xóa một bản ghi, được gọi khi nhấn nút xóa trên giao diện list
   */
  async deleteItemThuTucHanhChinh(data) {
    this.selectedItem = data;
    // Phải check xem dữ liệu muốn xóa có đang được dùng ko, đang dùng thì ko xóa
    // Trường hợp dữ liệu có thể xóa thì Phải hỏi người dùng xem có muốn xóa không
    // Nếu đồng ý xóa
    const canDelete: string = this.dmFacadeService
      .getDmThuTucHanhChinhService()
      .checkBeDeleted(+this.selectedItem.idthutuchanhchinh);
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
      this.dataTranslate.DANHMUC.thutuchanhchinh.contentDelete,
      this.selectedItem.tenthutuc
    );
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === "confirm") {
        await this.dmFacadeService
          .getDmThuTucHanhChinhService()
          .deleteItem({ id: this.selectedItem.idthutuchanhchinh })
          .subscribe(
            () => this.getAllThuTucHanhChinh(),
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
