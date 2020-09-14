import { Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef } from "@angular/core";
import { Observable } from "rxjs";
import { DataStateChangeEventArgs, TextWrapSettingsModel } from "@syncfusion/ej2-angular-grids";
import { MatSidenav } from "@angular/material/sidenav";
import { TranslateService } from "@ngx-translate/core";
import { HttpErrorResponse } from "@angular/common/http";
import { GridComponent } from "@syncfusion/ej2-angular-grids";
import { Router } from "@angular/router";
import { FormGroup, FormBuilder } from "@angular/forms";

import { MenuKhuVucDauGia } from "src/app/shared/constants/sub-menus/khuvuckhoangsan/khuvuckhoangsan";
import { SettingsCommon, ThietLapHeThong } from "src/app/shared/constants/setting-common";
import { OutputKhuVucKhongDauGiaModel } from "src/app/models/admin/khuvuckhoangsan/khuvuckhongdaugia.model";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { KhuVucKhoangSanFacadeService } from "src/app/services/admin/khuvuckhoangsan/khuvuckhoangsan-facade.service";
import { KhuvuckhongdaugiaIoComponent } from "src/app/features/admin/khuvuckhoangsan/khuvuckhongdaugia/khuvuckhongdaugia-io/khuvuckhongdaugia-io.component";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { ThietlapFacadeService } from "src/app/services/admin/thietlap/thietlap-facade.service";
import { GeneralClientService } from "src/app/services/admin/common/general-client.service";
import { AdminRoutingName } from "src/app/routes/admin-routes-name";
import { keyKhuVucKhoangSan } from "src/app/shared/constants/khuvuckhoangsan-constants";


@Component({
  selector: 'app-khuvuckhongdaugia-list',
  templateUrl: './khuvuckhongdaugia-list.component.html',
  styleUrls: ['./khuvuckhongdaugia-list.component.scss']
})
export class KhuvuckhongdaugiaListComponent implements OnInit {
  // Viewchild template
  @ViewChild("gridKhuVucKhongDauGia", { static: false }) public gridKhuVucKhongDauGia: GridComponent;
  @ViewChild("aside", { static: true }) public matSidenav: MatSidenav;
  @ViewChild("compkhuvuckhongdaugiaio", { read: ViewContainerRef, static: true }) public content: ViewContainerRef;

  // Chứa thuộc tính form
  public formSearch: FormGroup;

  // Chứa thiết lập grid
  public settingsCommon = new SettingsCommon();

  // Chứa danh sách lĩnh vực
  public listKhuVucKhongDauGia: Observable<DataStateChangeEventArgs>;

  // Service
  public itemService: any;

  // Paging
  public state: DataStateChangeEventArgs;

  // Chứa dữ liệu đã chọn
  public selectedItem: OutputKhuVucKhongDauGiaModel;

  // Chứa menu item trên subheader
  public navArray = MenuKhuVucDauGia;

  // Chứa kiểu wrap text trên grid
  public wrapSettings: TextWrapSettingsModel;

  // Chứa dữ liệu translate
  public dataTranslate: any;

  constructor(public matSidenavService: MatsidenavService,
    public cfr: ComponentFactoryResolver,
    public khuVucKhoangSanFacadeService: KhuVucKhoangSanFacadeService,
    public commonService: CommonServiceShared,
    public thietlapFacadeService: ThietlapFacadeService,
    private translate: TranslateService,
    public formBuilder: FormBuilder,
    public generalClientService: GeneralClientService,
    public router: Router
  ) {
    this.itemService = this.khuVucKhoangSanFacadeService.getKhuVucKhongDauGiaService();
  }

  async ngOnInit() {
    // Khởi tạo form
    this.formInit();
    // Gọi hàm lấy dữ liệu translate
    await this.getDataTranslate();
    // Khởi tạo sidenav
    this.matSidenavService.setSidenav(this.matSidenav, this, this.content, this.cfr);
    // Gọi hàm lấy dữ liệu pagesize
    await this.getDataPageSize();
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
      this.settingsCommon.pageSettings.pageSize = +dataSetting.settingValue;
    } else {
      this.settingsCommon.pageSettings.pageSize = 10;
    }

    this.getAllKhuVucKhongDauGia();
  }

  /**
   * Hàm lấy dữ liệu Cá nhân
   */
  async getAllKhuVucKhongDauGia() {
    this.listKhuVucKhongDauGia = this.itemService;
    const searchModel = this.formSearch.value;
    this.itemService.getDataFromServer({ skip: 0, take: this.settingsCommon.pageSettings.pageSize }, searchModel);
  }

  // When page item clicked
  public dataStateChange(state: DataStateChangeEventArgs): void {
    const searchModel = this.formSearch.value;
    this.itemService.getDataFromServer(state, searchModel);
  }

  /**
   * Hàm mở sidenav chức năng thêm mới
   */
  public openKhuVucDauGiaIOSidenav() {
    this.matSidenavService.setTitle(this.dataTranslate.KHUVUCKHOANGSAN.khuvuckhongdaugia.titleAdd);
    this.matSidenavService.setContentComp(KhuvuckhongdaugiaIoComponent, "new");
    this.matSidenavService.open();
  }

  /**
   * Hàm mở sidenav chức năng sửa dữ liệu
   * @param id
   */
  async editItemKhuVucDauGia(id: any) {
    // Lấy dữ liệu cá nhân theo id
    const dataItem: any = await this.khuVucKhoangSanFacadeService
      .getKhuVucKhongDauGiaService()
      .getByid(id).toPromise();
    await this.matSidenavService.setTitle(this.dataTranslate.KHUVUCKHOANGSAN.khuvuckhongdaugia.titleEdit);
    await this.matSidenavService.setContentComp(KhuvuckhongdaugiaIoComponent, "edit", dataItem);
    await this.matSidenavService.open();
  }

  /**
   * Hàm load lại dữ liệu grid
   */
  public reloadDataGrid() {
    this.formSearch.reset({ Keyword: "" });
    this.getAllKhuVucKhongDauGia();
  }

  /**
   * Hàm đóng sidenav
   */
  public closeKhuVucDauGiaIOSidenav() {
    this.matSidenavService.close();
  }

  /**
   *  Hàm xóa một bản ghi, được gọi khi nhấn nút xóa trên giao diện list
   */
  async deleteItemKhuVucDauGia(data) {
    this.selectedItem = data;
    // Phải check xem dữ liệu muốn xóa có đang được dùng ko, đang dùng thì ko xóa
    // Trường hợp dữ liệu có thể xóa thì Phải hỏi người dùng xem có muốn xóa không
    // Nếu đồng ý xóa
    const canDelete: string = this.khuVucKhoangSanFacadeService
      .getKhuVucKhongDauGiaService()
      .checkBeDeleted(this.selectedItem.idkhuvuc);
    this.canBeDeletedCheck(canDelete);
  }

  /**
   * CHuyển hướng đến trang chi tiết
   */
  public detailItem(id: string) {
    this.router.navigate([
      `${AdminRoutingName.adminUri}/${AdminRoutingName.khuvuckhoangsanUri}/${AdminRoutingName.thongtinkhuvuckhoangsanUri}`], { queryParams: { idkhuvuc: id, keykhuvuc: keyKhuVucKhoangSan.KhuVucKhongDauGia } });
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
      this.dataTranslate.KHUVUCKHOANGSAN.khuvuckhongdaugia.contentDelete,
      this.selectedItem.tenkhuvuc
    );
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === "confirm") {
        await this.khuVucKhoangSanFacadeService
          .getKhuVucKhongDauGiaService()
          .deleteItem({ idkhuvuc: this.selectedItem.idkhuvuc })
          .subscribe(
            () => this.getAllKhuVucKhongDauGia(),
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
