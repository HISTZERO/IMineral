import { Component, OnInit } from "@angular/core";
import {
  displayFieldCssService,
  validationAllErrorMessagesService,
} from "src/app/services/utilities/validatorService";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { InputTangchuanuocModel } from "src/app/models/admin/danhmuc/tangchuanuoc.model";
import { HttpErrorResponse } from "@angular/common/http";
import { DmFacadeService } from "src/app/services/admin/danhmuc/danhmuc-facade.service";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { TranslateService } from "@ngx-translate/core";
import { translateConstants } from "src/app/shared/constants/translate-constants";

@Component({
  selector: "app-tangchuanuoc-io",
  templateUrl: "./tangchuanuoc-io.component.html",
  styleUrls: ["./tangchuanuoc-io.component.scss"],
})
export class DmTangchuanuocIoComponent implements OnInit {
  comTangchuanuocIOForm: FormGroup;
  public inputModel: InputTangchuanuocModel;
  public editMode: boolean;
  public purpose: string;
  public obj: any;

  // error message
  validationErrorMessages = {};

  // form errors
  formErrors = {
    tentangchuanuoc: "",
    kieutangchuanuoc: "",
    hesotrunuoc: "",
    hesotham: "",
    bedaytangchua: "",
  };

  // Biến dùng translate
  dataTranslate: any;

  // ctor
  constructor(
    public matSidenavService: MatsidenavService,
    private formBuilder: FormBuilder,
    public commonService: CommonServiceShared,
    public dmFacadeService: DmFacadeService,
    private translate: TranslateService
  ) {}

  // onInit
  async ngOnInit() {
    await this.bindingConfigValidation();
    await this.bindingConfigAddOrUpdate();

    // Lấy ra biến translate của hệ thống
    this.dataTranslate = await this.translate
      .getTranslation(this.translate.getDefaultLang())
      .toPromise();
    await this.setValidation();
  }

  setValidation() {
    this.validationErrorMessages = {
      tentangchuanuoc: {
        required: this.dataTranslate.DANHMUC.tangchuanuoc
          .tentangchuanuocRequired,
      },
      kieutangchuanuoc: {
        required: this.dataTranslate.DANHMUC.tangchuanuoc
          .kieutangchuanuocRequired,
      },
      hesotrunuoc: {
        pattern: this.dataTranslate.DANHMUC.tangchuanuoc.hesotrunuocPattern,
      },
      hesotham: {
        pattern: this.dataTranslate.DANHMUC.tangchuanuoc.hesothamPattern,
      },
      bedaytangchua: {
        pattern: this.dataTranslate.DANHMUC.tangchuanuoc.bedaytangchuaPattern,
      },
    };
  }

  // config Form use add or update
  bindingConfigAddOrUpdate() {
    this.editMode = false;
    this.inputModel = new InputTangchuanuocModel();
    if (this.purpose === "new" || this.purpose === "edit") {
      this.editMode = true;
    }
    // check edit
    if (this.editMode === true && this.obj) {
      this.comTangchuanuocIOForm.setValue({
        tentangchuanuoc: this.obj.tentangchuanuoc,
        kieutangchuanuoc: this.obj.kieutangchuanuoc,
        hesotrunuoc: this.obj.hesotrunuoc,
        hesotham: this.obj.hesotham,
        bedaytangchua: this.obj.bedaytangchua,
      });
    }
  }

  // config input validation form
  bindingConfigValidation() {
    this.comTangchuanuocIOForm = this.formBuilder.group({
      tentangchuanuoc: ["", Validators.required],
      kieutangchuanuoc: ["", Validators.required],
      hesotrunuoc: ["", Validators.pattern(/^[-+]?\d*\.?\d*$/)],
      hesotham: ["", Validators.pattern(/^[-+]?\d*\.?\d*$/)],
      bedaytangchua: ["", Validators.pattern(/^[-+]?\d*\.?\d*$/)],
    });
  }

  // on Submit
  public onSubmit(operMode: string) {
    this.logAllValidationErrorMessages();
    if (this.comTangchuanuocIOForm.valid === true) {
      this.addOrUpdate(operMode);
      this.matSidenavService.close();
    }
  }

  // add or update continue
  public addOrUpdateContinue(operMode: string) {
    this.logAllValidationErrorMessages();
    if (this.comTangchuanuocIOForm.valid === true) {
      this.addOrUpdate(operMode);
      this.onFormReset();
      this.purpose = "new";
    }
  }

  // add or update
  private addOrUpdate(operMode: string) {
    this.inputModel = this.comTangchuanuocIOForm.value;
    if (operMode === "new") {
      this.dmFacadeService
        .getTangchuanuocService()
        .addItem(this.inputModel)
        .subscribe(
          (res) =>
            this.matSidenavService.doParentFunction("refreshListTangchuanuoc"),
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
      this.dmFacadeService
        .getTangchuanuocService()
        .updateItem(this.inputModel)
        .subscribe(
          (res) =>
            this.matSidenavService.doParentFunction("refreshListTangchuanuoc"),
          (error: HttpErrorResponse) => this.commonService.showError(error),
          () =>
            this.commonService.showeNotiResult(
              this.dataTranslate.COMMON.default.successEdit,
              2000
            )
        );
    }
  }

  // on form reset
  public onFormReset() {
    this.comTangchuanuocIOForm.reset();
  }

  // Validation click submit
  public logAllValidationErrorMessages() {
    validationAllErrorMessagesService(
      this.comTangchuanuocIOForm,
      this.validationErrorMessages,
      this.formErrors
    );
  }
  // display fields css
  public displayFieldCss(field: string) {
    displayFieldCssService(field);
  }

  // close sidebar
  public closeTangchuanuocIOSidebar() {
    this.matSidenavService.close();
  }
}
