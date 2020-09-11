import { Component, OnInit } from '@angular/core';
import { MenuThamDoKhoangSanChitiet } from 'src/app/shared/constants/sub-menus/dangkyhoatdongkhoangsan/dangkyhoatdongkhoangsan';
import { ActivatedRoute } from '@angular/router';
import { HoSoActionEnum, ThamDoKhoangSanTabEnum, NhomLoaiCapPhep, InsertedState } from 'src/app/shared/constants/enum';

@Component({
  selector: 'app-thamdokhoangsan-io',
  templateUrl: './thamdokhoangsan-io.component.html',
  styleUrls: ['./thamdokhoangsan-io.component.scss']
})
export class ThamdokhoangsanIoComponent implements OnInit {
  // Chứa dữ liệu menu item trên subheader
  public navArray = MenuThamDoKhoangSanChitiet;

  public currentAction: number;

  public TabType = ThamDoKhoangSanTabEnum;

  public ActionType = HoSoActionEnum;

  private idhoso: string;

  public insertedState = InsertedState;

  public nhomLoaiCapPhepEnum = NhomLoaiCapPhep;

  public loadedTabState: any = {
    [ThamDoKhoangSanTabEnum.ThongTinHoSo] : false,
    [ThamDoKhoangSanTabEnum.TaiLieuHoSoDinhKem] : false,
    [ThamDoKhoangSanTabEnum.TaiLieuXuLyHoSoDinhKem] : false,
    [ThamDoKhoangSanTabEnum.ThongTinDangKy] : false,
  };

  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.queryParamMap.subscribe((param: any) => {
      this.idhoso = param.params.idhoso;
    });

    if (this.idhoso !== null && this.idhoso !== undefined) {
      this.currentAction = HoSoActionEnum.Edit;
      this.setThamDoKhoangSanTabState(this.currentAction);
    } else {
      this.currentAction = HoSoActionEnum.Add;
      this.setThamDoKhoangSanTabState(this.currentAction);
    }
  }

  setThamDoKhoangSanTabState(actionType: number) {
    switch(actionType) {
      case HoSoActionEnum.Add: {
        this.loadedTabState[ThamDoKhoangSanTabEnum.ThongTinHoSo] = true;
        this.loadedTabState[ThamDoKhoangSanTabEnum.TaiLieuHoSoDinhKem] = false,
        this.loadedTabState[ThamDoKhoangSanTabEnum.TaiLieuXuLyHoSoDinhKem] = false;
        this.loadedTabState[ThamDoKhoangSanTabEnum.ThongTinDangKy] = false;
        break;
      }
      case HoSoActionEnum.Edit: {
        this.loadedTabState[ThamDoKhoangSanTabEnum.ThongTinHoSo] = true;
        this.loadedTabState[ThamDoKhoangSanTabEnum.TaiLieuHoSoDinhKem] = true,
        this.loadedTabState[ThamDoKhoangSanTabEnum.TaiLieuXuLyHoSoDinhKem] = true;
        this.loadedTabState[ThamDoKhoangSanTabEnum.ThongTinDangKy] = true;
        break;
      }
      default: {
        this.loadedTabState[ThamDoKhoangSanTabEnum.ThongTinHoSo] = false;
        this.loadedTabState[ThamDoKhoangSanTabEnum.TaiLieuHoSoDinhKem] = false,
        this.loadedTabState[ThamDoKhoangSanTabEnum.TaiLieuXuLyHoSoDinhKem] = false;
        this.loadedTabState[ThamDoKhoangSanTabEnum.ThongTinDangKy] = false;
        break;
      }
    }
  }

  public getHoSoIoFormState(action: number) {
    this.currentAction = action;
  }
}
