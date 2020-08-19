import { Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef} from "@angular/core";
import { MatSidenav } from "@angular/material/sidenav";
import { TranslateService } from "@ngx-translate/core";
import { HttpErrorResponse } from "@angular/common/http";

import { SettingsCommon, ThietLapHeThong } from "src/app/shared/constants/setting-common";
import { OutputLinhvucModel } from "src/app/models/admin/danhmuc/linhvuc.model";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { DmFacadeService } from "src/app/services/admin/danhmuc/danhmuc-facade.service";
import { LinhvucIoComponent } from "src/app/features/admin/danhmuc/linhvuc/linhvuc-io/linhvuc-io.component";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { ThietlapFacadeService } from "src/app/services/admin/thietlap/thietlap-facade.service";
import { MenuDanhMucLinhVuc } from "src/app/shared/constants/sub-menus/danhmuc/danhmuc";

@Component({
  selector: 'app-linhvuc-list',
  templateUrl: './linhvuc-list.component.html',
  styleUrls: ['./linhvuc-list.component.scss']
})
export class LinhvucListComponent implements OnInit {
  // Viewchild template
  @ViewChild("aside", { static: true }) public matSidenav: MatSidenav;
  @ViewChild("complinhvucio", { read: ViewContainerRef, static: true }) public content: ViewContainerRef;

  // Chứa thiết lập grid
  public settingsCommon = new SettingsCommon();

  // Chứa danh sách lĩnh vực
  public listLinhvuc: OutputLinhvucModel[];

  // Chứa dữ liệu đã chọn
  public selectedItem: OutputLinhvucModel;

  // Chứa danh sách dữ liệu
  public listData: any;

  // Chứa dữ liệu translate
  public dataTranslate: any;

  // Chứa menu item trên subheader
  public navArray = MenuDanhMucLinhVuc;
  constructor(public matSidenavService: MatsidenavService,
              public cfr: ComponentFactoryResolver,
              public dmFacadeService: DmFacadeService,
              public commonService: CommonServiceShared,
              public thietlapFacadeService: ThietlapFacadeService,
              private translate: TranslateService) { }

  async ngOnInit(){
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
    // Gọi hàm lấy dữ liệu cá nhân
    await this.getAllLinhvuc();
  }

  /**
   * Hàm lấy dữ liệu Cá nhân
   */
  async getAllLinhvuc() {
    const listData: any = await this.dmFacadeService
      .getLinhVucService()
      .getFetchAll({ PageNumber: 1, PageSize: -1 });
    if (listData.items) {
      listData.items.map((linhvuc, index) => {
        linhvuc.serialNumber = index + 1;
      });
    }
    this.listLinhvuc = listData.items;
  }

   /**
   * Hàm mở sidenav chức năng sửa dữ liệu
   * @param id
   */
  async editItemLinhvuc(id: any) {
    // Lấy dữ liệu cá nhân theo id
    const dataItem: any = await this.dmFacadeService
    .getDmCanhanService()
    .getByid(id).toPromise();
    await this.matSidenavService.setTitle( this.dataTranslate.DANHMUC.canhan.titleEdit );
    await this.matSidenavService.setContentComp(LinhvucIoComponent, "edit", dataItem);
    await this.matSidenavService.open();
  }

  /**
   * Hàm mở sidenav chức năng thêm mới
   */
  public openLinhvucIOSidenav() {
    this.matSidenavService.setTitle(this.dataTranslate.DANHMUC.canhan.titleAdd);
    this.matSidenavService.setContentComp(LinhvucIoComponent, "new");
    this.matSidenavService.open();
  }

  /**
   * Hàm đóng sidenav
   */
  public closeLinhvucIOSidenav() {
    this.matSidenavService.close();
  }

    /**
   *  Hàm xóa một bản ghi, được gọi khi nhấn nút xóa trên giao diện list
   */
  async deleteItemLinhvuc(data) {
    this.selectedItem = data;
    // Phải check xem dữ liệu muốn xóa có đang được dùng ko, đang dùng thì ko xóa
    // Trường hợp dữ liệu có thể xóa thì Phải hỏi người dùng xem có muốn xóa không
    // Nếu đồng ý xóa
    const canDelete: string = this.dmFacadeService
      .getDmCanhanService()
      .checkBeDeleted(this.selectedItem.idlinhvuc);
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
      this.dataTranslate.DANHMUC.linhvuc.contentDelete,
      this.selectedItem.tenlinhvuc
    );
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === "confirm") {
        await this.dmFacadeService
          .getLinhVucService()
          .deleteItem({ idCanhan: this.selectedItem.idlinhvuc })
          .subscribe(
            () => this.getAllLinhvuc(),
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
