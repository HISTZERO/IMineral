import { Component, ComponentFactoryResolver, EventEmitter, Input, OnInit, Output, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CapPhepHoatDongKhoangSanFacadeService } from 'src/app/services/admin/capphephoatdongkhoangsan/capphephoatdongkhoangsan-facade.service';
import { CommonServiceShared } from 'src/app/services/utilities/common-service';
import { CpThamDoKhoangSanTabEnum } from 'src/app/shared/constants/enum';

@Component({
  selector: 'app-cp-tdks-thongtincapphep',
  templateUrl: './cp-tdks-thongtincapphep.component.html',
  styleUrls: ['./cp-tdks-thongtincapphep.component.scss']
})
export class CpTdksThongtincapphepComponent implements OnInit {
  @ViewChild('thongTinCapPhepThamDoTabs', {static: false}) thongTinCapPhepThamDoTabs;
  @ViewChild(Type, { static: true }) public matSidenav: MatSidenav;
  @ViewChild(Type, { read: ViewContainerRef, static: true }) public content: ViewContainerRef;
  @ViewChild("capPhepThamDoDvhc", { static: false }) capPhepThamDoDvhc: any;
  @ViewChild("capPhepThamDoLoaiKhoangSan", { static: false }) capPhepThamDoLoaiKhoangSan: any;
  @ViewChild("capPhepThamDoCongTrinh", { static: false }) capPhepThamDoCongTrinh: any;
  @ViewChild("capPhepThamDoKhuVuc", { static: false }) capPhepThamDoKhuVuc: any;
  // tslint:disable-next-line: no-input-rename
  @Input("allowAutoInit") allowAutoInit = true;
  // tslint:disable-next-line: no-output-rename
  @Output("selectCurrentFormStateEvent") selectCurrentFormStateEvent: EventEmitter<number> = new EventEmitter();
  // Lưu trữ thông tin đăng ký tab
  public TabType = CpThamDoKhoangSanTabEnum;
  // Lưu trữ dữ liệu id giấy phép
  public idgiayphep;
  // Lưu trữ trạng thais tab được select
  public loadedTabState: any = {
    [CpThamDoKhoangSanTabEnum.ThongTinChiTiet] : true,
    [CpThamDoKhoangSanTabEnum.DonViHanhChinh] : false,
    [CpThamDoKhoangSanTabEnum.LoaiKhoangSan] : false,
    [CpThamDoKhoangSanTabEnum.KhuVucThamDo] : false,
    [CpThamDoKhoangSanTabEnum.CongTrinhThamDo] : false
  };

  public disabledTabState: any = {
    [CpThamDoKhoangSanTabEnum.ThongTinChiTiet] : false,
    [CpThamDoKhoangSanTabEnum.DonViHanhChinh] : false,
    [CpThamDoKhoangSanTabEnum.LoaiKhoangSan] : false,
    [CpThamDoKhoangSanTabEnum.KhuVucThamDo] : false,
    [CpThamDoKhoangSanTabEnum.CongTrinhThamDo] : false
  };

   // Lưu trữ dữ liệu action hiện tại
   public currentAction: number;
   // Chứa dữ liệu translate
   public dataTranslate: any;
   // Lưu trữ dữ liệu idcapphepthamdo
   private idcapphepthamdo: string;
   // Lưu trữ dữ liệu hồ sơ
   private itemGiayPhep: any;

  constructor(private cfr: ComponentFactoryResolver,
              private translate: TranslateService,
              private activatedRoute: ActivatedRoute,
              public commonService: CommonServiceShared,
              private capPhepHoatDongKhoangSanFacadeService: CapPhepHoatDongKhoangSanFacadeService) { }

  ngOnInit() {
  }

  async tabChange(index: any) {
    if (index === CpThamDoKhoangSanTabEnum.DonViHanhChinh && !this.loadedTabState[CpThamDoKhoangSanTabEnum.DonViHanhChinh]) {
      this.capPhepThamDoDvhc.matSidenav = this.matSidenav;
      this.capPhepThamDoDvhc.content = this.content;
      this.capPhepThamDoDvhc.idcapphepthamdo = this.idcapphepthamdo;
      this.loadedTabState[CpThamDoKhoangSanTabEnum.DonViHanhChinh] = await this.capPhepThamDoDvhc.manualDataInit();
    } else if (index === CpThamDoKhoangSanTabEnum.LoaiKhoangSan && !this.loadedTabState[CpThamDoKhoangSanTabEnum.LoaiKhoangSan]) {
      this.capPhepThamDoLoaiKhoangSan.matSidenav = this.matSidenav;
      this.capPhepThamDoLoaiKhoangSan.content = this.content;
      this.capPhepThamDoLoaiKhoangSan.idcapphepthamdo = this.idcapphepthamdo;
      this.loadedTabState[CpThamDoKhoangSanTabEnum.LoaiKhoangSan] = await this.capPhepThamDoLoaiKhoangSan.manualDataInit();
    } else if (index === CpThamDoKhoangSanTabEnum.KhuVucThamDo && !this.loadedTabState[CpThamDoKhoangSanTabEnum.KhuVucThamDo]) {
      this.capPhepThamDoKhuVuc.matSidenav = this.matSidenav;
      this.capPhepThamDoKhuVuc.content = this.content;
      this.capPhepThamDoKhuVuc.idcapphepthamdo = this.idcapphepthamdo;
      this.capPhepThamDoKhuVuc.loaicapphep = this.itemGiayPhep.loaicapphep;
      this.loadedTabState[CpThamDoKhoangSanTabEnum.KhuVucThamDo] = await this.capPhepThamDoKhuVuc.manualDataInit();
    } else if (index === CpThamDoKhoangSanTabEnum.CongTrinhThamDo && !this.loadedTabState[CpThamDoKhoangSanTabEnum.CongTrinhThamDo]) {
      this.capPhepThamDoCongTrinh.matSidenav = this.matSidenav;
      this.capPhepThamDoCongTrinh.content = this.content;
      this.capPhepThamDoCongTrinh.idcapphepthamdo = this.idcapphepthamdo;
      this.loadedTabState[CpThamDoKhoangSanTabEnum.CongTrinhThamDo] = await this.capPhepThamDoCongTrinh.manualDataInit();
    }
  }
}
