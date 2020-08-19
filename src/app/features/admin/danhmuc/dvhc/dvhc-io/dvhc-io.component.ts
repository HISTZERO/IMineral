import { Component, OnInit } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { InputDvhcModel } from "src/app/models/admin/danhmuc/dvhc.model";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { GlobalVar } from "src/app/shared/constants/global-var";
import { DmFacadeService } from "src/app/services/admin/danhmuc/danhmuc-facade.service";
import { TranslateService } from "@ngx-translate/core";
import { translateConstants } from "src/app/shared/constants/translate-constants";

@Component({
  selector: "app-dvhc-io",
  templateUrl: "./dvhc-io.component.html",
  styleUrls: ["./dvhc-io.component.scss"],
})
export class DmDvhcIoComponent implements OnInit {
  dvhcIOForm: FormGroup;
  submitted = false;
  public editMode: boolean;
  public purpose: string;
  public inputDvhcModel: InputDvhcModel;
  hiddenProvineName = true;
  hiddenDistrictName = true;
  hiddenMatinh = false;
  hiddenMahuyen = true;
  hiddenMaxa = true;
  disabledMatinh = false;
  public obj: any;

  // error message
  public validationErrorMessages = {};

  // form errors
  public formErrors = {
    tendvhc: "",
    matinh: "",
    mahuyen: "",
    maxa: "",
  };

  // Các biến translate
  public dataTranslate: any;

  constructor(
    private formBuilder: FormBuilder,
    private matSidenavService: MatsidenavService,
    private dmFacadeSv: DmFacadeService,
    private commonService: CommonServiceShared,
    private translate: TranslateService
  ) {
    this.matSidenavService.okCallBackFunction = null;
    this.matSidenavService.cancelCallBackFunction = null;
    this.matSidenavService.confirmStatus = null;
  }

  async ngOnInit() {
    await this.configOnInit();

    // Lấy ra biến translate của hệ thống
    this.dataTranslate = await this.translate
      .getTranslation(this.translate.getDefaultLang())
      .toPromise();
    await this.setValidation();
  }

  setValidation() {
    this.validationErrorMessages = {
      tendvhc: { required: this.dataTranslate.DANHMUC.dvhc.tendvhcRequired },
    };
  }

  //
  // config OnInit
  configOnInit() {
    this.editMode = false;
    this.inputDvhcModel = new InputDvhcModel();
    // declare fields, validate
    this.dvhcIOForm = this.formBuilder.group({
      id: [0],
      tendvhc: ["", Validators.required],
      matinh: [""],
      mahuyen: [""],
      maxa: [""],
      tentinh: [{ value: "", disabled: true }],
      tenhuyen: [{ value: "", disabled: true }],
    });

    const sideBarModeProvince = ["editProvince", "newProvince"];
    const sideBarModeDistrict = ["newDistrict", "editDistrict"];
    const sideBarModeWard = ["newWard", "editWard"];
    if (sideBarModeProvince.indexOf(this.purpose) !== -1) {
      this.editMode = true;
    } else if (sideBarModeDistrict.indexOf(this.purpose) !== -1) {
      this.editMode = true;
      this.hiddenProvineName = false;
      this.hiddenMatinh = true;
      this.hiddenMahuyen = false;
      this.dvhcIOForm.controls.id.setValue(this.obj.id);
      this.dvhcIOForm.controls.tentinh.setValue(GlobalVar.provinceSelected);
      this.dvhcIOForm.controls.matinh.setValue(this.obj.matinh);
    } else if (sideBarModeWard.indexOf(this.purpose) !== -1) {
      this.editMode = true;
      this.hiddenMatinh = true;
      this.hiddenMahuyen = true;
      this.hiddenProvineName = false;
      this.hiddenDistrictName = false;
      this.hiddenMaxa = false;
      this.dvhcIOForm.controls.id.setValue(this.obj.id);
      this.dvhcIOForm.controls.matinh.setValue(this.obj.matinh);
      this.dvhcIOForm.controls.mahuyen.setValue(this.obj.mahuyen);
      this.dvhcIOForm.controls.tentinh.setValue(GlobalVar.provinceSelected);
      this.dvhcIOForm.controls.tenhuyen.setValue(GlobalVar.districtSelected);
    }
    // edit province
    if (this.purpose === "editProvince" && this.editMode === true && this.obj) {
      this.dvhcIOForm.setValue({
        id: this.obj.id,
        tendvhc: this.obj.tendvhc,
        matinh: this.obj.matinh,
        tentinh: this.obj.tendvhc,
        tenhuyen: "",
        mahuyen: "",
        maxa: "",
      });
    }
    // edit district
    if (this.purpose === "editDistrict" && this.editMode === true && this.obj) {
      this.hiddenProvineName = false;
      this.dvhcIOForm.setValue({
        id: this.obj.id,
        tendvhc: this.obj.tendvhc,
        mahuyen: this.obj.mahuyen,
        tenhuyen: this.obj.tendvhc,
        maxa: "",
        matinh: "",
        tentinh: GlobalVar.provinceSelected,
      });
    }
    // edit wardCode
    if (this.purpose === "editWard" && this.editMode === true && this.obj) {
      (this.hiddenDistrictName = false),
        (this.hiddenProvineName = false),
        this.dvhcIOForm.setValue({
          id: this.obj.id,
          tendvhc: this.obj.tendvhc,
          maxa: this.obj.maxa,
          mahuyen: "",
          matinh: "",
          tentinh: GlobalVar.provinceSelected,
          tenhuyen: GlobalVar.districtSelected,
        });
    }
  }

  // submit
  public onSubmit(operMode: string) {
    if (operMode === "newProvince" || operMode === "editProvince") {
      this.addOrUpdateProvince(operMode);
      // close sidebar
      this.closeDvhcIOSidebar();
    } else if (operMode === "newDistrict" || operMode === "editDistrict") {
      this.addOrUpdateDistrict(operMode);
      // close sidebar
      this.closeDvhcIOSidebar();
    } else if (operMode === "newWard" || operMode === "editWard") {
      this.addOrUpdateWard(operMode);
      // close sidebar
      this.closeDvhcIOSidebar();
    }
  }

  // add or update continue
  public addOrUpdateContinue(operMode: string) {
    if (operMode === "newProvince" || operMode === "editProvince") {
      this.addOrUpdateProvince(operMode);
      this.onFormReset();
    } else if (operMode === "newDistrict" || operMode === "editDistrict") {
      this.addOrUpdateDistrict(operMode);
      this.onFormReset();
      this.configOnInit();
    } else if (operMode === "newWard" || operMode === "editWard") {
      this.addOrUpdateWard(operMode);
      this.onFormReset();
      this.configOnInit();
    }
  }

  // add or update province
  private addOrUpdateProvince(operMode: string) {
    this.inputDvhcModel = this.dvhcIOForm.value;
    if (operMode === "newProvince") {
      this.dmFacadeSv
        .getProvinceService()
        .addItem(this.inputDvhcModel)
        .subscribe(
          (res) => this.matSidenavService.doParentFunction("getAllProvince"),
          (errorResponese: HttpErrorResponse) => {
            this.commonService.showError(errorResponese);
          },
          () =>
            this.commonService.showeNotiResult(
              this.dataTranslate.COMMON.default.SuccessAdd,
              2000
            )
        );
    } else if (operMode === "editProvince") {
      const id: number = this.obj.id;
      this.inputDvhcModel.id = id;
      this.dmFacadeSv
        .getProvinceService()
        .updateItem(this.inputDvhcModel)
        .subscribe(
          (res) => this.matSidenavService.doParentFunction("getAllProvince"),
          (errorResponese: HttpErrorResponse) => {
            this.commonService.showError(errorResponese);
          },
          () =>
            this.commonService.showeNotiResult(
              this.dataTranslate.COMMON.default.SuccessEdit,
              2000
            )
        );
    }
  }

  // add or update district
  private addOrUpdateDistrict(operMode: string) {
    this.inputDvhcModel = this.dvhcIOForm.value;
    if (operMode === "newDistrict") {
      this.inputDvhcModel.id = 0;
      this.inputDvhcModel.parentid = this.obj.id;
      this.dmFacadeSv
        .getDistrictService()
        .addItem(this.inputDvhcModel)
        .subscribe(
          (res) =>
            this.matSidenavService.doParentFunction("refreshGridDistrict"),
          (errorResponse: HttpErrorResponse) => {
            this.commonService.showError(errorResponse);
          },
          () =>
            this.commonService.showeNotiResult(
              this.dataTranslate.COMMON.default.SuccessAdd,
              2000
            )
        );
    } else if (operMode === "editDistrict") {
      const id: number = this.obj.id;
      this.inputDvhcModel.id = id;
      this.inputDvhcModel.matinh = this.obj.matinh;
      this.inputDvhcModel.parentid = this.obj.parentid;
      this.dmFacadeSv
        .getDistrictService()
        .updateItem(this.inputDvhcModel)
        .subscribe(
          (res) =>
            this.matSidenavService.doParentFunction("refreshGridDistrict"),
          (errorResponse: HttpErrorResponse) => {
            this.commonService.showError(errorResponse);
          },
          () =>
            this.commonService.showeNotiResult(
              this.dataTranslate.COMMON.default.SuccessEdit,
              2000
            )
        );
    }
  }

  // add or update ward
  private addOrUpdateWard(operMode: string) {
    this.inputDvhcModel = this.dvhcIOForm.value;
    if (operMode === "newWard") {
      this.inputDvhcModel.id = 0;
      this.inputDvhcModel.parentid = this.obj.id;
      this.dmFacadeSv
        .getWardService()
        .addItem(this.inputDvhcModel)
        .subscribe(
          (res) => this.matSidenavService.doParentFunction("refreshGridWard"),
          (errorResponse: HttpErrorResponse) => {
            this.commonService.showError(errorResponse);
          },
          () =>
            this.commonService.showeNotiResult(
              this.dataTranslate.COMMON.default.SuccessAdd,
              2000
            )
        );
    } else if (operMode === "editWard") {
      const id: number = this.obj.id;
      this.inputDvhcModel.id = id;
      this.inputDvhcModel.matinh = this.obj.matinh;
      this.inputDvhcModel.mahuyen = this.obj.mahuyen;
      this.inputDvhcModel.parentid = this.obj.parentid;
      this.dmFacadeSv
        .getWardService()
        .updateItem(this.inputDvhcModel)
        .subscribe(
          (res) => this.matSidenavService.doParentFunction("refreshGridWard"),
          (errorResponse: HttpErrorResponse) => {
            this.commonService.showError(errorResponse);
          },
          () =>
            this.commonService.showeNotiResult(
              this.dataTranslate.COMMON.default.SuccessEdit,
              2000
            )
        );
    }
  }

  // reset form
  public onFormReset() {
    this.dvhcIOForm.reset();
  }

  // close dvhc
  public closeDvhcIOSidebar() {
    this.matSidenavService.close();
  }
}
