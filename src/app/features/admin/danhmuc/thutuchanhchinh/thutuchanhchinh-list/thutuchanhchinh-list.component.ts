import { Component, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { MatSidenav } from "@angular/material";
import { HttpErrorResponse } from "@angular/common/http";
import { TranslateService } from "@ngx-translate/core";

import { SettingsCommon, ThietLapHeThong } from "src/app/shared/constants/setting-common";
import { OutputThuTucHanhChinhModel } from "src/app/models/admin/danhmuc/thutuchanhchinh.model";
import { MenuDanhMucThuTucHanhChinh } from "src/app/shared/constants/sub-menus/danhmuc/danhmuc";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { DmFacadeService } from "src/app/services/admin/danhmuc/danhmuc-facade.service";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { ThietlapFacadeService } from "src/app/services/admin/thietlap/thietlap-facade.service";
import { ThutuchanhchinhIoComponent } from "src/app/features/admin/danhmuc/thutuchanhchinh/thutuchanhchinh-io/thutuchanhchinh-io.component";

@Component({
  selector: 'app-thutuchanhchinh-list',
  templateUrl: './thutuchanhchinh-list.component.html',
  styleUrls: ['./thutuchanhchinh-list.component.scss']
})
export class ThutuchanhchinhListComponent implements OnInit {

  // Viewchild template
  @ViewChild("aside", { static: true }) public matSidenav: MatSidenav;
  @ViewChild("compThuTucHanhChinhIO", { read: ViewContainerRef, static: true }) public content: ViewContainerRef;

  // Chứa thiết lập grid
  public settingsCommon = new SettingsCommon();

  // Chứa danh sách Thủ tục hành chính
  public listThuTucHanhChinh: OutputThuTucHanhChinhModel[];

  // Chứa dữ liệu đã chọn 
  public selectedItem: OutputThuTucHanhChinhModel;

  // Chứa dữ liệu translate
  public dataTranslate: any;

  // Chứa menu item trên subheader
  public navArray = MenuDanhMucThuTucHanhChinh;

  // Contructor
  constructor(
    public matSidenavService: MatsidenavService,
    public cfr: ComponentFactoryResolver,
    public dmFacadeService: DmFacadeService,
    public commonService: CommonServiceShared,
    public thietlapFacadeService: ThietlapFacadeService,
    private translate: TranslateService
  ) { }

  async ngOnInit() {
    // Gọi hàm lấy dữ liệu translate
    await this.getDataTranslate();
    // Khởi tạo sidenav
    this.matSidenavService.setSidenav( this.matSidenav, this, this.content, this.cfr );
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
   * Hàm lấy dữ liệu Thủ tục hành chính
   */
  async getAllThuTucHanhChinh() {
    const listData: any = await this.dmFacadeService
      .getThuTucHanhChinhService()
      .getFetchAll({ PageNumber: 1, PageSize: -1 });
    if (listData.items) {
      listData.items.map((thutucHC, index) => {
        thutucHC.serialNumber = index + 1;
      });
    }
    this.listThuTucHanhChinh = listData.items;
  }

  /**
   * Hàm mở sidenav chức năng sửa dữ liệu
   * @param id
   */
  async editItemThuTucHanhChinh(id: string) {
    // Lấy dữ liệu nhóm khoáng sản theo id
    const dataItem: any = await this.dmFacadeService
    .getThuTucHanhChinhService()
    .getByid(id).toPromise();
    await this.matSidenavService.setTitle( this.dataTranslate.DANHMUC.thutuchanhchinh.titleEdit );
    await this.matSidenavService.setContentComp( ThutuchanhchinhIoComponent, "edit", dataItem);
    await this.matSidenavService.open();
  }

  /**
   * Hàm mở sidenav chức năng thêm mới
   */
  public openThuTucHanhChinhIOSidenav() {
    this.matSidenavService.setTitle(this.dataTranslate.DANHMUC.thutuchanhchinh.titleAdd);
    this.matSidenavService.setContentComp( ThutuchanhchinhIoComponent, "new");
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
      .getThuTucHanhChinhService()
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
          .getThuTucHanhChinhService()
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
