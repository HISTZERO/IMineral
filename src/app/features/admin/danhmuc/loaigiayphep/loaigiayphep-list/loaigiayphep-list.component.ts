import { Component, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { MatSidenav } from "@angular/material";
import { TranslateService } from "@ngx-translate/core";
import { HttpErrorResponse } from "@angular/common/http";

import { SettingsCommon, ThietLapHeThong } from "src/app/shared/constants/setting-common";
import { OutputLoaiGiayPhepModel } from "src/app/models/admin/danhmuc/loaigiayphep.model";
import { MenuDanhMucLoaiGiayPhep } from "src/app/shared/constants/sub-menus/danhmuc/danhmuc";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { DmFacadeService } from "src/app/services/admin/danhmuc/danhmuc-facade.service";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { ThietlapFacadeService } from "src/app/services/admin/thietlap/thietlap-facade.service";
import { LoaigiayphepIoComponent } from "src/app/features/admin/danhmuc/loaigiayphep/loaigiayphep-io/loaigiayphep-io.component";

@Component({
  selector: 'app-loaigiayphep-list',
  templateUrl: './loaigiayphep-list.component.html',
  styleUrls: ['./loaigiayphep-list.component.scss']
})
export class LoaigiayphepListComponent implements OnInit {

  // Viewchild template
  @ViewChild("aside", { static: true }) public matSidenav: MatSidenav;
  @ViewChild("compLoaiGiayPhepIO", { read: ViewContainerRef, static: true }) public content: ViewContainerRef;

  // Chứa thiết lập grid
  public settingsCommon = new SettingsCommon();

  // Chứa danh sách Loại giấy phép
  public listLoaiGiayPhep: OutputLoaiGiayPhepModel[];

  // Chứa dữ liệu đã chọn 
  public selectedItem: OutputLoaiGiayPhepModel;

  // Chứa dữ liệu translate
  public dataTranslate: any;

  // Chứa menu item trên subheader
  public navArray = MenuDanhMucLoaiGiayPhep;

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
    // Gọi hàm lấy dữ liệu Loại giấy phép
    await this.getAllLoaiGiayPhep();
  }

  /**
   * Hàm lấy dữ liệu Loại giấy phép
   */
  async getAllLoaiGiayPhep() {
    const listData: any = await this.dmFacadeService
      .getLoaiGiayPhepService()
      .getFetchAll({ PageNumber: 1, PageSize: -1 });
    if (listData.items) {
      listData.items.map((loaiGP, index) => {
        loaiGP.serialNumber = index + 1;
      });
    }
    this.listLoaiGiayPhep = listData.items;
  }

  /**
   * Hàm mở sidenav chức năng sửa dữ liệu
   * @param id
   */
  async editItemLoaiGiayPhep(id: string) {
    // Lấy dữ liệu loại giấy phép theo id
    const dataItem: any = await this.dmFacadeService
    .getLoaiGiayPhepService()
    .getByid(id).toPromise();
    await this.matSidenavService.setTitle( this.dataTranslate.DANHMUC.loaigiayphep.titleEdit );
    await this.matSidenavService.setContentComp( LoaigiayphepIoComponent, "edit", dataItem);
    await this.matSidenavService.open();
  }

  /**
   * Hàm mở sidenav chức năng thêm mới
   */
  public openLoaiGiayPhepIOSidenav() {
    this.matSidenavService.setTitle(this.dataTranslate.DANHMUC.loaigiayphep.titleAdd);
    this.matSidenavService.setContentComp( LoaigiayphepIoComponent, "new");
    this.matSidenavService.open();
  }

  /**
   * Hàm đóng sidenav
   */
  public closeLoaiGiayPhepIOSidenav() {
    this.matSidenavService.close();
  }


  /**
   *  Hàm xóa một bản ghi, được gọi khi nhấn nút xóa trên giao diện list
   */
  async deleteItemLoaiGiayPhep(data) {
    this.selectedItem = data;
    // Phải check xem dữ liệu muốn xóa có đang được dùng ko, đang dùng thì ko xóa
    // Trường hợp dữ liệu có thể xóa thì Phải hỏi người dùng xem có muốn xóa không
    // Nếu đồng ý xóa
    const canDelete: string = this.dmFacadeService
      .getLoaiGiayPhepService()
      .checkBeDeleted(this.selectedItem.idloaigiayphep);
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
      this.dataTranslate.DANHMUC.loaigiayphep.contentDelete,
      this.selectedItem.tenloaigiayphep
    );
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === "confirm") {
        await this.dmFacadeService
          .getLoaiGiayPhepService()
          .deleteItem({ id: this.selectedItem.idloaigiayphep })
          .subscribe(
            () => this.getAllLoaiGiayPhep(),
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
