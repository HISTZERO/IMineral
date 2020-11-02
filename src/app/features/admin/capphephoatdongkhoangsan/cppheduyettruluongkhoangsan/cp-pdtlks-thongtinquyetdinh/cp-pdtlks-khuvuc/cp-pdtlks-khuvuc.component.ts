import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  ComponentFactoryResolver,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Type,
  ViewChild,
  ViewContainerRef,
} from "@angular/core";
import { MatSidenav } from "@angular/material";
import { TranslateService } from "@ngx-translate/core";
import { DetailRowService, GridComponent } from "@syncfusion/ej2-angular-grids";
import { OutputLoaiKhoangSan_TTDK_PDTL_Model } from "src/app/models/admin/dangkyhoatdongkhoangsan/pheduyettruluong/pdtl_thongindangky_loaikhoangsan.model";
import { OutputPheDuyetTruLuongKS_KhuVucThamDoModel } from "src/app/models/admin/dangkyhoatdongkhoangsan/pheduyettruluong/pdtl_thongtindangky_khuvucthamdo.model";
import { CapPhepHoatDongKhoangSanFacadeService } from "src/app/services/admin/capphephoatdongkhoangsan/capphephoatdongkhoangsan-facade.service";
import { ThietlapFacadeService } from "src/app/services/admin/thietlap/thietlap-facade.service";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { SettingsCommon, ThietLapHeThong } from "src/app/shared/constants/setting-common";
import { CpPdtlksKhuvucIoComponent } from './cp-pdtlks-khuvuc-io/cp-pdtlks-khuvuc-io.component';

@Component({
  selector: "app-cp-pdtlks-khuvuc",
  templateUrl: "./cp-pdtlks-khuvuc.component.html",
  styleUrls: ["./cp-pdtlks-khuvuc.component.scss"],
  providers: [DetailRowService]

})
export class CpPdtlksKhuvucComponent implements OnInit {
  @Input("allowAutoInit") allowAutoInit = true;
  // có id này thì mới lấy được dữ liệu trên trang này
  @Input() idPheDuyetTruLuong: string;
  @ViewChild("gridKhuVucThamDo", { static: false }) public gridKhuVuc: GridComponent;
  @ViewChild(Type, { static: true }) public matSidenav: MatSidenav;
  @Output("callBackTabThongTinChiTiet") callBackTabThongTinChiTiet: EventEmitter<any> = new EventEmitter();
  @ViewChild(Type, { read: ViewContainerRef, static: true })
  public content: ViewContainerRef;
  // Chứa dữ liệu danh sách khu vực
  public listKhuVuc: OutputPheDuyetTruLuongKS_KhuVucThamDoModel[];
  // Chứa thiết lập grid
  public settingsCommon = new SettingsCommon();
  // Chứa dữ liệu translate
  public dataTranslate: any;
  constructor(
    public matSidenavService: MatsidenavService,
    public cfr: ComponentFactoryResolver,
    public capPhepHoatDongKhoangSanFacadeService: CapPhepHoatDongKhoangSanFacadeService,
    public commonService: CommonServiceShared,
    public thietlapFacadeService: ThietlapFacadeService,
    private translate: TranslateService
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
    await this.getDataPageSize();
    return true;
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
   
    await this.layDanhSachKhuVuc();
  }

  /**
   * Hàm láy danh sách khoáng sản
   */
  async layDanhSachKhuVuc() {
    if (this.idPheDuyetTruLuong === null || this.idPheDuyetTruLuong === undefined) {
      this.listKhuVuc=[];
      return;
    }
    const listData: any = await this.capPhepHoatDongKhoangSanFacadeService
      .getCapPhepPheDuyetTLKS_KhuVucService()
      .layDSKhuVuc(this.idPheDuyetTruLuong).toPromise();
    if (listData) {
      listData.map((item, index) => {
        item.thutu = index + 1;
      });
    }
    this.listKhuVuc = listData;
  }
  /**
   * Thêm khu vực
   */
  openAddSideNavModal(){
      // clear Sidenav
      this.matSidenavService.clearSidenav();
      // Khởi tạo sidenav
      this.matSidenavService.setSidenav(this.matSidenav, this, this.content, this.cfr);
      this.matSidenavService.setTitle(this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.cappheppheduyettruluongkhoangsan_khuvucthamdo.titleAdd);
      this.matSidenavService.setContentComp(CpPdtlksKhuvucIoComponent, "new", {idpheduyettruluong: this.idPheDuyetTruLuong});
      this.matSidenavService.open();
  }
    // Hàm dùng để gọi các hàm khác, truyền vào tên hàm cần thực thi
    doFunction(methodName) {
      this[methodName]();
    }

    
  /**
   * Hàm mở sidenav chức năng sửa dữ liệu
   * @param id
   */
  async editItemCpKhaiThacKhuVuc(id: any) {
    // Lấy dữ liệu khu vực theo id
    const dataItem: any = await this.capPhepHoatDongKhoangSanFacadeService
      .getCapPhepPheDuyetTLKS_KhuVucService()
      .getByid(id).toPromise();

    if (!dataItem) {
      this.commonService.showDialogWarning(this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.capphepkhaithackhuvuc.informedNotExistedCapPhepKhaiThacKhuVuc);
      return;
    }
     // clear Sidenav
     this.matSidenavService.clearSidenav();
     // Khởi tạo sidenav
     this.matSidenavService.setSidenav(this.matSidenav, this, this.content, this.cfr);
     await this.matSidenavService.setTitle(this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.cappheppheduyettruluongkhoangsan_khuvucthamdo.titleEdit);
     await this.matSidenavService.setContentComp(CpPdtlksKhuvucIoComponent, "edit", dataItem);
     await this.matSidenavService.open();
   }

     /**
   *  Hàm xóa một bản ghi, được gọi khi nhấn nút xóa trên giao diện list
   */
  async deleteItemCpKhaiThacKhuVuc(data) {
        const dialogRef = this.commonService.confirmDeleteDiaLogService(
      "",
      ""
    );
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === "confirm") {
        await this.capPhepHoatDongKhoangSanFacadeService
          .getCapPhepPheDuyetTLKS_KhuVucService()
          .deleteItem({ idPheDuyetTruLuongkhuvuc: data.idpheduyettruluongkhuvuc })
          .subscribe(
            () => {
              this.layDanhSachKhuVuc();
              this.callBackTabThongTin();
            },
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
   * Gọi lại tab thông tin chi tiết để load lại dữ liệu
   */
  public callBackTabThongTin() {
    this.callBackTabThongTinChiTiet.emit();
  }

}
