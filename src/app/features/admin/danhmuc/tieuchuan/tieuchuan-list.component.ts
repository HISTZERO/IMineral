import { MenuDanhMucTieuChuan } from "src/app/shared/constants/sub-menus/danhmuc/danhmuc";
import {
  Component,
  ComponentFactoryResolver,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from "@angular/core";
import { OutputTieuchuanModel } from "src/app/models/admin/danhmuc/tieuchuan.model";
import {
  SettingsCommon,
  ThietLapHeThong,
} from "src/app/shared/constants/setting-common";
import { DmTieuchuanIoComponent } from "src/app/features/admin/danhmuc/tieuchuan/tieuchuan-io.component";
import { MatDialog } from "@angular/material/dialog";
import { MatSidenav } from "@angular/material/sidenav";
import { TranslateService } from "@ngx-translate/core";

import { MyAlertDialogComponent } from "src/app/shared/components/my-alert-dialog/my-alert-dialog.component";
import { DmFacadeService } from "src/app/services/admin/danhmuc/danhmuc-facade.service";
import { QueryCellInfoEventArgs } from "@syncfusion/ej2-angular-grids";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { HttpErrorResponse } from "@angular/common/http";
import { ThietlapFacadeService } from "src/app/services/admin/thietlap/thietlap-facade.service";
import {
  _addTieuChuanAction,
  _listTieuChuanAction,
  _editTieuChuanAction,
  _deleteTieuChuanAction,
} from "src/app/shared/constants/actions/danhmuc/tieuchuan";

@Component({
  selector: "app-tieuchuan-list",
  templateUrl: "./tieuchuan-list.component.html",
  styleUrls: ["./tieuchuan-list.component.scss"],
})
export class DmTieuchuanListComponent implements OnInit {
  listTieuchuan: OutputTieuchuanModel[];
  selectedItem: OutputTieuchuanModel;
  listData: any;
  data: any;
  navArray = MenuDanhMucTieuChuan;

  // Danh sách các quyền
  addTieuChuanAction = _addTieuChuanAction;
  listTieuChuanAction = _listTieuChuanAction;
  editTieuChuanAction = _editTieuChuanAction;
  deleteTieuChuanAction = _deleteTieuChuanAction;

  // Các biến translate
  dataTranslate: any;

  @ViewChild("aside", { static: true }) public matSidenav: MatSidenav;
  @ViewChild("compTieuchuanio", { read: ViewContainerRef, static: true })
  public content: ViewContainerRef;
  settingsCommon = new SettingsCommon();
  constructor(
    public matsidenavService: MatsidenavService,
    public cfr: ComponentFactoryResolver,
    public dmFacadeService: DmFacadeService,
    public modalDialog: MatDialog,
    public commonService: CommonServiceShared,
    public thietlapFacadeService: ThietlapFacadeService,
    private translate: TranslateService
  ) { }

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
    await this.getAllTieuchuan();
  }

  // Cài đặt số phân trang trên gird
  async getPageSize() {
    // Get settings
    const pageSize: any = await this.thietlapFacadeService
      .getThietLapHeThongService()
      .getSettingKey({ key: ThietLapHeThong.defaultPageSize });
    this.settingsCommon.pageSettings.pageSize = +pageSize;
  }

  // get all Tieu chuan
  async getAllTieuchuan() {
    this.listData = await this.dmFacadeService
      .getTieuchuanService()
      .getFetchAll({ PageNumber: 1, PageSize: -1 });
    const listDataItems = this.listData.items;
    if (listDataItems) {
      listDataItems.map((tieuchuan, index) => {
        tieuchuan.serialNumber = index + 1;
      });
    }
    this.listTieuchuan = listDataItems;
  }

  // open sidebar execute insert
  public openTieuchuanIOSidebar() {
    this.matsidenavService.setTitle(
      this.dataTranslate.DANHMUC.tieuchuan.titleAdd
    );
    this.matsidenavService.setContentComp(DmTieuchuanIoComponent, "new");
    this.matsidenavService.open();
  }

  // edit open sidebar
  public editItemTieuchuan(event) {
    this.getItemByEvent(event);
    this.matsidenavService.setTitle(
      this.dataTranslate.DANHMUC.tieuchuan.titleEdit
    );
    this.matsidenavService.setContentComp(
      DmTieuchuanIoComponent,
      "edit",
      this.selectedItem
    );
    this.matsidenavService.open();
  }

  // delete
  public deleteTieuchuan(event) {
    this.getItemByEvent(event);
    const canDelete: string = this.dmFacadeService
      .getTieuchuanService()
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
      this.dataTranslate.DANHMUC.thamso.contentDelete,
      this.selectedItem.tentieuchuan
    );
    dialogRef.afterClosed().subscribe((result) => {
      if (result === "confirm") {
        this.dmFacadeService
          .getTieuchuanService()
          .deleteItem({ id: this.selectedItem.id })
          .subscribe(
            () => this.getAllTieuchuan(),
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

  // Convert string thành dd/mm/yyyy
  public convertTimeString(data) {
    if (data.thoigianbanhanh !== null) {
      const [year, month, day]: string[] = data.thoigianbanhanh.split("-");
      const awesomeDateTime = `${day}-${month}-${year}`;
      return awesomeDateTime;
    } else return null;
  }
  canDeleteDialog(sMsg: string) {
    this.commonService.canDeleteDialogService(sMsg);
  }

  // close
  public closeTieuchuanIOSidebar() {
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
    const target = event.currentTarget;
    const item = this.commonService.getByEvent(event, this.listTieuchuan);
    this.selectedItem = item;
  }

  // call method
  doFunction(methodName) {
    this[methodName]();
  }
}
