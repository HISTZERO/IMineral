import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { DmFacadeService } from "src/app/services/admin/danhmuc/danhmuc-facade.service";
import { HttpErrorResponse } from "@angular/common/http";
import {
  displayFieldCssService,
  validationAllErrorMessagesService,
} from "src/app/services/utilities/validatorService";
import { InputHuonggioModel } from "src/app/models/admin/danhmuc/huonggio.model";
import { TranslateService } from "@ngx-translate/core";
import { translateConstants } from "src/app/shared/constants/translate-constants";

@Component({
  selector: "app-huonggio-io",
  templateUrl: "./huonggio-io.component.html",
  styleUrls: ["./huonggio-io.component.scss"],
})
export class HuonggioIoComponent implements OnInit {
  huonggioIOForm: FormGroup;
  public inputModel: InputHuonggioModel;
  public editMode: boolean;
  public purpose: string;
  public obj: any;

  // Các biến translate
  dataTranslate: any;

  // error message
  validationErrorMessages = {};

  // form errors
  formErrors = {
    tenhuonggio: "",
    mahuonggio: "",
  };

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
      tenhuonggio: {
        required: this.dataTranslate.DANHMUC.huonggio.tenhuonggioRequired,
      },
      mahuonggio: {
        required: this.dataTranslate.DANHMUC.huonggio.mahuonggioRequired,
      },
    };
  }

  // config Form use add or update
  bindingConfigAddOrUpdate() {
    this.editMode = false;
    this.inputModel = new InputHuonggioModel();
    if (this.purpose === "new" || this.purpose === "edit") {
      this.editMode = true;
    }
    // check edit
    if (this.editMode === true && this.obj) {
      this.huonggioIOForm.setValue({
        tenhuonggio: this.obj.tenhuonggio,
        mahuonggio: this.obj.mahuonggio,
      });
    }
  }

  // config input validation form
  bindingConfigValidation() {
    this.huonggioIOForm = this.formBuilder.group({
      tenhuonggio: ["", Validators.required],
      mahuonggio: ["", Validators.required],
    });
  }

  // on Submit
  public onSubmit(operMode: string) {
    this.logAllValidationErrorMessages();
    if (this.huonggioIOForm.valid === true) {
      this.addOrUpdate(operMode);
      this.matSidenavService.close();
    }
  }

  // add or update continue
  public addOrUpdateContinue(operMode: string) {
    this.logAllValidationErrorMessages();
    if (this.huonggioIOForm.valid === true) {
      this.addOrUpdate(operMode);
      this.onFormReset();
      this.purpose = "new";
    }
  }

  // add or update
  private addOrUpdate(operMode: string) {
    this.inputModel = this.huonggioIOForm.value;
    if (operMode === "new") {
      this.dmFacadeService
        .getHuonggioService()
        .addItem(this.inputModel)
        .subscribe(
          (res) => this.matSidenavService.doParentFunction("refreshList"),
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
        .getHuonggioService()
        .updateItem(this.inputModel)
        .subscribe(
          (res) => this.matSidenavService.doParentFunction("refreshList"),
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
    this.huonggioIOForm.reset();
  }
  // Validation click submit
  public logAllValidationErrorMessages() {
    validationAllErrorMessagesService(
      this.huonggioIOForm,
      this.validationErrorMessages,
      this.formErrors
    );
  }

  // display fields css
  public displayFieldCss(field: string) {
    displayFieldCssService(field);
  }

  // close sidebar
  public closeHuonggioIOSidebar() {
    this.matSidenavService.close();
  }
}
