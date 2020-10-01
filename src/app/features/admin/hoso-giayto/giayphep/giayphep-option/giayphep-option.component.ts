import {Component, OnInit, Input, ViewChild, Output, EventEmitter} from '@angular/core';
import {DataStateChangeEventArgs, TextWrapSettingsModel} from "@syncfusion/ej2-angular-grids";
import {Observable} from "rxjs";
import {TranslateService} from "@ngx-translate/core";
import {FormGroup, FormBuilder} from "@angular/forms";
import {GridComponent} from "@syncfusion/ej2-angular-grids";
import {Router} from "@angular/router";
import {SettingsCommon, ThietLapHeThong} from "src/app/shared/constants/setting-common";
import {OutputGiayPhepModel} from "src/app/models/admin/capphephoatdongkhoangsan/giayphep.model";
import {CommonServiceShared} from "src/app/services/utilities/common-service";
import {ThietlapFacadeService} from "src/app/services/admin/thietlap/thietlap-facade.service";
import {CapPhepHoatDongKhoangSanFacadeService} from 'src/app/services/admin/capphephoatdongkhoangsan/capphephoatdongkhoangsan-facade.service';
import { SelectedOptionType } from 'src/app/shared/constants/enum';
import { MatsidenavService } from 'src/app/services/utilities/matsidenav.service';
import { DefaultValue } from 'src/app/shared/constants/global-var';

@Component({
  selector: 'app-giayphep-option',
  templateUrl: './giayphep-option.component.html',
  styleUrls: ['./giayphep-option.component.scss']
})
export class GiayphepOptionComponent implements OnInit {
  // Viewchild template
  @ViewChild("gridGiayPhep", { static: false }) public gridGiayPhep: GridComponent;
  // tslint:disable-next-line: no-output-rename
  @Output("selectItemGiayPhepEvent") selectItemGiayPhepEvent: EventEmitter<OutputGiayPhepModel> = new EventEmitter();
  // tslint:disable-next-line: no-input-rename
  @Input("selectedOptionType") selectedOptionType = SelectedOptionType.Popup;
  // Chứa dữ liệu đối tượng truyền từ list comp
  public obj: any;

  // Chứa kiểu form
  public purpose: string;

  // Chứa thuộc tính form
  public formSearch: FormGroup;

  // Chứa thiết lập grid
  public settingsCommon = new SettingsCommon();

  // Chứa danh sách giấy phép
  public listGiayPhep: Observable<DataStateChangeEventArgs>;

  // Chứa dữ liệu translate
  public dataTranslate: any;

  // Chứa kiểu wrap text trên grid
  public wrapSettings: TextWrapSettingsModel;

  // Service
  public itemService: any;

  constructor(
    public capPhepHoatDongKhoangSanFacadeService: CapPhepHoatDongKhoangSanFacadeService,
    public commonService: CommonServiceShared,
    public thietlapFacadeService: ThietlapFacadeService,
    private translate: TranslateService,
    public matSidenavService: MatsidenavService,
    public router: Router,
    public formBuilder: FormBuilder) {
      this.itemService = this.capPhepHoatDongKhoangSanFacadeService.getGiayPhepService();
    }

  async ngOnInit() {
    // Khởi tạo form
    this.formInit();
    // Lấy danh sách Tỉnh
    await this.getDataTranslate();
    // Setting wrap mode
    this.wrapSettings = { wrapMode: 'Both' };
    // Gọi hàm lấy dữ liệu pagesize
    await this.getDataPageSize();
  }

  /**
   * Form innit
   */
  formInit() {
    this.formSearch = this.formBuilder.group({
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

  /**
   * Hàm lấy dữ liệu pagesize số bản ghi hiển thị trên 1 trang
   */
  async getDataPageSize() {
    const dataSetting: any = await this.thietlapFacadeService
      .getThietLapHeThongService()
      .getByid(ThietLapHeThong.defaultPageSize).toPromise();
    if (dataSetting) {
      this.settingsCommon.pageSettings.pageSize = dataSetting.settingValue;
    } else {
      this.settingsCommon.pageSettings.pageSize = 10;
    }
    // Gọi hàm lấy dữ liệu cá nhân
    await this.getAllGiayPhep();
  }

  /**
   * Hàm lấy dữ liệu hồ sơ
   */
  async getAllGiayPhep() {
    this.listGiayPhep = this.itemService;
    const searchModel = {
      Keyword: this.formSearch.controls.Keyword.value
    };

    this.itemService
      .getDataFromServer({skip: 0, take: this.settingsCommon.pageSettings.pageSize}, searchModel);
  }

  /*
   * When page item clicked
   */
  dataStateChange(state: DataStateChangeEventArgs): void {
    const searchModel = {
      Keyword: this.formSearch.controls.Keyword.value
    };

    this.itemService.getDataFromServer(state, searchModel);
  }

  /**
   * Hàm load lại dữ liệu grid
   */
  public reloadDataGrid() {
    this.formSearch.reset({
      Keyword: DefaultValue.Empty,
    });
    this.getAllGiayPhep();
  }

  /**
   *  chọn item cá nhân trong danh sách
   */
  public selectItemGiayPhep(data) {

    if (this.selectedOptionType === SelectedOptionType.NoPopup) {
      this.selectItemGiayPhepEvent.emit(data);
    } else if (this.selectedOptionType === SelectedOptionType.Popup) {
      this.matSidenavService.doParentFunction("selectItemGiayPhep", data);
      this.closeGiayPhepIOSidenav();
    }
  }

  /**
   * Hàm close sidenav
   */
  public closeGiayPhepIOSidenav() {
    this.matSidenavService.close();
  }
}
