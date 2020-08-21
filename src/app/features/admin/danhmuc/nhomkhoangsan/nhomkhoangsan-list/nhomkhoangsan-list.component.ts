import { Component, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";
import { MatSidenav } from "@angular/material";
import { HttpErrorResponse } from "@angular/common/http";
import { SettingsCommon, ThietLapHeThong } from "src/app/shared/constants/setting-common";
import { OutputDmNhomKhoangSanModel } from "src/app/models/admin/danhmuc/nhomkhoangsan.model";
import { MenuDanhMucNhomKhoangSan } from "src/app/shared/constants/sub-menus/danhmuc/danhmuc";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { DmFacadeService } from "src/app/services/admin/danhmuc/danhmuc-facade.service";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { ThietlapFacadeService } from "src/app/services/admin/thietlap/thietlap-facade.service";
import { DmNhomkhoangsanIoComponent } from "src/app/features/admin/danhmuc/nhomkhoangsan/nhomkhoangsan-io/nhomkhoangsan-io.component";
import {GeneralClientService} from "src/app/services/admin/common/general-client.service";
import {TrangThaiEnum} from "src/app/shared/constants/enum";
import { FormGroup, FormBuilder } from "@angular/forms";
import { GridComponent } from "@syncfusion/ej2-angular-grids";
import { TrangThai } from "src/app/shared/constants/trangthai-constants";

@Component({
  selector: 'app-nhomkhoangsan-list',
  templateUrl: './nhomkhoangsan-list.component.html',
  styleUrls: ['./nhomkhoangsan-list.component.scss']
})
export class DmNhomkhoangsanListComponent implements OnInit {

  // Viewchild template
  @ViewChild("gridNhomKhoanSan", { static: false }) public gridNhomKhoanSan: GridComponent;
  @ViewChild("aside", { static: true }) public matSidenav: MatSidenav;
  @ViewChild("compNhomKhoangSanIO", { read: ViewContainerRef, static: true }) public content: ViewContainerRef;

  // Chứa thiết lập grid
  public settingsCommon = new SettingsCommon();

  // Chứa thuộc tính form
  public formSearch: FormGroup;

  // Chứa danh sách item đã chọn
  public listDataSelect: any[];

  // Chứa danh sách Nhóm khoáng sản
  public listNhomKhoangSan: OutputDmNhomKhoangSanModel[];

  // Chứa dữ liệu đã chọn
  public selectedItem: OutputDmNhomKhoangSanModel;

  // Chứa dữ liệu translate
  public dataTranslate: any;

  // Chứa trạng thái
  public trangthai = TrangThai;

  // Chứa menu item trên subheader
  public navArray = MenuDanhMucNhomKhoangSan;

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
    // Gọi hàm lấy dữ liệu translate
    await this.getDataTranslate();
    // Khởi tạo sidenav
    this.matSidenavService.setSidenav( this.matSidenav, this, this.content, this.cfr );
    // Gọi hàm lấy dữ liệu pagesize
    await this.getDataPageSize();
    // Thiết lập hiển thị checkbox trên grid
    await this.setDisplayOfCheckBoxkOnGrid(true);
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
    // Gọi hàm lấy dữ liệu nhóm khoáng sản
    await this.getAllNhomKhoangSan();
  }

  /**
   * Hàm lấy dữ liệu Nhóm khoáng sản
   */
  async getAllNhomKhoangSan() {
    const searchModel = this.formSearch.value;
    searchModel.PageNumber = 1;
    searchModel.PageSize = -1;

    const listData: any = await this.dmFacadeService
      .getDmNhomKhoangSanService()
      .getFetchAll(searchModel);
    if (listData.items) {
      listData.items.map((nhomks, index) => {
        nhomks.serialNumber = index + 1;
      });
    }
    this.listNhomKhoangSan = listData.items;
  }

  /**
   * Hàm lấy danh sách dữ liệu đã chọn trên grid
   */
  public getAllDataActive() {
    this.listDataSelect = this.gridNhomKhoanSan.getSelectedRecords();

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
   * Hàm unActive mảng item đã chọn
   */
  public unActiveArrayItem() {
    const dialogRef = this.commonService.confirmDeleteDiaLogService("", "", this.dataTranslate.DANHMUC.nhomkhoangsan.confirmedContentOfUnActiveDialog);
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === "confirm") {

      }
    });
  }

  /**
   * Hàm active mảng item đã chọn
   */
  public activeArrayItem() {
    const dialogRef = this.commonService.confirmDeleteDiaLogService("", "", this.dataTranslate.DANHMUC.nhomkhoangsan.confirmedContentOfActiveDialog);
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
    const dialogRef = this.commonService.confirmDeleteDiaLogService("", this.dataTranslate.DANHMUC.nhomkhoangsan.confirmedContentOfDeleteDialog);
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === "confirm") {
        const data = this.generalClientService.findByKeyName<any>(this.listDataSelect, "trangthai", TrangThaiEnum.Active);

        if (data !== null) {
          const informationDialogRef = this.commonService.informationDiaLogService(
            "",
            this.dataTranslate.DANHMUC.linhvuc.nameofobject + " (" + data.tennhomkhoangsan + ") " + this.dataTranslate.DANHMUC.nhomkhoangsan.informedContentOfUnDeletedDialog,
            this.dataTranslate.DANHMUC.linhvuc.informedDialogTitle,
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
  async editItemNhomKhoangSan(id: string) {
    // Lấy dữ liệu nhóm khoáng sản theo id
    const dataItem: any = await this.dmFacadeService
    .getDmNhomKhoangSanService()
    .getByid(id).toPromise();
    await this.matSidenavService.setTitle( this.dataTranslate.DANHMUC.nhomkhoangsan.titleEdit );
    await this.matSidenavService.setContentComp( DmNhomkhoangsanIoComponent, "edit", dataItem);
    await this.matSidenavService.open();
  }

  /**
  * Hàm mở sidenav chức năng thêm mới
  */
  public openNhomKhoangSanIOSidenav() {
    this.matSidenavService.setTitle(this.dataTranslate.DANHMUC.nhomkhoangsan.titleAdd);
    this.matSidenavService.setContentComp( DmNhomkhoangsanIoComponent, "new");
    this.matSidenavService.open();
  }

  /**
  * Hàm đóng sidenav
  */
  public closeNhomKhoangSanIOSidenav() {
    this.matSidenavService.close();
  }


  /**
  *  Hàm xóa một bản ghi, được gọi khi nhấn nút xóa trên giao diện list
  */
  async deleteItemNhomKhoangSan(data) {
    this.selectedItem = data;
    // Phải check xem dữ liệu muốn xóa có đang được dùng ko, đang dùng thì ko xóa
    // Trường hợp dữ liệu có thể xóa thì Phải hỏi người dùng xem có muốn xóa không
    // Nếu đồng ý xóa
    const canDelete: string = this.dmFacadeService
      .getDmNhomKhoangSanService()
      .checkBeDeleted(+this.selectedItem.idnhomkhoangsan);
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
      this.dataTranslate.DANHMUC.nhomkhoangsan.contentDelete,
      this.selectedItem.tennhomkhoangsan
    );
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === "confirm") {
        await this.dmFacadeService
          .getDmNhomKhoangSanService()
          .deleteItem({ id: this.selectedItem.idnhomkhoangsan })
          .subscribe(
            () => this.getAllNhomKhoangSan(),
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
