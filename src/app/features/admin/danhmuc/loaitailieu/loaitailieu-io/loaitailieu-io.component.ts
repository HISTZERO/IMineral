import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { HttpErrorResponse } from "@angular/common/http";
import { MatDialog } from "@angular/material";

import { InputDmLoaiTaiLieuModel } from "src/app/models/admin/danhmuc/loaitailieu.model";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { DmFacadeService } from "src/app/services/admin/danhmuc/danhmuc-facade.service";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { validationAllErrorMessagesService } from "src/app/services/utilities/validatorService";
import { NhomLoaiTaiLieu } from "src/app/shared/constants/nhomloaitailieu";
import { MyAlertDialogComponent } from "src/app/shared/components/my-alert-dialog/my-alert-dialog.component";

@Component({
  selector: 'app-loaitailieu-io',
  templateUrl: './loaitailieu-io.component.html',
  styleUrls: ['./loaitailieu-io.component.scss']
})
export class DmLoaitailieuIoComponent implements OnInit {

  // Chứa dữ liệu Form
  public loaiTaiLieuIOForm: FormGroup;

  // Chứa dữ liệu đối tượng truyền từ list comp
  public obj: any;

  // Chứa kiểu form
  public purpose: string;

  // Chứa chế độ form
  public editMode: boolean;

  // Chứa dữ liệu input
  public inputModel: InputDmLoaiTaiLieuModel;

  // Chứa dữ liệu translate
  public dataTranslate: any;

  // Chứa danh sách nhóm loại tài liệu
  public listNhomloaitailieu = NhomLoaiTaiLieu;

  // error message
  validationErrorMessages = {};

  // form errors
  formErrors = {
    maloaitailieu: "",
    tenloaitailieu: "",
    mota: "",
    thutu: "",
    nhomloaitailieu: ""
  };

  // Contructor
  constructor(
    public matSidenavService: MatsidenavService,
    public dmFacadeService: DmFacadeService,
    private formBuilder: FormBuilder,
    public commonService: CommonServiceShared,
    private translate: TranslateService,
    public modalDialog: MatDialog
  ) { }

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
      tenloaitailieu: { required: this.dataTranslate.DANHMUC.loaitailieu.tenloaitailieuRequired },
      thutu: { pattern: this.dataTranslate.DANHMUC.loaitailieu.thutuIsNumber }
    };
  }

  /**
   * Hàm khởi tạo form theo dạng edit
   */
  bindingConfigAddOrUpdate() {
    this.editMode = false;
    this.inputModel = new InputDmLoaiTaiLieuModel();
    // check edit
    this.formOnEdit();
  }

  /**
   * Hàm khởi tạo form
   */
  formInit() {
    this.loaiTaiLieuIOForm = this.formBuilder.group({
      maloaitailieu: [""],
      tenloaitailieu: ["", Validators.required],
      mota: [""],
      thutu: ["", Validators.pattern("^[0-9-+]+$")],
      nhomloaitailieu: [""]
    });
  }

  /**
   * hàm set value cho form
   */
  formOnEdit() {
    if (this.obj && this.purpose === 'edit') {
      this.loaiTaiLieuIOForm.setValue({
        maloaitailieu: this.obj.maloaitailieu,
        tenloaitailieu: this.obj.tenloaitailieu,
        mota: this.obj.mota,
        thutu: this.obj.thutu,
        nhomloaitailieu: +this.obj.nhomloaitailieu
      });
    }
    this.editMode = true;
  }

  /**
   * Hàm thực thi chức năng add và edit
   */
  private addOrUpdate(operMode: string) {
    const dmFacadeService = this.dmFacadeService.getDmLoaiTaiLieuService();
    this.inputModel = this.loaiTaiLieuIOForm.value;
    if (operMode === "new") {
      dmFacadeService.addItem(this.inputModel).subscribe(
        (res) => this.matSidenavService.doParentFunction("getAllLoaiTaiLieu"),
        (error: HttpErrorResponse) => {
          this.showDialogWarning(error.error.errors);
        },
        () =>
          this.commonService.showeNotiResult(
            this.dataTranslate.COMMON.default.successAdd,
            2000
          )
      );
    } else if (operMode === "edit") {
      this.inputModel.idloaitailieu = this.obj.idloaitailieu;
      this.inputModel.trangthai = this.obj.trangthai;
      dmFacadeService.updateItem(this.inputModel).subscribe(
        (res) => this.matSidenavService.doParentFunction("getAllLoaiTaiLieu"),
        (error: HttpErrorResponse) => {
          this.showDialogWarning(error.error.errors);
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
    if (this.loaiTaiLieuIOForm.valid === true) {
      this.addOrUpdate(operMode);
      this.matSidenavService.close();
    }
  }

  /**
   * Hàm reset form, gọi khi nhấn nút reset dữ liệu
   */
  public onFormReset() {
    // Hàm .reset sẽ xóa trắng mọi control trên form
    this.loaiTaiLieuIOForm.reset();
  }

  /**
   * Hàm lưu và reset form để tiếp tục nhập mới dữ liệu. Trường hợp này khi người dùng muốn nhập dữ liệu liên tục
   * @param operMode 
   */
  async onContinueAdd(operMode: string) {
    this.logAllValidationErrorMessages();
    if (this.loaiTaiLieuIOForm.valid === true) {
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
      this.loaiTaiLieuIOForm,
      this.validationErrorMessages,
      this.formErrors
    );
  }

  /**
   * Hàm close sidenav
   */
  public closeLoaiTaiLieuIOSidenav() {
    this.matSidenavService.close();
  }

  /**
 * Hàm hiển thị cảnh báo error
 */
  public showDialogWarning(error: any) {
    const dialog = this.modalDialog.open(MyAlertDialogComponent);
    dialog.componentInstance.header = this.dataTranslate.COMMON.default.warnings;
    dialog.componentInstance.content =
      "<b>" + error + "</b>";
    dialog.componentInstance.visibleOkButton = false;
  }

  /**
   *  Hàm gọi từ function con gọi vào chạy function cha
   * @param methodName
   */
  doFunction(methodName) {
    this[methodName]();
  }

}
