import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MatSidenav } from '@angular/material';
import { ActivatedRoute } from '@angular/router';

import { InsertedState, NhomTaiLieuEnum, GiayPhepActionEnum, CpDongCuaMoKhoangSanTabEnum, DangKyThamDoActionEnum, LoaiCapPhepEnum } from 'src/app/shared/constants/enum';
import { MatsidenavService } from 'src/app/services/utilities/matsidenav.service';
import { NhomLoaiCapPhepEnum } from "src/app/shared/constants/nhomloaicapphep-constants";
import { GiayphepIoComponent } from 'src/app/features/admin/hosogiayto/giayphep/giayphep-io/giayphep-io.component';
import { HoSoGiayToFacadeService } from 'src/app/services/admin/hosogiayto/hosogiayto-facade.service';
import { ButtonBackCpDongCuaMoKhoangSan, MenuCpDongCuaMoKhoangSanChitiet } from 'src/app/shared/constants/sub-menus/capphephoatdongkhoangsan/capphephoatdongkhoangsan';
import { DefaultValue } from 'src/app/shared/constants/global-var';
import { GiaypheptailieuListComponent } from 'src/app/features/admin/hosogiayto/giaypheptailieu/giaypheptailieu-list/giaypheptailieu-list.component';
import { CpKtksThongtincapphepComponent } from "src/app/features/admin/capphephoatdongkhoangsan/cpkhaithackhoangsan/cp-ktks-thongtincapphep/cp-ktks-thongtincapphep.component";
import { CapPhepHoatDongKhoangSanFacadeService } from "src/app/services/admin/capphephoatdongkhoangsan/capphephoatdongkhoangsan-facade.service";

@Component({
  selector: 'app-cpdongcuamokhoangsan-io',
  templateUrl: './cpdongcuamokhoangsan-io.component.html',
  styleUrls: ['./cpdongcuamokhoangsan-io.component.scss']
})
export class CpdongcuamokhoangsanIoComponent implements OnInit {
  @ViewChild('capPhepDongCuaMoKhoanSanTabs', { static: false }) capPhepDongCuaMoKhoanSanTabs;
  @ViewChild("aside", { static: true }) public matSidenav: MatSidenav;
  @ViewChild("compio", { read: ViewContainerRef, static: true }) public content: ViewContainerRef;
  @ViewChild("giayPhepIOComp", { static: false }) giayPhepIOComp: GiayphepIoComponent;
  @ViewChild("taiLieuListComp", { static: false }) taiLieuListComp: GiaypheptailieuListComponent;
  @ViewChild("thongTinCapPhepComp", { static: false }) thongTinCapPhepComp: CpKtksThongtincapphepComponent;
  // Chứa dữ liệu menu item trên subheader
  public navArray = MenuCpDongCuaMoKhoangSanChitiet;

  // Chứa dữ liệu nút quay lại trên subheader
  public btnArray = ButtonBackCpDongCuaMoKhoangSan;

  public currentAction: number;

  public TabType = CpDongCuaMoKhoangSanTabEnum;

  public ActionType = GiayPhepActionEnum;

  private idgiayphep: string;

  public insertedState = InsertedState;

  public nhomLoaiCapPhepEnum = NhomLoaiCapPhepEnum;

  public nhomTaiLieuEnum = NhomTaiLieuEnum;

  // Chứa dữ liệu translate
  public dataTranslate: any;

  public loadedTabState: any = {
    [CpDongCuaMoKhoangSanTabEnum.ThongTinGiayPhep]: false,
    [CpDongCuaMoKhoangSanTabEnum.TaiLieuGiayPhepDinhKem]: false,
    [CpDongCuaMoKhoangSanTabEnum.ThongTinCapPhep]: false,
  };

  public disabledTabState: any = {
    [CpDongCuaMoKhoangSanTabEnum.ThongTinGiayPhep]: false,
    [CpDongCuaMoKhoangSanTabEnum.TaiLieuGiayPhepDinhKem]: false,
    [CpDongCuaMoKhoangSanTabEnum.ThongTinCapPhep]: false,
  };


  constructor(
    public matSidenavService: MatsidenavService,
    private activatedRoute: ActivatedRoute,
    private hoSoGiayToFacadeService: HoSoGiayToFacadeService,
    private translate: TranslateService,
    private capPhepHoatDongKhoangSanFacadeService: CapPhepHoatDongKhoangSanFacadeService
  ) { }

  async ngOnInit() {
    this.activatedRoute.queryParamMap.subscribe((param: any) => {
      if (param && param.params && param.params.idgiayphep) {
        this.idgiayphep = param.params.idgiayphep;
      }
    });

    // Gọi hàm lấy dữ liệu translate
    await this.getDataTranslate();
    let existedCapPhepDongCuaMo = false;

    if (this.idgiayphep !== DefaultValue.Null && this.idgiayphep !== DefaultValue.Undefined && this.idgiayphep.trim() !== DefaultValue.Empty) {
      const giayPhepItem = await this.getGiayPhepById(this.idgiayphep);

      if (giayPhepItem) {
        this.currentAction = GiayPhepActionEnum.Edit;
        this.setDongCuaMoKhoangSanDisabledTabState(this.currentAction);

        const cpThamDoItem = await this.getCapPhepDongCuaMoByIdGiayPhep(this.idgiayphep);

        if (cpThamDoItem) {
          existedCapPhepDongCuaMo = true;
        }
      } else {
        this.currentAction = GiayPhepActionEnum.None;
      }
    } else {
      this.currentAction = GiayPhepActionEnum.Add;
      this.setDongCuaMoKhoangSanDisabledTabState(this.currentAction);
    }

    // Khởi tạo dữ liệu ban đầu  cho form hoso
    this.giayPhepIOComp.idgiayphep = this.idgiayphep;
    await this.giayPhepIOComp.manualDataInit();
    this.giayPhepIOComp.currentAction = this.currentAction;
    this.giayPhepIOComp.disabledLoaiCapPhepSelectionState = existedCapPhepDongCuaMo;
    this.capPhepDongCuaMoKhoanSanTabs.realignInkBar();
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
  private async getCapPhepDongCuaMoByIdGiayPhep(idGiayPhep: string) {
    const cpKhaiThacKhoangSanService = this.capPhepHoatDongKhoangSanFacadeService.getCapPhepKhaiThacKhoangSanService();
    const capPhepItem = await cpKhaiThacKhoangSanService.getCapPhepKhaiThacByIdGiayPhep(idGiayPhep).toPromise();
    return capPhepItem;
  }

  setDongCuaMoKhoangSanDisabledTabState(actionType: number) {
    switch (actionType) {
      case GiayPhepActionEnum.Add: {
        this.disabledTabState[CpDongCuaMoKhoangSanTabEnum.ThongTinGiayPhep] = true;
        this.disabledTabState[CpDongCuaMoKhoangSanTabEnum.TaiLieuGiayPhepDinhKem] = false;
        this.disabledTabState[CpDongCuaMoKhoangSanTabEnum.ThongTinCapPhep] = false;
        break;
      }
      case GiayPhepActionEnum.Edit: {
        this.disabledTabState[CpDongCuaMoKhoangSanTabEnum.ThongTinGiayPhep] = true;
        this.disabledTabState[CpDongCuaMoKhoangSanTabEnum.TaiLieuGiayPhepDinhKem] = true;
        this.disabledTabState[CpDongCuaMoKhoangSanTabEnum.ThongTinCapPhep] = true;
        break;
      }
      default: {
        this.disabledTabState[CpDongCuaMoKhoangSanTabEnum.ThongTinGiayPhep] = false;
        this.disabledTabState[CpDongCuaMoKhoangSanTabEnum.TaiLieuGiayPhepDinhKem] = false;
        this.disabledTabState[CpDongCuaMoKhoangSanTabEnum.ThongTinCapPhep] = false;
        break;
      }
    }
  }

  getGiayPhepIoFormState(action: number) {
    this.currentAction = action;
    this.setDongCuaMoKhoangSanDisabledTabState(this.currentAction);
  }

  getIdGiayPhep(id: string) {
    this.idgiayphep = id;
  }

  getThongTinCapPhepDongCuaMoFormState(action: number) {
    if (action === DangKyThamDoActionEnum.Edit) {
      this.giayPhepIOComp.disabledLoaiCapPhepSelectionState = true;
    } else {
      this.giayPhepIOComp.disabledLoaiCapPhepSelectionState = false;
    }
  }

  closeIOSidenav() {
    this.matSidenavService.close();
  }

  async tabChange(index: any) {
    if (index === CpDongCuaMoKhoangSanTabEnum.TaiLieuGiayPhepDinhKem && !this.loadedTabState[CpDongCuaMoKhoangSanTabEnum.TaiLieuGiayPhepDinhKem]) {
      this.taiLieuListComp.matSidenav = this.matSidenav;
      this.taiLieuListComp.content = this.content;
      this.taiLieuListComp.idgiayphep = this.idgiayphep;
      this.taiLieuListComp.title = this.dataTranslate.HOSOGIAYTO.tailieu.titleList;
      this.loadedTabState[CpDongCuaMoKhoangSanTabEnum.TaiLieuGiayPhepDinhKem] = await this.taiLieuListComp.manualDataInit();
    }
    else if (index === CpDongCuaMoKhoangSanTabEnum.TaiLieuGiayPhepDinhKem && !this.loadedTabState[CpDongCuaMoKhoangSanTabEnum.TaiLieuGiayPhepDinhKem]) {
      this.taiLieuListComp.matSidenav = this.matSidenav;
      this.taiLieuListComp.content = this.content;
      this.taiLieuListComp.idgiayphep = this.idgiayphep;
      this.taiLieuListComp.title = this.dataTranslate.DANGKYHOATDONGKHOANGSAN.tailieu.titleList;
      this.loadedTabState[CpDongCuaMoKhoangSanTabEnum.TaiLieuGiayPhepDinhKem] = await this.taiLieuListComp.manualDataInit();
    } else if (index === CpDongCuaMoKhoangSanTabEnum.ThongTinCapPhep && !this.loadedTabState[CpDongCuaMoKhoangSanTabEnum.ThongTinCapPhep]) {
      this.thongTinCapPhepComp.matSidenav = this.matSidenav;
      this.thongTinCapPhepComp.content = this.content;
      this.thongTinCapPhepComp.idgiayphep = this.idgiayphep;
      this.loadedTabState[CpDongCuaMoKhoangSanTabEnum.ThongTinCapPhep] = await this.thongTinCapPhepComp.manualDataInit();
    }
  }
}
