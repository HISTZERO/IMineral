import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MatSidenav } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import {InsertedState, NhomTaiLieuEnum, CpThamDoKhoangSanTabEnum, GiayPhepActionEnum, CapPhepThamDoActionEnum } from 'src/app/shared/constants/enum';
import { MatsidenavService } from 'src/app/services/utilities/matsidenav.service';
import { NhomLoaiCapPhepEnum } from "src/app/shared/constants/nhomloaicapphep-constants";
import { GiayphepIoComponent } from 'src/app/features/admin/hosogiayto/giayphep/giayphep-io/giayphep-io.component';
import {HoSoGiayToFacadeService} from 'src/app/services/admin/hosogiayto/hosogiayto-facade.service';
import { ButtonBackCpThamDoKhoangSan, MenuCpThamDoKhoangSanChitiet } from 'src/app/shared/constants/sub-menus/capphephoatdongkhoangsan/capphephoatdongkhoangsan';
import { DefaultValue } from 'src/app/shared/constants/global-var';
import { GiaypheptailieuListComponent } from 'src/app/features/admin/hosogiayto/giaypheptailieu/giaypheptailieu-list/giaypheptailieu-list.component';
import { CapPhepHoatDongKhoangSanFacadeService } from 'src/app/services/admin/capphephoatdongkhoangsan/capphephoatdongkhoangsan-facade.service';
import { CpTdksThongtincapphepComponent } from 'src/app/features/admin/capphephoatdongkhoangsan/cpthamdokhoangsan/cp-tdks-thongtincapphep/cp-tdks-thongtincapphep.component';

@Component({
  selector: 'app-cpthamdokhoangsan-io',
  templateUrl: './cpthamdokhoangsan-io.component.html',
  styleUrls: ['./cpthamdokhoangsan-io.component.scss']
})
export class CpthamdokhoangsanIoComponent implements OnInit {
  @ViewChild('capPhepThamDoKhoanSanTabs', {static: false}) capPhepThamDoKhoanSanTabs;
  @ViewChild("aside", { static: true }) public matSidenav: MatSidenav;
  @ViewChild("compio", { read: ViewContainerRef, static: true }) public content: ViewContainerRef;
  @ViewChild("giayPhepIOComp", { static: false }) giayPhepIOComp: GiayphepIoComponent;
  @ViewChild("taiLieuListComp", { static: false }) taiLieuListComp: GiaypheptailieuListComponent;
  @ViewChild("thongTinCapPhepComp", { static: false }) thongTinCapPhepComp: CpTdksThongtincapphepComponent;
  // @ViewChild("thongTinDangKyComp", { static: false }) thongTinDangKyComp: ThongtindangkyComponent;
  // Chứa dữ liệu menu item trên subheader
  public navArray = MenuCpThamDoKhoangSanChitiet;

  // Chứa dữ liệu nút quay lại trên subheader
  public btnArray = ButtonBackCpThamDoKhoangSan;

  public currentAction: number;

  public TabType = CpThamDoKhoangSanTabEnum;

  public ActionType = GiayPhepActionEnum;

  private idgiayphep: string;

  public insertedState = InsertedState;

  public nhomLoaiCapPhepEnum = NhomLoaiCapPhepEnum;

  public nhomTaiLieuEnum = NhomTaiLieuEnum;

  // Chứa dữ liệu translate
  public dataTranslate: any;

  public loadedTabState: any = {
    [CpThamDoKhoangSanTabEnum.ThongTinGiayPhep] : false,
    [CpThamDoKhoangSanTabEnum.TaiLieuGiayPhepDinhKem] : false,
    [CpThamDoKhoangSanTabEnum.ThongTinDangKy] : false,
  };

  public disabledTabState: any = {
    [CpThamDoKhoangSanTabEnum.ThongTinGiayPhep] : false,
    [CpThamDoKhoangSanTabEnum.TaiLieuGiayPhepDinhKem] : false,
    [CpThamDoKhoangSanTabEnum.ThongTinDangKy] : false,
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
        this.setThamDoKhoangSanDisabledTabState(this.currentAction);

        const cpThamDoItem = await this.getCapPhepThamDoByIdGiayPhep(this.idgiayphep);

        if (cpThamDoItem) {
          existedCapPhepThamDo = true;
        }
      } else {
        this.currentAction = GiayPhepActionEnum.None;
      }
    } else {
      this.currentAction = GiayPhepActionEnum.Add;
      this.setThamDoKhoangSanDisabledTabState(this.currentAction);
    }

    // Khởi tạo dữ liệu ban đầu  cho form hoso
    this.giayPhepIOComp.idgiayphep = this.idgiayphep;
    await this.giayPhepIOComp.manualDataInit();
    this.giayPhepIOComp.currentAction = this.currentAction;
    this.giayPhepIOComp.disabledLoaiCapPhepSelectionState = existedCapPhepThamDo;
    this.capPhepThamDoKhoanSanTabs.realignInkBar();
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
    const cpThamDoKhoangSanService = this.capPhepHoatDongKhoangSanFacadeService.getCapPhepThamDoKhoangSanService();
    const capPhepItem = await cpThamDoKhoangSanService.getCapPhepThamDoByIdGiayPhep(idGiayPhep).toPromise();
    return capPhepItem;
  }

  setThamDoKhoangSanDisabledTabState(actionType: number) {
    switch(actionType) {
      case GiayPhepActionEnum.Add: {
        this.disabledTabState[CpThamDoKhoangSanTabEnum.ThongTinGiayPhep] = true;
        this.disabledTabState[CpThamDoKhoangSanTabEnum.TaiLieuGiayPhepDinhKem] = false;
        this.disabledTabState[CpThamDoKhoangSanTabEnum.ThongTinDangKy] = false;
        break;
      }
      case GiayPhepActionEnum.Edit: {
        this.disabledTabState[CpThamDoKhoangSanTabEnum.ThongTinGiayPhep] = true;
        this.disabledTabState[CpThamDoKhoangSanTabEnum.TaiLieuGiayPhepDinhKem] = true;
        this.disabledTabState[CpThamDoKhoangSanTabEnum.ThongTinDangKy] = true;
        break;
      }
      default: {
        this.disabledTabState[CpThamDoKhoangSanTabEnum.ThongTinGiayPhep] = false;
        this.disabledTabState[CpThamDoKhoangSanTabEnum.TaiLieuGiayPhepDinhKem] = false;
        this.disabledTabState[CpThamDoKhoangSanTabEnum.ThongTinDangKy] = false;
        break;
      }
    }
  }

  getGiayPhepIoFormState(action: number) {
    this.currentAction = action;
    this.setThamDoKhoangSanDisabledTabState(this.currentAction);
  }

  getIdGiayPhep(id: string) {
    this.idgiayphep = id;
  }

  getThongTinCapPhepThamDoFormState(action: number) {
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
    if (index === CpThamDoKhoangSanTabEnum.TaiLieuGiayPhepDinhKem && !this.loadedTabState[CpThamDoKhoangSanTabEnum.TaiLieuGiayPhepDinhKem]) {
      this.taiLieuListComp.matSidenav = this.matSidenav;
      this.taiLieuListComp.content = this.content;
      this.taiLieuListComp.idgiayphep = this.idgiayphep;
      this.taiLieuListComp.title = this.dataTranslate.HOSOGIAYTO.tailieu.titleList;
      this.loadedTabState[CpThamDoKhoangSanTabEnum.TaiLieuGiayPhepDinhKem]  =  await this.taiLieuListComp.manualDataInit();
    } else if (index === CpThamDoKhoangSanTabEnum.ThongTinDangKy && !this.loadedTabState[CpThamDoKhoangSanTabEnum.ThongTinDangKy]) {
      this.thongTinCapPhepComp.matSidenav = this.matSidenav;
      this.thongTinCapPhepComp.content = this.content;
      this.thongTinCapPhepComp.idgiayphep = this.idgiayphep;
      this.loadedTabState[CpThamDoKhoangSanTabEnum.ThongTinDangKy] = await this.thongTinCapPhepComp.manualDataInit();
    }
  }
}
