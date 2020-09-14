import { Component, OnInit, ViewChild, EventEmitter, Output, Input } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { GridComponent, TextWrapSettingsModel } from "@syncfusion/ej2-angular-grids";
import { FormGroup, FormBuilder } from "@angular/forms";
import { SettingsCommon, ThietLapHeThong } from "src/app/shared/constants/setting-common";
import { OutputDmCanhanModel } from "src/app/models/admin/danhmuc/canhan.model";
import { DmFacadeService } from "src/app/services/admin/danhmuc/danhmuc-facade.service";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { ThietlapFacadeService } from "src/app/services/admin/thietlap/thietlap-facade.service";
import { Paging, SelectedOptionType } from 'src/app/shared/constants/enum';
import { MatsidenavService } from 'src/app/services/utilities/matsidenav.service';
import { Router } from '@angular/router';
import { AdminRoutingName } from 'src/app/routes/admin-routes-name';

@Component({
  selector: 'app-canhan-option',
  templateUrl: './canhan-option.component.html',
  styleUrls: ['./canhan-option.component.scss']
})
export class DmCanhanOptionComponent implements OnInit {
  // Viewchild template
  @ViewChild("gridCaNhan", { static: false }) public gridCaNhan: GridComponent;
  // tslint:disable-next-line: no-output-rename
  @Output("selectItemCaNhanEvent") selectItemCaNhanEvent: EventEmitter<OutputDmCanhanModel> = new EventEmitter();
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

  // Chứa danh sách item đã chọn
  public listDataSelect: any[];

  // Chứa danh sách Cá nhân
  public listCanhan: OutputDmCanhanModel[];

  // Chứa dữ liệu đã chọn
  public selectedItem: OutputDmCanhanModel;

  // Chứa danh sách dữ liệu
  public listData: any;

  // Chứa dữ liệu translate
  public dataTranslate: any;

  // Chứa kiểu wrap text trên grid
  public wrapSettings: TextWrapSettingsModel;

  constructor(public dmFacadeService: DmFacadeService,
              public commonService: CommonServiceShared,
              public thietlapFacadeService: ThietlapFacadeService,
              private translate: TranslateService,
              public matSidenavService: MatsidenavService,
              public router: Router,
              public formBuilder: FormBuilder) { }

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
    await this.getAllCanhan();
  }

  /**
   * Hàm load lại dữ liệu grid
   */
  public reloadDataGrid() {
    this.formSearch.reset({
      Keyword: "",
    });
    this.getAllCanhan();
  }

  /**
   * Hàm lấy dữ liệu Cá nhân
   */
  async getAllCanhan(param: any = { PageNumber: 1, PageSize: -1 }) {
    const listData: any = await this.dmFacadeService
      .getDmCanhanService()
      .getFetchAll(param);
    if (listData.items) {
      listData.items.map((canhan, index) => {
        canhan.serialNumber = index + 1;
      });
    }

    this.listCanhan = listData.items;
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
   * Tìm kiếm nâng cao
   */
  public searchAdvance() {
    const dataSearch = this.formSearch.value;
    dataSearch.PageNumber = Paging.PageNumber;
    dataSearch.PageSize = Paging.PageSize;
    this.getAllCanhan(dataSearch);
  }

  /**
   *  chọn item cá nhân trong danh sách
   */
  public selectItemCaNhan(id: string) {
    const itemCaNhan = this.listCanhan.find(item => item.idcanhan === id);

    if (this.selectedOptionType === SelectedOptionType.NoPopup) {
      this.selectItemCaNhanEvent.emit(itemCaNhan);
    } else if (this.selectedOptionType === SelectedOptionType.Popup) {
      this.matSidenavService.doParentFunction("selectItemCaNhan", itemCaNhan);
      this.closeCanhanIOSidenav();
    }
  }

  /**
   * Hàm close sidenav
   */
  public closeCanhanIOSidenav() {
    this.matSidenavService.close();
  }

  public goToAddCaNhan() {
    const url = this.router.serializeUrl(
      this.router.createUrlTree([`${AdminRoutingName.adminUri}/${AdminRoutingName.danhmucUri}/${AdminRoutingName.canhanUri}`])
    );
    window.open(url, '_blank');
  }
}
