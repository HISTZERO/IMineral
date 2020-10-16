import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpErrorResponse } from "@angular/common/http";
import { TranslateService } from "@ngx-translate/core";
import { DatePipe } from "@angular/common";
import { validationAllErrorMessagesService } from "src/app/services/utilities/validatorService";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { TrangThai } from "src/app/shared/constants/trangthai-constants";
import { DefaultValue } from 'src/app/shared/constants/global-var';
import { TinhTienCapQuyenFacadeService } from 'src/app/services/admin/tinhtiencapquyen/tinhtiencapquyen-facade.service';
import { InputTtTinhTienTheoNamModel } from 'src/app/models/admin/tinhtiencapquyen/tttientheonam.model';


@Component({
  selector: 'app-chitiettinhtiencapquyentheonam-io',
  templateUrl: './chitiettinhtiencapquyentheonam-io.component.html',
  styleUrls: ['./chitiettinhtiencapquyentheonam-io.component.scss']
})
export class ChitiettinhtiencapquyentheonamIoComponent implements OnInit {
  // Chứa dữ liệu Form
  public chiTietTinhTienTheoNamIOForm: FormGroup;

  // Chứa dữ liệu đối tượng truyền từ list comp
  public obj: any;

  // Chứa kiểu form
  public purpose: string;

  // Chứa dữ liệu input
  public inputModel: InputTtTinhTienTheoNamModel;

  // Chứa dữ liệu Trạng thái
  public trangthai = TrangThai;

  // Chứa dữ liệu translate
  public dataTranslate: any;

  // error message
  validationErrorMessages = {};

  // form errors
  formErrors = {
    namnoptien: DefaultValue.Empty,
    sotienhangnam: DefaultValue.Empty
  };

  constructor(public matSidenavService: MatsidenavService,
              public tinhTienCapQuyenFacadeService: TinhTienCapQuyenFacadeService,
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
      namnoptien: {
        required: this.dataTranslate.TINHTIENCAPQUYEN.chitiettinhtiencapquyentheonam.namnoptienRequired,
        pattern: this.dataTranslate.TINHTIENCAPQUYEN.chitiettinhtiencapquyentheonam.namnopFormat
       },
      sotienhangnam: {
        required: this.dataTranslate.TINHTIENCAPQUYEN.chitiettinhtiencapquyentheonam.sotienhangnamRequired,
        pattern: this.dataTranslate.TINHTIENCAPQUYEN.chitiettinhtiencapquyentheonam.sotienhangnamFormat
      },
    };
  }

  /**
   * Hàm khởi tạo form theo dạng edit
   */
  bindingConfigAddOrUpdate() {
    this.inputModel = new InputTtTinhTienTheoNamModel();
    // check edit
    this.formOnEdit();
  }

  /**
   * Hàm khởi tạo form
   */
  formInit() {
    this.chiTietTinhTienTheoNamIOForm = this.formBuilder.group({
      namnoptien: [DefaultValue.Empty, [Validators.required, Validators.pattern("^[0-9]+\\.{0,1}\\d{0,2}$")]],
      sotienhangnam: [DefaultValue.Empty, [Validators.required, Validators.pattern("^[0-9-+]+$")]]
    });
  }

  /**
   * hàm set value cho form
   */
  formOnEdit() {
    if (this.obj && this.purpose === 'edit') {
      this.chiTietTinhTienTheoNamIOForm.setValue({
        namnoptien: this.obj.namnoptien,
        sotienhangnam: this.obj.sotienhangnam
      });
    }
  }


  /**
   * Hàm thực thi chức năng add và edit
   */
  private addOrUpdate(operMode: string) {
    // Gán dữ liệu input vào model
    const chiTietTinhTienFacadeService = this.tinhTienCapQuyenFacadeService.getChiTietTinhTienTheoNamService();
    this.inputModel = this.chiTietTinhTienTheoNamIOForm.value;
    this.inputModel.idtinhtiencapquyen = this.obj.idtinhtiencapquyen;
    if (operMode === "new") {
      chiTietTinhTienFacadeService.addItem(this.inputModel).subscribe(
        (res) => this.matSidenavService.doParentFunction("getAllChiTietTinhTienTheoNam"),
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
      this.inputModel.idtientheonam = this.obj.idtientheonam;
      chiTietTinhTienFacadeService.updateItem(this.inputModel).subscribe(
        (res) => this.matSidenavService.doParentFunction("getAllChiTietTinhTienTheoNam"),
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
    if (this.chiTietTinhTienTheoNamIOForm.valid === true) {
      this.addOrUpdate(operMode);
      this.matSidenavService.close();
    }
  }

  /**
   * Hàm reset form, gọi khi nhấn nút reset dữ liệu
   */
  public onFormReset() {
    // Hàm .reset sẽ xóa trắng mọi control trên form
    this.chiTietTinhTienTheoNamIOForm.reset();
  }

  /**
   * Hàm lưu và reset form để tiếp tục nhập mới dữ liệu. Trường hợp này khi người dùng muốn nhập dữ liệu liên tục
   * @param operMode
   */
  async onContinueAdd(operMode: string) {
    this.logAllValidationErrorMessages();
    if (this.chiTietTinhTienTheoNamIOForm.valid === true) {
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
      this.chiTietTinhTienTheoNamIOForm,
      this.validationErrorMessages,
      this.formErrors
    );
  }

  /**
   * Hàm close sidenav
   */
  public closeLinhVucIOSidenav() {
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
