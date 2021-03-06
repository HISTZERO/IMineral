import { TranslateService } from "@ngx-translate/core";
import {
  Component,
  ComponentFactoryResolver,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from "@angular/core";
import { GridComponent } from "@syncfusion/ej2-angular-grids";
import { HttpErrorResponse } from "@angular/common/http";
import { MatSidenav } from "@angular/material/sidenav";

import { SettingsCommon, ThietLapHeThong } from "src/app/shared/constants/setting-common";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { OutputThietLapHeThongModel } from "src/app/models/admin/thietlap/thietlap-hethong.model";
import { ThietlapFacadeService } from "src/app/services/admin/thietlap/thietlap-facade.service";
import { ThietlaphethongIoComponent } from "src/app/features/admin/thietlap/thietlaphethong/thietlaphethong-io/thietlaphethong-io.component";
import { MenuThietLapHeThong } from "src/app/shared/constants/sub-menus/thietlap/thietlaphethong";

@Component({
  selector: "app-thietlaphethong-list",
  templateUrl: "./thietlaphethong-list.component.html",
  styleUrls: ["./thietlaphethong-list.component.scss"],
})
export class ThietlaphethongListComponent implements OnInit {

  // Viewchild tempalte
  @ViewChild('grid', { static: false }) public grid: GridComponent;
  @ViewChild("aside", { static: true }) public matSidenav: MatSidenav;
  @ViewChild("compThietLapHTio", { read: ViewContainerRef, static: true }) public content: ViewContainerRef;

  // Chứa cấu hình setting grid
  public settingsCommon = new SettingsCommon();

  // Chứa danh sách thiết lập
  public listThietLapHT: OutputThietLapHeThongModel[];

  // Chứa item đã chọn
  public selectedItem: OutputThietLapHeThongModel;

  // Chứa dữ liệu menu item trên subheader
  public navArray = MenuThietLapHeThong;

  // Biến dùng translate
  public dataTranslate: any;

  // Hàm constructor phải bắt buộc có hai biến là MatSidenavService và ComponentFactoryResolver để Init MatsidenavService
  constructor(
    public matSidenavService: MatsidenavService,
    public cfr: ComponentFactoryResolver,
    public thietLapFacadeService: ThietlapFacadeService,
    public commonService: CommonServiceShared,
    private translate: TranslateService
  ) { }

  /**
   * Khi khởi tạo component cha phải gọi setSidenave để khỏi tạo Sidenav
   */
  async ngOnInit() {
    // Set thuộc tính sidenav
    this.matSidenavService.setSidenav(this.matSidenav, this, this.content, this.cfr);

    // Lấy dữ liệu biến translate để gán vào các biến trong component
    await this.getDataTranslate();

    // Lấy dữ liệu truyền vào ejs grid tạo bảng
    await this.getPagesize();

  }

  /**
   * Lấy dữ liệu translate
   */
  async getDataTranslate() {
    this.dataTranslate = await this.translate
      .getTranslation(this.translate.getDefaultLang())
      .toPromise();
  }

  /**
   * Lấy pageSize trong bảng setting theo defaultPageSize
   */
  async getPagesize() {
    const dataPageSize = await this.thietLapFacadeService
      .getThietLapHeThongService()
      .getByid(ThietLapHeThong.defaultPageSize).toPromise();
    if (dataPageSize) {
      this.settingsCommon.pageSettings["pageSize"] = +dataPageSize.settingValue;
    } else {
      this.settingsCommon.pageSettings["pageSize"] = 10;
    }

    // Gọi hàm lấy dữ liệu thiết lập
    await this.getAllThietLapHeThong();
  }

  /**
   * Hàm getAll Setting để binding dữ liệu lên EJS grid
   */
  async getAllThietLapHeThong() {
    const listData: any = await this.thietLapFacadeService
      .getThietLapHeThongService()
      .getFetchAll();
    if (listData) {
      listData.map((thietlap, index) => {
        thietlap.serialNumber = index + 1;
      });
    }

    this.listThietLapHT = listData;
  }

  /**
   *  Hàm xóa một bản ghi, được gọi khi nhấn nút xóa trên giao diện list
   * @param data
   */
  async deleteItem(data) {
    this.selectedItem = data;
    // Phải check xem dữ liệu muốn xóa có đang được dùng ko, đang dùng thì ko xóa
    // Trường hợp dữ liệu có thể xóa thì Phải hỏi người dùng xem có muốn xóa không
    // Nếu đồng ý xóa
    const canDelete: string = this.thietLapFacadeService
      .getThietLapHeThongService()
      .checkBeDeleted(this.selectedItem.id);
    this.canBeDeletedCheck(canDelete);
  }

  /**
   * Hàm check delete
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
   * Hàm open dialog thông báo có chắc chắn xóa không
   */
  confirmDeleteDiaLog() {
    const dialogRef = this.commonService.confirmDeleteDiaLogService(
      this.dataTranslate.THIETLAP.thietlaphethong.contentDelete,
      this.selectedItem.settingKey
    );
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === "confirm") {
        await this.thietLapFacadeService
          .getThietLapHeThongService()
          .deleteItem({ idSettings: this.selectedItem.id })
          .subscribe(
            () => this.getAllThietLapHeThong(),
            (error: HttpErrorResponse) => {
              this.commonService.showeNotiResult(error.message, 2000);
            },
            () =>
              this.commonService.showeNotiResult(
                this.dataTranslate.COMMON.default.successDelete + " " + this.selectedItem.settingKey,
                2000
              )
          );
      }
    });
  }

  /**
   * Hàm open dialog thông báo không thể xóa
   * @param sMsg
   */
  cantDeleteDialog(sMsg: string) {
    this.commonService.canDeleteDialogService(sMsg);
  }

  /**
   * Hàm sửa thông tin chi tiết một bản ghi, được gọi khi nhấn nút xem chi tiết trên giao diện list
   * @param data
   */
  public editItemThietLapHT(data) {
    this.selectedItem = data;
    this.matSidenavService.setTitle(this.dataTranslate.THIETLAP.thietlaphethong.titleEdit);
    this.matSidenavService.setContentComp(ThietlaphethongIoComponent, "edit", this.selectedItem);
    this.matSidenavService.open();
  }

  /**
   * Hàm đặt tiêu đề, Đặt content component và sau đó mở sidebar lên
   */
  public openThietLapHTIOSidebar() {
    this.matSidenavService.setTitle(this.dataTranslate.THIETLAP.thietlaphethong.titleAdd);
    this.matSidenavService.setContentComp(ThietlaphethongIoComponent, "new");
    this.matSidenavService.open();
  }

  /**
   * Close sidenav
   */
  public closeThietLapHTIOSidebar() {
    this.matSidenavService.close();
  }

  /**
   *  Hàm dùng để gọi các hàm khác, truyền vào tên hàm cần thực thi
   * @param methodName
   */
  doFunction(methodName) {
    this[methodName]();
  }
}
