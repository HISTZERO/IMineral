import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  displayFieldCssService, validationAllErrorMessagesService,
} from "src/app/services/utilities/validatorService";
import { HttpErrorResponse } from "@angular/common/http";
import { DmFacadeService } from "src/app/services/admin/danhmuc/danhmuc-facade.service";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { InputDonvidoModel } from "src/app/models/admin/danhmuc/donvido.model";

@Component({
  selector: "app-donvido-io",
  templateUrl: "./donvido-io.component.html",
  styleUrls: ["./donvido-io.component.scss"],
})
export class DmDonvidoIoComponent implements OnInit {
  donvidoIOForm: FormGroup;
  public inputModel: InputDonvidoModel;
  public editMode: boolean;
  public purpose: string;
  public obj: any;
  public nhomDonvidoFilters = [
    { id: 1, tenndvd: "Nhóm đơn vị đo chiều dài/Độ sâu" },
    { id: 2, tenndvd: "Nhóm đơn vị đo thể tích" },
    { id: 3, tenndvd: "Nhóm đơn vị đo khối lượng" },
    { id: 4, tenndvd: "Nhóm đơn vị đo nhiệt độ" },
  ];
  public allNhomDonvido = [
    { id: 1, tenndvd: "Nhóm đơn vị đo chiều dài/Độ sâu" },
    { id: 2, tenndvd: "Nhóm đơn vị đo thể tích" },
    { id: 3, tenndvd: "Nhóm đơn vị đo khối lượng" },
    { id: 4, tenndvd: "Nhóm đơn vị đo nhiệt độ" },
  ];
  // error message
  validationErrorMessages = {};

  // form errors
  formErrors = {
    tendovido: "",
  };

  // Các biến translate
  dataTranslate: any;

  // ctor
  constructor(
    public matSidenavService: MatsidenavService,
    private formBuilder: FormBuilder,
    public commonService: CommonServiceShared,
    public dmFacadeService: DmFacadeService,
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
      tendovido: {
        required: this.dataTranslate.DANHMUC.donvido.tendonvidoRequired,
      },
    };
  }

  // config Form use add or update
  bindingConfigAddOrUpdate() {
    this.editMode = false;
    this.inputModel = new InputDonvidoModel();
    if (this.purpose === "new" || this.purpose === "edit") {
      this.editMode = true;
    }
    // check edit
    if (this.editMode === true && this.obj) {
      this.donvidoIOForm.setValue({
        tendovido: this.obj.tendovido,
        kyhieudonvido: this.obj.kyhieudonvido,
        idNhomdonvido: this.obj.idNhomdonvido,
      });
    }
  }

  // config input validation form
  bindingConfigValidation() {
    this.donvidoIOForm = this.formBuilder.group({
      tendovido: ["", Validators.required],
      kyhieudonvido: [""],
      idNhomdonvido: [""],
    });
  }

  // on Submit
  public onSubmit(operMode: string) {
    this.logAllValidationErrorMessages();
    if (this.donvidoIOForm.valid === true) {
      this.addOrUpdate(operMode);
      this.matSidenavService.close();
    }
  }

  // add or update continue
  public addOrUpdateContinue(operMode: string) {
    this.logAllValidationErrorMessages();
    if (this.donvidoIOForm.valid === true) {
      this.addOrUpdate(operMode);
      this.onFormReset();
      this.purpose = "new";
    }
  }

  // add or update
  private addOrUpdate(operMode: string) {
    this.inputModel = this.donvidoIOForm.value;
    if (operMode === "new") {
      this.dmFacadeService
        .getDonvidoService()
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
        .getDonvidoService()
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
    this.donvidoIOForm.reset();
  }

  // Validation click submit
  public logAllValidationErrorMessages() {
    validationAllErrorMessagesService(
      this.donvidoIOForm,
      this.validationErrorMessages,
      this.formErrors
    );
  }

  // display fields css
  public displayFieldCss(field: string) {
    displayFieldCssService(field);
  }

  // close sidebar
  public closeDonvidoIOSidebar() {
    this.matSidenavService.close();
  }
}
