import {
  Component,
  ComponentFactoryResolver,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { QueryCellInfoEventArgs } from "@syncfusion/ej2-grids";
import { TranslateService } from "@ngx-translate/core";
import { MatSidenav } from "@angular/material/sidenav";

import {
  SettingsCommon,
  ThietLapHeThong,
} from "src/app/shared/constants/setting-common";
import { DmLoaisolieuIoComponent } from "src/app/features/admin/danhmuc/loaisolieu/loaisolieu-io.component";
import { OutputLoaisolieuModel } from "src/app/models/admin/danhmuc/loaisolieu.model";
import { DmFacadeService } from "src/app/services/admin/danhmuc/danhmuc-facade.service";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { ThietlapFacadeService } from "src/app/services/admin/thietlap/thietlap-facade.service";
import {
  _addLoaiSoLieuAction,
  _listLoaiSoLieuAction,
  _editLoaiSoLieuAction,
  _deleteLoaiSoLieuAction,
} from "src/app/shared/constants/actions/danhmuc/loaisolieu";
import { MenuDanhMucLoaiSoLieu } from "src/app/shared/constants/sub-menus/danhmuc/danhmuc";

@Component({
  selector: "app-loaisolieu-list",
  templateUrl: "./loaisolieu-list.component.html",
  styleUrls: ["./loaisolieu-list.component.scss"],
})
export class DmLoaisolieuListComponent implements OnInit {
  public listLoaisolieu: OutputLoaisolieuModel[];
  public selectedItem: OutputLoaisolieuModel;
  public listData: any;
  public navArray = MenuDanhMucLoaiSoLieu;

  // Danh sách các quyền
  addLoaiSoLieuAction = _addLoaiSoLieuAction;
  listLoaiSoLieuAction = _listLoaiSoLieuAction;
  editLoaiSoLieuAction = _editLoaiSoLieuAction;
  deleteLoaiSoLieuAction = _deleteLoaiSoLieuAction;

  // Biến dùng translate
  public dataTranslate: any;

  @ViewChild("aside", { static: true }) public matSidenav: MatSidenav;
  @ViewChild("compLoaisolieuio", { read: ViewContainerRef, static: true })
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
    await this.getAllLoaisolieu();
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
  async getAllLoaisolieu() {
    this.listData = await this.dmFacadeService
      .getLoaisolieuService()
      .getFetchAll({ PageNumber: 1, PageSize: -1 });
    const listDataItems = this.listData.items;
    if (listDataItems) {
      listDataItems.map((loaisolieu, index) => {
        loaisolieu.serialNumber = index + 1;
      });
    }
    this.listLoaisolieu = listDataItems;
  }
  // open sidebar excute insert
  public openLoaisolieuIOSidebar() {
    this.matsidenavService.setTitle(
      this.dataTranslate.DANHMUC.loaisolieu.titleAdd
    );
    this.matsidenavService.setContentComp(DmLoaisolieuIoComponent, "new");
    this.matsidenavService.open();
  }

  // open sidebar edit
  public openLoaisolieuIOSidebarEdit(event) {
    this.getItemByEvent(event);
    this.matsidenavService.setTitle(
      this.dataTranslate.DANHMUC.loaisolieu.titleEdit
    );
    this.matsidenavService.setContentComp(
      DmLoaisolieuIoComponent,
      "edit",
      this.selectedItem
    );
    this.matsidenavService.open();
  }

  // close sidebar
  public closeLoaisolieuIOSidebar() {
    this.matsidenavService.close();
  }

  // getItemByEvent
  private getItemByEvent(event) {
    const item = this.commonService.getByEvent(event, this.listLoaisolieu);
    this.selectedItem = item;
  }

  // delete
  public deleteLoaisolieu(event) {
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
      this.dataTranslate.DANHMUC.loaisolieu.contentDelete,
      this.selectedItem.tenloaisolieu
    );
    dialogRef.afterClosed().subscribe((result) => {
      if (result === "confirm") {
        this.dmFacadeService
          .getLoaisolieuService()
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
    this.getAllLoaisolieu();
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
