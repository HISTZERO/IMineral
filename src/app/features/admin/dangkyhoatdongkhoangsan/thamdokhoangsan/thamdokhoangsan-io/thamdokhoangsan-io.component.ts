import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MatSidenav } from '@angular/material';
import { ActivatedRoute } from '@angular/router';

import { HoSoActionEnum, ThamDoKhoangSanTabEnum, NhomLoaiCapPhepEnum, InsertedState, NhomTaiLieuEnum, DangKyThamDoActionEnum } from 'src/app/shared/constants/enum';
import { ButtonBackThamDoKhoangSan, MenuThamDoKhoangSanChitiet } from 'src/app/shared/constants/sub-menus/dangkyhoatdongkhoangsan/dangkyhoatdongkhoangsan';
import { HosotailieuListComponent } from 'src/app/features/admin/dangkyhoatdongkhoangsan/hosotailieu/hosotailieu-list/hosotailieu-list.component';
import { MatsidenavService } from 'src/app/services/utilities/matsidenav.service';
import { ThongtindangkyComponent } from 'src/app/features/admin/dangkyhoatdongkhoangsan/thamdokhoangsan/thongtindangky/thongtindangky.component';
import { HosoIoComponent } from '../../hoso/hoso-io/hoso-io.component';
import { DangKyHoatDongKhoangSanFacadeService } from 'src/app/services/admin/dangkyhoatdongkhoangsan/dangkyhoatdongkhoangsan-facade.service';

@Component({
  selector: 'app-thamdokhoangsan-io',
  templateUrl: './thamdokhoangsan-io.component.html',
  styleUrls: ['./thamdokhoangsan-io.component.scss']
})
export class ThamdokhoangsanIoComponent implements OnInit {
  @ViewChild('dangKyThamDoKhoanSanTabs', {static: false}) dangKyThamDoKhoanSanTabs;
  @ViewChild("aside", { static: true }) public matSidenav: MatSidenav;
  @ViewChild("compio", { read: ViewContainerRef, static: true }) public content: ViewContainerRef;
  @ViewChild("hoSoIOComp", { static: false }) hoSoIOComp: HosoIoComponent;
  @ViewChild("taiLieuBatBuocListComp", { static: false }) taiLieuBatBuocListComp: HosotailieuListComponent;
  @ViewChild("taiLieuKhacListComp", { static: false }) taiLieuKhacListComp: HosotailieuListComponent;
  @ViewChild("taiLieuXuLyHoSoListComp", { static: false }) taiLieuXuLyHoSoListComp: HosotailieuListComponent;
  @ViewChild("thongTinDangKyComp", { static: false }) thongTinDangKyComp: ThongtindangkyComponent;
  // Chứa dữ liệu menu item trên subheader
  public navArray = MenuThamDoKhoangSanChitiet;

  // Chứa dữ liệu nút quay lại trên subheader
  public btnArray = ButtonBackThamDoKhoangSan;

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
    [ThamDoKhoangSanTabEnum.ThongTinHoSo] : false,
    [ThamDoKhoangSanTabEnum.TaiLieuHoSoDinhKem] : false,
    [ThamDoKhoangSanTabEnum.TaiLieuXuLyHoSoDinhKem] : false,
    [ThamDoKhoangSanTabEnum.ThongTinDangKy] : false,
  };

  public disabledTabState: any = {
    [ThamDoKhoangSanTabEnum.ThongTinHoSo] : false,
    [ThamDoKhoangSanTabEnum.TaiLieuHoSoDinhKem] : false,
    [ThamDoKhoangSanTabEnum.TaiLieuXuLyHoSoDinhKem] : false,
    [ThamDoKhoangSanTabEnum.ThongTinDangKy] : false,
  };


  constructor(public matSidenavService: MatsidenavService,
              private activatedRoute: ActivatedRoute,
              private dangKyHoatDongKhoangSanFacadeService: DangKyHoatDongKhoangSanFacadeService,
              private translate: TranslateService) { }

  async ngOnInit() {
    this.activatedRoute.queryParamMap.subscribe((param: any) => {
      if (param && param.params && param.params.idhoso) {
        this.idhoso = param.params.idhoso;
      }
    });

    // Gọi hàm lấy dữ liệu translate
    await this.getDataTranslate();
    let existedDangKyThamDo = false;

    if (this.idhoso !== null && this.idhoso !== undefined) {
      this.currentAction = HoSoActionEnum.Edit;
      this.setThamDoKhoangSanDisabledTabState(this.currentAction);

      const dkThamDoItem = await this.getDangKyThamDoByIdHoSo(this.idhoso);

      if (dkThamDoItem) {
        existedDangKyThamDo = true;
      }
    } else {
      this.currentAction = HoSoActionEnum.Add;
      this.setThamDoKhoangSanDisabledTabState(this.currentAction);
    }

    // Khởi tạo dữ liệu ban đầu  cho form hoso
    this.hoSoIOComp.idhoso = this.idhoso;
    await this.hoSoIOComp.manualDataInit();
    this.hoSoIOComp.disabledLoaiCapPhepSelectionState = existedDangKyThamDo;
    this.dangKyThamDoKhoanSanTabs.realignInkBar();
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
  private async getDangKyThamDoByIdHoSo(idHoSo: string) {
    const dkThamDoKhoangSanService = this.dangKyHoatDongKhoangSanFacadeService.getDangKyThamDoKhoangSanService();
    const dangKyItem = await dkThamDoKhoangSanService.getDangKyThamDoByIdHoSo(idHoSo).toPromise();
    return dangKyItem;
  }

  setThamDoKhoangSanDisabledTabState(actionType: number) {
    switch(actionType) {
      case HoSoActionEnum.Add: {
        this.disabledTabState[ThamDoKhoangSanTabEnum.ThongTinHoSo] = true;
        this.disabledTabState[ThamDoKhoangSanTabEnum.TaiLieuHoSoDinhKem] = false,
        this.disabledTabState[ThamDoKhoangSanTabEnum.TaiLieuXuLyHoSoDinhKem] = false;
        this.disabledTabState[ThamDoKhoangSanTabEnum.ThongTinDangKy] = false;
        break;
      }
      case HoSoActionEnum.Edit: {
        this.disabledTabState[ThamDoKhoangSanTabEnum.ThongTinHoSo] = true;
        this.disabledTabState[ThamDoKhoangSanTabEnum.TaiLieuHoSoDinhKem] = true,
        this.disabledTabState[ThamDoKhoangSanTabEnum.TaiLieuXuLyHoSoDinhKem] = true;
        this.disabledTabState[ThamDoKhoangSanTabEnum.ThongTinDangKy] = true;
        break;
      }
      default: {
        this.disabledTabState[ThamDoKhoangSanTabEnum.ThongTinHoSo] = false;
        this.disabledTabState[ThamDoKhoangSanTabEnum.TaiLieuHoSoDinhKem] = false,
        this.disabledTabState[ThamDoKhoangSanTabEnum.TaiLieuXuLyHoSoDinhKem] = false;
        this.disabledTabState[ThamDoKhoangSanTabEnum.ThongTinDangKy] = false;
        break;
      }
    }
  }

  getHoSoIoFormState(action: number) {
    this.currentAction = action;
    this.setThamDoKhoangSanDisabledTabState(this.currentAction);
  }

  getIdHoSo(id: string) {
    this.idhoso = id;
  }

  getThongTinDangKyThamDoFormState(action: number) {
    if (action=== DangKyThamDoActionEnum.Edit) {
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
      const loadedTaiLieuBatBuocState =  await this.taiLieuBatBuocListComp.manualDataInit();
      this.taiLieuKhacListComp.matSidenav = this.matSidenav;
      this.taiLieuKhacListComp.content = this.content;
      this.taiLieuKhacListComp.idhoso = this.idhoso;
      this.taiLieuKhacListComp.title = this.dataTranslate.DANGKYHOATDONGKHOANGSAN.tailieu.differentTitleList;
      const loadedTaiLieuKhacState =  await this.taiLieuKhacListComp.manualDataInit();
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
