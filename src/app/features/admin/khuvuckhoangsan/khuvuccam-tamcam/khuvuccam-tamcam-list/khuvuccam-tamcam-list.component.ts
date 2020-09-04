import { Component, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { GridComponent, TextWrapSettingsModel, DataStateChangeEventArgs } from "@syncfusion/ej2-angular-grids";
import { MatSidenav, MatDialog } from "@angular/material";
import { FormGroup, FormBuilder } from "@angular/forms";
import { HttpErrorResponse } from "@angular/common/http";
import { TranslateService } from "@ngx-translate/core";
import { Observable } from "rxjs";
import { Router } from "@angular/router";

import { SettingsCommon, ThietLapHeThong } from "src/app/shared/constants/setting-common";
import { OutputKhuVucCamTamCamModel } from "src/app/models/admin/khuvuckhoangsan/khuvuccamtamcam.model";
import { MenuKhuVucCamTamCam } from "src/app/shared/constants/sub-menus/khuvuckhoangsan/khuvuccam-tamcam";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { ThietlapFacadeService } from "src/app/services/admin/thietlap/thietlap-facade.service";
import { KhuVucKhoangSanFacadeService } from "src/app/services/admin/khuvuckhoangsan/khuvuckhoangsan-facade.service";
import { KhuvuccamTamcamIoComponent } from "src/app/features/admin/khuvuckhoangsan/khuvuccam-tamcam/khuvuccam-tamcam-io/khuvuccam-tamcam-io.component";
import { AdminRoutingName } from "src/app/routes/admin-routes-name";
import { keyKhuVucKhoangSan } from "src/app/shared/constants/khuvuckhoangsan-constants";
import { MaLoaiHinh } from "src/app/shared/constants/common-constants";
import { MyAlertDialogComponent } from "src/app/shared/components/my-alert-dialog/my-alert-dialog.component";


@Component({
  selector: 'app-khuvuccam-tamcam-list',
  templateUrl: './khuvuccam-tamcam-list.component.html',
  styleUrls: ['./khuvuccam-tamcam-list.component.scss']
})
export class KhuvuccamTamcamListComponent implements OnInit {

  // Viewchild template
  @ViewChild("gridKvCamTamCam", { static: false }) public gridKvCamTamCam: GridComponent;
  @ViewChild("aside", { static: true }) public matSidenav: MatSidenav;
  @ViewChild("compKvCamTamCamIO", { read: ViewContainerRef, static: true }) public content: ViewContainerRef;

  // Chứa thuộc tính form
  public formSearch: FormGroup;

  // Chứa thiết lập grid
  public settingsCommon = new SettingsCommon();

  // Chứa danh sách Khu vực cấm tạm cấm
  public listKvCamTamCam: Observable<DataStateChangeEventArgs>;

  // Chứa dữ liệu đã chọn
  public selectedItem: OutputKhuVucCamTamCamModel;

  // Chứa dữ liệu translate
  public dataTranslate: any;

  // Chứa menu item trên subheader
  public navArray = MenuKhuVucCamTamCam;

  // Chứa kiểu wrap text trên grid
  public wrapSettings: TextWrapSettingsModel;

  // Chứa pagesize
  public pageSize: number;

  // Biến để chứa service
  public khuVucCamTamCamService: any;

  // Chứa dữ liệu loại hình
  public loaiHinh = MaLoaiHinh;

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
    this.khuVucCamTamCamService = this.khuvuckhoangsanFacadeService.getKhuVucCamTamCamService();
  }

  async ngOnInit() {
    // Khởi tạo form
    this.formInit();
    // Gọi hàm lấy dữ liệu translate
    await this.getDataTranslate();
    // Gọi hàm lấy dữ liệu pagesize
    await this.getDataPageSize();
    // Setting wrap mode
    this.wrapSettings = { wrapMode: 'Both' };
    // Khởi tạo sidenav
    this.matSidenavService.setSidenav(this.matSidenav, this, this.content, this.cfr);
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
    // Gọi hàm lấy dữ liệu khu vực cấm/tạm cấm
    await this.getAllKhuVucCamTamCam();
  }

  /**
   * Hàm load lại dữ liệu grid
   */
  public reloadDataGrid() {
    this.formSearch.reset({
      Keyword: "",
      Maloaihinh: ""
    });
    this.getAllKhuVucCamTamCam();
  }

  /**
   * Hàm lấy dữ liệu khu vực cấm/tạm cấm
   */
  async getAllKhuVucCamTamCam() {
    const valueSearch: any = this.formSearch.value;
    this.listKvCamTamCam = this.khuVucCamTamCamService;
    this.khuVucCamTamCamService.getDataFromServer({ skip: 0, take: this.pageSize }, valueSearch);
  }

  /**
   * Hàm lấy về danh sách khu vực cấm, tạm cấm (phân trang bên server) khi click vào pagination trên grid
   * @param state
   */
  public dataStateChange(state: DataStateChangeEventArgs): void {
    this.khuVucCamTamCamService.getDataFromServer(state, this.formSearch.value);
  }


  /**
   * Tìm kiếm nâng cao
   */
  public searchAdvance() {
    this.getAllKhuVucCamTamCam();
  }

  /**
   * Form innit
   */
  public formInit() {
    this.formSearch = this.formBuilder.group({
      Keyword: [""],
      Maloaihinh: [""]
    });
  }

  /**
   * Hàm điều hướng đến trang thông tin chung của Điểm khai thác
   * @param id
   */
  public detailItem(id) {
    this.router.navigate([
      `${AdminRoutingName.adminUri}/${AdminRoutingName.khuvuckhoangsanUri}/${AdminRoutingName.thongtinkhuvuckhoangsanUri}`], { queryParams: { idkhuvuc: id, keykhuvuc: keyKhuVucKhoangSan.KhuVucCamTamCam } });
  }


  /**
   * Hàm mở sidenav chức năng sửa dữ liệu
   * @param id
   */
  async editItemKhuVucCamTamCam(id: any) {
    // Lấy dữ liệu khu vực cấm/ tạm cấm theo id
    const dataItem: any = await this.khuvuckhoangsanFacadeService
      .getKhuVucCamTamCamService()
      .getByid(id).toPromise();
    await this.matSidenavService.setTitle(this.dataTranslate.KHUVUCKHOANGSAN.khuvuccamtamcam.titleEdit);
    await this.matSidenavService.setContentComp(KhuvuccamTamcamIoComponent, "edit", dataItem);
    await this.matSidenavService.open();
  }

  /**
   * Hàm mở sidenav chức năng thêm mới
   */
  public openKhuVucCamTamCamIOSidenav() {
    this.matSidenavService.setTitle(this.dataTranslate.KHUVUCKHOANGSAN.khuvuccamtamcam.titleAdd);
    this.matSidenavService.setContentComp(KhuvuccamTamcamIoComponent, "new");
    this.matSidenavService.open();
  }

  /**
   * Hàm đóng sidenav
   */
  public closeKhuVucCamTamCamIOSidenav() {
    this.matSidenavService.close();
  }


  /**
   *  Hàm xóa một bản ghi, được gọi khi nhấn nút xóa trên giao diện list
   */
  async deleteItemKhuVucCamTamCam(data) {
    this.selectedItem = data;
    // Phải check xem dữ liệu muốn xóa có đang được dùng ko, đang dùng thì ko xóa
    // Trường hợp dữ liệu có thể xóa thì Phải hỏi người dùng xem có muốn xóa không
    // Nếu đồng ý xóa
    const canDelete: string = this.khuvuckhoangsanFacadeService
      .getKhuVucCamTamCamService()
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
      this.dataTranslate.KHUVUCKHOANGSAN.khuvuccamtamcam.contentDelete,
      this.selectedItem.tenkhuvuc
    );
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === "confirm") {
        await this.khuvuckhoangsanFacadeService
          .getKhuVucCamTamCamService()
          .deleteItem({ idkhuvuc: this.selectedItem.idkhuvuc })
          .subscribe(
            () => this.getAllKhuVucCamTamCam(),
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
