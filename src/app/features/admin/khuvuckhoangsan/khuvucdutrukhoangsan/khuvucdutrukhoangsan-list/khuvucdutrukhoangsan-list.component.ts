import { Component, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { GridComponent, TextWrapSettingsModel, DataStateChangeEventArgs } from "@syncfusion/ej2-angular-grids";
import { MatSidenav } from "@angular/material";
import { FormGroup, FormBuilder } from "@angular/forms";
import { HttpErrorResponse } from "@angular/common/http";
import { TranslateService } from "@ngx-translate/core";
import { Observable } from "rxjs";

import { SettingsCommon, ThietLapHeThong } from "src/app/shared/constants/setting-common";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { ThietlapFacadeService } from "src/app/services/admin/thietlap/thietlap-facade.service";
import { KhuVucKhoangSanFacadeService } from "src/app/services/admin/khuvuckhoangsan/khuvuckhoangsan-facade.service";
import { OutputKhuVucDuTruKhoangSanModel } from "src/app/models/admin/khuvuckhoangsan/khuvucdutrukhoangsan.model";
import { MenuKhuVucDuTruKhoangSan } from "src/app/shared/constants/sub-menus/khuvuckhoangsan/khuvucdutrukhoangsan";
import { KhuvucdutrukhoangsanIoComponent } from "src/app/features/admin/khuvuckhoangsan/khuvucdutrukhoangsan/khuvucdutrukhoangsan-io/khuvucdutrukhoangsan-io.component";

@Component({
  selector: 'app-khuvucdutrukhoangsan-list',
  templateUrl: './khuvucdutrukhoangsan-list.component.html',
  styleUrls: ['./khuvucdutrukhoangsan-list.component.scss']
})
export class KhuvucdutrukhoangsanListComponent implements OnInit {

  // Viewchild template
  @ViewChild("gridKvDuTruKhoangSan", { static: false }) public gridKvDuTruKhoangSan: GridComponent;
  @ViewChild("aside", { static: true }) public matSidenav: MatSidenav;
  @ViewChild("compKvDuTruKhoangSanIO", { read: ViewContainerRef, static: true }) public content: ViewContainerRef;

  // Chứa thuộc tính form
  public formSearch: FormGroup;

  // Chứa thiết lập grid
  public settingsCommon = new SettingsCommon();

  // Chứa danh sách Khu vực dự trữ khoáng sản
  public listKvDuTruKhoangSan: Observable<DataStateChangeEventArgs>;

  // Chứa service khu vực dự trữ khoáng sản
  public khuVucDuTruKhoangSan: any;

  // Chứa dữ liệu đã chọn
  public selectedItem: OutputKhuVucDuTruKhoangSanModel;

  // Chứa dữ liệu translate
  public dataTranslate: any;

  // Chứa menu item trên subheader
  public navArray = MenuKhuVucDuTruKhoangSan;

  // Chứa kiểu wrap text trên grid
  public wrapSettings: TextWrapSettingsModel;

  // CHứa pageSize
  public pageSize: any;

  // Contructor
  constructor(
    public matSidenavService: MatsidenavService,
    public cfr: ComponentFactoryResolver,
    public commonService: CommonServiceShared,
    public thietlapFacadeService: ThietlapFacadeService,
    public khuvuckhoangsanFacadeService: KhuVucKhoangSanFacadeService,
    private translate: TranslateService,
    public formBuilder: FormBuilder,
  ) {
    this.khuVucDuTruKhoangSan = this.khuvuckhoangsanFacadeService.getKhuVucDuTruKhoangSanService();
   }

  async ngOnInit() {
    // Khởi tạo form
    this.formInit();
    // Gọi hàm lấy dữ liệu translate
    await this.getDataTranslate();
    // Setting wrap mode
    this.wrapSettings = { wrapMode: 'Both' };
    // Khởi tạo sidenav
    this.matSidenavService.setSidenav(this.matSidenav, this, this.content, this.cfr);
    // Gọi hàm lấy dữ liệu pagesize
    await this.getDataPageSize();

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
      .getByid(ThietLapHeThong.listPageSize ).toPromise();
    if (dataSetting) {
      this.pageSize = dataSetting.settingValue;
      this.settingsCommon.pageSettings.pageSize = dataSetting.settingValue;
    } else {
      this.pageSize = 10;
      this.settingsCommon.pageSettings.pageSize = 10;
    }
    // Gọi hàm lấy dữ liệu khu vực dự trữ khoáng sản
    await this.getAllKhuVucDuTruKhoangSan();
  }

  /**
   * Hàm load lại dữ liệu grid
   */
  public reloadDataGrid() {
    this.formSearch.reset({
      Keyword: "",
    });
    this.getAllKhuVucDuTruKhoangSan();
  }

  /**
   * Hàm lấy dữ liệu khu vực dự trữ khoáng sản
   */
  async getAllKhuVucDuTruKhoangSan(param: any = { PageNumber: 1, PageSize: -1 }) {
    const valueSearch: any = this.formSearch.value;
    this.listKvDuTruKhoangSan = this.khuVucDuTruKhoangSan;
    this.khuVucDuTruKhoangSan.getDataFromServer({skip: 0, take: this.pageSize}, valueSearch);
  }

  /**
   * Hàm lấy về danh sách khu vực cấm, tạm cấm (phân trang bên server) khi click vào pagination trên grid
   * @param state
   */
  public dataStateChange(state: DataStateChangeEventArgs): void {
    this.khuVucDuTruKhoangSan.getDataFromServer(state, this.formSearch.value);
  }

  /**
   * Tìm kiếm nâng cao
   */
  public searchAdvance() {
    this.getAllKhuVucDuTruKhoangSan();
  }

  /**
   * CHuyển hướng đến trang chi tiết
   */
  public detailItem() {
    
  }

  /**
   * Form innit
   */
  public formInit() {
    this.formSearch = this.formBuilder.group({
      Keyword: [""],
    });
  }

  /**
   * Hàm mở sidenav chức năng sửa dữ liệu
   * @param id
   */
  async editItemKhuVucDuTruKhoangSan(id: any) {
    // Lấy dữ liệu khu vực dự trữ khoáng sản theo id
    const dataItem: any = await this.khuvuckhoangsanFacadeService
      .getKhuVucDuTruKhoangSanService()
      .getByid(id).toPromise();
    await this.matSidenavService.setTitle(this.dataTranslate.KHUVUCKHOANGSAN.khuvucdutrukhoangsan.titleEdit);
    await this.matSidenavService.setContentComp(KhuvucdutrukhoangsanIoComponent, "edit", dataItem);
    await this.matSidenavService.open();
  }

  /**
   * Hàm mở sidenav chức năng thêm mới
   */
  public openKhuVucDuTruKhoangSanIOSidenav() {
    this.matSidenavService.setTitle(this.dataTranslate.KHUVUCKHOANGSAN.khuvucdutrukhoangsan.titleAdd);
    this.matSidenavService.setContentComp(KhuvucdutrukhoangsanIoComponent, "new");
    this.matSidenavService.open();
  }

  /**
   * Hàm đóng sidenav
   */
  public closeKhuVucDuTruKhoangSanIOSidenav() {
    this.matSidenavService.close();
  }


  /**
   *  Hàm xóa một bản ghi, được gọi khi nhấn nút xóa trên giao diện list
   */
  async deleteItemKhuVucDuTruKhoangSan(data) {
    this.selectedItem = data;
    // Phải check xem dữ liệu muốn xóa có đang được dùng ko, đang dùng thì ko xóa
    // Trường hợp dữ liệu có thể xóa thì Phải hỏi người dùng xem có muốn xóa không
    // Nếu đồng ý xóa
    const canDelete: string = this.khuvuckhoangsanFacadeService
      .getKhuVucDuTruKhoangSanService()
      .checkBeDeleted(this.selectedItem.idkhuvuc);
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
      this.dataTranslate.KHUVUCKHOANGSAN.khuvucdutrukhoangsan.contentDelete,
      this.selectedItem.tenkhuvuc
    );
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === "confirm") {
          await this.khuvuckhoangsanFacadeService
            .getKhuVucDuTruKhoangSanService()
            .deleteItem({ idkhuvuc: this.selectedItem.idkhuvuc })
            .subscribe(
              () => this.getAllKhuVucDuTruKhoangSan(),
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
