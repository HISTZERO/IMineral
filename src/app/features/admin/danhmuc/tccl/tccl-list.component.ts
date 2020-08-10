import {
  Component,
  ComponentFactoryResolver,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from "@angular/core";
import {
  SettingsCommon,
  ThietLapHeThong,
} from "src/app/shared/constants/setting-common";
import { TranslateService } from "@ngx-translate/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSidenav } from "@angular/material/sidenav";
import { HttpErrorResponse } from "@angular/common/http";
import { QueryCellInfoEventArgs } from "@syncfusion/ej2-angular-grids";

import { OutputTieuchuanchatluongModel } from "src/app/models/admin/danhmuc/tccl.model";
import { DmTcclIoComponent } from "src/app/features/admin/danhmuc/tccl/tccl-io.component";
import { DmFacadeService } from "src/app/services/admin/danhmuc/danhmuc-facade.service";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { ThietlapFacadeService } from "src/app/services/admin/thietlap/thietlap-facade.service";
import {
  _addTcclAction,
  _listTcclAction,
  _editTcclAction,
  _deleteTcclAction,
} from "src/app/shared/constants/actions/danhmuc/tccl";
import { MenuDanhMucTieuChuanChatLuong } from "src/app/shared/constants/sub-menus/danhmuc/danhmuc";

@Component({
  selector: "app-tccl-list",
  templateUrl: "./tccl-list.component.html",
  styleUrls: ["./tccl-list.component.scss"],
})
export class DmTcclListComponent implements OnInit {
  public listTieuchuanchatluong: OutputTieuchuanchatluongModel[];
  public selectedItem: OutputTieuchuanchatluongModel;
  public listData: any;
  @ViewChild("aside", { static: true }) public matSidenav: MatSidenav;
  @ViewChild("compTieuchuanchatluongio", {
    read: ViewContainerRef,
    static: true,
  })
  public content: ViewContainerRef;
  public settingsCommon = new SettingsCommon();
  public navArray = MenuDanhMucTieuChuanChatLuong;

  // Biến dùng translate
  dataTranslate: any;

  // Danh sách các quyền
  addTcclAction = _addTcclAction;
  listTcclAction = _listTcclAction;
  editTcclAction = _editTcclAction;
  deleteTcclAction = _deleteTcclAction;

  constructor(
    public matsidenavService: MatsidenavService,
    public cfr: ComponentFactoryResolver,
    public dmFacadeService: DmFacadeService,
    public modalDialog: MatDialog,
    public commonService: CommonServiceShared,
    public thietlapFacadeService: ThietlapFacadeService,
    private translate: TranslateService
  ) {
    translate.getTranslation(translate.getDefaultLang()).subscribe((res) => {
      this.dataTranslate = res;
    });
  }

  async ngOnInit() {
    // Get all langs
    this.dataTranslate = await this.translate
      .getTranslation(this.translate.getDefaultLang())
      .toPromise();

    this.matsidenavService.setSidenav(
      this.matSidenav,
      this,
      this.content,
      this.cfr
    );
    this.settingsCommon.toolbar = ["Search"];
    // Lấy dữ liệu truyền vào ejs grid tạo bảng
    await this.getPageSize();
    await this.getAllTieuchuanchatluong();
  }

  // Cài đặt số phân trang trên gird
  async getPageSize() {
    // Get settings
    const pageSize: any = await this.thietlapFacadeService
      .getThietLapHeThongService()
      .getSettingKey({ key: ThietLapHeThong.defaultPageSize });
    this.settingsCommon.pageSettings.pageSize = +pageSize;
  }

  // get all Tieu chuan chat luong
  async getAllTieuchuanchatluong() {
    this.listData = await this.dmFacadeService
      .getTieuchuanchatluongService()
      .getFetchAll({ PageNumber: 1, PageSize: -1 });
    const listDataItems = this.listData.items;
    if (listDataItems) {
      listDataItems.map((tccl, index) => {
        tccl.serialNumber = index + 1;
      });
    }
    this.listTieuchuanchatluong = listDataItems;
  }
  // open sidebar execute insert
  public openTieuchuanchatluongIOSidebar() {
    this.matsidenavService.setTitle(this.dataTranslate.DANHMUC.tccl.titleAdd);
    this.matsidenavService.setContentComp(DmTcclIoComponent, "new");
    this.matsidenavService.open();
  }

  // edit open sidebar
  public editItemTieuchuanchatluong(event) {
    this.getItemByEvent(event);
    this.matsidenavService.setTitle(this.dataTranslate.DANHMUC.tccl.titleEdit);
    this.matsidenavService.setContentComp(
      DmTcclIoComponent,
      "edit",
      this.selectedItem
    );
    this.matsidenavService.open();
  }

  // delete
  public deleteTieuchuanchatluong(event) {
    this.getItemByEvent(event);
    const canDelete: string = this.dmFacadeService
      .getTieuchuanchatluongService()
      .checkBeDeleted(this.selectedItem.id);
    this.canBeDeletedCheck(canDelete);
  }

  public canBeDeletedCheck(sMsg: string) {
    if (sMsg === "ok") {
      this.confirmDeleteDiaLog();
    } else {
      this.canDeleteDialog(sMsg);
    }
  }

  confirmDeleteDiaLog() {
    const dialogRef = this.commonService.confirmDeleteDiaLogService(
      this.dataTranslate.DANHMUC.tccl.contentDelete,
      this.selectedItem.tentieuchuan
    );
    dialogRef.afterClosed().subscribe((result) => {
      if (result === "confirm") {
        this.dmFacadeService
          .getTieuchuanchatluongService()
          .deleteItem({ id: this.selectedItem.id })
          .subscribe(
            () => this.getAllTieuchuanchatluong(),
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

  canDeleteDialog(sMsg: string) {
    this.commonService.canDeleteDialogService(sMsg);
  }

  // close
  public closeTieuchuanchatluongIOSidebar() {
    this.matSidenav.close();
  }

  // set id in coloumn
  customiseCell(args: QueryCellInfoEventArgs) {
    if (args.column.field === "id") {
      args.cell.id = args.data[args.column.field];
    }
  }

  // getItemByEvent
  public getItemByEvent(event) {
    const item = this.commonService.getByEvent(
      event,
      this.listTieuchuanchatluong
    );
    this.selectedItem = item;
  }

  // call method
  doFunction(methodName) {
    this[methodName]();
  }
}
