import { Component, ComponentFactoryResolver, Input, OnInit, Type, ViewChild, ViewContainerRef} from "@angular/core";
import { MatSidenav } from "@angular/material/sidenav";
import { TranslateService } from "@ngx-translate/core";
import { HttpErrorResponse } from "@angular/common/http";
import { GridComponent } from "@syncfusion/ej2-angular-grids";

import { SettingsCommon, ThietLapHeThong } from "src/app/shared/constants/setting-common";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { ThietlapFacadeService } from "src/app/services/admin/thietlap/thietlap-facade.service";
import { DefaultValue } from 'src/app/shared/constants/global-var';
import { CapPhepHoatDongKhoangSanFacadeService } from 'src/app/services/admin/capphephoatdongkhoangsan/capphephoatdongkhoangsan-facade.service';
import { OutputCpKhaiThacDVHCModel } from "src/app/models/admin/capphephoatdongkhoangsan/cpkhaithackhoangsan/cpkhaithacdvhc.model";
import { CpKtksDonvihanhchinhIoComponent } from "src/app/features/admin/capphephoatdongkhoangsan/cpkhaithackhoangsan/cp-ktks-thongtincapphep/cp-ktks-donvihanhchinh/cp-ktks-donvihanhchinh-io/cp-ktks-donvihanhchinh-io.component";

@Component({
  selector: 'app-cp-ktks-donvihanhchinh-list',
  templateUrl: './cp-ktks-donvihanhchinh-list.component.html',
  styleUrls: ['./cp-ktks-donvihanhchinh-list.component.scss']
})
export class CpKtksDonvihanhchinhListComponent implements OnInit {

  @ViewChild("gridCapPhepKhaiThacDvhc", { static: false }) public gridCapPhepKhaiThacDvhc: GridComponent;
  @ViewChild(Type, { static: true }) public matSidenav: MatSidenav;
  @ViewChild(Type, { read: ViewContainerRef, static: true }) public content: ViewContainerRef;

  // Chứa thiết lập grid
  public settingsCommon = new SettingsCommon();

  // Chứa dữ liệu danh sách đơn vị
  public listCapPhepKhaiThacDvhc: OutputCpKhaiThacDVHCModel[];

  // Chứa dữ liệu đã chọn
  public selectedItem: OutputCpKhaiThacDVHCModel;

  // Chứa dữ liệu translate
  public dataTranslate: any;

  // Chứa dữ liệu idcapphepkhaithac
  public idcapphepkhaithac: string;

  // tslint:disable-next-line: no-input-rename
  @Input("allowAutoInit") allowAutoInit = true;

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
    // Gọi hàm lấy dữ liệu cấp phép khai thác dvhc
    await this.getAllCapPhepKhaiThacDvhc();
  }

  async manualDataInit() {
    await this.getDataPageSize();
    return true;
  }

  /**
   * Hàm lấy dữ liệu Dvdc
   */
  async getAllCapPhepKhaiThacDvhc() {
    if (this.idcapphepkhaithac === DefaultValue.Null || this.idcapphepkhaithac === DefaultValue.Undefined
         || this.idcapphepkhaithac.trim() === DefaultValue.Empty) {
      return;
    }

    const listData: any = await this.capPhepHoatDongKhoangSanFacadeService
      .getCapPhepKhaiThacDVHCService()
      .getCpKhaiThacDVHCByIdCapPhep(this.idcapphepkhaithac).toPromise();
    if (listData) {
      listData.map((dvhc, index) => {
        dvhc.serialNumber = index + 1;
      });
    }
    this.listCapPhepKhaiThacDvhc = listData;
  }

  /**
   * Hàm load lại dữ liệu grid
   */
  public reloadDataGrid() {
    this.getAllCapPhepKhaiThacDvhc();
  }

  /**
   * Hàm mở sidenav chức năng sửa dữ liệu
   * @param id
   */
  async editItemCapPhepKhaiThacDvhc(idKhaiThacDvhc: any) {
    // Lấy dữ liệu cá nhân theo id
    const dataItem: any = await this.capPhepHoatDongKhoangSanFacadeService
    .getCapPhepKhaiThacDVHCService()
    .getByid(idKhaiThacDvhc).toPromise();
    if (!dataItem) {
      this.commonService.showDialogWarning(this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.capphepkhaithacdvhc.informedNotExistedCapPhepKhaiThacDvhc);
      return;
    }

    // clear Sidenav
    this.matSidenavService.clearSidenav();
    // Khởi tạo sidenav
    this.matSidenavService.setSidenav(this.matSidenav, this, this.content, this.cfr);
    await this.matSidenavService.setTitle( this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.capphepkhaithacdvhc.titleEdit );
    await this.matSidenavService.setContentComp(CpKtksDonvihanhchinhIoComponent, "edit", dataItem);
    await this.matSidenavService.open();
  }

  /**
   * Hàm mở sidenav chức năng thêm mới
   */
  public openCapPhepKhaiThacDvhcIOSidenav() {
    // clear Sidenav
    this.matSidenavService.clearSidenav();
    // Khởi tạo sidenav
    this.matSidenavService.setSidenav(this.matSidenav, this, this.content, this.cfr);
    this.matSidenavService.setTitle(this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.capphepkhaithacdvhc.titleAdd);
    this.matSidenavService.setContentComp(CpKtksDonvihanhchinhIoComponent, "new", {idcapphepkhaithac: this.idcapphepkhaithac});
    this.matSidenavService.open();
  }

  /**
   *  Hàm xóa một bản ghi, được gọi khi nhấn nút xóa trên giao diện list
   */
  async deleteItemCapPhepKhaiThacDvhc(data) {
    this.selectedItem = data;
    // Phải check xem dữ liệu muốn xóa có đang được dùng ko, đang dùng thì ko xóa
    // Trường hợp dữ liệu có thể xóa thì Phải hỏi người dùng xem có muốn xóa không
    // Nếu đồng ý xóa
    const canDelete: string = this.capPhepHoatDongKhoangSanFacadeService
      .getCapPhepKhaiThacDVHCService()
      .checkBeDeleted(this.selectedItem.idcapphepkhaithac);
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
      this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.capphepkhaithacdvhc.contentDelete,
      this.selectedItem.tentinh + " - " + this.selectedItem.tenhuyen + " - " + this.selectedItem.tenxa
    );
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === "confirm") {
        await this.capPhepHoatDongKhoangSanFacadeService
          .getCapPhepKhaiThacDVHCService()
          .deleteItem({ idkhaithacdvhc: this.selectedItem.idkhaithacdvhc })
          .subscribe(
            () => this.getAllCapPhepKhaiThacDvhc(),
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
