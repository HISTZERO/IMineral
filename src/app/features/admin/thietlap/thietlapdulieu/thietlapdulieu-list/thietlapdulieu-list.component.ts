import {
  Component,
  ComponentFactoryResolver,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from "@angular/core";
import { MatSidenav } from "@angular/material/sidenav";
import { MatDialog } from "@angular/material/dialog";
import { TranslateService } from "@ngx-translate/core";
import { HttpErrorResponse } from "@angular/common/http";

import { SettingsCommon, ThietLapHeThong } from "src/app/shared/constants/setting-common";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { ThietlapFacadeService } from "src/app/services/admin/thietlap/thietlap-facade.service";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { OutputObjKeyModel } from "src/app/models/admin/common/objKey.model";
import { ThietlapdulieuIoComponent } from "src/app/features/admin/thietlap/thietlapdulieu/thietlapdulieu-io/thietlapdulieu-io.component";
import { CommonFacadeService } from "src/app/services/admin/common/common-facade.service";
import {
  _addObjKeyAction,
  _listObjKeyAction,
  _editObjKeyAction,
  _deleteObjKeyAction,
} from "src/app/shared/constants/actions/common/objkey";
import { MenuThietLapDuLieu } from "src/app/shared/constants/sub-menus/thietlap/thietlapdulieu";

@Component({
  selector: "app-thietlapdulieu-list",
  templateUrl: "./thietlapdulieu-list.component.html",
  styleUrls: ["./thietlapdulieu-list.component.scss"],
})
export class ThietlapdulieuListComponent implements OnInit {
  @ViewChild("aside", { static: true }) public matSidenav: MatSidenav;
  @ViewChild("compThietLapDLio", { read: ViewContainerRef, static: true })
  public content: ViewContainerRef;
  public settingsCommon = new SettingsCommon();

  public listThietLapDL: OutputObjKeyModel[];
  public selectedItem: OutputObjKeyModel;
  public listData: any;
  public pageSize: any;

  public navArray = MenuThietLapDuLieu;

  // Biến dùng translate
  dataTranslate: any;

  // Danh sách các quyền
  addObjKeyAction = _addObjKeyAction;
  listObjKeyAction = _listObjKeyAction;
  editObjKeyAction = _editObjKeyAction;
  deleteObjKeyAction = _deleteObjKeyAction;

  // Hàm constructor phải bắt buộc có hai biến là MatSidenavService và ComponentFactoryResolver để Init MatsidenavService
  constructor(
    public matSidenavService: MatsidenavService,
    public cfr: ComponentFactoryResolver,
    public thietLapFacadeService: ThietlapFacadeService,
    public commonFacadeService: CommonFacadeService,
    private modalDialog: MatDialog,
    public commonService: CommonServiceShared,
    private translate: TranslateService
  ) { }

  /**
   * Khi khởi tạo component cha phải gọi setSidenave để khỏi tạo Sidenav
   */
  async ngOnInit() {
    // Lấy dữ liệu biến translate để gán vào các biến trong component
    this.dataTranslate = await this.translate
      .getTranslation(this.translate.getDefaultLang())
      .toPromise();

    // Lấy dữ liệu truyền vào ejs grid tạo bảng
    this.getPagesize();

    this.matSidenavService.setSidenav(
      this.matSidenav,
      this,
      this.content,
      this.cfr
    );
    this.settingsCommon.toolbar = ["Search"];
  }

  /**
   * Lấy pageSize trong bảng setting theo defaultPageSize
   */
  async getPagesize() {
    this.pageSize = await this.thietLapFacadeService
      .getThietLapHeThongService()
      .getSettingKey({ key: ThietLapHeThong.defaultPageSize });
    this.settingsCommon.pageSettings["pageSize"] = +this.pageSize;
    this.getAllThietLapDuLieu();
  }

  /**
   * Hàm getAll dữ liệu bảng objKey để binding dữ liệu lên EJS grid
   */
  async getAllThietLapDuLieu() {
    this.listData = await this.commonFacadeService
      .getObjKeyService()
      .getFetchAll();
    if (this.listData) {
      this.listData.map((thietlap, index) => {
        thietlap.serialNumber = index + 1;
      });
    }
    this.listThietLapDL = this.listData;
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
    const canDelete: string = this.commonFacadeService
      .getObjKeyService()
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
      this.dataTranslate.THIETLAP.thietlapdulieu.contentDelete,
      this.selectedItem.objName
    );
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === "confirm") {
        await this.commonFacadeService
          .getObjKeyService()
          .deleteItem({ id: this.selectedItem.id })
          .subscribe(
            () => this.getAllThietLapDuLieu(),
            (error: HttpErrorResponse) => {
              this.commonService.showeNotiResult(error.message, 2000);
            },
            () =>
              this.commonService.showeNotiResult(
                this.dataTranslate.COMMON.default.successDelete +
                this.selectedItem.objName,
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
  public editItemThietLapDL(data) {
    this.selectedItem = data;
    this.matSidenavService.setTitle(
      this.dataTranslate.THIETLAP.thietlapdulieu.titleEdit
    );
    this.matSidenavService.setContentComp(
      ThietlapdulieuIoComponent,
      "edit",
      this.selectedItem
    );
    this.matSidenavService.open();
  }

  /**
   * Hàm đặt tiêu đề, Đặt content component và sau đó mở sidebar lên
   */
  public openThietLapDLIOSidebar() {
    this.matSidenavService.setTitle(
      this.dataTranslate.THIETLAP.thietlapdulieu.titleAdd
    );
    this.matSidenavService.setContentComp(ThietlapdulieuIoComponent, "new");
    this.matSidenavService.open();
  }

  /**
   * Close sidenav
   */
  public closeThietLapDLIOSidebar() {
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
