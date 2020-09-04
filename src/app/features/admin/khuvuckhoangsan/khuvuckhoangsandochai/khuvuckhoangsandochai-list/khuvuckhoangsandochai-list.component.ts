import { Component, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { GridComponent, TextWrapSettingsModel, DataStateChangeEventArgs } from "@syncfusion/ej2-angular-grids";
import { MatSidenav, MatDialog } from "@angular/material";
import { FormGroup, FormBuilder } from "@angular/forms";
import { HttpErrorResponse } from "@angular/common/http";
import { TranslateService } from "@ngx-translate/core";
import { Observable } from "rxjs";
import { Router } from "@angular/router";

import { SettingsCommon, ThietLapHeThong } from "src/app/shared/constants/setting-common";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { ThietlapFacadeService } from "src/app/services/admin/thietlap/thietlap-facade.service";
import { KhuVucKhoangSanFacadeService } from "src/app/services/admin/khuvuckhoangsan/khuvuckhoangsan-facade.service";
import { OutputKhuVucKhoangSanDocHaiModel } from "src/app/models/admin/khuvuckhoangsan/khuvuckhoangsandochai.model";
import { MenuKhuVucKhoangSanDocHai } from "src/app/shared/constants/sub-menus/khuvuckhoangsan/khuvuckhoangsandochai";
import { KhuvuckhoangsandochaiIoComponent } from "src/app/features/admin/khuvuckhoangsan/khuvuckhoangsandochai/khuvuckhoangsandochai-io/khuvuckhoangsandochai-io.component";
import { AdminRoutingName } from "src/app/routes/admin-routes-name";
import { keyKhuVucKhoangSan } from "src/app/shared/constants/khuvuckhoangsan-constants";
import { MyAlertDialogComponent } from "src/app/shared/components/my-alert-dialog/my-alert-dialog.component";

@Component({
  selector: 'app-khuvuckhoangsandochai-list',
  templateUrl: './khuvuckhoangsandochai-list.component.html',
  styleUrls: ['./khuvuckhoangsandochai-list.component.scss']
})
export class KhuvuckhoangsandochaiListComponent implements OnInit {

  // Viewchild template
  @ViewChild("gridKvKhoangSanDocHai", { static: false }) public gridKvKhoangSanDocHai: GridComponent;
  @ViewChild("aside", { static: true }) public matSidenav: MatSidenav;
  @ViewChild("compKvKhoangSanDocHaiIO", { read: ViewContainerRef, static: true }) public content: ViewContainerRef;

  // Chứa thuộc tính form
  public formSearch: FormGroup;

  // Chứa thiết lập grid
  public settingsCommon = new SettingsCommon();

  // Chứa danh sách Khu vực Khoáng sản độc hại
  public listKvKhoangSanDocHai: Observable<DataStateChangeEventArgs>;

  // Chứa service khu vực khoáng sản độc hại
  public khuVucKhoangSanDocHai: any;

  // Chứa dữ liệu đã chọn
  public selectedItem: OutputKhuVucKhoangSanDocHaiModel;

  // Chứa dữ liệu translate
  public dataTranslate: any;

  // Chứa menu item trên subheader
  public navArray = MenuKhuVucKhoangSanDocHai;

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
    public router: Router,
    public modalDialog: MatDialog
  ) {
    this.khuVucKhoangSanDocHai = this.khuvuckhoangsanFacadeService.getKhuVucKhoangSanDocHaiService();
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
      .getByid(ThietLapHeThong.listPageSize).toPromise();
    if (dataSetting) {
      this.pageSize = dataSetting.settingValue;
      this.settingsCommon.pageSettings.pageSize = dataSetting.settingValue;
    } else {
      this.pageSize = 10;
      this.settingsCommon.pageSettings.pageSize = 10;
    }
    // Gọi hàm lấy dữ liệu khu vực khoáng sản độc hại
    await this.getAllKhuVucKhoangSanDocHai();
  }

  /**
   * Hàm load lại dữ liệu grid
   */
  public reloadDataGrid() {
    this.formSearch.reset({
      Keyword: "",
    });
    this.getAllKhuVucKhoangSanDocHai();
  }

  /**
   * Hàm lấy dữ liệu khu vực khoáng sản độc hại
   */
  async getAllKhuVucKhoangSanDocHai(param: any = { PageNumber: 1, PageSize: -1 }) {
    const valueSearch: any = this.formSearch.value;
    this.listKvKhoangSanDocHai = this.khuVucKhoangSanDocHai;
    this.khuVucKhoangSanDocHai.getDataFromServer({ skip: 0, take: this.pageSize }, valueSearch);
  }

  /**
   * Hàm lấy về danh sách khu vực cấm, tạm cấm (phân trang bên server) khi click vào pagination trên grid
   * @param state
   */
  public dataStateChange(state: DataStateChangeEventArgs): void {
    this.khuVucKhoangSanDocHai.getDataFromServer(state, this.formSearch.value);
  }

  /**
   * Tìm kiếm nâng cao
   */
  public searchAdvance() {
    this.getAllKhuVucKhoangSanDocHai();
  }

  /**
   * Chuyển hướng đến trang chi tiết
   */
  public detailItem(id: string) {
    this.router.navigate([
      `${AdminRoutingName.adminUri}/${AdminRoutingName.khuvuckhoangsanUri}/${AdminRoutingName.thongtinkhuvuckhoangsanUri}`], { queryParams: { idkhuvuc: id, keykhuvuc: keyKhuVucKhoangSan.KhuVucKhoangSanDocHai } });
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
  async editItemKhuVucKhoangSanDocHai(id: any) {
    // Lấy dữ liệu khu vực khoáng sản độc hại theo id
    const dataItem: any = await this.khuvuckhoangsanFacadeService
      .getKhuVucKhoangSanDocHaiService()
      .getByid(id).toPromise();
    await this.matSidenavService.setTitle(this.dataTranslate.KHUVUCKHOANGSAN.khuvuckhoangsandochai.titleEdit);
    await this.matSidenavService.setContentComp(KhuvuckhoangsandochaiIoComponent, "edit", dataItem);
    await this.matSidenavService.open();
  }

  /**
   * Hàm mở sidenav chức năng thêm mới
   */
  public openKhuVucKhoangSanDocHaiIOSidenav() {
    this.matSidenavService.setTitle(this.dataTranslate.KHUVUCKHOANGSAN.khuvuckhoangsandochai.titleAdd);
    this.matSidenavService.setContentComp(KhuvuckhoangsandochaiIoComponent, "new");
    this.matSidenavService.open();
  }

  /**
   * Hàm đóng sidenav
   */
  public closeKhuVucKhoangSanDocHaiIOSidenav() {
    this.matSidenavService.close();
  }


  /**
   *  Hàm xóa một bản ghi, được gọi khi nhấn nút xóa trên giao diện list
   */
  async deleteItemKhuVucKhoangSanDocHai(data) {
    this.selectedItem = data;
    // Phải check xem dữ liệu muốn xóa có đang được dùng ko, đang dùng thì ko xóa
    // Trường hợp dữ liệu có thể xóa thì Phải hỏi người dùng xem có muốn xóa không
    // Nếu đồng ý xóa
    const canDelete: string = this.khuvuckhoangsanFacadeService
      .getKhuVucKhoangSanDocHaiService()
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
      this.dataTranslate.KHUVUCKHOANGSAN.khuvuckhoangsandochai.contentDelete,
      this.selectedItem.tenkhuvuc
    );
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === "confirm") {
        await this.khuvuckhoangsanFacadeService
          .getKhuVucKhoangSanDocHaiService()
          .deleteItem({ idkhuvuc: this.selectedItem.idkhuvuc })
          .subscribe(
            () => this.getAllKhuVucKhoangSanDocHai(),
            (error: HttpErrorResponse) => {
              this.showDialogWarning(error.error.errors);
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
   * Hàm hiển thị cảnh báo error
   */
  public showDialogWarning(error: any) {
    const dialog = this.modalDialog.open(MyAlertDialogComponent);
    dialog.componentInstance.header = this.dataTranslate.COMMON.default.warnings;
    dialog.componentInstance.content =
      "<b>" + error + "</b>";
    dialog.componentInstance.visibleOkButton = false;
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
