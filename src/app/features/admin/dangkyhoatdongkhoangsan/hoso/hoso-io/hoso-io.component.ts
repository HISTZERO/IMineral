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
  // Nhóm loại cấp phép
  // tslint:disable-next-line: no-input-rename
  @Input("nhomLoaiCapPhep") nhomLoaiCapPhep;
  // State của Save button
  // tslint:disable-next-line: no-input-rename
  @Input("insertedState") insertedState = InsertedState.SaveAndRefresh;
  // Chứa dữ liệu Form
  public hosoIOForm: FormGroup;
  // Chứa dữ liệu translate
  public dataTranslate: any;
  //Chứa loại đối tượng
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
  private idhoso: string;
  // Action thao tác dữ liệu
  private currentAction: number;
  // error message
  validationErrorMessages = {};

  // form errors
  formErrors = {
    mahoso: "",
    mabiennhan: "",
    soden: "",
    ngaynop: "",
    ngaytiepnhan: "",
    ngaytraketqua: "",
    loaidoituong: "",
    loaicapphep: "",
    hinhthucnophoso: "",
    hinhthucnhanketqua: "",
    idcoquantiepnhan: "",
    idcanhantochuc: "",
    tencanhantochuc: "",
    sogiayto: "",
    loaigiayto: "",
    ngaycap: "",
    noicap: "",
    diachi: "",
    dienthoai: "",
    fax: "",
    email: "",
    website: "",
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
      if (param && param.params && param.params.idhoso) {
        this.idhoso = param.params.idhoso;
      }
    });

    if (this.idhoso !== null && this.idhoso !== undefined) {
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
      mahoso: ["", Validators.required],
      mabiennhan: [""],
      soden: [""],
      ngaynop: ["", Validators.required],
      ngaytiepnhan: ["", Validators.required],
      ngaytraketqua: ["", Validators.required],
      loaidoituong: [LoaiDoiTuongEnum.ToChuc, Validators.required],
      loaicapphep: ["", Validators.required],
      hinhthucnophoso: ["", Validators.required],
      hinhthucnhanketqua: ["", Validators.required],
      idcoquantiepnhan: ["", Validators.required],
      idcanhantochuc: ["", Validators.required],
      tencanhantochuc: ["", Validators.required],
      sogiayto: ["", Validators.required],
      loaigiayto: ["", Validators.required],
      ngaycap: ["", Validators.required],
      noicap: ["", Validators.required],
      diachi: ["", Validators.required],
      dienthoai: ["", Validators.pattern("^[0-9-+]+$")],
      fax: [""],
      email: [""],
      website: [""],
    });

    this.hosoIOForm.controls.tencanhantochuc.disable({ onlySelf: true });
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
        loaigiayto: inputModel.loaigiayto,
        ngaycap: inputModel.ngaycap,
        noicap: inputModel.noicap,
        diachi: inputModel.diachi,
        dienthoai: inputModel.dienthoai,
        fax: inputModel.fax,
        email: inputModel.email,
        website: inputModel.website,
      });
    }
  }

  /**
   * Hàm set validate
   */
  private setValidation() {
    this.validationErrorMessages = {
      mahoso: { required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.hoso.mahosoRequired },
      mabiennhan: { required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.hoso.mabiennhanRequired },
      // soden: { required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.hoso.sodenRequired },
      ngaynop: { required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.hoso.ngaynopRequired },
      ngaytiepnhan: { required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.hoso.ngaytiepnhanRequired },
      ngaytraketqua: { required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.hoso.ngaytraketquaRequired },
      loaidoituong: { required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.hoso.loaidoituongRequired },
      loaicapphep: { required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.hoso.loaicapphepRequired },
      hinhthucnophoso: { required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.hoso.hinhthucnophosoRequired },
      hinhthucnhanketqua: { required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.hoso.hinhthucnhanketquaRequired },
      idcoquantiepnhan: { required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.hoso.idcoquantiepnhanRequired },
      tencanhantochuc: { required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.hoso.tencanhantochucRequired },
      sogiayto: { required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.hoso.sogiaytoRequired },
      loaigiayto: { required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.hoso.loaigiaytoRequired },
      ngaycap: { required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.hoso.ngaycapRequired },
      noicap: { required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.hoso.noicapRequired },
      diachi: { required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.hoso.diachiRequired },
      // dienthoai: { required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.hoso.dienthoaiRequired },
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
    const dangKyHoatDongKhoangSanFacadeService = this.dangKyHoatDongKhoangSanFacadeService.getHoSoService();
    const hosoItem = await dangKyHoatDongKhoangSanFacadeService.getByid(idHoSo).toPromise();
    return hosoItem;
  }

  async saveItemHoSo() {
    this.logAllValidationErrorMessages();

    if (!this.hosoIOForm.valid) {
      return;
    }

    // Gán dữ liệu input vào model
    const dangKyHoatDongKhoangSanFacadeService = this.dangKyHoatDongKhoangSanFacadeService.getHoSoService();
    const inputModel = this.hosoIOForm.value;
    const currentLoaiCapPhep = this.loaiCapPhepList.find(item => item.maloaicapphep === this.hosoIOForm.controls.loaicapphep.value);
    inputModel.idthutuchanhchinh = currentLoaiCapPhep.idthutuchanhchinh;
    inputModel.nhomloaicapphep = currentLoaiCapPhep.nhomloaicapphep;
    inputModel.tencanhantochuc = this.hosoIOForm.controls.tencanhantochuc.value;
    if (this.currentAction === HoSoActionEnum.Add && (this.insertedState === InsertedState.SaveAndRefresh || this.insertedState === InsertedState.SaveAndEdit)) {
      dangKyHoatDongKhoangSanFacadeService.addItem(inputModel).subscribe(
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
      dangKyHoatDongKhoangSanFacadeService.updateItem(inputModel).subscribe(
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
    this.hosoIOForm.controls.loaigiayto.setValue("");
    this.hosoIOForm.controls.loaicapphep.setValue("");
    this.hosoIOForm.controls.hinhthucnophoso.setValue("");
    this.hosoIOForm.controls.hinhthucnhanketqua.setValue("");
    this.hosoIOForm.controls.idcoquantiepnhan.setValue("");
  }

  /**
   * Hàm mở sidenav
   */
  openIOSidenav() {
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
      this.hosoIOForm.controls.idcanhantochuc.setValue(item.idcanhan);
      this.hosoIOForm.controls.tencanhantochuc.setValue(item.hovaten);
    }
  }

  /**
   * lấy item dữ liệu đối tượng tổ chức từ popup
   */
  private selectItemToChuc(item: OutputDmToChucModel) {
    if (item !== null && item !== undefined) {
      this.hosoIOForm.controls.idcanhantochuc.setValue(item.idtochuc);
      this.hosoIOForm.controls.tencanhantochuc.setValue(item.tentochuc);
    }
  }

  /**
   * Thay đổi loại đối tượng trên form
   */
  selectLoaiDoiTuongChange() {
    this.hosoIOForm.controls.idcanhantochuc.setValue("");
    this.hosoIOForm.controls.tencanhantochuc.setValue("");
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
