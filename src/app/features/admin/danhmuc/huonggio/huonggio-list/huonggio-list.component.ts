import {
  Component,
  ComponentFactoryResolver,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { HttpErrorResponse } from "@angular/common/http";

import { MatSidenav } from "@angular/material/sidenav";
import { SettingsCommon, ThietLapHeThong } from "src/app/shared/constants/setting-common";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { DmFacadeService } from "src/app/services/admin/danhmuc/danhmuc-facade.service";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { ThietlapFacadeService } from "src/app/services/admin/thietlap/thietlap-facade.service";
import { OutputHuonggioModel } from "src/app/models/admin/danhmuc/huonggio.model";
import { HuonggioIoComponent } from "src/app/features/admin/danhmuc/huonggio/huonggio-io/huonggio-io.component";
import {
  _addHuongGioAction,
  _listHuongGioAction,
  _editHuongGioAction,
  _deleteHuongGioAction,
} from "src/app/shared/constants/actions/danhmuc/huonggio";
import { MenuDanhMucHuongGio } from "src/app/shared/constants/sub-menus/danhmuc/danhmuc";

@Component({
  selector: "app-huonggio-list",
  templateUrl: "./huonggio-list.component.html",
  styleUrls: ["./huonggio-list.component.scss"],
})
export class HuonggioListComponent implements OnInit {
  public listHuonggio: OutputHuonggioModel[];
  public listData: any;
  public navArray = MenuDanhMucHuongGio;

  // Biến dùng translate
  dataTranslate: any;

  // Danh sách các quyền
  addHuongGioAction = _addHuongGioAction;
  listHuongGioAction = _listHuongGioAction;
  editHuongGioAction = _editHuongGioAction;
  deleteHuongGioAction = _deleteHuongGioAction;

  @ViewChild("aside", { static: true }) public matSidenav: MatSidenav;
  @ViewChild("compHuonggioio", { read: ViewContainerRef, static: true })
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
    await this.getAllHuonggio();
  }

  // get all Loai so lieu
  async getAllHuonggio() {
    const pageSize: any = await this.thietlapFacadeService
      .getThietLapHeThongService()
      .getSettingKey({ key: ThietLapHeThong.defaultPageSize });
    this.settingsCommon.pageSettings.pageSize = +pageSize;
    this.listData = await this.dmFacadeService
      .getHuonggioService()
      .getFetchAll();
    const listDataItems = this.listData;
    if (listDataItems) {
      listDataItems.map((donvido, index) => {
        donvido.serialNumber = index + 1;
      });
    }
    this.listHuonggio = listDataItems;
  }
  // open sidebar excute insert
  public openHuonggioIOSidebar() {
    this.matsidenavService.setTitle(
      this.dataTranslate.DANHMUC.huonggio.titleAdd
    );
    this.matsidenavService.setContentComp(HuonggioIoComponent, "new");
    this.matsidenavService.open();
  }

  // open sidebar edit
  public openHuonggioIOSidebarEdit(data) {
    this.matsidenavService.setTitle(
      this.dataTranslate.DANHMUC.huonggio.titleEdit
    );
    this.matsidenavService.setContentComp(HuonggioIoComponent, "edit", data);
    this.matsidenavService.open();
  }

  // close sidebar
  public closeHuonggioIOSidebar() {
    this.matsidenavService.close();
  }
  // delete
  public deleteHuonggio(data) {
    const canDelete: string = this.dmFacadeService
      .getLoaisolieuService()
      .checkBeDeleted(data.id);
    this.canBeDeletedCheck(canDelete, data);
  }

  public canBeDeletedCheck(sMsg: string, data) {
    if (sMsg === "ok") {
      this.confirmDeleteDiaLog(data);
    } else {
      this.canDeleteDialog(sMsg);
    }
  }

  confirmDeleteDiaLog(data) {
    const dialogRef = this.commonService.confirmDeleteDiaLogService(
      this.dataTranslate.DANHMUC.huonggio.contentDelete,
      data.tenhuonggio
    );
    dialogRef.afterClosed().subscribe((result) => {
      if (result === "confirm") {
        this.dmFacadeService
          .getHuonggioService()
          .deleteItem({ id: data.id })
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
    this.getAllHuonggio();
  }
  // call method
  doFunction(methodName) {
    this[methodName]();
  }
}
