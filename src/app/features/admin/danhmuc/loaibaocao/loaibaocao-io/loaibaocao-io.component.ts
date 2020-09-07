import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { HttpErrorResponse } from "@angular/common/http";
import { MatDialog } from "@angular/material";

import { InputDmLoaiBaoCaoModel } from "src/app/models/admin/danhmuc/loaibaocao.model";
import { TrangThai } from "src/app/shared/constants/trangthai-constants";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { DmFacadeService } from "src/app/services/admin/danhmuc/danhmuc-facade.service";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { validationAllErrorMessagesService } from "src/app/services/utilities/validatorService";
import { MyAlertDialogComponent } from "src/app/shared/components/my-alert-dialog/my-alert-dialog.component";
import { NhomBaoCao } from "src/app/shared/constants/nhombaocao-constants";

@Component({
  selector: 'app-loaibaocao-io',
  templateUrl: './loaibaocao-io.component.html',
  styleUrls: ['./loaibaocao-io.component.scss']
})
export class DmLoaibaocaoIoComponent implements OnInit {

  // Chứa dữ liệu Form
  public loaiBaoCaoIOForm: FormGroup;

  // Chứa dữ liệu đối tượng truyền từ list comp
  public obj: any;

  // Chứa kiểu form
  public purpose: string;

  // Chứa chế độ form
  public editMode: boolean;

  // Chứa dữ liệu input
  public inputModel: InputDmLoaiBaoCaoModel;

  // Chứa dữ liệu Trạng thái
  public trangthai = TrangThai;

  // Chứa dữ liệu translate
  public dataTranslate: any;

  // Chứa dữ liệu Nhóm báo cáo
  public nhomBaoCao = NhomBaoCao;

  // error message
  validationErrorMessages = {};

  // form errors
  formErrors = {
    maloaibaocao: "",
    tenloaibaocao: "",
    nhombaocao: "",
    mota: "",
    thutu: "",
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
      thutu: { pattern: this.dataTranslate.DANHMUC.loaibaocao.thutuIsNumber },
      tenloaibaocao: { required: this.dataTranslate.DANHMUC.loaibaocao.tenloaibaocaoRequired },
      nhombaocao: { required: this.dataTranslate.DANHMUC.loaibaocao.nhombaocaoRequired }
    };
  }

  /**
    * Hàm khởi tạo form theo dạng edit
    */
  bindingConfigAddOrUpdate() {
    this.editMode = false;
    this.inputModel = new InputDmLoaiBaoCaoModel();
    // check edit
    this.formOnEdit();
  }

  /**
    * Hàm khởi tạo form
    */
  formInit() {
    this.loaiBaoCaoIOForm = this.formBuilder.group({
      maloaibaocao: [""],
      tenloaibaocao: ["", Validators.required],
      nhombaocao: ["", Validators.required],
      mota: [""],
      thutu: ["", Validators.pattern("^[0-9-+]+$")],
    });
  }

  /**
    * hàm set value cho form
    */
  formOnEdit() {
    if (this.obj && this.purpose === 'edit') {
      this.loaiBaoCaoIOForm.setValue({
        maloaibaocao: this.obj.maloaibaocao,
        tenloaibaocao: this.obj.tenloaibaocao,
        nhombaocao: this.obj.nhombaocao,
        mota: this.obj.mota,
        thutu: this.obj.thutu,
      });
    }
    this.editMode = true;
  }

  /**
    * Hàm thực thi chức năng add và edit
    */
  private addOrUpdate(operMode: string) {
    const dmFacadeService = this.dmFacadeService.getDmLoaiBaoCaoService();
    this.inputModel = this.loaiBaoCaoIOForm.value;
    if (operMode === "new") {
      dmFacadeService.addItem(this.inputModel).subscribe(
        (res) => this.matSidenavService.doParentFunction("getAllLoaiBaoCao"),
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
      this.inputModel.idloaibaocao = this.obj.idloaibaocao;
      this.inputModel.trangthai = this.obj.trangthai;
      dmFacadeService.updateItem(this.inputModel).subscribe(
        (res) => this.matSidenavService.doParentFunction("getAllLoaiBaoCao"),
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
    if (this.loaiBaoCaoIOForm.valid === true) {
      this.addOrUpdate(operMode);
      this.matSidenavService.close();
    }
  }

  /**
    * Hàm reset form, gọi khi nhấn nút reset dữ liệu
    */
  public onFormReset() {
    // Hàm .reset sẽ xóa trắng mọi control trên form
    this.loaiBaoCaoIOForm.reset({
      maloaibaocao: "",
      tenloaibaocao: "",
      nhombaocao: "",
      mota: "",
      thutu: "",
    });
  }

  /**
    * Hàm lưu và reset form để tiếp tục nhập mới dữ liệu. Trường hợp này khi người dùng muốn nhập dữ liệu liên tục
    * @param operMode 
    */
  async onContinueAdd(operMode: string) {
    this.logAllValidationErrorMessages();
    if (this.loaiBaoCaoIOForm.valid === true) {
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
      this.loaiBaoCaoIOForm,
      this.validationErrorMessages,
      this.formErrors
    );
  }

  /**
    * Hàm close sidenav
    */
  public closeLoaiBaoCaoIOSidenav() {
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
