import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MatSidenav } from '@angular/material';
import { ActivatedRoute } from '@angular/router';

import { InsertedState, NhomTaiLieuEnum, GiayPhepActionEnum, CpKhaiThacKhoangSanTabEnum, CapPhepKhaiThacActionEnum, LoaiCapPhepEnum } from 'src/app/shared/constants/enum';
import { MatsidenavService } from 'src/app/services/utilities/matsidenav.service';
import { NhomLoaiCapPhepEnum } from "src/app/shared/constants/nhomloaicapphep-constants";
import { GiayphepIoComponent } from 'src/app/features/admin/hosogiayto/giayphep/giayphep-io/giayphep-io.component';
import { HoSoGiayToFacadeService } from 'src/app/services/admin/hosogiayto/hosogiayto-facade.service';
import { ButtonBackCpKhaiThacKhoangSan, MenuCpKhaiThacKhoangSanChitiet } from 'src/app/shared/constants/sub-menus/capphephoatdongkhoangsan/capphephoatdongkhoangsan';
import { DefaultValue } from 'src/app/shared/constants/global-var';
import { GiaypheptailieuListComponent } from 'src/app/features/admin/hosogiayto/giaypheptailieu/giaypheptailieu-list/giaypheptailieu-list.component';
import { CpKtksThongtincapphepComponent } from "src/app/features/admin/capphephoatdongkhoangsan/cpkhaithackhoangsan/cp-ktks-thongtincapphep/cp-ktks-thongtincapphep.component";
import { CapPhepHoatDongKhoangSanFacadeService } from "../../../../../services/admin/capphephoatdongkhoangsan/capphephoatdongkhoangsan-facade.service";

@Component({
  selector: 'app-cpkhaithackhoangsan-io',
  templateUrl: './cpkhaithackhoangsan-io.component.html',
  styleUrls: ['./cpkhaithackhoangsan-io.component.scss']
})
export class CpkhaithackhoangsanIoComponent implements OnInit {
  @ViewChild('capPhepKhaiThacKhoangSanTabs', { static: false }) capPhepKhaiThacKhoangSanTabs;
  @ViewChild("aside", { static: true }) public matSidenav: MatSidenav;
  @ViewChild("compio", { read: ViewContainerRef, static: true }) public content: ViewContainerRef;
  @ViewChild("giayPhepIOComp", { static: false }) giayPhepIOComp: GiayphepIoComponent;
  @ViewChild("taiLieuListComp", { static: false }) taiLieuListComp: GiaypheptailieuListComponent;
  @ViewChild("thongTinCapPhepComp", { static: false }) thongTinCapPhepComp: CpKtksThongtincapphepComponent;
  // Chứa dữ liệu menu item trên subheader
  public navArray = MenuCpKhaiThacKhoangSanChitiet;

  // Chứa dữ liệu nút quay lại trên subheader
  public btnArray = ButtonBackCpKhaiThacKhoangSan;

  public currentAction: number;

  public TabType = CpKhaiThacKhoangSanTabEnum;

  public ActionType = GiayPhepActionEnum;

  private idgiayphep: string;

  public insertedState = InsertedState;

  public nhomLoaiCapPhepEnum = NhomLoaiCapPhepEnum;

  public nhomTaiLieuEnum = NhomTaiLieuEnum;

  // Chứa dữ liệu translate
  public dataTranslate: any;

  public loadedTabState: any = {
    [CpKhaiThacKhoangSanTabEnum.ThongTinGiayPhep]: false,
    [CpKhaiThacKhoangSanTabEnum.TaiLieuGiayPhepDinhKem]: false,
    [CpKhaiThacKhoangSanTabEnum.ThongTinCapPhep]: false,
  };

  public disabledTabState: any = {
    [CpKhaiThacKhoangSanTabEnum.ThongTinGiayPhep]: false,
    [CpKhaiThacKhoangSanTabEnum.TaiLieuGiayPhepDinhKem]: false,
    [CpKhaiThacKhoangSanTabEnum.ThongTinCapPhep]: false,
  };


  constructor(public matSidenavService: MatsidenavService,
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
    let existedCapPhepThamDo = false;

    if (this.idgiayphep !== DefaultValue.Null && this.idgiayphep !== DefaultValue.Undefined && this.idgiayphep.trim() !== DefaultValue.Empty) {
      const giayPhepItem = await this.getGiayPhepById(this.idgiayphep);

      if (giayPhepItem) {
        this.currentAction = GiayPhepActionEnum.Edit;
        this.setKhaiThacKhoangSanDisabledTabState(this.currentAction);

        const cpThamDoItem = await this.getCapPhepKhaiThacByIdGiayPhep(this.idgiayphep);

        if (cpThamDoItem) {
          existedCapPhepThamDo = true;
        }

      } else {
        this.currentAction = GiayPhepActionEnum.None;
      }
    } else {
      this.currentAction = GiayPhepActionEnum.Add;
      this.setKhaiThacKhoangSanDisabledTabState(this.currentAction);
    }

    // Khởi tạo dữ liệu ban đầu  cho form hoso
    this.giayPhepIOComp.idgiayphep = this.idgiayphep;
    await this.giayPhepIOComp.manualDataInit();
    this.giayPhepIOComp.currentAction = this.currentAction;
    this.giayPhepIOComp.disabledLoaiCapPhepSelectionState = existedCapPhepThamDo;
    this.capPhepKhaiThacKhoangSanTabs.realignInkBar();
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
  private async getCapPhepKhaiThacByIdGiayPhep(idGiayPhep: string) {
    const cpKhaiThacKhoangSanService = this.capPhepHoatDongKhoangSanFacadeService.getCapPhepKhaiThacKhoangSanService();
    const capPhepItem = await cpKhaiThacKhoangSanService.getCapPhepKhaiThacByIdGiayPhep(idGiayPhep).toPromise();
    return capPhepItem;
  }

  /**
   * Set trạng thái tab theo các chức năng
   */
  setKhaiThacKhoangSanDisabledTabState(actionType: number) {
    switch (actionType) {
      case GiayPhepActionEnum.Add: {
        this.disabledTabState[CpKhaiThacKhoangSanTabEnum.ThongTinGiayPhep] = true;
        this.disabledTabState[CpKhaiThacKhoangSanTabEnum.TaiLieuGiayPhepDinhKem] = false;
        this.disabledTabState[CpKhaiThacKhoangSanTabEnum.ThongTinCapPhep] = false;
        break;
      }
      case GiayPhepActionEnum.Edit: {
        this.disabledTabState[CpKhaiThacKhoangSanTabEnum.ThongTinGiayPhep] = true;
        this.disabledTabState[CpKhaiThacKhoangSanTabEnum.TaiLieuGiayPhepDinhKem] = true;
        this.disabledTabState[CpKhaiThacKhoangSanTabEnum.ThongTinCapPhep] = true;
        break;
      }
      default: {
        this.disabledTabState[CpKhaiThacKhoangSanTabEnum.ThongTinGiayPhep] = false;
        this.disabledTabState[CpKhaiThacKhoangSanTabEnum.TaiLieuGiayPhepDinhKem] = false;
        this.disabledTabState[CpKhaiThacKhoangSanTabEnum.ThongTinCapPhep] = false;
        break;
      }
    }
  }

  /**
   * Lấy trạng thái form io
   * @param action
   */
  getGiayPhepIoFormState(action: number) {
    this.currentAction = action;
    this.setKhaiThacKhoangSanDisabledTabState(this.currentAction);
  }

  /**
   * Hàm set id Giấy phép
   */
  getIdGiayPhep(id: string) {
    this.idgiayphep = id;
  }

  /**
   * Hàm lấy trạng thái thông tin đăng ký
   * @param action 
   */
  getThongTinDangKyKhaiThacFormState(action: number) {
    if (action === CapPhepKhaiThacActionEnum.Edit) {
      this.giayPhepIOComp.disabledLoaiCapPhepSelectionState = true;
    } else {
      this.giayPhepIOComp.disabledLoaiCapPhepSelectionState = false;
    }
  }

  /**
   * Hàm đóng sidenav
   */
  closeIOSidenav() {
    this.matSidenavService.close();
  }

  /**
   * Hàm chạy khi thay đổi tab
   */
  async tabChange(index: any) {
    if (index === CpKhaiThacKhoangSanTabEnum.TaiLieuGiayPhepDinhKem && !this.loadedTabState[CpKhaiThacKhoangSanTabEnum.TaiLieuGiayPhepDinhKem]) {
      this.taiLieuListComp.matSidenav = this.matSidenav;
      this.taiLieuListComp.content = this.content;
      this.taiLieuListComp.idgiayphep = this.idgiayphep;
      this.taiLieuListComp.title = this.dataTranslate.HOSOGIAYTO.tailieu.titleList;
      this.loadedTabState[CpKhaiThacKhoangSanTabEnum.TaiLieuGiayPhepDinhKem] = await this.taiLieuListComp.manualDataInit();
    } else if (index === CpKhaiThacKhoangSanTabEnum.ThongTinCapPhep && !this.loadedTabState[CpKhaiThacKhoangSanTabEnum.ThongTinCapPhep]) {
      this.thongTinCapPhepComp.matSidenav = this.matSidenav;
      this.thongTinCapPhepComp.content = this.content;
      this.thongTinCapPhepComp.idgiayphep = this.idgiayphep;
      this.loadedTabState[CpKhaiThacKhoangSanTabEnum.ThongTinCapPhep] = await this.thongTinCapPhepComp.manualDataInit();
    }
  }
}
