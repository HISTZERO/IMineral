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
import { OutputThamsoModel } from "src/app/models/admin/danhmuc/thamso.model";
import { MatSidenav } from "@angular/material/sidenav";
import { MatDialog } from "@angular/material/dialog";
import { TranslateService } from "@ngx-translate/core";

import { DmThamsoIoComponent } from "src/app/features/admin/danhmuc/thamso/thamso-io.component";
import { DmFacadeService } from "src/app/services/admin/danhmuc/danhmuc-facade.service";
import { QueryCellInfoEventArgs } from "@syncfusion/ej2-angular-grids";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { HttpErrorResponse } from "@angular/common/http";
import { ThietlapFacadeService } from "src/app/services/admin/thietlap/thietlap-facade.service";
import {
  _addThamSoAction,
  _listThamSoAction,
  _editThamSoAction,
  _deleteThamSoAction,
} from "src/app/shared/constants/actions/danhmuc/thamso";
import { _listDonViDoAction } from "src/app/shared/constants/actions/danhmuc/donvido";
import { _listNhomThamSoAction } from "src/app/shared/constants/actions/danhmuc/nhomthamso";
import { translateConstants } from "src/app/shared/constants/translate-constants";
import { MenuDanhMucThamSo } from "src/app/shared/constants/sub-menus/danhmuc/danhmuc";
@Component({
  selector: "app-thamso-list",
  templateUrl: "./thamso-list.component.html",
  styleUrls: ["./thamso-list.component.scss"],
})
export class DmThamsoListComponent implements OnInit {
  public listThamso: OutputThamsoModel[];
  public selectedItem: OutputThamsoModel;
  public listDuLieu: any;
  @ViewChild("aside", { static: true }) public matSidenav: MatSidenav;
  @ViewChild("compThamsoio", { read: ViewContainerRef, static: true })
  public content: ViewContainerRef;
  public settingsCommon = new SettingsCommon();
  public navArray = MenuDanhMucThamSo;

  // Danh sách các quyền
  addThamSoAction = _addThamSoAction;
  listThamSoAction = _listThamSoAction;
  editThamSoAction = _editThamSoAction;
  deleteThamSoAction = _deleteThamSoAction;
  listDonViDoAction = _listDonViDoAction;
  listNhomThamSoAction = _listNhomThamSoAction;

  // Các biến translate
  dataTranslate: any;

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
    await this.getAllThamso();
  }

  // Cài đặt số phân trang trên gird
  async getPageSize() {
    // Get settings
    const pageSize: any = await this.thietlapFacadeService
      .getThietLapHeThongService()
      .getSettingKey({ key: ThietLapHeThong.defaultPageSize });
    this.settingsCommon.pageSettings.pageSize = +pageSize;
  }

  // get all tham so
  async getAllThamso() {
    this.listDuLieu = await this.dmFacadeService
      .getThamsoService()
      .getFetchAll({ PageNumber: 1, PageSize: -1 });
    const listDataItems = this.listDuLieu.items;
    if (listDataItems) {
      listDataItems.map((thamso, index) => {
        thamso.serialNumber = index + 1;
      });
    }
    this.listThamso = listDataItems;
  }

  // open sidebar execute insert
  public openThamsoIOSidebar() {
    this.matsidenavService.setTitle(this.dataTranslate.DANHMUC.thamso.titleAdd);
    this.matsidenavService.setContentComp(DmThamsoIoComponent, "new");
    this.matsidenavService.open();
  }

  // edit open sidebar
  async editItemThamso(event) {
    await this.dmFacadeService
      .getThamsoService()
      .getByid(event.id)
      .subscribe((res) => {
        this.matsidenavService.setTitle(
          this.dataTranslate.DANHMUC.thamso.titleEdit
        );
        this.matsidenavService.setContentComp(DmThamsoIoComponent, "edit", res);
        this.matsidenavService.open();
      });
  }

  // delete
  public deleteThamso(event) {
    this.getItemByEvent(event);
    const canDelete: string = this.dmFacadeService
      .getThamsoService()
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
      this.selectedItem.tenthamso
    );
    dialogRef.afterClosed().subscribe((result) => {
      if (result === "confirm") {
        this.dmFacadeService
          .getThamsoService()
          .deleteItem({ id: this.selectedItem.id })
          .subscribe(
            () => this.getAllThamso(),
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
  public closeThamsoIOSidebar() {
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
    const item = this.commonService.getByEvent(event, this.listThamso);
    this.selectedItem = item;
  }

  // call method
  doFunction(methodName) {
    this[methodName]();
  }
}
