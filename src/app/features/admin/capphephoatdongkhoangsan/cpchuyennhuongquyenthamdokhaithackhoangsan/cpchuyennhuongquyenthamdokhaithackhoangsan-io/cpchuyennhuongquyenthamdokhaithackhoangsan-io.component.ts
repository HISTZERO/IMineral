import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MatSidenav } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { InsertedState, NhomTaiLieuEnum, GiayPhepActionEnum, CpChuyenNhuongQuyenThamDoKhoangSanTabEnum, LoaiCapPhepEnum, CpChuyenNhuongThamDoKhaiThacActionEnum, CpChuyenNhuongThamDoKhaiThacChiTietTabEnum } from 'src/app/shared/constants/enum';
import { MatsidenavService } from 'src/app/services/utilities/matsidenav.service';
import { NhomLoaiCapPhepEnum } from "src/app/shared/constants/nhomloaicapphep-constants";
import { GiayphepIoComponent } from 'src/app/features/admin/hosogiayto/giayphep/giayphep-io/giayphep-io.component';
import { HoSoGiayToFacadeService } from 'src/app/services/admin/hosogiayto/hosogiayto-facade.service';
import { ButtonBackCpChuyenNhuongQuyenThamDoKhaiThacKhoangSan, MenuCpChuyenNhuongQuyenThamDoKhaiThacKhoangSan } from 'src/app/shared/constants/sub-menus/capphephoatdongkhoangsan/capphephoatdongkhoangsan';
import { DefaultValue } from 'src/app/shared/constants/global-var';
import { GiaypheptailieuListComponent } from 'src/app/features/admin/hosogiayto/giaypheptailieu/giaypheptailieu-list/giaypheptailieu-list.component';
import { CpTdksThongtincapphepComponent } from "../../cpthamdokhoangsan/cp-tdks-thongtincapphep/cp-tdks-thongtincapphep.component";
import { CapPhepHoatDongKhoangSanFacadeService } from "../../../../../services/admin/capphephoatdongkhoangsan/capphephoatdongkhoangsan-facade.service";
import { CpKtksThongtincapphepComponent } from '../../cpkhaithackhoangsan/cp-ktks-thongtincapphep/cp-ktks-thongtincapphep.component';
@Component({
  selector: 'app-cpchuyennhuongquyenthamdokhaithackhoangsan-io',
  templateUrl: './cpchuyennhuongquyenthamdokhaithackhoangsan-io.component.html',
  styleUrls: ['./cpchuyennhuongquyenthamdokhaithackhoangsan-io.component.scss']
})
export class CpchuyennhuongquyenthamdokhaithackhoangsanIoComponent implements OnInit {
  @ViewChild('capPhepChuyenNhuongQuyenThamDoKhaiThacKhoanSanTabs', { static: false }) capPhepChuyenNhuongQuyenThamDoKhaiThacKhoanSanTabs;
  @ViewChild("aside", { static: true }) public matSidenav: MatSidenav;
  @ViewChild("compio", { read: ViewContainerRef, static: true }) public content: ViewContainerRef;
  @ViewChild("giayPhepIOComp", { static: false }) giayPhepIOComp: GiayphepIoComponent;
  @ViewChild("taiLieuListComp", { static: false }) taiLieuListComp: GiaypheptailieuListComponent;
  @ViewChild("thongTinCapPhepChuyenNhuongThamDoComp", { static: false }) thongTinCapPhepChuyenNhuongThamDoComp: CpTdksThongtincapphepComponent;
  @ViewChild("thongTinCapPhepChuyenNhuongKhaiThacComp", { static: false }) thongTinCapPhepChuyenNhuongKhaiThacComp: CpKtksThongtincapphepComponent;
  // Chứa dữ liệu menu item trên subheader
  public navArray = MenuCpChuyenNhuongQuyenThamDoKhaiThacKhoangSan;

  // Chứa dữ liệu nút quay lại trên subheader
  public btnArray = ButtonBackCpChuyenNhuongQuyenThamDoKhaiThacKhoangSan;

  public currentAction: number;

  public TabType = CpChuyenNhuongQuyenThamDoKhoangSanTabEnum;

  public ActionType = GiayPhepActionEnum;

  private idgiayphep: string;

  public insertedState = InsertedState;

  public nhomLoaiCapPhepEnum = NhomLoaiCapPhepEnum;

  public nhomTaiLieuEnum = NhomTaiLieuEnum;

  public showTabThongTin: boolean = false;

  public isKhaiThac:boolean=false;
  public isThamDo:boolean=false;
  // Chứa dữ liệu translate
  public dataTranslate: any;

  public loadedTabState: any = {
    [CpChuyenNhuongQuyenThamDoKhoangSanTabEnum.ThongTinGiayPhep]: false,
    [CpChuyenNhuongQuyenThamDoKhoangSanTabEnum.TaiLieuGiayPhepDinhKem]: false,
    [CpChuyenNhuongQuyenThamDoKhoangSanTabEnum.ThongTinCapPhep]: false,
  };

  public disabledTabState: any = {
    [CpChuyenNhuongQuyenThamDoKhoangSanTabEnum.ThongTinGiayPhep]: false,
    [CpChuyenNhuongQuyenThamDoKhoangSanTabEnum.TaiLieuGiayPhepDinhKem]: false,
    [CpChuyenNhuongQuyenThamDoKhoangSanTabEnum.ThongTinCapPhep]: false,
  };


  constructor(public matSidenavService: MatsidenavService,
    private activatedRoute: ActivatedRoute,
    private hoSoGiayToFacadeService: HoSoGiayToFacadeService,
    private capPhepHoatDongKhoangSanFacadeService: CapPhepHoatDongKhoangSanFacadeService,
    private translate: TranslateService) { }

  async ngOnInit() {
    this.activatedRoute.queryParamMap.subscribe((param: any) => {
      if (param && param.params && param.params.idgiayphep) {
        this.idgiayphep = param.params.idgiayphep;
      }
    });

    // Gọi hàm lấy dữ liệu translate
    await this.getDataTranslate();
    let existedCapPhepThamDo = false;

    if (this.idgiayphep !== DefaultValue.Null && this.idgiayphep !== DefaultValue.Undefined && this.idgiayphep.trim() !== DefaultValue.Empty) {
      const giayPhepItem = await this.getGiayPhepById(this.idgiayphep);

      if (giayPhepItem) {
        this.currentAction = GiayPhepActionEnum.Edit;
        this.setChuyenNhuongGiayPhepThamDoKhoangSanDisabledTabState(this.currentAction);

        if (giayPhepItem.loaicapphep === LoaiCapPhepEnum.ChuyenNhuongQuyenKhaiThacKhoangSan || giayPhepItem.loaicapphep === LoaiCapPhepEnum.ChuyenNhuongQuyenThamDoKhoangSan) {
          this.showTabThongTin = true;
          if(giayPhepItem.loaicapphep === LoaiCapPhepEnum.ChuyenNhuongQuyenKhaiThacKhoangSan){
            this.isKhaiThac = true;
          }
          if(giayPhepItem.loaicapphep === LoaiCapPhepEnum.ChuyenNhuongQuyenThamDoKhoangSan){
            this.isThamDo = true;

          }
        } else {
          this.showTabThongTin = false;
        }

        const cpThamDoKhaiThacItem = await this.getCapPhepThamDoKhaiThacByIdGiayPhep(this.idgiayphep);

        console.log(cpThamDoKhaiThacItem);
        if (cpThamDoKhaiThacItem) {
          existedCapPhepThamDo = true;
        }
      } else {
        this.currentAction = GiayPhepActionEnum.None;
      }
    } else {
      this.currentAction = GiayPhepActionEnum.Add;
      this.setChuyenNhuongGiayPhepThamDoKhoangSanDisabledTabState(this.currentAction);
    }

    // Khởi tạo dữ liệu ban đầu  cho form hoso
    this.giayPhepIOComp.idgiayphep = this.idgiayphep;
    await this.giayPhepIOComp.manualDataInit();
    this.giayPhepIOComp.currentAction = this.currentAction;
    this.giayPhepIOComp.disabledLoaiCapPhepSelectionState = existedCapPhepThamDo;
    this.capPhepChuyenNhuongQuyenThamDoKhaiThacKhoanSanTabs.realignInkBar();
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
  private async getCapPhepThamDoKhaiThacByIdGiayPhep(idGiayPhep: string) {

    if (this.isThamDo) {
      const cpThamDoKhoangSanService = this.capPhepHoatDongKhoangSanFacadeService.getCapPhepThamDoKhoangSanService();
      const capPhepItem = await cpThamDoKhoangSanService.getCapPhepThamDoByIdGiayPhep(idGiayPhep).toPromise();
      //console.log("ThamDo");
      return capPhepItem;
    } else if (this.isKhaiThac) {
      const cpKhaiThacKhoangSanService = this.capPhepHoatDongKhoangSanFacadeService.getCapPhepKhaiThacKhoangSanService();
      const capPhepItem = await cpKhaiThacKhoangSanService.getCapPhepKhaiThacByIdGiayPhep(idGiayPhep).toPromise();
      //console.log("Khaithac");
      
      return capPhepItem;
    }
  }

  setChuyenNhuongGiayPhepThamDoKhoangSanDisabledTabState(actionType: number) {
    switch (actionType) {
      case GiayPhepActionEnum.Add: {
        this.disabledTabState[CpChuyenNhuongQuyenThamDoKhoangSanTabEnum.ThongTinGiayPhep] = true;
        this.disabledTabState[CpChuyenNhuongQuyenThamDoKhoangSanTabEnum.TaiLieuGiayPhepDinhKem] = false;
        this.disabledTabState[CpChuyenNhuongQuyenThamDoKhoangSanTabEnum.ThongTinCapPhep] = false;
        break;
      }
      case GiayPhepActionEnum.Edit: {
        this.disabledTabState[CpChuyenNhuongQuyenThamDoKhoangSanTabEnum.ThongTinGiayPhep] = true;
        this.disabledTabState[CpChuyenNhuongQuyenThamDoKhoangSanTabEnum.TaiLieuGiayPhepDinhKem] = true;
        this.disabledTabState[CpChuyenNhuongQuyenThamDoKhoangSanTabEnum.ThongTinCapPhep] = true;
        break;
      }
      default: {
        this.disabledTabState[CpChuyenNhuongQuyenThamDoKhoangSanTabEnum.ThongTinGiayPhep] = false;
        this.disabledTabState[CpChuyenNhuongQuyenThamDoKhoangSanTabEnum.TaiLieuGiayPhepDinhKem] = false;
        this.disabledTabState[CpChuyenNhuongQuyenThamDoKhoangSanTabEnum.ThongTinCapPhep] = false;
        break;
      }
    }
  }

  getGiayPhepIoFormState(action: number) {
    this.currentAction = action;
    this.setChuyenNhuongGiayPhepThamDoKhoangSanDisabledTabState(this.currentAction);
  }

  getIdGiayPhep(id: string) {
    this.idgiayphep = id;
  }

  getThongTinCapPhepChuyenNhuongFormState(action: number) {
    if (action === GiayPhepActionEnum.Edit) {
      this.giayPhepIOComp.disabledLoaiCapPhepSelectionState = true;
    } else {
      this.giayPhepIOComp.disabledLoaiCapPhepSelectionState = false;
    }
  }

  closeIOSidenav() {
    this.matSidenavService.close();
  }

  async tabChange(index: any) {
    if (index === CpChuyenNhuongQuyenThamDoKhoangSanTabEnum.TaiLieuGiayPhepDinhKem && !this.loadedTabState[CpChuyenNhuongQuyenThamDoKhoangSanTabEnum.TaiLieuGiayPhepDinhKem]) {
      this.taiLieuListComp.matSidenav = this.matSidenav;
      this.taiLieuListComp.content = this.content;
      this.taiLieuListComp.idgiayphep = this.idgiayphep;
      this.taiLieuListComp.title = this.dataTranslate.HOSOGIAYTO.tailieu.titleList;
      this.loadedTabState[CpChuyenNhuongQuyenThamDoKhoangSanTabEnum.TaiLieuGiayPhepDinhKem] = await this.taiLieuListComp.manualDataInit();
    } else if (index === CpChuyenNhuongQuyenThamDoKhoangSanTabEnum.ThongTinCapPhep && !this.loadedTabState[CpChuyenNhuongQuyenThamDoKhoangSanTabEnum.ThongTinCapPhep]) {
      if (this.isThamDo) {
        this.thongTinCapPhepChuyenNhuongThamDoComp.matSidenav = this.matSidenav;
        this.thongTinCapPhepChuyenNhuongThamDoComp.content = this.content;
        this.thongTinCapPhepChuyenNhuongThamDoComp.idgiayphep = this.idgiayphep;
        this.loadedTabState[CpChuyenNhuongQuyenThamDoKhoangSanTabEnum.ThongTinCapPhep] = await this.thongTinCapPhepChuyenNhuongThamDoComp.manualDataInit();
      }
      if (this.isKhaiThac) {
        this.thongTinCapPhepChuyenNhuongKhaiThacComp.matSidenav = this.matSidenav;
        this.thongTinCapPhepChuyenNhuongKhaiThacComp.content = this.content;
        this.thongTinCapPhepChuyenNhuongKhaiThacComp.idgiayphep = this.idgiayphep;
        this.loadedTabState[CpChuyenNhuongQuyenThamDoKhoangSanTabEnum.ThongTinCapPhep] = await this.thongTinCapPhepChuyenNhuongKhaiThacComp.manualDataInit();
      }
    }
  }
}
