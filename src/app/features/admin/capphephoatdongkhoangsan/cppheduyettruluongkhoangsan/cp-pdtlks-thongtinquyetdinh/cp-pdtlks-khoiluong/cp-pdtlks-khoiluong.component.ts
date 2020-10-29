import { HttpErrorResponse } from "@angular/common/http";
import {
  Component,
  ComponentFactoryResolver,
  Input,
  OnInit,
  Type,
  ViewChild,
  ViewContainerRef,
} from "@angular/core";
import { MatSidenav } from "@angular/material";
import { ActivatedRoute } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import {
  GridComponent,
  TextWrapSettingsModel,
} from "@syncfusion/ej2-angular-grids";
import { OutputCpPheDuyetTruLuongKhoiTruLuongModel } from "src/app/models/admin/capphephoatdongkhoangsan/cppheduyettruluongkhoangsan/cpPheDuyetTruLuongKhoiTruLuong.model";
import { CapPhepHoatDongKhoangSanFacadeService } from "src/app/services/admin/capphephoatdongkhoangsan/capphephoatdongkhoangsan-facade.service";
import { ThietlapFacadeService } from "src/app/services/admin/thietlap/thietlap-facade.service";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import {
  SettingsCommon,
  ThietLapHeThong,
} from "src/app/shared/constants/setting-common";
import { CpPdtlksKhoiluongIoComponent } from "./cp-pdtlks-khoiluong-io/cp-pdtlks-khoiluong-io.component";

@Component({
  selector: "app-cp-pdtlks-khoiluong",
  templateUrl: "./cp-pdtlks-khoiluong.component.html",
  styleUrls: ["./cp-pdtlks-khoiluong.component.scss"],
})
export class CpPdtlksKhoiluongComponent implements OnInit {
  // Viewchild template
  @ViewChild("gridCpKhaiThacKhuVuc", { static: false })
  public gridCpKhaiThacKhuVuc: GridComponent;
  @ViewChild(Type, { static: true }) public matSidenav: MatSidenav;
  @ViewChild(Type, { read: ViewContainerRef, static: true })
  public content: ViewContainerRef;
  @Input("allowAutoInit") allowAutoInit = true;
  // Chứa danh sách cấp phép khai thác khu vực
  public listKhoiluongTruLuong: OutputCpPheDuyetTruLuongKhoiTruLuongModel[];
  // Chứa thiết lập grid
  public settingsCommon = new SettingsCommon();
  // Chứa dữ liệu translate
  public dataTranslate: any;
  // id phê duyệt trữ lượng
  public idpheduyettruluong: string;
  // Chứa kiểu wrap text trên grid
  public wrapSettings: TextWrapSettingsModel;

  constructor(
    public matSidenavService: MatsidenavService,
    public cfr: ComponentFactoryResolver,
    public capPhepHoatDongKhoangSanFacadeService: CapPhepHoatDongKhoangSanFacadeService,
    public commonService: CommonServiceShared,
    public thietlapFacadeService: ThietlapFacadeService,
    private translate: TranslateService,
    private activatedRoute: ActivatedRoute
  ) {}

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
  async manualDataInit() {
    // Gọi hàm lấy dữ liệu pagesize
    await this.getDataPageSize();
    return true;
  }

  /**
   * Hàm lấy dữ liệu pagesize số bản ghi hiển thị trên 1 trang
   */
  async getDataPageSize() {
    const dataSetting: any = await this.thietlapFacadeService
      .getThietLapHeThongService()
      .getByid(ThietLapHeThong.defaultPageSize)
      .toPromise();
    if (dataSetting) {
      this.settingsCommon.pageSettings.pageSize = +dataSetting.settingValue;
    } else {
      this.settingsCommon.pageSettings.pageSize = 10;
    }
    // Gọi hàm lấy dữ liệu cấp phép khai thác khu vực
    await this.layDanhSachKhoiLuongTruLuong();
  }
  /**
   * Hàm lấy Danh sách khối lượng trữ lượng
   */
  async layDanhSachKhoiLuongTruLuong() {
    const listData: any = await this.capPhepHoatDongKhoangSanFacadeService
      .getCapPhepPheDuyetTLKS_khoiLuongTruLuongService()
      .layDanhSachKhoiTruLuong(this.idpheduyettruluong)
      .toPromise();
    if (listData) {
      listData.map((item, index) => {
        item.thutu = index + 1;
      });
    }
    this.listKhoiluongTruLuong = listData || [];
  }

  //xóa khối lượng trữ lượng
  async xoaTruLuongKhoiLuong(id) {
    const dialogRef = this.commonService.confirmDeleteDiaLogService("", "");
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === "confirm") {
        await this.capPhepHoatDongKhoangSanFacadeService
          .getCapPhepPheDuyetTLKS_khoiLuongTruLuongService()
          .deleteItem({ idpheduyettruluongkhoitruluong: id })
          .subscribe(
            () => this.layDanhSachKhoiLuongTruLuong(),
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
  //Show modal Thêm
  showAddSideNavModal() {
    // clear Sidenav
    this.matSidenavService.clearSidenav();
    // Khởi tạo sidenav
    this.matSidenavService.setSidenav(
      this.matSidenav,
      this,
      this.content,
      this.cfr
    );
    this.matSidenavService.setTitle(
      this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.capphepkhaithackhuvuc.titleAdd
    );
    this.matSidenavService.setContentComp(CpPdtlksKhoiluongIoComponent, "new", {
      idpheduyettruluong: this.idpheduyettruluong,
    });
    this.matSidenavService.open();
  }

  //show modal sửa
  async showEditSideNavModal(id:any){
    //Lấy thông tin bản ghi
    let obj= await this.capPhepHoatDongKhoangSanFacadeService
    .getCapPhepPheDuyetTLKS_khoiLuongTruLuongService().getByid(id).toPromise();

    //truyền thông tin bản ghi vào Modal
    if(obj){
      // clear Sidenav
    this.matSidenavService.clearSidenav();
    // Khởi tạo sidenav
    this.matSidenavService.setSidenav(
      this.matSidenav,
      this,
      this.content,
      this.cfr
    );
    this.matSidenavService.setTitle(
      this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.capphepkhaithackhuvuc.titleAdd
    );
    this.matSidenavService.setContentComp(CpPdtlksKhoiluongIoComponent, "edit", obj);
    this.matSidenavService.open();
    }
  }

  // Hàm dùng để gọi các hàm khác, truyền vào tên hàm cần thực thi
  doFunction(methodName) {
    this[methodName]();
  }
}
