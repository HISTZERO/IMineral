import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { HttpErrorResponse } from "@angular/common/http";

import { InputDmLoaiCapPhepModel } from "src/app/models/admin/danhmuc/loaicapphep.model";
import { TrangThai } from "src/app/shared/constants/trangthai-constants";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { DmFacadeService } from "src/app/services/admin/danhmuc/danhmuc-facade.service";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { validationAllErrorMessagesService } from "src/app/services/utilities/validatorService";
import { NhomLoaiCapPhep } from "src/app/shared/constants/nhomloaicapphep-constants";


@Component({
  selector: 'app-loaicapphep-io',
  templateUrl: './loaicapphep-io.component.html',
  styleUrls: ['./loaicapphep-io.component.scss']
})
export class DmLoaicapphepIoComponent implements OnInit {

  // Chứa dữ liệu Form
  public loaiCapPhepIOForm: FormGroup;

  // Chứa dữ liệu đối tượng truyền từ list comp
  public obj: any;

  // Chứa kiểu form
  public purpose: string;

  // Chứa dữ liệu input
  public inputModel: InputDmLoaiCapPhepModel;

  // Chứa dữ liệu Trạng thái
  public trangthai = TrangThai;

  // Chứa dữ liệu Nhóm loại cấp phép
  public nhomLoaiCapPhep = NhomLoaiCapPhep;

  // Chứa dữ liệu thủ tục hành chính
  public listThuTucHanhChinh: any;

  // Chứa dữ liệu translate
  public dataTranslate: any;

  // Chứa kiểu boolean hiển thị thuộc tính column
  public classColDvhc: boolean = false;

  // Tên thủ tục hành chính hiển thị
  public tenThuTucDisplay: string;

  // chứa thông tin combobox được backup trong trường hợp update
  public dataComboboxModel: any;

  // error message
  validationErrorMessages = {};

  // form errors
  formErrors = {
    maloaicapphep: "",
    tenloaicapphep: "",
    nhomloaicapphep: "",
    idthutuchanhchinh: "",
    thutuchanhchinh: "",
    mota: "",
    thutu: "",
  };

  // Contructor
  constructor(
    public matSidenavService: MatsidenavService,
    public dmFacadeService: DmFacadeService,
    private formBuilder: FormBuilder,
    public commonService: CommonServiceShared,
    private translate: TranslateService
  ) { }

  async ngOnInit() {
    // Khởi tạo form
    await this.formInit();
    //Khởi tạo form theo dạng add or edit
    await this.bindingConfigAddOrUpdate();
    // Lấy dữ liệu translate
    await this.getDataTranslate();
    // Lấy dữ liệu thủ tục hành chính
    this.getAllThuTucHanhChinh();
  }

  /**
    * Hàm lấy dữ liệu translate
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
      tenloaicapphep: { required: this.dataTranslate.DANHMUC.loaicapphep.tenloaicapphepRequired },
      thutu: { pattern: this.dataTranslate.DANHMUC.loaicapphep.thutuIsNumber },
      idthutuchanhchinh: { required: this.dataTranslate.DANHMUC.loaicapphep.thutuchanhchinhRequired },
      nhomloaicapphep: { required: this.dataTranslate.DANHMUC.loaicapphep.nhomloaicapphepRequired }
    };
  }

  /**
   * Hàm khởi tạo form theo dạng edit
   */
  bindingConfigAddOrUpdate() {
    this.inputModel = new InputDmLoaiCapPhepModel();
    // check edit
    this.formOnEdit();
  }

  /**
   * Hàm khởi tạo form
   */
  formInit() {
    this.loaiCapPhepIOForm = this.formBuilder.group({
      maloaicapphep: [""],
      tenloaicapphep: ["", Validators.required],
      nhomloaicapphep: ["", Validators.required],
      idthutuchanhchinh: ["", Validators.required],
      thutuchanhchinh: [""],
      mota: [""],
      thutu: ["", Validators.pattern("^[0-9-+]+$")],
    });
  }

  /**
   * hàm set value cho form
   */
  formOnEdit() {
    if (this.obj && this.purpose === 'edit') {
      this.classColDvhc = true;
      this.loaiCapPhepIOForm.setValue({
        maloaicapphep: this.obj.maloaicapphep,
        tenloaicapphep: this.obj.tenloaicapphep,
        nhomloaicapphep: +this.obj.nhomloaicapphep,
        thutuchanhchinh: { idthutuchanhchinh: this.obj.idthutuchanhchinh, tenthutuchanhchinh: this.obj.tenthutuchanhchinh },
        idthutuchanhchinh: this.obj.idthutuchanhchinh,
        mota: this.obj.mota,
        thutu: this.obj.thutu,
      });
      this.dataComboboxModel = {
        idthutuc: this.obj.idthutuchanhchinh,
        tenthutuc: this.obj.tenthutuchanhchinh,
      };
      this.tenThuTucDisplay = this.obj.tenthutuchanhchinh;
    }
  }

  /**
   * Hàm lấy dữ liệu Thủ tục hành chính
   */
  async getAllThuTucHanhChinh() {
    const listData: any = await this.dmFacadeService
      .getDmThuTucHanhChinhService()
      .getFetchAll({ PageNumber: 1, PageSize: -1 });
    this.listThuTucHanhChinh = listData.items;
  }

  /**
    * Hàm thực thi chức năng add và edit
    */
  private addOrUpdate(operMode: string) {
    const dmFacadeService = this.dmFacadeService.getDmLoaiCapPhepService();
    this.inputModel = this.loaiCapPhepIOForm.value;
    if (operMode === "new") {
      dmFacadeService.addItem(this.inputModel).subscribe(
        (res) => this.matSidenavService.doParentFunction("getAllLoaiCapPhep"),
        (error: HttpErrorResponse) => {
          this.commonService.showDialogWarning(error.error.errors);
        },
        () =>
          this.commonService.showeNotiResult(
            this.dataTranslate.COMMON.default.successAdd,
            2000
          )
      );
    } else if (operMode === "edit") {
      this.inputModel.idloaicapphep = this.obj.idloaicapphep;
      this.inputModel.trangthai = this.obj.trangthai;
      dmFacadeService.updateItem(this.inputModel).subscribe(
        (res) => this.matSidenavService.doParentFunction("getAllLoaiCapPhep"),
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
    * Hàm được gọi khi nhấn nút Lưu, Truyền vào operMode để biết là Edit hay tạo mới
    * @param operMode
    */
  async onSubmit(operMode: string) {
    this.logAllValidationErrorMessages();
    if (this.loaiCapPhepIOForm.valid === true) {
      this.addOrUpdate(operMode);
      this.matSidenavService.close();
    }
  }

  /**
    * Hàm reset form, gọi khi nhấn nút reset dữ liệu
    */
  public onFormReset() {
    // Hàm .reset sẽ xóa trắng mọi control trên form
    this.loaiCapPhepIOForm.reset({
      maloaicapphep: "",
      tenloaicapphep: "",
      nhomloaicapphep: "",
      idthutuchanhchinh: "",
      thutuchanhchinh: "",
      mota: "",
      thutu: "",
    });
  }

  /**
   * Hàm chuyển đổi dữ liệu thủ thục combobox khi select
   */
  public selectThuTucHanhChinh() {
    if (this.obj && this.purpose === 'edit') {
      if (this.loaiCapPhepIOForm.value.thutuchanhchinh) {
        this.loaiCapPhepIOForm.controls.idthutuchanhchinh.setValue(this.loaiCapPhepIOForm.value.thutuchanhchinh.idthutuchanhchinh);
        this.tenThuTucDisplay = this.loaiCapPhepIOForm.value.thutuchanhchinh.tenthutuchanhchinh;
      } else {
        this.loaiCapPhepIOForm.controls.idthutuchanhchinh.setValue(this.dataComboboxModel.idthutuc);
        this.tenThuTucDisplay = this.dataComboboxModel.tenthutuc;
      }
    } else {
      this.loaiCapPhepIOForm.controls.idthutuchanhchinh.setValue(this.loaiCapPhepIOForm.value.thutuchanhchinh.idthutuchanhchinh);
      this.tenThuTucDisplay = "";
    }
  }

  /**
   * Hàm so sánh giá trị thuu tục hành chính combobox
   * @param item1
   * @param item2
   */
  public compareThuTucHanhChinh(item1: any, item2: any) {
    if (item1.idthutuchanhchinh === item2.idthutuchanhchinh) {
      return true;
    } else {
      return false;
    }
  }

  /**
    * Hàm lưu và reset form để tiếp tục nhập mới dữ liệu. Trường hợp này khi người dùng muốn nhập dữ liệu liên tục
    * @param operMode
    */
  async onContinueAdd(operMode: string) {
    this.logAllValidationErrorMessages();
    if (this.loaiCapPhepIOForm.valid === true) {
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
      this.loaiCapPhepIOForm,
      this.validationErrorMessages,
      this.formErrors
    );
  }

  /**
    * Hàm close sidenav
    */
  public closeLoaiCapPhepIOSidenav() {
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
