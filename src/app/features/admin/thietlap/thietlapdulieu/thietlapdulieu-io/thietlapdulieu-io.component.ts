import { Component, OnInit } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { validationAllErrorMessagesService } from "src/app/services/utilities/validatorService";
import { InputObjKeyModel } from "src/app/models/admin/common/objKey.model";
import { CommonFacadeService } from "src/app/services/admin/common/common-facade.service";
import { TranslateService } from "@ngx-translate/core";
import { translateConstants } from "src/app/shared/constants/translate-constants";

@Component({
  selector: "app-thietlapdulieu-io",
  templateUrl: "./thietlapdulieu-io.component.html",
  styleUrls: ["./thietlapdulieu-io.component.scss"],
})
export class ThietlapdulieuIoComponent implements OnInit {
  thietLapDuLieuIOForm: FormGroup;
  submitted = false;
  public obj: any;
  public purpose: string;
  public editMode: boolean;
  public inputModel: InputObjKeyModel;
  public model: any;

  // Error message
  validationErrorMessages = {};

  // Biến dùng translate
  dataTranslate: any;

  // Form errors
  formErrors = {
    objName: "",
    objTable: "",
    objKey: "",
    serviceName: "",
    moduleName: "",
    status: "",
  };

  constructor(
    public matSidenavService: MatsidenavService,
    private formBuilder: FormBuilder,
    public commonService: CommonServiceShared,
    public commonFacadeService: CommonFacadeService,
    private translate: TranslateService
  ) {
    this.matSidenavService.okCallBackFunction = null;
    this.matSidenavService.cancelCallBackFunction = null;
    this.matSidenavService.confirmStatus = null;
  }

  async ngOnInit() {
    await this.formInit();
    await this.bindingConfigAddOrUpdate();

    // Lấy dữ liệu biến translate để gán vào các biến trong component
    this.dataTranslate = await this.translate
      .getTranslation(this.translate.getDefaultLang())
      .toPromise();

    this.setValidation();

  }

  // Hàm set biến validation từ data translate
  setValidation() {
    this.validationErrorMessages = {
      objName: {
        required: this.dataTranslate.THIETLAP.thietlapdulieu.objNameRequired,
      },
      objTable: {
        required: this.dataTranslate.THIETLAP.thietlapdulieu.objTableRequired,
      },
      objKey: {
        required: this.dataTranslate.THIETLAP.thietlapdulieu.objKeyRequired,
        pattern: this.dataTranslate.THIETLAP.thietlapdulieu.objKeyPattern,
      },
      serviceName: {
        required: this.dataTranslate.THIETLAP.thietlapdulieu
          .serviceNameRequired,
      },
      moduleName: {
        required: this.dataTranslate.THIETLAP.thietlapdulieu
          .moduleNameRequired,
      },
      status: {
        required: this.dataTranslate.THIETLAP.thietlapdulieu.statusRequired,
        pattern: this.dataTranslate.THIETLAP.thietlapdulieu.statusPattern,
      },
    };
  }
  /**
   * Config form use Add or Update
   */
  bindingConfigAddOrUpdate() {
    this.editMode = false;
    this.inputModel = new InputObjKeyModel();
    // check edit
    this.formOnEdit();
  }

  /**
   * Init FormControl
   */
  formInit() {
    this.thietLapDuLieuIOForm = this.formBuilder.group({
      objName: ["", Validators.required],
      objTable: ["", Validators.required],
      objKey: [
        "",
        [Validators.required, Validators.pattern(/^[-+]?\d*\.?\d*$/)],
      ],
      serviceName: ["", Validators.required],
      moduleName: ["", Validators.required],
      fieldsInfo: [""],
      fieldsDisplay: [""],
      status: [
        "",
        [Validators.required, Validators.pattern(/^[-+]?\d*\.?\d*$/)],
      ],
      note: [""],
    });
  }

  /**
   * Init edit form
   */
  formOnEdit() {
    if (this.obj) {
      this.thietLapDuLieuIOForm.setValue({
        objName: this.obj.objName,
        objTable: this.obj.objTable,
        objKey: this.obj.objKey,
        serviceName: this.obj.serviceName,
        note: this.obj.note,
        moduleName: this.obj.moduleName,
        fieldsInfo: this.obj.fieldsInfo,
        fieldsDisplay: this.obj.fieldsDisplay,
        status: this.obj.status,
      });
    }
    this.editMode = true;
  }

  /**
   * Hàm Add and Update
   * @param operMode
   */
  private addOrUpdate(operMode: string) {
    this.inputModel = this.thietLapDuLieuIOForm.value;
    if (operMode === "new") {
      this.commonFacadeService
        .getObjKeyService()
        .addItem(this.inputModel)
        .subscribe(
          (res) => this.matSidenavService.doParentFunction("getPagesize"),
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
      const id: number = this.obj.id;
      this.inputModel.id = id;
      this.commonFacadeService
        .getObjKeyService()
        .updateItem(this.inputModel)
        .subscribe(
          (res) => this.matSidenavService.doParentFunction("getPagesize"),
          (error: HttpErrorResponse) => {
            this.commonService.showError(error);
          },
          () => {
            this.commonService.showeNotiResult(
              this.dataTranslate.COMMON.default.successEdit,
              2000
            );
          }
        );
    }
  }

  /**
   * Hàm được gọi khi nhấn nút Lưu, Truyền vào operMode để biết là Edit hay tạo mới
   * @param operMode
   */
  async onSubmit(operMode: string) {
    this.logAllValidationErrorMessages();
    if (this.thietLapDuLieuIOForm.valid) {
      this.addOrUpdate(operMode);
      this.matSidenavService.close();
    }
  }

  /**
   * Hàm reset form, gọi khi nhấn nút reset dữ liệu
   */
  public onFormReset() {
    // Hàm .reset sẽ xóa trắng mọi control trên form
    this.thietLapDuLieuIOForm.reset();
    // Trong trường hợp mong muốn reset một số trường về giá trị mặc định thì dùng .patchValue
    // https://angular.io/guide/reactive-forms#patching-the-model-value
  }

  /**
   * Hàm lưu và reset form để tiếp tục nhập mới dữ liệu. Trường hợp này khi người dùng muốn nhập dữ liệu liên tục
   * @param operMode
   */
  async onContinueAdd(operMode: string) {
    this.logAllValidationErrorMessages();
    if (this.thietLapDuLieuIOForm.valid) {
      this.addOrUpdate(operMode);
      this.onFormReset();
      this.purpose = "new";
    }
  }

  /**
   * Validation error message
   */
  public logAllValidationErrorMessages() {
    validationAllErrorMessagesService(
      this.thietLapDuLieuIOForm,
      this.validationErrorMessages,
      this.formErrors
    );
  }

  /**
   * Hàm đóng sidenav
   */
  public closeThietLapIOSidebar() {
    this.matSidenavService.close();
  }
}
