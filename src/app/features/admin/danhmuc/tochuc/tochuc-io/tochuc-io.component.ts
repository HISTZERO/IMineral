import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { HttpErrorResponse } from "@angular/common/http";

import { InputToChucModel } from "src/app/models/admin/danhmuc/tochuc.model";
import { OutputDvhcModel } from "src/app/models/admin/danhmuc/dvhc.model";
import { TrangThai } from "src/app/shared/constants/trangthai-constants";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { DmFacadeService } from "src/app/services/admin/danhmuc/danhmuc-facade.service";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { validationAllErrorMessagesService } from "src/app/services/utilities/validatorService";
import { LoaiGiayTo } from "src/app/shared/constants/loaigiayto-constants";
import { OutputLoaiToChucModel } from "src/app/models/admin/danhmuc/loaitochuc.model";

@Component({
  selector: 'app-tochuc-io',
  templateUrl: './tochuc-io.component.html',
  styleUrls: ['./tochuc-io.component.scss']
})
export class TochucIoComponent implements OnInit {

  // Chứa dữ liệu Form
  public tochucIOForm: FormGroup;

  // Chứa dữ liệu đối tượng truyền từ list comp
  public obj: any;

  // Chứa kiểu form
  public purpose: string;

  // Chứa chế độ form
  public editMode: boolean;

  // Chứa dữ liệu input
  public inputModel: InputToChucModel;

  // Chứa danh sách Dvhc Tỉnh
  public allTinh: any;

  // Chứa danh sách Dvhc Huyện
  public allHuyen: any;

  // Chứa danh sách Dvhc Xã
  public allXa: any;
  
  // Filter Đơn vị hành chính Tỉnh
  public dvhcProvinceFilters: OutputDvhcModel[];

  // Filter Đơn vị hành chính Huyện
  public dvhcDistrictFilters: OutputDvhcModel[];

  // Filter Đơn vị hành chính Xã
  public dvhcWardFilters: OutputDvhcModel[];

  // Chứa danh sách loại tổ chức
  public listLoaiToChuc: OutputLoaiToChucModel[];

  // Chứa danh sách loại tổ chức Filter
  public listLoaiToChucFilter: OutputLoaiToChucModel[];
  
  // Chứa dữ liệu Trạng thái
  public trangthai = TrangThai;

  // Chứa loại giấy tờ
  public loaigiayto = LoaiGiayTo;

  // Chứa dữ liệu translate
  public dataTranslate: any;

  // error message
  validationErrorMessages = {};

  // form errors
  formErrors = {
    tentochuc: "",
    diachi: "",
    sogiayto: "",
    loaigiayto: "",
    ngaycap: "",
    noicap: "",
    fax: "",
    website: "",
    idloaitochuc: "",
    dienthoai: "",
    email: "",
    matinh: "",
    mahuyen: "",
    maxa: "",
    trangthai: "",
    thutu: "",
  };

  // Contructor
  constructor(
    public matSidenavService: MatsidenavService,
    public dmFacadeService: DmFacadeService,
    private formBuilder: FormBuilder,
    public commonService: CommonServiceShared,
    private translate: TranslateService
  ) {}

  async ngOnInit() {
    // Khởi tạo form
    await this.formInit();
    //Khởi tạo form theo dạng add or edit
    await this.bindingConfigAddOrUpdate();
    // Lấy dữ liệu translate
    await this.getDataTranslate();
    // Lấy dữ liệu loại tổ chức
    this.getAllLoaiToChuc();
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
   * Hàm set validate
   */
  setValidation() {
    this.validationErrorMessages = {
     tentochuc: { required: this.dataTranslate.DANHMUC.tochuc.tentochucRequired },
     dienthoai: { pattern: this.dataTranslate.DANHMUC.tochuc.dienthoaiIsNumber},
     matinh: { required: this.dataTranslate.DANHMUC.tochuc.matinhRequired },
     mahuyen: { required: this.dataTranslate.DANHMUC.tochuc.mahuyenRequired },
    };
  }

  /**
   * Hàm lấy dữ liệu loại tổ chức
   */
  async getAllLoaiToChuc() {
    this.listLoaiToChuc = [];
    const listData: any = await this.dmFacadeService
      .getLoaiToChucService()
      .getFetchAll({ PageNumber: 1, PageSize: -1 });
    // this.listLoaiToChuc = listData.items;
  }

  /**
   * Hàm khởi tạo form theo dạng edit
   */
  bindingConfigAddOrUpdate() {
    this.showDvhcTinh();
    this.editMode = false;
    this.inputModel = new InputToChucModel();
    // check edit
    this.formOnEdit();
  }

  /**
   * Hàm khởi tạo form
   */
  formInit() {
    this.tochucIOForm = this.formBuilder.group({
      tentochuc: ["", Validators.required],
      diachi: [""],
      sogiayto: [""],
      loaigiayto: [""],
      ngaycap: [""],
      noicap: [""],
      idloaisolieu: [""],
      fax: [""],
      website: [""],
      dienthoai: ["", Validators.pattern("^[0-9-+]+$")],
      email: [""],
      matinh: ["", Validators.required],
      mahuyen: ["", Validators.required],
      maxa: [""],
      trangthai: [""],
      thutu: [""],
    });
  }

  /**
   * hàm set value cho form
   */
  formOnEdit() {
    if (this.obj && this.purpose === 'edit') {
      this.tochucIOForm.setValue({
        tencoquanquanly: this.obj.tencoquanquanly,
        diachi: this.obj.diachi,
        sogiayto: this.obj.sogiayto,
        loaigiayto: this.obj.loaigiayto,
        ngaycap: this.obj.ngaycap,
        noicap: this.obj.noicap,
        idloaisolieu: this.obj.idloaisolieu,
        fax: this.obj.fax,
        website: this.obj.website,
        dienthoai: this.obj.dienthoai,
        email: this.obj.email,
        matinh: this.obj.matinh,
        mahuyen: this.obj.mahuyen,
        maxa: this.obj.maxa,
        trangthai: this.obj.trangthai,
        thutu: this.obj.thutu,
      });
      this.showDvhcHuyen();
      this.showDvhcXa();
    }
    this.editMode = true;
  }

  /**
   * Hàm lấy danh sách Dvhc Tỉnh
   */
  async showDvhcTinh() {
    const allTinhData: any = await this.dmFacadeService
      .getProvinceService()
      .getFetchAll({ PageNumber: 1, PageSize: -1 });
    this.allTinh = allTinhData.items;
    this.dvhcProvinceFilters = allTinhData.items;
  }

  /**
   * Hàm lấy danh sách Dvhc Huyện
   */
  async showDvhcHuyen() {
    if (!this.tochucIOForm.value.matinh === true) {
      this.allHuyen = [];
      this.dvhcDistrictFilters = [];
      this.allXa = [];
      this.dvhcWardFilters = [];
      if (this.editMode === true) {
        this.tochucIOForm.controls["mahuyen"].setValue("");
      }
    }
    if (!this.tochucIOForm.value.matinh === false) {
      if (this.editMode === true) {
        this.tochucIOForm.controls["mahuyen"].setValue("");
      }
      this.allXa = [];
      this.dvhcWardFilters = [];
      this.allHuyen = await this.dmFacadeService
        .getDistrictService()
        .getFetchAll({ matinh: this.tochucIOForm.value.matinh });
      this.dvhcDistrictFilters = this.allHuyen;
    }
  }

  /**
   * Hàm lấy danh sách Dvhc Xã
   */
  async showDvhcXa() {
    if (!this.tochucIOForm.value.mahuyen === true) {
      this.allXa = [];
      this.dvhcWardFilters = [];
      if (this.editMode === true) {
        this.tochucIOForm.controls["maxa"].setValue("");
      }
    }
    if (
      !this.tochucIOForm.value.matinh === false &&
      !this.tochucIOForm.value.mahuyen === false
    ) {
      if (this.editMode === true) {
        this.tochucIOForm.controls["maxa"].setValue("");
      }
      this.allXa = await this.dmFacadeService
        .getWardService()
        .getFetchAll({ mahuyen: this.tochucIOForm.value.mahuyen });
      this.dvhcWardFilters = this.allXa;
    }
  }

  /**
   * Hàm thực thi chức năng add và edit
   */
  private addOrUpdate(operMode: string) {
    const dmFacadeService = this.dmFacadeService.getToChucService();
    this.inputModel = this.tochucIOForm.value;
    if (operMode === "new") {
      dmFacadeService.addItem(this.inputModel).subscribe(
        (res) => this.matSidenavService.doParentFunction("getAllToChuc"),
        (error: HttpErrorResponse) => {
          this.commonService.showError(error);
        },
        () =>
          this.commonService.showeNotiResult(
            this.dataTranslate.COMMON.default.successAdd,
            2000
          )
      );
    } else if (operMode === "edit") {
      this.inputModel.idtochuc = this.obj.idtochuc;
      dmFacadeService.updateItem(this.inputModel).subscribe(
        (res) => this.matSidenavService.doParentFunction("getAllToChuc"),
        (error: HttpErrorResponse) => {
          this.commonService.showError(error);
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
   * Hàm được gọi khi nhấn nút Lưu, Truyền vào operMode để biết là Edit hay tạo mới
   * @param operMode 
   */
  async onSubmit(operMode: string) {
    this.logAllValidationErrorMessages();
    if (this.tochucIOForm.valid === true) {
      this.addOrUpdate(operMode);
      this.matSidenavService.close();
    }
  }

  /**
   * Hàm reset form, gọi khi nhấn nút reset dữ liệu
   */
  public onFormReset() {
    // Hàm .reset sẽ xóa trắng mọi control trên form
    this.tochucIOForm.reset();
  }

  /**
   * Hàm lưu và reset form để tiếp tục nhập mới dữ liệu. Trường hợp này khi người dùng muốn nhập dữ liệu liên tục
   * @param operMode 
   */
  async onContinueAdd(operMode: string) {
    this.logAllValidationErrorMessages();
    if (this.tochucIOForm.valid === true) {
      this.addOrUpdate(operMode);
      this.onFormReset();
      this.purpose = "new";
    }
  }

  /**
   * hàm kiểm tra validation form
   */
  public logAllValidationErrorMessages() {
    validationAllErrorMessagesService(
      this.tochucIOForm,
      this.validationErrorMessages,
      this.formErrors
    );
  }

  /**
   * Hàm close sidenav
   */
  public closeToChucIOSidenav() {
    this.matSidenavService.close();
  }


  /**
   *  Hàm gọi từ function con gọi vào chạy function cha
   * @param methodName
   */
  doFunction(methodName) {
    this[methodName]();
  }

}
