import { Component, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { MatSidenav } from "@angular/material";
import { TranslateService } from "@ngx-translate/core";
import { GridComponent, TextWrapSettingsModel } from "@syncfusion/ej2-angular-grids";
import { HttpErrorResponse } from "@angular/common/http";

import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { ThietlapFacadeService } from "src/app/services/admin/thietlap/thietlap-facade.service";
import { ThietLapHeThong, SettingsCommon } from "src/app/shared/constants/setting-common";
import { BaocaoFacadeService } from "src/app/services/admin/baocao/baocao-facade.service";
import { OutputTaiLieuModel } from "src/app/models/admin/baocao/tailieudinhkem.model";
import { Paging } from "src/app/shared/constants/enum";
import { GeneralClientService } from "src/app/services/admin/common/general-client.service";
import { TailieudinhkemIoComponent } from "src/app/features/admin/baocao/baocao/tailieudinhkem/tailieudinhkem-io/tailieudinhkem-io.component";
import { CommonServiceShared } from "src/app/services/utilities/common-service";

@Component({
  selector: 'app-tailieudinhkem-list',
  templateUrl: './tailieudinhkem-list.component.html',
  styleUrls: ['./tailieudinhkem-list.component.scss']
})
export class TailieudinhkemListComponent implements OnInit {

  // Viewchild template
  @ViewChild("gridTaiLieu", { static: false }) public gridToaDo: GridComponent;
  @ViewChild('aside', { static: true }) public matSidenav: MatSidenav;
  @ViewChild("compTaiLieuIO", { read: ViewContainerRef, static: true }) public content: ViewContainerRef;

  // Chứa id báo cáo
  public idBaoCao: string;

  // Chứa dữ liệu translate
  public dataTranslate: any;

  // Chứa danh sách tài liệu
  public listTaiLieu: OutputTaiLieuModel[];

  // Chứa kiểu wrap text trên grid
  public wrapSettings: TextWrapSettingsModel;

  // Chứa thiết lập grid
  public settingsCommon = new SettingsCommon();

  // Chứa dữ liệu item đã chọn
  public selectedItem: OutputTaiLieuModel;

  constructor(
    private activatedRoute: ActivatedRoute,
    public matSidenavService: MatsidenavService,
    public cfr: ComponentFactoryResolver,
    private translate: TranslateService,
    public thietlapFacadeService: ThietlapFacadeService,
    public baocaoFacadeService: BaocaoFacadeService,
    public generalClientService: GeneralClientService,
    public commonService: CommonServiceShared
  ) { }

  async ngOnInit() {
    // Setting wrap mode
    this.wrapSettings = { wrapMode: 'Both' };
    // Lấy id trên url
    this.idBaoCao = this.activatedRoute.snapshot.paramMap.get('id');
    // Lấy dữ iệu translate
    await this.getDataTranslate();
    // Lấy dữ liệu setting paging
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
    const dataSetting: any = await this.thietlapFacadeService
      .getThietLapHeThongService()
      .getByid(ThietLapHeThong.defaultPageSize).toPromise();
    if (dataSetting) {
      this.settingsCommon.pageSettings.pageSize = +dataSetting.settingValue;
    } else {
      this.settingsCommon.pageSettings.pageSize = 10;
    }
    // Gọi hàm lấy danh sách tài liệu
    await this.getAllTaiLieuById();
  }

  async getAllTaiLieuById() {
    const listData: any = await this.baocaoFacadeService
    .getTaiLieuDinhKemService()
    .getFetchAll({Idbaocao: this.idBaoCao, PageNumber: Paging.PageNumber, PageSize: Paging.PageSize});
    this.listTaiLieu = this.generalClientService.generateOrderOf(listData.items, "serialNumber", 1);
  }

  /**
   * Hàm load lại dữ liệu grid
   */
  public reloadDataGrid() {
    this.getAllTaiLieuById();
  }

  /**
   * Hàm mở sidenav chức năng sửa dữ liệu
   * @param id
   */
  async editItemTaiLieuDinhKem(id: any) {
    // Khởi tạo sidenav
    this.matSidenavService.setSidenav(this.matSidenav, this, this.content, this.cfr);
    // Lấy dữ liệu tài liệu đính kèm theo id báo cáo
    const dataItem: any = await this.baocaoFacadeService
      .getTaiLieuDinhKemService()
      .getByid(id).toPromise();
    await this.matSidenavService.setTitle(this.dataTranslate.BAOCAO.tailieudinhkem.titleEdit);
    await this.matSidenavService.setContentComp(TailieudinhkemIoComponent, "edit", dataItem);
    await this.matSidenavService.open();
  }

  /**
   * Hàm mở sidenav chức năng thêm mới
   */
  public openTaiLieuDinhKemIOSidenav() {
    // Khởi tạo sidenav
    this.matSidenavService.setSidenav(this.matSidenav, this, this.content, this.cfr);
    this.matSidenavService.setTitle(this.dataTranslate.BAOCAO.tailieudinhkem.titleAdd);
    this.matSidenavService.setContentComp(TailieudinhkemIoComponent, "new");
    this.matSidenavService.open();
  }

  /**
   * Hàm đóng sidenav
   */
  public closeTaiLieuDinhKemIOSidenav() {
    this.matSidenavService.close();
  }

   /**
   *  Hàm xóa một bản ghi, được gọi khi nhấn nút xóa trên giao diện list
   */
  async deleteItemBaoCao(data) {
    this.selectedItem = data;
    // Phải check xem dữ liệu muốn xóa có đang được dùng ko, đang dùng thì ko xóa
    // Trường hợp dữ liệu có thể xóa thì Phải hỏi người dùng xem có muốn xóa không
    // Nếu đồng ý xóa
    const canDelete: string = this.baocaoFacadeService
      .getBaoCaoService()
      .checkBeDeleted(this.selectedItem.idbaocao);
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
      this.dataTranslate.BAOCAO.baocao.contentDelete,
      this.selectedItem.tentailieu
    );
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === "confirm") {
        await this.baocaoFacadeService
          .getTaiLieuDinhKemService()
          .deleteItem({ idtailieu: this.selectedItem.idtailieu })
          .subscribe(
            () => this.getAllTaiLieuById(),
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
}
