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

import { OutputDuanModel } from "src/app/models/admin/danhmuc/duan.model";
import { DmDuanIoComponent } from "src/app/features/admin/danhmuc/duan/duan-io.component";
import { MatSidenav } from "@angular/material/sidenav";
import { DmFacadeService } from "src/app/services/admin/danhmuc/danhmuc-facade.service";
import { QueryCellInfoEventArgs } from "@syncfusion/ej2-grids";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { HttpErrorResponse } from "@angular/common/http";
import { ThietlapFacadeService } from "src/app/services/admin/thietlap/thietlap-facade.service";
import {
  _addDuAnAction,
  _listDuAnAction,
  _editDuAnAction,
  _deleteDuAnAction,
} from "src/app/shared/constants/actions/danhmuc/duan";
import { MenuDanhMucDuAn } from "src/app/shared/constants/sub-menus/danhmuc/danhmuc";

@Component({
  selector: "app-duan-list",
  templateUrl: "./duan-list.component.html",
  styleUrls: ["./duan-list.component.scss"],
})
export class DmDuanListComponent implements OnInit {
  public listData: any;
  public listDuan: OutputDuanModel[];
  public selectedItem: OutputDuanModel;
  public pageSize: any;
  public navArray = MenuDanhMucDuAn;

  // Biến dùng translate
  dataTranslate: any;

  // Danh sách các quyền
  addDuAnAction = _addDuAnAction;
  listDuAnAction = _listDuAnAction;
  editDuAnAction = _editDuAnAction;
  deleteDuAnAction = _deleteDuAnAction;

  @ViewChild("aside", { static: true }) public matSidenav: MatSidenav;
  @ViewChild("duanio", { read: ViewContainerRef, static: true })
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
    await this.getAllDuan();
  }

  // Cài đặt số phân trang trên gird
  async getPageSize() {
    // Get settings
    const pageSize: any = await this.thietlapFacadeService
      .getThietLapHeThongService()
      .getSettingKey({ key: ThietLapHeThong.defaultPageSize });
    this.pageSize = +pageSize;
    this.settingsCommon.pageSettings.pageSize = +pageSize;
  }

  // get all Loai so lieu
  async getAllDuan() {
    this.listData = await this.dmFacadeService
      .getDuanService()
      .getFetchAll({ PageNumber: 1, PageSize: -1 });
    const listDataItems = this.listData.items;
    if (listDataItems) {
      listDataItems.map((duan, index) => {
        duan.serialNumber = index + 1;
      });
    }
    this.listDuan = listDataItems;
  }
  // open sidebar excute insert
  public openDuanIOSidebar() {
    this.matsidenavService.setTitle(this.dataTranslate.DANHMUC.duan.titleAdd);
    this.matsidenavService.setContentComp(DmDuanIoComponent, "new");
    this.matsidenavService.open();
  }

  // open sidebar edit
  public openDuanIOSidebarEdit(event) {
    this.getItemByEvent(event);
    this.matsidenavService.setTitle(this.dataTranslate.DANHMUC.duan.titleEdit);
    this.matsidenavService.setContentComp(
      DmDuanIoComponent,
      "edit",
      this.selectedItem
    );
    this.matsidenavService.open();
  }

  // close sidebar
  public closeDuanIOSidebar() {
    this.matsidenavService.close();
  }

  // Convert string thành dd/mm/yyyy
  public convertTimeString(data) {
    if (data !== null) {
      const [year, month, day]: string[] = data.split("-");
      const awesomeDateTime = `${day}-${month}-${year}`;
      return awesomeDateTime;
    } else return null;
  }

  // getItemByEvent
  // Hàm lấy ra đối tượng khi người dùng click vào một trong 3 nút xóa, chi tiết, sửa
  public getItemByEvent(event) {
    const target = event.currentTarget;
    const pElement = target.parentElement.parentElement;
    const pclassID = pElement.getAttribute("id");
    const item = this.listDuan.find((x) => x.idProject === +pclassID);
    this.selectedItem = item;
  }

  // delete
  public deleteDuan(event) {
    this.getItemByEvent(event);
    const canDelete: string = this.dmFacadeService
      .getDuanService()
      .checkBeDeleted(this.selectedItem.idProject);
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
      this.dataTranslate.DANHMUC.duan.contentDelete,
      this.selectedItem.projectName
    );
    dialogRef.afterClosed().subscribe((result) => {
      if (result === "confirm") {
        this.dmFacadeService
          .getDuanService()
          .deleteItem({ id: this.selectedItem.idProject })
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
    this.getAllDuan();
  }

  // set id in coloumn
  customiseCell(args: QueryCellInfoEventArgs) {
    if (args.column.field === "idProject") {
      args.cell.id = args.data[args.column.field];
    }
  }

  // call method
  doFunction(methodName) {
    this[methodName]();
  }
}
