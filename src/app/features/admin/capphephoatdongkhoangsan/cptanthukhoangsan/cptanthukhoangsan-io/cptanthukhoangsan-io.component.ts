import {Component, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {MatSidenav} from '@angular/material';
import {ActivatedRoute} from '@angular/router';
import {
  CapPhepThamDoActionEnum,
  CpTanThuKhoangSanTabEnum,
  GiayPhepActionEnum,
  InsertedState,
  NhomTaiLieuEnum
} from 'src/app/shared/constants/enum';
import {MatsidenavService} from 'src/app/services/utilities/matsidenav.service';
import {NhomLoaiCapPhepEnum} from "src/app/shared/constants/nhomloaicapphep-constants";
import {GiayphepIoComponent} from 'src/app/features/admin/hosogiayto/giayphep/giayphep-io/giayphep-io.component';
import {HoSoGiayToFacadeService} from 'src/app/services/admin/hosogiayto/hosogiayto-facade.service';
import {
  ButtonBackCpTanThuKhoangSan,
  MenuCpTanThuKhoangSanChitiet
} from 'src/app/shared/constants/sub-menus/capphephoatdongkhoangsan/capphephoatdongkhoangsan';
import {DefaultValue} from 'src/app/shared/constants/global-var';
import {GiaypheptailieuListComponent} from 'src/app/features/admin/hosogiayto/giaypheptailieu/giaypheptailieu-list/giaypheptailieu-list.component';
import {CapPhepHoatDongKhoangSanFacadeService} from "src/app/services/admin/capphephoatdongkhoangsan/capphephoatdongkhoangsan-facade.service";
import {CpTtksThongtincapphepComponent} from "src/app/features/admin/capphephoatdongkhoangsan/cptanthukhoangsan/cp-ttks-thongtincapphep/cp-ttks-thongtincapphep.component";

@Component({
  selector: 'app-cptanthukhoangsan-io',
  templateUrl: './cptanthukhoangsan-io.component.html',
  styleUrls: ['./cptanthukhoangsan-io.component.scss']
})
export class CptanthukhoangsanIoComponent implements OnInit {
  @ViewChild('capPhepTanThuKhoangSanTabs', {static: false}) capPhepTanThuKhoangSanTabs;
  @ViewChild("aside", {static: true}) public matSidenav: MatSidenav;
  @ViewChild("compio", {read: ViewContainerRef, static: true}) public content: ViewContainerRef;
  @ViewChild("giayPhepIOComp", {static: false}) giayPhepIOComp: GiayphepIoComponent;
  @ViewChild("taiLieuListComp", {static: false}) taiLieuListComp: GiaypheptailieuListComponent;
 @ViewChild("thongTinCapPhepComp", {static: false}) thongTinCapPhepComp: CpTtksThongtincapphepComponent;
  // Chứa dữ liệu menu item trên subheader
  public navArray = MenuCpTanThuKhoangSanChitiet;

  // Chứa dữ liệu nút quay lại trên subheader
  public btnArray = ButtonBackCpTanThuKhoangSan;

  public currentAction: number;

  public TabType = CpTanThuKhoangSanTabEnum;

  public ActionType = GiayPhepActionEnum;

  private idgiayphep: string;

  public insertedState = InsertedState;

  public nhomLoaiCapPhepEnum = NhomLoaiCapPhepEnum;

  public nhomTaiLieuEnum = NhomTaiLieuEnum;

  // Chứa dữ liệu translate
  public dataTranslate: any;

  public loadedTabState: any = {
    [CpTanThuKhoangSanTabEnum.ThongTinGiayPhep]: false,
    [CpTanThuKhoangSanTabEnum.TaiLieuGiayPhepDinhKem]: false,
    [CpTanThuKhoangSanTabEnum.ThongTinCapPhep]: false,
  };

  public disabledTabState: any = {
    [CpTanThuKhoangSanTabEnum.ThongTinGiayPhep]: true,
    [CpTanThuKhoangSanTabEnum.TaiLieuGiayPhepDinhKem]: true,
    [CpTanThuKhoangSanTabEnum.ThongTinCapPhep]: true,
  };


  constructor(public matSidenavService: MatsidenavService,
              private activatedRoute: ActivatedRoute,
              private hoSoGiayToFacadeService: HoSoGiayToFacadeService,
              private capPhepHoatDongKhoangSanFacadeService: CapPhepHoatDongKhoangSanFacadeService,
              private translate: TranslateService) {
  }

  async ngOnInit() {
    this.activatedRoute.queryParamMap.subscribe((param: any) => {
      if (param && param.params && param.params.idgiayphep) {
        this.idgiayphep = param.params.idgiayphep;
      }
    });

    // Gọi hàm lấy dữ liệu translate
    await this.getDataTranslate();
    let existedCapPhepTanThu = false;

    if (this.idgiayphep !== DefaultValue.Null && this.idgiayphep !== DefaultValue.Undefined && this.idgiayphep.trim() !== DefaultValue.Empty) {
      const giayPhepItem = await this.getGiayPhepById(this.idgiayphep);

      if (giayPhepItem) {
        this.currentAction = GiayPhepActionEnum.Edit;
        this.setSanDisabledTabState(this.currentAction);

        const cpTanThuItem = await this.getCapPhepTanThuByIdGiayPhep(this.idgiayphep);

        if (cpTanThuItem) {
          existedCapPhepTanThu = true;
        }
      } else {
        this.currentAction = GiayPhepActionEnum.None;
      }
    } else {
      this.currentAction = GiayPhepActionEnum.Add;
      this.setSanDisabledTabState(this.currentAction);
    }

    // Khởi tạo dữ liệu ban đầu  cho form hoso
    this.giayPhepIOComp.idgiayphep = this.idgiayphep;
    await this.giayPhepIOComp.manualDataInit();
    this.giayPhepIOComp.currentAction = this.currentAction;
    this.giayPhepIOComp.disabledLoaiCapPhepSelectionState = existedCapPhepTanThu;
    this.capPhepTanThuKhoangSanTabs.selectedIndex = this.TabType.ThongTinGiayPhep;
    this.capPhepTanThuKhoangSanTabs.realignInkBar();
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
   * Lấy dữ liệu giấy phép theo idGiayPhep
   * @param idGiayPhep
   */
  private async getGiayPhepById(idGiayPhep: string) {
    const giayPhepService = this.hoSoGiayToFacadeService.getGiayPhepService();
    const giayPhepItem = await giayPhepService.getByid(idGiayPhep).toPromise();
    return giayPhepItem;
  }

  /**
   * Lấy dữ liệu cấp phép thăm dò theo idGiayPhep
   * @param idGiayPhep
   */
  private async getCapPhepTanThuByIdGiayPhep(idGiayPhep: string) {
    const cpTanThuKhoangSanService = this.capPhepHoatDongKhoangSanFacadeService.getCapPhepTanThuKhoangSanService();
    const capPhepItem = await cpTanThuKhoangSanService.getCapPhepTanThuByIdGiayPhep(idGiayPhep).toPromise();
    return capPhepItem;
  }

  setSanDisabledTabState(actionType: number) {
    switch (actionType) {
      case GiayPhepActionEnum.Add: {
        this.disabledTabState[CpTanThuKhoangSanTabEnum.ThongTinGiayPhep] = false;
        this.disabledTabState[CpTanThuKhoangSanTabEnum.TaiLieuGiayPhepDinhKem] = true;
        this.disabledTabState[CpTanThuKhoangSanTabEnum.ThongTinCapPhep] = true;
        break;
      }
      case GiayPhepActionEnum.Edit: {
        this.disabledTabState[CpTanThuKhoangSanTabEnum.ThongTinGiayPhep] = false;
        this.disabledTabState[CpTanThuKhoangSanTabEnum.TaiLieuGiayPhepDinhKem] = false;
        this.disabledTabState[CpTanThuKhoangSanTabEnum.ThongTinCapPhep] = false;
        break;
      }
      default: {
        this.disabledTabState[CpTanThuKhoangSanTabEnum.ThongTinGiayPhep] = true;
        this.disabledTabState[CpTanThuKhoangSanTabEnum.TaiLieuGiayPhepDinhKem] = true;
        this.disabledTabState[CpTanThuKhoangSanTabEnum.ThongTinCapPhep] = true;
        break;
      }
    }
  }

  private resetLoadedTabState() {
    this.loadedTabState[CpTanThuKhoangSanTabEnum.TaiLieuGiayPhepDinhKem] = false;
    this.loadedTabState[CpTanThuKhoangSanTabEnum.ThongTinCapPhep] = false;
  }

  getGiayPhepIoFormState(action: number) {
    this.currentAction = action;
    this.setSanDisabledTabState(this.currentAction);
    this.resetLoadedTabState();
  }

  getIdGiayPhep(id: string) {
    this.idgiayphep = id;
  }

  getThongTinCapPhepTanThuFormState(action: number) {
    if (action === CapPhepThamDoActionEnum.Edit) {
      this.giayPhepIOComp.disabledLoaiCapPhepSelectionState = true;
    } else {
      this.giayPhepIOComp.disabledLoaiCapPhepSelectionState = false;
    }
  }

  closeIOSidenav() {
    this.matSidenavService.close();
  }

  async tabChange(index: any) {
    if (index === CpTanThuKhoangSanTabEnum.TaiLieuGiayPhepDinhKem && !this.loadedTabState[CpTanThuKhoangSanTabEnum.TaiLieuGiayPhepDinhKem]) {
      this.taiLieuListComp.matSidenav = this.matSidenav;
      this.taiLieuListComp.content = this.content;
      this.taiLieuListComp.idgiayphep = this.idgiayphep;
      this.taiLieuListComp.title = this.dataTranslate.HOSOGIAYTO.tailieu.titleList;
      this.loadedTabState[CpTanThuKhoangSanTabEnum.TaiLieuGiayPhepDinhKem] = await this.taiLieuListComp.manualDataInit();
    } else if (index === CpTanThuKhoangSanTabEnum.ThongTinCapPhep && !this.loadedTabState[CpTanThuKhoangSanTabEnum.ThongTinCapPhep]) {
      this.thongTinCapPhepComp.matSidenav = this.matSidenav;
      this.thongTinCapPhepComp.content = this.content;
      this.thongTinCapPhepComp.idgiayphep = this.idgiayphep;
      this.loadedTabState[CpTanThuKhoangSanTabEnum.ThongTinCapPhep] = await this.thongTinCapPhepComp.manualDataInit();
    }
  }
}
