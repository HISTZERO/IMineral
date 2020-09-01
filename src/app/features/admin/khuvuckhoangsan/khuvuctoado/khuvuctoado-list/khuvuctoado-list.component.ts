import { Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef} from "@angular/core";
import { MatSidenav } from "@angular/material/sidenav";
import { TranslateService } from "@ngx-translate/core";
import { HttpErrorResponse } from "@angular/common/http";
import { GridComponent, TextWrapSettingsModel, QueryCellInfoEventArgs } from "@syncfusion/ej2-angular-grids";
import { FormGroup, FormBuilder } from "@angular/forms";

import { SettingsCommon, ThietLapHeThong } from "src/app/shared/constants/setting-common";
import { OutputDmCanhanModel } from "src/app/models/admin/danhmuc/canhan.model";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { DmFacadeService } from "src/app/services/admin/danhmuc/danhmuc-facade.service";
import { DmCanhanIoComponent } from "src/app/features/admin/danhmuc/canhan/canhan-io/canhan-io.component";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { ThietlapFacadeService } from "src/app/services/admin/thietlap/thietlap-facade.service";
import { MenuDanhMucCaNhan } from "src/app/shared/constants/sub-menus/danhmuc/danhmuc";
import { TrangThai } from "src/app/shared/constants/trangthai-constants";
import { OutputDmDvhcModel } from "src/app/models/admin/danhmuc/dvhc.model";
import {GeneralClientService} from "src/app/services/admin/common/general-client.service";
import {TrangThaiEnum, Paging} from "src/app/shared/constants/enum";
import { KhuVucKhoangSanFacadeService } from "../../../../../services/admin/khuvuckhoangsan/khuvuckhoangsan-facade.service";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-khuvuctoado-list',
  templateUrl: './khuvuctoado-list.component.html',
  styleUrls: ['./khuvuctoado-list.component.scss']
})
export class KhuvuctoadoListComponent implements OnInit {

  // Viewchild template
  @ViewChild("gridToaDo", { static: false }) public gridToaDo: GridComponent;
  @ViewChild("aside", { static: true }) public matSidenav: MatSidenav;
  @ViewChild("compToaDoIO", { read: ViewContainerRef, static: true }) public content: ViewContainerRef;

  // Chứa thiết lập grid
  public settingsCommon = new SettingsCommon();

  // Chứa danh sách item đã chọn
  public listDataSelect: any[];

  // Chứa danh sách Cá nhân
  public listToaDo: OutputDmCanhanModel[];

  // Chứa dữ liệu đã chọn
  public selectedItem: OutputDmCanhanModel;

  // Chứa danh sách dữ liệu
  public listData: any;

  // Chứa dữ liệu translate
  public dataTranslate: any;

  // Chứa kiểu wrap text trên grid
  public wrapSettings: TextWrapSettingsModel;

  // Chứa key khu vực khoáng sản
  public keyKhuVuc: string;

  // Chứa id khu vực khoáng sản
  public idKhuVuc: string;


  // Contructor
  constructor(
    public matSidenavService: MatsidenavService,
    public cfr: ComponentFactoryResolver,
    public kvKhoangSanFacadeSv: KhuVucKhoangSanFacadeService,
    public dmFacadeService: DmFacadeService,
    public activatedRoute: ActivatedRoute,
    public commonService: CommonServiceShared,
    public thietlapFacadeService: ThietlapFacadeService,
    private translate: TranslateService,
    public formBuilder: FormBuilder,
  ) { }

  async ngOnInit() {
    await this.activatedRoute.queryParamMap.subscribe((param: any) => {
      this.keyKhuVuc = param.params.keykhuvuc;
      this.idKhuVuc = param.params.idkhuvuc;
    });
    // Gọi hàm lấy dữ liệu translate
    await this.getDataTranslate();
    // Setting wrap mode
    this.wrapSettings = { wrapMode: 'Both' };
    // Khởi tạo sidenav
    this.matSidenavService.setSidenav( this.matSidenav, this, this.content, this.cfr );
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
    const dataSetting: any = await this.thietlapFacadeService
      .getThietLapHeThongService()
      .getByid(ThietLapHeThong.defaultPageSize ).toPromise();
    if (dataSetting) {
      this.settingsCommon.pageSettings.pageSize = dataSetting.settingValue;
    } else {
      this.settingsCommon.pageSettings.pageSize = 10;
    }
    // Gọi hàm lấy dữ liệu tọa độ
    await this.getAllToaDo();
  }

  /**
   * Hàm load lại dữ liệu grid
   */
  public reloadDataGrid() {
    this.getAllToaDo();
  }

  /**
   * Hàm lấy dữ liệu Tọa độ
   */
  async getAllToaDo() {
    const listData: any = await this.kvKhoangSanFacadeSv
      .getKhuVucToaDoService()
      .getFetchAll({idKhuvuc: this.idKhuVuc});
    if (listData) {
      listData.map((canhan, index) => {
        canhan.serialNumber = index + 1;
      });
    }
    this.listToaDo = listData;
  }

  /**
   * Hàm mở sidenav chức năng sửa dữ liệu
   * @param id
   */
  async editItemCanhan(id: any) {
    // Lấy dữ liệu cá nhân theo id
    const dataItem: any = await this.dmFacadeService
    .getDmCanhanService()
    .getByid(id).toPromise();
    await this.matSidenavService.setTitle( this.dataTranslate.DANHMUC.canhan.titleEdit );
    await this.matSidenavService.setContentComp( DmCanhanIoComponent, "edit", dataItem);
    await this.matSidenavService.open();
  }

  /**
   * Hàm mở sidenav chức năng thêm mới
   */
  public openCanhanIOSidenav() {
    this.matSidenavService.setTitle(this.dataTranslate.DANHMUC.canhan.titleAdd);
    this.matSidenavService.setContentComp(DmCanhanIoComponent, "new");
    this.matSidenavService.open();
  }

  /**
   * Hàm đóng sidenav
   */
  public closeCanhanIOSidenav() {
    this.matSidenavService.close();
  }


  /**
   *  Hàm xóa một bản ghi, được gọi khi nhấn nút xóa trên giao diện list
   */
  async deleteItemCanhan(data) {
    this.selectedItem = data;
    // Phải check xem dữ liệu muốn xóa có đang được dùng ko, đang dùng thì ko xóa
    // Trường hợp dữ liệu có thể xóa thì Phải hỏi người dùng xem có muốn xóa không
    // Nếu đồng ý xóa
    const canDelete: string = this.dmFacadeService
      .getDmCanhanService()
      .checkBeDeleted(this.selectedItem.idcanhan);
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
      this.dataTranslate.DANHMUC.canhan.contentDelete,
      this.selectedItem.hovaten
    );
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === "confirm") {
            await this.dmFacadeService
              .getDmCanhanService()
              .deleteItem({ idCanhan: this.selectedItem.idcanhan })
              .subscribe(
                () => this.getAllToaDo(),
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
