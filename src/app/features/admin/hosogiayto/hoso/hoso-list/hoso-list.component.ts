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

import { NhomLoaiCapPhepEnum, ChiTietDangKyHoatDongKS } from "src/app/shared/constants/nhomloaicapphep-constants";
import {SettingsCommon, ThietLapHeThong} from "src/app/shared/constants/setting-common";
import {OutputHsHoSoModel} from "src/app/models/admin/hosogiayto/hoso.model";
import {DmFacadeService} from "src/app/services/admin/danhmuc/danhmuc-facade.service";
import {CommonServiceShared} from "src/app/services/utilities/common-service";
import {ThietlapFacadeService} from "src/app/services/admin/thietlap/thietlap-facade.service";
import {GeneralClientService} from "src/app/services/admin/common/general-client.service";
import {DangKyHoatDongKhoangSanFacadeService} from 'src/app/services/admin/dangkyhoatdongkhoangsan/dangkyhoatdongkhoangsan-facade.service';
import {AdminRoutingName} from 'src/app/routes/admin-routes-name';
import {OutputDmLoaiCapPhepModel} from 'src/app/models/admin/danhmuc/loaicapphep.model';
import { DefaultValue } from 'src/app/shared/constants/global-var';
import { HoSoGiayToFacadeService } from "src/app/services/admin/hosogiayto/hosogiayto-facade.service";


@Component({
  selector: 'app-hoso-list',
  templateUrl: './hoso-list.component.html',
  styleUrls: ['./hoso-list.component.scss']
})
export class HosoListComponent implements OnInit {
  // tslint:disable-next-line: no-input-rename
  @Input("nhomLoaiCapPhep") nhomLoaiCapPhep: number;

  // tslint:disable-next-line: no-input-rename
  @Input("title") title: string;
  // tslint:disable-next-line: no-input-rename
  @Input("allowAutoInit") allowAutoInit = true;
  // Viewchild template
  @ViewChild("gridHoSo", {static: false}) public gridHoSo: GridComponent;

  // Chứa thiết lập grid
  public settingsCommon = new SettingsCommon();

  // Chứa thuộc tính form
  public formSearch: FormGroup;

  // Chứa danh sách hồ sơ
  public listHoSo: Observable<DataStateChangeEventArgs>;

  // Chứa dữ liệu đã chọn
  public selectedItem: OutputHsHoSoModel;

  // Chứa danh sách loại cấp phép
  public allLoaiCapPhep: OutputDmLoaiCapPhepModel[];

  // Filter Lĩnh Vực
  public loaiCapPhepFilters: OutputDmLoaiCapPhepModel[];

  // Service
  public itemService: any;

  // Paging
  public state: DataStateChangeEventArgs;

  // Chứa dữ liệu translate
  public dataTranslate: any;

  // Chứa kiểu wrap text trên grid
  public wrapSettings: TextWrapSettingsModel;

  constructor(public dangKyHoatDongKhoangSanFacadeService: DangKyHoatDongKhoangSanFacadeService,
              public commonService: CommonServiceShared,
              public thietlapFacadeService: ThietlapFacadeService,
              private translate: TranslateService,
              public router: Router,
              public formBuilder: FormBuilder,
              public generalClientService: GeneralClientService,
              public dmFacadeService: DmFacadeService,
              public datePipe: DatePipe,
              public modalDialog: MatDialog,
              private hoSoGiayToFacadeService: HoSoGiayToFacadeService) {
    this.itemService = this.hoSoGiayToFacadeService.getHoSoService();
  }

  async ngOnInit() {
    // Setting wrap mode
    this.wrapSettings = {wrapMode: 'Both'};
    // Khởi tạo form
    this.formInit();
    // Gọi hàm lấy dữ liệu translate
    await this.getDataTranslate();

    if (this.allowAutoInit) {
      await this.manualDataInit();
    }
  }

  /**
   * Form innit
   */
  formInit() {
    this.formSearch = this.formBuilder.group({
      GTEqualNgaytiepnhan: [DefaultValue.Empty],
      LTEqualNgaytiepnhan: [DefaultValue.Empty],
      Loaicapphep: [DefaultValue.Empty],
      Keyword: [DefaultValue.Empty],
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
    if (this.nhomLoaiCapPhep === NhomLoaiCapPhepEnum.ThamDoKhoangSan
      || this.nhomLoaiCapPhep === NhomLoaiCapPhepEnum.KhaiThacKhoangSan
      || this.nhomLoaiCapPhep === NhomLoaiCapPhepEnum.TanThuKhoangSan
      || this.nhomLoaiCapPhep === NhomLoaiCapPhepEnum.TraLaiGiayPhep
      || this.nhomLoaiCapPhep === NhomLoaiCapPhepEnum.DongCuaMo
      || this.nhomLoaiCapPhep === NhomLoaiCapPhepEnum.ChuyenNhuongThamDoKhaiThac
      || this.nhomLoaiCapPhep === NhomLoaiCapPhepEnum.PheDuyetTruLuong
      || this.nhomLoaiCapPhep === NhomLoaiCapPhepEnum.DauGiaQuyenKhaiThac) {

      // Gọi hàm lấy dữ liệu danh sách loại cấp phép
      await this.getAllLoaiCapPhep();
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

    await this.getAllHoSo();
  }

  /**
   * Hàm lấy dữ liệu loại cấp phép
   */
  async getAllLoaiCapPhep() {
    if (this.nhomLoaiCapPhep === DefaultValue.Null || this.nhomLoaiCapPhep === DefaultValue.Undefined) {
      this.nhomLoaiCapPhep = -1;
    }

    const listData: any = await this.dmFacadeService
      .getDmLoaiCapPhepService()
      .getFetchAll({Nhomloaicapphep: this.nhomLoaiCapPhep, PageNumber: 1, PageSize: -1});
    this.loaiCapPhepFilters = listData.items;
    this.allLoaiCapPhep = listData.items;
  }

  /**
   * Hàm lấy dữ liệu hồ sơ
   */
  async getAllHoSo() {
    this.listHoSo = this.itemService;
    const searchModel = {
      GTEqualNgaytiepnhan: this.formSearch.controls.GTEqualNgaytiepnhan.value !== DefaultValue.Null && this.formSearch.controls.GTEqualNgaytiepnhan.value.trim() !== DefaultValue.Empty ? this.datePipe.transform(this.formSearch.controls.GTEqualNgaytiepnhan.value, "MM-dd-yyyy") : DefaultValue.Empty,
      LTEqualNgaytiepnhan: this.formSearch.controls.LTEqualNgaytiepnhan.value !== DefaultValue.Null && this.formSearch.controls.LTEqualNgaytiepnhan.value.trim() !== DefaultValue.Empty ? this.datePipe.transform(this.formSearch.controls.LTEqualNgaytiepnhan.value, "MM-dd-yyyy") : DefaultValue.Empty,
      Loaicapphep: this.formSearch.controls.Loaicapphep.value,
      Keyword: this.formSearch.controls.Keyword.value,
      Nhomloaicapphep: this.nhomLoaiCapPhep
    };

    this.itemService
      .getDataFromServer({skip: 0, take: this.settingsCommon.pageSettings.pageSize}, searchModel);
  }

  /*
   * When page item clicked
   */
  dataStateChange(state: DataStateChangeEventArgs): void {
    const searchModel = {
      GTEqualNgaytiepnhan: this.formSearch.controls.GTEqualNgaytiepnhan.value !== DefaultValue.Null && this.formSearch.controls.GTEqualNgaytiepnhan.value.trim() !== DefaultValue.Empty ? this.datePipe.transform(this.formSearch.controls.GTEqualNgaytiepnhan.value, "MM-dd-yyyy") : DefaultValue.Empty,
      LTEqualNgaytiepnhan: this.formSearch.controls.LTEqualNgaytiepnhan.value !== DefaultValue.Null && this.formSearch.controls.LTEqualNgaytiepnhan.value.trim() !== DefaultValue.Empty ? this.datePipe.transform(this.formSearch.controls.LTEqualNgaytiepnhan.value, "MM-dd-yyyy") : DefaultValue.Empty,
      Loaicapphep: this.formSearch.controls.Loaicapphep.value,
      Keyword: this.formSearch.controls.Keyword.value,
      Nhomloaicapphep: this.nhomLoaiCapPhep
    };

    this.itemService.getDataFromServer(state, searchModel);
  }

  /**
   * Hàm load lại dữ liệu grid
   */
  reloadDataGrid() {
    this.formSearch.reset({
      Keyword: DefaultValue.Empty,
      GTEqualNgaytiepnhan: DefaultValue.Empty,
      LTEqualNgaytiepnhan: DefaultValue.Empty,
      Loaicapphep: DefaultValue.Empty,
      Nhomloaicapphep: this.nhomLoaiCapPhep
    });
    this.getAllHoSo();
  }

  /**
   * Hàm mở sidenav chức năng thêm mới
   */
  addItemHoSo() {
    this.router.navigate([
      `${AdminRoutingName.adminUri}/${AdminRoutingName.dangkyhoatdongkhoangsanUri}/${ChiTietDangKyHoatDongKS[this.nhomLoaiCapPhep]}`]);
  }

  /**
   * Hàm mở sidenav chức năng sửa dữ liệu
   * @param id
   */
  async editItemHoSo(id: any) {
    this.router.navigate([
        `${AdminRoutingName.adminUri}/${AdminRoutingName.dangkyhoatdongkhoangsanUri}/${ChiTietDangKyHoatDongKS[this.nhomLoaiCapPhep]}`],
      {queryParams: {idhoso: id}});
  }

  /**
   *  Hàm xóa một bản ghi, được gọi khi nhấn nút xóa trên giao diện list
   */
  async deleteItemHoSo(data) {
    this.selectedItem = data;
    const canDelete: string = this.hoSoGiayToFacadeService
      .getHoSoService()
      .checkBeDeleted(this.selectedItem.idhoso);
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
      this.dataTranslate.HOSOGIAYTO.hoso.contentDelete,
      this.selectedItem.mahoso
    );
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === "confirm") {
        await this.hoSoGiayToFacadeService
          .getHoSoService()
          .deleteItem({idhoso: this.selectedItem.idhoso})
          .subscribe(
            () => this.getAllHoSo(),
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
