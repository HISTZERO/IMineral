import {HttpErrorResponse} from "@angular/common/http";
import {
  Component,
  ComponentFactoryResolver,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Type,
  ViewChild,
  ViewContainerRef
} from "@angular/core";
import {MatSidenav} from "@angular/material";
import {TranslateService} from "@ngx-translate/core";
import {DetailRowService, GridComponent, GridModel, TextWrapSettingsModel} from "@syncfusion/ej2-angular-grids";
import {ActivatedRoute} from "@angular/router";

import {ThietlapFacadeService} from "src/app/services/admin/thietlap/thietlap-facade.service";
import {CommonServiceShared} from "src/app/services/utilities/common-service";
import {MatsidenavService} from "src/app/services/utilities/matsidenav.service";
import {SettingsCommon, ThietLapHeThong} from "src/app/shared/constants/setting-common";
import {CapPhepHoatDongKhoangSanFacadeService} from 'src/app/services/admin/capphephoatdongkhoangsan/capphephoatdongkhoangsan-facade.service';
import {DefaultValue} from "src/app/shared/constants/global-var";
import {OutputCpDauGiaKhuVucModel} from "src/app/models/admin/capphephoatdongkhoangsan/cpdaugiakhaithac/cpdaugiakhuvuc.model";
import {CpDaugiakhaithacKhuvucIoComponent} from "src/app/features/admin/capphephoatdongkhoangsan/cpdaugiaquyenkhaithackhoangsan/cp-daugia-thongtincapphep/cp-daugiakhaithac-khuvuc/cp-daugiakhaithac-khuvuc-io/cp-daugiakhaithac-khuvuc-io.component";

@Component({
  selector: 'app-cp-daugiakhaithac-khuvuc-list',
  templateUrl: './cp-daugiakhaithac-khuvuc-list.component.html',
  styleUrls: ['./cp-daugiakhaithac-khuvuc-list.component.scss'],
  providers: [DetailRowService],
})
export class CpDaugiakhaithacKhuvucListComponent implements OnInit {


  // Viewchild template
  @ViewChild("gridCpDauGiaKhuVuc", {static: false}) public gridCpDauGiaKhuVuc: GridComponent;
  @ViewChild(Type, {static: true}) public matSidenav: MatSidenav;
  @ViewChild(Type, {read: ViewContainerRef, static: true}) public content: ViewContainerRef;
  // tslint:disable-next-line: no-output-rename
  @Output("getNumberOfDataAfterInsertUpdateDeleteEvent") getNumberOfDataAfterInsertUpdateDeleteEvent: EventEmitter<any> = new EventEmitter();
  // tslint:disable-next-line: no-input-rename
  @Input("allowAutoInit") allowAutoInit = true;
  // tslint:disable-next-line: no-input-rename
  @Input("heQuyChieu") heQuyChieu = DefaultValue.Empty;
  // Chứa loại cấp phép
  public loaicapphep: number;

  // Chứa thiết lập grid
  public settingsCommon = new SettingsCommon();

  // Chứa danh sách item đã chọn
  public listDataSelect: any[];

  // Chứa danh sách khu vực thăm dò
  public listCpDauGiaKhuVuc: OutputCpDauGiaKhuVucModel[];

  // Chứa dữ liệu đã chọn
  public selectedItem: OutputCpDauGiaKhuVucModel;

  // Chứa danh sách dữ liệu
  public listData: any;

  // Chứa dữ liệu translate
  public dataTranslate: any;

  // Chứa kiểu wrap text trên grid
  public wrapSettings: TextWrapSettingsModel;

  // Chứa dữ liệu idcapphepdaugia
  public idcapphepdaugia: string;

  public idHoSo: string;

  public data = [];

  public childGrid: GridModel = {};

  // Contructor
  constructor(
    public matSidenavService: MatsidenavService,
    public cfr: ComponentFactoryResolver,
    public capPhepHoatDongKhoangSanFacadeService: CapPhepHoatDongKhoangSanFacadeService,
    public commonService: CommonServiceShared,
    public thietlapFacadeService: ThietlapFacadeService,
    private translate: TranslateService,
    private activatedRoute: ActivatedRoute
  ) {
  }

  async ngOnInit() {
    this.getDataTranslate();
    if (this.allowAutoInit) {
      await this.manualDataInit();
    }
  }

  async manualDataInit() {
    // Gọi hàm lấy dữ liệu pagesize
    await this.getDataPageSize();
    return true;
  }

  /**
   * Hàm lấy dữ liệu translate
   */
  async getDataTranslate() {
    // Get all langs
    this.dataTranslate = await this.translate
      .getTranslation(this.translate.getDefaultLang())
      .toPromise();

    this.childGrid = await {
      queryString: 'serialNumber',
      columns: [
        {field: 'thutu', headerText: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.capphepthamdokhuvuc.thutu, width: 120},
        {
          field: 'sohieu',
          headerText: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.capphepthamdokhuvuc.sohieu,
          width: 150
        },
        {
          field: 'toadox',
          headerText: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.capphepthamdokhuvuc.toadox,
          width: 150
        },
        {
          field: 'toadoy',
          headerText: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.capphepthamdokhuvuc.toadoy,
          width: 150
        }
      ],
      allowResizing: true,
    };
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
    // Gọi hàm lấy dữ liệu khu vực
    await this.getAllCpDauGiaKhuVuc();
  }

  /**
   * Hàm load lại dữ liệu grid
   */
  public reloadDataGrid() {
    this.getAllCpDauGiaKhuVuc();
  }

  /**
   * Hàm lấy dữ liệu Dvdc
   */
  async getAllCpDauGiaKhuVuc() {
    if (this.idcapphepdaugia === DefaultValue.Null || this.idcapphepdaugia === DefaultValue.Undefined
      || this.idcapphepdaugia.trim() === DefaultValue.Empty) {
      return;
    }

    const listData: any = await this.capPhepHoatDongKhoangSanFacadeService
      .getCapPhepDauGiaKhuVucService()
      .getCpDauGiaKhuVucByIdCapPhep(this.idcapphepdaugia).toPromise();
    if (listData) {
      listData.map((khuvuc, index) => {
        khuvuc.serialNumber = index + 1;
      });
    }
    this.listCpDauGiaKhuVuc = listData;

    if (this.listCpDauGiaKhuVuc) {
      this.getNumberOfDataAfterInsertUpdateDeleteEvent.emit({
        idcapphepdaugia: this.idcapphepdaugia,
        hequychieu: this.heQuyChieu,
        count: this.listCpDauGiaKhuVuc.length
      });
    } else {
      this.getNumberOfDataAfterInsertUpdateDeleteEvent.emit(DefaultValue.Zero);
    }
  }

  /**
   * Hàm mở sidenav chức năng sửa dữ liệu
   * @param id
   */
  async editItemCpDauGiaKhuVuc(id: any) {
    // Lấy dữ liệu khu vực theo id
    const dataItem: any = await this.capPhepHoatDongKhoangSanFacadeService
      .getCapPhepDauGiaKhuVucService()
      .getByid(id).toPromise();

    if (!dataItem) {
      this.commonService.showDialogWarning(this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.capphepthamdokhuvuc.informedNotExistedCapPhepThamDoKhuVuc);
      return;
    }

    // clear Sidenav
    this.matSidenavService.clearSidenav();
    // Khởi tạo sidenav
    this.matSidenavService.setSidenav(this.matSidenav, this, this.content, this.cfr);
    await this.matSidenavService.setTitle(this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.capphepthamdokhuvuc.titleEdit);
    await this.matSidenavService.setContentComp(CpDaugiakhaithacKhuvucIoComponent, "edit", dataItem);
    await this.matSidenavService.open();
  }

  /**
   * Hàm mở sidenav chức năng thêm mới
   */
  public openCpDauGiaKhuVucIOSidenav() {
    // clear Sidenav
    this.matSidenavService.clearSidenav();
    // Khởi tạo sidenav
    this.matSidenavService.setSidenav(this.matSidenav, this, this.content, this.cfr);
    this.matSidenavService.setTitle(this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.capphepthamdokhuvuc.titleAdd);
    this.matSidenavService.setContentComp(CpDaugiakhaithacKhuvucIoComponent, "new", {
      idcapphepdaugia: this.idcapphepdaugia,
      loaicapphep: this.loaicapphep,
      hequychieu: this.heQuyChieu
    });
    this.matSidenavService.open();
  }

  /**
   *  Hàm xóa một bản ghi, được gọi khi nhấn nút xóa trên giao diện list
   */
  async deleteItemCpDauGiaKhuVuc(data) {
    this.selectedItem = data;
    // Phải check xem dữ liệu muốn xóa có đang được dùng ko, đang dùng thì ko xóa
    // Trường hợp dữ liệu có thể xóa thì Phải hỏi người dùng xem có muốn xóa không
    // Nếu đồng ý xóa
    const canDelete: string = this.capPhepHoatDongKhoangSanFacadeService
      .getCapPhepDauGiaKhuVucService()
      .checkBeDeleted(this.selectedItem.iddaugiakhuvuc);
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
      this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.capphepthamdokhuvuc.contentDelete,
      this.selectedItem.tenkhuvuc
    );
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === "confirm") {
        await this.capPhepHoatDongKhoangSanFacadeService
          .getCapPhepDauGiaKhuVucService()
          .deleteItem({iddaugiakhuvuc: this.selectedItem.iddaugiakhuvuc})
          .subscribe(
            () => this.getAllCpDauGiaKhuVuc(),
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
  doFunction(methodName, obj) {
    this[methodName](obj);
  }
}
