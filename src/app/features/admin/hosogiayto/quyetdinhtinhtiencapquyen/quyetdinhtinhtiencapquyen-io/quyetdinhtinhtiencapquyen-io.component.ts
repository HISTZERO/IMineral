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
  selector: 'app-quyetdinhtinhtiencapquyen-io',
  templateUrl: './quyetdinhtinhtiencapquyen-io.component.html',
  styleUrls: ['./quyetdinhtinhtiencapquyen-io.component.scss']
})
export class QuyetdinhtinhtiencapquyenIoComponent implements OnInit {
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
  public loaiVanBanList: any;
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

  // Chứa dữ liệu Giấy phép lịch sử
  public giayPhepLichSuList: OutputGiayPhepModel[];
  // chứa dữ liệu Id Hồ sơ
  public idgiayphep: string;
  // Lưu trữ tên loại cấp phép trong trường hợp hồ sơ đã có đăng ký
  public tenLoaiCapPhep: string;
  // Lưu trữ đơn vị thời hạn
  public donViThoiHanList = DonViThoiHan;
  // disable loại đối tượng
  public disabledLoaiDoiTuong = true;
  // error message
  validationErrorMessages = {};

  // form errors
  formErrors = {
    sogiayphep: DefaultValue.Empty,
    ngaycapphep: DefaultValue.Empty,
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
    // Lấy dữ liệu loại cấp phép
    await this.getLoaiCapPhepAll();
    // Lấy dữ liệu loại văn bản
    this.getLoaiVanBanAll();
    // Lấy dữ liệu cơ quan tiếp nhận
    await this.getCoQuanCapPhepAll();
    // Khởi tạo dữ liệu form trong trường hợp sửa dữ liệu Hồ Sơ
    await this.formOnEdit();
  }

  /**
   * Hàm khởi tạo form
   */
  private formInit() {
    this.giayPhepIOForm = this.formBuilder.group({
      sogiayphep: [DefaultValue.Empty, Validators.required],
      ngaycapphep: [DefaultValue.Empty, Validators.required],
      idcoquancapphep: [DefaultValue.Empty, Validators.required],
      chucvunguoiky: [DefaultValue.Empty, Validators.required],
      tennguoiky: [DefaultValue.Empty, Validators.required],
      loaivanban: [DefaultValue.Empty, Validators.required],
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
      idgiayphepls:  [DefaultValue.Empty, Validators.required],
      trangthai: [DefaultValue.Empty],
      ghichu: [DefaultValue.Empty]
    });

    this.giayPhepIOForm.controls.tencanhantochuc.disable({ onlySelf: true });
    this.giayPhepIOForm.controls.loaigiaytoDisplay.disable({ onlySelf: true });
    this.giayPhepIOForm.controls.sogiaytoDisplay.disable({ onlySelf: true });
    this.giayPhepIOForm.controls.ngaycapDisplay.disable({ onlySelf: true });
    this.giayPhepIOForm.controls.noicapDisplay.disable({ onlySelf: true });
    this.giayPhepIOForm.controls.diachiDisplay.disable({ onlySelf: true });
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
   * thêm mới hoặc sửa đôi dữ liệu vào danh giấy phép
   */
  private AddOrUpdateThongTinGiayPhepLichSuList(item: OutputGiayPhepModel) {
    if (item && item.idgiayphep && item.idgiayphep.trim() !== DefaultValue.Empty) {
      if (this.giayPhepLichSuList === DefaultValue.Null || this.giayPhepLichSuList === DefaultValue.Undefined || this.giayPhepLichSuList.length > 0) {
        this.giayPhepLichSuList = [];
      }

      this.giayPhepLichSuList.push(item);
    }
  }

  /**
   * hàm set value cho form
   */
  private async formOnEdit() {
    if (this.currentAction === GiayPhepActionEnum.Edit) {
      const inputModel = await this.getGiayPhepById(this.idgiayphep);

      if (inputModel) {
        const giayPhepLichSu = Object.assign(new OutputGiayPhepModel(), inputModel);

        if (inputModel.idgiayphepls && inputModel.idgiayphepls.trim() !== DefaultValue.Empty) {
          giayPhepLichSu.idgiayphep = inputModel.idgiayphepls;
          giayPhepLichSu.sogiayphep = inputModel.sogiayphepls;
          this.AddOrUpdateThongTinGiayPhepLichSuList(giayPhepLichSu);
        }

        this.giayPhepIOForm.setValue({
          sogiayphep: inputModel.sogiayphep,
          ngaycapphep: inputModel.ngaycapphep,
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
      sogiayphep: { required: this.dataTranslate.HOSOGIAYTO.giayphep.soquyetdinhRequired },
      ngaycapphep: { required: this.dataTranslate.HOSOGIAYTO.giayphep.ngayquyetdinhRequired },
      idcoquancapphep: { required: this.dataTranslate.HOSOGIAYTO.giayphep.coquanquyetdinhRequired },
      chucvunguoiky: { required: this.dataTranslate.HOSOGIAYTO.giayphep.chucvunguoikyRequired },
      tennguoiky: { required: this.dataTranslate.HOSOGIAYTO.giayphep.tennguoikyRequired },
      loaivanban: { required: this.dataTranslate.HOSOGIAYTO.giayphep.loaivanbanRequired },
      loaicapphep: { required: this.dataTranslate.HOSOGIAYTO.giayphep.loaicapphepRequired },
      idcanhantochuc: { required: this.dataTranslate.HOSOGIAYTO.giayphep.tencanhantochucRequired },
      tencanhantochuc: { required: this.dataTranslate.HOSOGIAYTO.giayphep.tencanhantochucRequired },
      sogiayto: { required: this.dataTranslate.HOSOGIAYTO.giayphep.sogiaytoRequired },
      loaigiayto: { required: this.dataTranslate.HOSOGIAYTO.giayphep.loaigiaytoRequired },
      ngaycap:  { required: this.dataTranslate.HOSOGIAYTO.giayphep.ngaycapRequired },
      noicap: { required: this.dataTranslate.HOSOGIAYTO.giayphep.noicapRequired },
      diachi: { required: this.dataTranslate.HOSOGIAYTO.giayphep.diachiRequired },
      dienthoai:  { pattern: this.dataTranslate.HOSOGIAYTO.giayphep.dienthoaiIsNumber },
      loaidoituong: { required: this.dataTranslate.HOSOGIAYTO.giayphep.loaidoituongRequired },
      idgiayphepls: { required: this.dataTranslate.HOSOGIAYTO.giayphep.sogiayphepRequired },
    };
  }

  async getLoaiVanBanAll() {
    // lấy loại văn bản quyết định
    this.loaiVanBanList = LoaiVanBan.filter(item => item.id === LoaiVanBanEnum.QuyetDinh);
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
    if (loaiCapPhep !== LoaiCapPhepEnum.TinhTienCapQuyen) {
      this.commonService.informationDiaLogService(
        DefaultValue.Empty,
        this.dataTranslate.HOSOGIAYTO.giayphep.loaicapphepInformedInvalidSelection,
        this.dataTranslate);

      return false;
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
   * Sử kiện được kích hoạt sau khi chọn loại cấp phép trên combobox UI
   */
  public selectItemLoaiCapPhepChange(item: any) {
    if (this.currentAction === GiayPhepActionEnum.Add) {
      this.giayPhepLichSuList = [];
      this.giayPhepIOForm.controls.idgiayphepls.setValue(DefaultValue.Empty);
      this.ClearThongTinCaNhanToChucOnUI();
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
      const caNhanToChucItem = this.giayPhepLichSuList.find(data => data.idgiayphep === item.value);

      if (caNhanToChucItem) {
        this.CreateThongTinCaNhanToChucOnUI(caNhanToChucItem, caNhanToChucItem.loaidoituong);
      } else {
        this.ClearThongTinCaNhanToChucOnUI();
      }

    } else {
      this.ClearThongTinCaNhanToChucOnUI();
    }
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
   * Hàm open sidenav chọn giấy phép lịch sử
   */
  openGiayPhepLichSuIOSidenav() {
    // clear Sidenav
    this.matSidenavService.clearSidenav();
    // Khởi tạo sidenav
    this.matSidenavService.setSidenav(this.matSidenav, this, this.content, this.cfr);
    this.matSidenavService.setTitle(this.dataTranslate.HOSOGIAYTO.giayphep.titleSelect);
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
