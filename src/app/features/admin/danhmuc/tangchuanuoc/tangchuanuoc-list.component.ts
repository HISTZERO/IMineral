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
import { HttpErrorResponse } from "@angular/common/http";
import { QueryCellInfoEventArgs } from "@syncfusion/ej2-grids";

import { MatSidenav } from "@angular/material/sidenav";
import { OutputTangchuanuocModel } from "src/app/models/admin/danhmuc/tangchuanuoc.model";
import { DmTangchuanuocIoComponent } from "src/app/features/admin/danhmuc/tangchuanuoc/tangchuanuoc-io.component";
import { DmFacadeService } from "src/app/services/admin/danhmuc/danhmuc-facade.service";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { ThietlapFacadeService } from "src/app/services/admin/thietlap/thietlap-facade.service";
import {
  _addTangChuaNuocAction,
  _listTangChuaNuocAction,
  _editTangChuaNuocAction,
  _deleteTangChuaNuocAction,
} from "src/app/shared/constants/actions/danhmuc/tangchuanuoc";
import { MenuDanhMucTangChuaNuoc } from "src/app/shared/constants/sub-menus/danhmuc/danhmuc";

@Component({
  selector: "app-tangchuanuoc-list",
  templateUrl: "./tangchuanuoc-list.component.html",
  styleUrls: ["./tangchuanuoc-list.component.scss"],
})
export class DmTangchuanuocListComponent implements OnInit {
  public listDulieu: any;
  public listTangchuanuoc: OutputTangchuanuocModel[];
  public selectedItem: OutputTangchuanuocModel;
  public navArray = MenuDanhMucTangChuaNuoc;

  // Danh sách các quyền
  addTangChuaNuocAction = _addTangChuaNuocAction;
  listTangChuaNuocAction = _listTangChuaNuocAction;
  editTangChuaNuocAction = _editTangChuaNuocAction;
  deleteTangChuaNuocAction = _deleteTangChuaNuocAction;

  @ViewChild("aside", { static: true }) public matSidenav: MatSidenav;
  @ViewChild("compnTangchuanuocio", { read: ViewContainerRef, static: true })
  public content: ViewContainerRef;

  settingsCommon = new SettingsCommon();
  dataTranslate: any;

  constructor(
    public matsidenavService: MatsidenavService,
    public cfr: ComponentFactoryResolver,
    public dmFacadeService: DmFacadeService,
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
    await this.getAllTangchuanuoc();
  }

  // Cài đặt số phân trang trên gird
  async getPageSize() {
    // Get settings
    const pageSize: any = await this.thietlapFacadeService
      .getThietLapHeThongService()
      .getSettingKey({ key: ThietLapHeThong.defaultPageSize });
    this.settingsCommon.pageSettings.pageSize = +pageSize;
  }

  // get all
  async getAllTangchuanuoc() {
    this.listDulieu = await this.dmFacadeService
      .getTangchuanuocService()
      .getFetchAll({ PageNumber: 1, PageSize: -1 });
    const listDataItems = this.listDulieu.items;
    if (listDataItems) {
      listDataItems.map((tangchuanuoc, index) => {
        tangchuanuoc.serialNumber = index + 1;
      });
    }
    this.listTangchuanuoc = listDataItems;
  }

  // open sidebar excute insert
  public openTangchuanuocIOSidebar() {
    this.matsidenavService.setTitle(
      this.dataTranslate.DANHMUC.tangchuanuoc.titleAdd
    );
    this.matsidenavService.setContentComp(DmTangchuanuocIoComponent, "new");
    this.matsidenavService.open();
  }

  // open sidebar edit
  public openTangchuanuocIOSidebarEdit(event) {
    this.getItemByEvent(event);
    this.matsidenavService.setTitle(
      this.dataTranslate.DANHMUC.tangchuanuoc.titleEdit
    );
    this.matsidenavService.setContentComp(
      DmTangchuanuocIoComponent,
      "edit",
      this.selectedItem
    );
    this.matsidenavService.open();
  }

  // close sidebar
  public closeTangchuanuocIOSidebar() {
    this.matsidenavService.close();
  }

  // getItemByEvent
  private getItemByEvent(event) {
    const item = this.commonService.getByEvent(event, this.listTangchuanuoc);
    this.selectedItem = item;
  }

  // delete
  public deleteTangchuanuoc(event) {
    this.getItemByEvent(event);
    const canDelete: string = this.dmFacadeService
      .getTangchuanuocService()
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
      this.dataTranslate.DANHMUC.tangchuanuoc.contentDelete,
      this.selectedItem.tentangchuanuoc
    );
    dialogRef.afterClosed().subscribe((result) => {
      if (result === "confirm") {
        this.dmFacadeService
          .getTangchuanuocService()
          .deleteItem({ id: this.selectedItem.id })
          .subscribe(
            () => this.refreshListTangchuanuoc(),
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

  // refresh grid
  public refreshListTangchuanuoc() {
    this.getAllTangchuanuoc();
  }

  // set id in coloumn
  customiseCell(args: QueryCellInfoEventArgs) {
    if (args.column.field === "id") {
      args.cell.id = args.data[args.column.field];
    }
  }

  // call method
  doFunction(methodName) {
    this[methodName]();
  }
}
