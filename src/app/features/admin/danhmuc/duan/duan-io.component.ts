import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  displayFieldCssService, validationAllErrorMessagesService,
} from "src/app/services/utilities/validatorService";
import { InputDuanModel } from "src/app/models/admin/danhmuc/duan.model";
import { HttpErrorResponse } from "@angular/common/http";
import { DmFacadeService } from "src/app/services/admin/danhmuc/danhmuc-facade.service";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { DatePipe } from "@angular/common";
import { TranslateService } from "@ngx-translate/core";
import { translateConstants } from "src/app/shared/constants/translate-constants";

@Component({
  selector: "app-duan-io",
  templateUrl: "./duan-io.component.html",
  styleUrls: ["./duan-io.component.scss"],
})
export class DmDuanIoComponent implements OnInit {
  duanIOForm: FormGroup;
  public inputModel: InputDuanModel;
  public editMode: boolean;
  public purpose: string;
  public obj: any;

  // error message
  validationErrorMessages = {};

  // form errors
  formErrors = {
    projectName: "",
  };

  // Các biến translate
  dataTranslate: any;

  // ctor
  constructor(
    public matSidenavService: MatsidenavService,
    private formBuilder: FormBuilder,
    public commonService: CommonServiceShared,
    public dmFacadeService: DmFacadeService,
    private datePipe: DatePipe,
    private translate: TranslateService
  ) { }

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
      projectName: {
        required: this.dataTranslate.DANHMUC.duan.projectNameRequired,
      },
    };
  }

  // config Form use add or update
  bindingConfigAddOrUpdate() {
    this.editMode = false;
    this.inputModel = new InputDuanModel();
    if (this.purpose === "new" || this.purpose === "edit") {
      this.editMode = true;
    }
    // check edit
    if (this.editMode === true && this.obj) {
      this.duanIOForm.setValue({
        projectCode: this.obj.projectCode,
        projectName: this.obj.projectName,
        signedDate: this.obj.signedDate,
        signedAgency: this.obj.signedAgency,
        completeDate: this.obj.completeDate,
        projectLeader: this.obj.projectLeader,
      });
    }
  }

  // config input validation form
  bindingConfigValidation() {
    this.duanIOForm = this.formBuilder.group({
      projectName: ["", Validators.required],
      projectCode: [""],
      signedDate: [""],
      signedAgency: [""],
      completeDate: [""],
      projectLeader: [""],
    });
  }

  // on Submit
  public onSubmit(operMode: string) {
    this.logAllValidationErrorMessages();
    if (this.duanIOForm.valid === true) {
      this.addOrUpdate(operMode);
      this.matSidenavService.close();
    }
  }

  // add or update continue
  public addOrUpdateContinue(operMode: string) {
    this.logAllValidationErrorMessages();
    if (this.duanIOForm.valid === true) {
      this.addOrUpdate(operMode);
      this.onFormReset();
      this.purpose = "new";
    }
  }

  // add or update
  private addOrUpdate(operMode: string) {
    this.inputModel = this.duanIOForm.value;
    this.inputModel.signedDate = this.datePipe.transform(
      this.duanIOForm.value.signedDate,
      "yyyy-MM-dd"
    );
    this.inputModel.completeDate = this.datePipe.transform(
      this.duanIOForm.value.completeDate,
      "yyyy-MM-dd"
    );
    if (operMode === "new") {
      this.dmFacadeService
        .getDuanService()
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
      const id: number = this.obj.idProject;
      this.inputModel.idProject = id;
      this.dmFacadeService
        .getDuanService()
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
    this.duanIOForm.reset();
  }

  // Validation click submit
  public logAllValidationErrorMessages() {
    validationAllErrorMessagesService(
      this.duanIOForm,
      this.validationErrorMessages,
      this.formErrors
    );
  }

  // display fields css
  public displayFieldCss(field: string) {
    displayFieldCssService(field);
  }

  // close sidebar
  public closeDuanIOSidebar() {
    this.matSidenavService.close();
  }
}
