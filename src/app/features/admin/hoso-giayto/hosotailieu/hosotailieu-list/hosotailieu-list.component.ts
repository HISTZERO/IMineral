import { Component, ComponentFactoryResolver, Input, OnInit, ViewChild, ViewContainerRef } from "@angular/core";
import { Observable } from "rxjs";
import { DataStateChangeEventArgs, QueryCellInfoEventArgs, TextWrapSettingsModel } from "@syncfusion/ej2-angular-grids";
import { MenuKhuVucDauGia } from "src/app/shared/constants/sub-menus/khuvuckhoangsan/khuvuckhoangsan";
import { MatSidenav } from "@angular/material/sidenav";
import { TranslateService } from "@ngx-translate/core";
import { HttpErrorResponse } from "@angular/common/http";
import { GridComponent } from "@syncfusion/ej2-angular-grids";
import { ActivatedRoute, Router } from "@angular/router";
import { FormGroup, FormBuilder } from "@angular/forms";
import { SettingsCommon, ThietLapHeThong } from "src/app/shared/constants/setting-common";
import { OutputHsTaiLieuModel } from "src/app/models/admin/dangkyhoatdongkhoangsan/tailieu.model";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { DangKyHoatDongKhoangSanFacadeService } from "src/app/services/admin/dangkyhoatdongkhoangsan/dangkyhoatdongkhoangsan-facade.service";
import { HosotailieuIoComponent } from "src/app/features/admin/hoso-giayto/hosotailieu/hosotailieu-io/hosotailieu-io.component";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { ThietlapFacadeService } from "src/app/services/admin/thietlap/thietlap-facade.service";
import { GeneralClientService } from "src/app/services/admin/common/general-client.service";
import { NhomTaiLieuEnum } from 'src/app/shared/constants/enum';
import { FileService } from 'src/app/services/admin/common/file.service';
import { CommonFacadeService } from 'src/app/services/admin/common/common-facade.service';


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
  // tslint:disable-next-line: no-input-rename
  @Input("disabledMatsidenav") disabledMatsidenav = false;
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
              public commonFacadeService: CommonFacadeService,
              public router: Router,
              private activatedRoute: ActivatedRoute
  ) {

    this.itemService = this.dangKyHoatDongKhoangSanFacadeService.getTaiLieuService();
  }

  async ngOnInit() {
    this.activatedRoute.queryParamMap.subscribe((param: any) => {
      if (param && param.params && param.params.idhoso) {
        this.idhoso = param.params.idhoso;
      }
    });

    // Gọi hàm lấy dữ liệu translate
    this.getDataTranslate();
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
  getAllDataActive() {
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
  openTaiLieuIOSidenav() {
    // clear Sidenav
    this.matSidenavService.clearSidenav();
    // Khởi tạo sidenav
    this.matSidenavService.setSidenav(this.matSidenav, this, this.content, this.cfr);

    if (this.nhomTaiLieu === this.nhomTaiLieuEnum.TaiLieuKhongBatBuoc) {
      this.matSidenavService.setTitle(this.dataTranslate.DANGKYHOATDONGKHOANGSAN.tailieu.differentTitleAdd);
    } else if (this.nhomTaiLieu === this.nhomTaiLieuEnum.TaiLieuXuLyHoSo) {
      this.matSidenavService.setTitle(this.dataTranslate.DANGKYHOATDONGKHOANGSAN.tailieu.processedTitleAdd);
    } else {
      return;
    }

    const dataItem = {idhoso: this.idhoso, nhomtailieu: this.nhomTaiLieu};
    this.matSidenavService.setContentComp(HosotailieuIoComponent, "new", dataItem);
    this.matSidenavService.open();
  }

  async uploadFileItemTaiLieu(idTaiLieu: string) {
     // Lấy dữ liệu cá nhân theo id
    const dataItem: any = await this.dangKyHoatDongKhoangSanFacadeService
      .getTaiLieuService()
      .getByid(idTaiLieu).toPromise();

    if (!dataItem) {
      this.commonService.showDialogWarning(this.dataTranslate.DANGKYHOATDONGKHOANGSAN.tailieu.informedNotExistedTaiLieu);
      return;
    }

    // clear Sidenav
    this.matSidenavService.clearSidenav();
    // Khởi tạo sidenav
    this.matSidenavService.setSidenav(this.matSidenav, this, this.content, this.cfr);

    if (this.nhomTaiLieu === this.nhomTaiLieuEnum.TaiLieuBatBuoc) {
      this.matSidenavService.setTitle(this.dataTranslate.DANGKYHOATDONGKHOANGSAN.tailieu.requiredUploadFile);
    } else if (this.nhomTaiLieu === this.nhomTaiLieuEnum.TaiLieuKhongBatBuoc) {
      this.matSidenavService.setTitle(this.dataTranslate.DANGKYHOATDONGKHOANGSAN.tailieu.differentUploadFile);
    } else if (this.nhomTaiLieu === this.nhomTaiLieuEnum.TaiLieuXuLyHoSo) {
      this.matSidenavService.setTitle(this.dataTranslate.DANGKYHOATDONGKHOANGSAN.tailieu.processedUploadFile);
    } else {
      return;
    }

    await this.matSidenavService.setContentComp(HosotailieuIoComponent, "upload", dataItem);
    await this.matSidenavService.open();
  }

  /**
   * Hàm mở sidenav chức năng sửa dữ liệu
   * @param id
   */
  async editItemTaiLieu(idTaiLieu: string) {
    // Lấy dữ liệu cá nhân theo id
    const dataItem: any = await this.dangKyHoatDongKhoangSanFacadeService
      .getTaiLieuService()
      .getByid(idTaiLieu).toPromise();

    if (!dataItem) {
      this.commonService.showDialogWarning(this.dataTranslate.DANGKYHOATDONGKHOANGSAN.tailieu.informedNotExistedTaiLieu);
      return;
    }

    if (dataItem.nhomtailieu !== this.nhomTaiLieuEnum.TaiLieuKhongBatBuoc
        && dataItem.nhomtailieu !== this.nhomTaiLieuEnum.TaiLieuXuLyHoSo) {
      return;
    }

    // clear Sidenav
    this.matSidenavService.clearSidenav();
    // Khởi tạo sidenav
    this.matSidenavService.setSidenav(this.matSidenav, this, this.content, this.cfr);

    if (this.nhomTaiLieu === this.nhomTaiLieuEnum.TaiLieuKhongBatBuoc) {
      this.matSidenavService.setTitle(this.dataTranslate.DANGKYHOATDONGKHOANGSAN.tailieu.differentTitleEdit);
    } else if (this.nhomTaiLieu === this.nhomTaiLieuEnum.TaiLieuXuLyHoSo) {
      this.matSidenavService.setTitle(this.dataTranslate.DANGKYHOATDONGKHOANGSAN.tailieu.processedTitleEdit);
    } else {
      return;
    }

    await this.matSidenavService.setContentComp(HosotailieuIoComponent, "edit", dataItem);
    await this.matSidenavService.open();
  }

  /**
   * Update danh sách tài liệu bắt buộc
   */

  async updateHoSoCauHinhToHsTaiLieu() {
    const idItems: string[] = [];
    const dialogRef = this.commonService.confirmSaveDiaLogService
                              ("", this.dataTranslate.DANGKYHOATDONGKHOANGSAN.tailieu.confirmedContentOfRequiredRecordUpdateDialog,
                              this.dataTranslate.DANGKYHOATDONGKHOANGSAN.tailieu.informedDialogTitle);
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === "confirm") {
        this.dangKyHoatDongKhoangSanFacadeService.getTaiLieuService()
        .updateHsCauHinhToHsTaiLieu({idhoso: this.idhoso})
        .subscribe(
          () => {
            this.getAllTaiLieu();
          },
          (error: HttpErrorResponse) => {
            this.commonService.showDialogWarning(error.error.errors);
          },
          () =>
            this.commonService.showeNotiResult(
              this.dataTranslate.COMMON.default.successAdd,
              2000
        ));
      }
    });
  }

  /**
   * Download tài liệu
   */
  async downloadTaiLieuHoSo(idTaiLieu: string) {
    const dataItem: any = await this.dangKyHoatDongKhoangSanFacadeService
      .getTaiLieuService()
      .getByid(idTaiLieu).toPromise();

    if (!dataItem) {
      this.commonService.showDialogWarning(this.dataTranslate.DANGKYHOATDONGKHOANGSAN.tailieu.informedNotExistedTaiLieu);
      return;
    }

    if (dataItem && dataItem.duongdan && dataItem.filedinhkem) {
      await this.commonFacadeService.getFileService()
                .downloadFile({uri: dataItem.duongdan, filename: dataItem.filedinhkem}).subscribe(
                  (data) => {
                    const localBlobData = new Blob([data], { type: 'application/octet-stream' });
                    if (data) {
                      const localDowloadLink = document.createElement('a');
                      const localUrl = window.URL.createObjectURL(localBlobData);
                      localDowloadLink.href = localUrl;
                      localDowloadLink.setAttribute('download', dataItem.filedinhkem);
                      document.body.appendChild(localDowloadLink);
                      localDowloadLink.click();
                      document.body.removeChild(localDowloadLink);
                    }
                  },
                  (error: HttpErrorResponse) => {
                    this.commonService.showDialogWarning(error.error.errors);
                  }
                );
    } else {
      this.commonService.showDialogWarning(this.dataTranslate.COMMON.default.informedNotExistedFile);
    }
  }

  /**
   * Hàm load lại dữ liệu grid
   */
  reloadDataGrid() {
    this.getAllTaiLieu();
  }

  /**
   * Hàm delete mảng item đã chọn
   */
  deleteArrayItem() {
    const idItems: string[] = [];
    const dialogRef = this.commonService.confirmDeleteDiaLogService("", this.dataTranslate.DANGKYHOATDONGKHOANGSAN.tailieu.confirmedContentOfDeleteDialog);
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === "confirm") {
        this.listDataSelect.map(res => {
          idItems.push(res.idtailieu);
        });

        const dataBody: any = {
          list: idItems,
        };

        this.dangKyHoatDongKhoangSanFacadeService.getTaiLieuService()
        .deleteItemsTaiLieu(dataBody)
        .subscribe(
          () => {
            this.getAllTaiLieu();
          },
          (error: HttpErrorResponse) => {
            this.commonService.showDialogWarning(error.error.errors);
          },
          () =>
            this.commonService.showeNotiResult(
              this.dataTranslate.COMMON.default.successDelete,
              2000
        ));
      }
    });
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
