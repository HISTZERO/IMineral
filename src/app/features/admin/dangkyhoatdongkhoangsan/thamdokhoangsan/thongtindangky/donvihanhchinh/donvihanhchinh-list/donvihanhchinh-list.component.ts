import { Component, ComponentFactoryResolver, Input, OnInit, Type, ViewChild, ViewContainerRef} from "@angular/core";
import { MatSidenav } from "@angular/material/sidenav";
import { TranslateService } from "@ngx-translate/core";
import { HttpErrorResponse } from "@angular/common/http";
import { GridComponent } from "@syncfusion/ej2-angular-grids";
import { FormGroup, FormBuilder } from "@angular/forms";
import { SettingsCommon, ThietLapHeThong } from "src/app/shared/constants/setting-common";
import { OutputDkThamDoDvhc } from "src/app/models/admin/dangkyhoatdongkhoangsan/dkthamdodvhc.model";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { DangKyHoatDongKhoangSanFacadeService } from "src/app/services/admin/dangkyhoatdongkhoangsan/dangkyhoatdongkhoangsan-facade.service";
import { DonvihanhchinhIoComponent } from "src/app/features/admin/dangkyhoatdongkhoangsan/thamdokhoangsan/thongtindangky/donvihanhchinh/donvihanhchinh-io/donvihanhchinh-io.component";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { ThietlapFacadeService } from "src/app/services/admin/thietlap/thietlap-facade.service";
import {GeneralClientService} from "src/app/services/admin/common/general-client.service";
import { Paging } from 'src/app/shared/constants/enum';

@Component({
  selector: 'app-donvihanhchinh-list',
  templateUrl: './donvihanhchinh-list.component.html',
  styleUrls: ['./donvihanhchinh-list.component.scss']
})
export class DonvihanhchinhListComponent implements OnInit {
  @ViewChild("gridDangKyThamDoDvhc", { static: false }) public gridDangKyThamDoDvhc: GridComponent;
  @ViewChild(Type, { static: true }) public matSidenav: MatSidenav;
  @ViewChild(Type, { read: ViewContainerRef, static: true }) public content: ViewContainerRef;

  // Chứa thiết lập grid
  public settingsCommon = new SettingsCommon();

  // Chứa dữ liệu danh sách đơn vị
  public listDangKyThamDoDvhc: OutputDkThamDoDvhc[];

    // Chứa dữ liệu đã chọn
    public selectedItem: OutputDkThamDoDvhc;

  // Chứa dữ liệu translate
  public dataTranslate: any;

  // Chứa dữ liệu Iddangkythamdo
  public iddangkythamdo: string;

  // tslint:disable-next-line: no-input-rename
  @Input("allowAutoInit") allowAutoInit = true;

  constructor(public matSidenavService: MatsidenavService,
              public cfr: ComponentFactoryResolver,
              public dangKyHoatDongKhoangSanFacadeService: DangKyHoatDongKhoangSanFacadeService,
              public commonService: CommonServiceShared,
              public thietlapFacadeService: ThietlapFacadeService,
              private translate: TranslateService,
              public formBuilder: FormBuilder) { }

  async ngOnInit() {
    this.getDataTranslate();

    if (this.allowAutoInit) {
      await this.manualDataInit();
    }
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
      .getByid(ThietLapHeThong.defaultPageSize ).toPromise();
    if (dataSetting) {
      this.settingsCommon.pageSettings.pageSize = +dataSetting.settingValue;
    } else {
      this.settingsCommon.pageSettings.pageSize = 10;
    }
    // Gọi hàm lấy dữ liệu cá nhân
    await this.getAllDangKyThamDoDvhc();
  }

  async manualDataInit() {
    await this.getDataPageSize();
    return true;
  }

  /**
   * Hàm lấy dữ liệu Dvdc
   */
  async getAllDangKyThamDoDvhc() {
    if (this.iddangkythamdo === null || this.iddangkythamdo === undefined) {
      return;
    }

    const listData: any = await this.dangKyHoatDongKhoangSanFacadeService
      .getDangKyThamDoDvhcService()
      .getDangKyThamDoDvhcByIdDangKyThamDo(this.iddangkythamdo);
    if (listData.items) {
      listData.items.map((dvhc, index) => {
        dvhc.serialNumber = index + 1;
      });
    }
    this.listDangKyThamDoDvhc = listData.items;
  }

  /**
   * Hàm load lại dữ liệu grid
   */
  public reloadDataGrid() {
    this.getAllDangKyThamDoDvhc();
  }

  /**
   * Hàm mở sidenav chức năng sửa dữ liệu
   * @param id
   */
  async editItemDangKyThamDoDvhc(id: any) {
    // Lấy dữ liệu cá nhân theo id
    const dataItem: any = await this.dangKyHoatDongKhoangSanFacadeService
    .getDangKyThamDoDvhcService()
    .getByid(id).toPromise();

    if (!dataItem) {
      this.commonService.showDialogWarning(this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkythamdodvhc.informedNotExistedDangKyThamDoDvhc);
      return;
    }

    // clear Sidenav
    this.matSidenavService.clearSidenav();
    // Khởi tạo sidenav
    this.matSidenavService.setSidenav(this.matSidenav, this, this.content, this.cfr);
    await this.matSidenavService.setTitle( this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkythamdodvhc.titleEdit );
    await this.matSidenavService.setContentComp(DonvihanhchinhIoComponent, "edit", dataItem);
    await this.matSidenavService.open();
  }

  /**
   * Hàm mở sidenav chức năng thêm mới
   */
  public openDangKyThamDoDvhcIOSidenav() {
    // clear Sidenav
    this.matSidenavService.clearSidenav();
    // Khởi tạo sidenav
    this.matSidenavService.setSidenav(this.matSidenav, this, this.content, this.cfr);
    this.matSidenavService.setTitle(this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkythamdodvhc.titleAdd);
    this.matSidenavService.setContentComp(DonvihanhchinhIoComponent, "new");
    this.matSidenavService.open();
  }

  /**
   *  Hàm xóa một bản ghi, được gọi khi nhấn nút xóa trên giao diện list
   */
  async deleteItemDangKyThamDoDvhc(data) {
    this.selectedItem = data;
    // Phải check xem dữ liệu muốn xóa có đang được dùng ko, đang dùng thì ko xóa
    // Trường hợp dữ liệu có thể xóa thì Phải hỏi người dùng xem có muốn xóa không
    // Nếu đồng ý xóa
    const canDelete: string = this.dangKyHoatDongKhoangSanFacadeService
      .getDangKyThamDoDvhcService()
      .checkBeDeleted(this.selectedItem.idthamdodvhc);
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
      this.dataTranslate.DANHMUC.linhvuc.contentDelete,
      this.selectedItem.tenTinh + " - " + this.selectedItem.tenHuyen + " - " + this.selectedItem.tenXa
    );
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === "confirm") {
        await this.dangKyHoatDongKhoangSanFacadeService
          .getDangKyThamDoDvhcService()
          .deleteItem({ idthamdodvhc: this.selectedItem.idthamdodvhc })
          .subscribe(
            () => this.getAllDangKyThamDoDvhc(),
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
