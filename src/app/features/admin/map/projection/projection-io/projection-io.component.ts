import { HttpErrorResponse } from "@angular/common/http";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

import { ProjectionStatus } from "src/app/shared/constants/map-constants";
import { MapFacadeService } from "src/app/services/admin/map/map-facade.service";
import { InputProjectionModel } from "src/app/models/admin/map/projection.model";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import {
  validationAllErrorMessagesService,
} from "src/app/services/utilities/validatorService";

@Component({
  selector: "app-projection-io",
  templateUrl: "./projection-io.component.html",
  styleUrls: ["./projection-io.component.scss"],
})
export class ProjectionIoComponent implements OnInit {
  // public submitted = false;
  public obj: any;
  public purpose: string;
  public editMode: boolean;
  public createForm: FormGroup;
  public inputModel: InputProjectionModel;

  // List projection status
  // Show on select
  public projectionStatus = ProjectionStatus;

  // Data translate
  public dataTranslate: any;

  // Error message
  validationErrorMessages = {};

  // form errors
  formErrors = {
    prjName: "",
    srid: "",
    proj4Params: "",
    extent: "",
    status: "",
  };

  constructor(
    private formBuilder: FormBuilder,
    public mapFacadeService: MapFacadeService,
    public commonService: CommonServiceShared,
    public matSidenavService: MatsidenavService,
    private translate: TranslateService
  ) {
    this.matSidenavService.okCallBackFunction = null;
    this.matSidenavService.cancelCallBackFunction = null;
    this.matSidenavService.confirmStatus = null;
  }

  async ngOnInit() {
    await this.formInit();

    // Lấy dữ liệu biến translate để gán vào các biến trong component
    this.dataTranslate = await this.translate
      .getTranslation(this.translate.getDefaultLang())
      .toPromise();

    this.setValidation();
  }

  // Hàm set biến validation từ data translate
  setValidation() {
    this.validationErrorMessages = {
      prjName: {
        required: this.dataTranslate.MAP.projection.prjNameRequired,
      },
      srid: {
        required: this.dataTranslate.MAP.projection.sridRequired,
        pattern: this.dataTranslate.MAP.projection.sridPattern,
      },
      proj4Params: {
        required: this.dataTranslate.MAP.projection.proj4ParamsRequired,
      },
      extent: { required: this.dataTranslate.MAP.projection.extendRequired },
      status: { required: this.dataTranslate.MAP.projection.statusRequired },
    };
  }

  // init FormControl
  formInit() {
    this.createForm = this.formBuilder.group({
      id: [],
      prjName: ["", Validators.required],
      srid: ["", [Validators.required, Validators.pattern(/^[-+]?\d*\.?\d*$/)]],
      proj4Params: ["", Validators.required],
      extent: ["", Validators.required],
      status: ["", Validators.required],
    });

    // When edit
    // Set form value from object
    if (this.obj.data !== undefined) {
      let newObj = this.commonService.mapObjectAndForm(
        this.obj.data,
        this.createForm
      );
      this.createForm.setValue({ ...newObj });
    }
  }

  // Add or update form
  private addOrUpdate() {
    this.inputModel = this.createForm.value;
    const itemService = this.mapFacadeService.getProjectionService();
    if (this.inputModel.id !== null) {
      this.updateItem(itemService);
    } else {
      delete this.inputModel.id;
      this.addItem(itemService);
    }
  }

  // Add item
  public addItem(itemService) {
    itemService.addItem(this.inputModel).subscribe(
      () => this.matSidenavService.doParentFunction("getAllItems"),
      (error: HttpErrorResponse) => {
        this.commonService.showeNotiResult(error.message, 2000);
      },
      () =>
        this.commonService.showeNotiResult(
          this.dataTranslate.MAP.projection.notiAddSuccess,
          2000
        )
    );
  }

  // Update item
  public updateItem(itemService) {
    itemService.updateItem(this.inputModel).subscribe(
      (res) => this.matSidenavService.doParentFunction("getAllItems"),
      (error: HttpErrorResponse) => {
        this.commonService.showeNotiResult(error.message, 2000);
      },
      () =>
        this.commonService.showeNotiResult(
          this.dataTranslate.MAP.projection.notiEditSuccess,
          2000
        )
    );
  }

  // Submit form
  async onSubmit() {
    if (this.createForm.valid === false) this.logAllValidationErrorMessages();
    else {
      this.addOrUpdate();
      this.matSidenavService.close();
    }
  }

  // Reset form
  public onFormReset() {
    this.createForm.reset();
  }

  async onContinueAdd() {
    if (this.createForm.valid === false) this.logAllValidationErrorMessages();
    else {
      this.addOrUpdate();
      this.onFormReset();
    }
  }

  // validation error message
  public logAllValidationErrorMessages() {
    validationAllErrorMessagesService(
      this.createForm,
      this.validationErrorMessages,
      this.formErrors
    );
  }

  public closeIOSidebar() {
    this.matSidenavService.close();
  }
}
