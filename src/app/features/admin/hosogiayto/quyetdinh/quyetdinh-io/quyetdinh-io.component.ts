import { Component, OnInit, Input, ViewContainerRef, ViewChild, ComponentFactoryResolver, EventEmitter, Output } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoaiDoiTuongEnum, TrangThaiEnum, Paging, InsertedState, GiayPhepActionEnum, LoaiCapPhepEnum, LoaiVanBanEnum } from 'src/app/shared/constants/enum';
import { LoaiDoiTuong, HinhThucNopHoSo, HinhThucNhanKetQua, DangKhoangSan, DonViThoiHan, LoaiVanBan } from 'src/app/shared/constants/common-constants';
import { LoaiGiayTo } from 'src/app/shared/constants/loaigiayto-constants';
import { DmFacadeService } from "src/app/services/admin/danhmuc/danhmuc-facade.service";
import { OutputDmLoaiCapPhepModel } from 'src/app/models/admin/danhmuc/loaicapphep.model';
import { OutputHsCoQuanTiepNhanModel } from 'src/app/models/admin/thietlap/coquantiepnhan.model';
import { HethongFacadeService } from 'src/app/services/admin/hethong/hethong-facade.service';
import { CommonServiceShared } from 'src/app/services/utilities/common-service';
import { validationAllErrorMessagesService } from "src/app/services/utilities/validatorService";
import { MatsidenavService } from 'src/app/services/utilities/matsidenav.service';
import { DmCanhanOptionComponent } from "src/app/features/admin/danhmuc/canhan/canhan-option/canhan-option.component";
import { DmTochucOptionComponent } from "src/app/features/admin/danhmuc/tochuc/tochuc-option/tochuc-option.component";
import { OutputDmCanhanModel } from "src/app/models/admin/danhmuc/canhan.model";
import { OutputDmToChucModel } from "src/app/models/admin/danhmuc/tochuc.model";
import {HoSoGiayToFacadeService} from 'src/app/services/admin/hosogiayto/hosogiayto-facade.service';
import { OutputHsHoSoModel } from 'src/app/models/admin/hosogiayto/hoso.model';
import { ThietlapFacadeService } from 'src/app/services/admin/thietlap/thietlap-facade.service';
import { HosoOptionComponent } from 'src/app/features/admin/hosogiayto/hoso/hoso-option/hoso-option.component';
import { OutputGiayPhepModel } from 'src/app/models/admin/hosogiayto/giayphep.model';
import { GiayphepOptionComponent } from 'src/app/features/admin/hosogiayto/giayphep/giayphep-option/giayphep-option.component';
import { DefaultValue } from 'src/app/shared/constants/global-var';

@Component({
  selector: 'app-quyetdinh-io',
  templateUrl: './quyetdinh-io.component.html',
  styleUrls: ['./quyetdinh-io.component.scss']
})
export class QuyetdinhIoComponent implements OnInit {

  @ViewChild("compio", { read: ViewContainerRef, static: true }) public content: ViewContainerRef;
  @ViewChild("aside", { static: true }) public matSidenav: MatSidenav;
  // tslint:disable-next-line: no-output-rename
  @Output("selectCurrentFormStateEvent") selectCurrentFormStateEvent: EventEmitter<number> = new EventEmitter();
  // tslint:disable-next-line: no-output-rename
  @Output("selectNewInsertedGiayPhepEvent") selectNewInsertedGiayPhepEvent: EventEmitter<string> = new EventEmitter();
  // tslint:disable-next-line: no-input-rename
  @Input("allowAutoInit") allowAutoInit = true;
  // Lưu trữ trạng thái enable hoặc disable chọn loại cấp phép
  // tslint:disable-next-line: no-input-rename
  @Input ("disabledLoaiCapPhepSelectionState") disabledLoaiCapPhepSelectionState = false;
  // Nhóm loại cấp phép
  // tslint:disable-next-line: no-input-rename
  @Input("nhomLoaiCapPhep") nhomLoaiCapPhep;
  // State của Save button
  // tslint:disable-next-line: no-input-rename
  @Input("insertedState") insertedState = InsertedState.SaveAndRefresh;
   // Action thao tác dữ liệu
  // tslint:disable-next-line: no-input-rename
  @Input("currentAction") currentAction: number;
  // Chữ dữ liệu Action
  public ActionType = GiayPhepActionEnum;
  // Chứa dữ liệu Form
  public giayPhepIOForm: FormGroup;
  // Chứa dữ liệu translate
  public dataTranslate: any;
  // Chứa loại đối tượng
  public loaiDoiTuongList = LoaiDoiTuong;
  // Chứa dữ liệu loại văn bản
  public loaiVanBanList = LoaiVanBan;
  // Chứa dữ liệu loại đối tượng
  public dangKhoangSanList = DangKhoangSan;
  // Chứa dữ liệu loại giấy tờ
  public loaiGiayToList = LoaiGiayTo;
  public loaiGiayToFilters = LoaiGiayTo;
  // Chứa dữ liệu hình thức nộp hồ sơ
  public hinhThucNopHoSoList = HinhThucNopHoSo;
  public hinhThucNopHoSoFilters = HinhThucNopHoSo;
  // Chứa dữ liệu hình thức nhận kết quả
  public hinhThucNhanKetQuaList = HinhThucNhanKetQua;
  public hinhThucNhanKetQuaFilters = HinhThucNhanKetQua;
  // Chứa dữ liệu loại cấp phép
  public loaiCapPhepList: OutputDmLoaiCapPhepModel[];
  public loaiCapPhepFilters: OutputDmLoaiCapPhepModel[];
  // Chứa dữ liệu cơ quan tiếp nhận
  public allCoQuanCapPhep: OutputHsCoQuanTiepNhanModel[];
  public coQuanCapPhepFilters: OutputHsCoQuanTiepNhanModel[];
  // Chứa dữ liệu hồ sơ
  public hoSoList: OutputHsHoSoModel[];
  // Chứa dữ liệu Giấy phép lịch sử
  public giayPhepLichSuList: OutputGiayPhepModel[];
  // chứa dữ liệu Id Hồ sơ
  public idgiayphep: string;
  // Lưu trữ tên loại cấp phép trong trường hợp hồ sơ đã có đăng ký
  public tenLoaiCapPhep: string;
  // Lưu trữ đơn vị thời hạn
  public donViThoiHanList = DonViThoiHan;
  // disable số giấy phép lịch sử
  public disabledGiayPhepLichSu = false;
  // disable số giấy phép lịch sử
  public disabledHoSo = false;
  // Chứa thuộc tính hiển thị input theo loại cấp phép
  public showInput: boolean = false;
  // disable loại đối tượng
  public disabledLoaiDoiTuong = false;
  // error message
  validationErrorMessages = {};

  // form errors
  formErrors = {
    sogiayphep: DefaultValue.Empty,
    ngaycapphep: DefaultValue.Empty,
    ngaybdhieuluc: DefaultValue.Empty,
    ngaykthieuluc: DefaultValue.Empty,
    thoihan: DefaultValue.Empty,
    donvithoihan: DefaultValue.Empty,
    idcoquancapphep: DefaultValue.Empty,
    coquancapphep: DefaultValue.Empty,
    chucvunguoiky: DefaultValue.Empty,
    tennguoiky: DefaultValue.Empty,
    loaivanban: DefaultValue.Empty,
    loaicapphep: DefaultValue.Empty,
    idcanhantochuc: DefaultValue.Empty,
    tencanhantochuc: DefaultValue.Empty,
    sogiayto: DefaultValue.Empty,
    loaigiayto: DefaultValue.Empty,
    ngaycap:  DefaultValue.Empty,
    noicap: DefaultValue.Empty,
    diachi: DefaultValue.Empty,
    dienthoai: DefaultValue.Empty,
    fax: DefaultValue.Empty,
    email: DefaultValue.Empty,
    website: DefaultValue.Empty,
    loaidoituong: DefaultValue.Empty,
    idhoso: DefaultValue.Empty,
    idgiayphepls: DefaultValue.Empty,
    trangthai: DefaultValue.Empty,
    ghichu: DefaultValue.Empty
  };

  constructor(
    private translate: TranslateService,
    private formBuilder: FormBuilder,
    private dmFacadeService: DmFacadeService,
    private hethongFacadeService: HethongFacadeService,
    private thietlapFacadeService: ThietlapFacadeService,
    private hoSoGiayToFacadeService: HoSoGiayToFacadeService,
    public commonService: CommonServiceShared,
    private activatedRoute: ActivatedRoute,
    public matSidenavService: MatsidenavService,
    public cfr: ComponentFactoryResolver) { }

  async ngOnInit() {
    // Khởi tạo form
    this.formInit();
    // Lấy dữ liệu translate
    await this.getDataTranslate();
    // Khởi tạo sidenav
    // this.matSidenavService.setSidenav(this.matSidenav, this, this.content, this.cfr);
    // Lấy dữ liệu loại cấp phép

    if (this.allowAutoInit) {
      await this.manualDataInit();
    }
  }

  /**
   * Khởi tạo form
   */
  async manualDataInit() {
    this.activatedRoute.queryParamMap.subscribe((param: any) => {
      if (param && param.params && param.params.idgiayphep) {
        this.idgiayphep = param.params.idgiayphep;
      }
    });

    if (this.idgiayphep !== DefaultValue.Null && this.idgiayphep !== DefaultValue.Undefined
        && this.idgiayphep.trim() !== DefaultValue.Empty) {
      this.currentAction = GiayPhepActionEnum.Edit;
    } else {
      this.currentAction = GiayPhepActionEnum.Add;
    }

    await this.getLoaiCapPhepAll();
    // Lấy dữ liệu cơ quan tiếp nhận
    await this.getCoQuanCapPhepAll();
    // Khởi tạo dữ liệu form trong trường hợp sửa dữ liệu Hồ Sơ
    await this.formOnEdit();
    return true;
  }

  /**
   * Hàm khởi tạo form
   */
  private formInit() {
    this.giayPhepIOForm = this.formBuilder.group({
      sogiayphep: [DefaultValue.Empty, Validators.required],
      ngaycapphep: [DefaultValue.Empty, Validators.required],
      ngaybdhieuluc: [DefaultValue.Empty, Validators.required],
      ngaykthieuluc: [DefaultValue.Empty, Validators.required],
      thoihan: [DefaultValue.Empty, [Validators.required, Validators.pattern("^[0-9-+]+$")]],
      donvithoihan: [DefaultValue.Empty, Validators.required],
      idcoquancapphep: [DefaultValue.Empty, Validators.required],
      chucvunguoiky: [DefaultValue.Empty, Validators.required],
      tennguoiky: [DefaultValue.Empty, Validators.required],
      loaivanban: [LoaiVanBanEnum.QuyetDinh, Validators.required],
      loaicapphep: [DefaultValue.Empty, Validators.required],
      idcanhantochuc: [DefaultValue.Empty, Validators.required],
      tencanhantochuc: [DefaultValue.Empty, Validators.required],
      sogiayto: [DefaultValue.Empty, Validators.required],
      sogiaytoDisplay: [DefaultValue.Empty],
      loaigiayto: [DefaultValue.Empty, Validators.required],
      loaigiaytoDisplay: [DefaultValue.Empty],
      ngaycap:  [DefaultValue.Empty, Validators.required],
      ngaycapDisplay: [DefaultValue.Empty],
      noicap: [DefaultValue.Empty, Validators.required],
      noicapDisplay: [DefaultValue.Empty],
      diachi: [DefaultValue.Empty, Validators.required],
      diachiDisplay: [DefaultValue.Empty],
      dienthoai: [DefaultValue.Empty, Validators.pattern("^[0-9-+]+$")],
      fax: [DefaultValue.Empty],
      email: [DefaultValue.Empty],
      website: [DefaultValue.Empty],
      loaidoituong: [LoaiDoiTuongEnum.ToChuc, Validators.required],
      idhoso: [DefaultValue.Empty],
      idgiayphepls: [DefaultValue.Empty],
      trangthai: [DefaultValue.Empty],
      ghichu: [DefaultValue.Empty]
    });

    this.giayPhepIOForm.controls.tencanhantochuc.disable({ onlySelf: true });
    this.giayPhepIOForm.controls.loaigiaytoDisplay.disable({ onlySelf: true });
    this.giayPhepIOForm.controls.sogiaytoDisplay.disable({ onlySelf: true });
    this.giayPhepIOForm.controls.ngaycapDisplay.disable({ onlySelf: true });
    this.giayPhepIOForm.controls.noicapDisplay.disable({ onlySelf: true });
    this.giayPhepIOForm.controls.diachiDisplay.disable({ onlySelf: true });
    this.giayPhepIOForm.controls.loaivanban.disable({ onlySelf: true });
  }

  /**
   * hàm lấy dữ liệu translate
   */
  async getDataTranslate() {
    // Lấy ra biến translate của hệ thống
    this.dataTranslate = await this.translate
      .getTranslation(this.translate.getDefaultLang())
      .toPromise();
    // Hàm set validation cho form
    await this.setValidation();
  }

  /**
   * thêm mới hoặc sửa đôi dữ liệu vào danh hồ sơ
   */
  private AddOrUpdateThongTinHoSoList(item: OutputHsHoSoModel) {
    if (item && item.idhoso && item.idhoso.trim() !== DefaultValue.Empty) {
      if (this.hoSoList === DefaultValue.Null || this.hoSoList === DefaultValue.Undefined || this.hoSoList.length > 0) {
        this.hoSoList = [];
      }

      this.hoSoList.push(item);
    }
  }

  /**
   * thêm mới hoặc sửa đôi dữ liệu vào danh giấy phép
   */
  private AddOrUpdateThongTinGiayPhepLichSuList(item: OutputGiayPhepModel) {
    if (item && item.idgiayphep && item.idgiayphep.trim() !== DefaultValue.Empty) {
      if (this.giayPhepLichSuList === null || this.giayPhepLichSuList === DefaultValue.Undefined || this.giayPhepLichSuList.length > 0) {
        this.giayPhepLichSuList = [];
      }

      this.giayPhepLichSuList.push(item);
    }
  }

  /**
   * Hàm check loại cấp phép để hiển thị input tương ứng
   */
  public checkLoaiCapPhep(idLoaiCapPhep: string) {
    if (idLoaiCapPhep === LoaiCapPhepEnum.DongCuaMotPhanDienTichKhuVucKhaiThacKhoangSan || idLoaiCapPhep === LoaiCapPhepEnum.TraLaiMotPhanDienTichKhuVucKhaiThacKhoangSan || idLoaiCapPhep === LoaiCapPhepEnum.TraLaiMotPhanDienTichKhuVucThamDoKhoangSan || idLoaiCapPhep === LoaiCapPhepEnum.PheDuyetTruLuongKhoangSan) {
      this.showInput = true;
    } else {
      this.showInput = false;
    }
  }

  /**
   * hàm set value cho form
   */
  private async formOnEdit() {
    if (this.currentAction === GiayPhepActionEnum.Edit) {
      const inputModel = await this.getGiayPhepById(this.idgiayphep);

      if (inputModel) {
        this.checkLoaiCapPhep(inputModel.loaicapphep);
        if (inputModel.idhoso && inputModel.idhoso.trim() !== DefaultValue.Empty) {
          const hoSoItem = {
            idhoso: inputModel.idhoso,
            mahoso: inputModel.mahoso,
            idcanhantochuc: inputModel.idcanhantochuc,
            tencanhantochuc: inputModel.tencanhantochuc,
            sogiayto: inputModel.sogiayto,
            loaigiayto: inputModel.loaigiayto,
            ngaycap:  inputModel.ngaycap,
            noicap: inputModel.noicap,
            diachi: inputModel.diachi,
            dienthoai: inputModel.dienthoai,
            email: inputModel.email,
            fax: inputModel.fax,
            website: inputModel.website,
            loaidoituong: inputModel.loaidoituong

          } as OutputHsHoSoModel;

          this.AddOrUpdateThongTinHoSoList(hoSoItem);
          this.disabledLoaiDoiTuong = true;
          this.disabledGiayPhepLichSu = true;
        }

        const giayPhepLichSu = Object.assign(new OutputGiayPhepModel(), inputModel);

        if (inputModel.idgiayphepls && inputModel.idgiayphepls.trim() !== DefaultValue.Empty) {
          giayPhepLichSu.idgiayphep = inputModel.idgiayphepls;
          giayPhepLichSu.sogiayphep = inputModel.sogiayphepls;
          this.AddOrUpdateThongTinGiayPhepLichSuList(giayPhepLichSu);
          this.disabledLoaiDoiTuong = true;
          this.disabledHoSo = true;
        }

        this.giayPhepIOForm.setValue({
          sogiayphep: inputModel.sogiayphep,
          ngaycapphep: inputModel.ngaycapphep,
          ngaybdhieuluc: inputModel.ngaybdhieuluc,
          ngaykthieuluc: inputModel.ngaykthieuluc,
          thoihan: inputModel.thoihan,
          donvithoihan: inputModel.donvithoihan,
          idcoquancapphep: inputModel.idcoquancapphep,
          chucvunguoiky: inputModel.chucvunguoiky,
          tennguoiky: inputModel.tennguoiky,
          loaivanban: inputModel.loaivanban,
          loaicapphep: inputModel.loaicapphep,
          idcanhantochuc: inputModel.idcanhantochuc,
          tencanhantochuc: inputModel.tencanhantochuc,
          sogiayto: inputModel.sogiayto,
          sogiaytoDisplay: inputModel.sogiayto,
          loaigiayto: inputModel.loaigiayto,
          loaigiaytoDisplay: inputModel.loaigiayto,
          ngaycap:  inputModel.ngaycap,
          ngaycapDisplay:  inputModel.ngaycap,
          noicap: inputModel.noicap,
          noicapDisplay: inputModel.noicap,
          diachi: inputModel.diachi,
          diachiDisplay: inputModel.diachi,
          dienthoai: inputModel.dienthoai,
          fax: inputModel.fax,
          email: inputModel.email,
          website: inputModel.website,
          loaidoituong: inputModel.loaidoituong,
          idhoso: inputModel.idhoso,
          idgiayphepls: inputModel.idgiayphepls,
          trangthai: inputModel.trangthai,
          ghichu: inputModel.ghichu
        });

        this.tenLoaiCapPhep = inputModel.tenloaicapphep;
      }
    }
  }

  /**
   * Hàm set validate
   */
  private setValidation() {
    this.validationErrorMessages = {
      sogiayphep: { required: this.dataTranslate.HOSOGIAYTO.quyetdinh.sogiayphepRequired },
      ngaycapphep: { required: this.dataTranslate.HOSOGIAYTO.quyetdinh.ngaycapphepRequired },
      ngaybdhieuluc: { required: this.dataTranslate.HOSOGIAYTO.quyetdinh.ngaybdhieulucRequired },
      ngaykthieuluc: { required: this.dataTranslate.HOSOGIAYTO.quyetdinh.ngaykthieulucRequired },
      thoihan: { required: this.dataTranslate.HOSOGIAYTO.quyetdinh.thoihanRequired, pattern: this.dataTranslate.HOSOGIAYTO.quyetdinh.thoihanIsNumber },
      donvithoihan: { required: this.dataTranslate.HOSOGIAYTO.quyetdinh.donvithoihanRequired },
      idcoquancapphep: { required: this.dataTranslate.HOSOGIAYTO.quyetdinh.coquancapphepRequired },
      chucvunguoiky: { required: this.dataTranslate.HOSOGIAYTO.quyetdinh.chucvunguoikyRequired },
      tennguoiky: { required: this.dataTranslate.HOSOGIAYTO.quyetdinh.tennguoikyRequired },
      loaivanban: { required: this.dataTranslate.HOSOGIAYTO.quyetdinh.loaivanbanRequired },
      loaicapphep: { required: this.dataTranslate.HOSOGIAYTO.quyetdinh.loaicapphepRequired },
      idcanhantochuc: { required: this.dataTranslate.HOSOGIAYTO.quyetdinh.tencanhantochucRequired },
      tencanhantochuc: { required: this.dataTranslate.HOSOGIAYTO.quyetdinh.tencanhantochucRequired },
      sogiayto: { required: this.dataTranslate.HOSOGIAYTO.quyetdinh.sogiaytoRequired },
      loaigiayto: { required: this.dataTranslate.HOSOGIAYTO.quyetdinh.loaigiaytoRequired },
      ngaycap:  { required: this.dataTranslate.HOSOGIAYTO.quyetdinh.ngaycapRequired },
      noicap: { required: this.dataTranslate.HOSOGIAYTO.quyetdinh.noicapRequired },
      diachi: { required: this.dataTranslate.HOSOGIAYTO.quyetdinh.diachiRequired },
      dienthoai:  { pattern: this.dataTranslate.HOSOGIAYTO.quyetdinh.dienthoaiIsNumber },
      loaidoituong: { required: this.dataTranslate.HOSOGIAYTO.quyetdinh.loaidoituongRequired }
    };
  }

  async getLoaiCapPhepAll() {
    const listData: any = await this.dmFacadeService
      .getDmLoaiCapPhepService()
      .getFetchAll({ Nhomloaicapphep: this.nhomLoaiCapPhep, TrangThai: TrangThaiEnum.Active, PageNumber: Paging.PageNumber, PageSize: Paging.PageSize });
    this.loaiCapPhepList = listData.items;
    this.loaiCapPhepFilters = listData.items;
  }

  async getCoQuanCapPhepAll() {
    const listData: any = await this.thietlapFacadeService
      .getCoQuanCapPhepService()
      .getFetchAll({ PageNumber: Paging.PageNumber, PageSize: Paging.PageSize });
    this.allCoQuanCapPhep = listData.items;
    this.coQuanCapPhepFilters = listData.items;
  }

  /**
   * Lấy dữ liệu hồ sơ theo idGiayPhep
   * @param idGiayPhep
   */
  private async getGiayPhepById(idGiayPhep: string) {
    const giayPhepFacadeService = this.hoSoGiayToFacadeService.getGiayPhepService();
    const giayphepItem = await giayPhepFacadeService.getByid(idGiayPhep).toPromise();
    return giayphepItem;
  }

  private validatLoaiCapPhepSelection() {
    const loaiCapPhep = this.giayPhepIOForm.controls.loaicapphep.value;
    if (loaiCapPhep !== LoaiCapPhepEnum.ThamDoGiaHan && loaiCapPhep !== LoaiCapPhepEnum.ThamDoKhoangSan
      && loaiCapPhep !== LoaiCapPhepEnum.KhaiThacKhoangSanGiaHan && loaiCapPhep !== LoaiCapPhepEnum.KhaiThacTanThuKhoangSanGiaHan
      && loaiCapPhep !== LoaiCapPhepEnum.TraLaiMotPhanDienTichKhuVucKhaiThacKhoangSan && loaiCapPhep !== LoaiCapPhepEnum.TraLaiMotPhanDienTichKhuVucThamDoKhoangSan
      && loaiCapPhep !== LoaiCapPhepEnum.ChuyenNhuongQuyenKhaiThacKhoangSan && loaiCapPhep !== LoaiCapPhepEnum.ChuyenNhuongQuyenThamDoKhoangSan
      && loaiCapPhep !== LoaiCapPhepEnum.DieuChinhGiayPhepKhaiThac && loaiCapPhep !== LoaiCapPhepEnum.DongCuaMoKhoangSan
      && loaiCapPhep !== LoaiCapPhepEnum.DongCuaMotPhanDienTichKhuVucKhaiThacKhoangSan && loaiCapPhep !== LoaiCapPhepEnum.KhaiThacKhoangSanGiaHan
      && loaiCapPhep !== LoaiCapPhepEnum.KhaiThacTanThuKhoangSan ) {
      this.commonService.informationDiaLogService(
        DefaultValue.Empty,
        this.dataTranslate.HOSOGIAYTO.quyetdinh.loaicapphepInformedInvalidSelection,
        this.dataTranslate.HOSOGIAYTO.quyetdinh.informedDialogTitle);

      return false;
    }

    return true;
  }

  private validateInvalidHoSoGiayPhepSelection() {
    const loaiCapPhep = this.giayPhepIOForm.controls.loaicapphep.value;
    if (loaiCapPhep === LoaiCapPhepEnum.ThamDoGiaHan || loaiCapPhep === LoaiCapPhepEnum.ThamDoKhoangSan
      || loaiCapPhep === LoaiCapPhepEnum.KhaiThacKhoangSanGiaHan || loaiCapPhep === LoaiCapPhepEnum.KhaiThacTanThuKhoangSanGiaHan
      || loaiCapPhep === LoaiCapPhepEnum.TraLaiMotPhanDienTichKhuVucKhaiThacKhoangSan || loaiCapPhep === LoaiCapPhepEnum.TraLaiMotPhanDienTichKhuVucThamDoKhoangSan
      || loaiCapPhep === LoaiCapPhepEnum.ChuyenNhuongQuyenKhaiThacKhoangSan || loaiCapPhep === LoaiCapPhepEnum.ChuyenNhuongQuyenThamDoKhoangSan
      || loaiCapPhep === LoaiCapPhepEnum.DieuChinhGiayPhepKhaiThac || loaiCapPhep === LoaiCapPhepEnum.DongCuaMoKhoangSan
      || loaiCapPhep === LoaiCapPhepEnum.DongCuaMotPhanDienTichKhuVucKhaiThacKhoangSan || loaiCapPhep === LoaiCapPhepEnum.KhaiThacKhoangSanGiaHan
      || loaiCapPhep === LoaiCapPhepEnum.KhaiThacTanThuKhoangSan
      ) {
        const idHoSo = this.giayPhepIOForm.controls.idhoso.value;
        const idGiayPhepLS = this.giayPhepIOForm.controls.idgiayphepls.value;
        if ((idHoSo === DefaultValue.Null || idHoSo === DefaultValue.Undefined  || idHoSo.trim() === DefaultValue.Empty)
            && (idGiayPhepLS === DefaultValue.Null || idGiayPhepLS === DefaultValue.Undefined  || idGiayPhepLS.trim() === DefaultValue.Empty)) {
          this.commonService.informationDiaLogService(
            DefaultValue.Empty,
            this.dataTranslate.HOSOGIAYTO.quyetdinh.hosogiaytoInformedRequiredSelection,
            this.dataTranslate.HOSOGIAYTO.quyetdinh.informedDialogTitle
          );
          return false;
        }

        return true;
      }

    return true;
  }


  async saveItemGiayPhep() {
    this.logAllValidationErrorMessages();

    if (!this.giayPhepIOForm.valid) {
      return;
    }

    if (!this.validatLoaiCapPhepSelection()) {
      return;
    }

    if (!this.validateInvalidHoSoGiayPhepSelection()) {
      return;
    }

    // Gán dữ liệu input vào model
    const giayPhepFacadeService = this.hoSoGiayToFacadeService.getGiayPhepService();
    const inputModel = this.giayPhepIOForm.value;
    const currentLoaiCapPhep = this.loaiCapPhepList.find(item => item.maloaicapphep === this.giayPhepIOForm.controls.loaicapphep.value);
    inputModel.nhomloaicapphep = currentLoaiCapPhep.nhomloaicapphep;
    inputModel.tencanhantochuc = this.giayPhepIOForm.controls.tencanhantochuc.value;
    const coQuanCapPhepItem = this.allCoQuanCapPhep.find(item => item.idcoquanquanly === inputModel.idcoquancapphep);
    inputModel.coquancapphep = coQuanCapPhepItem.tencoquanquanly;
    if (this.currentAction === GiayPhepActionEnum.Add && (this.insertedState === InsertedState.SaveAndRefresh || this.insertedState === InsertedState.SaveAndEdit)) {
      giayPhepFacadeService.addItem(inputModel).subscribe(
        async (res) => {
          if (this.insertedState === InsertedState.SaveAndEdit) {
            this.idgiayphep = res.idgiayphep;
            this.currentAction = GiayPhepActionEnum.Edit;
            await this.formOnEdit();
            this.selectCurrentFormState();
            this.selectNewInsertedGiayPhep();
          } else {
            this.onFormReset();
          }
        },
        (error: HttpErrorResponse) => {
          this.commonService.showDialogWarning(error.error.errors);
        },
        () =>
          this.commonService.showeNotiResult(
            this.dataTranslate.COMMON.default.successAdd,
            2000
          )
      );
    } else if (this.currentAction === GiayPhepActionEnum.Edit) {
      inputModel.idgiayphep = this.idgiayphep;
      giayPhepFacadeService.updateItem(inputModel).subscribe(
        async (res) => {
          this.currentAction = GiayPhepActionEnum.Edit;
          this.selectCurrentFormState();
        },
        (error: HttpErrorResponse) => {
          this.commonService.showDialogWarning(error.error.errors);
        },
        () =>
          this.commonService.showeNotiResult(
            this.dataTranslate.COMMON.default.successEdit,
            2000
          )
      );
    }
  }

  /**
   * hàm kiểm tra validation form
   */
  private logAllValidationErrorMessages() {
    validationAllErrorMessagesService(
      this.giayPhepIOForm,
      this.validationErrorMessages,
      this.formErrors
    );
  }

  /**
   * Hàm reset form, gọi khi nhấn nút reset dữ liệu
   */
  onFormReset() {
    // Hàm .reset sẽ xóa trắng mọi control trên form
    this.giayPhepIOForm.reset();
    this.giayPhepIOForm.controls.loaidoituong.setValue(LoaiDoiTuongEnum.ToChuc);
    this.giayPhepIOForm.controls.loaigiaytoDisplay.setValue(DefaultValue.Empty);
    this.giayPhepIOForm.controls.loaicapphep.setValue(DefaultValue.Empty);
    this.giayPhepIOForm.controls.idcoquancapphep.setValue(DefaultValue.Empty);
    this.giayPhepIOForm.controls.idhoso.setValue(DefaultValue.Empty);
    this.giayPhepIOForm.controls.idgiayphepls.setValue(DefaultValue.Empty);
    this.giayPhepIOForm.controls.loaivanban.setValue(DefaultValue.Empty);
    this.giayPhepIOForm.controls.donvithoihan.setValue(DefaultValue.Empty);
  }

  /**
   * Hàm mở sidenav
   */
  openCaNhanToChucIOSidenav() {
    // clear Sidenav
    this.matSidenavService.clearSidenav();
    // Khởi tạo sidenav
    this.matSidenavService.setSidenav(this.matSidenav, this, this.content, this.cfr);
    const loaiDoiTuong = this.giayPhepIOForm.controls.loaidoituong.value;

    if (loaiDoiTuong === LoaiDoiTuongEnum.CaNhan) {
      this.matSidenavService.setTitle(this.dataTranslate.DANHMUC.canhan.titleSelect);
      this.matSidenavService.setContentComp(DmCanhanOptionComponent, "select");
      this.matSidenavService.open();
    } else if (loaiDoiTuong === LoaiDoiTuongEnum.ToChuc) {
      this.matSidenavService.setTitle(this.dataTranslate.DANHMUC.tochuc.titleSelect);
      this.matSidenavService.setContentComp(DmTochucOptionComponent, "select");
      this.matSidenavService.open();
    } else {
      const informationDialogRef = this.commonService.informationDiaLogService(
        DefaultValue.Empty,
        this.dataTranslate.DANGKYHOATDONGKHOANGSAN.hoso.chonloaidoituongRequiredDialog,
        this.dataTranslate.DANGKYHOATDONGKHOANGSAN.hoso.informedDialogTitle
      );
    }
  }

  /**
   * khởi tạo thông tin cá nhân tổ chức trên form UI
   */
  private CreateThongTinCaNhanToChucOnUI(item: any, loaiDoiTuong: number) {
    if (loaiDoiTuong !== LoaiDoiTuongEnum.CaNhan && loaiDoiTuong !== LoaiDoiTuongEnum.ToChuc) {
      this.ClearThongTinCaNhanToChucOnUI();
      return;
    }

    this.giayPhepIOForm.controls.loaidoituong.setValue(loaiDoiTuong);
    this.giayPhepIOForm.controls.idcanhantochuc.setValue(item.idcanhantochuc);
    this.giayPhepIOForm.controls.tencanhantochuc.setValue(item.tencanhantochuc);
    this.giayPhepIOForm.controls.loaigiayto.setValue(item.loaigiayto);
    this.giayPhepIOForm.controls.loaigiaytoDisplay.setValue(item.loaigiayto);
    this.giayPhepIOForm.controls.sogiayto.setValue(item.sogiayto);
    this.giayPhepIOForm.controls.sogiaytoDisplay.setValue(item.sogiayto);
    this.giayPhepIOForm.controls.ngaycap.setValue(item.ngaycap);
    this.giayPhepIOForm.controls.ngaycapDisplay.setValue(item.ngaycap);
    this.giayPhepIOForm.controls.noicap.setValue(item.noicap);
    this.giayPhepIOForm.controls.noicapDisplay.setValue(item.noicap);
    this.giayPhepIOForm.controls.diachi.setValue(item.diachi);
    this.giayPhepIOForm.controls.diachiDisplay.setValue(item.diachi);
    this.giayPhepIOForm.controls.dienthoai.setValue(item.dienthoai);
  }

  /**
   * lấy item dữ liệu đối tượng cá nhân từ popup
   */
  private selectItemCaNhan(item: OutputDmCanhanModel) {
    if (item !== DefaultValue.Null && item !== DefaultValue.Undefined) {
      const data: any = Object.assign({}, item);
      data.tencanhantochuc = item.hovaten;
      data.idcanhantochuc = item.idcanhan;
      this.CreateThongTinCaNhanToChucOnUI(data, LoaiDoiTuongEnum.CaNhan);
    }
  }

  /**
   * lấy item dữ liệu đối tượng tổ chức từ popup
   */
  private selectItemToChuc(item: OutputDmToChucModel) {
    if (item !== DefaultValue.Null && item !== DefaultValue.Undefined) {
      const data: any = Object.assign({}, item);
      data.tencanhantochuc = item.tentochuc;
      data.idcanhantochuc = item.idtochuc;
      this.CreateThongTinCaNhanToChucOnUI(data,  LoaiDoiTuongEnum.ToChuc);
    }
  }

  /**
   * lấy item dữ liệu đối tượng hồ sơ từ popup
   */
  private selectItemHoSo(item: OutputHsHoSoModel) {
    if (item !== DefaultValue.Null && item !== DefaultValue.Undefined) {
      this.giayPhepIOForm.controls.idhoso.setValue(item.idhoso);
      this.AddOrUpdateThongTinHoSoList(item);
      this.selectItemHoSoChange({value: item.idhoso});
    }
  }

  /**
   * Sử kiện được kích hoạt sau khi chọn hồ sơ trên UI
   */
  public selectItemHoSoChange(item: any) {
    if (item.value !== DefaultValue.Empty) {
      this.disabledGiayPhepLichSu = true;
      this.disabledLoaiDoiTuong = true;
      const caNhanToChucItem = this.hoSoList.find(data => data.idhoso === item.value);

      if (caNhanToChucItem) {
        this.CreateThongTinCaNhanToChucOnUI(caNhanToChucItem, caNhanToChucItem.loaidoituong);
      } else {
        this.ClearThongTinCaNhanToChucOnUI();
      }
    } else {
      this.disabledGiayPhepLichSu = false;
      this.disabledLoaiDoiTuong = false;
      this.ClearThongTinCaNhanToChucOnUI();
    }

    this.giayPhepIOForm.controls.idgiayphepls.setValue(DefaultValue.Empty);
  }

  /**
   * Sử kiện được kích hoạt sau khi chọn loại cấp phép trên combobox UI
   */
  public selectItemLoaiCapPhepChange(item: any) {
    if (this.currentAction === GiayPhepActionEnum.Add) {
      this.disabledLoaiDoiTuong = false;
      this.hoSoList = [];
      this.giayPhepIOForm.controls.idhoso.setValue(DefaultValue.Empty);
      this.giayPhepLichSuList = [];
      this.giayPhepIOForm.controls.idgiayphepls.setValue(DefaultValue.Empty);
      this.ClearThongTinCaNhanToChucOnUI();

      const loaiCapPhep = item.value;
      this.checkLoaiCapPhep(loaiCapPhep);
      if (loaiCapPhep ===  DefaultValue.Empty || loaiCapPhep === LoaiCapPhepEnum.ThamDoGiaHan || loaiCapPhep === LoaiCapPhepEnum.KhaiThacKhoangSanGiaHan
        || loaiCapPhep === LoaiCapPhepEnum.KhaiThacTanThuKhoangSanGiaHan || loaiCapPhep === LoaiCapPhepEnum.TraLaiGiayPhepKhaiThacKhoangSan
        || loaiCapPhep === LoaiCapPhepEnum.TraLaiGiayPhepTanThuKhoangSan || loaiCapPhep === LoaiCapPhepEnum.TraLaiGiayPhepThamDoKhoangSan
        || loaiCapPhep === LoaiCapPhepEnum.TraLaiMotPhanDienTichKhuVucKhaiThacKhoangSan || loaiCapPhep === LoaiCapPhepEnum.TraLaiMotPhanDienTichKhuVucThamDoKhoangSan
        || loaiCapPhep === LoaiCapPhepEnum.ChuyenNhuongQuyenKhaiThacKhoangSan || loaiCapPhep === LoaiCapPhepEnum.ChuyenNhuongQuyenThamDoKhoangSan
        || loaiCapPhep === LoaiCapPhepEnum.DieuChinhGiayPhepKhaiThac || loaiCapPhep === LoaiCapPhepEnum.DongCuaMoKhoangSan
        || loaiCapPhep === LoaiCapPhepEnum.DongCuaMotPhanDienTichKhuVucKhaiThacKhoangSan || loaiCapPhep === LoaiCapPhepEnum.KhaiThacKhoangSanGiaHan
        ) {
        this.disabledHoSo = false;
        this.disabledGiayPhepLichSu = false;
      } else {
        this.disabledHoSo = false;
        this.disabledGiayPhepLichSu = true;
      }
    }
  }

  /**
   * lấy item dữ liệu đối tượng giấy phép lịch sử từ popup
   */
  private selectItemGiayPhep(item: OutputGiayPhepModel) {
    if (item !== DefaultValue.Null && item !== DefaultValue.Undefined) {
      this.giayPhepIOForm.controls.idgiayphepls.setValue(item.idgiayphep);
      this.AddOrUpdateThongTinGiayPhepLichSuList(item);
      this.selectItemGiayPhepLichSuChange({value: item.idgiayphep});
    }
  }

  /**
   * Sử kiện được kích hoạt sau khi chọn giấy phép trên combobox UI
   */
  public selectItemGiayPhepLichSuChange(item: any) {
    if (item.value !== DefaultValue.Empty) {
      this.disabledHoSo = true;
      this.disabledLoaiDoiTuong = true;
      const caNhanToChucItem = this.giayPhepLichSuList.find(data => data.idgiayphep === item.value);

      if (caNhanToChucItem) {
        this.CreateThongTinCaNhanToChucOnUI(caNhanToChucItem, caNhanToChucItem.loaidoituong);
      } else {
        this.ClearThongTinCaNhanToChucOnUI();
      }

    } else {
      this.disabledHoSo = false;
      this.disabledLoaiDoiTuong = false;
      this.ClearThongTinCaNhanToChucOnUI();
    }

    this.giayPhepIOForm.controls.idhoso.setValue(DefaultValue.Empty);
  }

  /**
   * CLear dữ liệu thông tin cá nhân tổ chức trên form UI
   */
  private ClearThongTinCaNhanToChucOnUI() {
    this.giayPhepIOForm.controls.idcanhantochuc.setValue(DefaultValue.Empty);
    this.giayPhepIOForm.controls.tencanhantochuc.setValue(DefaultValue.Empty);
    this.giayPhepIOForm.controls.loaigiayto.setValue(DefaultValue.Empty);
    this.giayPhepIOForm.controls.loaigiaytoDisplay.setValue(DefaultValue.Empty);
    this.giayPhepIOForm.controls.sogiayto.setValue(DefaultValue.Empty);
    this.giayPhepIOForm.controls.sogiaytoDisplay.setValue(DefaultValue.Empty);
    this.giayPhepIOForm.controls.ngaycap.setValue(DefaultValue.Empty);
    this.giayPhepIOForm.controls.ngaycapDisplay.setValue(DefaultValue.Empty);
    this.giayPhepIOForm.controls.noicap.setValue(DefaultValue.Empty);
    this.giayPhepIOForm.controls.noicapDisplay.setValue(DefaultValue.Empty);
    this.giayPhepIOForm.controls.diachi.setValue(DefaultValue.Empty);
    this.giayPhepIOForm.controls.diachiDisplay.setValue(DefaultValue.Empty);
    this.giayPhepIOForm.controls.dienthoai.setValue(DefaultValue.Empty);
  }

  /**
   * Thay đổi loại đối tượng trên form
   */
  selectItemLoaiDoiTuongChange() {
    this.ClearThongTinCaNhanToChucOnUI();
  }

  /**
   * select inserted state of form
   */

  private selectCurrentFormState() {
    this.selectCurrentFormStateEvent.emit(this.currentAction);
  }

  /**
   * lấy thông tin id hồ sơ sau khi thêm mới một hồ sơ
   */
  private selectNewInsertedGiayPhep() {
    this.selectNewInsertedGiayPhepEvent.emit(this.idgiayphep);
  }

  /**
   * Hàm open sidenav chọn hồ sơ
   */
  openHoSoIOSidenav() {
    const loaiCapPhep = this.giayPhepIOForm.controls.loaicapphep.value;

    if (!loaiCapPhep) {
      this.commonService.informationDiaLogService(
        DefaultValue.Empty,
        this.dataTranslate.HOSOGIAYTO.quyetdinh.loaicapphepInformedRequiredSelection,
        this.dataTranslate.HOSOGIAYTO.quyetdinh.informedDialogTitle
      );
      return;
    }

    // clear Sidenav
    this.matSidenavService.clearSidenav();
    // Khởi tạo sidenav
    this.matSidenavService.setSidenav(this.matSidenav, this, this.content, this.cfr);
    this.matSidenavService.setTitle(this.dataTranslate.HOSOGIAYTO.quyetdinh.titleHoSoSelect);
    this.matSidenavService.setContentComp(HosoOptionComponent, "select", {nhomloaicapphep: this.nhomLoaiCapPhep, loaicapphep: loaiCapPhep});
    this.matSidenavService.open();
  }

  /**
   * Hàm open sidenav chọn giấy phép lịch sử
   */
  openGiayPhepLichSuIOSidenav() {
    // clear Sidenav
    this.matSidenavService.clearSidenav();
    // Khởi tạo sidenav
    this.matSidenavService.setSidenav(this.matSidenav, this, this.content, this.cfr);
    this.matSidenavService.setTitle(this.dataTranslate.HOSOGIAYTO.quyetdinh.titleSelect);
    this.matSidenavService.setContentComp(GiayphepOptionComponent, "select");
    this.matSidenavService.open();
  }

  /**
   * Hàm đóng sidenav
   */
  closeIOSidenav() {
    this.matSidenavService.close();
  }

  // Hàm dùng để gọi các hàm khác, truyền vào tên hàm cần thực thi
  doFunction(methodName, obj) {
    this[methodName](obj);
  }
}
