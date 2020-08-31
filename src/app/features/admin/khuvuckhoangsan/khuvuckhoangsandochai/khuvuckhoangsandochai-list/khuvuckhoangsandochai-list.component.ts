import { Component, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { GridComponent, TextWrapSettingsModel } from "@syncfusion/ej2-angular-grids";
import { MatSidenav } from "@angular/material";
import { FormGroup, FormBuilder } from "@angular/forms";
import { HttpErrorResponse } from "@angular/common/http";
import { TranslateService } from "@ngx-translate/core";

import { SettingsCommon, ThietLapHeThong } from "src/app/shared/constants/setting-common";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { ThietlapFacadeService } from "src/app/services/admin/thietlap/thietlap-facade.service";
import { KhuVucKhoangSanFacadeService } from "src/app/services/admin/khuvuckhoangsan/khuvuckhoangsan-facade.service";
import { OutputKhuVucKhoangSanDocHaiModel } from "src/app/models/admin/khuvuckhoangsan/khuvuckhoangsandochai.model";
import { MenuKhuVucKhoangSanDocHai } from "src/app/shared/constants/sub-menus/khuvuckhoangsan/khuvuckhoangsandochai";
import { KhuvuckhoangsandochaiIoComponent } from "src/app/features/admin/khuvuckhoangsan/khuvuckhoangsandochai/khuvuckhoangsandochai-io/khuvuckhoangsandochai-io.component";

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
  public listKvKhoangSanDocHai: OutputKhuVucKhoangSanDocHaiModel[];

  // Chứa dữ liệu đã chọn
  public selectedItem: OutputKhuVucKhoangSanDocHaiModel;

  // Chứa dữ liệu translate
  public dataTranslate: any;

  // Chứa menu item trên subheader
  public navArray = MenuKhuVucKhoangSanDocHai;

  // Chứa kiểu wrap text trên grid
  public wrapSettings: TextWrapSettingsModel;

  // Contructor
  constructor(
    public matSidenavService: MatsidenavService,
    public cfr: ComponentFactoryResolver,
    public commonService: CommonServiceShared,
    public thietlapFacadeService: ThietlapFacadeService,
    public khuvuckhoangsanFacadeService: KhuVucKhoangSanFacadeService,
    private translate: TranslateService,
    public formBuilder: FormBuilder,
  ) { }

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
    const pageSize: any = await this.thietlapFacadeService
      .getThietLapHeThongService()
      .getSettingKey({ key: ThietLapHeThong.defaultPageSize });
    if (pageSize) {
      this.settingsCommon.pageSettings.pageSize = +pageSize;
    } else {
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
    this.listKvKhoangSanDocHai = [];
    // const listData: any = await this.dmFacadeService
    //   .getDmCanhanService()
    //   .getFetchAll(param);
    // if (listData.items) {
    //   listData.items.map((canhan, index) => {
    //     canhan.serialNumber = index + 1;
    //   });
    // }
    // this.listCanhan = listData.items;
  }

  /**
   * Tìm kiếm nâng cao
   */
  public searchAdvance() {

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