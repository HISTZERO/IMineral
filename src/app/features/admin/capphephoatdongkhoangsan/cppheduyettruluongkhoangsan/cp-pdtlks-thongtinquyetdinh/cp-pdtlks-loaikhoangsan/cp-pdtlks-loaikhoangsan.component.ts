import { HttpErrorResponse } from '@angular/common/http';
import { ViewContainerRef } from '@angular/core';
import { Component, ComponentFactoryResolver, Input, OnInit, Type, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { OutputLoaiKhoangSan_TTDK_PDTL_Model } from 'src/app/models/admin/dangkyhoatdongkhoangsan/pheduyettruluong/pdtl_thongindangky_loaikhoangsan.model';
import { CapPhepHoatDongKhoangSanFacadeService } from 'src/app/services/admin/capphephoatdongkhoangsan/capphephoatdongkhoangsan-facade.service';
import { ThietlapFacadeService } from 'src/app/services/admin/thietlap/thietlap-facade.service';
import { CommonServiceShared } from 'src/app/services/utilities/common-service';
import { MatsidenavService } from 'src/app/services/utilities/matsidenav.service';
import { SettingsCommon, ThietLapHeThong } from 'src/app/shared/constants/setting-common';
import { CpTdksLoaikhoangsanIoComponent } from '../../../cpthamdokhoangsan/cp-tdks-thongtincapphep/cp-tdks-loaikhoangsan/cp-tdks-loaikhoangsan-io/cp-tdks-loaikhoangsan-io.component';
import { CpPdtlksLoaikhoangsanIoComponent } from './cp-pdtlks-loaikhoangsan-io/cp-pdtlks-loaikhoangsan-io.component';

@Component({
  selector: 'app-cp-pdtlks-loaikhoangsan',
  templateUrl: './cp-pdtlks-loaikhoangsan.component.html',
  styleUrls: ['./cp-pdtlks-loaikhoangsan.component.scss']
})
export class CpPdtlksLoaikhoangsanComponent implements OnInit {
  @Input("allowAutoInit") allowAutoInit = true;
  // có id này thì mới lấy được dữ liệu trên trang này
  @Input() idPheDuyetTruLuong:string;
  @ViewChild("gridLoaiKhoangSan", { static: false }) public gridLoaiKhoangSan: GridComponent;
  @ViewChild(Type, { static: true }) public matSidenav: MatSidenav;
  @ViewChild(Type, { read: ViewContainerRef, static: true }) public content: ViewContainerRef;
 // Chứa dữ liệu danh sách đơn vị
 public listLoaiKhoangSan: OutputLoaiKhoangSan_TTDK_PDTL_Model[];
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
  ) { }

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
   
    await this.getAllLoaiKhoangSanTheoPheDuyetTruLuong();
  }
    /**
   * Hàm láy danh sách khoáng sản
   */
  async getAllLoaiKhoangSanTheoPheDuyetTruLuong() {
    if (this.idPheDuyetTruLuong === null || this.idPheDuyetTruLuong === undefined) {
      this.listLoaiKhoangSan=[];
      return;
    }
    const listData: any = await this.capPhepHoatDongKhoangSanFacadeService
      .getCapPhepPheDuyetTLKS_loaiKSService()
      .layDSTruLuongLoaiKhoangSanTheoGiayPhepPheDuyet(this.idPheDuyetTruLuong).toPromise();
    if (listData) {
      listData.map((item, index) => {
        item.thutu = index + 1;
      });
    }
    this.listLoaiKhoangSan = listData;
  }
/**
 * Xóa Khoáng sản
 */
  async xoaKhoangSan(id:any){
    const dialogRef = this.commonService.confirmDeleteDiaLogService(
     "",
      ""
    );
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === "confirm") {
        await this.capPhepHoatDongKhoangSanFacadeService
          .getCapPhepPheDuyetTLKS_loaiKSService()
          .deleteItem({idpheduyettruluongloaikhoangsan: id})
          .subscribe(
            () => this.getAllLoaiKhoangSanTheoPheDuyetTruLuong(),
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
   * Sửa khoáng sản = lấy obj khoáng sản + gửi cho side nav
   * @param id ID phê duyệt trữ lượng khoáng sản
   */
  async suaKhoangSan(id){
  //Lấy thông tin bản ghi được chọn
   let record= await this.capPhepHoatDongKhoangSanFacadeService
   .getCapPhepPheDuyetTLKS_loaiKSService().getByid(id).toPromise();

    // clear Sidenav
    this.matSidenavService.clearSidenav();
    // Khởi tạo sidenav
    this.matSidenavService.setSidenav(this.matSidenav, this, this.content, this.cfr);
    this.matSidenavService.setTitle(this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.cappheppheduyettruluong_loaikhoangsan.titleEdit);
    this.matSidenavService.setContentComp(CpPdtlksLoaikhoangsanIoComponent, "edit", record);
    this.matSidenavService.open();
  }
    /**
   * Hàm mở sidenav chức năng thêm mới
   */
  public openCpThamDoLoaiKhoangSanIOSidenav() {
    // clear Sidenav
    this.matSidenavService.clearSidenav();
    // Khởi tạo sidenav
    this.matSidenavService.setSidenav(this.matSidenav, this, this.content, this.cfr);
    this.matSidenavService.setTitle(this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.cappheppheduyettruluong_loaikhoangsan.titleAdd);
    this.matSidenavService.setContentComp(CpPdtlksLoaikhoangsanIoComponent, "new", {idpheduyettruluong: this.idPheDuyetTruLuong});
    this.matSidenavService.open();
  }

    // Hàm dùng để gọi các hàm khác, truyền vào tên hàm cần thực thi
    doFunction(methodName) {
      this[methodName]();
    }
  

}
