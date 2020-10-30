import { HttpErrorResponse } from "@angular/common/http";
import { ComponentFactoryResolver, Input, Type, ViewChild, ViewContainerRef } from "@angular/core";
import { Component, OnInit } from '@angular/core';
import { MatSidenav } from "@angular/material";
import { TranslateService } from "@ngx-translate/core";
import { DetailRowService, GridComponent, GridModel, TextWrapSettingsModel } from "@syncfusion/ej2-angular-grids";
import { ActivatedRoute } from "@angular/router";

import { ThietlapFacadeService } from "src/app/services/admin/thietlap/thietlap-facade.service";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { SettingsCommon, ThietLapHeThong } from "src/app/shared/constants/setting-common";
import { CapPhepHoatDongKhoangSanFacadeService } from 'src/app/services/admin/capphephoatdongkhoangsan/capphephoatdongkhoangsan-facade.service';
import { OutputCpKhaiThacKhuVucModel } from "src/app/models/admin/capphephoatdongkhoangsan/cpkhaithackhoangsan/cpkhaithackhuvuc.model";
import { CpKtksKhuvuckhaithacIoComponent } from "src/app/features/admin/capphephoatdongkhoangsan/cpkhaithackhoangsan/cp-ktks-thongtincapphep/cp-ktks-khuvuckhaithac/cp-ktks-khuvuckhaithac-io/cp-ktks-khuvuckhaithac-io.component";

@Component({
  selector: 'app-cp-daugiakhaithac-khuvuc-list',
  templateUrl: './cp-daugiakhaithac-khuvuc-list.component.html',
  styleUrls: ['./cp-daugiakhaithac-khuvuc-list.component.scss']
})
export class CpDaugiakhaithacKhuvucListComponent implements OnInit {

  // Viewchild template
  @ViewChild("gridCpKhaiThacKhuVuc", { static: false }) public gridCpKhaiThacKhuVuc: GridComponent;
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

  // Chứa danh sách cấp phép khai thác khu vực
  public listCpKhaiThacKhuVuc: OutputCpKhaiThacKhuVucModel[];

  // Chứa dữ liệu đã chọn
  public selectedItem: OutputCpKhaiThacKhuVucModel;

  // Chứa dữ liệu translate
  public dataTranslate: any;

  // Chứa kiểu wrap text trên grid
  public wrapSettings: TextWrapSettingsModel;

  // Chứa dữ liệu Iddangkykhaithac
  public idcapphepkhaithac: string;

  public data = [];

  public childGrid: GridModel = {};

  // Contructor
  constructor(
    public matSidenavService: MatsidenavService,
    public cfr: ComponentFactoryResolver,
    public capPhepHoatDongKhoangSanFacadeService: CapPhepHoatDongKhoangSanFacadeService,
    public commonService: CommonServiceShared,
    public thietlapFacadeService: ThietlapFacadeService,
    private translate: TranslateService,
    private activatedRoute: ActivatedRoute
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

    this.childGrid = await {
      queryString: 'serialNumber',
      columns: [
        { field: 'thutu', headerText: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.capphepkhaithackhuvuc.thutu, width: 120 },
        { field: 'sohieu', headerText: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.capphepkhaithackhuvuc.sohieu, width: 150 },
        { field: 'toadox', headerText: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.capphepkhaithackhuvuc.toadox, width: 150 },
        { field: 'toadoy', headerText: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.capphepkhaithackhuvuc.toadoy, width: 150 }
      ],
      allowResizing: true,
    };
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
    // Gọi hàm lấy dữ liệu cấp phép khai thác khu vực
    await this.getAllCpKhaiThacKhuVuc();
  }

  /**
   * Hàm load lại dữ liệu grid
   */
  public reloadDataGrid() {
    this.getAllCpKhaiThacKhuVuc();
  }

  /**
   * Hàm lấy dữ liệu cấp phép khai thác khu vực
   */
  async getAllCpKhaiThacKhuVuc() {
    const listData: any = await this.capPhepHoatDongKhoangSanFacadeService
      .getCapPhepKhaiThacKhuVucService()
      .getCpKhaiThacKhuVucByIdCapPhep(this.idcapphepkhaithac).toPromise();
    if (listData) {
      listData.map((khuvuc, index) => {
        khuvuc.serialNumber = index + 1;
      });
    }
    this.listCpKhaiThacKhuVuc = listData;
  }

  /**
   * Hàm mở sidenav chức năng sửa dữ liệu
   * @param id
   */
  async editItemCpKhaiThacKhuVuc(id: any) {
    // Lấy dữ liệu khu vực theo id
    const dataItem: any = await this.capPhepHoatDongKhoangSanFacadeService
      .getCapPhepKhaiThacKhuVucService()
      .getByid(id).toPromise();

    if (!dataItem) {
      this.commonService.showDialogWarning(this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.capphepkhaithackhuvuc.informedNotExistedCapPhepKhaiThacKhuVuc);
      return;
    }

    // clear Sidenav
    this.matSidenavService.clearSidenav();
    // Khởi tạo sidenav
    this.matSidenavService.setSidenav(this.matSidenav, this, this.content, this.cfr);
    await this.matSidenavService.setTitle(this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.capphepkhaithackhuvuc.titleEdit);
    await this.matSidenavService.setContentComp(CpKtksKhuvuckhaithacIoComponent, "edit", dataItem);
    await this.matSidenavService.open();
  }

  /**
   * Hàm mở sidenav chức năng thêm mới
   */
  public openCpKhaiThacKhuVucIOSidenav() {
    // clear Sidenav
    this.matSidenavService.clearSidenav();
    // Khởi tạo sidenav
    this.matSidenavService.setSidenav(this.matSidenav, this, this.content, this.cfr);
    this.matSidenavService.setTitle(this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.capphepkhaithackhuvuc.titleAdd);
    this.matSidenavService.setContentComp(CpKtksKhuvuckhaithacIoComponent, "new", { idcapphepkhaithac: this.idcapphepkhaithac, loaicapphep: this.loaicapphep });
    this.matSidenavService.open();
  }

  /**
   *  Hàm xóa một bản ghi, được gọi khi nhấn nút xóa trên giao diện list
   */
  async deleteItemCpKhaiThacKhuVuc(data) {
    this.selectedItem = data;
    // Phải check xem dữ liệu muốn xóa có đang được dùng ko, đang dùng thì ko xóa
    // Trường hợp dữ liệu có thể xóa thì Phải hỏi người dùng xem có muốn xóa không
    // Nếu đồng ý xóa
    const canDelete: string = this.capPhepHoatDongKhoangSanFacadeService
      .getCapPhepKhaiThacKhuVucService()
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
      this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.capphepkhaithackhuvuc.contentDelete,
      this.selectedItem.tenkhuvuc
    );
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === "confirm") {
        await this.capPhepHoatDongKhoangSanFacadeService
          .getCapPhepKhaiThacKhuVucService()
          .deleteItem({ idkhaithackhuvuc: this.selectedItem.idkhaithackhuvuc })
          .subscribe(
            () => this.getAllCpKhaiThacKhuVuc(),
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
