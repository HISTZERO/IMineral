import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  displayFieldCssService, validationAllErrorMessagesService
} from "src/app/services/utilities/validatorService";
import { HttpErrorResponse } from "@angular/common/http";
import { InputLoaisolieuModel } from "src/app/models/admin/danhmuc/loaisolieu.model";
import { DmFacadeService } from "src/app/services/admin/danhmuc/danhmuc-facade.service";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-loaisolieu-io",
  templateUrl: "./loaisolieu-io.component.html",
  styleUrls: ["./loaisolieu-io.component.scss"],
})
export class DmLoaisolieuIoComponent implements OnInit {
  loaisolieuIOForm: FormGroup;
  public inputModel: InputLoaisolieuModel;
  public editMode: boolean;
  public purpose: string;
  public obj: any;

  // Biến dùng translate
  dataTranslate: any;

  // error message
  validationErrorMessages = {};

  // form errors
  formErrors = {
    tenloaisolieu: "",
  };

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
      tenloaisolieu: {
        required: this.dataTranslate.DANHMUC.loaisolieu.tenloaisolieuRequired,
      },
    };
  }

  // config Form use add or update
  bindingConfigAddOrUpdate() {
    this.editMode = false;
    this.inputModel = new InputLoaisolieuModel();
    if (this.purpose === "new" || this.purpose === "edit") {
      this.editMode = true;
    }
    // check edit
    if (this.editMode === true && this.obj) {
      this.loaisolieuIOForm.setValue({
        tenloaisolieu: this.obj.tenloaisolieu,
        tenviettat: this.obj.tenviettat,
      });
    }
  }

  // config input validation form
  bindingConfigValidation() {
    this.loaisolieuIOForm = this.formBuilder.group({
      tenloaisolieu: ["", Validators.required],
      tenviettat: [""],
    });
  }

  // on Submit
  public onSubmit(operMode: string) {
    this.logAllValidationErrorMessages();
    if (this.loaisolieuIOForm.valid === true) {
      this.addOrUpdate(operMode);
      this.matSidenavService.close();
    }
  }

  // add or update continue
  public addOrUpdateContinue(operMode: string) {
    this.logAllValidationErrorMessages();
    if (this.loaisolieuIOForm.valid === true) {
      this.addOrUpdate(operMode);
      this.onFormReset();
      this.purpose = "new";
    }
  }

  // add or update
  private addOrUpdate(operMode: string) {
    this.inputModel = this.loaisolieuIOForm.value;
    if (operMode === "new") {
      this.dmFacadeService
        .getLoaisolieuService()
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
        .getLoaisolieuService()
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
    this.loaisolieuIOForm.reset();
  }
  // Validation click submit
  public logAllValidationErrorMessages() {
    validationAllErrorMessagesService(
      this.loaisolieuIOForm,
      this.validationErrorMessages,
      this.formErrors
    );
  }

  // display fields css
  public displayFieldCss(field: string) {
    displayFieldCssService(field);
  }

  // close sidebar
  public closeLoaisolieuIOSidebar() {
    this.matSidenavService.close();
  }
}
