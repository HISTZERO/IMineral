import { MenuTinBaiTinTuc } from "src/app/shared/constants/sub-menus/tinbai/tinbai";
import { AdminRoutingName } from "src/app/routes/admin-routes-name";
import {
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from "@angular/core";
import { Router } from "@angular/router";
import { OutputTintucModel } from "src/app/models/admin/tinbai/tintuc.model";
import { MatDialog } from "@angular/material/dialog";
import { MatSidenav } from "@angular/material/sidenav";
import { QueryCellInfoEventArgs } from "@syncfusion/ej2-grids";
import { TranslateService } from "@ngx-translate/core";

import { SettingsCommon } from "src/app/shared/constants/setting-common";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { TinbaiFacadeService } from "src/app/services/admin/tinbai/tinbai-facade.service";
import { MyAlertDialogComponent } from "src/app/shared/components/my-alert-dialog/my-alert-dialog.component";
import { HttpErrorResponse } from "@angular/common/http";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { ThietlapFacadeService } from "src/app/services/admin/thietlap/thietlap-facade.service";
import {
  _addTinTucAction,
  _listTinTucAction,
  _editTinTucAction,
  _deleteTinTucAction,
} from "src/app/shared/constants/actions/tinbai/tintuc";
import { translateConstants } from "src/app/shared/constants/translate-constants";

@Component({
  selector: "app-tintuc",
  templateUrl: "./tintuc.component.html",
  styleUrls: ["./tintuc.component.scss"],
})
export class TintucComponent implements OnInit, OnDestroy {
  public componentRef: ComponentRef<any>;
  public settingsCommon = new SettingsCommon();
  listTintuc: OutputTintucModel[];
  selectedItem: OutputTintucModel;
  listData: any;
  public purpose: string;
  public navArray: any = MenuTinBaiTinTuc;

  // Danh sách các quyền
  addTinTucAction = _addTinTucAction;
  listTinTucAction = _listTinTucAction;
  editTinTucAction = _editTinTucAction;
  deleteTinTucAction = _deleteTinTucAction;

  // Các biến translate
  public dataTranslate: any;

  @ViewChild("aside", { static: true }) public matSidenav: MatSidenav;
  @ViewChild("comptintucio", { read: ViewContainerRef, static: true })
  public content: ViewContainerRef;

  // Hàm constructor phải bắt buộc có hai biến là MatSidenavService và ComponentFactoryResolver để Init MatsidenavService
  constructor(
    public router: Router,
    public matSidenavService: MatsidenavService,
    public cfr: ComponentFactoryResolver,
    public tbFacadeService: TinbaiFacadeService,
    private modalDialog: MatDialog,
    public commonService: CommonServiceShared,
    public thietlapFacadeService: ThietlapFacadeService,
    private translate: TranslateService
  ) { }

  // Khi khởi tạo component cha phải gọi setSidenave để khỏi tạo Sidenav
  async ngOnInit() {
    // Get all langs
    this.dataTranslate = await this.translate
      .getTranslation(this.translate.getDefaultLang())
      .toPromise();

    this.matSidenavService.setSidenav(
      this.matSidenav,
      this,
      this.content,
      this.cfr
    );
    this.settingsCommon.toolbar = ["Search"];
    await this.getAllTintuc();
  }

  // Hàm getAll Nhóm tham số đẻ binding dữ liệu lên EJS grid
  async getAllTintuc() {
    // Get settings
    // const pageSize: any = await this.thietlapFacadeService
    //   .getThietLapHeThongService()
    //   .getSettingKey({ key: "defaultPageSize" });
    // this.settingsCommon.pageSettings.pageSize = +pageSize;
    this.listData = await this.tbFacadeService
      .getTbTintucService()
      // .getFetchAll();
      .getFetchAll({ PageNumber: 1, PageSize: -1 });
    const listDataItems = this.listData.items;
    if (listDataItems) {
      listDataItems.map((tintuc, index) => {
        tintuc.serialNumber = index + 1;
      });
    }
    this.listTintuc = listDataItems;
  }

  // Hàm xóa một bản ghi, được gọi khi nhấn nút xóa trên giao diện list
  async deleteItemTintuc(event) {
    this.getItemByEvent(event);
    // Phải check xem dữ liệu muốn xóa có đang được dùng ko, đang dùng thì ko xóa
    // Trường hợp dữ liệu có thể xóa thì Phải hỏi người dùng xem có muốn xóa không
    // Nếu đồng ý xóa
    const canDelete: string = this.tbFacadeService
      .getTbTintucService()
      .checkBeDeleted(this.selectedItem.id);
    this.canBeDeletedCheck(canDelete);
  }

  // Hàm check xem có thể xóa không
  // Nếu có thì mở form xác nhận xóa
  // Không thì mở form không báo không xóa được
  public canBeDeletedCheck(sMsg: string) {
    if (sMsg === "ok") {
      this.confirmDeleteDiaLog();
    } else {
      this.cantDeleteDialog(sMsg);
    }
  }

  // Show dialog xác nhận xóa khi nhấn vào button delete
  confirmDeleteDiaLog() {
    const dialogRef = this.commonService.confirmDeleteDiaLogService(
      this.dataTranslate.TINBAI.tintuc.contentDelete,
      this.selectedItem.title
    );
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === "confirm") {
        await this.tbFacadeService
          .getTbTintucService()
          .deleteItem({ id: this.selectedItem.id })
          .subscribe(
            () => this.getAllTintuc(),
            (error: HttpErrorResponse) => {
              this.commonService.showeNotiResult(error.message, 2000);
            },
            () =>
              this.commonService.showeNotiResult(
                this.dataTranslate.COMMON.default.successDelete +
                this.selectedItem.title,
                2000
              )
          );
      }
    });
  }

  // Show dialog không xóa được chủ đề khi xác nhận xóa
  cantDeleteDialog(sMsg: string) {
    this.commonService.canDeleteDialogService(sMsg);
  }

  // Hàm chuyển trang thêm mới tin tức
  public openTintucIOPageAdd() {
    this.purpose = "new";
    const lstName = AdminRoutingName;
    this.router.navigate([
      `${lstName.adminUri}/${lstName.tinbaiUri}/${lstName.tinTuc}/${lstName.addTinTuc}`,
    ]);
  }
  // Hàm chuyển trang sửa tin tức
  public openTintucIOPageEdit(id) {
    this.purpose = "edit";
    const lstName = AdminRoutingName;
    this.router.navigate([
      `${lstName.adminUri}/${lstName.tinbaiUri}/${lstName.tinTuc}/${id}/${lstName.editTinTuc}`,
    ]);
  }

  // Hàm chuyển trang xem trước tin tức
  public reviewItem(id) {
    const lstName = AdminRoutingName;
    this.router.navigate([
      `${lstName.adminUri}/${lstName.tinbaiUri}/${lstName.tinTuc}/${id}/${lstName.reviewTinTuc}`,
    ]);
  }

  // Hàm lấy ra đối tượng khi người dùng click vào một trong 3 nút xóa, chi tiết, sửa
  public getItemByEvent(event) {
    const target = event.currentTarget;
    const pElement = target.parentElement.parentElement;
    const pclassID = pElement.getAttribute("id");
    const item = this.listTintuc.find((x) => x.id === +pclassID);
    this.selectedItem = item;
  }

  customiseCell(args: QueryCellInfoEventArgs) {
    if (args.column.field === "id") {
      args.cell.id = args.data[args.column.field];
    }
  }

  // Hàm dùng để gọi các hàm khác, truyền vào tên hàm cần thực thi
  doFunction(methodName) {
    this[methodName]();
  }

  ngOnDestroy(): void {
    if (this.componentRef) {
      this.componentRef.destroy();
      this.componentRef = null;
    }
  }
}
