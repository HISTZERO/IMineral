import { Component, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver, Output, EventEmitter, Input } from '@angular/core';
import { MatSidenav, MatDialog } from "@angular/material";
import { TranslateService } from "@ngx-translate/core";
import { HttpErrorResponse } from "@angular/common/http";
import { FormGroup, FormBuilder } from "@angular/forms";
import { GridComponent } from "@syncfusion/ej2-angular-grids";

import { SettingsCommon, ThietLapHeThong } from "src/app/shared/constants/setting-common";
import { OutputDmToChucModel } from "src/app/models/admin/danhmuc/tochuc.model";
import { MenuDanhMucToChuc } from "src/app/shared/constants/sub-menus/danhmuc/danhmuc";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { DmFacadeService } from "src/app/services/admin/danhmuc/danhmuc-facade.service";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { ThietlapFacadeService } from "src/app/services/admin/thietlap/thietlap-facade.service";
import { DmTochucIoComponent } from "src/app/features/admin/danhmuc/tochuc/tochuc-io/tochuc-io.component";
import { GeneralClientService } from "src/app/services/admin/common/general-client.service";
import { TrangThaiEnum, Paging, SelectedOptionType } from "src/app/shared/constants/enum";
import { TrangThai } from "src/app/shared/constants/trangthai-constants";
import { OutputDmDvhcModel } from "src/app/models/admin/danhmuc/dvhc.model";
import { Router } from '@angular/router';
import { AdminRoutingName } from 'src/app/routes/admin-routes-name';

@Component({
  selector: 'app-tochuc-option',
  templateUrl: './tochuc-option.component.html',
  styleUrls: ['./tochuc-option.component.scss']
})
export class DmTochucOptionComponent implements OnInit {
  // Viewchild template
  @ViewChild("gridToChuc", { static: false }) public gridToChuc: GridComponent;
  // tslint:disable-next-line: no-output-rename
  @Output("selectItemToChucEvent") selectItemToChucEvent: EventEmitter<OutputDmToChucModel> = new EventEmitter();
  // tslint:disable-next-line: no-input-rename
  @Input("selectedOptionType") selectedOptionType = SelectedOptionType.Popup;
  // Chứa thuộc tính form
  public formSearch: FormGroup;
  // Chứa thiết lập grid
  public settingsCommon = new SettingsCommon();

  // Chứa danh sách item đã chọn
  public listDataSelect: any[];

  // Chứa danh sách Tổ chức
  public listToChuc: OutputDmToChucModel[];

  // Chứa dữ liệu đã chọn
  public selectedItem: OutputDmToChucModel;

  // Chứa danh sách dữ liệu
  public listData: any;

  // Chứa dữ liệu translate
  public dataTranslate: any;

  constructor(public dmFacadeService: DmFacadeService,
              public commonService: CommonServiceShared,
              public thietlapFacadeService: ThietlapFacadeService,
              private translate: TranslateService,
              public router: Router,
              public matSidenavService: MatsidenavService,
              public formBuilder: FormBuilder) { }

  async ngOnInit() {
    // Khởi tạo form
    this.formInit();
    // Gọi hàm lấy dữ liệu translate
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
      this.settingsCommon.pageSettings.pageSize = dataSetting.settingValue;
    } else {
      this.settingsCommon.pageSettings.pageSize = 10;
    }
    // Gọi hàm lấy dữ liệu Tổ chức
    await this.getAllToChuc();
  }

  /**
   * Hàm load lại dữ liệu grid
   */
  public reloadDataGrid() {
    this.formSearch.reset({ Keyword: ""});
    this.getAllToChuc();
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
   * Hàm lấy dữ liệu Tổ chức
   */
  async getAllToChuc() {
    const searchModel = this.formSearch.value;
    searchModel.PageNumber =  Paging.PageNumber;
    searchModel.PageSize = Paging.PageSize;

    const listData: any = await this.dmFacadeService
      .getDmToChucService()
      .getFetchAll(searchModel);
    if (listData.items) {
      listData.items.map((tochuc, index) => {
        tochuc.serialNumber = index + 1;
      });
    }
    this.listToChuc = listData.items;
  }

  /**
   *  chọn item cá nhân trong danh sách
   */
  public selectItemToChuc(id: string) {
    const itemToChuc = this.listToChuc.find(item => item.idtochuc === id);

    if (this.selectedOptionType === SelectedOptionType.NoPopup) {
      this.selectItemToChucEvent.emit(itemToChuc);
    } else if (this.selectedOptionType === SelectedOptionType.Popup) {
      this.matSidenavService.doParentFunction("selectItemToChuc", itemToChuc);
      this.closeToChucIOSidenav();
    }
  }

  public goToAddToChuc() {
    const url = this.router.serializeUrl(
      this.router.createUrlTree([`${AdminRoutingName.adminUri}/${AdminRoutingName.danhmucUri}/${AdminRoutingName.tochucUri}`])
    );
    window.open(url, '_blank');
  }

  /**
   * Hàm close sidenav
   */
  public closeToChucIOSidenav() {
    this.matSidenavService.close();
  }
}
