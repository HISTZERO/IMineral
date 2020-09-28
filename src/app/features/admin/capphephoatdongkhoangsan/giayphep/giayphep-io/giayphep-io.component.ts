import { Component, OnInit, Input, ViewContainerRef, ViewChild, ComponentFactoryResolver, EventEmitter, Output } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { LoaiDoiTuongEnum, TrangThaiEnum, Paging, InsertedState, GiayPhepActionEnum } from 'src/app/shared/constants/enum';
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
import { CapPhepHoatDongKhoangSanFacadeService } from 'src/app/services/admin/capphephoatdongkhoangsan/capphephoatdongkhoangsan-facade.service';
import { OutputHsHoSoModel } from 'src/app/models/admin/dangkyhoatdongkhoangsan/hoso.model';
import { ThietlapFacadeService } from 'src/app/services/admin/thietlap/thietlap-facade.service';

@Component({
  selector: 'app-giayphep-io',
  templateUrl: './giayphep-io.component.html',
  styleUrls: ['./giayphep-io.component.scss']
})
export class GiayphepIoComponent implements OnInit {
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
  // chứa dữ liệu Id Hồ sơ
  public idgiayphep: string;
  // Lưu trữ tên loại cấp phép trong trường hợp hồ sơ đã có đăng ký
  public tenLoaiCapPhep: string;
  // Lưu trữ đơn vị thời hạn
  public donViThoiHanList = DonViThoiHan;
  // error message
  validationErrorMessages = {};

  // form errors
  formErrors = {
    sogiayphep: "",
    ngaycapphep: "",
    ngaybdhieuluc: "",
    ngaykthieuluc: "",
    thoihan: "",
    donvithoihan: "",
    idcoquancapphep: "",
    coquancapphep: "",
    chucvunguoiky: "",
    tennguoiky: "",
    loaivanban: "",
    loaicapphep: "",
    idcanhantochuc: "",
    tencanhantochuc: "",
    sogiayto: "",
    loaigiayto: "",
    ngaycap:  "",
    noicap: "",
    diachi: "",
    dienthoai: "",
    fax: "",
    email: "",
    website: "",
    loaidoituong: "",
    idhoso: "",
    trangthai: "",
    ghichu: ""
  };

  constructor(
    private translate: TranslateService,
    private formBuilder: FormBuilder,
    private dmFacadeService: DmFacadeService,
    private hethongFacadeService: HethongFacadeService,
    private thietlapFacadeService: ThietlapFacadeService,
    private capPhepHoatDongKhoangSanFacadeService: CapPhepHoatDongKhoangSanFacadeService,
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
    this.matSidenavService.setSidenav(this.matSidenav, this, this.content, this.cfr);
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

    if (this.idgiayphep !== null && this.idgiayphep !== undefined) {
      this.currentAction = GiayPhepActionEnum.Edit;
    } else {
      this.currentAction = GiayPhepActionEnum.Add;
    }

    await this.getLoaiCapPhepAll();
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
      sogiayphep: ["", Validators.required],
      ngaycapphep: ["", Validators.required],
      ngaybdhieuluc: ["", Validators.required],
      ngaykthieuluc: ["", Validators.required],
      thoihan: ["", Validators.required],
      donvithoihan: ["", Validators.required],
      idcoquancapphep: ["", Validators.required],
      coquancapphep: ["", Validators.required],
      chucvunguoiky: ["", Validators.required],
      tennguoiky: ["", Validators.required],
      loaivanban: ["", Validators.required],
      loaicapphep: ["", Validators.required],
      idcanhantochuc: ["", Validators.required],
      tencanhantochuc: ["", Validators.required],
      sogiayto: ["", Validators.required],
      loaigiayto: ["", Validators.required],
      ngaycap:  ["", Validators.required],
      noicap: ["", Validators.required],
      diachi: ["", Validators.required],
      dienthoai: ["", Validators.pattern("^[0-9-+]+$")],
      fax: [""],
      email: [""],
      website: [""],
      loaidoituong: [LoaiDoiTuongEnum.ToChuc, Validators.required],
      idhoso: [""],
      trangthai: [""],
      ghichu: [""]
    });

    this.giayPhepIOForm.controls.tencanhantochuc.disable({ onlySelf: true });
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

  private AddThongTinVaoHoSoCombobox(item: any) {
    if (item.idhoso) {
      const hoSoItem = {
        idhoso: item.idhoso,
        mahoso: item.mahoso,
        idcanhantochuc: item.idcanhantochuc,
        tencanhantochuc: item.tencanhantochuc,
        sogiayto: item.sogiayto,
        loaigiayto: item.loaigiayto,
        ngaycap:  item.ngaycap,
        noicap: item.noicap,
        diachi: item.diachi,
        dienthoai: item.dienthoai,
        email: item.email,
        fax: item.fax,
        website: item.website,
        loaidoituong: item.loaidoituong

      } as OutputHsHoSoModel;

      if (this.hoSoList === null || this.hoSoList.length === 0) {
        this.hoSoList.push(hoSoItem);
      } else {
        this.hoSoList[0].idhoso = item.idhoso;
        this.hoSoList[0].mahoso = item.idhoso;
        this.hoSoList[0].idcanhantochuc = item.idcanhantochuc;
        this.hoSoList[0].tencanhantochuc = item.tencanhantochuc;
        this.hoSoList[0].sogiayto = item.sogiayto;
        this.hoSoList[0].loaigiayto = item.loaigiayto;
        this.hoSoList[0].ngaycap = item.ngaycap;
        this.hoSoList[0].noicap = item.noicap;
        this.hoSoList[0].diachi = item.diachi;
        this.hoSoList[0].dienthoai = item.dienthoai;
        this.hoSoList[0].email = item.email;
        this.hoSoList[0].fax = item.fax;
        this.hoSoList[0].website = item.website;
        this.hoSoList[0].loaidoituong = item.loaidoituong;
      }
    }
  }

  /**
   * hàm set value cho form
   */
  private async formOnEdit() {
    if (this.currentAction === GiayPhepActionEnum.Edit) {
      const inputModel = await this.getGiayPhepById(this.idgiayphep);

      if (inputModel) {
        this.AddThongTinVaoHoSoCombobox(inputModel);
        this.giayPhepIOForm.setValue({
          sogiayphep: inputModel.sogiayphep,
          ngaycapphep: inputModel.ngaycapphep,
          ngaybdhieuluc: inputModel.ngaybdhieuluc,
          ngaykthieuluc: inputModel.ngaykthieuluc,
          thoihan: inputModel.thoihan,
          donvithoihan: inputModel.donvithoihan,
          idcoquancapphep: inputModel.idcoquancapphep,
          coquancapphep: inputModel.coquancapphep,
          chucvunguoiky: inputModel.chucvunguoiky,
          tennguoiky: inputModel.tennguoiky,
          loaivanban: inputModel.loaivanban,
          loaicapphep: inputModel.loaicapphep,
          idcanhantochuc: inputModel.idcanhantochuc,
          tencanhantochuc: inputModel.tencanhantochuc,
          sogiayto: inputModel.sogiayto,
          loaigiayto: inputModel.loaigiayto,
          ngaycap:  inputModel.ngaycap,
          noicap: inputModel.noicap,
          diachi: inputModel.diachi,
          dienthoai: inputModel.dienthoai,
          fax: inputModel.fax,
          email: inputModel.email,
          website: inputModel.website,
          loaidoituong: inputModel.loaidoituong,
          idhoso: inputModel.idhoso,
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
      sogiayphep: { required: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.giayphep.sogiayphepRequired },
      ngaycapphep: { required: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.giayphep.ngaycapphepRequired },
      ngaybdhieuluc: { required: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.giayphep.ngaybdhieulucRequired },
      ngaykthieuluc: { required: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.giayphep.ngaykthieulucRequired },
      thoihan: { required: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.giayphep.thoihanRequired },
      donvithoihan: { required: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.giayphep.donvithoihanRequired },
      idcoquancapphep: { required: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.giayphep.idcoquancapphepRequired },
      coquancapphep: { required: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.giayphep.coquancapphepRequired },
      chucvunguoiky: { required: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.giayphep.chucvunguoikyRequired },
      tennguoiky: { required: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.giayphep.tennguoikyRequired },
      loaivanban: { required: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.giayphep.loaivanbanRequired },
      loaicapphep: { required: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.giayphep.loaicapphepRequired },
      idcanhantochuc: { required: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.giayphep.idcanhantochucRequired },
      tencanhantochuc: { required: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.giayphep.tencanhantochucRequired },
      sogiayto: { required: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.giayphep.sogiaytoRequired },
      loaigiayto: { required: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.giayphep.loaigiaytoRequired },
      ngaycap:  { required: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.giayphep.ngaycapRequired },
      noicap: { required: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.giayphep.noicapRequired },
      diachi: { required: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.giayphep.diachiRequired },
      dienthoai:  { pattern: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.giayphep.dienthoaiIsNumber },
      loaidoituong: { required: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.giayphep.loaidoituongRequired }
      // idhoso: { required: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.giayphep.idhosoRequired },
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
    const giayPhepFacadeService = this.capPhepHoatDongKhoangSanFacadeService.getGiayPhepService();
    const hosoItem = await giayPhepFacadeService.getByid(idGiayPhep).toPromise();
    return hosoItem;
  }

  async saveItemHoSo() {
    this.logAllValidationErrorMessages();

    if (!this.giayPhepIOForm.valid) {
      return;
    }

    // Gán dữ liệu input vào model
    const giayPhepFacadeService = this.capPhepHoatDongKhoangSanFacadeService.getGiayPhepService();
    const inputModel = this.giayPhepIOForm.value;
    const currentLoaiCapPhep = this.loaiCapPhepList.find(item => item.maloaicapphep === this.giayPhepIOForm.controls.loaicapphep.value);
    inputModel.nhomloaicapphep = currentLoaiCapPhep.nhomloaicapphep;
    inputModel.tencanhantochuc = this.giayPhepIOForm.controls.tencanhantochuc.value;
    if (this.currentAction === GiayPhepActionEnum.Add && (this.insertedState === InsertedState.SaveAndRefresh || this.insertedState === InsertedState.SaveAndEdit)) {
      giayPhepFacadeService.addItem(inputModel).subscribe(
        async (res) => {
          if (this.insertedState === InsertedState.SaveAndEdit) {
            this.idgiayphep = res.idhoso;
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
      inputModel.tencanhantochuc = this.giayPhepIOForm.controls.tencanhantochuc.value;
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
    this.giayPhepIOForm.controls.loaigiayto.setValue("");
    this.giayPhepIOForm.controls.loaicapphep.setValue("");
    this.giayPhepIOForm.controls.hinhthucnophoso.setValue("");
    this.giayPhepIOForm.controls.hinhthucnhanketqua.setValue("");
    this.giayPhepIOForm.controls.idcoquantiepnhan.setValue("");
  }

  /**
   * Hàm mở sidenav
   */
  openCaNhanToChucIOSidenav() {
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
        "",
        this.dataTranslate.DANGKYHOATDONGKHOANGSAN.hoso.chonloaidoituongRequiredDialog,
        this.dataTranslate.DANGKYHOATDONGKHOANGSAN.hoso.informedDialogTitle,
      );
    }
  }

  /**
   * lấy item dữ liệu đối tượng cá nhân từ popup
   */
  private selectItemCaNhan(item: OutputDmCanhanModel) {
    if (item !== null && item !== undefined) {
      this.giayPhepIOForm.controls.idcanhantochuc.setValue(item.idcanhan);
      this.giayPhepIOForm.controls.tencanhantochuc.setValue(item.hovaten);
    }
  }

  /**
   * lấy item dữ liệu đối tượng tổ chức từ popup
   */
  private selectItemToChuc(item: OutputDmToChucModel) {
    if (item !== null && item !== undefined) {
      this.giayPhepIOForm.controls.idcanhantochuc.setValue(item.idtochuc);
      this.giayPhepIOForm.controls.tencanhantochuc.setValue(item.tentochuc);
    }
  }

  /**
   * Thay đổi loại đối tượng trên form
   */
  selectLoaiDoiTuongChange() {
    this.giayPhepIOForm.controls.idcanhantochuc.setValue("");
    this.giayPhepIOForm.controls.tencanhantochuc.setValue("");
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

  openHoSoIOSidenav() {
    // clear Sidenav
    this.matSidenavService.clearSidenav();
    // Khởi tạo sidenav
    this.matSidenavService.setSidenav(this.matSidenav, this, this.content, this.cfr);
    this.matSidenavService.setTitle(this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.giayphep.titleHoSoSelect);
    this.matSidenavService.setContentComp(null, "select");
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
