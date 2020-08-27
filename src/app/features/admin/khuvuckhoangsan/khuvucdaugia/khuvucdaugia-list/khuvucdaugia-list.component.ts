import { Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef} from "@angular/core";
import { MenuKhuVucDauGia } from "src/app/shared/constants/sub-menus/khuvuckhoangsan/khuvuckhoangsan";
import { MatSidenav } from "@angular/material/sidenav";
import { TranslateService } from "@ngx-translate/core";
import { HttpErrorResponse } from "@angular/common/http";
import { GridComponent } from "@syncfusion/ej2-angular-grids";
import { TrangThai } from "src/app/shared/constants/trangthai-constants";
import { SettingsCommon, ThietLapHeThong } from "src/app/shared/constants/setting-common";
import { OutputKhuVucDauGiaModel } from "src/app/models/admin/khuvuckhoangsan/khuvucdaugia.model";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { KhuVucKhoangSanFacadeService } from "src/app/services/admin/khuvuckhoangsan/khuvuckhoangsan-facade.service";
import { KhuvucdaugiaIoComponent } from "src/app/features/admin/khuvuckhoangsan/khuvucdaugia/khuvucdaugia-io/khuvucdaugia-io.component";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { ThietlapFacadeService } from "src/app/services/admin/thietlap/thietlap-facade.service";
import {GeneralClientService} from "src/app/services/admin/common/general-client.service";
import {TrangThaiEnum} from "src/app/shared/constants/enum";
import { FormGroup, FormBuilder } from "@angular/forms";
@Component({
  selector: 'app-khuvucdaugia-list',
  templateUrl: './khuvucdaugia-list.component.html',
  styleUrls: ['./khuvucdaugia-list.component.scss']
})
export class KhuvucdaugiaListComponent implements OnInit {
  // Viewchild template
  @ViewChild("gridKhuVucDauGia", { static: false }) public gridKhuVucDauGia: GridComponent;
  @ViewChild("aside", { static: true }) public matSidenav: MatSidenav;
  @ViewChild("compkhuvucdaugiaio", { read: ViewContainerRef, static: true }) public content: ViewContainerRef;

  // Chứa thuộc tính form
  public formSearch: FormGroup;

  // Chứa thiết lập grid
  public settingsCommon = new SettingsCommon();

  // Chứa danh sách lĩnh vực
  public listKhuVucDauGia: OutputKhuVucDauGiaModel[];

  // Chứa dữ liệu đã chọn
  public selectedItem: OutputKhuVucDauGiaModel;

  // Chứa menu item trên subheader
  public navArray = MenuKhuVucDauGia;

  // Chứa dữ liệu translate
  public dataTranslate: any;

  constructor(public matSidenavService: MatsidenavService,
              public cfr: ComponentFactoryResolver,
              public khuVucKhoangSanFacadeService: KhuVucKhoangSanFacadeService,
              public commonService: CommonServiceShared,
              public thietlapFacadeService: ThietlapFacadeService,
              private translate: TranslateService,
              public formBuilder: FormBuilder,
              public generalClientService: GeneralClientService
            ) { }

  async ngOnInit() {
    // Khởi tạo form
    this.formInit();
    // Gọi hàm lấy dữ liệu translate
    await this.getDataTranslate();
    // Khởi tạo sidenav
    this.matSidenavService.setSidenav( this.matSidenav, this, this.content, this.cfr );
    // Gọi hàm lấy dữ liệu pagesize
    await this.getDataPageSize();
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
    const pageSize: any = await this.thietlapFacadeService
    .getThietLapHeThongService()
    .getSettingKey({ key: ThietLapHeThong.defaultPageSize });
    if (pageSize) {
      this.settingsCommon.pageSettings.pageSize = +pageSize;
    } else {
      this.settingsCommon.pageSettings.pageSize = 10;
    }
  }
}
