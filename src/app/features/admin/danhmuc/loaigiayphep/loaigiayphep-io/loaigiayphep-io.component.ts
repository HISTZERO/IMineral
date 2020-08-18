import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { HttpErrorResponse } from "@angular/common/http";

import { InputLoaiGiayPhepModel } from "src/app/models/admin/danhmuc/loaigiayphep.model";
import { TrangThai } from "src/app/shared/constants/trangthai-constants";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { DmFacadeService } from "src/app/services/admin/danhmuc/danhmuc-facade.service";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { validationAllErrorMessagesService } from "src/app/services/utilities/validatorService";
import { NhomLoaiGiayPhep } from "src/app/shared/constants/nhomloaigiayphep-constants";
import { ThuTucHanhChinh } from "src/app/shared/constants/thutuchanhchinh-constants";

@Component({
  selector: 'app-loaigiayphep-io',
  templateUrl: './loaigiayphep-io.component.html',
  styleUrls: ['./loaigiayphep-io.component.scss']
})
export class LoaigiayphepIoComponent implements OnInit {

  // Chứa dữ liệu Form
  public loaiGiayPhepIOForm: FormGroup;

  // Chứa dữ liệu đối tượng truyền từ list comp
  public obj: any;

  // Chứa kiểu form
  public purpose: string;

  // Chứa chế độ form
  public editMode: boolean;

  // Chứa dữ liệu input
  public inputModel: InputLoaiGiayPhepModel;

  // Chứa dữ liệu Trạng thái
  public trangthai = TrangThai;

  // Chứa dữ liệu Nhóm loại giấy phép
  public nhomLoaiGiayPhep = NhomLoaiGiayPhep;

  // Chứa dữ liệu thủ tục hành chính
  public thuTucHanhChinh = ThuTucHanhChinh;

  // Chứa dữ liệu translate
  public dataTranslate: any;

  // error message
  validationErrorMessages = {};

  // form errors
  formErrors = {
    maloaigiayphep: "",
    tenloaigiayphep: "",
    nhomloaigiayphep: "",
    idthutuchanhchinh: "",
    mota: "",
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
      tenloaigiayphep: { required: this.dataTranslate.DANHMUC.loaigiayphep.tenloaigiayphepRequired },
      thutu: { pattern: this.dataTranslate.DANHMUC.loaigiayphep.thutuIsNumber }
    };
  }

  /**
    * Hàm khởi tạo form theo dạng edit
    */
  bindingConfigAddOrUpdate() {
    this.editMode = false;
    this.inputModel = new InputLoaiGiayPhepModel();
    // check edit
    this.formOnEdit();
  }

  /**
    * Hàm khởi tạo form
    */
  formInit() {
    this.loaiGiayPhepIOForm = this.formBuilder.group({
      maloaigiayphep: [""],
      tenloaigiayphep: ["", Validators.required],
      nhomloaigiayphep: [""],
      idthutuchanhchinh: [""],
      mota: [""],
      trangthai: [""],
      thutu: ["", Validators.pattern("^[0-9-+]+$")],
    });
  }

  /**
    * hàm set value cho form
    */
  formOnEdit() {
    if (this.obj && this.purpose === 'edit') {
      this.loaiGiayPhepIOForm.setValue({
        maloaigiayphep: this.obj.maloaigiayphep,
        tenloaigiayphep: this.obj.tenloaigiayphep,
        nhomloaigiayphep: +this.obj.nhomloaigiayphep,
        idthutuchanhchinh: +this.obj.idthutuchanhchinh,
        mota: this.obj.mota,
        trangthai: this.obj.trangthai,
        thutu: this.obj.thutu,
      });
    }
    this.editMode = true;
  }

  /**
    * Hàm thực thi chức năng add và edit
    */
  private addOrUpdate(operMode: string) {
    const dmFacadeService = this.dmFacadeService.getLoaiGiayPhepService();
    this.inputModel = this.loaiGiayPhepIOForm.value;
    if (operMode === "new") {
      dmFacadeService.addItem(this.inputModel).subscribe(
        (res) => this.matSidenavService.doParentFunction("getAllLoaiGiayPhep"),
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
      this.inputModel.idloaigiayphep = this.obj.idloaigiayphep;
      dmFacadeService.updateItem(this.inputModel).subscribe(
        (res) => this.matSidenavService.doParentFunction("getAllLoaiGiayPhep"),
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
    if (this.loaiGiayPhepIOForm.valid === true) {
      this.addOrUpdate(operMode);
      this.matSidenavService.close();
    }
  }

  /**
    * Hàm reset form, gọi khi nhấn nút reset dữ liệu
    */
  public onFormReset() {
    // Hàm .reset sẽ xóa trắng mọi control trên form
    this.loaiGiayPhepIOForm.reset();
  }

  /**
    * Hàm lưu và reset form để tiếp tục nhập mới dữ liệu. Trường hợp này khi người dùng muốn nhập dữ liệu liên tục
    * @param operMode 
    */
  async onContinueAdd(operMode: string) {
    this.logAllValidationErrorMessages();
    if (this.loaiGiayPhepIOForm.valid === true) {
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
      this.loaiGiayPhepIOForm,
      this.validationErrorMessages,
      this.formErrors
    );
  }

  /**
    * Hàm close sidenav
    */
  public closeLoaiGiayPhepIOSidenav() {
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
