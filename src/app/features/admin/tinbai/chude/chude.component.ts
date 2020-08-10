import { MenuTinBaiChuDe } from "src/app/shared/constants/sub-menus/tinbai/tinbai";
import { OutputChudeModel } from "src/app/models/admin/tinbai/chude.model";
import {
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSidenav } from "@angular/material/sidenav";
import { QueryCellInfoEventArgs } from "@syncfusion/ej2-grids";
import { TranslateService } from "@ngx-translate/core";

import { SettingsCommon } from "src/app/shared/constants/setting-common";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { TinbaiFacadeService } from "src/app/services/admin/tinbai/tinbai-facade.service";
import { ChudeIoComponent } from "src/app/features/admin/tinbai/chude/chude-io.component";
import { MyAlertDialogComponent } from "src/app/shared/components/my-alert-dialog/my-alert-dialog.component";
import { HttpErrorResponse } from "@angular/common/http";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { ThietlapFacadeService } from "src/app/services/admin/thietlap/thietlap-facade.service";
import {
  _addChuDeAction,
  _listChuDeAction,
  _editChuDeAction,
  _deleteChuDeAction,
} from "src/app/shared/constants/actions/tinbai/chude";
import { translateConstants } from "src/app/shared/constants/translate-constants";

@Component({
  selector: "app-chude",
  templateUrl: "./chude.component.html",
  styleUrls: ["./chude.component.scss"],
})
export class ChudeComponent implements OnInit, OnDestroy {
  public componentRef: ComponentRef<any>;
  public settingsCommon = new SettingsCommon();
  listChude: OutputChudeModel[];
  selectedItem: OutputChudeModel;
  listData: any;
  public navArray: any = MenuTinBaiChuDe;

  // Danh sách các quyền
  addChuDeAction = _addChuDeAction;
  listChuDeAction = _listChuDeAction;
  editChuDeAction = _editChuDeAction;
  deleteChuDeAction = _deleteChuDeAction;

  // Các biến translate
  public dataTranslate: any;

  @ViewChild("aside", { static: true }) public matSidenav: MatSidenav;
  @ViewChild("compchudeio", { read: ViewContainerRef, static: true })
  public content: ViewContainerRef;

  // Hàm constructor phải bắt buộc có hai biến là MatSidenavService và ComponentFactoryResolver để Init MatsidenavService
  constructor(
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
    await this.getAllChude();
  }

  // Hàm getAll Nhóm tham số đẻ binding dữ liệu lên EJS grid
  async getAllChude() {
    // Get settings
    // const pageSize: any = await this.thietlapFacadeService
    //   .getThietLapHeThongService()
    //   .getSettingKey({ key: "defaultPageSize" });
    // this.settingsCommon.pageSettings.pageSize = +pageSize;
    this.listData = await this.tbFacadeService
      .getTbChudeService()
      .getFetchAll();
    // .getFetchAll({ PageNumber: 1, PageSize: -1 });
    const listDataItems = this.listData;
    if (listDataItems) {
      listDataItems.map((chude, index) => {
        chude.serialNumber = index + 1;
      });
    }
    this.listChude = listDataItems;
  }

  // Hàm xóa một bản ghi, được gọi khi nhấn nút xóa trên giao diện list
  async deleteItemChude(event) {
    this.getItemByEvent(event);
    // Phải check xem dữ liệu muốn xóa có đang được dùng ko, đang dùng thì ko xóa
    // Trường hợp dữ liệu có thể xóa thì Phải hỏi người dùng xem có muốn xóa không
    // Nếu đồng ý xóa
    const canDelete: string = this.tbFacadeService
      .getTbChudeService()
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
  //Form xác nhận xóa và load lại dữ liệu
  confirmDeleteDiaLog() {
    const dialogRef = this.commonService.confirmDeleteDiaLogService(
      this.dataTranslate.TINBAI.chude.contentDelete,
      this.selectedItem.catName
    );
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === "confirm") {
        await this.tbFacadeService
          .getTbChudeService()
          .deleteItem({ id: this.selectedItem.id })
          .subscribe(
            () => this.getAllChude(),
            (error: HttpErrorResponse) => {
              this.commonService.showeNotiResult(error.message, 2000);
            },
            () =>
              this.commonService.showeNotiResult(
                this.dataTranslate.COMMON.default.successDelete +
                this.selectedItem.catName,
                2000
              )
          );
      }
    });
  }
  // Form thông báo không thể xóa
  cantDeleteDialog(sMsg: string) {
    this.commonService.canDeleteDialogService(sMsg);
  }

  // Hàm sửa thông tin chi tiết một bản ghi, được gọi khi nhấn nút xem chi tiết trên giao diện list
  public editItemChude(event) {
    this.getItemByEvent(event);
    this.matSidenavService.setTitle(this.dataTranslate.TINBAI.chude.titleEdit);
    this.matSidenavService.setContentComp(
      ChudeIoComponent,
      "edit",
      this.selectedItem
    );
    this.matSidenavService.open();
  }

  // Hàm đặt tiêu đề, Đặt content component và sau đó mở sidebar lên
  public openChudeIOSidebar() {
    this.matSidenavService.setTitle(this.dataTranslate.TINBAI.chude.titleEdit);
    this.matSidenavService.setContentComp(ChudeIoComponent, "new");
    this.matSidenavService.open();
  }

  // Hàm đóng sidebar
  public closeChudeIOSidebar() {
    this.matSidenavService.close();
  }

  // Hàm lấy ra đối tượng khi người dùng click vào một trong 3 nút xóa, chi tiết, sửa
  public getItemByEvent(event) {
    const target = event.currentTarget;
    const pElement = target.parentElement.parentElement;
    const pclassID = pElement.getAttribute("id");
    const item = this.listChude.find((x) => x.id === +pclassID);
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
