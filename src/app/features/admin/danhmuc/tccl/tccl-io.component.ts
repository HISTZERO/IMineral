import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  displayFieldCssService, validationAllErrorMessagesService,
} from "src/app/services/utilities/validatorService";
import { InputTieuchuanchatluongModel } from "src/app/models/admin/danhmuc/tccl.model";
import { HttpErrorResponse } from "@angular/common/http";
import { donvido } from "src/app/shared/constants/enum";
import { DmFacadeService } from "src/app/services/admin/danhmuc/danhmuc-facade.service";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { OutputTieuchuanModel } from "src/app/models/admin/danhmuc/tieuchuan.model";
import { OutputThamsoModel } from "src/app/models/admin/danhmuc/thamso.model";
import { OutputDonvidoModel } from "src/app/models/admin/danhmuc/donvido.model";
import { TranslateService } from "@ngx-translate/core";
import { translateConstants } from "src/app/shared/constants/translate-constants";

@Component({
  selector: "app-tccl-io",
  templateUrl: "./tccl-io.component.html",
  styleUrls: ["./tccl-io.component.scss"],
})
export class DmTcclIoComponent implements OnInit {
  tieuchuanchatluongIOForm: FormGroup;
  submitted = false;
  public editMode: boolean;
  public purpose: string;
  public inputModel: InputTieuchuanchatluongModel;
  public obj: any;
  public tieuchuanList: any;
  public tieuchuanListFilter: OutputTieuchuanModel[];
  public thamsoList: any;
  public thamsoListFilter: OutputThamsoModel[];
  public donvidoListFilter: OutputDonvidoModel[];
  public donvido = donvido;
  listTieuchuan: any;
  listThamso: any;
  listDonvido: any;
  listDulieuDonvido: any;
  listDulieuTieuchuan: any;
  listDulieuThamso: any;

  // error message
  validationErrorMessages = {};

  // form errors
  formErrors = {
    idTieuchuan: "",
    idThamso: "",
    gioihantren: "",
    gioihanduoi: "",
  };

  // Biến dùng translate
  dataTranslate: any;

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
    await this.bindingConfigValidation();
    await this.bindingConfigAddOrUpdate();

    // Lấy ra biến translate của hệ thống
    this.dataTranslate = await this.translate
      .getTranslation(this.translate.getDefaultLang())
      .toPromise();
    await this.setValidation();

    await this.getAllThamso();
    await this.getAllTieuchuan();
    await this.getAllDonvido();
  }

  setValidation() {
    this.validationErrorMessages = {
      idTieuchuan: {
        required: this.dataTranslate.DANHMUC.tccl.idTieuchuanRequired,
      },
      idThamso: { required: this.dataTranslate.DANHMUC.tccl.idThamsoRequired },
      gioihantren: {
        pattern: this.dataTranslate.DANHMUC.tccl.gioihantrenPattern,
      },
      gioihanduoi: {
        pattern: this.dataTranslate.DANHMUC.tccl.gioihanduoiPattern,
      },
    };
  }

  // get all Tieu chuan
  async getAllTieuchuan() {
    this.listDulieuTieuchuan = await this.dmFacadeService
      .getTieuchuanService()
      .getFetchAll({ PageNumber: 1, PageSize: -1 });
    this.listTieuchuan = this.listDulieuTieuchuan.items;
    this.tieuchuanListFilter = this.listDulieuTieuchuan.items;
  }

  // get all tham so
  async getAllThamso() {
    this.listDulieuThamso = await this.dmFacadeService
      .getThamsoService()
      .getFetchAll({ PageNumber: 1, PageSize: -1 });
    this.listThamso = this.listDulieuThamso.items;
    this.thamsoListFilter = this.listDulieuThamso.items;
  }

  // get all tham so
  async getAllDonvido() {
    this.listDulieuDonvido = await this.dmFacadeService
      .getDonvidoService()
      .getFetchAll({ PageNumber: 1, PageSize: -1 });
    this.listDonvido = this.listDulieuDonvido.items;
    this.donvidoListFilter = this.listDulieuDonvido.items;
  }

  // config Form use add or update
  bindingConfigAddOrUpdate() {
    this.editMode = false;
    this.inputModel = new InputTieuchuanchatluongModel();
    if (this.purpose === "new" || this.purpose === "edit") {
      this.editMode = true;
    }
    // check edit
    this.formOnEdit();
  }
  // init FormControl
  bindingConfigValidation() {
    this.tieuchuanchatluongIOForm = this.formBuilder.group({
      idTieuchuan: ["", Validators.required],
      idThamso: ["", Validators.required],
      idDonvido: [""],
      gioihantren: ["", Validators.pattern("^[0-9-+]+$")],
      gioihanduoi: ["", Validators.pattern("^[0-9-+]+$")],
      phuongphapthu: [""],
      captieuchuan: [""],
      mucdogiamsat: [""],
    });
  }
  // init edit form
  formOnEdit() {
    if (this.editMode === true && this.obj) {
      this.tieuchuanchatluongIOForm.setValue({
        idTieuchuan: this.obj.idTieuchuan,
        idThamso: this.obj.idThamso,
        idDonvido: this.obj.idDonvido,
        gioihantren: this.obj.gioihantren,
        gioihanduoi: this.obj.gioihanduoi,
        phuongphapthu: this.obj.phuongphapthu,
        captieuchuan: this.obj.captieuchuan,
        mucdogiamsat: this.obj.mucdogiamsat,
      });
    }
  }
  // on submit
  async onSubmit(operMode: string) {
    this.logAllValidationErrorMessages();
    if (this.tieuchuanchatluongIOForm.valid === true) {
      this.addOrUpdate(operMode);
      this.matSidenavService.close();
    }
  }
  // add or update form
  private addOrUpdate(operMode: string) {
    this.inputModel = this.tieuchuanchatluongIOForm.value;
    if (operMode === "new") {
      this.dmFacadeService
        .getTieuchuanchatluongService()
        .addItem(this.inputModel)
        .subscribe(
          (res) =>
            this.matSidenavService.doParentFunction("getAllTieuchuanchatluong"),
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
        .getTieuchuanchatluongService()
        .updateItem(this.inputModel)
        .subscribe(
          (res) =>
            this.matSidenavService.doParentFunction("getAllTieuchuanchatluong"),
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
  // on save and reset form
  async addContinue(operMode: string) {
    this.logAllValidationErrorMessages();
    if (this.tieuchuanchatluongIOForm.valid === true) {
      this.addOrUpdate(operMode);
      this.onFormReset();
      this.purpose = "new";
    }
  }

  // reset form
  public onFormReset() {
    this.tieuchuanchatluongIOForm.reset();
  }

  // close sidebar
  public closeTieuchuanchatluongIOSidebar() {
    this.matSidenavService.close();
  }
  // Validation click submit
  public logAllValidationErrorMessages() {
    validationAllErrorMessagesService(
      this.tieuchuanchatluongIOForm,
      this.validationErrorMessages,
      this.formErrors
    );
  }

  // display fields css
  public displayFieldCss(field: string) {
    displayFieldCssService(field);
  }
}
