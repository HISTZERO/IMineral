import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";
import { GridComponent, TextWrapSettingsModel } from "@syncfusion/ej2-angular-grids";
import { OutputDmLoaiTaiLieuModel } from "../../../../../models/admin/danhmuc/loaitailieu.model";
import { DmFacadeService } from "../../../../../services/admin/danhmuc/danhmuc-facade.service";
import { ThietlapFacadeService } from "../../../../../services/admin/thietlap/thietlap-facade.service";
import { SettingsCommon, ThietLapHeThong } from "../../../../../shared/constants/setting-common";

@Component({
  selector: 'app-cauhinhtailieu-io',
  templateUrl: './cauhinhtailieu-io.component.html',
  styleUrls: ['./cauhinhtailieu-io.component.scss']
})
export class CauhinhtailieuIoComponent implements OnInit {

  // Viewchild template
  @ViewChild('gridLoaiTaiLieu', { static: false }) public gridLoaiTaiLieu: GridComponent;
  @ViewChild('gridCauHinhTaiLieu', { static: false }) public gridCauHinhTaiLieu: GridComponent;

  // Chứa thiết lập grid
  public settingsCommon = new SettingsCommon();

  // Chứa kiểu wrap text trên grid
  public wrapSettings: TextWrapSettingsModel;

  // Chứa danh sách Loại tài liệu
  public listLoaitaiLieu: OutputDmLoaiTaiLieuModel[];

  // Chứa danh sách cấu hình tài liệu
  public listCauHinhTaiLieu: any = [];

  // Chứa danh sách loại tài liệu đã chọn
  public listLoaiTaiLieuSelected: any;

  // Chứa danh sách cấu hình tài liệu đã chọn
  public listCauHinhTaiLieuSelected: any;

  // Chứa dữ liệu đã chọn 
  public selectedItem: OutputDmLoaiTaiLieuModel;

  // Chứa dữ liệu translate
  public dataTranslate: any;

  // Chứa thuộc tính disable button
  public disableBtnRight: boolean = true;
  public disableBtnLeft: boolean = true;


  constructor(
    public dmFacadeService: DmFacadeService,
    public thietlapFacadeService: ThietlapFacadeService,
    private translate: TranslateService,
  ) { }

  async ngOnInit() {
    // Setting wrap mode
    this.wrapSettings = { wrapMode: 'Both' };
    await this.getDataTranslate();
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
      .getByid(ThietLapHeThong.defaultPageSize).toPromise();
    if (dataSetting) {
      this.settingsCommon.pageSettings.pageSize = +dataSetting.settingValue;
    } else {
      this.settingsCommon.pageSettings.pageSize = 10;
    }
    // Gọi hàm lấy dữ liệu loại tài liệu
    await this.getAllLoaiTaiLieu();
  }

  /**
    * Hàm lấy dữ liệu loại tài liệu
    */
  async getAllLoaiTaiLieu(param: any = { PageNumber: 1, PageSize: -1 }) {
    if (this.listLoaitaiLieu != null && this.listLoaitaiLieu.length > 0) {
      this.gridLoaiTaiLieu.clearSelection();
    }
    const listData: any = await this.dmFacadeService
      .getDmLoaiTaiLieuService()
      .getFetchAll(param);
    if (listData.items) {
      listData.items.map((loaiTL, index) => {
        loaiTL.serialNumber = index + 1;
      });
    }
    this.listLoaitaiLieu = listData.items;
  }

  /**
   * Hàm lấy dữ liệu khi click vào row trên grid Loại tài liệu
   */
  public rowSelectedLoaiTaiLieu() {
    this.listLoaiTaiLieuSelected = this.gridLoaiTaiLieu.getSelectedRecords();
  }

  /**
   * Hàm lấy dữ liệu khi click vào row trên grid cấu hình tài liệu
   */
  public rowSelectedCauHinhTaiLieu() {
    this.listCauHinhTaiLieuSelected = this.gridCauHinhTaiLieu.getSelectedRecords();
  }

  /**
   * Nút chuyển toàn bộ dữ liệu grid loại tài liệu đã chọn sang grid cấu hình tài liệu
   */
  public btnDoubleRight() {
    this.listCauHinhTaiLieu = Array.prototype.concat.call(this.listLoaiTaiLieuSelected, this.gridCauHinhTaiLieu.dataSource);
    for (let i = this.listLoaitaiLieu.length; i--;) {
      if (this.listLoaiTaiLieuSelected.indexOf(this.listLoaitaiLieu[i]) !== -1) {
        this.listLoaitaiLieu.splice(i, 1);
      }
    }
    this.gridLoaiTaiLieu.refresh();
  }

  /**
   * Nút chuyển toàn bộ dữ liệu grid loại tài liệu đã chọn sang grid cấu hình tài liệu
   */
  public btnDoubleLeft() {
    this.listLoaitaiLieu = Array.prototype.concat.call(this.listCauHinhTaiLieuSelected, this.gridLoaiTaiLieu.dataSource);
    for (let i = this.listCauHinhTaiLieu.length; i--;) {
      if (this.listCauHinhTaiLieuSelected.indexOf(this.listCauHinhTaiLieu[i]) !== -1) {
        this.listCauHinhTaiLieu.splice(i, 1);
      }
    }
    this.gridCauHinhTaiLieu.refresh();
  }
}
