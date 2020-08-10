import { TranslateService } from "@ngx-translate/core";
import { Component, OnInit } from "@angular/core";
import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { OutputDvhcModel } from "src/app/models/admin/danhmuc/dvhc.model";
import { validationAllErrorMessagesService } from "src/app/services/utilities/validatorService";
import {
  InputCoquantochucModel,
  OutputCoquantochucModel,
} from "src/app/models/admin/danhmuc/coquantochuc.model";
import { MatDialog } from "@angular/material/dialog";
import { DmFacadeService } from "src/app/services/admin/danhmuc/danhmuc-facade.service";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { CommonFacadeService } from "src/app/services/admin/common/common-facade.service";
import { MatdialogService } from "src/app/services/utilities/matdialog.service";
import { ThuvienComponent } from "src/app/features/admin/thuvien/thuvien.component";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
  selector: "app-coquan-io",
  templateUrl: "./coquan-io.component.html",
  styleUrls: ["./coquan-io.component.scss"],
})
export class DmCoquanIoComponent implements OnInit {
  coquantochucIOForm: FormGroup;
  public inputModel: InputCoquantochucModel;
  public editMode: boolean;
  public purpose: string;
  public obj: any;
  public coquangList: OutputCoquantochucModel[];
  public coquan: any;
  public coquangListFilter: OutputCoquantochucModel[];

  public allTinhData: any;
  public allTinh: any;
  public allHuyen: any;
  public allXa: any;
  public model: any;
  // Ck editor
  public Editor = ClassicEditor;

  // Những biến dành cho phần file
  mDialog: any;
  srcanh = "";
  public fileArray: any;

  // filter Đơn vị hành chính
  public dvhcProvinceFilters: OutputDvhcModel[];
  public dvhcDistrictFilters: OutputDvhcModel[];
  public dvhcWardFilters: OutputDvhcModel[];

  // Biến dùng translate
  dataTranslate: any;

  // error message
  validationErrorMessages = {};

  // form errors
  formErrors = {
    tencoquan: "",
    sodienthoai: "",
    email: "",
    matinh: "",
    mahuyen: "",
  };

  // ctor
  constructor(
    private formBuilder: FormBuilder,
    public dmFacadeService: DmFacadeService,
    public commonService: CommonServiceShared,
    public matSidenavService: MatsidenavService,
    public cmFacadeService: CommonFacadeService,
    private imDialog: MatDialog,
    imDialogService: MatdialogService,
    private translate: TranslateService
  ) {
    this.mDialog = imDialogService;
    this.mDialog.initDialg(imDialog);
  }

  // onInit
  async ngOnInit() {
    await this.bindingConfigValidation();
    await this.bindingConfigAddOrUpdate();

    // Lấy ra biến translate của hệ thống
    this.dataTranslate = await this.translate
      .getTranslation(this.translate.getDefaultLang())
      .toPromise();
    await this.setValidation();
    await this.getList();
  }

  setValidation() {
    this.validationErrorMessages = {
      tencoquan: {
        required: this.dataTranslate.DANHMUC.coquan.tencoquanRequired,
      },
      sodienthoai: {
        pattern: this.dataTranslate.DANHMUC.coquan.sodienthoaiPattern,
      },
      email: {
        required: this.dataTranslate.DANHMUC.coquan.emailRequired,
        email: this.dataTranslate.DANHMUC.coquan.emailEmail,
      },
      matinh: { required: this.dataTranslate.DANHMUC.coquan.matinhRequired },
      mahuyen: {
        required: this.dataTranslate.DANHMUC.coquan.mahuyenRequired,
      },
    };
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
    if (!this.coquantochucIOForm.value.matinh === true) {
      this.allHuyen = [];
      this.dvhcDistrictFilters = [];
      this.allXa = [];
      this.dvhcWardFilters = [];
      if (this.editMode === true)
        this.coquantochucIOForm.controls["mahuyen"].setValue("");
    }
    if (!this.coquantochucIOForm.value.matinh === false) {
      if (this.editMode === true)
        this.coquantochucIOForm.controls["mahuyen"].setValue("");
      this.allXa = [];
      this.dvhcWardFilters = [];
      this.allHuyen = await this.dmFacadeService
        .getDistrictService()
        .getFetchAll({ matinh: this.coquantochucIOForm.value.matinh });
      this.dvhcDistrictFilters = this.allHuyen;
    }
  }

  async showDvhcXa() {
    if (!this.coquantochucIOForm.value.mahuyen === true) {
      this.allXa = [];
      this.dvhcWardFilters = [];
      if (this.editMode === true)
        this.coquantochucIOForm.controls["maxa"].setValue("");
    }
    if (
      !this.coquantochucIOForm.value.matinh === false &&
      !this.coquantochucIOForm.value.mahuyen === false
    ) {
      if (this.editMode === true)
        this.coquantochucIOForm.controls["maxa"].setValue("");
      this.allXa = await this.dmFacadeService
        .getWardService()
        .getFetchAll({ mahuyen: this.coquantochucIOForm.value.mahuyen });
      this.dvhcWardFilters = this.allXa;
    }
  }

  // get all cơ quan
  async getList() {
    this.coquan = await this.dmFacadeService
      .getDmCoquantochucService()
      .getFetchAll({ PageNumber: 1, PageSize: -1 });
    this.coquangList = this.coquan.items;
    this.coquangListFilter = this.coquan.items;
  }

  // config Form use add or update
  bindingConfigAddOrUpdate() {
    this.showDvhcTinh();
    this.editMode = false;
    this.inputModel = new InputCoquantochucModel();
    // check edit
    if (this.obj) {
      this.coquantochucIOForm.setValue({
        tencoquan: this.obj.tencoquan,
        idcha: this.obj.idcha,
        diachi: this.obj.diachi,
        sodienthoai: this.obj.sodienthoai,
        email: this.obj.email,
        matinh: this.obj.matinh,
        mahuyen: this.obj.mahuyen,
        maxa: this.obj.maxa,
        note: this.obj.note,
        imgLink: this.obj.imgLink,
      });
      this.srcanh = this.obj.imgLink;
      this.showDvhcHuyen();
      this.showDvhcXa();
    }
    this.editMode = true;
  }

  // init edit form

  // config input validation form
  bindingConfigValidation() {
    this.coquantochucIOForm = this.formBuilder.group({
      tencoquan: ["", Validators.required],
      idcha: [""],
      diachi: [""],
      sodienthoai: ["", Validators.pattern(/^[-+]?\d*\.?\d*$/)],
      email: ["", Validators.compose([Validators.required, Validators.email])],
      matinh: ["", Validators.required],
      mahuyen: ["", Validators.required],
      maxa: [""],
      note: [""],
      imgLink: [""],
    });
  }

  async onSubmit(operMode: string) {
    this.logAllValidationErrorMessages();
    if (this.coquantochucIOForm.valid === true) {
      this.addOrUpdate(operMode);
      this.matSidenavService.close();
    }
  }

  // add or update continue
  public addOrUpdateContinue(operMode: string) {
    this.logAllValidationErrorMessages();
    if (this.coquantochucIOForm.valid === true) {
      this.addOrUpdate(operMode);
      this.onFormReset();
      this.purpose = "new";
    }
  }

  // add or update
  private addOrUpdate(operMode: string) {
    this.inputModel = this.coquantochucIOForm.value;
    this.inputModel.imgLink = this.srcanh;
    if (operMode === "new") {
      this.dmFacadeService
        .getDmCoquantochucService()
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
        .getDmCoquantochucService()
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
    this.coquantochucIOForm.reset();
  }

  // Validation click submit
  public logAllValidationErrorMessages() {
    validationAllErrorMessagesService(
      this.coquantochucIOForm,
      this.validationErrorMessages,
      this.formErrors
    );
  }

  // close sidebar
  public closeCoquantochucIOSidebar() {
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
