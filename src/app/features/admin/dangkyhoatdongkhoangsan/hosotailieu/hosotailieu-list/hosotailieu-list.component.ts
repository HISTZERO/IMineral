import { Component, ComponentFactoryResolver, Input, OnInit, ViewChild, ViewContainerRef } from "@angular/core";
import { Observable } from "rxjs";
import { DataStateChangeEventArgs, QueryCellInfoEventArgs, TextWrapSettingsModel } from "@syncfusion/ej2-angular-grids";
import { MenuKhuVucDauGia } from "src/app/shared/constants/sub-menus/khuvuckhoangsan/khuvuckhoangsan";
import { MatSidenav } from "@angular/material/sidenav";
import { TranslateService } from "@ngx-translate/core";
import { HttpErrorResponse } from "@angular/common/http";
import { GridComponent } from "@syncfusion/ej2-angular-grids";
import { Router } from "@angular/router";
import { FormGroup, FormBuilder } from "@angular/forms";
import { SettingsCommon, ThietLapHeThong } from "src/app/shared/constants/setting-common";
import { OutputHsTaiLieuModel } from "src/app/models/admin/dangkyhoatdongkhoangsan/tailieu.model";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { DangKyHoatDongKhoangSanFacadeService } from "src/app/services/admin/dangkyhoatdongkhoangsan/dangkyhoatdongkhoangsan-facade.service";
import { HosotailieuIoComponent } from "src/app/features/admin/dangkyhoatdongkhoangsan/hosotailieu/hosotailieu-io/hosotailieu-io.component";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { ThietlapFacadeService } from "src/app/services/admin/thietlap/thietlap-facade.service";
import { GeneralClientService } from "src/app/services/admin/common/general-client.service";
import { NhomTaiLieuEnum } from 'src/app/shared/constants/enum';


@Component({
  selector: 'app-hosotailieu-list',
  templateUrl: './hosotailieu-list.component.html',
  styleUrls: ['./hosotailieu-list.component.scss']
})
export class HosotailieuListComponent implements OnInit {

  // Viewchild template
  @ViewChild("griTaiLieu", { static: false }) public griTaiLieu: GridComponent;
  @ViewChild("aside", { static: true }) public matSidenav: MatSidenav;
  @ViewChild("comptailieuio", { read: ViewContainerRef, static: true }) public content: ViewContainerRef;
  // tslint:disable-next-line: no-input-rename
  @Input("allowAutoInit") allowAutoInit = true;
  // Chứa dữ liệu nhóm tài liệu
  // tslint:disable-next-line: no-input-rename
  @Input("nhomTaiLieu") nhomTaiLieu: number;
  // chứa title loại tài liệu
  // tslint:disable-next-line: no-input-rename
  @Input("title") title: string;
  // Chứa thuộc tính form
  public formSearch: FormGroup;

  // Chứa thiết lập grid
  public settingsCommon = new SettingsCommon();

  // Chứa danh sách lĩnh vực
  public listTaiLieu: Observable<DataStateChangeEventArgs>;

  // Service
  public itemService: any;

  // Paging
  public state: DataStateChangeEventArgs;

  // Chứa dữ liệu đã chọn
  public selectedItem: OutputHsTaiLieuModel;

  // Chứa dữ liệu translate
  public dataTranslate: any;

  // Chứa kiểu wrap text trên grid
  public wrapSettings: TextWrapSettingsModel;

  // Id Hồ sơ
  public idhoso: string;

  // disable delete button
  public disableDeleteButton = false;

  // Chứa danh sách item đã chọn
  public listDataSelect: any[];

  // nhóm tài liệu enum
  public nhomTaiLieuEnum = NhomTaiLieuEnum;

  constructor(public matSidenavService: MatsidenavService,
              public cfr: ComponentFactoryResolver,
              public dangKyHoatDongKhoangSanFacadeService: DangKyHoatDongKhoangSanFacadeService,
              public commonService: CommonServiceShared,
              public thietlapFacadeService: ThietlapFacadeService,
              private translate: TranslateService,
              public formBuilder: FormBuilder,
              public generalClientService: GeneralClientService,
              public router: Router
  ) {

    this.itemService = this.dangKyHoatDongKhoangSanFacadeService.getTaiLieuService();
  }

  async ngOnInit() {
    // Gọi hàm lấy dữ liệu translate
    this.getDataTranslate();
    // Khởi tạo sidenav
    this.matSidenavService.setSidenav(this.matSidenav, this, this.content, this.cfr);
    // Thiết lập hiển thị checkbox trên grid
    await this.setDisplayOfCheckBoxkOnGrid(true);
    // Gọi hàm lấy dữ liệu pagesize

    if (this.allowAutoInit) {
      await this.manualDataInit();
    }
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
   * Hàm thiết lập hiển thị hoặc ẩn checkbox trên grid
   */

  async setDisplayOfCheckBoxkOnGrid(status: boolean = false) {
    if (status) {
      this.settingsCommon.selectionOptions = { persistSelection: true };
    } else {
      this.settingsCommon.selectionOptions = null;
    }
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

    this.getAllTaiLieu();
  }

  async manualDataInit() {
    await this.getDataPageSize();
    return true;
  }

  /**
   * Hàm lấy danh sách dữ liệu đã chọn trên grid
   */
  public getAllDataActive() {
    this.listDataSelect = this.griTaiLieu.getSelectedRecords();

    if (this.listDataSelect.length > 0) {
      this.disableDeleteButton = true;
    } else {
      this.disableDeleteButton = false;
    }
  }

  /**
   * Hàm lấy dữ liệu Cá nhân
   */
  async getAllTaiLieu() {
    this.listTaiLieu = this.itemService;
    const searchModel = {
      idhoso: this.idhoso,
      nhomtailieu: this.nhomTaiLieu
    };
    this.itemService.getHsTaiLieuPage({ skip: 0, take: this.settingsCommon.pageSettings.pageSize }, searchModel);
  }

  // When page item clicked
  public dataStateChange(state: DataStateChangeEventArgs): void {
    const searchModel = {
      idhoso: this.idhoso,
      nhomtailieu: this.nhomTaiLieu
    };
    this.itemService.getHsTaiLieuPage(state, searchModel);
  }

  /**
   * Hàm mở sidenav chức năng thêm mới
   */
  public openTaiLieuIOSidenav() {
    this.matSidenavService.setTitle(this.dataTranslate.DANGKYHOATDONGKHOANGSAN.tailieu.titleAdd);
    this.matSidenavService.setContentComp(HosotailieuIoComponent, "new");
    this.matSidenavService.open();
  }

  /**
   * Hàm mở sidenav chức năng sửa dữ liệu
   * @param id
   */
  async editItemTaiLieu(id: any) {
    // Lấy dữ liệu cá nhân theo id
    const dataItem: any = await this.dangKyHoatDongKhoangSanFacadeService
      .getTaiLieuService()
      .getByid(id).toPromise();
    await this.matSidenavService.setTitle(this.dataTranslate.DANGKYHOATDONGKHOANGSAN.tailieu.titleEdit);
    await this.matSidenavService.setContentComp(HosotailieuIoComponent, "edit", dataItem);
    await this.matSidenavService.open();
  }

  /**
   * Hàm load lại dữ liệu grid
   */
  reloadDataGrid() {
    this.getAllTaiLieu();
  }

  /**
   * Hàm đóng sidenav
   */
  closeTaiLieuIOSidenav() {
    this.matSidenavService.close();
  }

  /**
   *  Hàm xóa một bản ghi, được gọi khi nhấn nút xóa trên giao diện list
   */
  async deleteItemTaiLieu(data) {
    this.selectedItem = data;
    // Phải check xem dữ liệu muốn xóa có đang được dùng ko, đang dùng thì ko xóa
    // Trường hợp dữ liệu có thể xóa thì Phải hỏi người dùng xem có muốn xóa không
    // Nếu đồng ý xóa
    const canDelete: string = this.dangKyHoatDongKhoangSanFacadeService
      .getTaiLieuService()
      .checkBeDeleted(this.selectedItem.idtailieu);
    this.canBeDeletedCheck(canDelete);
  }

  /**
   * Hàm check điều kiện xóa bản ghi
   * @param sMsg
   */
  canBeDeletedCheck(sMsg: string) {
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
      this.dataTranslate.DANGKYHOATDONGKHOANGSAN.tailieu.contentDelete,
      this.selectedItem.tentailieu
    );
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === "confirm") {
        await this.dangKyHoatDongKhoangSanFacadeService
          .getTaiLieuService()
          .deleteItem({ idtailieu: this.selectedItem.idtailieu })
          .subscribe(
            () => this.getAllTaiLieu(),
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

  // set id in coloumn
  customiseCell(args: QueryCellInfoEventArgs) {
    if (args.column.field === 'check') {
      args.cell.classList.add('style-checkbox');
    }
    if (args.column.field === 'idtailieu') {
      args.cell.classList.add('style-action');
    }
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
