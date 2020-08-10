import { TranslateService } from "@ngx-translate/core";
import { HttpErrorResponse } from "@angular/common/http";
import { QueryCellInfoEventArgs } from "@syncfusion/ej2-grids";
import {
  Component,
  ComponentFactoryResolver,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from "@angular/core";
import { MatSidenav } from "@angular/material/sidenav";

import {
  SettingsCommon,
  ThietLapHeThong,
} from "src/app/shared/constants/setting-common";
import { DmFacadeService } from "src/app/services/admin/danhmuc/danhmuc-facade.service";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { OutputDonvidoModel } from "src/app/models/admin/danhmuc/donvido.model";
import { DmDonvidoIoComponent } from "src/app/features/admin/danhmuc/donvido/donvido-io.component";
import { ThietlapFacadeService } from "src/app/services/admin/thietlap/thietlap-facade.service";
import {
  _addDonViDoAction,
  _listDonViDoAction,
  _editDonViDoAction,
  _deleteDonViDoAction,
} from "src/app/shared/constants/actions/danhmuc/donvido";
import { MenuDanhMucDonViDo } from "src/app/shared/constants/sub-menus/danhmuc/danhmuc";

@Component({
  selector: "app-donvido-list",
  templateUrl: "./donvido-list.component.html",
  styleUrls: ["./donvido-list.component.scss"],
})
export class DmDonvidoListComponent implements OnInit {
  listDonvido: OutputDonvidoModel[];
  selectedItem: OutputDonvidoModel;
  listData: any;
  navArray = MenuDanhMucDonViDo;

  // Các biến translate
  dataTranslate: any;

  // Danh sách các quyền
  addDonViDoAction = _addDonViDoAction;
  listDonViDoAction = _listDonViDoAction;
  editDonViDoAction = _editDonViDoAction;
  deleteDonViDoAction = _deleteDonViDoAction;

  buttonArray = [];
  @ViewChild("aside", { static: true }) public matSidenav: MatSidenav;
  @ViewChild("compDonvidoio", { read: ViewContainerRef, static: true })
  public content: ViewContainerRef;

  settingsCommon = new SettingsCommon();

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
    await this.getAllDonvido();
  }

  // Cài đặt số phân trang trên gird
  async getPageSize() {
    // Get settings
    const pageSize: any = await this.thietlapFacadeService
      .getThietLapHeThongService()
      .getSettingKey({ key: ThietLapHeThong.defaultPageSize });
    this.settingsCommon.pageSettings.pageSize = +pageSize;
  }

  // get all Loai so lieu
  async getAllDonvido() {
    this.listData = await this.dmFacadeService
      .getDonvidoService()
      .getFetchAll({ PageNumber: 1, PageSize: -1 });
    const listDataItems = this.listData.items;
    if (listDataItems) {
      listDataItems.map((donvido, index) => {
        donvido.serialNumber = index + 1;
      });
    }
    this.listDonvido = listDataItems;
  }
  // open sidebar excute insert
  public openDonvidoIOSidebar() {
    this.matsidenavService.setTitle(
      this.dataTranslate.DANHMUC.donvido.titleAdd
    );
    this.matsidenavService.setContentComp(DmDonvidoIoComponent, "new");
    this.matsidenavService.open();
  }

  // open sidebar edit
  public openDonvidoIOSidebarEdit(event) {
    this.getItemByEvent(event);
    this.matsidenavService.setTitle(
      this.dataTranslate.DANHMUC.donvido.titleEdit
    );
    this.matsidenavService.setContentComp(
      DmDonvidoIoComponent,
      "edit",
      this.selectedItem
    );
    this.matsidenavService.open();
  }

  // close sidebar
  public closeDonvidoIOSidebar() {
    this.matsidenavService.close();
  }

  // getItemByEvent
  private getItemByEvent(event) {
    const item = this.commonService.getByEvent(event, this.listDonvido);
    this.selectedItem = item;
  }

  // delete
  public deleteDonvido(event) {
    this.getItemByEvent(event);
    const canDelete: string = this.dmFacadeService
      .getLoaisolieuService()
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
      this.dataTranslate.DANHMUC.donvido.contentDelete,
      this.selectedItem.tendovido
    );
    dialogRef.afterClosed().subscribe((result) => {
      if (result === "confirm") {
        this.dmFacadeService
          .getDonvidoService()
          .deleteItem({ id: this.selectedItem.id })
          .subscribe(
            () => this.refreshList(),
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
  public refreshList() {
    this.getAllDonvido();
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
