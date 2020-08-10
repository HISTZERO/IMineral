import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { HttpErrorResponse } from "@angular/common/http";
import { validationAllErrorMessagesService } from "src/app/services/utilities/validatorService";
import { InputThietLapHeThongModel } from "src/app/models/admin/thietlap/thietlap-hethong.model";
import { ThietlapFacadeService } from "src/app/services/admin/thietlap/thietlap-facade.service";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-thietlaphethong-io",
  templateUrl: "./thietlaphethong-io.component.html",
  styleUrls: ["./thietlaphethong-io.component.scss"],
})
export class ThietlaphethongIoComponent implements OnInit {
  thietLapHeThongIOForm: FormGroup;
  submitted = false;
  public obj: any;
  public purpose: string;
  public editMode: boolean;
  public inputModel: InputThietLapHeThongModel;
  public model: any;

  // Error message
  validationErrorMessages = {};

  // Biến dùng translate
  dataTranslate: any;

  // Form errors
  formErrors = {
    settingKey: "",
    settingValue: "",
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
      settingKey: {
        required: this.dataTranslate.THIETLAP.thietlaphethong
          .settingKeyRequired,
      },
      settingValue: {
        required: this.dataTranslate.THIETLAP.thietlaphethong
          .settingValueRequired,
      },
    };
  }
  /**
   * Config form use Add or Update
   */
  bindingConfigAddOrUpdate() {
    this.editMode = false;
    this.inputModel = new InputThietLapHeThongModel();
    // check edit
    this.formOnEdit();
  }

  /**
   * Init FormControl
   */
  formInit() {
    this.thietLapHeThongIOForm = this.formBuilder.group({
      settingKey: ["", Validators.required],
      settingValue: ["", Validators.required],
      description: [""],
    });
  }

  /**
   * Init edit form
   */
  formOnEdit() {
    if (this.obj) {
      this.thietLapHeThongIOForm.setValue({
        settingKey: this.obj.settingKey,
        settingValue: this.obj.settingValue,
        description: this.obj.description,
      });
    }
    this.editMode = true;
  }

  /**
   * Hàm Add and Update
   * @param operMode
   */
  private addOrUpdate(operMode: string) {
    this.inputModel = this.thietLapHeThongIOForm.value;
    if (operMode === "new") {
      this.thietLapFacadeService
        .getThietLapHeThongService()
        .addItem(this.inputModel)
        .subscribe(
          (res) =>
            this.matSidenavService.doParentFunction("getAllThietLapHeThong"),
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
      this.thietLapFacadeService
        .getThietLapHeThongService()
        .updateItem(this.inputModel)
        .subscribe(
          (res) =>
            this.matSidenavService.doParentFunction("getAllThietLapHeThong"),
          (error: HttpErrorResponse) => {
            this.commonService.showError(error);
          },
          () => {
            localStorage.setItem(
              this.inputModel.settingKey,
              this.inputModel.settingValue
            );
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
    if (this.thietLapHeThongIOForm.valid) {
      this.addOrUpdate(operMode);
      this.matSidenavService.close();
    }
  }

  /**
   * Hàm reset form, gọi khi nhấn nút reset dữ liệu
   */
  public onFormReset() {
    // Hàm .reset sẽ xóa trắng mọi control trên form
    this.thietLapHeThongIOForm.reset();
    // Trong trường hợp mong muốn reset một số trường về giá trị mặc định thì dùng .patchValue
    // https://angular.io/guide/reactive-forms#patching-the-model-value
  }

  /**
   * Hàm lưu và reset form để tiếp tục nhập mới dữ liệu. Trường hợp này khi người dùng muốn nhập dữ liệu liên tục
   * @param operMode
   */
  async onContinueAdd(operMode: string) {
    this.logAllValidationErrorMessages();
    if (this.thietLapHeThongIOForm.valid) {
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
      this.thietLapHeThongIOForm,
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
