import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MatSidenav } from '@angular/material';
import { ActivatedRoute } from '@angular/router';

import { ButtonBackKhaiThacKhoangSan, MenuDkKhaiThacKhoangSanChitiet } from 'src/app/shared/constants/sub-menus/dangkyhoatdongkhoangsan/dangkyhoatdongkhoangsan';
import { HoSoActionEnum, KhaiThacKhoangSanTabEnum, InsertedState, NhomTaiLieuEnum, LoaiCapPhepEnum, DangKyThamDoActionEnum, DangKyKhaiThacKsActionEnum } from 'src/app/shared/constants/enum';
import { HosotailieuListComponent } from 'src/app/features/admin/hosogiayto/hosotailieu/hosotailieu-list/hosotailieu-list.component';
import { MatsidenavService } from 'src/app/services/utilities/matsidenav.service';
import { NhomLoaiCapPhepEnum } from "src/app/shared/constants/nhomloaicapphep-constants";
import { KtksThongtindangkyComponent } from "src/app/features/admin/dangkyhoatdongkhoangsan/khaithackhoangsan/ktks-thongtindangky/ktks-thongtindangky.component";
import { HosoIoComponent } from "src/app/features/admin/hosogiayto/hoso/hoso-io/hoso-io.component";
import { DangKyHoatDongKhoangSanFacadeService } from "src/app/services/admin/dangkyhoatdongkhoangsan/dangkyhoatdongkhoangsan-facade.service";
import { HoSoGiayToFacadeService } from "src/app/services/admin/hosogiayto/hosogiayto-facade.service";


@Component({
  selector: 'app-khaithackhoangsan-io',
  templateUrl: './khaithackhoangsan-io.component.html',
  styleUrls: ['./khaithackhoangsan-io.component.scss']
})
export class KhaithackhoangsanIoComponent implements OnInit {

  @ViewChild('dangKyKhaiThacKhoanSanTabs', { static: false }) dangKyKhaiThacKhoanSanTabs;
  @ViewChild("aside", { static: true }) public matSidenav: MatSidenav;
  @ViewChild("compio", { read: ViewContainerRef, static: true }) public content: ViewContainerRef;
  @ViewChild("hoSoIOComp", { static: false }) hoSoIOComp: HosoIoComponent;
  @ViewChild("taiLieuBatBuocListComp", { static: false }) taiLieuBatBuocListComp: HosotailieuListComponent;
  @ViewChild("taiLieuKhacListComp", { static: false }) taiLieuKhacListComp: HosotailieuListComponent;
  @ViewChild("taiLieuXuLyHoSoListComp", { static: false }) taiLieuXuLyHoSoListComp: HosotailieuListComponent;
  @ViewChild("thongTinDangKyComp", { static: false }) thongTinDangKyComp: KtksThongtindangkyComponent;

  // Chứa dữ liệu menu item trên subheader
  public navArray = MenuDkKhaiThacKhoangSanChitiet;

  // Chứa dữ liệu nút quay lại danh sách
  public btnArray = ButtonBackKhaiThacKhoangSan;

  // Hành động trước
  public currentAction: number;

  // Kiểu của tab
  public TabType = KhaiThacKhoangSanTabEnum;

  // Hành động chức năng của hồ sơ
  public ActionType = HoSoActionEnum;

  // Chứa id hồ sơ
  private idhoso: string;

  // Trạng thái insert
  public insertedState = InsertedState;

  // Chứa nhóm loại cấp phép
  public nhomLoaiCapPhepEnum = NhomLoaiCapPhepEnum;

  // Chứa nhóm tài liệu
  public nhomTaiLieuEnum = NhomTaiLieuEnum;

  // Chứa dữ liệu translate
  public dataTranslate: any;

  // Trạng thái load tab
  public loadedTabState: any = {
    [KhaiThacKhoangSanTabEnum.ThongTinHoSo]: false,
    [KhaiThacKhoangSanTabEnum.TaiLieuHoSoDinhKem]: false,
    [KhaiThacKhoangSanTabEnum.TaiLieuXuLyHoSoDinhKem]: false,
    [KhaiThacKhoangSanTabEnum.ThongTinDangKy]: false,
  };

  // Trạng thái ẩn tab
  public disabledTabState: any = {
    [KhaiThacKhoangSanTabEnum.ThongTinHoSo]: true,
    [KhaiThacKhoangSanTabEnum.TaiLieuHoSoDinhKem]: true,
    [KhaiThacKhoangSanTabEnum.TaiLieuXuLyHoSoDinhKem]: true,
    [KhaiThacKhoangSanTabEnum.ThongTinDangKy]: true,
  };


  constructor(public matSidenavService: MatsidenavService,
    private activatedRoute: ActivatedRoute,
    private dangKyHoatDongKhoangSanFacadeService: DangKyHoatDongKhoangSanFacadeService,
    private translate: TranslateService,
    private hoSoGiayToFacadeService: HoSoGiayToFacadeService) { }

  async ngOnInit() {
    this.activatedRoute.queryParamMap.subscribe((param: any) => {
      if (param && param.params && param.params.idhoso) {
        this.idhoso = param.params.idhoso;
      }
    });

    // Gọi hàm lấy dữ liệu translate
    await this.getDataTranslate();
    let existedDangKyKhaiThac = false;

    if (this.idhoso !== null && this.idhoso !== undefined) {
      const hoSoItem = await this.getHoSoById(this.idhoso);

      if (hoSoItem) {
        this.currentAction = HoSoActionEnum.Edit;
        this.setDisabledTabState(this.currentAction);

        const dkThamDoItem = await this.getDangKyKhaiThacByIdHoSo(hoSoItem.loaicapphep, this.idhoso);

        if (dkThamDoItem) {
          existedDangKyKhaiThac = true;
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
    this.hoSoIOComp.disabledLoaiCapPhepSelectionState = existedDangKyKhaiThac;
    this.dangKyKhaiThacKhoanSanTabs.selectedIndex = this.TabType.ThongTinHoSo;
    this.dangKyKhaiThacKhoanSanTabs.realignInkBar();
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
    const dangKyHoatDongKhoangSanFacadeService = this.hoSoGiayToFacadeService.getHoSoService();
    const hosoItem = await dangKyHoatDongKhoangSanFacadeService.getByid(idHoSo).toPromise();
    return hosoItem;
  }

  /**
   * Lấy dữ liệu hồ sơ theo IdHoSo
   * @param idHoSo
   */
  private async getDangKyKhaiThacByIdHoSo(loaiCapPhep: string, idHoSo: string) {
    if (loaiCapPhep === LoaiCapPhepEnum.KhaiThacKhoangSan) {
      const dkKhaiThacKhoangSanService = this.dangKyHoatDongKhoangSanFacadeService.getDangKyKhaiThacKhoangSanService();
      const dangKyItem = await dkKhaiThacKhoangSanService.getAll({ idhoso: idHoSo }).toPromise();
      return dangKyItem;
    } else if (loaiCapPhep === LoaiCapPhepEnum.KhaiThacKhoangSanCoDuAnDauTu) {
      const dkKhaiThacDuanKhoangSanService = this.dangKyHoatDongKhoangSanFacadeService.getDangKyKhaiThacKhoangSanDuAnService();
      const dangKyItem = await dkKhaiThacDuanKhoangSanService.getAll({ idhoso: idHoSo }).toPromise();
      return dangKyItem;
    }
    else if (loaiCapPhep === LoaiCapPhepEnum.KhaiThacKhoangSanLamVatLieuXayDung) {
      const dkKhaiThacVLXDKhoangSanService = this.dangKyHoatDongKhoangSanFacadeService.getDangkyKhaiThacVLXDService();
      const dangKyItem = await dkKhaiThacVLXDKhoangSanService.getAll({ idhoso: idHoSo }).toPromise();
      return dangKyItem;
    }
    else if (loaiCapPhep === LoaiCapPhepEnum.DieuChinhGiayPhepKhaiThac) {
      const dkKhaiThacDieuChinhKhoangSanService = this.dangKyHoatDongKhoangSanFacadeService.getDangKyKhaiThacDieuChinhService();
      const dangKyItem = await dkKhaiThacDieuChinhKhoangSanService.getAll({ idhoso: idHoSo }).toPromise();
      return dangKyItem;
    }
    else if (loaiCapPhep === LoaiCapPhepEnum.KhaiThacKhoangSanGiaHan) {
      const dkKhaiThacGiaHanKhoangSanService = this.dangKyHoatDongKhoangSanFacadeService.getDangKyKhaiThacGiaHanService();
      const dangKyItem = await dkKhaiThacGiaHanKhoangSanService.getAll({ idhoso: idHoSo }).toPromise();
      return dangKyItem;
    }
    else if (loaiCapPhep === LoaiCapPhepEnum.ThuHoiCatSoiDuAnNaoVetKhoiThong) {
      const dkKhaiThacCatSoiKhoangSanService = this.dangKyHoatDongKhoangSanFacadeService.getDangKyKhaiThacCatSoiService();
      const dangKyItem = await dkKhaiThacCatSoiKhoangSanService.getAll({ idhoso: idHoSo }).toPromise();
      return dangKyItem;
    }
  }

  /**
   * Hàm set trạng thái các tab theo chức năng
   * @param actionType 
   */
  setDisabledTabState(actionType: number) {
    switch (actionType) {
      case HoSoActionEnum.Add: {
        this.disabledTabState[KhaiThacKhoangSanTabEnum.ThongTinHoSo] = false;
        this.disabledTabState[KhaiThacKhoangSanTabEnum.TaiLieuHoSoDinhKem] = true,
          this.disabledTabState[KhaiThacKhoangSanTabEnum.TaiLieuXuLyHoSoDinhKem] = true;
        this.disabledTabState[KhaiThacKhoangSanTabEnum.ThongTinDangKy] = true;
        break;
      }
      case HoSoActionEnum.Edit: {
        this.disabledTabState[KhaiThacKhoangSanTabEnum.ThongTinHoSo] = false;
        this.disabledTabState[KhaiThacKhoangSanTabEnum.TaiLieuHoSoDinhKem] = false,
          this.disabledTabState[KhaiThacKhoangSanTabEnum.TaiLieuXuLyHoSoDinhKem] = false;
        this.disabledTabState[KhaiThacKhoangSanTabEnum.ThongTinDangKy] = false;
        break;
      }
      default: {
        this.disabledTabState[KhaiThacKhoangSanTabEnum.ThongTinHoSo] = true;
        this.disabledTabState[KhaiThacKhoangSanTabEnum.TaiLieuHoSoDinhKem] = true,
          this.disabledTabState[KhaiThacKhoangSanTabEnum.TaiLieuXuLyHoSoDinhKem] = true;
        this.disabledTabState[KhaiThacKhoangSanTabEnum.ThongTinDangKy] = true;
        break;
      }
    }
  }

  /**
   * Hàm reset lại trạng thái tab
   */
  private resetLoadedTabState() {
    this.loadedTabState[KhaiThacKhoangSanTabEnum.TaiLieuHoSoDinhKem] = false;
    this.loadedTabState[KhaiThacKhoangSanTabEnum.TaiLieuXuLyHoSoDinhKem] = false;
    this.loadedTabState[KhaiThacKhoangSanTabEnum.ThongTinDangKy] = false;
  }

  /**
   * Hàm lấy trạng thái hồ sơ
   */
  getHoSoIoFormState(action: number) {
    this.currentAction = action;
    this.setDisabledTabState(this.currentAction);
    this.resetLoadedTabState();
  }

  /**
   * Gán id hồ sơ
   */
  getIdHoSo(id: string) {
    this.idhoso = id;
  }

  /**
   * Hàm lấy trạng thái thì tab thông tin đăng ký
   */
  getThongTinDangKyKhaiThacFormState(action: number) {
    if (action === DangKyKhaiThacKsActionEnum.Edit) {
      this.hoSoIOComp.disabledLoaiCapPhepSelectionState = true;
    } else {
      this.hoSoIOComp.disabledLoaiCapPhepSelectionState = false;
    }
  }

  /**
   * Hàm đóng sidenav
   */
  closeIOSidenav() {
    this.matSidenavService.close();
  }

  /**
   * Hàm chạy khi active vào các tab
   */
  async tabChange(index: any) {
    if (index === KhaiThacKhoangSanTabEnum.TaiLieuHoSoDinhKem && !this.loadedTabState[KhaiThacKhoangSanTabEnum.TaiLieuHoSoDinhKem]) {
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
      this.loadedTabState[KhaiThacKhoangSanTabEnum.TaiLieuHoSoDinhKem] = loadedTaiLieuBatBuocState || loadedTaiLieuKhacState;
    } else if (index === KhaiThacKhoangSanTabEnum.TaiLieuXuLyHoSoDinhKem && !this.loadedTabState[KhaiThacKhoangSanTabEnum.TaiLieuXuLyHoSoDinhKem]) {
      this.taiLieuXuLyHoSoListComp.matSidenav = this.matSidenav;
      this.taiLieuXuLyHoSoListComp.content = this.content;
      this.taiLieuXuLyHoSoListComp.idhoso = this.idhoso;
      this.taiLieuXuLyHoSoListComp.title = this.dataTranslate.DANGKYHOATDONGKHOANGSAN.tailieu.titleList;
      this.loadedTabState[KhaiThacKhoangSanTabEnum.TaiLieuXuLyHoSoDinhKem] = await this.taiLieuXuLyHoSoListComp.manualDataInit();
    } else if (index === KhaiThacKhoangSanTabEnum.ThongTinDangKy && !this.loadedTabState[KhaiThacKhoangSanTabEnum.ThongTinDangKy]) {
      this.thongTinDangKyComp.matSidenav = this.matSidenav;
      this.thongTinDangKyComp.content = this.content;
      this.thongTinDangKyComp.idhoso = this.idhoso;
      this.loadedTabState[KhaiThacKhoangSanTabEnum.ThongTinDangKy] = await this.thongTinDangKyComp.manualDataInit();
    }
  }

}
