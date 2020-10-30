import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MatSidenav } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import {InsertedState, NhomTaiLieuEnum, GiayPhepActionEnum, CpDauGiaQuyenKhaiThacKhoangSanTabEnum, ActionDataEnum } from 'src/app/shared/constants/enum';
import { MatsidenavService } from 'src/app/services/utilities/matsidenav.service';
import { NhomLoaiCapPhepEnum } from "src/app/shared/constants/nhomloaicapphep-constants";
import { QuyetdinhIoComponent } from 'src/app/features/admin/hosogiayto/quyetdinh/quyetdinh-io/quyetdinh-io.component';
import { CpDaugiaThongtincapphepComponent } from 'src/app/features/admin/capphephoatdongkhoangsan/cpdaugiaquyenkhaithackhoangsan/cp-daugia-thongtincapphep/cp-daugia-thongtincapphep.component';
import {HoSoGiayToFacadeService} from 'src/app/services/admin/hosogiayto/hosogiayto-facade.service';
import { ButtonBackCpDauGiaQuyenKhaiThacKhoangSan, MenuCpDauGiaQuyenKhaiThacKhoangSanChitiet } from 'src/app/shared/constants/sub-menus/capphephoatdongkhoangsan/capphephoatdongkhoangsan';
import { DefaultValue } from 'src/app/shared/constants/global-var';
import { GiaypheptailieuListComponent } from 'src/app/features/admin/hosogiayto/giaypheptailieu/giaypheptailieu-list/giaypheptailieu-list.component';

@Component({
  selector: 'app-cpdaugiaquyenkhaithackhoangsan-io',
  templateUrl: './cpdaugiaquyenkhaithackhoangsan-io.component.html',
  styleUrls: ['./cpdaugiaquyenkhaithackhoangsan-io.component.scss']
})
export class CpdaugiaquyenkhaithackhoangsanIoComponent implements OnInit {
  @ViewChild('capPhepDauGiaQuyenKhaiThacKhoanSanTabs', {static: false}) capPhepDauGiaQuyenKhaiThacKhoanSanTabs;
  @ViewChild("aside", { static: true }) public matSidenav: MatSidenav;
  @ViewChild("compio", { read: ViewContainerRef, static: true }) public content: ViewContainerRef;
  @ViewChild("quyetDinhIOComp", { static: false })quyetDinhIOComp: QuyetdinhIoComponent;
  @ViewChild("thongTinCapPhepComp", { static: false }) thongTinCapPhepComp: CpDaugiaThongtincapphepComponent;
  @ViewChild("taiLieuListComp", { static: false }) taiLieuListComp: GiaypheptailieuListComponent;
  // @ViewChild("thongTinDangKyComp", { static: false }) thongTinDangKyComp: ThongtindangkyComponent;
  // Chứa dữ liệu menu item trên subheader
  public navArray = MenuCpDauGiaQuyenKhaiThacKhoangSanChitiet;

  // Chứa dữ liệu nút quay lại trên subheader
  public btnArray = ButtonBackCpDauGiaQuyenKhaiThacKhoangSan;

  public currentAction: number;

  public TabType = CpDauGiaQuyenKhaiThacKhoangSanTabEnum;

  public ActionType = GiayPhepActionEnum;

  private idgiayphep: string;

  public insertedState = InsertedState;

  public nhomLoaiCapPhepEnum = NhomLoaiCapPhepEnum;

  public nhomTaiLieuEnum = NhomTaiLieuEnum;

  // Chứa dữ liệu translate
  public dataTranslate: any;

  public loadedTabState: any = {
    [CpDauGiaQuyenKhaiThacKhoangSanTabEnum.ThongTinGiayPhep] : false,
    [CpDauGiaQuyenKhaiThacKhoangSanTabEnum.TaiLieuGiayPhepDinhKem] : false,
    [CpDauGiaQuyenKhaiThacKhoangSanTabEnum.ThongTinCapPhep] : false,
  };

  public disabledTabState: any = {
    [CpDauGiaQuyenKhaiThacKhoangSanTabEnum.ThongTinGiayPhep] : false,
    [CpDauGiaQuyenKhaiThacKhoangSanTabEnum.TaiLieuGiayPhepDinhKem] : false,
    [CpDauGiaQuyenKhaiThacKhoangSanTabEnum.ThongTinCapPhep] : false,
  };


  constructor(public matSidenavService: MatsidenavService,
              private activatedRoute: ActivatedRoute,
              private hoSoGiayToFacadeService: HoSoGiayToFacadeService,
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
        this.setDauGiaQuyenKhaiThacKhoangSanDisabledTabState(this.currentAction);

        // const cpThamDoItem = await this.getCapPhepThamDoByIdGiayPhep(giayPhepItem.loaicapphep, this.idgiayphep);

        // if (cpThamDoItem) {
        //   existedCapPhepThamDo = true;
        // }
      } else {
        this.currentAction = GiayPhepActionEnum.None;
      }
    } else {
      this.currentAction = GiayPhepActionEnum.Add;
      this.setDauGiaQuyenKhaiThacKhoangSanDisabledTabState(this.currentAction);
    }

    // Khởi tạo dữ liệu ban đầu  cho form hoso
    this.quyetDinhIOComp.idgiayphep = this.idgiayphep;
    await this.quyetDinhIOComp.manualDataInit();
    this.quyetDinhIOComp.currentAction = this.currentAction;
    this.quyetDinhIOComp.disabledLoaiCapPhepSelectionState = existedCapPhepThamDo;
    this.capPhepDauGiaQuyenKhaiThacKhoanSanTabs.realignInkBar();
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

  setDauGiaQuyenKhaiThacKhoangSanDisabledTabState(actionType: number) {
    switch(actionType) {
      case GiayPhepActionEnum.Add: {
        this.disabledTabState[CpDauGiaQuyenKhaiThacKhoangSanTabEnum.ThongTinGiayPhep] = true;
        this.disabledTabState[CpDauGiaQuyenKhaiThacKhoangSanTabEnum.TaiLieuGiayPhepDinhKem] = false;
        this.disabledTabState[CpDauGiaQuyenKhaiThacKhoangSanTabEnum.ThongTinCapPhep] = false;
        break;
      }
      case GiayPhepActionEnum.Edit: {
        this.disabledTabState[CpDauGiaQuyenKhaiThacKhoangSanTabEnum.ThongTinGiayPhep] = true;
        this.disabledTabState[CpDauGiaQuyenKhaiThacKhoangSanTabEnum.TaiLieuGiayPhepDinhKem] = true;
        this.disabledTabState[CpDauGiaQuyenKhaiThacKhoangSanTabEnum.ThongTinCapPhep] = true;
        break;
      }
      default: {
        this.disabledTabState[CpDauGiaQuyenKhaiThacKhoangSanTabEnum.ThongTinGiayPhep] = false;
        this.disabledTabState[CpDauGiaQuyenKhaiThacKhoangSanTabEnum.TaiLieuGiayPhepDinhKem] = false;
        this.disabledTabState[CpDauGiaQuyenKhaiThacKhoangSanTabEnum.ThongTinCapPhep] = false;
        break;
      }
    }
  }

  getGiayPhepIoFormState(action: number) {
    this.currentAction = action;
    this.setDauGiaQuyenKhaiThacKhoangSanDisabledTabState(this.currentAction);
  }

  getIdGiayPhep(id: string) {
    this.idgiayphep = id;
  }

  getThongTinDauGiaKhaiThacFormState(action: number) {
    if (action === ActionDataEnum.Edit) {
      this.quyetDinhIOComp.disabledLoaiCapPhepSelectionState = true;
    } else {
      this.quyetDinhIOComp.disabledLoaiCapPhepSelectionState = false;
    }
  }

  closeIOSidenav() {
    this.matSidenavService.close();
  }

  async tabChange(index: any) {
    if (index === CpDauGiaQuyenKhaiThacKhoangSanTabEnum.TaiLieuGiayPhepDinhKem && !this.loadedTabState[CpDauGiaQuyenKhaiThacKhoangSanTabEnum.TaiLieuGiayPhepDinhKem]) {
      this.taiLieuListComp.matSidenav = this.matSidenav;
      this.taiLieuListComp.content = this.content;
      this.taiLieuListComp.idgiayphep = this.idgiayphep;
      this.taiLieuListComp.title = this.dataTranslate.HOSOGIAYTO.tailieu.titleList;
      this.loadedTabState[CpDauGiaQuyenKhaiThacKhoangSanTabEnum.TaiLieuGiayPhepDinhKem]  =  await this.taiLieuListComp.manualDataInit();
    }  else if (index === CpDauGiaQuyenKhaiThacKhoangSanTabEnum.ThongTinCapPhep && !this.loadedTabState[CpDauGiaQuyenKhaiThacKhoangSanTabEnum.ThongTinCapPhep]) {
      this.thongTinCapPhepComp.matSidenav = this.matSidenav;
      this.thongTinCapPhepComp.content = this.content;
      this.thongTinCapPhepComp.idgiayphep = this.idgiayphep;
      this.loadedTabState[CpDauGiaQuyenKhaiThacKhoangSanTabEnum.ThongTinCapPhep] = await this.thongTinCapPhepComp.manualDataInit();
    }
  }
}
