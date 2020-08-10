import { TranslateService } from "@ngx-translate/core";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpErrorResponse } from "@angular/common/http";
import { MatDialog } from "@angular/material/dialog";
import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";

import { OutputDvhcModel } from "src/app/models/admin/danhmuc/dvhc.model";
import { InputCongtyModel } from "src/app/models/admin/danhmuc/congty.model";
import { DmFacadeService } from "src/app/services/admin/danhmuc/danhmuc-facade.service";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { ThuvienComponent } from "src/app/features/admin/thuvien/thuvien.component";
import { MatdialogService } from "src/app/services/utilities/matdialog.service";
import { validationAllErrorMessagesService } from "src/app/services/utilities/validatorService";

@Component({
  selector: "app-congty-io",
  templateUrl: "./congty-io.component.html",
  styleUrls: ["./congty-io.component.scss"],
})
export class DmCongtyIoComponent implements OnInit {
  companyIOForm: FormGroup;
  submitted = false;
  public editMode: boolean;
  public purpose: string;
  public inputModel: InputCongtyModel;
  public obj: any;
  public Editor = ClassicEditor;
  public allTinh: any;
  public allTinhData: any;
  public allHuyen: any;
  public allXa: any;
  dvhcProvinceFilters: OutputDvhcModel[];
  dvhcDistrictFilters: OutputDvhcModel[];
  dvhcWardFilters: OutputDvhcModel[];

  // Những biến dành cho phần file
  mDialog: any;
  srcanh = "";
  public fileArray: any;
  // error message
  validationErrorMessages = {};
  // form errors
  formErrors = {
    tencongty: "",
    sodienthoai: "",
    email: "",
    matinh: "",
    mahuyen: "",
  };

  // Biến dùng translate
  dataTranslate: any;

  constructor(
    private formBuilder: FormBuilder,
    public dmFacadeService: DmFacadeService,
    public commonService: CommonServiceShared,
    public matSidenavService: MatsidenavService,
    private imDialog: MatDialog,
    imDialogService: MatdialogService,
    private translate: TranslateService
  ) {
    this.matSidenavService.okCallBackFunction = null;
    this.matSidenavService.cancelCallBackFunction = null;
    this.matSidenavService.confirmStatus = null;
    this.mDialog = imDialogService;
    this.mDialog.initDialg(imDialog);
  }

  async ngOnInit() {
    await this.bindingConfig();

    // Lấy ra biến translate của hệ thống
    this.dataTranslate = await this.translate
      .getTranslation(this.translate.getDefaultLang())
      .toPromise();
    await this.setValidation();
  }

  setValidation() {
    this.validationErrorMessages = {
      tencongty: {
        required: this.dataTranslate.DANHMUC.congty.tencongtyRequired,
      },
      sodienthoai: {
        required: this.dataTranslate.DANHMUC.congty.sodienthoaiRequired,
        pattern: this.dataTranslate.DANHMUC.congty.sodienthoaiPattern,
      },
      email: {
        required: this.dataTranslate.DANHMUC.congty.emailRequired,
        email: this.dataTranslate.DANHMUC.congty.emailEmail,
      },
      matinh: { required: this.dataTranslate.DANHMUC.congty.matinhRequired },
      mahuyen: {
        required: this.dataTranslate.DANHMUC.congty.mahuyenRequired,
      },
    };
  }

  // binding Config
  bindingConfig() {
    this.showDvhcTinh();
    this.editMode = false;
    this.inputModel = new InputCongtyModel();
    this.companyIOForm = this.formBuilder.group({
      tencongty: ["", Validators.required],
      diachi: [""],
      sodienthoai: [
        "",
        [Validators.required, Validators.pattern(/^[-+]?\d*\.?\d*$/)],
      ],
      email: ["", Validators.compose([Validators.required, Validators.email])],
      note: [""],
      imgLink: [""],
      matinh: ["", Validators.required],
      mahuyen: ["", Validators.required],
      maxa: [""],
    });

    // Nếu editMode = true và purpose là edit (obj đã được set) thì sẽ set giá trị cho các input Textbox bằng đối tượng vừa được nhấn edit
    if (this.obj) {
      this.companyIOForm.setValue({
        tencongty: this.obj.tencongty,
        diachi: this.obj.diachi,
        matinh: this.obj.matinh,
        mahuyen: this.obj.mahuyen,
        maxa: this.obj.maxa,
        sodienthoai: this.obj.sodienthoai,
        email: this.obj.email,
        note: this.obj.note,
        imgLink: this.obj.imgLink,
      });
      this.srcanh = this.obj.imgLink;
      this.bindingConfigDvhcToEdit();
    }
    this.editMode = true;
  }

  // on Submit
  async onSubmit(operMode: string) {
    this.logAllValidationErrorMessages();
    if (this.companyIOForm.valid === true) {
      this.addOrUpdate(operMode);
      this.matSidenavService.close();
    }
  }

  // save and reset form
  public addOrUpdateContinue(operMode: string) {
    this.logAllValidationErrorMessages();
    if (this.companyIOForm.valid === true) {
      this.addOrUpdate(operMode);
      this.onFormReset();
      this.purpose = "new";
    }
  }

  // add or update
  private addOrUpdate(operMode: string) {
    this.inputModel = this.companyIOForm.value;
    this.inputModel.imgLink = this.srcanh;
    if (operMode === "new") {
      this.dmFacadeService
        .getDmCongtyService()
        .addItem(this.inputModel)
        .subscribe(
          (res) =>
            this.matSidenavService.doParentFunction("refreshListCompany"),
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
        .getDmCongtyService()
        .updateItem(this.inputModel)
        .subscribe(
          (res) =>
            this.matSidenavService.doParentFunction("refreshListCompany"),
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

  // binding dvhc use  update
  bindingConfigDvhcToEdit() {
    this.showDvhcHuyen();
    this.showDvhcXa();
  }

  // Các hàm get đơn vị hành chính
  async showDvhcTinh() {
    this.allTinhData = await this.dmFacadeService
      .getProvinceService()
      .getFetchAll({ PageNumber: 1, PageSize: -1 });
    this.allTinh = this.allTinhData.items;
    this.dvhcProvinceFilters = this.allTinhData.items;
  }

  async showDvhcHuyen() {
    if (!this.companyIOForm.value.matinh === true) {
      this.allHuyen = [];
      this.dvhcDistrictFilters = [];
      this.allXa = [];
      this.dvhcWardFilters = [];
      if (this.editMode === true)
        this.companyIOForm.controls["mahuyen"].setValue("");
    }
    if (!this.companyIOForm.value.matinh === false) {
      if (this.editMode === true)
        this.companyIOForm.controls["mahuyen"].setValue("");
      this.allXa = [];
      this.dvhcWardFilters = [];
      this.allHuyen = await this.dmFacadeService
        .getDistrictService()
        .getFetchAll({ matinh: this.companyIOForm.value.matinh });
      this.dvhcDistrictFilters = this.allHuyen;
    }
  }

  async showDvhcXa() {
    if (!this.companyIOForm.value.mahuyen === true) {
      this.allXa = [];
      this.dvhcWardFilters = [];
      if (this.editMode === true)
        this.companyIOForm.controls["maxa"].setValue("");
    }
    if (
      !this.companyIOForm.value.matinh === false &&
      !this.companyIOForm.value.mahuyen === false
    ) {
      if (this.editMode === true)
        this.companyIOForm.controls["maxa"].setValue("");
      this.allXa = await this.dmFacadeService
        .getWardService()
        .getFetchAll({ mahuyen: this.companyIOForm.value.mahuyen });
      this.dvhcWardFilters = this.allXa;
    }
  }

  // reset form
  public onFormReset() {
    this.companyIOForm.reset();
  }
  // Validation click submit
  public logAllValidationErrorMessages() {
    validationAllErrorMessagesService(
      this.companyIOForm,
      this.validationErrorMessages,
      this.formErrors
    );
  }

  // close sidebar
  public closeCompanyIOSidebar() {
    this.matSidenavService.close();
  }
  /**
   * Hàm đóng mat dialog
   */
  closeMatDialog() {
    this.imDialog.closeAll();
  }

  /**
   * Hàm mở thư viện dialog
   */
  public showMatDialog() {
    this.mDialog.setDialog(
      this,
      ThuvienComponent,
      "showFileSelect",
      "closeMatDialog",
      "simpleFileV1",
      "75%"
    );
    this.mDialog.open();
  }

  /**
   * Hiển thị những file select trong thư viện
   */
  showFileSelect() {
    this.fileArray = this.mDialog.dataResult;
    this.srcanh = this.fileArray[0].link;
  }

  /**
   * Xóa ảnh hiện có
   */
  deleteAnh() {
    this.srcanh = "";
  }

  /**
   *  Hàm gọi từ function con gọi vào chạy function cha
   * @param methodName
   */
  doFunction(methodName) {
    this[methodName]();
  }
}
