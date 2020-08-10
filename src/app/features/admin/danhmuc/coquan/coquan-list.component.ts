import { HttpErrorResponse } from "@angular/common/http";
import { TranslateService } from "@ngx-translate/core";
import {
  Component,
  ComponentFactoryResolver,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from "@angular/core";
import { QueryCellInfoEventArgs } from "@syncfusion/ej2-grids";
import { MatSidenav } from "@angular/material/sidenav";

import {
  SettingsCommon,
  ThietLapHeThong,
} from "src/app/shared/constants/setting-common";
import { DmCoquanIoComponent } from "src/app/features/admin/danhmuc/coquan/coquan-io.component";
import { OutputCoquantochucModel } from "src/app/models/admin/danhmuc/coquantochuc.model";
import { DmFacadeService } from "src/app/services/admin/danhmuc/danhmuc-facade.service";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { ThietlapFacadeService } from "src/app/services/admin/thietlap/thietlap-facade.service";
import {
  _addCoQuanToChucAction,
  _listCoQuanToChucAction,
  _editCoQuanToChucAction,
  _deleteCoQuanToChucAction,
} from "src/app/shared/constants/actions/danhmuc/coquan";
import {
  _listTinhAction,
  _listHuyenAction,
  _listXaAction,
} from "src/app/shared/constants/actions/danhmuc/dvhc";
import { MenuDanhMucCoQuan } from "src/app/shared/constants/sub-menus/danhmuc/danhmuc";

@Component({
  selector: "app-coquan-list",
  templateUrl: "./coquan-list.component.html",
  styleUrls: ["./coquan-list.component.scss"],
})
export class DmCoquanListComponent implements OnInit {
  listCoquantochuc: OutputCoquantochucModel[];
  selectedItem: OutputCoquantochucModel;
  listData: any;
  // Danh sách các quyền
  addCoQuanToChucAction = _addCoQuanToChucAction;
  listCoQuanToChucAction = _listCoQuanToChucAction;
  editCoQuanToChucAction = _editCoQuanToChucAction;
  deleteCoQuanToChucAction = _deleteCoQuanToChucAction;
  listTinhAction = _listTinhAction;
  listHuyenAction = _listHuyenAction;
  listXaAction = _listXaAction;
  navArray = MenuDanhMucCoQuan;

  // Các biến translate
  dataTranslate: any;

  @ViewChild("aside", { static: true }) public matSidenav: MatSidenav;
  @ViewChild("compcoquantochucio", { read: ViewContainerRef, static: true })
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

    this.settingsCommon.toolbar = ["Search"];
    this.matsidenavService.setSidenav(
      this.matSidenav,
      this,
      this.content,
      this.cfr
    );

    // Lấy dữ liệu truyền vào ejs grid tạo bảng
    await this.getPageSize();
    await this.getAllCoquan();
  }

  // Cài đặt số phân trang trên gird
  async getPageSize() {
    // Get settings
    const pageSize: any = await this.thietlapFacadeService
      .getThietLapHeThongService()
      .getSettingKey({ key: ThietLapHeThong.defaultPageSize });
    this.settingsCommon.pageSettings.pageSize = +pageSize;
  }

  // get all co quan
  async getAllCoquan() {
    this.listData = await this.dmFacadeSv
      .getDmCoquantochucService()
      .getFetchAll({ PageNumber: 1, PageSize: -1 });
    const listDataItems = this.listData.items;
    if (listDataItems) {
      listDataItems.map((coquan, index) => {
        coquan.serialNumber = index + 1;
      });
    }
    this.listCoquantochuc = listDataItems;
  }

  // open sidebar excute insert
  public openCoquantochucIOSidebar() {
    this.matsidenavService.setTitle(this.dataTranslate.DANHMUC.coquan.titleAdd);
    this.matsidenavService.setContentComp(DmCoquanIoComponent, "new");
    this.matsidenavService.open();
  }

  // open sidebar edit
  public openCoquantochucIOSidebarEdit(event) {
    this.getItemByEvent(event);
    this.matsidenavService.setTitle(
      this.dataTranslate.DANHMUC.coquan.titleEdit
    );
    this.matsidenavService.setContentComp(
      DmCoquanIoComponent,
      "edit",
      this.selectedItem
    );
    this.matsidenavService.open();
  }

  // close sidebar
  public closeCoquantochucIOSidebar() {
    this.matsidenavService.close();
  }

  // getItemByEvent
  private getItemByEvent(event) {
    const item = this.commonService.getByEvent(event, this.listCoquantochuc);
    this.selectedItem = item;
  }

  // delete
  public deleteCoquantochuc(event) {
    this.getItemByEvent(event);
    const canDelete: string = this.dmFacadeSv
      .getDmCoquantochucService()
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
      this.dataTranslate.DANHMUC.coquan.contentDelete,
      this.selectedItem.tencoquan
    );
    dialogRef.afterClosed().subscribe((result) => {
      if (result === "confirm") {
        this.dmFacadeSv
          .getDmCoquantochucService()
          .deleteItem({ id: this.selectedItem.id })
          .subscribe(
            () => this.refreshList(),
            (error: HttpErrorResponse) => {
              this.commonService.showeNotiResult(error.message, 2000);
            },
            () =>
              this.commonService.showeNotiResult(
                this.dataTranslate.DANHMUC.coquan.contentDelete,
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
  public refreshList() {
    this.getAllCoquan();
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
