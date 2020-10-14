import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MatSidenav } from '@angular/material';
import { ActivatedRoute } from '@angular/router';

import {
  ButtonBackChuyenNhuongQuyen,
  MenuDkChuyenNhuongQuyenChitiet
} from 'src/app/shared/constants/sub-menus/dangkyhoatdongkhoangsan/dangkyhoatdongkhoangsan';
import {
  HoSoActionEnum,
  ThamDoKhoangSanTabEnum,
  InsertedState,
  NhomTaiLieuEnum,
  LoaiCapPhepEnum, DangKyThamDoActionEnum
} from 'src/app/shared/constants/enum';
import { HosotailieuListComponent } from 'src/app/features/admin/hosogiayto/hosotailieu/hosotailieu-list/hosotailieu-list.component';
import { MatsidenavService } from 'src/app/services/utilities/matsidenav.service';
import { NhomLoaiCapPhepEnum } from "src/app/shared/constants/nhomloaicapphep-constants";
import {CnqThongtindangkyComponent} from "src/app/features/admin/dangkyhoatdongkhoangsan/chuyennhuongquyen/cnq-thongtindangky/cnq-thongtindangky.component";
import {HoSoGiayToFacadeService} from "src/app/services/admin/hosogiayto/hosogiayto-facade.service";
import {HosoIoComponent} from "src/app/features/admin/hosogiayto/hoso/hoso-io/hoso-io.component";
import {DangKyHoatDongKhoangSanFacadeService} from "src/app/services/admin/dangkyhoatdongkhoangsan/dangkyhoatdongkhoangsan-facade.service";

@Component({
  selector: 'app-chuyennhuongquyen-io',
  templateUrl: './chuyennhuongquyen-io.component.html',
  styleUrls: ['./chuyennhuongquyen-io.component.scss']
})
export class ChuyennhuongquyenIoComponent implements OnInit {

  @ViewChild('dangKyChuyenNhuongQuyenTabs', { static: false }) dangKyChuyenNhuongQuyenTabs;
  @ViewChild("aside", { static: true }) public matSidenav: MatSidenav;
  @ViewChild("compio", { read: ViewContainerRef, static: true }) public content: ViewContainerRef;
  @ViewChild("hoSoIOComp", { static: false }) hoSoIOComp: HosoIoComponent;
  @ViewChild("taiLieuBatBuocListComp", { static: false }) taiLieuBatBuocListComp: HosotailieuListComponent;
  @ViewChild("taiLieuKhacListComp", { static: false }) taiLieuKhacListComp: HosotailieuListComponent;
  @ViewChild("taiLieuXuLyHoSoListComp", { static: false }) taiLieuXuLyHoSoListComp: HosotailieuListComponent;
  @ViewChild("thongTinDangKyComp", { static: false }) thongTinDangKyComp: CnqThongtindangkyComponent;
  // Chứa dữ liệu menu item trên subheader
  public navArray = MenuDkChuyenNhuongQuyenChitiet;

  // Chứa dữ liệu nút quay lại trên subheader
  public btnArray = ButtonBackChuyenNhuongQuyen;

  public currentAction: number;

  public TabType = ThamDoKhoangSanTabEnum;

  public ActionType = HoSoActionEnum;

  private idhoso: string;

  public insertedState = InsertedState;

  public nhomLoaiCapPhepEnum = NhomLoaiCapPhepEnum;

  public nhomTaiLieuEnum = NhomTaiLieuEnum;

  // Chứa dữ liệu translate
  public dataTranslate: any;

  public loadedTabState: any = {
    [ThamDoKhoangSanTabEnum.ThongTinHoSo]: false,
    [ThamDoKhoangSanTabEnum.TaiLieuHoSoDinhKem]: false,
    [ThamDoKhoangSanTabEnum.TaiLieuXuLyHoSoDinhKem]: false,
    [ThamDoKhoangSanTabEnum.ThongTinDangKy]: false,
  };

  public disabledTabState: any = {
    [ThamDoKhoangSanTabEnum.ThongTinHoSo]: true,
    [ThamDoKhoangSanTabEnum.TaiLieuHoSoDinhKem]: true,
    [ThamDoKhoangSanTabEnum.TaiLieuXuLyHoSoDinhKem]: true,
    [ThamDoKhoangSanTabEnum.ThongTinDangKy]: true,
  };


  constructor(public matSidenavService: MatsidenavService,
              private activatedRoute: ActivatedRoute,
              private dangKyHoatDongKhoangSanFacadeService: DangKyHoatDongKhoangSanFacadeService,
              private translate: TranslateService,
              private hoSoGiayToFacadeService: HoSoGiayToFacadeService) {
  }

  async ngOnInit() {
    this.activatedRoute.queryParamMap.subscribe((param: any) => {
      if (param && param.params && param.params.idhoso) {
        this.idhoso = param.params.idhoso;
      }
    });

    // Gọi hàm lấy dữ liệu translate
    await this.getDataTranslate();
    let existedDangKyChuyenNhuong = false;

    if (this.idhoso !== null && this.idhoso !== undefined) {
      const hoSoItem = await this.getHoSoById(this.idhoso);

      if (hoSoItem) {
        this.currentAction = HoSoActionEnum.Edit;
        this.setDisabledTabState(this.currentAction);

        const dkChuyenNhuongItem = await this.getDangKyChuyenNhuongByIdHoSo(hoSoItem.loaicapphep, this.idhoso);

        if (dkChuyenNhuongItem) {
          existedDangKyChuyenNhuong = true;
        }
      } else {
        this.currentAction = HoSoActionEnum.None;
      }
    } else {
      this.currentAction = HoSoActionEnum.Add;
      this.setDisabledTabState(this.currentAction);
    }

    // Khởi tạo dữ liệu ban đầu  cho form hoso
    this.hoSoIOComp.idhoso = this.idhoso;
    await this.hoSoIOComp.manualDataInit();
    this.hoSoIOComp.currentAction = this.currentAction;
    this.hoSoIOComp.disabledLoaiCapPhepSelectionState = existedDangKyChuyenNhuong;
    this.dangKyChuyenNhuongQuyenTabs.selectedIndex = this.TabType.ThongTinHoSo;
    this.dangKyChuyenNhuongQuyenTabs.realignInkBar();
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
   * Lấy dữ liệu hồ sơ theo IdHoSo
   * @param idHoSo
   */
  private async getHoSoById(idHoSo: string) {
    const hoSoGiayToFacadeService = this.hoSoGiayToFacadeService.getHoSoService();
    const hosoItem = await hoSoGiayToFacadeService.getByid(idHoSo).toPromise();
    return hosoItem;
  }

  /**
   * Lấy dữ liệu hồ sơ theo IdHoSo
   * @param idHoSo
   */
  private async getDangKyChuyenNhuongByIdHoSo(loaiCapPhep: string, idHoSo: string) {
    if (loaiCapPhep === LoaiCapPhepEnum.ChuyenNhuongQuyenThamDoKhoangSan) {
      const dkChuyenNhuongKhoangSanService = this.dangKyHoatDongKhoangSanFacadeService.getDangKyThamDoChuyenNhuongService();
      const dangKyItem = await dkChuyenNhuongKhoangSanService.getDangKyChuyenNhuongByIdHoSo(idHoSo).toPromise();
      return dangKyItem;
    } else if (loaiCapPhep === LoaiCapPhepEnum.ChuyenNhuongQuyenKhaiThacKhoangSan) {
      const dkChuyenNhuongKhoangSanService = this.dangKyHoatDongKhoangSanFacadeService.getDangKyKhaiThacChuyenNhuongService();
      const dangKyItem = await dkChuyenNhuongKhoangSanService.getDangKyChuyenNhuongByIdHoSo(idHoSo).toPromise();
      return dangKyItem;
    }
  }

  setDisabledTabState(actionType: number) {
    switch (actionType) {
      case HoSoActionEnum.Add: {
        this.disabledTabState[ThamDoKhoangSanTabEnum.ThongTinHoSo] = false;
        this.disabledTabState[ThamDoKhoangSanTabEnum.TaiLieuHoSoDinhKem] = true;
        this.disabledTabState[ThamDoKhoangSanTabEnum.TaiLieuXuLyHoSoDinhKem] = true;
        this.disabledTabState[ThamDoKhoangSanTabEnum.ThongTinDangKy] = true;
        break;
      }
      case HoSoActionEnum.Edit: {
        this.disabledTabState[ThamDoKhoangSanTabEnum.ThongTinHoSo] = false;
        this.disabledTabState[ThamDoKhoangSanTabEnum.TaiLieuHoSoDinhKem] = false;
        this.disabledTabState[ThamDoKhoangSanTabEnum.TaiLieuXuLyHoSoDinhKem] = false;
        this.disabledTabState[ThamDoKhoangSanTabEnum.ThongTinDangKy] = false;
        break;
      }
      default: {
        this.disabledTabState[ThamDoKhoangSanTabEnum.ThongTinHoSo] = true;
        this.disabledTabState[ThamDoKhoangSanTabEnum.TaiLieuHoSoDinhKem] = true;
        this.disabledTabState[ThamDoKhoangSanTabEnum.TaiLieuXuLyHoSoDinhKem] = true;
        this.disabledTabState[ThamDoKhoangSanTabEnum.ThongTinDangKy] = true;
        break;
      }
    }
  }

  private resetLoadedTabState() {
    this.loadedTabState[ThamDoKhoangSanTabEnum.TaiLieuHoSoDinhKem] = false;
    this.loadedTabState[ThamDoKhoangSanTabEnum.TaiLieuXuLyHoSoDinhKem] = false;
    this.loadedTabState[ThamDoKhoangSanTabEnum.ThongTinDangKy] = false;
  }

  getHoSoIoFormState(action: number) {
    this.currentAction = action;
    this.setDisabledTabState(this.currentAction);
    this.resetLoadedTabState();
  }

  getIdHoSo(id: string) {
    this.idhoso = id;
  }

  getThongTinDangKyChuyenNhuongFormState(action: number) {
    if (action === DangKyThamDoActionEnum.Edit) {
      this.hoSoIOComp.disabledLoaiCapPhepSelectionState = true;
    } else {
      this.hoSoIOComp.disabledLoaiCapPhepSelectionState = false;
    }
  }

  closeIOSidenav() {
    this.matSidenavService.close();
  }

  async tabChange(index: any) {
    if (index === ThamDoKhoangSanTabEnum.TaiLieuHoSoDinhKem && !this.loadedTabState[ThamDoKhoangSanTabEnum.TaiLieuHoSoDinhKem]) {
      this.taiLieuBatBuocListComp.matSidenav = this.matSidenav;
      this.taiLieuBatBuocListComp.content = this.content;
      this.taiLieuBatBuocListComp.idhoso = this.idhoso;
      this.taiLieuBatBuocListComp.title = this.dataTranslate.DANGKYHOATDONGKHOANGSAN.tailieu.requiredTitleList;
      const loadedTaiLieuBatBuocState = await this.taiLieuBatBuocListComp.manualDataInit();
      this.taiLieuKhacListComp.matSidenav = this.matSidenav;
      this.taiLieuKhacListComp.content = this.content;
      this.taiLieuKhacListComp.idhoso = this.idhoso;
      this.taiLieuKhacListComp.title = this.dataTranslate.DANGKYHOATDONGKHOANGSAN.tailieu.differentTitleList;
      const loadedTaiLieuKhacState = await this.taiLieuKhacListComp.manualDataInit();
      this.loadedTabState[ThamDoKhoangSanTabEnum.TaiLieuHoSoDinhKem] = loadedTaiLieuBatBuocState || loadedTaiLieuKhacState;
    } else if (index === ThamDoKhoangSanTabEnum.TaiLieuXuLyHoSoDinhKem && !this.loadedTabState[ThamDoKhoangSanTabEnum.TaiLieuXuLyHoSoDinhKem]) {
      this.taiLieuXuLyHoSoListComp.matSidenav = this.matSidenav;
      this.taiLieuXuLyHoSoListComp.content = this.content;
      this.taiLieuXuLyHoSoListComp.idhoso = this.idhoso;
      this.taiLieuXuLyHoSoListComp.title = this.dataTranslate.DANGKYHOATDONGKHOANGSAN.tailieu.titleList;
      this.loadedTabState[ThamDoKhoangSanTabEnum.TaiLieuXuLyHoSoDinhKem] = await this.taiLieuXuLyHoSoListComp.manualDataInit();
    } else if (index === ThamDoKhoangSanTabEnum.ThongTinDangKy && !this.loadedTabState[ThamDoKhoangSanTabEnum.ThongTinDangKy]) {
      this.thongTinDangKyComp.matSidenav = this.matSidenav;
      this.thongTinDangKyComp.content = this.content;
      this.thongTinDangKyComp.idhoso = this.idhoso;
      this.loadedTabState[ThamDoKhoangSanTabEnum.ThongTinDangKy] = await this.thongTinDangKyComp.manualDataInit();
    }
  }

}
