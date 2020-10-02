import { HttpErrorResponse } from "@angular/common/http";
import { ComponentFactoryResolver, Input, Type, ViewChild, ViewContainerRef } from "@angular/core";
import { Component, OnInit } from '@angular/core';
import { MatSidenav } from "@angular/material";
import { TranslateService } from "@ngx-translate/core";
import { ActivatedRoute } from "@angular/router";
import { DetailRowService, GridComponent, GridModel, TextWrapSettingsModel } from "@syncfusion/ej2-angular-grids";

import { DangKyHoatDongKhoangSanFacadeService } from "src/app/services/admin/dangkyhoatdongkhoangsan/dangkyhoatdongkhoangsan-facade.service";
import { ThietlapFacadeService } from "src/app/services/admin/thietlap/thietlap-facade.service";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { SettingsCommon, ThietLapHeThong } from "src/app/shared/constants/setting-common";
import { OutputDkKhaiThacKhuVucModel } from "src/app/models/admin/dangkyhoatdongkhoangsan/dkkhaithackhuvuc.model";
import { KhuvuckhaithacIoComponent } from "src/app/features/admin/dangkyhoatdongkhoangsan/khaithackhoangsan/ktks-thongtindangky/khuvuckhaithac/khuvuckhaithac-io/khuvuckhaithac-io.component";

@Component({
  selector: 'app-khuvuckhaithac-list',
  templateUrl: './khuvuckhaithac-list.component.html',
  styleUrls: ['./khuvuckhaithac-list.component.scss'],
  providers: [DetailRowService]
})
export class KhuvuckhaithacListComponent implements OnInit {

  // Viewchild template
  @ViewChild("gridDkKhuVucKhaiThac", { static: false }) public gridDkKhuVucKhaiThac: GridComponent;
  @ViewChild(Type, { static: true }) public matSidenav: MatSidenav;
  @ViewChild(Type, { read: ViewContainerRef, static: true }) public content: ViewContainerRef;

  // tslint:disable-next-line: no-input-rename
  @Input("allowAutoInit") allowAutoInit = true;

  // Chứa loại cấp phép
  public loaicapphep: number;

  // Chứa thiết lập grid
  public settingsCommon = new SettingsCommon();

  // Chứa danh sách item đã chọn
  public listDataSelect: any[];

  // Chứa danh sách khu vực khai thác
  public listDkKhuVucKhaiThac: OutputDkKhaiThacKhuVucModel[];

  // Chứa dữ liệu đã chọn
  public selectedItem: OutputDkKhaiThacKhuVucModel;

  // Chứa dữ liệu translate
  public dataTranslate: any;

  // Chứa kiểu wrap text trên grid
  public wrapSettings: TextWrapSettingsModel;

  // Chứa dữ liệu Iddangkykhaithac
  public iddangkykhaithac: string;

  public idHoSo: string;

  public data = [];

  public childGrid: GridModel = {};

  // Contructor
  constructor(
    public matSidenavService: MatsidenavService,
    public cfr: ComponentFactoryResolver,
    public dangKyHoatDongKhoangSanFacadeService: DangKyHoatDongKhoangSanFacadeService,
    public commonService: CommonServiceShared,
    public thietlapFacadeService: ThietlapFacadeService,
    private translate: TranslateService,
    private activatedRoute: ActivatedRoute
  ) { }

  async ngOnInit() {
    this.getDataTranslate();
    this.getIdDangKyKhaiThac();
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

    this.childGrid = await {
      queryString: 'serialNumber',
      columns: [
        { field: 'thutu', headerText: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkykhaithackhuvuc.thutu, width: 120 },
        { field: 'sohieu', headerText: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkykhaithackhuvuc.sohieu, width: 150 },
        { field: 'toadox', headerText: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkykhaithackhuvuc.toadox, width: 150 },
        { field: 'toadoy', headerText: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkykhaithackhuvuc.toadoy, width: 150 }
      ],
      allowResizing: true,
    };
  }


  /**
   * Lấy id đăng ký thăm dò
   */
  public getIdDangKyKhaiThac() {
    this.activatedRoute.queryParamMap.subscribe((param: any) => {
      if (param && param.params && param.params.idhoso) {
        this.idHoSo = param.params.idhoso;
      }
    });
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
    // Gọi hàm lấy dữ liệu khu vực
    await this.getAllDkKhaiThacKhuVuc();
  }

  /**
   * Hàm load lại dữ liệu grid
   */
  public reloadDataGrid() {
    this.getAllDkKhaiThacKhuVuc();
  }

  /**
   * Hàm lấy dữ liệu khai thác khu vực
   */
  async getAllDkKhaiThacKhuVuc() {
    const listData: any = await this.dangKyHoatDongKhoangSanFacadeService
      .getDangkyKhaiThacKhuVucService()
      .getFetchAll({ iddangkykhaithac: this.iddangkykhaithac });
    if (listData) {
      listData.map((khuvuc, index) => {
        khuvuc.serialNumber = index + 1;
      });
    }
    this.listDkKhuVucKhaiThac = listData;
  }

  /**
   * Hàm mở sidenav chức năng sửa dữ liệu
   * @param id
   */
  async editItemDkKhaiThacKhuVuc(id: any) {
    // Lấy dữ liệu khu vực theo id
    const dataItem: any = await this.dangKyHoatDongKhoangSanFacadeService
      .getDangkyKhaiThacKhuVucService()
      .getByid(id).toPromise();

    if (!dataItem) {
      this.commonService.showDialogWarning(this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkykhaithackhuvuc.informedNotExistedDangKyThamDoCongTrinh);
      return;
    }

    // clear Sidenav
    this.matSidenavService.clearSidenav();
    // Khởi tạo sidenav
    this.matSidenavService.setSidenav(this.matSidenav, this, this.content, this.cfr);
    await this.matSidenavService.setTitle(this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkykhaithackhuvuc.titleEdit);
    await this.matSidenavService.setContentComp(KhuvuckhaithacIoComponent, "edit", dataItem);
    await this.matSidenavService.open();
  }

  /**
   * Hàm mở sidenav chức năng thêm mới
   */
  public openDkKhaiThacKhuVucIOSidenav() {
    // clear Sidenav
    this.matSidenavService.clearSidenav();
    // Khởi tạo sidenav
    this.matSidenavService.setSidenav(this.matSidenav, this, this.content, this.cfr);
    this.matSidenavService.setTitle(this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkykhaithackhuvuc.titleAdd);
    this.matSidenavService.setContentComp(KhuvuckhaithacIoComponent, "new", { iddangkykhaithac: this.iddangkykhaithac, loaicapphep: this.loaicapphep });
    this.matSidenavService.open();
  }

  /**
   *  Hàm xóa một bản ghi, được gọi khi nhấn nút xóa trên giao diện list
   */
  async deleteItemDangKyKhaiThacKhuVuc(data) {
    this.selectedItem = data;
    // Phải check xem dữ liệu muốn xóa có đang được dùng ko, đang dùng thì ko xóa
    // Trường hợp dữ liệu có thể xóa thì Phải hỏi người dùng xem có muốn xóa không
    // Nếu đồng ý xóa
    const canDelete: string = this.dangKyHoatDongKhoangSanFacadeService
      .getDangkyKhaiThacKhuVucService()
      .checkBeDeleted(this.selectedItem.idkhaithackhuvuc);
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
      this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkykhaithackhuvuc.contentDelete,
      this.selectedItem.tenkhuvuc
    );
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === "confirm") {
        await this.dangKyHoatDongKhoangSanFacadeService
          .getDangkyKhaiThacKhuVucService()
          .deleteItem({ idkhaithackhuvuc: this.selectedItem.idkhaithackhuvuc })
          .subscribe(
            () => this.getAllDkKhaiThacKhuVuc(),
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
