import { TranslateService } from "@ngx-translate/core";
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { ThietlapFacadeService } from "src/app/services/admin/thietlap/thietlap-facade.service";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { HttpErrorResponse } from "@angular/common/http";
import { validationAllErrorMessagesService } from "src/app/services/utilities/validatorService";
import { InputOtypeOptsModel } from "src/app/models/admin/thietlap/otypeOpts.model";
import { translateConstants } from "src/app/shared/constants/translate-constants";

@Component({
  selector: 'app-doituongthietlap-io',
  templateUrl: './doituongthietlap-io.component.html',
  styleUrls: ['./doituongthietlap-io.component.scss']
})
export class DoituongthietlapIoComponent implements OnInit {

  thietLapDoiTuongIOForm: FormGroup;
  submitted = false;
  public obj: any;
  public purpose: string;
  public editMode: boolean;
  public inputModel: InputOtypeOptsModel;
  public model: any;

  // Biến dùng translate
  dataTranslate: any;

  errorOrder: any;
  // Error message
  validationErrorMessages = {};

  // Form errors
  formErrors = {
    optKey: "",
    optName: "",
    optTitle: "",
    optOrder: "",
    optType: ""
  };
  constructor(
    public matSidenavService: MatsidenavService,
    public thietLapFacadeService: ThietlapFacadeService,
    private formBuilder: FormBuilder,
    public commonService: CommonServiceShared,
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
      optKey: { required: this.dataTranslate.THIETLAP.doituongthietlap.optKeyRequired },
      optName: { required: this.dataTranslate.THIETLAP.doituongthietlap.optNameRequired },
      optTitle: { required: this.dataTranslate.THIETLAP.doituongthietlap.optTitleRequired },
      optOrder: {
        required: this.dataTranslate.THIETLAP.doituongthietlap.optOrderRequired,
        pattern: this.dataTranslate.THIETLAP.doituongthietlap.optOrderPattern
      },
      optType: { required: this.dataTranslate.THIETLAP.doituongthietlap.optTypeRequired }
    };
  }
  /**
   * Config form use Add or Update
   */
  bindingConfigAddOrUpdate() {
    this.editMode = false;
    this.inputModel = new InputOtypeOptsModel();
    // check edit
    this.formOnEdit();
  }

  /**
   * Init FormControl
   */
  formInit() {
    this.thietLapDoiTuongIOForm = this.formBuilder.group({
      otypeKey: [""],
      optKey: ["", Validators.required],
      optName: ["", Validators.required],
      optTitle: ["", Validators.required],
      optOrder: ["", [Validators.required, Validators.pattern(/^[-+]?\d*\.?\d*$/)]],
      optType: ["", Validators.required],
      isNull: [false],
      typeValidate: [false],
      nullValidate: [false],
      isEnable: [false],
      inList: [false],
      inIo: [false]
    });
  }

  /**
   * Init edit form
   */
  formOnEdit() {
    if (this.purpose === "edit" && this.obj) {
      this.thietLapDoiTuongIOForm.setValue({
        otypeKey: this.obj.otypeKey,
        optKey: this.obj.optKey,
        optName: this.obj.optName,
        optTitle: this.obj.optTitle,
        optOrder: this.obj.optOrder,
        optType: this.obj.optType,
        isNull: this.obj.isNull,
        typeValidate: this.obj.typeValidate,
        nullValidate: this.obj.nullValidate,
        isEnable: this.obj.isEnable,
        inList: this.obj.inList,
        inIo: this.obj.inIo
      });
    }
    this.editMode = true;
  }

  checkInputOrder(): boolean {
    const stt: number = this.thietLapDoiTuongIOForm.value.optOrder;
    if (this.obj.arrayOrder.indexOf(+stt) !== -1) {
      this.errorOrder = this.dataTranslate.THIETLAP.doituongthietlap.errorOrder;
      return false;
    } else {
      this.errorOrder = "";
      return true;
    }
  }
  /**
   * Hàm Add and Update
   * @param operMode
   */
  private addOrUpdate(operMode: string) {
    this.inputModel = this.thietLapDoiTuongIOForm.value;
    if (operMode === "new") {
      this.inputModel.otypeKey = this.obj.otypeKey;
      this.thietLapFacadeService.getOtypeOptService().addItem(this.inputModel).subscribe(
        res => this.matSidenavService.doParentFunction("getDoiTuongTram"),
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
      this.thietLapFacadeService.getOtypeOptService().updateItem(this.inputModel).subscribe(
        res => this.matSidenavService.doParentFunction("getDoiTuongTram"),
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
    const checkOrder = this.checkInputOrder();
    if (this.thietLapDoiTuongIOForm.valid && checkOrder === true) {
      this.addOrUpdate(operMode);
      this.matSidenavService.close();
    }
  }

  /**
   * Hàm reset form, gọi khi nhấn nút reset dữ liệu
   */
  public onFormReset() {
    // Hàm .reset sẽ xóa trắng mọi control trên form
    this.thietLapDoiTuongIOForm.reset();
    // Trong trường hợp mong muốn reset một số trường về giá trị mặc định thì dùng .patchValue
    // https://angular.io/guide/reactive-forms#patching-the-model-value
  }

  /**
   * Hàm lưu và reset form để tiếp tục nhập mới dữ liệu. Trường hợp này khi người dùng muốn nhập dữ liệu liên tục
   * @param operMode
   */
  async onContinueAdd(operMode: string) {
    this.logAllValidationErrorMessages();
    const checkOrder = this.checkInputOrder();
    if (this.thietLapDoiTuongIOForm.valid && checkOrder === true) {
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
      this.thietLapDoiTuongIOForm,
      this.validationErrorMessages,
      this.formErrors
    );
  }

  /**
   * Hàm đóng sidenav
   */
  public closeThietLapTramIOSidebar() {
    this.matSidenavService.close();
  }

}
