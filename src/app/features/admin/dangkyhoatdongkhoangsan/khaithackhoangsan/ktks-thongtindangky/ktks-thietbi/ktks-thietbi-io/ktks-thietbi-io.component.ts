import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpErrorResponse } from "@angular/common/http";
import { TranslateService } from "@ngx-translate/core";

import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { DangKyHoatDongKhoangSanFacadeService } from "src/app/services/admin/dangkyhoatdongkhoangsan/dangkyhoatdongkhoangsan-facade.service";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { validationAllErrorMessagesService } from "src/app/services/utilities/validatorService";
import { InputDkKhaiThacThietBiModel } from "src/app/models/admin/dangkyhoatdongkhoangsan/dkkhaithacthietbi.model";

@Component({
  selector: 'app-ktks-thietbi-io',
  templateUrl: './ktks-thietbi-io.component.html',
  styleUrls: ['./ktks-thietbi-io.component.scss']
})
export class KtksThietbiIoComponent implements OnInit {


  // Chứa dữ liệu Form
  public dkKhaiThacThietBiIOForm: FormGroup;

  // Chứa dữ liệu đối tượng truyền từ list comp
  public obj: any;

  // Chứa kiểu form
  public purpose: string;

  // Chứa dữ liệu translate
  public dataTranslate: any;

  // Chứa dữ liệu input
  public inputModel: InputDkKhaiThacThietBiModel;

  // error message
  validationErrorMessages = {};

  // form errors
  formErrors = {
    tenthietbi: "",
    mota: ""
  };

  constructor(public matSidenavService: MatsidenavService,
    private dangKyHoatDongKhoangSanFacadeService: DangKyHoatDongKhoangSanFacadeService,
    private formBuilder: FormBuilder,
    public commonService: CommonServiceShared,
    private translate: TranslateService) {
  }

  async ngOnInit() {
    // Khởi tạo form
    this.formInit();
    // Lấy dữ liệu translate
    await this.getDataTranslate();
    // Khởi tạo form theo dạng add or edit
    await this.bindingConfigAddOrUpdate();
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
    this.validationErrorMessages = {};
  }

  /**
   * Hàm khởi tạo form
   */
  formInit() {
    this.dkKhaiThacThietBiIOForm = this.formBuilder.group({
      tenthietbi: ["", Validators.required],
      mota: [""]
    });
  }

  /**
   * Hàm set value cho form
   */
  async formOnEdit() {
    if (this.obj && this.purpose === 'edit') {
      this.dkKhaiThacThietBiIOForm.setValue({
        tenthietbi: this.obj.tenthietbi,
        mota: this.obj.mota
      });
    }
  }

  /**
   * Hàm khởi tạo form theo dạng edit
   */
  async bindingConfigAddOrUpdate() {
    this.inputModel = new InputDkKhaiThacThietBiModel();
    // check edit
    await this.formOnEdit();
  }

  /**
   * Hàm thực thi chức năng add và edit
   */
  private addOrUpdate(operMode: string) {
    const dkKhaiThacThietBiService = this.dangKyHoatDongKhoangSanFacadeService.getDangKyKhaiThacThietBiService();
    // Gán dữ liệu input vào model
    this.inputModel = this.dkKhaiThacThietBiIOForm.value;
    this.inputModel.iddangkykhaithac = this.obj.iddangkykhaithac;
    if (operMode === "new") {
      dkKhaiThacThietBiService.addItem(this.inputModel).subscribe(
        (res) => this.matSidenavService.doParentFunction("getAllDangKyKhaiThacThietBi"),
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
      this.inputModel.idthietbi = this.obj.idthietbi;
      dkKhaiThacThietBiService.updateItem(this.inputModel).subscribe(
        (res) => this.matSidenavService.doParentFunction("getAllDangKyKhaiThacThietBi"),
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
    if (this.dkKhaiThacThietBiIOForm.valid === true) {
      this.addOrUpdate(operMode);
      this.matSidenavService.close();
    }
  }

  /**
   * Hàm reset form, gọi khi nhấn nút reset dữ liệu
   */
  public onFormReset() {
    // Hàm .reset sẽ xóa trắng mọi control trên form
    this.dkKhaiThacThietBiIOForm.reset();
  }

  /**
   * Hàm lưu và reset form để tiếp tục nhập mới dữ liệu. Trường hợp này khi người dùng muốn nhập dữ liệu liên tục
   * @param operMode
   */
  async onContinueAdd(operMode: string) {
    this.logAllValidationErrorMessages();
    if (this.dkKhaiThacThietBiIOForm.valid === true) {
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
      this.dkKhaiThacThietBiIOForm,
      this.validationErrorMessages,
      this.formErrors
    );
  }

  /**
   * Hàm close sidenav
   */
  public closeDkKhaiThacThietBiIOSidenav() {
    this.matSidenavService.close();
  }

}
