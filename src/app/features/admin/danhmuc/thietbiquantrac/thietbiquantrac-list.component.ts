import {
  Component,
  ComponentFactoryResolver,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from "@angular/core";
import { SettingsCommon } from "src/app/shared/constants/setting-common";
import { MatSidenav } from "@angular/material/sidenav";
import { MatDialog } from "@angular/material/dialog";
import { DmFacadeService } from "src/app/services/admin/danhmuc/danhmuc-facade.service";
import { QueryCellInfoEventArgs } from "@syncfusion/ej2-angular-grids";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { HttpErrorResponse } from "@angular/common/http";
import { ThietlapFacadeService } from "src/app/services/admin/thietlap/thietlap-facade.service";
import { OutputThietbiquantracModel } from "src/app/models/admin/danhmuc/thietbiquantrac.model";
import { DmThietbiquantracIoComponent } from "src/app/features/admin/danhmuc/thietbiquantrac/thietbiquantrac-io.component";
import { TranslateService } from "@ngx-translate/core";

import {
  _addThietBiQuanTracAction,
  _listThietBiQuanTracAction,
  _editThietBiQuanTracAction,
  _deleteThietBiQuanTracAction,
} from "src/app/shared/constants/actions/danhmuc/thietbiquantrac";
import { MenuDanhMucThietBiQuanTrac } from "src/app/shared/constants/sub-menus/danhmuc/danhmuc";

@Component({
  selector: "app-thietbiquantrac-list",
  templateUrl: "./thietbiquantrac-list.component.html",
  styleUrls: ["./thietbiquantrac-list.component.scss"],
})
export class DmThietbiquantracListComponent implements OnInit {
  public listThietbiquantrac: OutputThietbiquantracModel[];
  public selectedItem: OutputThietbiquantracModel;
  public listDuLieu: any;
  @ViewChild("aside", { static: true }) public matSidenav: MatSidenav;
  @ViewChild("compThietbiquantracio", { read: ViewContainerRef, static: true })
  public content: ViewContainerRef;
  public settingsCommon = new SettingsCommon();
  public navArray = MenuDanhMucThietBiQuanTrac;

  // Danh sách các quyền
  addThietBiQuanTracAction = _addThietBiQuanTracAction;
  listThietBiQuanTracAction = _listThietBiQuanTracAction;
  editThietBiQuanTracAction = _editThietBiQuanTracAction;
  deleteThietBiQuanTracAction = _deleteThietBiQuanTracAction;

  // Các biến translate
  dataTranslate: any;

  buttonArray = [];
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
    await this.getAllThietbiquantrac();
  }

  // get all thiet bi
  async getAllThietbiquantrac() {
    this.listDuLieu = await this.dmFacadeService
      .getDmThietbiquantracService()
      .getFetchAll({ PageNumber: 1, PageSize: -1 });
    const listDataItems = this.listDuLieu;
    if (listDataItems) {
      listDataItems.map((thietbiquantrac, index) => {
        thietbiquantrac.serialNumber = index + 1;
      });
    }
    this.listThietbiquantrac = listDataItems;
  }

  // open sidebar execute insert
  public openThietbiquantracIOSidebar() {
    this.matsidenavService.setTitle(
      this.dataTranslate.DANHMUC.thietbiquantrac.titleAdd
    );
    this.matsidenavService.setContentComp(DmThietbiquantracIoComponent, "new");
    this.matsidenavService.open();
  }

  // edit open sidebar
  public editItemThietbiquantrac(event) {
    this.getItemByEvent(event);
    this.matsidenavService.setTitle(
      this.dataTranslate.DANHMUC.thietbiquantrac.titleEdit
    );
    this.matsidenavService.setContentComp(
      DmThietbiquantracIoComponent,
      "edit",
      this.selectedItem
    );
    this.matsidenavService.open();
  }

  // delete
  public deleteThietbiquantrac(event) {
    this.getItemByEvent(event);
    const canDelete: string = this.dmFacadeService
      .getDmThietbiquantracService()
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
      this.dataTranslate.DANHMUC.thietbiquantrac.contentDelete,
      this.selectedItem.ten
    );
    dialogRef.afterClosed().subscribe((result) => {
      if (result === "confirm") {
        this.dmFacadeService
          .getDmThietbiquantracService()
          .deleteItem({ id: this.selectedItem.id })
          .subscribe(
            () => this.getAllThietbiquantrac(),
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
  public closeThietbiquantracIOSidebar() {
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
    const item = this.commonService.getByEvent(event, this.listThietbiquantrac);
    this.selectedItem = item;
  }

  // call method
  doFunction(methodName) {
    this[methodName]();
  }
}
