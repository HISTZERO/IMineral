import { Component, OnInit, ViewChild } from '@angular/core';
import { MenuThamDoKhoangSanChitiet } from 'src/app/shared/constants/sub-menus/dangkyhoatdongkhoangsan/dangkyhoatdongkhoangsan';
import { ActivatedRoute } from '@angular/router';
import { HoSoActionEnum, ThamDoKhoangSanTabEnum, NhomLoaiCapPhep, InsertedState, NhomTaiLieu } from 'src/app/shared/constants/enum';
import { HosotailieuListComponent } from '../../hosotailieu/hosotailieu-list/hosotailieu-list.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-thamdokhoangsan-io',
  templateUrl: './thamdokhoangsan-io.component.html',
  styleUrls: ['./thamdokhoangsan-io.component.scss']
})
export class ThamdokhoangsanIoComponent implements OnInit {
  @ViewChild("taiLieuBatBuocListComp", { static: false }) taiLieuBatBuocListComp: HosotailieuListComponent;
  @ViewChild("taiLieuKhacListComp", { static: false }) taiLieuKhacListComp: HosotailieuListComponent;
  // Chứa dữ liệu menu item trên subheader
  public navArray = MenuThamDoKhoangSanChitiet;

  public currentAction: number;

  // Chứa data select tab mặc định
  public selectedDefaultTab: number;

  public TabType = ThamDoKhoangSanTabEnum;

  public ActionType = HoSoActionEnum;

  private idhoso: string;

  public insertedState = InsertedState;

  public nhomLoaiCapPhepEnum = NhomLoaiCapPhep;

  public nhomTaiLieu = NhomTaiLieu;

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


  constructor(private activatedRoute: ActivatedRoute,
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

  public getHoSoIoFormState(action: number) {
    this.currentAction = action;
    this.setThamDoKhoangSanDisabledTabState(this.currentAction);
  }

  public getIdHoSo(id: string) {
    this.idhoso = id;
  }

  async tabChange(index: any) {
    if (index === ThamDoKhoangSanTabEnum.TaiLieuHoSoDinhKem && !this.loadedTabState[ThamDoKhoangSanTabEnum.TaiLieuHoSoDinhKem]) {
      this.taiLieuBatBuocListComp.idhoso = this.idhoso;
      this.taiLieuBatBuocListComp.title = this.dataTranslate.DANGKYHOATDONGKHOANGSAN.tailieu.requiredTitleList;
      const loadedTaiLieuBatBuocState = await this.taiLieuBatBuocListComp.manualInit();
      this.taiLieuKhacListComp.idhoso = this.idhoso;
      this.taiLieuKhacListComp.title = this.dataTranslate.DANGKYHOATDONGKHOANGSAN.tailieu.differentTitleList;
      const loadedTaiLieuKhacState = await this.taiLieuKhacListComp.manualInit();
      this.loadedTabState[ThamDoKhoangSanTabEnum.TaiLieuHoSoDinhKem] = loadedTaiLieuBatBuocState || loadedTaiLieuKhacState;
    }
  }
}
