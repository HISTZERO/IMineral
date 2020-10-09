import {Component, ComponentFactoryResolver, Input, OnInit, Type, ViewChild, ViewContainerRef} from '@angular/core';
import {GridComponent, TextWrapSettingsModel} from "@syncfusion/ej2-angular-grids";
import {MatSidenav} from "@angular/material/sidenav";
import {SettingsCommon, ThietLapHeThong} from "src/app/shared/constants/setting-common";
import {OutputDkKhaiThacCongTrinh} from "src/app/models/admin/dangkyhoatdongkhoangsan/dkkhaithaccongtrinh.model";
import {MatsidenavService} from "src/app/services/utilities/matsidenav.service";
import {DangKyHoatDongKhoangSanFacadeService} from "src/app/services/admin/dangkyhoatdongkhoangsan/dangkyhoatdongkhoangsan-facade.service";
import {CommonServiceShared} from "src/app/services/utilities/common-service";
import {ThietlapFacadeService} from "src/app/services/admin/thietlap/thietlap-facade.service";
import {TranslateService} from "@ngx-translate/core";
import {KtksCongtrinhkhaithacIoComponent} from "src/app/features/admin/dangkyhoatdongkhoangsan/khaithackhoangsan/ktks-thongtindangky/ktks-congtrinhkhaithac/ktks-congtrinhkhaithac-io/ktks-congtrinhkhaithac-io.component";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-dcm-congtrinhkhaithac-list',
  templateUrl: './dcm-congtrinhkhaithac-list.component.html',
  styleUrls: ['./dcm-congtrinhkhaithac-list.component.scss']
})
export class DcmCongtrinhkhaithacListComponent implements OnInit {


  // Viewchild template
  @ViewChild("gridDkKhaiThacCongTrinh", { static: false }) public gridDkKhaiThacCongTrinh: GridComponent;
  @ViewChild(Type, { static: true }) public matSidenav: MatSidenav;
  @ViewChild(Type, { read: ViewContainerRef, static: true }) public content: ViewContainerRef;

  // tslint:disable-next-line: no-input-rename
  @Input("allowAutoInit") allowAutoInit = true;

  // Chứa thiết lập grid
  public settingsCommon = new SettingsCommon();

  // Chứa danh sách item đã chọn
  public listDataSelect: any[];

  // Chứa danh sách khu vực tọa độ
  public listDkKhaiThacCongTrinh: OutputDkKhaiThacCongTrinh[];

  // Chứa dữ liệu đã chọn
  public selectedItem: OutputDkKhaiThacCongTrinh;

  // Chứa danh sách dữ liệu
  public listData: any;

  // Chứa dữ liệu translate
  public dataTranslate: any;

  // Chứa kiểu wrap text trên grid
  public wrapSettings: TextWrapSettingsModel;

  // Chứa dữ liệu Iddangkykhaithac
  public iddangkykhaithac: string;

  // Contructor
  constructor(
    public matSidenavService: MatsidenavService,
    public cfr: ComponentFactoryResolver,
    public dangKyHoatDongKhoangSanFacadeService: DangKyHoatDongKhoangSanFacadeService,
    public commonService: CommonServiceShared,
    public thietlapFacadeService: ThietlapFacadeService,
    private translate: TranslateService
  ) { }

  async ngOnInit() {
    this.getDataTranslate();

    if (this.allowAutoInit) {
      await this.manualDataInit();
    }
  }

  async manualDataInit() {
    // Gọi hàm lấy dữ liệu pagesize
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
      .getByid(ThietLapHeThong.defaultPageSize ).toPromise();
    if (dataSetting) {
      this.settingsCommon.pageSettings.pageSize = +dataSetting.settingValue;
    } else {
      this.settingsCommon.pageSettings.pageSize = 10;
    }
    // Gọi hàm lấy dữ liệu tọa độ
    await this.getAllDkKhaiThacCongTrinh();
  }

  /**
   * Hàm load lại dữ liệu grid
   */
  public reloadDataGrid() {
    this.getAllDkKhaiThacCongTrinh();
  }

  /**
   * Hàm lấy dữ liệu Dvdc
   */
  async getAllDkKhaiThacCongTrinh() {
    if (this.iddangkykhaithac === null || this.iddangkykhaithac === undefined) {
      return;
    }

    const listData: any = await this.dangKyHoatDongKhoangSanFacadeService
      .getDangKyKhaiThacCongTrinhService()
      .getDangKyKhaiThacCongTrinhByIdDangKyKhaiThac(this.iddangkykhaithac).toPromise();
    if (listData) {
      listData.map((congtrinh, index) => {
        congtrinh.serialNumber = index + 1;
      });
    }
    this.listDkKhaiThacCongTrinh = listData;
  }

  /**
   * Hàm mở sidenav chức năng sửa dữ liệu
   * @param id
   */
  async editItemDkKhaiThacCongTrinh(id: any) {
    // Lấy dữ liệu cá nhân theo id
    const dataItem: any = await this.dangKyHoatDongKhoangSanFacadeService
      .getDangKyKhaiThacCongTrinhService()
      .getByid(id).toPromise();

    if (!dataItem) {
      this.commonService.showDialogWarning(this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkythamdocongtrinh.informedNotExistedDangKyThamDoCongTrinh);
      return;
    }

    // clear Sidenav
    this.matSidenavService.clearSidenav();
    // Khởi tạo sidenav
    this.matSidenavService.setSidenav(this.matSidenav, this, this.content, this.cfr);
    await this.matSidenavService.setTitle( this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkythamdocongtrinh.titleEdit );
    await this.matSidenavService.setContentComp(KtksCongtrinhkhaithacIoComponent, "edit", dataItem);
    await this.matSidenavService.open();
  }

  /**
   * Hàm mở sidenav chức năng thêm mới
   */
  public openDkKhaiThacCongTrinhIOSidenav() {
    // clear Sidenav
    this.matSidenavService.clearSidenav();
    // Khởi tạo sidenav
    this.matSidenavService.setSidenav(this.matSidenav, this, this.content, this.cfr);
    this.matSidenavService.setTitle(this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkythamdocongtrinh.titleAdd);
    this.matSidenavService.setContentComp(KtksCongtrinhkhaithacIoComponent, "new", {iddangkykhaithac: this.iddangkykhaithac});
    this.matSidenavService.open();
  }

  /**
   *  Hàm xóa một bản ghi, được gọi khi nhấn nút xóa trên giao diện list
   */
  async deleteItemDangKyKhaiThacCongTrinh(data) {
    this.selectedItem = data;
    // Phải check xem dữ liệu muốn xóa có đang được dùng ko, đang dùng thì ko xóa
    // Trường hợp dữ liệu có thể xóa thì Phải hỏi người dùng xem có muốn xóa không
    // Nếu đồng ý xóa
    const canDelete: string = this.dangKyHoatDongKhoangSanFacadeService
      .getDangKyKhaiThacCongTrinhService()
      .checkBeDeleted(this.selectedItem.idcongtrinh);
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
      this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkythamdocongtrinh.contentDelete,
      this.selectedItem.sohieu
    );
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === "confirm") {
        await this.dangKyHoatDongKhoangSanFacadeService
          .getDangKyKhaiThacCongTrinhService()
          .deleteItem({ idcongtrinh: this.selectedItem.idcongtrinh })
          .subscribe(
            () => this.getAllDkKhaiThacCongTrinh(),
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
  doFunction(methodName, obj) {
    this[methodName](obj);
  }

}
