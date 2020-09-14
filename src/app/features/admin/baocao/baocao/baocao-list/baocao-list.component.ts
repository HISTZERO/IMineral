import { Component, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { GridComponent, DataStateChangeEventArgs, TextWrapSettingsModel } from "@syncfusion/ej2-angular-grids";
import { MatSidenav, MatDialog } from "@angular/material";
import { HttpErrorResponse } from "@angular/common/http";
import { FormGroup, FormBuilder } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { Observable } from "rxjs";

import { SettingsCommon, ThietLapHeThong } from "src/app/shared/constants/setting-common";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { ThietlapFacadeService } from "src/app/services/admin/thietlap/thietlap-facade.service";
import { OutputBaoCaoModel } from "src/app/models/admin/baocao/baocao.model";
import { BaocaoFacadeService } from "src/app/services/admin/baocao/baocao-facade.service";
import { AdminRoutingName } from "src/app/routes/admin-routes-name";

import { idNhomBaoCao, nameNhomBaoCao } from "src/app/shared/constants/nhombaocao-constants";
import { DoiTuongBaoCao } from "src/app/shared/constants/common-constants";
import { DmFacadeService } from "src/app/services/admin/danhmuc/danhmuc-facade.service";
import { OutputDmLoaiBaoCaoModel } from "src/app/models/admin/danhmuc/loaibaocao.model";
import { BaocaoIoComponent } from "../baocao-io/baocao-io.component";

@Component({
  selector: 'app-baocao-list',
  templateUrl: './baocao-list.component.html',
  styleUrls: ['./baocao-list.component.scss']
})
export class BaocaoListComponent implements OnInit {

  // Viewchild template
  @ViewChild("gridBaoCao", { static: false }) public gridBcDieuTraKhaoSat: GridComponent;
  @ViewChild("aside", { static: true }) public matSidenav: MatSidenav;
  @ViewChild("compBaoCaoIo", { read: ViewContainerRef, static: true }) public content: ViewContainerRef;

  // Chứa thuộc tính form
  public formSearch: FormGroup;

  // Chứa thiết lập grid
  public settingsCommon = new SettingsCommon();

  // Chứa danh sách Báo cáo
  public listBaoCao: Observable<DataStateChangeEventArgs>;

  // Chứa danh sách Loại Báo Cáo
  public listLoaiBaoCao: OutputDmLoaiBaoCaoModel[];

  // Chứa dữ liệu đã chọn
  public selectedItem: OutputBaoCaoModel;

  // Chứa dữ liệu translate
  public dataTranslate: any;

  // Chứa menu item trên subheader
  public navArray: any;

  // Chứa kiểu wrap text trên grid
  public wrapSettings: TextWrapSettingsModel;

  // Chứa pagesize
  public pageSize: number;

  // Biến để chứa service báo cáo 
  public baocaoService: any;

  // Chứa key báo cáo
  public keyBaoCao: string;

  // Chứa tên danh sách
  public tenBaoCao: string;

  // Chứa dữ liệu đối tượng báo cáo
  public doiTuongBaoCao = DoiTuongBaoCao;

  // Contructor
  constructor(
    public matSidenavService: MatsidenavService,
    public cfr: ComponentFactoryResolver,
    public commonService: CommonServiceShared,
    public thietlapFacadeService: ThietlapFacadeService,
    public baocaoFacadeService: BaocaoFacadeService,
    private translate: TranslateService,
    public formBuilder: FormBuilder,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public dmFacadeService: DmFacadeService
  ) {
    this.baocaoService = this.baocaoFacadeService.getBaoCaoService();
  }

  async ngOnInit() {
    // Khởi tạo form
    await this.formInit();
    // Lấy dữ liệu laoij báo cáo
    this.getAllLoaiBaoCao();
    // Lấy dữ liệu từ url
    await this.getKeyBaoCaoByUrl();
    // Setting wrap mode
    this.wrapSettings = { wrapMode: 'Both' };
    // Khởi tạo sidenav
    this.matSidenavService.setSidenav(this.matSidenav, this, this.content, this.cfr);
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
   * Lấy key báo cáo theo url
   */
  public getKeyBaoCaoByUrl() {
    this.activatedRoute.paramMap.subscribe((key: any) => {
      this.keyBaoCao = key.params.key;
      this.tenBaoCao = nameNhomBaoCao[this.keyBaoCao];
      this.navArray = [
        { title: "Quản trị", url: `/${AdminRoutingName.adminUri}` },
        {
          title: "Báo cáo",
          url: `/${AdminRoutingName.adminUri}/${AdminRoutingName.baocaoUri}`,
        },
        {
          title: nameNhomBaoCao[this.keyBaoCao],
          url: "",
        },
      ]
      // Gọi hàm tổng hợp các function
      this.initComponent();
    })
  }

  /**
   * Hàm tổng hợp các function khi load componet
   */
  async initComponent() {
    // Gọi hàm lấy dữ liệu translate
    await this.getDataTranslate();
    // Gọi hàm lấy dữ liệu pagesize
    await this.getDataPageSize();
  }

  /**
  * Hàm lấy dữ liệu Loại báo cáo
  */
  async getAllLoaiBaoCao(param: any = { PageNumber: 1, PageSize: -1 }) {
    const listData: any = await this.dmFacadeService
      .getDmLoaiBaoCaoService()
      .getFetchAll(param);
    this.listLoaiBaoCao = listData.items;
  }

  /**
   * Hàm lấy dữ liệu pagesize số bản ghi hiển thị trên 1 trang
   */
  async getDataPageSize() {
    const dataSetting: any = await this.thietlapFacadeService
      .getThietLapHeThongService()
      .getByid(ThietLapHeThong.listPageSize).toPromise();
    if (dataSetting) {
      this.pageSize = +dataSetting.settingValue;
      this.settingsCommon.pageSettings.pageSize = +dataSetting.settingValue;
    } else {
      this.pageSize = 10;
      this.settingsCommon.pageSettings.pageSize = 10;
    }
    // Gọi hàm lấy dữ liệu báo cáo
    await this.getAllBaoCao();
  }

  /**
   * Hàm load lại dữ liệu grid
   */
  public reloadDataGrid() {
    this.formSearch.reset({
      Keyword: "",
      Idloaibaocao: "",
      Doituongbaocao: ""
    });
    this.getAllBaoCao();
  }

  /**
   * Hàm lấy dữ liệu báo cáo
   */
  async getAllBaoCao() {
    const valueSearch: any = this.formSearch.value;
    valueSearch['Nhombaocao'] = idNhomBaoCao[this.keyBaoCao];
    this.listBaoCao = this.baocaoService;
    this.baocaoService.getDataFromServer({ skip: 0, take: this.pageSize }, valueSearch);
  }

  /**
   * Hàm lấy về danh sách báo cáo (phân trang bên server) khi click vào pagination trên grid
   * @param state
   */
  public dataStateChange(state: DataStateChangeEventArgs): void {
    this.baocaoService.getDataFromServer(state, this.formSearch.value);
  }


  /**
   * Tìm kiếm nâng cao
   */
  public searchAdvance() {
    this.getAllBaoCao();
  }

  /**
   * Form innit
   */
  public formInit() {
    this.formSearch = this.formBuilder.group({
      Keyword: [""],
      Idloaibaocao: [""],
      Doituongbaocao: [""]
    });
  }

  /**
   * Hàm điều hướng đến trang thông tin chung
   * @param id
   */
  public detailItem(id) {
    this.router.navigate([
      `${AdminRoutingName.adminUri}/${AdminRoutingName.baocaoUri}/${AdminRoutingName.thongtin}/${this.keyBaoCao}/${id}`]);
  }


  /**
   * Hàm mở sidenav chức năng sửa dữ liệu
   * @param id
   */
  async editItemBaoCao(id: any) {
    // Lấy dữ liệu báo cáo theo id
    const dataItem: any = await this.baocaoFacadeService
      .getBaoCaoService()
      .getByid(id).toPromise();
    await this.matSidenavService.setTitle(this.dataTranslate.BAOCAO.baocao.titleEdit + " " + nameNhomBaoCao[this.keyBaoCao]);
    await this.matSidenavService.setContentComp(BaocaoIoComponent, "edit", dataItem);
    await this.matSidenavService.open();
  }

  /**
   * Hàm mở sidenav chức năng thêm mới
   */
  public openBaoCaoIOSidenav() {
    this.matSidenavService.setTitle(this.dataTranslate.BAOCAO.baocao.titleAdd + " " + nameNhomBaoCao[this.keyBaoCao]);
    this.matSidenavService.setContentComp(BaocaoIoComponent, "new");
    this.matSidenavService.open();
  }

  /**
   * Hàm đóng sidenav
   */
  public closeBaoCaoIOSidenav() {
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
      this.selectedItem.tenbaocao
    );
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === "confirm") {
        await this.baocaoFacadeService
          .getBaoCaoService()
          .deleteItem({ idbaocao: this.selectedItem.idbaocao })
          .subscribe(
            () => this.getAllBaoCao(),
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
  doFunction(methodName) {
    this[methodName]();
  }

}
