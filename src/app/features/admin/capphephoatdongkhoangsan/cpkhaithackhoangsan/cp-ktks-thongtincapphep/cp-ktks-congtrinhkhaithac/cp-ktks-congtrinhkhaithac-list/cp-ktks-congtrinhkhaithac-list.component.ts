import { Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef, Input, Type} from "@angular/core";
import { MatSidenav } from "@angular/material/sidenav";
import { TranslateService } from "@ngx-translate/core";
import { HttpErrorResponse } from "@angular/common/http";
import { GridComponent, TextWrapSettingsModel } from "@syncfusion/ej2-angular-grids";
import { SettingsCommon, ThietLapHeThong } from "src/app/shared/constants/setting-common";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { ThietlapFacadeService } from "src/app/services/admin/thietlap/thietlap-facade.service";
import { OutputCpThamDoCongTrinhModel } from 'src/app/models/admin/capphephoatdongkhoangsan/cpthamdocongtrinh.model';
import { CapPhepHoatDongKhoangSanFacadeService } from 'src/app/services/admin/capphephoatdongkhoangsan/capphephoatdongkhoangsan-facade.service';
import { DefaultValue } from 'src/app/shared/constants/global-var';
import { CpTdksCongtrinhthamdoIoComponent } from 'src/app/features/admin/capphephoatdongkhoangsan/cpthamdokhoangsan/cp-tdks-thongtincapphep/cp-tdks-congtrinhthamdo/cp-tdks-congtrinhthamdo-io/cp-tdks-congtrinhthamdo-io.component';
import { OutputCpKhaiThacCongTrinhModel } from "../../../../../../../models/admin/capphephoatdongkhoangsan/cpkhaithackhoangsan/cpkhaithaccongtrinh.model";
import { CpKtksCongtrinhkhaithacIoComponent } from "../cp-ktks-congtrinhkhaithac-io/cp-ktks-congtrinhkhaithac-io.component";

@Component({
  selector: 'app-cp-ktks-congtrinhkhaithac-list',
  templateUrl: './cp-ktks-congtrinhkhaithac-list.component.html',
  styleUrls: ['./cp-ktks-congtrinhkhaithac-list.component.scss']
})
export class CpKtksCongtrinhkhaithacListComponent implements OnInit {

  // Viewchild template
  @ViewChild("gridCpKhaiThacCongTrinh", { static: false }) public gridCpKhaiThacCongTrinh: GridComponent;
  @ViewChild(Type, { static: true }) public matSidenav: MatSidenav;
  @ViewChild(Type, { read: ViewContainerRef, static: true }) public content: ViewContainerRef;

  // tslint:disable-next-line: no-input-rename
  @Input("allowAutoInit") allowAutoInit = true;

  // Chứa thiết lập grid
  public settingsCommon = new SettingsCommon();

  // Chứa danh sách item đã chọn
  public listDataSelect: any[];

  // Chứa danh sách cấp phép khai thác công trình
  public listCpKhaiThacCongTrinh: OutputCpKhaiThacCongTrinhModel[];

  // Chứa dữ liệu đã chọn
  public selectedItem: OutputCpKhaiThacCongTrinhModel;

  // Chứa danh sách dữ liệu
  public listData: any;

  // Chứa dữ liệu translate
  public dataTranslate: any;

  // Chứa kiểu wrap text trên grid
  public wrapSettings: TextWrapSettingsModel;

  // Chứa dữ liệu Iddangkykhaithac
  public idcapphepkhaithac: string;

  // Contructor
  constructor(
    public matSidenavService: MatsidenavService,
    public cfr: ComponentFactoryResolver,
    public capPhepHoatDongKhoangSanFacadeService: CapPhepHoatDongKhoangSanFacadeService,
    public commonService: CommonServiceShared,
    public thietlapFacadeService: ThietlapFacadeService,
    private translate: TranslateService
  ) { }

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
    // Gọi hàm lấy dữ liệu cấp phép khai thác công trình
    await this.getAllCpKhaiThacCongTrinh();
  }

  /**
   * Hàm load lại dữ liệu grid
   */
  public reloadDataGrid() {
    this.getAllCpKhaiThacCongTrinh();
  }

  /**
   * Hàm lấy dữ liệu cấp phép khai thác công trình
   */
  async getAllCpKhaiThacCongTrinh() {
    if (this.idcapphepkhaithac === DefaultValue.Null || this.idcapphepkhaithac === DefaultValue.Undefined || this.idcapphepkhaithac.trim() === DefaultValue.Empty) {
      return;
    }

    const listData: any = await this.capPhepHoatDongKhoangSanFacadeService
      .getCapPhepKhaiThacCongTrinhService()
      .getCpKhaiThacCongTrinhByIdCapPhep(this.idcapphepkhaithac).toPromise();
    if (listData) {
      listData.map((congtrinh, index) => {
        congtrinh.serialNumber = index + 1;
      });
    }
    this.listCpKhaiThacCongTrinh = listData;
  }

  /**
   * Hàm mở sidenav chức năng sửa dữ liệu
   * @param id
   */
  async editItemCpKhaiThacCongTrinh(id: any) {
    // Lấy dữ liệu cá nhân theo id
    const dataItem: any = await this.capPhepHoatDongKhoangSanFacadeService
    .getCapPhepKhaiThacCongTrinhService()
    .getByid(id).toPromise();

    if (!dataItem) {
      this.commonService.showDialogWarning(this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.capphepthamdocongtrinh.informedNotExistedCapPhepThamDoCongTrinh);
      return;
    }

    // clear Sidenav
    this.matSidenavService.clearSidenav();
    // Khởi tạo sidenav
    this.matSidenavService.setSidenav(this.matSidenav, this, this.content, this.cfr);
    await this.matSidenavService.setTitle( this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.capphepthamdocongtrinh.titleEdit );
    await this.matSidenavService.setContentComp(CpKtksCongtrinhkhaithacIoComponent, "edit", dataItem);
    await this.matSidenavService.open();
  }

  /**
   * Hàm mở sidenav chức năng thêm mới
   */
  public openCpKhaiThacCongTrinhIOSidenav() {
    // clear Sidenav
    this.matSidenavService.clearSidenav();
    // Khởi tạo sidenav
    this.matSidenavService.setSidenav(this.matSidenav, this, this.content, this.cfr);
    this.matSidenavService.setTitle(this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.capphepthamdocongtrinh.titleAdd);
    this.matSidenavService.setContentComp(CpKtksCongtrinhkhaithacIoComponent, "new", {idcapphepkhaithac: this.idcapphepkhaithac});
    this.matSidenavService.open();
  }

  /**
   *  Hàm xóa một bản ghi, được gọi khi nhấn nút xóa trên giao diện list
   */
  async deleteItemCpKhaiThacCongTrinh(data) {
    this.selectedItem = data;
    // Phải check xem dữ liệu muốn xóa có đang được dùng ko, đang dùng thì ko xóa
    // Trường hợp dữ liệu có thể xóa thì Phải hỏi người dùng xem có muốn xóa không
    // Nếu đồng ý xóa
    const canDelete: string = this.capPhepHoatDongKhoangSanFacadeService
      .getCapPhepKhaiThacCongTrinhService()
      .checkBeDeleted(this.selectedItem.idcongtrinh);
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
      this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.capphepthamdocongtrinh.contentDelete,
      this.selectedItem.sohieu
    );
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === "confirm") {
        await this.capPhepHoatDongKhoangSanFacadeService
          .getCapPhepKhaiThacCongTrinhService()
          .deleteItem({ idcongtrinh: this.selectedItem.idcongtrinh })
          .subscribe(
            () => this.getAllCpKhaiThacCongTrinh(),
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
