import { TranslateService } from "@ngx-translate/core";
import {
  Component,
  ComponentFactoryResolver,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from "@angular/core";
import { Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { MatSidenav } from "@angular/material/sidenav";
import { HttpErrorResponse } from "@angular/common/http";

import { AdminRoutingName } from "src/app/routes/admin-routes-name";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { OutputObjTypesModel } from "src/app/models/admin/thietlap/objTypes.model";
import { CallFunctionService } from "src/app/services/utilities/call-function.service";
import { SettingsCommon, ThietLapHeThong } from "src/app/shared/constants/setting-common";
import { ThietlapFacadeService } from "src/app/services/admin/thietlap/thietlap-facade.service";
import { MyAlertDialogComponent } from "src/app/shared/components/my-alert-dialog/my-alert-dialog.component";
import { ThietlaptramIoComponent } from "src/app/features/admin/thietlap/thietlaptram/thietlaptram-io/thietlaptram-io.component";
import {
  _addObjTypesAction,
  _listObjTypesAction,
  _editObjTypesAction,
  _deleteObjTypesAction,
  _detailObjTypesAction,
} from "src/app/shared/constants/actions/thietlap/objtypes";
import { MenuThietLapTram } from "src/app/shared/constants/sub-menus/thietlap/thietlaptram";

@Component({
  selector: "app-thietlaptram-list",
  templateUrl: "./thietlaptram-list.component.html",
  styleUrls: ["./thietlaptram-list.component.scss"],
})
export class ThietlaptramListComponent implements OnInit {
  @ViewChild("aside", { static: true }) public matSidenav: MatSidenav;
  @ViewChild("compThietLapTramio", { read: ViewContainerRef, static: true })
  public content: ViewContainerRef;

  public settingsCommon = new SettingsCommon();
  public listThietLapTram: OutputObjTypesModel[];
  public selectedItem: OutputObjTypesModel;
  public listData: any;
  public allOtypeKey: any = [];
  public allOtypeName: any = [];
  public pageSize: any;
  public allOtypeKeyLenght: any;
  public allOtypeNameLenght: any;

  // Biến dùng translate
  dataTranslate: any;

  // menu items subheader
  public navArray = MenuThietLapTram;

  // Danh sách các quyền
  addObjTypesAction = _addObjTypesAction;
  listObjTypesAction = _listObjTypesAction;
  editObjTypesAction = _editObjTypesAction;
  deleteObjTypesAction = _deleteObjTypesAction;
  detailObjTypesAction = _detailObjTypesAction;
  public deleteOtypeName: any;
  public deleteOtypeKey: any;

  // Hàm constructor phải bắt buộc có hai biến là MatSidenavService và ComponentFactoryResolver để Init MatsidenavService
  constructor(
    public matSidenavService: MatsidenavService,
    public cfr: ComponentFactoryResolver,
    public thietLapFacadeService: ThietlapFacadeService,
    private modalDialog: MatDialog,
    public commonService: CommonServiceShared,
    private router: Router,
    private callFunctionService: CallFunctionService,
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

    this.settingsCommon.toolbar = ["Search"];
    this.matSidenavService.setSidenav(
      this.matSidenav,
      this,
      this.content,
      this.cfr
    );

  }

  /**
   * Lấy pageSize trong bảng setting theo defaultPageSize
   */
  async getPagesize() {
    this.pageSize = await this.thietLapFacadeService
      .getThietLapHeThongService()
      .getSettingKey({ key: ThietLapHeThong.defaultPageSize });
    this.settingsCommon.pageSettings["pageSize"] = +this.pageSize;
    this.getAllThietLapTram();
  }

  /**
   * Hàm getAll Setting để binding dữ liệu lên EJS grid
   */
  async getAllThietLapTram() {
    this.listData = await this.thietLapFacadeService
      .getObjTypeService()
      .getFetchAll();
    if (this.listData) {
      this.listData.map((thietlaptram, index) => {
        thietlaptram.serialNumber = index + 1;
        this.allOtypeKey.push(thietlaptram.otypeKey);
        this.allOtypeName.push(thietlaptram.otypeName);
      });
    }
    this.allOtypeKeyLenght = this.allOtypeKey.length;
    this.allOtypeNameLenght = this.allOtypeKey.length;
    this.listThietLapTram = this.listData;
  }

  /**
   * Hàm chuyển hướng đến phần setting trạm
   * @param id
   */
  public toSetting(id: number) {
    this.router.navigateByUrl(
      "/" +
      AdminRoutingName.adminUri +
      "/" +
      AdminRoutingName.thietlapUri +
      "/" +
      AdminRoutingName.ThietLapTram +
      "/" +
      AdminRoutingName.DoiTuongTram +
      "/" +
      id
    );
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
      .getObjTypeService()
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
      this.dataTranslate.THIETLAP.thietlaptram.contentDelete,
      this.selectedItem.otypeName
    );
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === "confirm") {
        await this.thietLapFacadeService
          .getObjTypeService()
          .deleteItem({ id: this.selectedItem.id })
          .subscribe(
            (res) => {
              this.getAllThietLapTram();
              const data = {
                type: "delete",
                data: this.selectedItem,
              };
              this.callFunctionService.callFunctionEvent(data);
            },
            (error: HttpErrorResponse) => {
              const dialog = this.modalDialog.open(MyAlertDialogComponent);
              dialog.componentInstance.header = "Cảnh báo?";
              dialog.componentInstance.content =
                "<b>" + error.error.errors + "</b>";
              dialog.componentInstance.okeButton = "Đồng ý";
              dialog.componentInstance.visibleOkButton = true;
            },
            () =>
              this.commonService.showeNotiResult(
                this.dataTranslate.COMMON.default.successDelete +
                this.selectedItem.otypeName,
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
  public editItemThietLapTram(data) {
    this.selectedItem = data;
    this.selectedItem["arrayOtypeKey"] = this.allOtypeKey;
    this.selectedItem["arrayOtypeName"] = this.allOtypeName;
    this.matSidenavService.setTitle(
      this.dataTranslate.THIETLAP.thietlapdulieu.titleEdit
    );
    this.matSidenavService.setContentComp(
      ThietlaptramIoComponent,
      "edit",
      this.selectedItem
    );
    this.matSidenavService.open();
  }

  /**
   * Hàm đặt tiêu đề, Đặt content component và sau đó mở sidebar lên
   */
  public openThietLapTramIOSidebar() {
    this.selectedItem = new OutputObjTypesModel();
    this.selectedItem["arrayOtypeKey"] = this.allOtypeKey;
    this.selectedItem["arrayOtypeName"] = this.allOtypeName;
    this.matSidenavService.setTitle(
      this.dataTranslate.THIETLAP.thietlapdulieu.titleAdd
    );
    this.matSidenavService.setContentComp(
      ThietlaptramIoComponent,
      "new",
      this.selectedItem
    );
    this.matSidenavService.open();
  }

  /**
   * Close sidenav
   */
  public closeThietLapTramIOSidebar() {
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
