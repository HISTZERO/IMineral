import { Component, ComponentFactoryResolver, Input, OnInit, Type, ViewChild, ViewContainerRef } from "@angular/core";
import { MatSidenav } from "@angular/material/sidenav";
import { TranslateService } from "@ngx-translate/core";
import { HttpErrorResponse } from "@angular/common/http";
import { GridComponent } from "@syncfusion/ej2-angular-grids";

import { SettingsCommon, ThietLapHeThong } from "src/app/shared/constants/setting-common";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { ThietlapFacadeService } from "src/app/services/admin/thietlap/thietlap-facade.service";
import { DangKyHoatDongKhoangSanFacadeService } from 'src/app/services/admin/dangkyhoatdongkhoangsan/dangkyhoatdongkhoangsan-facade.service';
import { KtksLoaikhoangsanIoComponent } from "src/app/features/admin/dangkyhoatdongkhoangsan/khaithackhoangsan/ktks-thongtindangky/ktks-loaikhoangsan/ktks-loaikhoangsan-io/ktks-loaikhoangsan-io.component";
import { OutputDkKhaiThacLoaiKhoangSan } from "src/app/models/admin/dangkyhoatdongkhoangsan/dangkykhaithac/dkkhaithacloaikhoangsan.model";

@Component({
  selector: 'app-ktks-loaikhoangsan-list',
  templateUrl: './ktks-loaikhoangsan-list.component.html',
  styleUrls: ['./ktks-loaikhoangsan-list.component.scss']
})
export class KtksLoaikhoangsanListComponent implements OnInit {

  // Viewchild template
  @ViewChild("gridDkKhaiThacLoaiKhoangSan", { static: false }) public gridDkKhaiThacLoaiKhoangSan: GridComponent;
  @ViewChild(Type, { static: true }) public matSidenav: MatSidenav;
  @ViewChild(Type, { read: ViewContainerRef, static: true }) public content: ViewContainerRef;

  // tslint:disable-next-line: no-input-rename
  @Input("allowAutoInit") allowAutoInit = true;

  // Chứa thiết lập grid
  public settingsCommon = new SettingsCommon();

  // Chứa dữ liệu danh sách đơn vị
  public listDkKhaiThacLoaiKhoangSan: OutputDkKhaiThacLoaiKhoangSan[];

  // Chứa dữ liệu đã chọn
  public selectedItem: OutputDkKhaiThacLoaiKhoangSan;

  // Chứa dữ liệu translate
  public dataTranslate: any;

  // Chứa dữ liệu Iddangkykhaithac
  public iddangkykhaithac: string;

  constructor(public matSidenavService: MatsidenavService,
    public cfr: ComponentFactoryResolver,
    public dangKyHoatDongKhoangSanFacadeService: DangKyHoatDongKhoangSanFacadeService,
    public commonService: CommonServiceShared,
    public thietlapFacadeService: ThietlapFacadeService,
    private translate: TranslateService) { }

  async ngOnInit() {
    this.getDataTranslate();

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
    await this.getAllDkKhaiThacLoaiKhoangSan();
  }

  /**
   * Hàm lấy dữ liệu Dvdc
   */
  async getAllDkKhaiThacLoaiKhoangSan() {
    if (this.iddangkykhaithac === null || this.iddangkykhaithac === undefined) {
      return;
    }

    const listData: any = await this.dangKyHoatDongKhoangSanFacadeService
      .getDangKyKhaiThacLoaiKhoangSanService()
      .getDangKyKhaiThacLoaiKhoangSanByIdDangKyKhaiThac(this.iddangkykhaithac).toPromise();
    if (listData) {
      listData.map((loaiKhoangSan, index) => {
        loaiKhoangSan.serialNumber = index + 1;
      });
    }
    this.listDkKhaiThacLoaiKhoangSan = listData;
  }

  /**
   * Hàm load lại dữ liệu grid
   */
  public reloadDataGrid() {
    this.getAllDkKhaiThacLoaiKhoangSan();
  }

  /**
   * Hàm mở sidenav chức năng sửa dữ liệu
   * @param id
   */
  async editItemDkKhaiThacLoaiKhoangSan(id: any) {
    // Lấy dữ liệu cá nhân theo id
    const dataItem: any = await this.dangKyHoatDongKhoangSanFacadeService
      .getDangKyKhaiThacLoaiKhoangSanService()
      .getByid(id).toPromise();

    if (!dataItem) {
      this.commonService.showDialogWarning(this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkythamdoloaikhoangsan.informedNotExistedDangKyThamDoLoaiKhoangSan);
      return;
    }

    // clear Sidenav
    this.matSidenavService.clearSidenav();
    // Khởi tạo sidenav
    this.matSidenavService.setSidenav(this.matSidenav, this, this.content, this.cfr);
    await this.matSidenavService.setTitle(this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkythamdoloaikhoangsan.titleEdit);
    await this.matSidenavService.setContentComp(KtksLoaikhoangsanIoComponent, "edit", dataItem);
    await this.matSidenavService.open();
  }

  /**
   * Hàm mở sidenav chức năng thêm mới
   */
  public openDkKhaiThacLoaiKhoangSanIOSidenav() {
    // clear Sidenav
    this.matSidenavService.clearSidenav();
    // Khởi tạo sidenav
    this.matSidenavService.setSidenav(this.matSidenav, this, this.content, this.cfr);
    this.matSidenavService.setTitle(this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkythamdoloaikhoangsan.titleAdd);
    this.matSidenavService.setContentComp(KtksLoaikhoangsanIoComponent, "new", { iddangkykhaithac: this.iddangkykhaithac });
    this.matSidenavService.open();
  }

  /**
   *  Hàm xóa một bản ghi, được gọi khi nhấn nút xóa trên giao diện list
   */
  async deleteItemDangKyKhaiThacLoaiKhoangSan(data) {
    this.selectedItem = data;
    // Phải check xem dữ liệu muốn xóa có đang được dùng ko, đang dùng thì ko xóa
    // Trường hợp dữ liệu có thể xóa thì Phải hỏi người dùng xem có muốn xóa không
    // Nếu đồng ý xóa
    const canDelete: string = this.dangKyHoatDongKhoangSanFacadeService
      .getDangKyKhaiThacLoaiKhoangSanService()
      .checkBeDeleted(this.selectedItem.idkhaithacloaikhoangsan);
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
      this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkythamdoloaikhoangsan.contentDelete,
      this.selectedItem.tenloaikhoangsan
    );
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === "confirm") {
        await this.dangKyHoatDongKhoangSanFacadeService
          .getDangKyKhaiThacLoaiKhoangSanService()
          .deleteItem({ idkhaithacloaikhoangsan: this.selectedItem.idkhaithacloaikhoangsan })
          .subscribe(
            () => this.getAllDkKhaiThacLoaiKhoangSan(),
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
