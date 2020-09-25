import {Component, OnInit, Input, ViewChild} from '@angular/core';
import {DatePipe} from '@angular/common';
import {DataStateChangeEventArgs, TextWrapSettingsModel} from "@syncfusion/ej2-angular-grids";
import {Observable} from "rxjs";
import {MatDialog} from "@angular/material";
import {HttpErrorResponse} from "@angular/common/http";
import {TranslateService} from "@ngx-translate/core";
import {FormGroup, FormBuilder} from "@angular/forms";
import {GridComponent} from "@syncfusion/ej2-angular-grids";
import {Router} from "@angular/router";
import {ChiTietCapPhepHoatDongKS, NhomLoaiGiayPhepEnum } from "src/app/shared/constants/nhomloaigiayphep-constants";
import {SettingsCommon, ThietLapHeThong} from "src/app/shared/constants/setting-common";
import {DmFacadeService} from "src/app/services/admin/danhmuc/danhmuc-facade.service";
import {CommonServiceShared} from "src/app/services/utilities/common-service";
import {ThietlapFacadeService} from "src/app/services/admin/thietlap/thietlap-facade.service";
import {GeneralClientService} from "src/app/services/admin/common/general-client.service";
import {AdminRoutingName} from 'src/app/routes/admin-routes-name';
import { OutputDmLoaiGiayPhepModel } from 'src/app/models/admin/danhmuc/loaigiayphep.model';
import { CapPhepHoatDongKhoangSanFacadeService } from 'src/app/services/admin/capphephoatdongkhoangsan/capphephoatdongkhoangsan-facade.service';
import { OutputGiayPhepModel } from 'src/app/models/admin/capphephoatdongkhoangsan/giayphep.model';


@Component({
  selector: 'app-giayphep-list',
  templateUrl: './giayphep-list.component.html',
  styleUrls: ['./giayphep-list.component.scss']
})
export class GiayphepListComponent implements OnInit {

  // tslint:disable-next-line: no-input-rename
  @Input("nhomLoaiGiayPhep") nhomLoaiGiayPhep: number;

  // tslint:disable-next-line: no-input-rename
  @Input("title") title: string;
  // tslint:disable-next-line: no-input-rename
  @Input("allowAutoInit") allowAutoInit = true;
  // Viewchild template
  @ViewChild("gridGiayPhep", {static: false}) public gridGiayPhep: GridComponent;

  // Chứa thiết lập grid
  public settingsCommon = new SettingsCommon();

  // Chứa thuộc tính form
  public formSearch: FormGroup;

  // Chứa danh sách hồ sơ
  public listGiayPhep: Observable<DataStateChangeEventArgs>;

  // Chứa dữ liệu đã chọn
  public selectedItem: OutputGiayPhepModel;

  // Chứa danh sách loại cấp phép
  public allLoaiGiayPhep: OutputDmLoaiGiayPhepModel[];

  // Filter Lĩnh Vực
  public loaiGiayPhepFilters: OutputDmLoaiGiayPhepModel[];

  // Service
  public itemService: any;

  // Paging
  public state: DataStateChangeEventArgs;

  // Chứa dữ liệu translate
  public dataTranslate: any;

  // Chứa kiểu wrap text trên grid
  public wrapSettings: TextWrapSettingsModel;

  constructor(public capPhepHoatDongKhoangSanFacadeService: CapPhepHoatDongKhoangSanFacadeService,
              public commonService: CommonServiceShared,
              public thietlapFacadeService: ThietlapFacadeService,
              private translate: TranslateService,
              public router: Router,
              public formBuilder: FormBuilder,
              public generalClientService: GeneralClientService,
              public dmFacadeService: DmFacadeService,
              public datePipe: DatePipe,
              public modalDialog: MatDialog) {
    this.itemService = this.capPhepHoatDongKhoangSanFacadeService.getGiayPhepService();
  }

  async ngOnInit() {

    // Setting wrap mode
    this.wrapSettings = {wrapMode: 'Both'};

    // Gọi hàm lấy dữ liệu translate
    this.getDataTranslate();

    if (this.allowAutoInit) {
      await this.manualDataInit();
    }
  }

  /**
   * Form innit
   */
  formInit() {
    this.formSearch = this.formBuilder.group({
      GTEqualNgaycapphep: [""],
      LTEqualNgaycapphep: [""],
      Loaigiayphep: [""],
      Keyword: [""]
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

  async manualDataInit() {
    if (this.nhomLoaiGiayPhep === NhomLoaiGiayPhepEnum.ThamDoKhoangSan
      || this.nhomLoaiGiayPhep === NhomLoaiGiayPhepEnum.KhaiThacKhoangSan
      || this.nhomLoaiGiayPhep === NhomLoaiGiayPhepEnum.TanThuKhoangSan
      || this.nhomLoaiGiayPhep === NhomLoaiGiayPhepEnum.TraLaiGiayPhep
      || this.nhomLoaiGiayPhep === NhomLoaiGiayPhepEnum.DongCuaMo
      || this.nhomLoaiGiayPhep === NhomLoaiGiayPhepEnum.TinhTienCapQuyen
      || this.nhomLoaiGiayPhep === NhomLoaiGiayPhepEnum.PheDuyetTruLuong
      || this.nhomLoaiGiayPhep === NhomLoaiGiayPhepEnum.DauGiaQuyenKhaiThac) {
      // Khởi tạo form
      this.formInit();
      // Gọi hàm lấy dữ liệu translate
      await this.getDataTranslate();
      // Gọi hàm lấy dữ liệu danh sách loại cấp phép
      await this.getAllLoaiGiayPhep();
      // Gọi hàm lấy dữ liệu pagesize
      await this.getDataPageSize();
    }

    return true;
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

    await this.getAllGiayPhep();
  }

  /**
   * Hàm lấy dữ liệu loại cấp phép
   */
  async getAllLoaiGiayPhep() {
    if (this.nhomLoaiGiayPhep === null || this.nhomLoaiGiayPhep === undefined) {
      this.nhomLoaiGiayPhep = -1;
    }

    const listData: any = await this.dmFacadeService
      .getDmLoaiGiayPhepService()
      .getFetchAll({Nhomloaigiayphep: this.nhomLoaiGiayPhep, PageNumber: 1, PageSize: -1});
    this.loaiGiayPhepFilters = listData.items;
    this.allLoaiGiayPhep = listData.items;
  }

  /**
   * Hàm lấy dữ liệu hồ sơ
   */
  async getAllGiayPhep() {
    this.listGiayPhep = this.itemService;
    const searchModel = {
      GTEqualNgaycapphep: this.formSearch.controls.GTEqualNgaycapphep.value !== null && this.formSearch.controls.GTEqualNgaycapphep.value !== "" ? this.datePipe.transform(this.formSearch.controls.GTEqualNgaycapphep.value, "MM-dd-yyyy") : "",
      LTEqualNgaycapphep: this.formSearch.controls.LTEqualNgaycapphep.value !== null && this.formSearch.controls.LTEqualNgaycapphep.value !== "" ? this.datePipe.transform(this.formSearch.controls.LTEqualNgaycapphep.value, "MM-dd-yyyy") : "",
      Loaigiayphep: this.formSearch.controls.Loaigiayphep.value,
      Keyword: this.formSearch.controls.Keyword.value,
      Nholmoaigiayphep: this.nhomLoaiGiayPhep
    };

    this.itemService
      .getDataFromServer({skip: 0, take: this.settingsCommon.pageSettings.pageSize}, searchModel);
  }

  /*
   * When page item clicked
   */
  dataStateChange(state: DataStateChangeEventArgs): void {
    const searchModel = {
      GTEqualNgaytiepnhan: this.formSearch.controls.GTEqualNgaytiepnhan.value !== null && this.formSearch.controls.GTEqualNgaytiepnhan.value !== "" ? this.datePipe.transform(this.formSearch.controls.GTEqualNgaytiepnhan.value, "MM-dd-yyyy") : "",
      LTEqualNgaytiepnhan: this.formSearch.controls.LTEqualNgaytiepnhan.value !== null && this.formSearch.controls.LTEqualNgaytiepnhan.value !== "" ? this.datePipe.transform(this.formSearch.controls.LTEqualNgaytiepnhan.value, "MM-dd-yyyy") : "",
      Loaicapphep: this.formSearch.controls.Loaicapphep.value,
      Keyword: this.formSearch.controls.Keyword.value,
    };

    this.itemService.getDataFromServer(state, searchModel);
  }

  /**
   * Hàm load lại dữ liệu grid
   */
  reloadDataGrid() {
    this.formSearch.reset({
      Keyword: "",
      GTEqualNgaycapphep: "",
      LTEqualNgaycapphep: "",
      Loaicapphep: ""
    });
    this.getAllGiayPhep();
  }

  /**
   * Hàm mở sidenav chức năng thêm mới
   */
  addItemGiayPhep() {
    this.router.navigate([
      `${AdminRoutingName.adminUri}/${AdminRoutingName.dangkyhoatdongkhoangsanUri}/${ChiTietCapPhepHoatDongKS[this.nhomLoaiGiayPhep]}`]);
  }

  /**
   * Hàm mở sidenav chức năng sửa dữ liệu
   * @param id
   */
  async editItemGiayPhep(id: any) {
    this.router.navigate([
        `${AdminRoutingName.adminUri}/${AdminRoutingName.dangkyhoatdongkhoangsanUri}/${ChiTietCapPhepHoatDongKS[this.nhomLoaiGiayPhep]}`],
      {queryParams: {idgiayphep: id}});
  }

  /**
   *  Hàm xóa một bản ghi, được gọi khi nhấn nút xóa trên giao diện list
   */
  async deleteItemGiayPhep(data) {
    this.selectedItem = data;
    const canDelete: string = this.capPhepHoatDongKhoangSanFacadeService
      .getGiayPhepService()
      .checkBeDeleted(this.selectedItem.idgiayphep);
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
      this.dataTranslate.DANGKYHOATDONGKHOANGSAN.hoso.contentDelete,
      this.selectedItem.sogiayphep
    );
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === "confirm") {
        await this.capPhepHoatDongKhoangSanFacadeService
          .getGiayPhepService()
          .deleteItem({idhoso: this.selectedItem.idhoso})
          .subscribe(
            () => this.getAllGiayPhep(),
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
