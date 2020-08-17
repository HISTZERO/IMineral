import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { HttpErrorResponse } from "@angular/common/http";

import { InputCapTaiNguyenModel } from "src/app/models/admin/danhmuc/captainguyen.model";
import { TrangThai } from "src/app/shared/constants/trangthai-constants";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { DmFacadeService } from "src/app/services/admin/danhmuc/danhmuc-facade.service";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { validationAllErrorMessagesService } from "src/app/services/utilities/validatorService";
import { NhomCapTaiNguyen } from "src/app/shared/constants/common-constants";

@Component({
  selector: 'app-captainguyen-io',
  templateUrl: './captainguyen-io.component.html',
  styleUrls: ['./captainguyen-io.component.scss']
})
export class CaptainguyenIoComponent implements OnInit {

  // Chứa dữ liệu Form
  public capTaiNguyenIOForm: FormGroup;

  // Chứa dữ liệu đối tượng truyền từ list comp
  public obj: any;

  // Chứa kiểu form
  public purpose: string;

  // Chứa chế độ form
  public editMode: boolean;

  // Chứa dữ liệu input
  public inputModel: InputCapTaiNguyenModel;

  // Chứa dữ liệu Trạng thái
  public trangthai = TrangThai;

  // Chứa nhóm cấp tài nguyên
  public nhomCapTainguyen = NhomCapTaiNguyen;

  // Chứa dữ liệu translate
  public dataTranslate: any;

  // error message
  validationErrorMessages = {};

  // form errors
  formErrors = {
    macaptainguyen: "",
    tencaptainguyen: "",
    nhomcaptainguyen: "",
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
  public setValidation() {
    this.validationErrorMessages = {
      thutu: { pattern: this.dataTranslate.DANHMUC.captainguyen.thutuIsNumber }
    };
  }

  /**
   * Hàm khởi tạo form theo dạng edit
   */
  public bindingConfigAddOrUpdate() {
    this.editMode = false;
    this.inputModel = new InputCapTaiNguyenModel();
    // check edit
    this.formOnEdit();
  }

  /**
   * Hàm khởi tạo form
   */
  public formInit() {
    this.capTaiNguyenIOForm = this.formBuilder.group({
      macaptainguyen: [""],
      tencaptainguyen: [""],
      nhomcaptainguyen: [""],
      mota: [""],
      trangthai: [""],
      thutu: ["",  Validators.pattern("^[0-9-+]+$")],
    });
  }

  /**
   * hàm set value cho form
   */
  public formOnEdit() {
    if (this.obj && this.purpose === 'edit') {
      this.capTaiNguyenIOForm.setValue({
        macaptainguyen: this.obj.macaptainguyen,
        tencaptainguyen: this.obj.tencaptainguyen,
        nhomcaptainguyen: this.obj.nhomcaptainguyen,
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
    const dmFacadeService = this.dmFacadeService.getCapTaiNguyenService();
    this.inputModel = this.capTaiNguyenIOForm.value;
    if (operMode === "new") {
      dmFacadeService.addItem(this.inputModel).subscribe(
        (res) => this.matSidenavService.doParentFunction("getAllCapTaiNguyen"),
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
      this.inputModel.idcaptainguyen = this.obj.idcaptainguyen;
      dmFacadeService.updateItem(this.inputModel).subscribe(
        (res) => this.matSidenavService.doParentFunction("getAllCapTaiNguyen"),
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
    if (this.capTaiNguyenIOForm.valid === true) {
      this.addOrUpdate(operMode);
      this.matSidenavService.close();
    }
  }

  /**
   * Hàm reset form, gọi khi nhấn nút reset dữ liệu
   */
  public onFormReset() {
    // Hàm .reset sẽ xóa trắng mọi control trên form
    this.capTaiNguyenIOForm.reset();
  }

  /**
   * Hàm lưu và reset form để tiếp tục nhập mới dữ liệu. Trường hợp này khi người dùng muốn nhập dữ liệu liên tục
   * @param operMode 
   */
  async onContinueAdd(operMode: string) {
    this.logAllValidationErrorMessages();
    if (this.capTaiNguyenIOForm.valid === true) {
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
      this.capTaiNguyenIOForm,
      this.validationErrorMessages,
      this.formErrors
    );
  }

  /**
   * Hàm close sidenav
   */
  public closeCapTaiNguyenIOSidenav() {
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
