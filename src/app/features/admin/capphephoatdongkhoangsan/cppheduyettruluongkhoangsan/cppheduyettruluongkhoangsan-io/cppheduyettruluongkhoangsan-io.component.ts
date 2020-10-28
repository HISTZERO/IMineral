import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MatSidenav } from '@angular/material';
import { ActivatedRoute } from '@angular/router';

import {InsertedState, NhomTaiLieuEnum, GiayPhepActionEnum, CpPheDuyetTruLuongKhoangSanTabEnum } from 'src/app/shared/constants/enum';
import { MatsidenavService } from 'src/app/services/utilities/matsidenav.service';
import { NhomLoaiCapPhepEnum } from "src/app/shared/constants/nhomloaicapphep-constants";
import { GiayphepIoComponent } from 'src/app/features/admin/hosogiayto/giayphep/giayphep-io/giayphep-io.component';
import {HoSoGiayToFacadeService} from 'src/app/services/admin/hosogiayto/hosogiayto-facade.service';
import { ButtonBackCpPheDuyetTruLuongKhoangSan, MenuCpPheDuyetTruLuongKhoangSanChitiet } from 'src/app/shared/constants/sub-menus/capphephoatdongkhoangsan/capphephoatdongkhoangsan';
import { DefaultValue } from 'src/app/shared/constants/global-var';
import { GiaypheptailieuListComponent } from 'src/app/features/admin/hosogiayto/giaypheptailieu/giaypheptailieu-list/giaypheptailieu-list.component';
import { CpPdtlksThongtinquyetdinhComponent } from '../cp-pdtlks-thongtinquyetdinh/cp-pdtlks-thongtinquyetdinh.component';

@Component({
  selector: 'app-cppheduyettruluongkhoangsan-io',
  templateUrl: './cppheduyettruluongkhoangsan-io.component.html',
  styleUrls: ['./cppheduyettruluongkhoangsan-io.component.scss']
})
export class CppheduyettruluongkhoangsanIoComponent implements OnInit {
  @ViewChild('capPhepPheDuyetTruLuongKhoanSanTabs', {static: false}) capPhepPheDuyetTruLuongKhoanSanTabs;
  @ViewChild("aside", { static: true }) public matSidenav: MatSidenav;
  @ViewChild("compio", { read: ViewContainerRef, static: true }) public content: ViewContainerRef;
  @ViewChild("giayPhepIOComp", { static: false }) giayPhepIOComp: GiayphepIoComponent;
  @ViewChild("taiLieuListComp", { static: false }) taiLieuListComp: GiaypheptailieuListComponent;
  @ViewChild("thongTinDangKyComp", { static: false }) thongtindangkyComp: CpPdtlksThongtinquyetdinhComponent;
  
  // @ViewChild("thongTinDangKyComp", { static: false }) thongTinDangKyComp: ThongtindangkyComponent;
  // Chứa dữ liệu menu item trên subheader
  public navArray = MenuCpPheDuyetTruLuongKhoangSanChitiet;

  // Chứa dữ liệu nút quay lại trên subheader
  public btnArray = ButtonBackCpPheDuyetTruLuongKhoangSan;

  public currentAction: number;

  public TabType = CpPheDuyetTruLuongKhoangSanTabEnum;

  public ActionType = GiayPhepActionEnum;

  private idgiayphep: string;

  public insertedState = InsertedState;

  public nhomLoaiCapPhepEnum = NhomLoaiCapPhepEnum;

  public nhomTaiLieuEnum = NhomTaiLieuEnum;

  // Chứa dữ liệu translate
  public dataTranslate: any;

  public loadedTabState: any = {
    [CpPheDuyetTruLuongKhoangSanTabEnum.ThongTinGiayPhep] : false,
    [CpPheDuyetTruLuongKhoangSanTabEnum.TaiLieuGiayPhepDinhKem] : false,
    [CpPheDuyetTruLuongKhoangSanTabEnum.ThongTinCapPhep] : false,
  };

  public disabledTabState: any = {
    [CpPheDuyetTruLuongKhoangSanTabEnum.ThongTinGiayPhep] : false,
    [CpPheDuyetTruLuongKhoangSanTabEnum.TaiLieuGiayPhepDinhKem] : true,
    [CpPheDuyetTruLuongKhoangSanTabEnum.ThongTinCapPhep] : true,
  };


  constructor(public matSidenavService: MatsidenavService,
              private activatedRoute: ActivatedRoute,
              private hoSoGiayToFacadeService: HoSoGiayToFacadeService,
              private translate: TranslateService) { }

  async ngOnInit() {
    this.activatedRoute.queryParamMap.subscribe((param: any) => {
      if (param && param.params && param.params.idgiayphep) {
        this.idgiayphep = param.params.idgiayphep;
        if(this.idgiayphep){
          this.disabledTabState[CpPheDuyetTruLuongKhoangSanTabEnum.ThongTinCapPhep]=false;
        }
      }
    });

    // Gọi hàm lấy dữ liệu translate
    await this.getDataTranslate();
    let existedCapPhepThamDo = false;

    if (this.idgiayphep !== DefaultValue.Null && this.idgiayphep !== DefaultValue.Undefined && this.idgiayphep.trim() !== DefaultValue.Empty) {
      const giayPhepItem = await this.getGiayPhepById(this.idgiayphep);

      if (giayPhepItem) {
        this.currentAction = GiayPhepActionEnum.Edit;
        this.setPheDuyetTruLuongKhoangSanDisabledTabState(this.currentAction);

        // const cpThamDoItem = await this.getCapPhepThamDoByIdGiayPhep(giayPhepItem.loaicapphep, this.idgiayphep);

        // if (cpThamDoItem) {
        //   existedCapPhepThamDo = true;
        // }
      } else {
        this.currentAction = GiayPhepActionEnum.None;
      }
    } else {
      this.currentAction = GiayPhepActionEnum.Add;
      this.setPheDuyetTruLuongKhoangSanDisabledTabState(this.currentAction);
    }

    // Khởi tạo dữ liệu ban đầu  cho form hoso
    this.giayPhepIOComp.idgiayphep = this.idgiayphep;
    await this.giayPhepIOComp.manualDataInit();
    this.giayPhepIOComp.currentAction = this.currentAction;
    this.giayPhepIOComp.disabledLoaiCapPhepSelectionState = existedCapPhepThamDo;
    this.capPhepPheDuyetTruLuongKhoanSanTabs.realignInkBar();
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
   * Lấy dữ liệu hồ sơ theo idGiayPhep
   * @param idGiayPhep
   */
  private async getGiayPhepById(idGiayPhep: string) {
    const giayPhepService = this.hoSoGiayToFacadeService.getGiayPhepService();
    const giayPhepItem = await giayPhepService.getByid(idGiayPhep).toPromise();
    return giayPhepItem;
  }

  /**
   * Lấy dữ liệu hồ sơ theo idGiayPhep
   * @param idGiayPhep
   */
  // private async getCapPhepThamDoByIdGiayPhep(loaiCapPhep: string, idHoSo: string) {
  //   if (loaiCapPhep === LoaiCapPhepEnum.ThamDoKhoangSan) {
  //     const dkThamDoKhoangSanService = this.dangKyHoatDongKhoangSanFacadeService.getDangKyThamDoKhoangSanService();
  //     const dangKyItem = await dkThamDoKhoangSanService.getDangKyThamDoByIdHoSo(idHoSo).toPromise();
  //     return dangKyItem;
  //   } else if (loaiCapPhep === LoaiCapPhepEnum.ThamDoGiaHan) {
  //     const dkThamDoKhoangSanService = this.dangKyHoatDongKhoangSanFacadeService.getDangKyThamDoGiaHanService();
  //     const dangKyItem = await dkThamDoKhoangSanService.getDangKyThamDoByIdHoSo(idHoSo).toPromise();
  //     return dangKyItem;
  //   }
  // }

  setPheDuyetTruLuongKhoangSanDisabledTabState(actionType: number) {
    switch(actionType) {
      case GiayPhepActionEnum.Add: {
        this.disabledTabState[CpPheDuyetTruLuongKhoangSanTabEnum.ThongTinGiayPhep] = true;
        this.disabledTabState[CpPheDuyetTruLuongKhoangSanTabEnum.TaiLieuGiayPhepDinhKem] = false;
        this.disabledTabState[CpPheDuyetTruLuongKhoangSanTabEnum.ThongTinCapPhep] = false;
        break;
      }
      case GiayPhepActionEnum.Edit: {
        this.disabledTabState[CpPheDuyetTruLuongKhoangSanTabEnum.ThongTinGiayPhep] = true;
        this.disabledTabState[CpPheDuyetTruLuongKhoangSanTabEnum.TaiLieuGiayPhepDinhKem] = true;
        this.disabledTabState[CpPheDuyetTruLuongKhoangSanTabEnum.ThongTinCapPhep] = true;
        break;
      }
      default: {
        this.disabledTabState[CpPheDuyetTruLuongKhoangSanTabEnum.ThongTinGiayPhep] = false;
        this.disabledTabState[CpPheDuyetTruLuongKhoangSanTabEnum.TaiLieuGiayPhepDinhKem] = false;
        this.disabledTabState[CpPheDuyetTruLuongKhoangSanTabEnum.ThongTinCapPhep] = false;
        break;
      }
    }
  }

  getGiayPhepIoFormState(action: number) {
    this.currentAction = action;
    this.setPheDuyetTruLuongKhoangSanDisabledTabState(this.currentAction);
  }

  getIdGiayPhep(id: string) {
    this.idgiayphep = id;
  }

  // getThongTinDangKyThamDoFormState(action: number) {
  //   if (action === DangKyThamDoActionEnum.Edit) {
  //     this.giayPhepIOComp.disabledLoaiCapPhepSelectionState = true;
  //   } else {
  //     this.giayPhepIOComp.disabledLoaiCapPhepSelectionState = false;
  //   }
  // }

  closeIOSidenav() {
    this.matSidenavService.close();
  }

  async tabChange(index: any) {
    if (index === CpPheDuyetTruLuongKhoangSanTabEnum.TaiLieuGiayPhepDinhKem && !this.loadedTabState[CpPheDuyetTruLuongKhoangSanTabEnum.TaiLieuGiayPhepDinhKem]) {
      this.taiLieuListComp.matSidenav = this.matSidenav;
      this.taiLieuListComp.content = this.content;
      this.taiLieuListComp.idgiayphep = this.idgiayphep;
      this.taiLieuListComp.title = this.dataTranslate.HOSOGIAYTO.tailieu.titleList;
      this.loadedTabState[CpPheDuyetTruLuongKhoangSanTabEnum.TaiLieuGiayPhepDinhKem]  =  await this.taiLieuListComp.manualDataInit();
    }
    else if(index === CpPheDuyetTruLuongKhoangSanTabEnum.ThongTinCapPhep && !this.loadedTabState[CpPheDuyetTruLuongKhoangSanTabEnum.ThongTinCapPhep]){
      this.thongtindangkyComp.matSidenav=this.matSidenav;
      this.thongtindangkyComp.content=this.content;
      // this.loadedTabState[CpPheDuyetTruLuongKhoangSanTabEnum.ThongTinCapPhep]  =  await this.thongtindangkyComp.manualDataInit();
    }
    // else if (index === ThamDoKhoangSanTabEnum.TaiLieuXuLyHoSoDinhKem && !this.loadedTabState[ThamDoKhoangSanTabEnum.TaiLieuXuLyHoSoDinhKem]) {
    //   this.taiLieuXuLyHoSoListComp.matSidenav = this.matSidenav;
    //   this.taiLieuXuLyHoSoListComp.content = this.content;
    //   this.taiLieuXuLyHoSoListComp.idhoso = this.idhoso;
    //   this.taiLieuXuLyHoSoListComp.title = this.dataTranslate.DANGKYHOATDONGKHOANGSAN.tailieu.titleList;
    //   this.loadedTabState[ThamDoKhoangSanTabEnum.TaiLieuXuLyHoSoDinhKem] = await this.taiLieuXuLyHoSoListComp.manualDataInit();
    // } else if (index === ThamDoKhoangSanTabEnum.ThongTinDangKy && !this.loadedTabState[ThamDoKhoangSanTabEnum.ThongTinDangKy]) {
    //   this.thongTinDangKyComp.matSidenav = this.matSidenav;
    //   this.thongTinDangKyComp.content = this.content;
    //   this.thongTinDangKyComp.idhoso = this.idhoso;
    //   this.loadedTabState[ThamDoKhoangSanTabEnum.ThongTinDangKy] = await this.thongTinDangKyComp.manualDataInit();
    // }
  }
}
