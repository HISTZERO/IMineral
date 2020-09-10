import { Component, OnInit, Input, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import {DatePipe} from '@angular/common';
import { DataStateChangeEventArgs } from "@syncfusion/ej2-angular-grids";
import { Observable } from "rxjs";
import { MatSidenav, MatDialog } from "@angular/material";
import { HttpErrorResponse } from "@angular/common/http";
import { TranslateService } from "@ngx-translate/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { GridComponent } from "@syncfusion/ej2-angular-grids";
import { SettingsCommon, ThietLapHeThong } from "src/app/shared/constants/setting-common";
import { OutputHoSoModel } from "src/app/models/admin/dangkyhoatdongkhoangsan/hoso.model";
import { DmFacadeService } from "src/app/services/admin/danhmuc/danhmuc-facade.service";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { ThietlapFacadeService } from "src/app/services/admin/thietlap/thietlap-facade.service";
import { GeneralClientService } from "src/app/services/admin/common/general-client.service";
import {NhomLoaiCapPhep} from 'src/app/shared/constants/enum';

import { DangKyHoatDongKhoangSanFacadeService } from 'src/app/services/admin/dangkyhoatdongkhoangsan/dangkyhoatdongkhoangsan-facade.service';
import { Router } from "@angular/router";
import { AdminRoutingName } from 'src/app/routes/admin-routes-name';
import { OutputDmLoaiCapPhepModel } from 'src/app/models/admin/danhmuc/loaicapphep.model';

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

  // Viewchild template
  @ViewChild("gridHoSo", { static: false }) public gridHoSo: GridComponent;

  // Chứa thiết lập grid
  public settingsCommon = new SettingsCommon();

  // Chứa thuộc tính form
  public formSearch: FormGroup;

  // Chứa danh sách hồ sơ
  public listHoSo: Observable<DataStateChangeEventArgs>;

  // Chứa dữ liệu đã chọn
  public selectedItem: OutputHoSoModel;

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


  constructor(public dangKyHoatDongKhoangSanFacadeService: DangKyHoatDongKhoangSanFacadeService,
              public commonService: CommonServiceShared,
              public thietlapFacadeService: ThietlapFacadeService,
              private translate: TranslateService,
              public router: Router,
              public formBuilder: FormBuilder,
              public generalClientService: GeneralClientService,
              public dmFacadeService: DmFacadeService,
              public datePipe: DatePipe,
              public modalDialog: MatDialog) {
    this.itemService = this.dangKyHoatDongKhoangSanFacadeService.getHoSoService();
  }

  async ngOnInit() {
    if (this.nhomLoaiCapPhep === NhomLoaiCapPhep.ThamDoKhoangSan) {
      // Khởi tạo form
      this.formInit();
      // Gọi hàm lấy dữ liệu translate
      await this.getDataTranslate();
      // Gọi hàm lấy dữ liệu danh sách loại cấp phép
      await this.getAllLoaiCapPhep();
      // Gọi hàm lấy dữ liệu pagesize
      await this.getDataPageSize();
    }
  }

  /**
   * Form innit
   */
  public formInit() {
    this.formSearch = this.formBuilder.group({
      GTEqualNgaytiepnhan: [""],
      LTEqualNgaytiepnhan: [""],
      Loaicapphep:  [""],
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

    await this.getAllHoSo();
  }

  /**
   * Hàm lấy dữ liệu loại cấp phép
   */
  async getAllLoaiCapPhep() {
    if (this.nhomLoaiCapPhep === null || this.nhomLoaiCapPhep === undefined) {
      this.nhomLoaiCapPhep = -1;
    }

    const listData: any = await this.dmFacadeService
      .getDmLoaiCapPhepService()
      .getFetchAll({Nhomloaicapphep: this.nhomLoaiCapPhep, PageNumber: 1, PageSize: -1 });
    this.loaiCapPhepFilters = listData.items;
    this.allLoaiCapPhep =  listData.items;
  }

  /**
   * Hàm lấy dữ liệu hồ sơ
   */
  async getAllHoSo() {
    this.listHoSo = this.itemService;
    const searchModel = {
      GTEqualNgaytiepnhan: this.formSearch.controls.GTEqualNgaytiepnhan.value !== null && this.formSearch.controls.GTEqualNgaytiepnhan.value !== "" ? this.datePipe.transform(this.formSearch.controls.GTEqualNgaytiepnhan.value , "MM-dd-yyyy") : "",
      LTEqualNgaytiepnhan: this.formSearch.controls.LTEqualNgaytiepnhan.value !== null && this.formSearch.controls.LTEqualNgaytiepnhan.value !== "" ? this.datePipe.transform(this.formSearch.controls.LTEqualNgaytiepnhan.value , "MM-dd-yyyy") : "",
      Loaicapphep: this.formSearch.controls.Loaicapphep.value,
      Keyword: this.formSearch.controls.Keyword.value,
    };

    this.itemService
      .getDataFromServer({ skip: 0, take: this.settingsCommon.pageSettings.pageSize }, searchModel);
  }

  /*
   * When page item clicked
   */
  public dataStateChange(state: DataStateChangeEventArgs): void {
    const searchModel = {
      GTEqualNgaytiepnhan: this.formSearch.controls.GTEqualNgaytiepnhan.value !== null && this.formSearch.controls.GTEqualNgaytiepnhan.value !== "" ? this.datePipe.transform(this.formSearch.controls.GTEqualNgaytiepnhan.value , "MM-dd-yyyy") : "",
      LTEqualNgaytiepnhan: this.formSearch.controls.LTEqualNgaytiepnhan.value !== null && this.formSearch.controls.LTEqualNgaytiepnhan.value !== "" ? this.datePipe.transform(this.formSearch.controls.LTEqualNgaytiepnhan.value , "MM-dd-yyyy") : "",
      Loaicapphep: this.formSearch.controls.Loaicapphep.value,
      Keyword: this.formSearch.controls.Keyword.value,
    };

    this.itemService.getDataFromServer(state, searchModel);
  }

  /**
   * Hàm load lại dữ liệu grid
   */
  public reloadDataGrid() {
    this.formSearch.reset({ Keyword: "" });
    this.getAllHoSo();
  }

  /**
   * Hàm mở sidenav chức năng thêm mới
   */
  public addItemHoSo() {
    this.router.navigate([
      `${AdminRoutingName.adminUri}/${AdminRoutingName.dangkyhoatdongkhoangsanUri}/${AdminRoutingName.thamdokhoangsanchitietUri}`]);
  }

  /**
   * Hàm mở sidenav chức năng sửa dữ liệu
   * @param id
   */
  async editItemHoSo(id: any) {
    this.router.navigate([
      `${AdminRoutingName.adminUri}/${AdminRoutingName.dangkyhoatdongkhoangsanUri}/${AdminRoutingName.thamdokhoangsanchitietUri}`],
        { queryParams: { idhoso: id}});
  }

  /**
   *  Hàm xóa một bản ghi, được gọi khi nhấn nút xóa trên giao diện list
   */
  async deleteItemHoSo(data) {
    this.selectedItem = data;
    const canDelete: string = this.dangKyHoatDongKhoangSanFacadeService
      .getHoSoService()
      .checkBeDeleted(this.selectedItem.idhoso);
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
      this.dataTranslate.DANGKYHOATDONGKHOANGSAN.hoso.contentDelete,
      this.selectedItem.mahoso
    );
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === "confirm") {
        await this.dangKyHoatDongKhoangSanFacadeService
          .getHoSoService()
          .deleteItem({ idhoso: this.selectedItem.idhoso })
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