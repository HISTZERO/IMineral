import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { MenuThamDoKhoangSanChitiet } from 'src/app/shared/constants/sub-menus/dangkyhoatdongkhoangsan/dangkyhoatdongkhoangsan';
import { ActivatedRoute } from '@angular/router';
import { HoSoActionEnum, ThamDoKhoangSanTabEnum, NhomLoaiCapPhepEnum, InsertedState, NhomTaiLieuEnum } from 'src/app/shared/constants/enum';
import { HosotailieuListComponent } from '../../hosotailieu/hosotailieu-list/hosotailieu-list.component';
import { TranslateService } from '@ngx-translate/core';
import { MatsidenavService } from 'src/app/services/utilities/matsidenav.service';
import { MatSidenav } from '@angular/material';

@Component({
  selector: 'app-thamdokhoangsan-io',
  templateUrl: './thamdokhoangsan-io.component.html',
  styleUrls: ['./thamdokhoangsan-io.component.scss']
})
export class ThamdokhoangsanIoComponent implements OnInit {
  @ViewChild("aside", { static: true }) public matSidenav: MatSidenav;
  @ViewChild("compio", { read: ViewContainerRef, static: true }) public content: ViewContainerRef;
  @ViewChild("taiLieuBatBuocListComp", { static: false }) taiLieuBatBuocListComp: HosotailieuListComponent;
  @ViewChild("taiLieuKhacListComp", { static: false }) taiLieuKhacListComp: HosotailieuListComponent;
  @ViewChild("taiLieuXuLyHoSoListComp", { static: false }) taiLieuXuLyHoSoListComp: HosotailieuListComponent;
  // Chứa dữ liệu menu item trên subheader
  public navArray = MenuThamDoKhoangSanChitiet;

  public currentAction: number;

  // Chứa data select tab mặc định
  public selectedDefaultTab: number;

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
              private translate: TranslateService) { }

  async ngOnInit() {
    this.activatedRoute.queryParamMap.subscribe((param: any) => {
      this.idhoso = param.params.idhoso;
    });

    // Gọi hàm lấy dữ liệu translate
    await this.getDataTranslate();

    if (this.idhoso !== null && this.idhoso !== undefined) {
      this.currentAction = HoSoActionEnum.Edit;
      this.setThamDoKhoangSanDisabledTabState(this.currentAction);
    } else {
      this.currentAction = HoSoActionEnum.Add;
      this.setThamDoKhoangSanDisabledTabState(this.currentAction);
    }

    this.selectedDefaultTab = ThamDoKhoangSanTabEnum.ThongTinHoSo;
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
    }
  }
}
