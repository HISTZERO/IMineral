import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MatSidenav } from '@angular/material';
import { ActivatedRoute } from '@angular/router';

import { InsertedState, NhomTaiLieuEnum, GiayPhepActionEnum, CpTraLaiGiayPhepThamDoKhoangSanTabEnum, LoaiCapPhepEnum } from 'src/app/shared/constants/enum';
import { MatsidenavService } from 'src/app/services/utilities/matsidenav.service';
import { NhomLoaiCapPhepEnum } from "src/app/shared/constants/nhomloaicapphep-constants";
import { GiayphepIoComponent } from 'src/app/features/admin/hosogiayto/giayphep/giayphep-io/giayphep-io.component';
import { HoSoGiayToFacadeService } from 'src/app/services/admin/hosogiayto/hosogiayto-facade.service';
import { ButtonBackCpTraLaiGiayPhepThamDoKhaiThacKhoangSan, MenuCpTraLaiGiayPhepThamDoKhaiThacKhoangSanChitiet } from 'src/app/shared/constants/sub-menus/capphephoatdongkhoangsan/capphephoatdongkhoangsan';
import { DefaultValue } from 'src/app/shared/constants/global-var';
import { GiaypheptailieuListComponent } from 'src/app/features/admin/hosogiayto/giaypheptailieu/giaypheptailieu-list/giaypheptailieu-list.component';
import { CpTdksThongtincapphepComponent } from "../../cpthamdokhoangsan/cp-tdks-thongtincapphep/cp-tdks-thongtincapphep.component";
import { CapPhepHoatDongKhoangSanFacadeService } from "../../../../../services/admin/capphephoatdongkhoangsan/capphephoatdongkhoangsan-facade.service";
import { CpKtksThongtincapphepComponent } from "../../cpkhaithackhoangsan/cp-ktks-thongtincapphep/cp-ktks-thongtincapphep.component";

@Component({
  selector: 'app-cptralaigiayphepthamdokhaithackhoangsan-io',
  templateUrl: './cptralaigiayphepthamdokhaithackhoangsan-io.component.html',
  styleUrls: ['./cptralaigiayphepthamdokhaithackhoangsan-io.component.scss']
})
export class CptralaigiayphepthamdokhaithackhoangsanIoComponent implements OnInit {
  @ViewChild('capPhepTraLaiGiayPhepThamDoKhaiThacKhoanSanTabs', { static: false }) capPhepTraLaiGiayPhepThamDoKhaiThacKhoanSanTabs;
  @ViewChild("aside", { static: true }) public matSidenav: MatSidenav;
  @ViewChild("compio", { read: ViewContainerRef, static: true }) public content: ViewContainerRef;
  @ViewChild("giayPhepIOComp", { static: false }) giayPhepIOComp: GiayphepIoComponent;
  @ViewChild("taiLieuListComp", { static: false }) taiLieuListComp: GiaypheptailieuListComponent;
  @ViewChild("thongTinCapPhepComp", { static: false }) thongTinCapPhepComp: CpTdksThongtincapphepComponent;
  @ViewChild("thongTinCapPhepKTComp", { static: false }) thongTinCapPhepKTComp: CpKtksThongtincapphepComponent;

  // Chứa dữ liệu menu item trên subheader
  public navArray = MenuCpTraLaiGiayPhepThamDoKhaiThacKhoangSanChitiet;

  // Chứa dữ liệu nút quay lại trên subheader
  public btnArray = ButtonBackCpTraLaiGiayPhepThamDoKhaiThacKhoangSan;

  public currentAction: number;

  public TabType = CpTraLaiGiayPhepThamDoKhoangSanTabEnum;

  public ActionType = GiayPhepActionEnum;

  private idgiayphep: string;

  public insertedState = InsertedState;

  public nhomLoaiCapPhepEnum = NhomLoaiCapPhepEnum;

  public nhomTaiLieuEnum = NhomTaiLieuEnum;

  public showTabThongTin: boolean = false;

  public isThamDo: boolean = false;

  public isKhaiThac: boolean = false;

  // Chứa dữ liệu translate
  public dataTranslate: any;

  public loadedTabState: any = {
    [CpTraLaiGiayPhepThamDoKhoangSanTabEnum.ThongTinGiayPhep]: false,
    [CpTraLaiGiayPhepThamDoKhoangSanTabEnum.TaiLieuGiayPhepDinhKem]: false,
    [CpTraLaiGiayPhepThamDoKhoangSanTabEnum.ThongTinCapPhep]: false,
  };

  public disabledTabState: any = {
    [CpTraLaiGiayPhepThamDoKhoangSanTabEnum.ThongTinGiayPhep]: false,
    [CpTraLaiGiayPhepThamDoKhoangSanTabEnum.TaiLieuGiayPhepDinhKem]: false,
    [CpTraLaiGiayPhepThamDoKhoangSanTabEnum.ThongTinCapPhep]: false,
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
        this.setTraLaiGiayPhepThamDoKhoangSanDisabledTabState(this.currentAction);

        if (giayPhepItem.loaicapphep === LoaiCapPhepEnum.TraLaiMotPhanDienTichKhuVucKhaiThacKhoangSan || giayPhepItem.loaicapphep === LoaiCapPhepEnum.TraLaiMotPhanDienTichKhuVucThamDoKhoangSan) {
          this.showTabThongTin = true;
          if (giayPhepItem.loaicapphep === LoaiCapPhepEnum.TraLaiMotPhanDienTichKhuVucKhaiThacKhoangSan) {
            this.isKhaiThac = true;
          }
          if (giayPhepItem.loaicapphep === LoaiCapPhepEnum.TraLaiMotPhanDienTichKhuVucThamDoKhoangSan) {
            this.isThamDo = true;
          }
        } else {
          this.showTabThongTin = false;
        }

        const cpThamDoItem = await this.getCapPhepThamDoByIdGiayPhep(this.idgiayphep);

        if (cpThamDoItem) {
          existedCapPhepThamDo = true;
        }
      } else {
        this.currentAction = GiayPhepActionEnum.None;
      }
    } else {
      this.currentAction = GiayPhepActionEnum.Add;
      this.setTraLaiGiayPhepThamDoKhoangSanDisabledTabState(this.currentAction);
    }

    // Khởi tạo dữ liệu ban đầu  cho form hoso
    this.giayPhepIOComp.idgiayphep = this.idgiayphep;
    await this.giayPhepIOComp.manualDataInit();
    this.giayPhepIOComp.currentAction = this.currentAction;
    this.giayPhepIOComp.disabledLoaiCapPhepSelectionState = existedCapPhepThamDo;
    this.capPhepTraLaiGiayPhepThamDoKhaiThacKhoanSanTabs.realignInkBar();
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
  private async getCapPhepThamDoByIdGiayPhep(idGiayPhep: string) {
    if (idGiayPhep === LoaiCapPhepEnum.TraLaiMotPhanDienTichKhuVucThamDoKhoangSan) {
      const cpThamDoKhoangSanService = this.capPhepHoatDongKhoangSanFacadeService.getCapPhepThamDoKhoangSanService();
      const capPhepItem = await cpThamDoKhoangSanService.getCapPhepThamDoByIdGiayPhep(idGiayPhep).toPromise();
      return capPhepItem;
    } else if (idGiayPhep === LoaiCapPhepEnum.TraLaiMotPhanDienTichKhuVucKhaiThacKhoangSan) {
      const cpKhaiThacKhoangSanService = this.capPhepHoatDongKhoangSanFacadeService.getCapPhepKhaiThacKhoangSanService();
      const capPhepItem = await cpKhaiThacKhoangSanService.getCapPhepKhaiThacByIdGiayPhep(idGiayPhep).toPromise();
      return capPhepItem;
    }
  }

  setTraLaiGiayPhepThamDoKhoangSanDisabledTabState(actionType: number) {
    switch (actionType) {
      case GiayPhepActionEnum.Add: {
        this.disabledTabState[CpTraLaiGiayPhepThamDoKhoangSanTabEnum.ThongTinGiayPhep] = true;
        this.disabledTabState[CpTraLaiGiayPhepThamDoKhoangSanTabEnum.TaiLieuGiayPhepDinhKem] = false;
        this.disabledTabState[CpTraLaiGiayPhepThamDoKhoangSanTabEnum.ThongTinCapPhep] = false;
        break;
      }
      case GiayPhepActionEnum.Edit: {
        this.disabledTabState[CpTraLaiGiayPhepThamDoKhoangSanTabEnum.ThongTinGiayPhep] = true;
        this.disabledTabState[CpTraLaiGiayPhepThamDoKhoangSanTabEnum.TaiLieuGiayPhepDinhKem] = true;
        this.disabledTabState[CpTraLaiGiayPhepThamDoKhoangSanTabEnum.ThongTinCapPhep] = true;
        break;
      }
      default: {
        this.disabledTabState[CpTraLaiGiayPhepThamDoKhoangSanTabEnum.ThongTinGiayPhep] = false;
        this.disabledTabState[CpTraLaiGiayPhepThamDoKhoangSanTabEnum.TaiLieuGiayPhepDinhKem] = false;
        this.disabledTabState[CpTraLaiGiayPhepThamDoKhoangSanTabEnum.ThongTinCapPhep] = false;
        break;
      }
    }
  }

  getGiayPhepIoFormState(action: number) {
    this.currentAction = action;
    this.setTraLaiGiayPhepThamDoKhoangSanDisabledTabState(this.currentAction);
  }

  getIdGiayPhep(id: string) {
    this.idgiayphep = id;
  }

  getThongTinCapPhepTraLaiFormState(action: number) {
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
    if (index === CpTraLaiGiayPhepThamDoKhoangSanTabEnum.TaiLieuGiayPhepDinhKem && !this.loadedTabState[CpTraLaiGiayPhepThamDoKhoangSanTabEnum.TaiLieuGiayPhepDinhKem]) {
      this.taiLieuListComp.matSidenav = this.matSidenav;
      this.taiLieuListComp.content = this.content;
      this.taiLieuListComp.idgiayphep = this.idgiayphep;
      this.taiLieuListComp.title = this.dataTranslate.HOSOGIAYTO.tailieu.titleList;
      this.loadedTabState[CpTraLaiGiayPhepThamDoKhoangSanTabEnum.TaiLieuGiayPhepDinhKem] = await this.taiLieuListComp.manualDataInit();
    } else if (index === CpTraLaiGiayPhepThamDoKhoangSanTabEnum.ThongTinCapPhep && !this.loadedTabState[CpTraLaiGiayPhepThamDoKhoangSanTabEnum.ThongTinCapPhep]) {
      if (this.isKhaiThac) {
        this.thongTinCapPhepKTComp.matSidenav = this.matSidenav;
        this.thongTinCapPhepKTComp.content = this.content;
        this.thongTinCapPhepKTComp.idgiayphep = this.idgiayphep;
        this.loadedTabState[CpTraLaiGiayPhepThamDoKhoangSanTabEnum.ThongTinCapPhep] = await this.thongTinCapPhepKTComp.manualDataInit();
      }
      if (this.isThamDo) {
        this.thongTinCapPhepComp.matSidenav = this.matSidenav;
        this.thongTinCapPhepComp.content = this.content;
        this.thongTinCapPhepComp.idgiayphep = this.idgiayphep;
        this.loadedTabState[CpTraLaiGiayPhepThamDoKhoangSanTabEnum.ThongTinCapPhep] = await this.thongTinCapPhepComp.manualDataInit();
      }

    }
  }
}
