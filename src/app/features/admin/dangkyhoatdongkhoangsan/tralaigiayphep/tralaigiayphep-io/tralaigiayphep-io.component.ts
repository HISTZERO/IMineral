import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MatSidenav } from '@angular/material';
import { ActivatedRoute } from '@angular/router';

import { ButtonBackTraLaiGiayPhep, MenuDkTraLaiGiayPhepChitiet } from 'src/app/shared/constants/sub-menus/dangkyhoatdongkhoangsan/dangkyhoatdongkhoangsan';
import { HoSoActionEnum, TraLaiGiayPhepTabEnum, InsertedState, NhomTaiLieuEnum, DangKyThamDoActionEnum, LoaiCapPhepEnum } from 'src/app/shared/constants/enum';
import { HosotailieuListComponent } from 'src/app/features/admin/hosogiayto/hosotailieu/hosotailieu-list/hosotailieu-list.component';
import { MatsidenavService } from 'src/app/services/utilities/matsidenav.service';
import { NhomLoaiCapPhepEnum } from "src/app/shared/constants/nhomloaicapphep-constants";
import { HosoIoComponent } from "src/app/features/admin/hosogiayto/hoso/hoso-io/hoso-io.component";
import { DangKyHoatDongKhoangSanFacadeService } from "src/app/services/admin/dangkyhoatdongkhoangsan/dangkyhoatdongkhoangsan-facade.service";
import { TralaigiayphepThongtindangkyComponent } from "src/app/features/admin/dangkyhoatdongkhoangsan/tralaigiayphep/tralaigiayphep-thongtindangky/tralaigiayphep-thongtindangky.component";

@Component({
  selector: 'app-tralaigiayphep-io',
  templateUrl: './tralaigiayphep-io.component.html',
  styleUrls: ['./tralaigiayphep-io.component.scss']
})
export class TralaigiayphepIoComponent implements OnInit {

  @ViewChild('dangKyTraLaiTabs', { static: false }) dangKyTraLaiTabs;
  @ViewChild("aside", { static: true }) public matSidenav: MatSidenav;
  @ViewChild("compio", { read: ViewContainerRef, static: true }) public content: ViewContainerRef;
  @ViewChild("hoSoIOComp", { static: false }) hoSoIOComp: HosoIoComponent;
  @ViewChild("taiLieuBatBuocListComp", { static: false }) taiLieuBatBuocListComp: HosotailieuListComponent;
  @ViewChild("taiLieuKhacListComp", { static: false }) taiLieuKhacListComp: HosotailieuListComponent;
  @ViewChild("taiLieuXuLyHoSoListComp", { static: false }) taiLieuXuLyHoSoListComp: HosotailieuListComponent;
  @ViewChild("thongTinDangKyComp", { static: false }) thongTinDangKyComp: TralaigiayphepThongtindangkyComponent;

  // Chứa dữ liệu menu item trên subheader
  public navArray = MenuDkTraLaiGiayPhepChitiet;

  // Chứa dữ liệu nút quay lại danh sách
  public btnArray = ButtonBackTraLaiGiayPhep;

  // Trạng thái hiện tại
  public currentAction: number;

  // Kiểu Tab
  public TabType = TraLaiGiayPhepTabEnum;

  // Kiểu chức năng hồ sơ
  public ActionType = HoSoActionEnum;

  // Chứa id hồ sơ
  private idhoso: string;

  // Trạng thái thêm mới
  public insertedState = InsertedState;

  // Nhóm loại cấp phép
  public nhomLoaiCapPhepEnum = NhomLoaiCapPhepEnum;

  // Nhóm tài liệu
  public nhomTaiLieuEnum = NhomTaiLieuEnum;

  // Chứa dữ liệu translate
  public dataTranslate: any;

  // Trạng thái khi load
  public loadedTabState: any = {
    [TraLaiGiayPhepTabEnum.ThongTinHoSo]: false,
    [TraLaiGiayPhepTabEnum.TaiLieuHoSoDinhKem]: false,
    [TraLaiGiayPhepTabEnum.TaiLieuXuLyHoSoDinhKem]: false,
    [TraLaiGiayPhepTabEnum.ThongTinDangKy]: false,
  };

  // Trạng thái ẩn
  public disabledTabState: any = {
    [TraLaiGiayPhepTabEnum.ThongTinHoSo]: true,
    [TraLaiGiayPhepTabEnum.TaiLieuHoSoDinhKem]: true,
    [TraLaiGiayPhepTabEnum.TaiLieuXuLyHoSoDinhKem]: true,
    [TraLaiGiayPhepTabEnum.ThongTinDangKy]: true,
  };


  constructor(
    public matSidenavService: MatsidenavService,
    private activatedRoute: ActivatedRoute,
    private dangKyHoatDongKhoangSanFacadeService: DangKyHoatDongKhoangSanFacadeService,
    private translate: TranslateService
  ) { }

  async ngOnInit() {
    this.activatedRoute.queryParamMap.subscribe((param: any) => {
      if (param && param.params && param.params.idhoso) {
        this.idhoso = param.params.idhoso;
      }
    });

    // Gọi hàm lấy dữ liệu translate
    await this.getDataTranslate();
    let existedDangKyTraLai = false;

    if (this.idhoso !== null && this.idhoso !== undefined) {
      const hoSoItem = await this.getHoSoById(this.idhoso);

      if (hoSoItem) {
        this.currentAction = HoSoActionEnum.Edit;
        this.setTraLaiGiayPhepDisabledTabState(this.currentAction);

        const dkTraLaiItem = await this.getDangKyTraLaiByIdHoSo(hoSoItem.loaicapphep, this.idhoso);

        if (dkTraLaiItem) {
          existedDangKyTraLai = true;
        }
      } else {
        this.currentAction = HoSoActionEnum.None;
      }
    } else {
      this.currentAction = HoSoActionEnum.Add;
      this.setTraLaiGiayPhepDisabledTabState(this.currentAction);
    }

    // Khởi tạo dữ liệu ban đầu  cho form hoso
    this.hoSoIOComp.idhoso = this.idhoso;
    await this.hoSoIOComp.manualDataInit();
    this.hoSoIOComp.currentAction = this.currentAction;
    this.hoSoIOComp.disabledLoaiCapPhepSelectionState = existedDangKyTraLai;
    this.dangKyTraLaiTabs.selectedIndex = this.TabType.ThongTinHoSo;
    this.dangKyTraLaiTabs.realignInkBar();
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
    const dangKyHoatDongKhoangSanFacadeService = this.dangKyHoatDongKhoangSanFacadeService.getHoSoService();
    const hosoItem = await dangKyHoatDongKhoangSanFacadeService.getByid(idHoSo).toPromise();
    return hosoItem;
  }

  /**
   * Lấy dữ liệu hồ sơ theo IdHoSo
   * @param idHoSo
   */
  private async getDangKyTraLaiByIdHoSo(loaiCapPhep: string, idHoSo: string) {
    if (loaiCapPhep === LoaiCapPhepEnum.TraLaiGiayPhepKhaiThacKhoangSan) {
      const dkKhaiThacTraLaiService = this.dangKyHoatDongKhoangSanFacadeService.getDangKyKhaiThacTraLaiService();
      const dangKyItem = await dkKhaiThacTraLaiService.getAll({ idhoso: idHoSo }).toPromise();
      return dangKyItem;
    } else if (loaiCapPhep === LoaiCapPhepEnum.TraLaiGiayPhepThamDoKhoangSan) {
      const dkThamDoTraLaiService = this.dangKyHoatDongKhoangSanFacadeService.getDangKyThamDoTraLaiService();
      const dangKyItem = await dkThamDoTraLaiService.getAll({ idhoso: idHoSo }).toPromise();
      return dangKyItem;
    } else if (loaiCapPhep === LoaiCapPhepEnum.TraLaiGiayPhepTanThuKhoangSan) {
      const dkTanThuTraLaiService = this.dangKyHoatDongKhoangSanFacadeService.getDangKyTanThuTraLaiService();
      const dangKyItem = await dkTanThuTraLaiService.getAll({ idhoso: idHoSo }).toPromise();
      return dangKyItem;
    }
  }

  setTraLaiGiayPhepDisabledTabState(actionType: number) {
    switch (actionType) {
      case HoSoActionEnum.Add: {
        this.disabledTabState[TraLaiGiayPhepTabEnum.ThongTinHoSo] = false;
        this.disabledTabState[TraLaiGiayPhepTabEnum.TaiLieuHoSoDinhKem] = true,
        this.disabledTabState[TraLaiGiayPhepTabEnum.TaiLieuXuLyHoSoDinhKem] = true;
        this.disabledTabState[TraLaiGiayPhepTabEnum.ThongTinDangKy] = true;
        break;
      }
      case HoSoActionEnum.Edit: {
        this.disabledTabState[TraLaiGiayPhepTabEnum.ThongTinHoSo] = false;
        this.disabledTabState[TraLaiGiayPhepTabEnum.TaiLieuHoSoDinhKem] = false,
        this.disabledTabState[TraLaiGiayPhepTabEnum.TaiLieuXuLyHoSoDinhKem] = false;
        this.disabledTabState[TraLaiGiayPhepTabEnum.ThongTinDangKy] = false;
        break;
      }
      default: {
        this.disabledTabState[TraLaiGiayPhepTabEnum.ThongTinHoSo] = true;
        this.disabledTabState[TraLaiGiayPhepTabEnum.TaiLieuHoSoDinhKem] = true,
        this.disabledTabState[TraLaiGiayPhepTabEnum.TaiLieuXuLyHoSoDinhKem] = true;
        this.disabledTabState[TraLaiGiayPhepTabEnum.ThongTinDangKy] = true;
        break;
      }
    }
  }

  /**
   * Hàm reset lại trạng thái Tab
   */
  private resetLoadedTabState() {
    this.loadedTabState[TraLaiGiayPhepTabEnum.TaiLieuHoSoDinhKem] = false;
    this.loadedTabState[TraLaiGiayPhepTabEnum.TaiLieuXuLyHoSoDinhKem] = false;
    this.loadedTabState[TraLaiGiayPhepTabEnum.ThongTinDangKy] = false;
  }

  /**
   * Lấy trạng thái form hồ sơ
   */
  getHoSoIoFormState(action: number) {
    this.currentAction = action;
    this.setTraLaiGiayPhepDisabledTabState(this.currentAction);
    this.resetLoadedTabState();
  }

  /**
   * Lấy id Hồ sơ
   */
  getIdHoSo(id: string) {
    this.idhoso = id;
  }

  /**
   * Lấy trạng thái thông tin đăng ký
   * @param action 
   */
  getThongTinDangKyTraLaiFormState(action: number) {
    if (action === DangKyThamDoActionEnum.Edit) {
      this.hoSoIOComp.disabledLoaiCapPhepSelectionState = true;
    } else {
      this.hoSoIOComp.disabledLoaiCapPhepSelectionState = false;
    }
  }

  /**
   * Đóng sidenav
   */
  closeIOSidenav() {
    this.matSidenavService.close();
  }

  /**
   * Hàm thay đổi Tab
   */
  async tabChange(index: any) {
    if (index === TraLaiGiayPhepTabEnum.TaiLieuHoSoDinhKem && !this.loadedTabState[TraLaiGiayPhepTabEnum.TaiLieuHoSoDinhKem]) {
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
      this.loadedTabState[TraLaiGiayPhepTabEnum.TaiLieuHoSoDinhKem] = loadedTaiLieuBatBuocState || loadedTaiLieuKhacState;
    } else if (index === TraLaiGiayPhepTabEnum.TaiLieuXuLyHoSoDinhKem && !this.loadedTabState[TraLaiGiayPhepTabEnum.TaiLieuXuLyHoSoDinhKem]) {
      this.taiLieuXuLyHoSoListComp.matSidenav = this.matSidenav;
      this.taiLieuXuLyHoSoListComp.content = this.content;
      this.taiLieuXuLyHoSoListComp.idhoso = this.idhoso;
      this.taiLieuXuLyHoSoListComp.title = this.dataTranslate.DANGKYHOATDONGKHOANGSAN.tailieu.titleList;
      this.loadedTabState[TraLaiGiayPhepTabEnum.TaiLieuXuLyHoSoDinhKem] = await this.taiLieuXuLyHoSoListComp.manualDataInit();
    } else if (index === TraLaiGiayPhepTabEnum.ThongTinDangKy && !this.loadedTabState[TraLaiGiayPhepTabEnum.ThongTinDangKy]) {
      this.thongTinDangKyComp.matSidenav = this.matSidenav;
      this.thongTinDangKyComp.content = this.content;
      this.thongTinDangKyComp.idhoso = this.idhoso;
      this.loadedTabState[TraLaiGiayPhepTabEnum.ThongTinDangKy] = await this.thongTinDangKyComp.manualDataInit();
    }
  }

}
