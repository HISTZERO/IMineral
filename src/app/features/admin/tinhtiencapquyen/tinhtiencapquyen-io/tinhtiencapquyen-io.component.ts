import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MatSidenav } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import {InsertedState, NhomTaiLieuEnum, GiayPhepActionEnum, TinhTienCapQuyenKhaiThacKhoangSanTabEnum, TinhTienCapQuyenKhaiThacKhoangSanActionEnum } from 'src/app/shared/constants/enum';
import { MatsidenavService } from 'src/app/services/utilities/matsidenav.service';
import { NhomLoaiCapPhepEnum } from "src/app/shared/constants/nhomloaicapphep-constants";
import {HoSoGiayToFacadeService} from 'src/app/services/admin/hosogiayto/hosogiayto-facade.service';
import { DefaultValue } from 'src/app/shared/constants/global-var';
import { GiaypheptailieuListComponent } from 'src/app/features/admin/hosogiayto/giaypheptailieu/giaypheptailieu-list/giaypheptailieu-list.component';
import { QuyetdinhtinhtiencapquyenIoComponent } from 'src/app/features/admin/hosogiayto/quyetdinhtinhtiencapquyen/quyetdinhtinhtiencapquyen-io/quyetdinhtinhtiencapquyen-io.component';
import { ButtonBackTinhTienCapQuyenKhaiThacKhoangSan, MenuTinhTienCapQuyenChiTietKhaiThacKhoangSan } from 'src/app/shared/constants/sub-menus/tinhtiencapquyen/tinhtiencapquyen';
import { TinhTienCapQuyenFacadeService } from 'src/app/services/admin/tinhtiencapquyen/tinhtiencapquyen-facade.service';

@Component({
  selector: 'app-tinhtiencapquyen-io',
  templateUrl: './tinhtiencapquyen-io.component.html',
  styleUrls: ['./tinhtiencapquyen-io.component.scss']
})
export class TinhtiencapquyenIoComponent implements OnInit {

  @ViewChild('quyetDinhTinhTienCapQuyenTabs', {static: false}) quyetDinhTinhTienCapQuyenTabs;
  @ViewChild("aside", { static: true }) public matSidenav: MatSidenav;
  @ViewChild("compio", { read: ViewContainerRef, static: true }) public content: ViewContainerRef;
  @ViewChild("quyetDinhIOComp", { static: false }) quyetDinhIOComp: QuyetdinhtinhtiencapquyenIoComponent;
  @ViewChild("taiLieuListComp", { static: false }) taiLieuListComp: GiaypheptailieuListComponent;
  // Chứa dữ liệu menu item trên subheader
  public navArray = MenuTinhTienCapQuyenChiTietKhaiThacKhoangSan;

  // Chứa dữ liệu nút quay lại trên subheader
  public btnArray = ButtonBackTinhTienCapQuyenKhaiThacKhoangSan;

  public currentAction: number;

  public TabType = TinhTienCapQuyenKhaiThacKhoangSanTabEnum;

  public ActionType = GiayPhepActionEnum;

  private idgiayphep: string;

  public insertedState = InsertedState;

  public nhomLoaiCapPhepEnum = NhomLoaiCapPhepEnum;

  public nhomTaiLieuEnum = NhomTaiLieuEnum;

  // Chứa dữ liệu translate
  public dataTranslate: any;

  public loadedTabState: any = {
    [TinhTienCapQuyenKhaiThacKhoangSanTabEnum.ThongTinQuyeDinh] : false,
    [TinhTienCapQuyenKhaiThacKhoangSanTabEnum.TaiLieuDinhKem] : false,
    [TinhTienCapQuyenKhaiThacKhoangSanTabEnum.ThongTinTinhTienHangNam] : false,
  };

  public disabledTabState: any = {
    [TinhTienCapQuyenKhaiThacKhoangSanTabEnum.ThongTinQuyeDinh] : true,
    [TinhTienCapQuyenKhaiThacKhoangSanTabEnum.TaiLieuDinhKem] : true,
    [TinhTienCapQuyenKhaiThacKhoangSanTabEnum.ThongTinTinhTienHangNam] : true,
  };

  constructor(public matSidenavService: MatsidenavService,
              private activatedRoute: ActivatedRoute,
              private hoSoGiayToFacadeService: HoSoGiayToFacadeService,
              private tinhTienCapQuyenFacadeService: TinhTienCapQuyenFacadeService,
              private translate: TranslateService) { }

  async ngOnInit() {
    this.activatedRoute.queryParamMap.subscribe((param: any) => {
      if (param && param.params && param.params.idgiayphep) {
        this.idgiayphep = param.params.idgiayphep;
      }
    });

    // Gọi hàm lấy dữ liệu translate
    await this.getDataTranslate();
    let existedTinhTienCapQuyen = false;

    if (this.idgiayphep !== DefaultValue.Null && this.idgiayphep !== DefaultValue.Undefined && this.idgiayphep.trim() !== DefaultValue.Empty) {
      const giayPhepItem = await this.getGiayPhepById(this.idgiayphep);

      if (giayPhepItem) {
        this.currentAction = GiayPhepActionEnum.Edit;
        this.setSanDisabledTabState(this.currentAction);

        const ttTinhTiencapQuyenItem = await this.getTinhTienCapQuyenByIdGiayPhep(this.idgiayphep);

        if (ttTinhTiencapQuyenItem) {
          existedTinhTienCapQuyen = true;
        }
      } else {
        this.currentAction = GiayPhepActionEnum.None;
      }
    } else {
      this.currentAction = GiayPhepActionEnum.Add;
      this.setSanDisabledTabState(this.currentAction);
    }

    // Khởi tạo dữ liệu ban đầu  cho form hoso
    this.quyetDinhIOComp.idgiayphep = this.idgiayphep;
    await this.quyetDinhIOComp.manualDataInit();
    this.quyetDinhIOComp.currentAction = this.currentAction;
    this.quyetDinhIOComp.disabledLoaiCapPhepSelectionState = existedTinhTienCapQuyen;
    this.quyetDinhTinhTienCapQuyenTabs.selectedIndex = this.TabType.ThongTinQuyeDinh;
    this.quyetDinhTinhTienCapQuyenTabs.realignInkBar();
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
   * Lấy dữ liệu tính tiền cấp quyền theo idGiayPhep
   * @param idGiayPhep
   */
  private async getTinhTienCapQuyenByIdGiayPhep(idGiayPhep: string) {
    const ttTinhTienCapQuyenService = this.tinhTienCapQuyenFacadeService.getTinhTienCapQuyenKhaiThacKhoangSanService();
    const tinhTienCapQuyenItem = await ttTinhTienCapQuyenService.getTinhTienCapQuyenByIdGiayPhep(idGiayPhep).toPromise();
    return tinhTienCapQuyenItem;
  }

  setSanDisabledTabState(actionType: number) {
    switch(actionType) {
      case GiayPhepActionEnum.Add: {
        this.disabledTabState[TinhTienCapQuyenKhaiThacKhoangSanTabEnum.ThongTinQuyeDinh] = false;
        this.disabledTabState[TinhTienCapQuyenKhaiThacKhoangSanTabEnum.TaiLieuDinhKem] = true;
        this.disabledTabState[TinhTienCapQuyenKhaiThacKhoangSanTabEnum.ThongTinTinhTienHangNam] = true;
        break;
      }
      case GiayPhepActionEnum.Edit: {
        this.disabledTabState[TinhTienCapQuyenKhaiThacKhoangSanTabEnum.ThongTinQuyeDinh] = false;
        this.disabledTabState[TinhTienCapQuyenKhaiThacKhoangSanTabEnum.TaiLieuDinhKem] = false;
        this.disabledTabState[TinhTienCapQuyenKhaiThacKhoangSanTabEnum.ThongTinTinhTienHangNam] = false;
        break;
      }
      default: {
        this.disabledTabState[TinhTienCapQuyenKhaiThacKhoangSanTabEnum.ThongTinQuyeDinh] = true;
        this.disabledTabState[TinhTienCapQuyenKhaiThacKhoangSanTabEnum.TaiLieuDinhKem] = true;
        this.disabledTabState[TinhTienCapQuyenKhaiThacKhoangSanTabEnum.ThongTinTinhTienHangNam] = true;
        break;
      }
    }
  }

  private resetLoadedTabState() {
    this.loadedTabState[TinhTienCapQuyenKhaiThacKhoangSanTabEnum.TaiLieuDinhKem] = false;
    this.loadedTabState[TinhTienCapQuyenKhaiThacKhoangSanTabEnum.ThongTinTinhTienHangNam] = false;
  }

  getGiayPhepIoFormState(action: number) {
    this.currentAction = action;
    this.setSanDisabledTabState(this.currentAction);
    this.resetLoadedTabState();
  }

  getIdGiayPhep(id: string) {
    this.idgiayphep = id;
  }

  getThongTinTinhTienCapQuyenFormState(action: number) {
    if (action === TinhTienCapQuyenKhaiThacKhoangSanActionEnum.Edit) {
      this.quyetDinhIOComp.disabledLoaiCapPhepSelectionState = true;
    } else {
      this.quyetDinhIOComp.disabledLoaiCapPhepSelectionState = false;
    }
  }

  closeIOSidenav() {
    this.matSidenavService.close();
  }

  async tabChange(index: any) {
    if (index === TinhTienCapQuyenKhaiThacKhoangSanTabEnum.TaiLieuDinhKem && !this.loadedTabState[TinhTienCapQuyenKhaiThacKhoangSanTabEnum.TaiLieuDinhKem]) {
      this.taiLieuListComp.matSidenav = this.matSidenav;
      this.taiLieuListComp.content = this.content;
      this.taiLieuListComp.idgiayphep = this.idgiayphep;
      this.taiLieuListComp.title = this.dataTranslate.HOSOGIAYTO.tailieu.titleList;
      this.loadedTabState[TinhTienCapQuyenKhaiThacKhoangSanTabEnum.TaiLieuDinhKem]  =  await this.taiLieuListComp.manualDataInit();
    } else if (index === TinhTienCapQuyenKhaiThacKhoangSanTabEnum.ThongTinTinhTienHangNam && !this.loadedTabState[TinhTienCapQuyenKhaiThacKhoangSanTabEnum.ThongTinTinhTienHangNam]) {

    }
  }
}
