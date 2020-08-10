import {
  Component,
  ComponentFactoryResolver,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from "@angular/core";
import { MatSidenav } from "@angular/material/sidenav";
import { HttpErrorResponse } from "@angular/common/http";
import { TranslateService } from "@ngx-translate/core";
import {
  SettingsCommon,
  ThietLapHeThong,
} from "src/app/shared/constants/setting-common";
import { OutputNhomthamsoModel } from "src/app/models/admin/danhmuc/nhomthamso.model";
import { DmNhomthamsoIoComponent } from "src/app/features/admin/danhmuc/nhomthamso/nhomthamso-io.component";
import { DmFacadeService } from "src/app/services/admin/danhmuc/danhmuc-facade.service";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { ThietlapFacadeService } from "src/app/services/admin/thietlap/thietlap-facade.service";
import {
  _addNhomThamSoAction,
  _listNhomThamSoAction,
  _editNhomThamSoAction,
  _deleteNhomThamSoAction,
} from "src/app/shared/constants/actions/danhmuc/nhomthamso";
import { MenuDanhMucNhomThamSo } from "src/app/shared/constants/sub-menus/danhmuc/danhmuc";

@Component({
  selector: "app-nhomthamso-list",
  templateUrl: "./nhomthamso-list.component.html",
  styleUrls: ["./nhomthamso-list.component.scss"],
})
export class DmNhomthamsoListComponent implements OnInit {
  public listNhomthamso: OutputNhomthamsoModel[];
  public selectedItem: OutputNhomthamsoModel;
  public listDuLieu: any;
  public navArray = MenuDanhMucNhomThamSo;

  // Danh sách các quyền
  addNhomThamSoAction = _addNhomThamSoAction;
  listNhomThamSoAction = _listNhomThamSoAction;
  editNhomThamSoAction = _editNhomThamSoAction;
  deleteNhomThamSoAction = _deleteNhomThamSoAction;

  // Biến dùng translate
  dataTranslate: any;

  @ViewChild("aside", { static: true }) public matSidenav: MatSidenav;
  @ViewChild("compnhomthamsoio", { read: ViewContainerRef, static: true })
  public content: ViewContainerRef;
  settingsCommon = new SettingsCommon();

  constructor(
    public matSidenavService: MatsidenavService,
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

    this.matSidenavService.setSidenav(
      this.matSidenav,
      this,
      this.content,
      this.cfr
    );
    this.settingsCommon.toolbar = ["Search"];
    // Lấy dữ liệu truyền vào ejs grid tạo bảng
    await this.getAllNhomthamso();
  }

  // Hàm getAll Nhóm tham số đẻ binding dữ liệu lên EJS grid
  async getAllNhomthamso() {
    // Get settings
    const pageSize: any = await this.thietlapFacadeService
      .getThietLapHeThongService()
      .getSettingKey({ key: ThietLapHeThong.defaultPageSize });
    this.settingsCommon.pageSettings.pageSize = +pageSize;
    this.listDuLieu = await this.dmFacadeService
      .getNhomthamsoService()
      .getFetchAll({ PageNumber: 1, PageSize: -1 });
    const listDataItems = this.listDuLieu.items;
    if (listDataItems) {
      listDataItems.map((nhomthamso, index) => {
        nhomthamso.serialNumber = index + 1;
      });
    }
    this.listNhomthamso = listDataItems;
  }

  // Hàm đặt tiêu đề, Đặt content component và sau đó mở sidebar lên
  public openNhomThamsoIOSidebar() {
    this.matSidenavService.setTitle(
      this.dataTranslate.DANHMUC.nhomthamso.titleAdd
    );
    this.matSidenavService.setContentComp(DmNhomthamsoIoComponent, "new");
    this.matSidenavService.open();
  }

  // hàm dóng sidebar
  public closeNhomthamsoIOSidebar() {
    this.matSidenavService.close();
  }

  // Hàm xóa một bản ghi, được gọi khi nhấn nút xóa trên giao diện list
  async deleteItemNhomthamso(data) {
    // Phải check xem dữ liệu muốn xóa có đang được dùng ko, đang dùng thì ko xóa
    // Trường hợp dữ liệu có thể xóa thì Phải hỏi người dùng xem có muốn xóa không
    // Nếu đồng ý xóa
    const canDelete: string = this.dmFacadeService
      .getNhomthamsoService()
      .checkBeDeleted(data.id);
    this.canBeDeletedCheck(canDelete, data);
  }

  public canBeDeletedCheck(sMsg: string, data) {
    if (sMsg === "ok") {
      this.confirmDeleteDiaLog(data);
    } else {
      this.cantDeleteDialog(sMsg);
    }
  }

  confirmDeleteDiaLog(data) {
    const dialogRef = this.commonService.confirmDeleteDiaLogService(
      this.dataTranslate.DANHMUC.nhomthamso.contentDelete,
      data.tennhom
    );
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === "confirm") {
        await this.dmFacadeService
          .getNhomthamsoService()
          .deleteItem({ id: data.id })
          .subscribe(
            () => this.getAllNhomthamso(),
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

  cantDeleteDialog(sMsg: string) {
    this.commonService.canDeleteDialogService(sMsg);
  }

  // Hàm sửa thông tin chi tiết một bản ghi, được gọi khi nhấn nút xem chi tiết trên giao diện list
  public editItemNhomthamso(data) {
    this.matSidenavService.setTitle(
      this.dataTranslate.DANHMUC.nhomthamso.titleEdit
    );
    this.matSidenavService.setContentComp(
      DmNhomthamsoIoComponent,
      "edit",
      data
    );
    this.matSidenavService.open();
  }

  /*
  CodeBlock: Required Functions
  Các hàm dưới đây bắt buộc phải có
   */

  // Hàm dùng để gọi các hàm khác, truyền vào tên hàm cần thực thi
  doFunction(methodName) {
    this[methodName]();
  }

  /*
  End CodeBlock: Required Functions
   */
}
