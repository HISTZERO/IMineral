import {
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from "@angular/core";
import { MatSidenav } from "@angular/material/sidenav";
import { QueryCellInfoEventArgs } from "@syncfusion/ej2-grids";
import { TranslateService } from "@ngx-translate/core";

import {
  SettingsCommon,
  ThietLapHeThong,
} from "src/app/shared/constants/setting-common";
import { OutputCanhanModel } from "src/app/models/admin/danhmuc/canhan.model";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { DmFacadeService } from "src/app/services/admin/danhmuc/danhmuc-facade.service";
import { DmCanhanIoComponent } from "src/app/features/admin/danhmuc/canhan/canhan-io.component";
import { HttpErrorResponse } from "@angular/common/http";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { ThietlapFacadeService } from "src/app/services/admin/thietlap/thietlap-facade.service";
import {
  _listTinhAction,
  _listHuyenAction,
  _listXaAction,
} from "src/app/shared/constants/actions/danhmuc/dvhc";
import {
  _addCaNhanAction,
  _listCaNhanAction,
  _editCaNhanAction,
  _deleteCaNhanAction,
} from "src/app/shared/constants/actions/danhmuc/canhan";
import { MenuDanhMucCaNhan } from "src/app/shared/constants/sub-menus/danhmuc/danhmuc";

@Component({
  selector: "app-canhan-list",
  templateUrl: "./canhan-list.component.html",
  styleUrls: ["./canhan-list.component.scss"],
})
export class DmCanhanListComponent implements OnDestroy, OnInit {
  // @ts-ignore
  @ViewChild("aside", { static: true }) public matSidenav: MatSidenav;
  @ViewChild("compcanhanio", { read: ViewContainerRef, static: true })
  public content: ViewContainerRef;

  public componentRef: ComponentRef<any>;
  public settingsCommon = new SettingsCommon();
  public listCanhan: OutputCanhanModel[];
  public selectedItem: OutputCanhanModel;
  public listData: any;

  // Danh sách các quyền
  addCaNhanAction = _addCaNhanAction;
  listCaNhanAction = _listCaNhanAction;
  editCaNhanAction = _editCaNhanAction;
  deleteCaNhanAction = _deleteCaNhanAction;
  listTinhAction = _listTinhAction;
  listHuyenAction = _listHuyenAction;
  listXaAction = _listXaAction;

  // Các biến translate
  public dataTranslate: any;

  public navArray = MenuDanhMucCaNhan;

  // Hàm constructor phải bắt buộc có hai biến là MatSidenavService và ComponentFactoryResolver để Init MatsidenavService
  constructor(
    public matSidenavService: MatsidenavService,
    public cfr: ComponentFactoryResolver,
    public dmFacadeService: DmFacadeService,
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
    // Lấy dữ liệu truyền vào ejs grid tạo bảng
    await this.getAllCanhan();
  }

  // Hàm getAll Nhóm tham số đẻ binding dữ liệu lên EJS grid
  async getAllCanhan() {
    // Get settings
    const pageSize: any = await this.thietlapFacadeService
      .getThietLapHeThongService()
      .getSettingKey({ key: ThietLapHeThong.defaultPageSize });
    this.settingsCommon.pageSettings.pageSize = +pageSize;
    this.listData = await this.dmFacadeService
      .getDmCanhanService()
      .getFetchAll({ PageNumber: 1, PageSize: -1 });
    const listDataItems = this.listData.items;
    if (listDataItems) {
      listDataItems.map((canhan, index) => {
        canhan.serialNumber = index + 1;
      });
    }
    this.listCanhan = listDataItems;
  }

  // Hàm xóa một bản ghi, được gọi khi nhấn nút xóa trên giao diện list
  async deleteItemCanhan(event) {
    this.getItemByEvent(event);
    // Phải check xem dữ liệu muốn xóa có đang được dùng ko, đang dùng thì ko xóa
    // Trường hợp dữ liệu có thể xóa thì Phải hỏi người dùng xem có muốn xóa không
    // Nếu đồng ý xóa
    const canDelete: string = this.dmFacadeService
      .getDmCanhanService()
      .checkBeDeleted(this.selectedItem.id);
    this.canBeDeletedCheck(canDelete);
  }

  public canBeDeletedCheck(sMsg: string) {
    if (sMsg === "ok") {
      this.confirmDeleteDiaLog();
    } else {
      this.cantDeleteDialog(sMsg);
    }
  }

  confirmDeleteDiaLog() {
    const dialogRef = this.commonService.confirmDeleteDiaLogService(
      this.dataTranslate.DANHMUC.canhan.contentDelete,
      this.selectedItem.hovaten
    );
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === "confirm") {
        await this.dmFacadeService
          .getDmCanhanService()
          .deleteItem({ id: this.selectedItem.id })
          .subscribe(
            () => this.getAllCanhan(),
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

  cantDeleteDialog(sMsg: string) {
    this.commonService.canDeleteDialogService(sMsg);
  }

  // Hàm sửa thông tin chi tiết một bản ghi, được gọi khi nhấn nút xem chi tiết trên giao diện list
  public editItemCanhan(event) {
    this.getItemByEvent(event);
    this.matSidenavService.setTitle(
      this.dataTranslate.DANHMUC.canhan.titleEdit
    );
    this.matSidenavService.setContentComp(
      DmCanhanIoComponent,
      "edit",
      this.selectedItem
    );
    this.matSidenavService.open();
  }

  // Hàm đặt tiêu đề, Đặt content component và sau đó mở sidebar lên
  public openCanhanIOSidebar() {
    this.matSidenavService.setTitle(this.dataTranslate.DANHMUC.canhan.titleAdd);
    this.matSidenavService.setContentComp(DmCanhanIoComponent, "new");
    this.matSidenavService.open();
  }

  public closeCanhanIOSidebar() {
    this.matSidenavService.close();
  }

  // Hàm lấy ra đối tượng khi người dùng click vào một trong 3 nút xóa, chi tiết, sửa
  public getItemByEvent(event) {
    const target = event.currentTarget;
    const pElement = target.parentElement.parentElement;
    const pclassID = pElement.getAttribute("id");
    const item = this.listCanhan.find((x) => x.id === +pclassID);
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
