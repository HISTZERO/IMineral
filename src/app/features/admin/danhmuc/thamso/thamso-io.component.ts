import { OutputNhomthamsoModel } from "src/app/models/admin/danhmuc/nhomthamso.model";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import {
  validationAllErrorMessagesService,
} from "src/app/services/utilities/validatorService";
import { HttpErrorResponse } from "@angular/common/http";
import { InputThamsoModel } from "src/app/models/admin/danhmuc/thamso.model";
import { donvido } from "src/app/shared/constants/enum";
import { DmFacadeService } from "src/app/services/admin/danhmuc/danhmuc-facade.service";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { OutputDonvidoModel } from "src/app/models/admin/danhmuc/donvido.model";

@Component({
  selector: "app-thamso-io",
  templateUrl: "./thamso-io.component.html",
  styleUrls: ["./thamso-io.component.scss"],
})
export class DmThamsoIoComponent implements OnInit {
  thamsoIOForm: FormGroup;
  submitted = false;
  public editMode: boolean;
  public purpose: string;
  public inputModel: InputThamsoModel;
  public obj: any;
  public nhomthamsoList: OutputNhomthamsoModel[];
  public nhomthamsoListFilter: OutputNhomthamsoModel[];
  public donvidoListFilter: OutputDonvidoModel[];
  public donvido = donvido;
  public listDulieuNhomThamSo: any;
  listDonvido: any;
  listDulieuDonvido: any;

  // Các biến translate
  dataTranslate: any;

  // error message
  validationErrorMessages = {};

  // form errors
  formErrors = {
    tenthamso: "",
    idNhomthamso: "",
    kyhieuthamso: "",
  };

  constructor(
    public matSidenavService: MatsidenavService,
    private formBuilder: FormBuilder,
    public commonService: CommonServiceShared,
    public dmFacadeService: DmFacadeService,
    private translate: TranslateService
  ) {
    this.matSidenavService.okCallBackFunction = null;
    this.matSidenavService.cancelCallBackFunction = null;
    this.matSidenavService.confirmStatus = null;
  }

  async ngOnInit() {
    await this.formInit();
    // Nếu editMode = true và purpose là edit (obj đã được set) thì sẽ set giá trị cho các input Textbox bằng đối tượng vừa được nhấn edit
    await this.bindingConfigAddOrUpdate();

    // Lấy ra biến translate của hệ thống
    this.dataTranslate = await this.translate
      .getTranslation(this.translate.getDefaultLang())
      .toPromise();
    await this.setValidation();

    await this.getNhomthamso();
    await this.getAllDonvido();
  }

  setValidation() {
    this.validationErrorMessages = {
      tenthamso: {
        required: this.dataTranslate.DANHMUC.thamso.tenthamsoRequired,
      },
      idNhomthamso: {
        required: this.dataTranslate.DANHMUC.thamso.idNhomthamsoRequired,
      },
      kyhieuthamso: {
        required: this.dataTranslate.DANHMUC.thamso.kyhieuthamsoRequired,
      },
    };
  }

  async getNhomthamso() {
    this.listDulieuNhomThamSo = await this.dmFacadeService
      .getNhomthamsoService()
      .getFetchAll({ PageNumber: 1, PageSize: -1 });
    this.nhomthamsoList = this.listDulieuNhomThamSo.items;
  }

  // config Form use add or update
  bindingConfigAddOrUpdate() {
    this.editMode = false;
    this.inputModel = new InputThamsoModel();
    if (this.purpose === "new" || this.purpose === "edit") {
      this.editMode = true;
    }
    // check edit
    this.formOnEdit();
  }
  // init FormControl
  formInit() {
    this.thamsoIOForm = this.formBuilder.group({
      tenthamso: ["", Validators.required],
      kyhieuthamso: ["", Validators.required],
      idNhomthamso: ["", Validators.required],
      idDonvidomacdinh: [""],
      tag: [""],
    });
  }

  // init edit form
  formOnEdit() {
    if (this.editMode === true && this.obj) {
      this.thamsoIOForm.setValue({
        tenthamso: this.obj.tenthamso,
        kyhieuthamso: this.obj.kyhieuthamso,
        idNhomthamso: this.obj.idNhomthamso,
        idDonvidomacdinh: this.obj.idDonvidomacdinh,
        tag: this.obj.tagArray,
      });
    }
  }

  // on submit
  async onSubmit(operMode: string) {
    this.logAllValidationErrorMessages();
    if (this.thamsoIOForm.valid === true) {
      this.addOrUpdate(operMode);
      this.matSidenavService.close();
    }
  }

  // get all tham so
  async getAllDonvido() {
    this.listDulieuDonvido = await this.dmFacadeService
      .getDonvidoService()
      .getFetchAll({ PageNumber: 1, PageSize: -1 });
    this.listDonvido = this.listDulieuDonvido.items;
    this.donvidoListFilter = this.listDulieuDonvido.items;
  }

  // add or update
  private addOrUpdate(operMode: string) {
    this.inputModel = this.thamsoIOForm.value;
    let tags = this.thamsoIOForm.value.tag;
    if (tags) {
      let tagData = tags.map((tag) => {
        return tag.value ? tag.value : tag;
      });
      this.inputModel.tag = tagData;
    } else {
      let tagData = [];
      this.inputModel.tag = tagData;
    }
    if (operMode === "new") {
      this.dmFacadeService
        .getThamsoService()
        .addItem(this.inputModel)
        .subscribe(
          (res) => this.matSidenavService.doParentFunction("getAllThamso"),
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
        .getThamsoService()
        .updateItem(this.inputModel)
        .subscribe(
          (res) => this.matSidenavService.doParentFunction("getAllThamso"),
          (error: HttpErrorResponse) => this.commonService.showError(error),
          () =>
            this.commonService.showeNotiResult(
              this.dataTranslate.COMMON.default.successEdit,
              2000
            )
        );
    }
  }

  // on save and reset form
  async addContinue(operMode: string) {
    this.logAllValidationErrorMessages();
    if (this.thamsoIOForm.valid === true) {
      this.addOrUpdate(operMode);
      this.onFormReset();
      this.purpose = "new";
    }
  }

  // reset form
  public onFormReset() {
    this.thamsoIOForm.reset();
  }
  // Validation click submit
  public logAllValidationErrorMessages() {
    validationAllErrorMessagesService(
      this.thamsoIOForm,
      this.validationErrorMessages,
      this.formErrors
    );
  }

  // close sidebar
  public closeThamsoIOSidebar() {
    this.matSidenavService.close();
  }
}
