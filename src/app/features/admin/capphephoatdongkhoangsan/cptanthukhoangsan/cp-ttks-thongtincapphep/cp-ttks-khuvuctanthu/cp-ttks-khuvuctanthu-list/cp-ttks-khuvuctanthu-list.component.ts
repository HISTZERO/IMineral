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
} from '@angular/core';
import {DetailRowService, GridComponent, GridModel, TextWrapSettingsModel} from "@syncfusion/ej2-angular-grids";
import {DefaultValue} from "src/app/shared/constants/global-var";
import {SettingsCommon, ThietLapHeThong} from "src/app/shared/constants/setting-common";
import {MatsidenavService} from "src/app/services/utilities/matsidenav.service";
import {CapPhepHoatDongKhoangSanFacadeService} from "src/app/services/admin/capphephoatdongkhoangsan/capphephoatdongkhoangsan-facade.service";
import {CommonServiceShared} from "src/app/services/utilities/common-service";
import {ThietlapFacadeService} from "src/app/services/admin/thietlap/thietlap-facade.service";
import {TranslateService} from "@ngx-translate/core";
import {ActivatedRoute} from "@angular/router";
import {HttpErrorResponse} from "@angular/common/http";
import {MatSidenav} from "@angular/material/sidenav";
import {OutputCpTanThuKhuVucModel} from "src/app/models/admin/capphephoatdongkhoangsan/cptanthukhoangsan/cptanthukhuvuc.model";
import {CpTtksKhuvuctanthuIoComponent} from "src/app/features/admin/capphephoatdongkhoangsan/cptanthukhoangsan/cp-ttks-thongtincapphep/cp-ttks-khuvuctanthu/cp-ttks-khuvuctanthu-io/cp-ttks-khuvuctanthu-io.component";

@Component({
  selector: 'app-cp-ttks-khuvuctanthu-list',
  templateUrl: './cp-ttks-khuvuctanthu-list.component.html',
  styleUrls: ['./cp-ttks-khuvuctanthu-list.component.scss'],
  providers: [DetailRowService],
})
export class CpTtksKhuvuctanthuListComponent implements OnInit {


  // Viewchild template
  @ViewChild("gridCpTanThuKhuVuc", {static: false}) public gridCpTanThuKhuVuc: GridComponent;
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
  public listCpTanThuKhuVuc: OutputCpTanThuKhuVucModel[];

  // Chứa dữ liệu đã chọn
  public selectedItem: OutputCpTanThuKhuVucModel;

  // Chứa danh sách dữ liệu
  public listData: any;

  // Chứa dữ liệu translate
  public dataTranslate: any;

  // Chứa kiểu wrap text trên grid
  public wrapSettings: TextWrapSettingsModel;

  // Chứa dữ liệu idcappheptanthu
  public idcappheptanthu: string;

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
    await this.getAllCpTanThuKhuVuc();
  }

  /**
   * Hàm load lại dữ liệu grid
   */
  public reloadDataGrid() {
    this.getAllCpTanThuKhuVuc();
  }

  /**
   * Hàm lấy dữ liệu Dvdc
   */
  async getAllCpTanThuKhuVuc() {
    if (this.idcappheptanthu === DefaultValue.Null || this.idcappheptanthu === DefaultValue.Undefined
      || this.idcappheptanthu.trim() === DefaultValue.Empty) {
      return;
    }

    const listData: any = await this.capPhepHoatDongKhoangSanFacadeService
      .getCapPhepTanThuKhuVucService()
      .getCapPhepTanThuKhuVucByIdCapPhepTanThu(this.idcappheptanthu).toPromise();
    if (listData) {
      listData.map((khuvuc, index) => {
        khuvuc.serialNumber = index + 1;
      });
    }
    this.listCpTanThuKhuVuc = listData;

    if (this.listCpTanThuKhuVuc) {
      this.getNumberOfDataAfterInsertUpdateDeleteEvent.emit({
        idcappheptanthu: this.idcappheptanthu,
        hequychieu: this.heQuyChieu,
        count: this.listCpTanThuKhuVuc.length
      });
    } else {
      this.getNumberOfDataAfterInsertUpdateDeleteEvent.emit(DefaultValue.Zero);
    }
  }

  /**
   * Hàm mở sidenav chức năng sửa dữ liệu
   * @param id
   */
  async editItemCpTanThuKhuVuc(id: any) {
    // Lấy dữ liệu khu vực theo id
    const dataItem: any = await this.capPhepHoatDongKhoangSanFacadeService
      .getCapPhepTanThuKhuVucService()
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
    await this.matSidenavService.setContentComp(CpTtksKhuvuctanthuIoComponent, "edit", dataItem);
    await this.matSidenavService.open();
  }

  /**
   * Hàm mở sidenav chức năng thêm mới
   */
  public openCpTanThuKhuVucIOSidenav() {
    // clear Sidenav
    this.matSidenavService.clearSidenav();
    // Khởi tạo sidenav
    this.matSidenavService.setSidenav(this.matSidenav, this, this.content, this.cfr);
    this.matSidenavService.setTitle(this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.capphepthamdokhuvuc.titleAdd);
    this.matSidenavService.setContentComp(CpTtksKhuvuctanthuIoComponent, "new", {
      idcappheptanthu: this.idcappheptanthu,
      loaicapphep: this.loaicapphep,
      hequychieu: this.heQuyChieu
    });
    this.matSidenavService.open();
  }

  /**
   *  Hàm xóa một bản ghi, được gọi khi nhấn nút xóa trên giao diện list
   */
  async deleteItemCpTanThuKhuVuc(data) {
    this.selectedItem = data;
    // Phải check xem dữ liệu muốn xóa có đang được dùng ko, đang dùng thì ko xóa
    // Trường hợp dữ liệu có thể xóa thì Phải hỏi người dùng xem có muốn xóa không
    // Nếu đồng ý xóa
    const canDelete: string = this.capPhepHoatDongKhoangSanFacadeService
      .getCapPhepTanThuKhuVucService()
      .checkBeDeleted(this.selectedItem.idtanthukhuvuc);
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
          .getCapPhepTanThuKhuVucService()
          .deleteItem({idtanthukhuvuc: this.selectedItem.idtanthukhuvuc})
          .subscribe(
            () => this.getAllCpTanThuKhuVuc(),
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
