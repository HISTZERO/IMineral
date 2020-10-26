import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { DatePipe } from '@angular/common';
import { DataStateChangeEventArgs, TextWrapSettingsModel } from "@syncfusion/ej2-angular-grids";
import { Observable } from "rxjs";
import { MatDialog } from "@angular/material";
import { TranslateService } from "@ngx-translate/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { GridComponent } from "@syncfusion/ej2-angular-grids";
import { Router } from "@angular/router";

import { NhomLoaiCapPhepEnum } from "src/app/shared/constants/nhomloaicapphep-constants";
import { SettingsCommon, ThietLapHeThong } from "src/app/shared/constants/setting-common";
import { OutputHsHoSoModel } from "src/app/models/admin/hosogiayto/hoso.model";
import { DmFacadeService } from "src/app/services/admin/danhmuc/danhmuc-facade.service";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { ThietlapFacadeService } from "src/app/services/admin/thietlap/thietlap-facade.service";
import { GeneralClientService } from "src/app/services/admin/common/general-client.service";
import { DangKyHoatDongKhoangSanFacadeService } from 'src/app/services/admin/dangkyhoatdongkhoangsan/dangkyhoatdongkhoangsan-facade.service';
import { LoaiCapPhepEnum, SelectedOptionType } from 'src/app/shared/constants/enum';
import { MatsidenavService } from 'src/app/services/utilities/matsidenav.service';
import { DefaultValue } from 'src/app/shared/constants/global-var';
import { HoSoGiayToFacadeService } from "src/app/services/admin/hosogiayto/hosogiayto-facade.service";


@Component({
  selector: 'app-hoso-option',
  templateUrl: './hoso-option.component.html',
  styleUrls: ['./hoso-option.component.scss']
})
export class HosoOptionComponent implements OnInit {
  // tslint:disable-next-line: no-input-rename
  @Input("nhomLoaiCapPhep") nhomLoaiCapPhep: number;
  // tslint:disable-next-line: no-input-rename
  @Input("loaiCapPhep") loaiCapPhep: string;
  // tslint:disable-next-line: no-output-rename
  @Output("selectItemHoSoEvent") selectItemHoSoEvent: EventEmitter<OutputHsHoSoModel> = new EventEmitter();
  // tslint:disable-next-line: no-input-rename
  @Input("selectedOptionType") selectedOptionType = SelectedOptionType.Popup;
  // tslint:disable-next-line: no-input-rename
  @Input("title") title: string;
  // Viewchild template
  @ViewChild("gridHoSo", { static: false }) public gridHoSo: GridComponent;
  // Chứa dữ liệu đối tượng truyền từ list comp
  public obj: any;

  // Chứa thiết lập grid
  public settingsCommon = new SettingsCommon();

  // Chứa thuộc tính form
  public formSearch: FormGroup;

  // Chứa danh sách hồ sơ
  public listHoSo: Observable<DataStateChangeEventArgs>;

  // Service
  public itemService: any;

  // Paging
  public state: DataStateChangeEventArgs;

  // Chứa dữ liệu translate
  public dataTranslate: any;

  // Chứa kiểu wrap text trên grid
  public wrapSettings: TextWrapSettingsModel;

  constructor(
    public dangKyHoatDongKhoangSanFacadeService: DangKyHoatDongKhoangSanFacadeService,
    public commonService: CommonServiceShared,
    public thietlapFacadeService: ThietlapFacadeService,
    private translate: TranslateService,
    public router: Router,
    public formBuilder: FormBuilder,
    public generalClientService: GeneralClientService,
    public dmFacadeService: DmFacadeService,
    public datePipe: DatePipe,
    public matSidenavService: MatsidenavService,
    public modalDialog: MatDialog,
    private hoSoGiayToFacadeService: HoSoGiayToFacadeService) {
    this.itemService = this.hoSoGiayToFacadeService.getHoSoService();
  }

  async ngOnInit() {
    // Setting wrap mode
    this.wrapSettings = { wrapMode: 'Both' };
    // Khởi tạo form
    this.formInit();
    // Gọi hàm lấy dữ liệu translate
    await this.getDataTranslate();

    if (this.selectedOptionType === SelectedOptionType.Popup) {
      if (this.obj) {
        if (this.obj.nhomloaicapphep !== DefaultValue.Undefined && this.obj.nhomloaicapphep !== DefaultValue.Null) {
          this.nhomLoaiCapPhep = this.obj.nhomloaicapphep;
        }

        if (this.obj.loaicapphep !== DefaultValue.Undefined && this.obj.loaicapphep !== DefaultValue.Null && this.obj.loaicapphep.trim() !== DefaultValue.Empty) {
          this.loaiCapPhep = this.obj.loaicapphep;
        }
      }
    }

    if (this.nhomLoaiCapPhep === NhomLoaiCapPhepEnum.ThamDoKhoangSan
      || this.nhomLoaiCapPhep === NhomLoaiCapPhepEnum.KhaiThacKhoangSan
      || this.nhomLoaiCapPhep === NhomLoaiCapPhepEnum.TanThuKhoangSan
      || this.nhomLoaiCapPhep === NhomLoaiCapPhepEnum.TraLaiGiayPhep
      || this.nhomLoaiCapPhep === NhomLoaiCapPhepEnum.DongCuaMo
      || this.nhomLoaiCapPhep === NhomLoaiCapPhepEnum.ChuyenNhuongThamDoKhaiThac
      || this.nhomLoaiCapPhep === NhomLoaiCapPhepEnum.PheDuyetTruLuong
      || this.nhomLoaiCapPhep === NhomLoaiCapPhepEnum.DauGiaQuyenKhaiThac) {
      // Gọi hàm lấy dữ liệu pagesize
      await this.getDataPageSize();
    }
  }

  /**
   * Form innit
   */
  formInit() {
    this.formSearch = this.formBuilder.group({
      Keyword: [DefaultValue.Empty]
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
      this.settingsCommon.pageSettings.pageSize = +dataSetting.settingValue;
    } else {
      this.settingsCommon.pageSettings.pageSize = 10;
    }

    await this.getAllHoSo();
  }

  /**
   * Hàm lấy dữ liệu hồ sơ
   */
  async getAllHoSo() {
    this.listHoSo = this.itemService;
    const searchModel = {
      Loaicapphep: this.loaiCapPhep,
      Keyword: this.formSearch.controls.Keyword.value,
      Nhomloaicapphep: this.nhomLoaiCapPhep
    };

    this.itemService
      .getDataFromServer({ skip: 0, take: this.settingsCommon.pageSettings.pageSize }, searchModel);
  }

  /*
   * When page item clicked
   */
  dataStateChange(state: DataStateChangeEventArgs): void {
    const searchModel = {
      Loaicapphep: this.loaiCapPhep,
      Keyword: this.formSearch.controls.Keyword.value,
      Nhomloaicapphep: this.nhomLoaiCapPhep
    };

    this.itemService.getDataFromServer(state, searchModel);
  }

  /**
   *  chọn item cá nhân trong danh sách
   */
  public async selectItemHoSo(data) {

    if (this.selectedOptionType === SelectedOptionType.NoPopup) {
      this.selectItemHoSoEvent.emit(data);
    } else if (this.selectedOptionType === SelectedOptionType.Popup) {
      if (this.nhomLoaiCapPhep === NhomLoaiCapPhepEnum.ChuyenNhuongThamDoKhaiThac) {
        var mahoso = data.mahoso;
        var idhoso = data.idhoso;
        if (this.loaiCapPhep === LoaiCapPhepEnum.ChuyenNhuongQuyenThamDoKhoangSan) {
          data = await this.dangKyHoatDongKhoangSanFacadeService.getDangKyThamDoChuyenNhuongService().getDangKyChuyenNhuongByIdHoSo(data.idhoso).toPromise();
        } else if (this.loaiCapPhep === LoaiCapPhepEnum.ChuyenNhuongQuyenKhaiThacKhoangSan) {
          data = await this.dangKyHoatDongKhoangSanFacadeService.getDangKyKhaiThacChuyenNhuongService().getDangKyChuyenNhuongByIdHoSo(data.idhoso).toPromise();
        }
        data.mahoso = mahoso;
        data.idhoso = idhoso;
      }
      this.matSidenavService.doParentFunction("selectItemHoSo", data);

      this.closeHoSoIOSidenav();
    }
  }


  /**
   * Hàm load lại dữ liệu grid
   */
  reloadDataGrid() {
    this.formSearch.reset({
      Keyword: DefaultValue.Empty,
      Loaicapphep: this.loaiCapPhep,
      Nhomloaicapphep: this.nhomLoaiCapPhep
    });
    this.getAllHoSo();
  }

  /**
   * Hàm close sidenav
   */
  public closeHoSoIOSidenav() {
    this.matSidenavService.close();
  }
}
