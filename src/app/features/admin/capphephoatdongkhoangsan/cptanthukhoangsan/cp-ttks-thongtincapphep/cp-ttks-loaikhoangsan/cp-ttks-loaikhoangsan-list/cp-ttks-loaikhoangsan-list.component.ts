import {Component, ComponentFactoryResolver, Input, OnInit, Type, ViewChild, ViewContainerRef} from '@angular/core';
import {HttpErrorResponse} from "@angular/common/http";
import {MatSidenav} from "@angular/material/sidenav";
import {GridComponent} from "@syncfusion/ej2-angular-grids";
import {SettingsCommon, ThietLapHeThong} from "src/app/shared/constants/setting-common";
import {OutputCpThamDoLoaiKhoangSanModel} from "src/app/models/admin/capphephoatdongkhoangsan/cpthamdoloaikhoangsan.model";
import {OutputCpTanThuLoaiKhoangSanModel} from "src/app/models/admin/capphephoatdongkhoangsan/cptanthukhoangsan/cptanthuloaikhoangsan.model";
import {MatsidenavService} from "src/app/services/utilities/matsidenav.service";
import {CapPhepHoatDongKhoangSanFacadeService} from "src/app/services/admin/capphephoatdongkhoangsan/capphephoatdongkhoangsan-facade.service";
import {CommonServiceShared} from "src/app/services/utilities/common-service";
import {TranslateService} from "@ngx-translate/core";
import {ThietlapFacadeService} from "src/app/services/admin/thietlap/thietlap-facade.service";
import {CpTtksLoaikhoangsanIoComponent} from "src/app/features/admin/capphephoatdongkhoangsan/cptanthukhoangsan/cp-ttks-thongtincapphep/cp-ttks-loaikhoangsan/cp-ttks-loaikhoangsan-io/cp-ttks-loaikhoangsan-io.component";

@Component({
  selector: 'app-cp-ttks-loaikhoangsan-list',
  templateUrl: './cp-ttks-loaikhoangsan-list.component.html',
  styleUrls: ['./cp-ttks-loaikhoangsan-list.component.scss']
})
export class CpTtksLoaikhoangsanListComponent implements OnInit {

  // Viewchild template
  @ViewChild("gridCpTanThuLoaiKhoangSan", { static: false }) public gridCpTanThuLoaiKhoangSan: GridComponent;
  @ViewChild(Type, { static: true }) public matSidenav: MatSidenav;
  @ViewChild(Type, { read: ViewContainerRef, static: true }) public content: ViewContainerRef;

  // tslint:disable-next-line: no-input-rename
  @Input("allowAutoInit") allowAutoInit = true;

  // Chứa thiết lập grid
  public settingsCommon = new SettingsCommon();

  // Chứa dữ liệu danh sách đơn vị
  public listCpTanThuLoaiKhoangSan: OutputCpTanThuLoaiKhoangSanModel[];

  // Chứa dữ liệu đã chọn
  public selectedItem: OutputCpTanThuLoaiKhoangSanModel;

  // Chứa dữ liệu translate
  public dataTranslate: any;

  // Chứa dữ liệu Idcappheptanthu
  public idcappheptanthu: string;

  constructor(public matSidenavService: MatsidenavService,
              public cfr: ComponentFactoryResolver,
              public capPhepHoatDongKhoangSanFacadeService: CapPhepHoatDongKhoangSanFacadeService,
              public commonService: CommonServiceShared,
              public thietlapFacadeService: ThietlapFacadeService,
              private translate: TranslateService) { }

  async ngOnInit() {
    this.getDataTranslate();

    if (this.allowAutoInit) {
      await this.manualDataInit();
    }
  }

  async manualDataInit() {
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
  }

  /**
   * Hàm lấy dữ liệu pagesize số bản ghi hiển thị trên 1 trang
   */
  async getDataPageSize() {
    const dataSetting: any = await this.thietlapFacadeService
      .getThietLapHeThongService()
      .getByid(ThietLapHeThong.defaultPageSize ).toPromise();
    if (dataSetting) {
      this.settingsCommon.pageSettings.pageSize = +dataSetting.settingValue;
    } else {
      this.settingsCommon.pageSettings.pageSize = 10;
    }
    // Gọi hàm lấy dữ liệu cá nhân
    await this.getAllCpTanThuLoaiKhoangSan();
  }

  /**
   * Hàm lấy dữ liệu Dvdc
   */
  async getAllCpTanThuLoaiKhoangSan() {
    if (this.idcappheptanthu === null || this.idcappheptanthu === undefined) {
      return;
    }

    const listData: any = await this.capPhepHoatDongKhoangSanFacadeService
      .getCapPhepTanThuLoaiKhoangSanService()
      .getCapPhepTanThuLoaiKhoangSanByIdCapPhepTanThu(this.idcappheptanthu).toPromise();
    if (listData) {
      listData.map((loaiKhoangSan, index) => {
        loaiKhoangSan.serialNumber = index + 1;
      });
    }
    this.listCpTanThuLoaiKhoangSan = listData;
  }


  /**
   * Hàm load lại dữ liệu grid
   */
  public reloadDataGrid() {
    this.getAllCpTanThuLoaiKhoangSan();
  }

  /**
   * Hàm mở sidenav chức năng sửa dữ liệu
   * @param id
   */
  async editItemCpTanThuLoaiKhoangSan(id: any) {
    // Lấy dữ liệu cá nhân theo id
    const dataItem: any = await this.capPhepHoatDongKhoangSanFacadeService
      .getCapPhepTanThuLoaiKhoangSanService()
      .getByid(id).toPromise();

    if (!dataItem) {
      this.commonService.showDialogWarning(this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.capphepthamdoloaikhoangsan.informedNotExistedCapPhepThamDoLoaiKhoangSan);
      return;
    }

    // clear Sidenav
    this.matSidenavService.clearSidenav();
    // Khởi tạo sidenav
    this.matSidenavService.setSidenav(this.matSidenav, this, this.content, this.cfr);
    await this.matSidenavService.setTitle( this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.capphepthamdoloaikhoangsan.titleEdit );
    await this.matSidenavService.setContentComp(CpTtksLoaikhoangsanIoComponent, "edit", dataItem);
    await this.matSidenavService.open();
  }

  /**
   * Hàm mở sidenav chức năng thêm mới
   */
  public openCpTanThuLoaiKhoangSanIOSidenav() {
    // clear Sidenav
    this.matSidenavService.clearSidenav();
    // Khởi tạo sidenav
    this.matSidenavService.setSidenav(this.matSidenav, this, this.content, this.cfr);
    this.matSidenavService.setTitle(this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.capphepthamdoloaikhoangsan.titleAdd);
    this.matSidenavService.setContentComp(CpTtksLoaikhoangsanIoComponent, "new", {idcappheptanthu: this.idcappheptanthu});
    this.matSidenavService.open();
  }

  /**
   *  Hàm xóa một bản ghi, được gọi khi nhấn nút xóa trên giao diện list
   */
  async deleteItemCapPhepTanThuLoaiKhoangSan(data) {
    this.selectedItem = data;
    // Phải check xem dữ liệu muốn xóa có đang được dùng ko, đang dùng thì ko xóa
    // Trường hợp dữ liệu có thể xóa thì Phải hỏi người dùng xem có muốn xóa không
    // Nếu đồng ý xóa
    const canDelete: string = this.capPhepHoatDongKhoangSanFacadeService
      .getCapPhepTanThuLoaiKhoangSanService()
      .checkBeDeleted(this.selectedItem.idtanthuloaikhoangsan);
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
      this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.capphepthamdoloaikhoangsan.contentDelete,
      this.selectedItem.tenloaikhoangsan
    );
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === "confirm") {
        await this.capPhepHoatDongKhoangSanFacadeService
          .getCapPhepTanThuLoaiKhoangSanService()
          .deleteItem({ idtanthuloaikhoangsan: this.selectedItem.idtanthuloaikhoangsan })
          .subscribe(
            () => this.getAllCpTanThuLoaiKhoangSan(),
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
  doFunction(methodName) {
    this[methodName]();
  }

}
