import { Component, ComponentFactoryResolver, Input, OnInit, ViewChild, ViewContainerRef } from "@angular/core";
import { Observable } from "rxjs";
import { DataStateChangeEventArgs, QueryCellInfoEventArgs, TextWrapSettingsModel } from "@syncfusion/ej2-angular-grids";
import { MatSidenav } from "@angular/material/sidenav";
import { TranslateService } from "@ngx-translate/core";
import { HttpErrorResponse } from "@angular/common/http";
import { GridComponent } from "@syncfusion/ej2-angular-grids";
import { ActivatedRoute, Router } from "@angular/router";
import { FormGroup, FormBuilder } from "@angular/forms";
import { SettingsCommon, ThietLapHeThong } from "src/app/shared/constants/setting-common";
import { OutputHsTaiLieuModel } from "src/app/models/admin/hosogiayto/tailieu.model";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { HoSoGiayToFacadeService } from "src/app/services/admin/hosogiayto/hosogiayto-facade.service";
import { GiaypheptailieuIoComponent } from "src/app/features/admin/hosogiayto/giaypheptailieu/giaypheptailieu-io/giaypheptailieu-io.component";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { ThietlapFacadeService } from "src/app/services/admin/thietlap/thietlap-facade.service";
import { GeneralClientService } from "src/app/services/admin/common/general-client.service";
import { CommonFacadeService } from 'src/app/services/admin/common/common-facade.service';
import { DefaultValue } from 'src/app/shared/constants/global-var';


@Component({
  selector: 'app-giaypheptailieu-list',
  templateUrl: './giaypheptailieu-list.component.html',
  styleUrls: ['./giaypheptailieu-list.component.scss']
})
export class GiaypheptailieuListComponent implements OnInit {

  // Viewchild template
  @ViewChild("griTaiLieu", { static: false }) public griTaiLieu: GridComponent;
  @ViewChild("aside", { static: true }) public matSidenav: MatSidenav;
  @ViewChild("comptailieuio", { read: ViewContainerRef, static: true }) public content: ViewContainerRef;
  // tslint:disable-next-line: no-input-rename
  @Input("allowAutoInit") allowAutoInit = true;
  // tslint:disable-next-line: no-input-rename
  @Input("disabledMatsidenav") disabledMatsidenav = false;
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
  public idgiayphep: string;

  // disable delete button
  public disableDeleteButton = false;

  // Chứa danh sách item đã chọn
  public listDataSelect: any[];

  constructor(public matSidenavService: MatsidenavService,
              public cfr: ComponentFactoryResolver,
              public hoSoGiayToFacadeService: HoSoGiayToFacadeService,
              public commonService: CommonServiceShared,
              public thietlapFacadeService: ThietlapFacadeService,
              private translate: TranslateService,
              public formBuilder: FormBuilder,
              public generalClientService: GeneralClientService,
              public commonFacadeService: CommonFacadeService,
              public router: Router,
              private activatedRoute: ActivatedRoute
  ) {

    this.itemService = this.hoSoGiayToFacadeService.getGiayPhepTaiLieuService();
  }

  async ngOnInit() {
    this.activatedRoute.queryParamMap.subscribe((param: any) => {
      if (param && param.params && param.params.idgiayphep) {
        this.idgiayphep = param.params.idgiayphep;
      }
    });

    // Gọi hàm lấy dữ liệu translate
    await this.getDataTranslate();
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
      idgiayphep: this.idgiayphep
    };
    this.itemService.getCpTaiLieuPage({ skip: 0, take: this.settingsCommon.pageSettings.pageSize }, searchModel);
  }

  // When page item clicked
  public dataStateChange(state: DataStateChangeEventArgs): void {
    const searchModel = {
      idgiayphep: this.idgiayphep
    };
    this.itemService.getCpTaiLieuPage(state, searchModel);
  }

  /**
   * Hàm mở sidenav chức năng thêm mới
   */
  openTaiLieuIOSidenav() {
    // clear Sidenav
    this.matSidenavService.clearSidenav();
    // Khởi tạo sidenav
    this.matSidenavService.setSidenav(this.matSidenav, this, this.content, this.cfr);
    this.matSidenavService.setTitle(this.dataTranslate.HOSOGIAYTO.tailieu.titleAdd);
    const dataItem = {idgiayphep: this.idgiayphep};
    this.matSidenavService.setContentComp(GiaypheptailieuIoComponent, "new", dataItem);
    this.matSidenavService.open();
  }

  /**
   * Upload tài liệu
   * @param idTaiLieu
   */
  async uploadFileItemTaiLieu(idTaiLieu: string) {
     // Lấy dữ liệu cá nhân theo id
    const dataItem: any = await this.hoSoGiayToFacadeService
      .getGiayPhepTaiLieuService()
      .getByid(idTaiLieu).toPromise();

    if (!dataItem) {
      this.commonService.showDialogWarning(this.dataTranslate.HOSOGIAYTO.tailieu.informedNotExistedTaiLieu);
      return;
    }

    // clear Sidenav
    this.matSidenavService.clearSidenav();
    // Khởi tạo sidenav
    this.matSidenavService.setSidenav(this.matSidenav, this, this.content, this.cfr);
    this.matSidenavService.setTitle(this.dataTranslate.HOSOGIAYTO.tailieu.uploadFile);
    await this.matSidenavService.setContentComp(GiaypheptailieuIoComponent, "upload", dataItem);
    await this.matSidenavService.open();
  }

  /**
   * Hàm mở sidenav chức năng sửa dữ liệu
   * @param id
   */
  async editItemTaiLieu(idTaiLieu: string) {
    // Lấy dữ liệu cá nhân theo id
    const dataItem: any = await this.hoSoGiayToFacadeService
      .getGiayPhepTaiLieuService()
      .getByid(idTaiLieu).toPromise();

    if (!dataItem) {
      this.commonService.showDialogWarning(this.dataTranslate.HOSOGIAYTO.tailieu.informedNotExistedTaiLieu);
      return;
    }

    // clear Sidenav
    this.matSidenavService.clearSidenav();
    // Khởi tạo sidenav
    this.matSidenavService.setSidenav(this.matSidenav, this, this.content, this.cfr);
    this.matSidenavService.setTitle(this.dataTranslate.HOSOGIAYTO.tailieu.titleEdit);
    await this.matSidenavService.setContentComp(GiaypheptailieuIoComponent, "edit", dataItem);
    await this.matSidenavService.open();
  }

  /**
   * Download tài liệu
   */
  async downloadTaiLieu(idTaiLieu: string) {
    const dataItem: any = await this.hoSoGiayToFacadeService
      .getGiayPhepTaiLieuService()
      .getByid(idTaiLieu).toPromise();

    if (!dataItem) {
      this.commonService.showDialogWarning(this.dataTranslate.HOSOGIAYTO.tailieu.informedNotExistedTaiLieu);
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
    const dialogRef = this.commonService.confirmDeleteDiaLogService(DefaultValue.Empty, this.dataTranslate.HOSOGIAYTO.tailieu.confirmedContentOfDeleteDialog);
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === "confirm") {
        this.listDataSelect.map(res => {
          idItems.push(res.idtailieu);
        });

        const dataBody: any = {
          list: idItems,
        };

        this.hoSoGiayToFacadeService.getGiayPhepTaiLieuService()
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
    const canDelete: string = this.hoSoGiayToFacadeService
      .getGiayPhepTaiLieuService()
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
      this.dataTranslate.HOSOGIAYTO.tailieu.contentDelete,
      this.selectedItem.tentailieu
    );
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === "confirm") {
        await this.hoSoGiayToFacadeService
          .getGiayPhepTaiLieuService()
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
