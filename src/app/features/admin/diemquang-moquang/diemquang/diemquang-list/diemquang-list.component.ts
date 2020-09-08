import { Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef } from "@angular/core";
import { Observable } from "rxjs";
import { DataStateChangeEventArgs } from "@syncfusion/ej2-angular-grids";
import { MatSidenav } from "@angular/material/sidenav";
import { TranslateService } from "@ngx-translate/core";
import { HttpErrorResponse } from "@angular/common/http";
import { GridComponent } from "@syncfusion/ej2-angular-grids";
import { FormGroup, FormBuilder } from "@angular/forms";
import { MatDialog } from "@angular/material";

import { MenuDiemMo } from "src/app/shared/constants/sub-menus/diemquang-moquang/diemquang-moquang";
import { SettingsCommon, ThietLapHeThong } from "src/app/shared/constants/setting-common";
import { OutputDiemMoModel } from "src/app/models/admin/diemquang-moquang/diemmo.model";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { DiemQuangMoQuangFacadeService } from "src/app/services/admin/diemquang-moquang/diemquang-moquang-facade.service";
import { DiemquangIoComponent } from "src/app/features/admin/diemquang-moquang/diemquang/diemquang-io/diemquang-io.component";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { ThietlapFacadeService } from "src/app/services/admin/thietlap/thietlap-facade.service";
import { GeneralClientService } from "src/app/services/admin/common/general-client.service";
import { MyAlertDialogComponent } from "src/app/shared/components/my-alert-dialog/my-alert-dialog.component";

@Component({
  selector: 'app-diemquang-list',
  templateUrl: './diemquang-list.component.html',
  styleUrls: ['./diemquang-list.component.scss']
})
export class DiemquangListComponent implements OnInit {
  // Viewchild template
  @ViewChild("gridDiemMo", { static: false }) public gridDiemMo: GridComponent;
  @ViewChild("aside", { static: true }) public matSidenav: MatSidenav;
  @ViewChild("compdiemoio", { read: ViewContainerRef, static: true }) public content: ViewContainerRef;

  // Chứa thuộc tính form
  public formSearch: FormGroup;

  // Chứa thiết lập grid
  public settingsCommon = new SettingsCommon();

  // Chứa danh sách điểm mỏ
  public listDiemMo: Observable<DataStateChangeEventArgs>;

  // Service
  public itemService: any;

  // Paging
  public state: DataStateChangeEventArgs;

  // Chứa dữ liệu đã chọn
  public selectedItem: OutputDiemMoModel;

  // Chứa menu item trên subheader
  public navArray = MenuDiemMo;

  // Chứa dữ liệu translate
  public dataTranslate: any;

  constructor(public matSidenavService: MatsidenavService,
    public cfr: ComponentFactoryResolver,
    public diemQuangMoQuangFacadeService: DiemQuangMoQuangFacadeService,
    public commonService: CommonServiceShared,
    public thietlapFacadeService: ThietlapFacadeService,
    private translate: TranslateService,
    public formBuilder: FormBuilder,
    public generalClientService: GeneralClientService,
    public modalDialog: MatDialog
  ) {
    this.itemService = this.diemQuangMoQuangFacadeService.getDiemMoService();
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
      this.settingsCommon.pageSettings.pageSize = dataSetting.settingValue;
    } else {
      this.settingsCommon.pageSettings.pageSize = 10;
    }

    this.getAllDiemMo();
  }

  /**
   * Hàm lấy dữ liệu Cá nhân
   */
  async getAllDiemMo() {
    this.listDiemMo = this.itemService;
    const searchModel = this.formSearch.value;
    this.itemService
      .getDataFromServer({ skip: 0, take: this.settingsCommon.pageSettings.pageSize }, searchModel);
  }

  // When page item clicked
  public dataStateChange(state: DataStateChangeEventArgs): void {
    const searchModel = this.formSearch.value;
    this.itemService.getDataFromServer(state, searchModel);
  }

  /**
   * Hàm mở sidenav chức năng thêm mới
   */
  public openDiemMoIOSidenav() {
    this.matSidenavService.setTitle(this.dataTranslate.DIEMQUANGMOQUANG.diemmo.titleAdd);
    this.matSidenavService.setContentComp(DiemquangIoComponent, "new");
    this.matSidenavService.open();
  }

  /**
   * Hàm mở sidenav chức năng sửa dữ liệu
   * @param id
   */
  async editItemDiemMo(id: any) {
    // Lấy dữ liệu cá nhân theo id
    const dataItem: any = await this.diemQuangMoQuangFacadeService
      .getDiemMoService()
      .getByid(id).toPromise();
    await this.matSidenavService.setTitle(this.dataTranslate.DIEMQUANGMOQUANG.diemmo.titleEdit);
    await this.matSidenavService.setContentComp(DiemquangIoComponent, "edit", dataItem);
    await this.matSidenavService.open();
  }

  /**
   * Hàm load lại dữ liệu grid
   */
  public reloadDataGrid() {
    this.formSearch.reset({ Keyword: "" });
    this.getAllDiemMo();
  }

  /**
   * Hàm đóng sidenav
   */
  public closeDiemMoIOSidenav() {
    this.matSidenavService.close();
  }

  /**
   *  Hàm xóa một bản ghi, được gọi khi nhấn nút xóa trên giao diện list
   */
  async deleteItemDiemMo(data) {
    this.selectedItem = data;
    // Phải check xem dữ liệu muốn xóa có đang được dùng ko, đang dùng thì ko xóa
    // Trường hợp dữ liệu có thể xóa thì Phải hỏi người dùng xem có muốn xóa không
    // Nếu đồng ý xóa
    const canDelete: string = this.diemQuangMoQuangFacadeService
      .getDiemMoService()
      .checkBeDeleted(this.selectedItem.idmo);
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
      this.dataTranslate.DIEMQUANGMOQUANG.diemmo.contentDelete,
      this.selectedItem.tenmo
    );
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === "confirm") {
        await this.diemQuangMoQuangFacadeService
          .getDiemMoService()
          .deleteItem({ iddiemmo: this.selectedItem.idmo })
          .subscribe(
            () => this.getAllDiemMo(),
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
