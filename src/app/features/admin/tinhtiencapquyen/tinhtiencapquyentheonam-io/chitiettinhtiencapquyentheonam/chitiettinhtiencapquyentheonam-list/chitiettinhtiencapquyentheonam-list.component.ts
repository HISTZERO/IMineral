import { Component, ComponentFactoryResolver, Input, OnInit, Type, ViewChild, ViewContainerRef } from "@angular/core";
import { MatSidenav } from "@angular/material/sidenav";
import { TranslateService } from "@ngx-translate/core";
import { HttpErrorResponse } from "@angular/common/http";
import { GridComponent } from "@syncfusion/ej2-angular-grids";
import { SettingsCommon, ThietLapHeThong } from "src/app/shared/constants/setting-common";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";

import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { ThietlapFacadeService } from "src/app/services/admin/thietlap/thietlap-facade.service";
import { DefaultValue } from 'src/app/shared/constants/global-var';
import { OutputTtTinhTienTheoNamModel } from 'src/app/models/admin/tinhtiencapquyen/tttientheonam.model';
import { TinhTienCapQuyenFacadeService } from 'src/app/services/admin/tinhtiencapquyen/tinhtiencapquyen-facade.service';
import { ChitiettinhtiencapquyentheonamIoComponent} from 'src/app/features/admin/tinhtiencapquyen/tinhtiencapquyentheonam-io/chitiettinhtiencapquyentheonam/chitiettinhtiencapquyentheonam-io/chitiettinhtiencapquyentheonam-io.component';

@Component({
  selector: 'app-chitiettinhtiencapquyentheonam-list',
  templateUrl: './chitiettinhtiencapquyentheonam-list.component.html',
  styleUrls: ['./chitiettinhtiencapquyentheonam-list.component.scss']
})
export class ChitiettinhtiencapquyentheonamListComponent implements OnInit {
  // Viewchild template
  @ViewChild("gridChiTietTinhTienTheoNam", { static: false }) public gridChiTietTinhTienTheoNam: GridComponent;
  @ViewChild(Type, { static: true }) public matSidenav: MatSidenav;
  @ViewChild(Type, { read: ViewContainerRef, static: true }) public content: ViewContainerRef;

  // tslint:disable-next-line: no-input-rename
  @Input("allowAutoInit") allowAutoInit = true;

  // Chứa thiết lập grid
  public settingsCommon = new SettingsCommon();

  // Chứa dữ liệu danh sách đơn vị
  public listChiTietTinhTienTheoNam: OutputTtTinhTienTheoNamModel[] = [];

  // Chứa dữ liệu đã chọn
  public selectedItem: OutputTtTinhTienTheoNamModel;
  // disable Add button
  public disabledAddButton = false;
  // disable Reload button
  public disabledReloadButton = false;
  // Chứa dữ liệu translate
  public dataTranslate: any;

  // Chứa dữ liệu idtinhtiencapquyen
  public idtinhtiencapquyen: string;

  constructor(
    public matSidenavService: MatsidenavService,
    public cfr: ComponentFactoryResolver,
    public tinhTienCapQuyenFacadeService: TinhTienCapQuyenFacadeService,
    public commonService: CommonServiceShared,
    public thietlapFacadeService: ThietlapFacadeService,
    private translate: TranslateService) { }

  async ngOnInit() {
    await this.getDataTranslate();

    if (this.allowAutoInit) {
      await this.manualDataInit();
    }
  }

  async manualDataInit() {
    await this.getDataPageSize();
    return true;
  }

  /**
   * Hàm lấy dữ liệu translate
   */
  async getDataTranslate() {
    // Get all langs
    this.dataTranslate = await this.translate
      .getTranslation(this.translate.getDefaultLang())
      .toPromise();
  }

  /**
   * Hàm lấy dữ liệu pagesize số bản ghi hiển thị trên 1 trang
   */
  async getDataPageSize() {
    const dataSetting: any = await this.thietlapFacadeService
      .getThietLapHeThongService()
      .getByid(ThietLapHeThong.defaultPageSize).toPromise();
    if (dataSetting) {
      this.settingsCommon.pageSettings.pageSize = +dataSetting.settingValue;
    } else {
      this.settingsCommon.pageSettings.pageSize = 10;
    }
    // Gọi hàm lấy dữ liệu cá nhân
    await this.getAllChiTietTinhTienTheoNam();
  }

  setDataChiTietTinhTienTheoNam(data: any[]) {
    if (data && data.length > DefaultValue.Zero) {
      data.map((loaiKhoangSan, index) => {
        loaiKhoangSan.serialNumber = index + 1;
      });

      this.listChiTietTinhTienTheoNam = data;
    } else {
      this.listChiTietTinhTienTheoNam = [];
    }
  }

  /**
   * Hàm lấy dữ liệu Dvdc
   */
  async getAllChiTietTinhTienTheoNam() {
    if (this.idtinhtiencapquyen === DefaultValue.Null || this.idtinhtiencapquyen === DefaultValue.Undefined
      || this.idtinhtiencapquyen.trim() === DefaultValue.Empty) {
      return;
    }

    const data: any = await this.tinhTienCapQuyenFacadeService
    .getChiTietTinhTienTheoNamService()
      .getChiTietTinhTienTheoNamByIdTinhTienCapQuyen(this.idtinhtiencapquyen).toPromise();
    if (data && data.list) {
      data.list.map((item, index) => {
        item.serialNumber = index + 1;
      });
    }
    this.listChiTietTinhTienTheoNam = data.list;
  }


  /**
   * Hàm load lại dữ liệu grid
   */
  public reloadDataGrid() {
    this.getAllChiTietTinhTienTheoNam();
  }

  /**
   * Hàm mở sidenav chức năng sửa dữ liệu
   * @param id
   */
  async editItemChiTietTinhTienTheoNam(id: any) {
    // Lấy dữ liệu cá nhân theo id
    const dataItem: any = await this.tinhTienCapQuyenFacadeService
      .getChiTietTinhTienTheoNamService()
      .getByid(id).toPromise();

    if (!dataItem) {
      this.commonService.showDialogWarning(this.dataTranslate.TINHTIENCAPQUYEN.chitiettinhtiencapquyentheonam.informedNotExistedChiTietTinhTienTheoNam);
      return;
    }

    // clear Sidenav
    this.matSidenavService.clearSidenav();
    // Khởi tạo sidenav
    this.matSidenavService.setSidenav(this.matSidenav, this, this.content, this.cfr);
    await this.matSidenavService.setTitle(this.dataTranslate.TINHTIENCAPQUYEN.chitiettinhtiencapquyentheonam.titleEdit);
    await this.matSidenavService.setContentComp(ChitiettinhtiencapquyentheonamIoComponent, "edit", dataItem);
    await this.matSidenavService.open();
  }

  /**
   * Hàm mở sidenav chức năng thêm mới
   */
  public openChiTietTinhTienTheoNamIOSidenav() {
    // clear Sidenav
    this.matSidenavService.clearSidenav();
    // Khởi tạo sidenav
    this.matSidenavService.setSidenav(this.matSidenav, this, this.content, this.cfr);
    this.matSidenavService.setTitle(this.dataTranslate.TINHTIENCAPQUYEN.chitiettinhtiencapquyentheonam.titleAdd);
    this.matSidenavService.setContentComp(ChitiettinhtiencapquyentheonamIoComponent, "new", { idtinhtiencapquyen: this.idtinhtiencapquyen });
    this.matSidenavService.open();
  }

  /**
   *  Hàm xóa một bản ghi, được gọi khi nhấn nút xóa trên giao diện list
   */
  async deleteItemChiTietTinhTienTheoNam(data) {
    this.selectedItem = data;
    // Phải check xem dữ liệu muốn xóa có đang được dùng ko, đang dùng thì ko xóa
    // Trường hợp dữ liệu có thể xóa thì Phải hỏi người dùng xem có muốn xóa không
    // Nếu đồng ý xóa
    const canDelete: string = this.tinhTienCapQuyenFacadeService
      .getChiTietTinhTienTheoNamService()
      .checkBeDeleted(this.selectedItem.idtientheonam);
    this.canBeDeletedCheck(canDelete);
  }

  /**
   * Hàm check điều kiện xóa bản ghi
   * @param sMsg
   */
  public canBeDeletedCheck(sMsg: string) {
    if (sMsg === "ok") {
      this.confirmDeleteDiaLog();
    } else {
      this.cantDeleteDialog(sMsg);
    }
  }

  /**
   * Hàm thực hiện chức năng xóa bản ghi và thông báo xóa thành công
   */
  confirmDeleteDiaLog() {
    const dialogRef = this.commonService.confirmDeleteDiaLogService(
      this.dataTranslate.TINHTIENCAPQUYEN.chitiettinhtiencapquyentheonam.contentDelete,
      this.selectedItem.namnoptien ? this.selectedItem.namnoptien.toString() : DefaultValue.Empty
    );
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === "confirm") {
        await this.tinhTienCapQuyenFacadeService
          .getChiTietTinhTienTheoNamService()
          .deleteItem({ idtientheonam: this.selectedItem.idtientheonam })
          .subscribe(
            () => this.getAllChiTietTinhTienTheoNam(),
            (error: HttpErrorResponse) => {
              this.commonService.showDialogWarning(error.error.errors);
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

  /**
   * Hàm thông báo không thể xóa
   */
  cantDeleteDialog(sMsg: string) {
    this.commonService.canDeleteDialogService(sMsg);
  }

  // Hàm dùng để gọi các hàm khác, truyền vào tên hàm cần thực thi
  doFunction(methodName) {
    this[methodName]();
  }
}
