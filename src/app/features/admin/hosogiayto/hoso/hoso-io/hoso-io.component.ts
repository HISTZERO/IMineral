import { Component, OnInit, Input, ViewContainerRef, ViewChild, ComponentFactoryResolver, EventEmitter, Output } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoaiDoiTuongEnum, TrangThaiEnum, Paging, HoSoActionEnum, InsertedState } from 'src/app/shared/constants/enum';
import { LoaiDoiTuong, HinhThucNopHoSo, HinhThucNhanKetQua, DangKhoangSan } from 'src/app/shared/constants/common-constants';
import { LoaiGiayTo } from 'src/app/shared/constants/loaigiayto-constants';
import { DmFacadeService } from "src/app/services/admin/danhmuc/danhmuc-facade.service";
import { OutputDmLoaiCapPhepModel } from 'src/app/models/admin/danhmuc/loaicapphep.model';
import { OutputHsCoQuanTiepNhanModel } from 'src/app/models/admin/thietlap/coquantiepnhan.model';
import { HethongFacadeService } from 'src/app/services/admin/hethong/hethong-facade.service';
import { DangKyHoatDongKhoangSanFacadeService } from 'src/app/services/admin/dangkyhoatdongkhoangsan/dangkyhoatdongkhoangsan-facade.service';
import { CommonServiceShared } from 'src/app/services/utilities/common-service';
import { validationAllErrorMessagesService } from "src/app/services/utilities/validatorService";
import { MatsidenavService } from 'src/app/services/utilities/matsidenav.service';
import { DmCanhanOptionComponent } from "src/app/features/admin/danhmuc/canhan/canhan-option/canhan-option.component";
import { DmTochucOptionComponent } from "src/app/features/admin/danhmuc/tochuc/tochuc-option/tochuc-option.component";
import { OutputDmCanhanModel } from "src/app/models/admin/danhmuc/canhan.model";
import { OutputDmToChucModel } from "src/app/models/admin/danhmuc/tochuc.model";
import { DefaultValue } from 'src/app/shared/constants/global-var';

@Component({
  selector: 'app-hoso-io',
  templateUrl: './hoso-io.component.html',
  styleUrls: ['./hoso-io.component.scss']
})
export class HosoIoComponent implements OnInit {
  @ViewChild("compio", { read: ViewContainerRef, static: true }) public content: ViewContainerRef;
  @ViewChild("aside", { static: true }) public matSidenav: MatSidenav;
  // tslint:disable-next-line: no-output-rename
  @Output("selectCurrentFormStateEvent") selectCurrentFormStateEvent: EventEmitter<number> = new EventEmitter();
  // tslint:disable-next-line: no-output-rename
  @Output("selectNewInsertedHoSoEvent") selectNewInsertedHoSoEvent: EventEmitter<string> = new EventEmitter();
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
  public ActionType = HoSoActionEnum;
  // Chứa dữ liệu Form
  public hosoIOForm: FormGroup;
  // Chứa dữ liệu translate
  public dataTranslate: any;
  // Chứa loại đối tượng
  public loaiDoiTuongList = LoaiDoiTuong;
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
  public coQuanTiepNhanList: OutputHsCoQuanTiepNhanModel[];
  public coQuanTiepNhanFilters: OutputHsCoQuanTiepNhanModel[];
  // chứa dữ liệu Id Hồ sơ
  public idhoso: string;
  // Lưu trữ tên loại cấp phép trong trường hợp hồ sơ đã có đăng ký
  public tenLoaiCapPhep: string;
  // error message
  validationErrorMessages = {};

  // form errors
  formErrors = {
    mahoso: DefaultValue.Empty,
    mabiennhan: DefaultValue.Empty,
    soden: DefaultValue.Empty,
    ngaynop: DefaultValue.Empty,
    ngaytiepnhan: DefaultValue.Empty,
    ngaytraketqua: DefaultValue.Empty,
    loaidoituong: DefaultValue.Empty,
    loaicapphep: DefaultValue.Empty,
    hinhthucnophoso: DefaultValue.Empty,
    hinhthucnhanketqua: DefaultValue.Empty,
    idcoquantiepnhan: DefaultValue.Empty,
    idcanhantochuc: DefaultValue.Empty,
    tencanhantochuc: DefaultValue.Empty,
    sogiayto: DefaultValue.Empty,
    loaigiayto: DefaultValue.Empty,
    ngaycap: DefaultValue.Empty,
    noicap: DefaultValue.Empty,
    diachi: DefaultValue.Empty,
    dienthoai: DefaultValue.Empty,
    fax: DefaultValue.Empty,
    email: DefaultValue.Empty,
    website: DefaultValue.Empty,
  };

  constructor(
    private translate: TranslateService,
    private formBuilder: FormBuilder,
    private dmFacadeService: DmFacadeService,
    private hethongFacadeService: HethongFacadeService,
    private dangKyHoatDongKhoangSanFacadeService: DangKyHoatDongKhoangSanFacadeService,
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
      if (param && param.params && param.params.idhoso) {
        this.idhoso = param.params.idhoso;
      }
    });

    if (this.idhoso !== DefaultValue.Null && this.idhoso !== DefaultValue.Undefined
        && this.idhoso !== DefaultValue.Empty) {
      this.currentAction = HoSoActionEnum.Edit;
    } else {
      this.currentAction = HoSoActionEnum.Add;
    }

    await this.getLoaiCapPhepAll();
    // Lấy dữ liệu cơ quan tiếp nhận
    await this.getCoQuanTiepNhanAll();
    // Khởi tạo dữ liệu form trong trường hợp sửa dữ liệu Hồ Sơ
    await this.formOnEdit();
  }

  /**
   * Hàm khởi tạo form
   */
  private formInit() {
    this.hosoIOForm = this.formBuilder.group({
      mahoso: [DefaultValue.Empty, Validators.required],
      mabiennhan: [DefaultValue.Empty],
      soden: [DefaultValue.Empty],
      ngaynop: [DefaultValue.Empty, Validators.required],
      ngaytiepnhan: [DefaultValue.Empty, Validators.required],
      ngaytraketqua: [DefaultValue.Empty, Validators.required],
      loaidoituong: [LoaiDoiTuongEnum.ToChuc, Validators.required],
      loaicapphep: [DefaultValue.Empty, Validators.required],
      hinhthucnophoso: [DefaultValue.Empty, Validators.required],
      hinhthucnhanketqua: [DefaultValue.Empty, Validators.required],
      idcoquantiepnhan: [DefaultValue.Empty, Validators.required],
      idcanhantochuc: [DefaultValue.Empty, Validators.required],
      tencanhantochuc: [DefaultValue.Empty, Validators.required],
      sogiayto: [DefaultValue.Empty, Validators.required],
      sogiaytoDisplay: [DefaultValue.Empty],
      loaigiayto: [DefaultValue.Empty, Validators.required],
      loaigiaytoDisplay: [DefaultValue.Empty],
      ngaycap: [DefaultValue.Empty, Validators.required],
      ngaycapDisplay: [DefaultValue.Empty],
      noicap: [DefaultValue.Empty, Validators.required],
      noicapDisplay: [DefaultValue.Empty],
      diachi: [DefaultValue.Empty, Validators.required],
      diachiDisplay: [DefaultValue.Empty],
      dienthoai: [DefaultValue.Empty, Validators.pattern("^[0-9-+]+$")],
      fax: [DefaultValue.Empty],
      email: [DefaultValue.Empty],
      website: [DefaultValue.Empty],
    });

    this.hosoIOForm.controls.tencanhantochuc.disable({ onlySelf: true });
    this.hosoIOForm.controls.loaigiaytoDisplay.disable({ onlySelf: true });
    this.hosoIOForm.controls.sogiaytoDisplay.disable({ onlySelf: true });
    this.hosoIOForm.controls.ngaycapDisplay.disable({ onlySelf: true });
    this.hosoIOForm.controls.noicapDisplay.disable({ onlySelf: true });
    this.hosoIOForm.controls.diachiDisplay.disable({ onlySelf: true });
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
   * hàm set value cho form
   */
  private async formOnEdit() {
    if (this.currentAction === HoSoActionEnum.Edit) {
      const inputModel = await this.getHoSoById(this.idhoso);

      if (inputModel) {
        this.hosoIOForm.setValue({
          mahoso: inputModel.mahoso,
          mabiennhan: inputModel.mabiennhan,
          soden: inputModel.soden,
          ngaynop: inputModel.ngaynop,
          ngaytiepnhan: inputModel.ngaytiepnhan,
          ngaytraketqua: inputModel.ngaytraketqua,
          loaidoituong: inputModel.loaidoituong,
          loaicapphep: inputModel.loaicapphep,
          hinhthucnophoso: inputModel.hinhthucnophoso,
          hinhthucnhanketqua: inputModel.hinhthucnhanketqua,
          idcoquantiepnhan: inputModel.idcoquantiepnhan,
          idcanhantochuc: inputModel.idcanhantochuc,
          tencanhantochuc: inputModel.tencanhantochuc,
          sogiayto: inputModel.sogiayto,
          sogiaytoDisplay: inputModel.sogiayto,
          loaigiayto: inputModel.loaigiayto,
          loaigiaytoDisplay: inputModel.loaigiayto,
          ngaycap: inputModel.ngaycap,
          ngaycapDisplay:  inputModel.ngaycap,
          noicap: inputModel.noicap,
          noicapDisplay: inputModel.noicap,
          diachi: inputModel.diachi,
          diachiDisplay: inputModel.diachi,
          dienthoai: inputModel.dienthoai,
          fax: inputModel.fax,
          email: inputModel.email,
          website: inputModel.website,
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
      mahoso: { required: this.dataTranslate.HOSOGIAYTO.hoso.mahosoRequired },
      mabiennhan: { required: this.dataTranslate.HOSOGIAYTO.hoso.mabiennhanRequired },
      // soden: { required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.hoso.sodenRequired },
      ngaynop: { required: this.dataTranslate.HOSOGIAYTO.hoso.ngaynopRequired },
      ngaytiepnhan: { required: this.dataTranslate.HOSOGIAYTO.hoso.ngaytiepnhanRequired },
      ngaytraketqua: { required: this.dataTranslate.HOSOGIAYTO.hoso.ngaytraketquaRequired },
      loaidoituong: { required: this.dataTranslate.HOSOGIAYTO.hoso.loaidoituongRequired },
      loaicapphep: { required: this.dataTranslate.HOSOGIAYTO.hoso.loaicapphepRequired },
      hinhthucnophoso: { required: this.dataTranslate.HOSOGIAYTO.hoso.hinhthucnophosoRequired },
      hinhthucnhanketqua: { required: this.dataTranslate.HOSOGIAYTO.hoso.hinhthucnhanketquaRequired },
      idcoquantiepnhan: { required: this.dataTranslate.HOSOGIAYTO.hoso.idcoquantiepnhanRequired },
      idcanhantochuc: {required: this.dataTranslate.HOSOGIAYTO.hoso.tencanhantochucRequired},
      tencanhantochuc: { required: this.dataTranslate.HOSOGIAYTO.hoso.tencanhantochucRequired },
      sogiayto: { required: this.dataTranslate.HOSOGIAYTO.hoso.sogiaytoRequired },
      loaigiayto: { required: this.dataTranslate.HOSOGIAYTO.hoso.loaigiaytoRequired },
      ngaycap: { required: this.dataTranslate.HOSOGIAYTO.hoso.ngaycapRequired },
      noicap: { required: this.dataTranslate.HOSOGIAYTO.hoso.noicapRequired },
      diachi: { required: this.dataTranslate.HOSOGIAYTO.hoso.diachiRequired },
      dienthoai: { pattern: this.dataTranslate.HOSOGIAYTO.hoso.dienthoaiIsNumber },
    };
  }

  async getLoaiCapPhepAll() {
    const listData: any = await this.dmFacadeService
      .getDmLoaiCapPhepService()
      .getFetchAll({ Nhomloaicapphep: this.nhomLoaiCapPhep, TrangThai: TrangThaiEnum.Active, PageNumber: Paging.PageNumber, PageSize: Paging.PageSize });
    this.loaiCapPhepList = listData.items;
    this.loaiCapPhepFilters = listData.items;
  }

  async getCoQuanTiepNhanAll() {
    const listData: any = await this.hethongFacadeService
      .getCoQuanTiepNhanService()
      .getFetchAll({ PageNumber: Paging.PageNumber, PageSize: Paging.PageSize });
    this.coQuanTiepNhanList = listData.items;
    this.coQuanTiepNhanFilters = listData.items;
  }

  /**
   * Lấy dữ liệu hồ sơ theo IdHoSo
   * @param idHoSo
   */
  private async getHoSoById(idHoSo: string) {
    const hoSoFacadeService = this.dangKyHoatDongKhoangSanFacadeService.getHoSoService();
    const hosoItem = await hoSoFacadeService.getByid(idHoSo).toPromise();
    return hosoItem;
  }

  async saveItemHoSo() {
    this.logAllValidationErrorMessages();

    if (!this.hosoIOForm.valid) {
      return;
    }

    // Gán dữ liệu input vào model
    const hoSoFacadeService = this.dangKyHoatDongKhoangSanFacadeService.getHoSoService();
    const inputModel = this.hosoIOForm.value;
    const currentLoaiCapPhep = this.loaiCapPhepList.find(item => item.maloaicapphep === this.hosoIOForm.controls.loaicapphep.value);
    inputModel.idthutuchanhchinh = currentLoaiCapPhep.idthutuchanhchinh;
    inputModel.nhomloaicapphep = currentLoaiCapPhep.nhomloaicapphep;
    inputModel.tencanhantochuc = this.hosoIOForm.controls.tencanhantochuc.value;
    if (this.currentAction === HoSoActionEnum.Add && (this.insertedState === InsertedState.SaveAndRefresh || this.insertedState === InsertedState.SaveAndEdit)) {
      hoSoFacadeService.addItem(inputModel).subscribe(
        async (res) => {
          if (this.insertedState === InsertedState.SaveAndEdit) {
            this.idhoso = res.idhoso;
            this.currentAction = HoSoActionEnum.Edit;
            await this.formOnEdit();
            this.selectCurrentFormState();
            this.selectNewInsertedHoSo();
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
    } else if (this.currentAction === HoSoActionEnum.Edit) {
      inputModel.idhoso = this.idhoso;
      inputModel.tencanhantochuc = this.hosoIOForm.controls.tencanhantochuc.value;
      hoSoFacadeService.updateItem(inputModel).subscribe(
        async (res) => {
          this.currentAction = HoSoActionEnum.Edit;
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
      this.hosoIOForm,
      this.validationErrorMessages,
      this.formErrors
    );
  }

  /**
   * Hàm reset form, gọi khi nhấn nút reset dữ liệu
   */
  onFormReset() {
    // Hàm .reset sẽ xóa trắng mọi control trên form
    this.hosoIOForm.reset();
    this.hosoIOForm.controls.loaidoituong.setValue(LoaiDoiTuongEnum.ToChuc);
    this.hosoIOForm.controls.loaigiayto.setValue(DefaultValue.Empty);
    this.hosoIOForm.controls.loaicapphep.setValue(DefaultValue.Empty);
    this.hosoIOForm.controls.hinhthucnophoso.setValue(DefaultValue.Empty);
    this.hosoIOForm.controls.hinhthucnhanketqua.setValue(DefaultValue.Empty);
    this.hosoIOForm.controls.idcoquantiepnhan.setValue(DefaultValue.Empty);
  }

  /**
   * Hàm mở sidenav
   */
  openIOSidenav() {
    // clear Sidenav
    this.matSidenavService.clearSidenav();
    // Khởi tạo sidenav
    this.matSidenavService.setSidenav(this.matSidenav, this, this.content, this.cfr);
    const loaiDoiTuong = this.hosoIOForm.controls.loaidoituong.value;

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
        this.dataTranslate.HOSOGIAYTO.hoso.chonloaidoituongRequiredDialog,
        this.dataTranslate.HOSOGIAYTO.hoso.informedDialogTitle,
      );
    }
  }

  /**
   * CLear dữ liệu thông tin cá nhân tổ chức trên form UI
   */
  private ClearThongTinCaNhanToChucOnUI() {
    this.hosoIOForm.controls.idcanhantochuc.setValue(DefaultValue.Empty);
    this.hosoIOForm.controls.tencanhantochuc.setValue(DefaultValue.Empty);
    this.hosoIOForm.controls.loaigiayto.setValue(DefaultValue.Empty);
    this.hosoIOForm.controls.loaigiaytoDisplay.setValue(DefaultValue.Empty);
    this.hosoIOForm.controls.sogiayto.setValue(DefaultValue.Empty);
    this.hosoIOForm.controls.sogiaytoDisplay.setValue(DefaultValue.Empty);
    this.hosoIOForm.controls.ngaycap.setValue(DefaultValue.Empty);
    this.hosoIOForm.controls.ngaycapDisplay.setValue(DefaultValue.Empty);
    this.hosoIOForm.controls.noicap.setValue(DefaultValue.Empty);
    this.hosoIOForm.controls.noicapDisplay.setValue(DefaultValue.Empty);
    this.hosoIOForm.controls.diachi.setValue(DefaultValue.Empty);
    this.hosoIOForm.controls.diachiDisplay.setValue(DefaultValue.Empty);
    this.hosoIOForm.controls.dienthoai.setValue(DefaultValue.Empty);
  }

  /**
   * khởi tạo thông tin cá nhân tổ chức trên form UI
   */
  private CreateThongTinCaNhanToChucOnUI(item: any, loaiDoiTuong: number) {
    if (loaiDoiTuong !== LoaiDoiTuongEnum.CaNhan && loaiDoiTuong !== LoaiDoiTuongEnum.ToChuc) {
      this.ClearThongTinCaNhanToChucOnUI();
      return;
    }

    this.hosoIOForm.controls.loaidoituong.setValue(loaiDoiTuong);
    this.hosoIOForm.controls.idcanhantochuc.setValue(item.idcanhantochuc);
    this.hosoIOForm.controls.tencanhantochuc.setValue(item.tencanhantochuc);
    this.hosoIOForm.controls.loaigiayto.setValue(item.loaigiayto);
    this.hosoIOForm.controls.loaigiaytoDisplay.setValue(item.loaigiayto);
    this.hosoIOForm.controls.sogiayto.setValue(item.sogiayto);
    this.hosoIOForm.controls.sogiaytoDisplay.setValue(item.sogiayto);
    this.hosoIOForm.controls.ngaycap.setValue(item.ngaycap);
    this.hosoIOForm.controls.ngaycapDisplay.setValue(item.ngaycap);
    this.hosoIOForm.controls.noicap.setValue(item.noicap);
    this.hosoIOForm.controls.noicapDisplay.setValue(item.noicap);
    this.hosoIOForm.controls.diachi.setValue(item.diachi);
    this.hosoIOForm.controls.diachiDisplay.setValue(item.diachi);
    this.hosoIOForm.controls.dienthoai.setValue(item.dienthoai);
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
  private selectNewInsertedHoSo() {
    this.selectNewInsertedHoSoEvent.emit(this.idhoso);
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
