import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpErrorResponse } from "@angular/common/http";
import { TranslateService } from "@ngx-translate/core";
import { DatePipe } from "@angular/common";

import { InputHsTaiLieuModel } from "src/app/models/admin/dangkyhoatdongkhoangsan/tailieu.model";
import { DangKyHoatDongKhoangSanFacadeService } from "src/app/services/admin/dangkyhoatdongkhoangsan/dangkyhoatdongkhoangsan-facade.service";
import { validationAllErrorMessagesService } from "src/app/services/utilities/validatorService";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { TrangThai } from "src/app/shared/constants/trangthai-constants";
import { NhomTaiLieuEnum } from 'src/app/shared/constants/enum';


@Component({
  selector: 'app-hosotailieu-io',
  templateUrl: './hosotailieu-io.component.html',
  styleUrls: ['./hosotailieu-io.component.scss']
})
export class HosotailieuIoComponent implements OnInit {

  // Chứa dữ liệu Form
  public tailieuIOForm: FormGroup;

  // Chứa dữ liệu đối tượng truyền từ list comp
  public obj: any;

  // Chứa kiểu form
  public purpose: string;

  // Chứa dữ liệu input
  public inputModel: InputHsTaiLieuModel;

  // Chứa dữ liệu translate
  public dataTranslate: any;

  // error message
  validationErrorMessages = {};

  // form errors
  formErrors = {
    tentailieu: "",
    filedinhkem: "",
    sobanchinh: "",
    sobansao: "",
    thutu: ""
  };

  constructor(public matSidenavService: MatsidenavService,
              public dangKyHoatDongKhoangSanFacadeService: DangKyHoatDongKhoangSanFacadeService,
              private formBuilder: FormBuilder,
              public commonService: CommonServiceShared,
              private translate: TranslateService,
              public datePipe: DatePipe
              ) { }

  async ngOnInit() {
    // Khởi tạo form
    await this.formInit();
    // Khởi tạo form theo dạng add or edit
    await this.bindingConfigAddOrUpdate();
    // Lấy dữ liệu translate
    await this.getDataTranslate();
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
      tentailieu: { required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.tailieu.tentailieuRequired },
      sobanchinh: { pattern: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.tailieu.sobanchinhIsNumber },
      sobansao: { pattern: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.tailieu.sobansaoIsNumber },
      thutu: { pattern: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.tailieu.thutuIsNumber }
    };
  }

  /**
   * Hàm khởi tạo form theo dạng edit
   */
  bindingConfigAddOrUpdate() {
    this.inputModel = new InputHsTaiLieuModel();
    // check edit
    this.formOnEdit();
  }

  /**
   * Hàm khởi tạo form
   */
  formInit() {
    this.tailieuIOForm = this.formBuilder.group({
      tentailieu: ["", Validators.required],
      filedinhkem: [""],
      sobanchinh: ["", Validators.pattern("^[0-9-+]+$")],
      sobansao: ["", Validators.pattern("^[0-9-+]+$")],
      thutu: ["", Validators.pattern("^[0-9-+]+$")],
    });
  }

  /**
   * hàm set value cho form
   */
  formOnEdit() {
    if (this.obj && this.purpose === 'edit') {
      this.tailieuIOForm.setValue({
        tentailieu: this.obj.tentailieu,
        filedinhkem: this.obj.filedinhkem,
        sobanchinh: this.obj.sobanchinh,
        sobansao: this.obj.sobansao,
        thutu: this.obj.thutu,
      });
    }
  }


  /**
   * Hàm thực thi chức năng add và edit cho nhóm tài liệu không bắt buộc và nhóm tài liệu xử lý hồ sơ
   */
  private addOrUpdate(operMode: string) {
    if (this.obj === null || this.obj === undefined || this.obj.idhoso === null || this.obj.idhoso === undefined) {
      return;
    }

    if (this.obj && this.obj.nhomtailieu !== NhomTaiLieuEnum.TaiLieuKhongBatBuoc
        && this.obj.nhomtailieu !== NhomTaiLieuEnum.TaiLieuXuLyHoSo) {
      return;
    }

    // Gán dữ liệu input vào model
    const dkhdksService = this.dangKyHoatDongKhoangSanFacadeService.getTaiLieuService();
    this.inputModel = this.tailieuIOForm.value;
    this.inputModel.idhoso = this.obj.idhoso;
    if (operMode === "new") {
      dkhdksService.addItem(this.inputModel).subscribe(
        (res) => this.matSidenavService.doParentFunction("getAllTaiLieu"),
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
      this.inputModel.idtailieu = this.obj.idtailieu;
      this.inputModel.duongdan = this.obj.duongdan;
      this.inputModel.idhoso = this.obj.idhoso;
      this.inputModel.nhomtailieu = this.obj.nhomtailieu;
      this.inputModel.dungluong = this.obj.dungluong;
      this.inputModel.dinhdang = this.obj.dinhdang;
      dkhdksService.updateItem(this.inputModel).subscribe(
        (res) => this.matSidenavService.doParentFunction("getAllTaiLieu"),
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
    if (this.tailieuIOForm.valid === true) {
      this.addOrUpdate(operMode);
      this.matSidenavService.close();
    }
  }

  /**
   * Hàm reset form, gọi khi nhấn nút reset dữ liệu
   */
  public onFormReset() {
    // Hàm .reset sẽ xóa trắng mọi control trên form
    this.tailieuIOForm.reset();
  }

  /**
   * Hàm lưu và reset form để tiếp tục nhập mới dữ liệu. Trường hợp này khi người dùng muốn nhập dữ liệu liên tục
   * @param operMode
   */
  async onContinueAdd(operMode: string) {
    this.logAllValidationErrorMessages();
    if (this.tailieuIOForm.valid === true) {
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
      this.tailieuIOForm,
      this.validationErrorMessages,
      this.formErrors
    );
  }

  /**
   * Hàm close sidenav
   */
  public closeTaiLieuIOSidenav() {
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
