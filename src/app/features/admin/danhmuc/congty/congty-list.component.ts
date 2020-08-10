import {
  Component,
  ComponentFactoryResolver,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from "@angular/core";
import { OutputCongtyModel } from "src/app/models/admin/danhmuc/congty.model";
import {
  SettingsCommon,
  ThietLapHeThong,
} from "src/app/shared/constants/setting-common";
import { DmCongtyIoComponent } from "src/app/features/admin/danhmuc/congty/congty-io.component";
import { MatSidenav } from "@angular/material/sidenav";
import { DmFacadeService } from "src/app/services/admin/danhmuc/danhmuc-facade.service";
import { QueryCellInfoEventArgs } from "@syncfusion/ej2-angular-grids";
import { TranslateService } from "@ngx-translate/core";
import { HttpErrorResponse } from "@angular/common/http";

import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { ThietlapFacadeService } from "src/app/services/admin/thietlap/thietlap-facade.service";
import {
  _addCongTyAction,
  _listCongTyAction,
  _editCongTyAction,
  _deleteCongTyAction,
} from "src/app/shared/constants/actions/danhmuc/congty";
import {
  _listTinhAction,
  _listHuyenAction,
  _listXaAction,
} from "src/app/shared/constants/actions/danhmuc/dvhc";
import { MenuDanhMucCongTy } from "src/app/shared/constants/sub-menus/danhmuc/danhmuc";
@Component({
  selector: "app-congty-list",
  templateUrl: "./congty-list.component.html",
  styleUrls: ["./congty-list.component.scss"],
})
export class DmCongtyListComponent implements OnInit {
  public listCompany: OutputCongtyModel[];
  public selectedItem: OutputCongtyModel;
  public listData: any;
  public navArray = MenuDanhMucCongTy;

  // Các biến translate
  public dataTranslate: any;

  // Danh sách các quyền
  addCongTyAction = _addCongTyAction;
  listCongTyAction = _listCongTyAction;
  editCongTyAction = _editCongTyAction;
  deleteCongTyAction = _deleteCongTyAction;
  listTinhAction = _listTinhAction;
  listHuyenAction = _listHuyenAction;
  listXaAction = _listXaAction;

  @ViewChild("aside", { static: true }) public matSidenav: MatSidenav;
  @ViewChild("compnCompanyio", { read: ViewContainerRef, static: true })
  public content: ViewContainerRef;
  settingsCommon = new SettingsCommon();

  constructor(
    public matsidenavService: MatsidenavService,
    public cfr: ComponentFactoryResolver,
    public dmFacadeSv: DmFacadeService,
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
    this.settingsCommon.toolbar = ["Search"]; // Lấy dữ liệu truyền vào ejs grid tạo bảng
    await this.getPageSize();
    await this.getAllCompany();
  }

  async getPageSize() {
    // Get settings
    const pageSize: any = await this.thietlapFacadeService
      .getThietLapHeThongService()
      .getSettingKey({ key: ThietLapHeThong.defaultPageSize });
    this.settingsCommon.pageSettings.pageSize = +pageSize;
  }

  // get all Company
  async getAllCompany() {
    this.listData = await this.dmFacadeSv
      .getDmCongtyService()
      .getFetchAll({ PageNumber: 1, PageSize: -1 });
    const listDataItems = this.listData.items;
    if (listDataItems) {
      listDataItems.map((congty, index) => {
        congty.serialNumber = index + 1;
      });
    }
    this.listCompany = listDataItems;
  }

  // open sidebar execute insert
  public openCompanyIOSidebar() {
    this.matsidenavService.setTitle(this.dataTranslate.DANHMUC.congty.titleAdd);
    this.matsidenavService.setContentComp(DmCongtyIoComponent, "new");
    this.matsidenavService.open();
  }

  // edit open sidebar
  public editItemCompany(event) {
    this.getItemByEvent(event);
    this.matsidenavService.setTitle(
      this.dataTranslate.DANHMUC.congty.titleEdit
    );
    this.matsidenavService.setContentComp(
      DmCongtyIoComponent,
      "edit",
      this.selectedItem
    );
    this.matsidenavService.open();
  }

  // delete
  public deleteCompany(event) {
    this.getItemByEvent(event);
    const canDelete: string = this.dmFacadeSv
      .getDmCongtyService()
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
      this.dataTranslate.DANHMUC.congty.contentDelete,
      this.selectedItem.tencongty
    );
    dialogRef.afterClosed().subscribe((result) => {
      if (result === "confirm") {
        this.dmFacadeSv
          .getDmCongtyService()
          .deleteItem({ id: this.selectedItem.id })
          .subscribe(
            () => this.getAllCompany(),
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
  public closeCompnayIOSidebar() {
    this.matSidenav.close();
  }

  // getItemByEvent
  private getItemByEvent(event) {
    const item = this.commonService.getByEvent(event, this.listCompany);
    this.selectedItem = item;
  }

  // set id in coloumn
  customiseCell(args: QueryCellInfoEventArgs) {
    if (args.column.field === "id") {
      args.cell.id = args.data[args.column.field];
    }
  }

  // refresh list company
  public refreshListCompany() {
    this.getAllCompany();
  }

  // call method
  doFunction(methodName) {
    this[methodName]();
  }
}
