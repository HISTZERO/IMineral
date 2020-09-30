import { HttpErrorResponse } from "@angular/common/http";
import { ComponentFactoryResolver, Input, Type, ViewChild, ViewContainerRef } from "@angular/core";
import { Component, OnInit } from '@angular/core';
import { MatSidenav } from "@angular/material";
import { TranslateService } from "@ngx-translate/core";
import { DetailRowService, GridComponent, GridModel, TextWrapSettingsModel } from "@syncfusion/ej2-angular-grids";

import { OutputDkThamDoKhuVucModel } from "src/app/models/admin/dangkyhoatdongkhoangsan/dkthamdokhuvuc.model";
import { DangKyHoatDongKhoangSanFacadeService } from "src/app/services/admin/dangkyhoatdongkhoangsan/dangkyhoatdongkhoangsan-facade.service";
import { ThietlapFacadeService } from "src/app/services/admin/thietlap/thietlap-facade.service";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { SettingsCommon, ThietLapHeThong } from "src/app/shared/constants/setting-common";
import { KhuvucthamdoIoComponent } from "src/app/features/admin/dangkyhoatdongkhoangsan/thamdokhoangsan/thongtindangky/khuvucthamdo/khuvucthamdo-io/khuvucthamdo-io.component";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-khuvucthamdo-list',
  templateUrl: './khuvucthamdo-list.component.html',
  styleUrls: ['./khuvucthamdo-list.component.scss'],
  providers: [DetailRowService],
})
export class KhuvucthamdoListComponent implements OnInit {

  // Viewchild template
  @ViewChild("gridDkThamDoKhuVuc", { static: false }) public gridDkThamDoKhuVuc: GridComponent;
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

  // Chứa danh sách khu vực thăm dò
  public listDkThamDoKhuVuc: OutputDkThamDoKhuVucModel[];

  // Chứa dữ liệu đã chọn
  public selectedItem: OutputDkThamDoKhuVucModel;

  // Chứa danh sách dữ liệu
  public listData: any;

  // Chứa dữ liệu translate
  public dataTranslate: any;

  // Chứa kiểu wrap text trên grid
  public wrapSettings: TextWrapSettingsModel;

  // Chứa dữ liệu Iddangkythamdo
  public iddangkythamdo: string;

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
    this.getIdDangKyThamDo();
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
   * Hàm chạy khi load chidgrid
   */
  onLoad() {
    this.gridDkThamDoKhuVuc.childGrid.dataSource = this.data; // assign data source for child grid.
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
        { field: 'thutu', headerText: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkythamdokhuvuc.thutu, width: 120 },
        { field: 'sohieu', headerText: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkythamdokhuvuc.sohieu, width: 150 },
        { field: 'toadox', headerText: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkythamdokhuvuc.toadox, width: 150 },
        { field: 'toadoy', headerText: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkythamdokhuvuc.toadoy, width: 150 }
      ],
      allowResizing: true,
    };
  }


  /**
   * Lấy id đăng ký thăm dò
   */
  public getIdDangKyThamDo() {
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
    await this.getAllDkThamDoKhuVuc();
  }

  /**
   * Hàm load lại dữ liệu grid
   */
  public reloadDataGrid() {
    this.getAllDkThamDoKhuVuc();
  }

  /**
   * Hàm lấy dữ liệu Dvdc
   */
  async getAllDkThamDoKhuVuc() {
    const listData: any = await this.dangKyHoatDongKhoangSanFacadeService
      .getDangKyThamDoKhuVucService()
      .getFetchAll({ iddangkythamdo: this.iddangkythamdo });
    if (listData) {
      listData.map((khuvuc, index) => {
        khuvuc.serialNumber = index + 1;
      });
    }
    this.listDkThamDoKhuVuc = listData;
  }

  /**
   * Hàm mở sidenav chức năng sửa dữ liệu
   * @param id
   */
  async editItemDkThamDoKhuVuc(id: any) {
    // Lấy dữ liệu khu vực theo id
    const dataItem: any = await this.dangKyHoatDongKhoangSanFacadeService
      .getDangKyThamDoKhuVucService()
      .getByid(id).toPromise();

    if (!dataItem) {
      this.commonService.showDialogWarning(this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkythamdokhuvuc.informedNotExistedDangKyThamDoCongTrinh);
      return;
    }

    // clear Sidenav
    this.matSidenavService.clearSidenav();
    // Khởi tạo sidenav
    this.matSidenavService.setSidenav(this.matSidenav, this, this.content, this.cfr);
    await this.matSidenavService.setTitle(this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkythamdokhuvuc.titleEdit);
    await this.matSidenavService.setContentComp(KhuvucthamdoIoComponent, "edit", dataItem);
    await this.matSidenavService.open();
  }

  /**
   * Hàm mở sidenav chức năng thêm mới
   */
  public openDkThamDoCongTrinhIOSidenav() {
    // clear Sidenav
    this.matSidenavService.clearSidenav();
    // Khởi tạo sidenav
    this.matSidenavService.setSidenav(this.matSidenav, this, this.content, this.cfr);
    this.matSidenavService.setTitle(this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkythamdokhuvuc.titleAdd);
    this.matSidenavService.setContentComp(KhuvucthamdoIoComponent, "new", { iddangkythamdo: this.iddangkythamdo, loaicapphep: this.loaicapphep });
    this.matSidenavService.open();
  }

  /**
   *  Hàm xóa một bản ghi, được gọi khi nhấn nút xóa trên giao diện list
   */
  async deleteItemDangKyThamDoKhuVuc(data) {
    this.selectedItem = data;
    // Phải check xem dữ liệu muốn xóa có đang được dùng ko, đang dùng thì ko xóa
    // Trường hợp dữ liệu có thể xóa thì Phải hỏi người dùng xem có muốn xóa không
    // Nếu đồng ý xóa
    const canDelete: string = this.dangKyHoatDongKhoangSanFacadeService
      .getDangKyThamDoKhuVucService()
      .checkBeDeleted(this.selectedItem.idthamdokhuvuc);
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
      this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkythamdokhuvuc.contentDelete,
      this.selectedItem.tenkhuvuc
    );
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === "confirm") {
        await this.dangKyHoatDongKhoangSanFacadeService
          .getDangKyThamDoKhuVucService()
          .deleteItem({ idthamdokhuvuc: this.selectedItem.idthamdokhuvuc })
          .subscribe(
            () => this.getAllDkThamDoKhuVuc(),
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
