import { HttpErrorResponse } from "@angular/common/http";
import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

import { InputLayerModel } from "src/app/models/admin/map/layer.model";
import { MapFacadeService } from "src/app/services/admin/map/map-facade.service";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import {
  LayerTypes,
  LayerStatus,
} from "src/app/shared/constants/map-constants";
import {
  validationAllErrorMessagesService,
} from "src/app/services/utilities/validatorService";
import { ValidateMaxLength } from "src/app/shared/constants/consts/enum";

@Component({
  selector: "app-layer-group-detail-io",
  templateUrl: "./layer-group-detail-io.component.html",
  styleUrls: ["./layer-group-detail-io.component.scss"],
})
export class LayerGroupDetailIoComponent implements OnInit {
  // public submitted = false;
  public obj: any;
  public editMode: boolean;
  public createForm: FormGroup;
  public Editor = ClassicEditor;
  public inputModel: InputLayerModel;

  // List layertype and layer status
  public layerTypes = LayerTypes;
  public layerStatus = LayerStatus;

  // List projection
  public listProjections: Object[];

  // error message
  validationErrorMessages = {};

  // Data translate
  public dataTranslate: any;

  // form errors
  formErrors = {
    id: "",
    layerGroupId: "",
    groupOrder: "",
    groupType: "",
    layerName: "",
    layerTitle: "",
    description: "",
    opacity: "",
    sourceId: "",
    status: "",
    extentMinx: "",
    extentMiny: "",
    extentMaxx: "",
    extentMaxy: "",
    minResolution: "",
    maxResolution: "",
    fieldsInfo: "",
    fieldsDisplay: "",
    fieldsInfoFormat: "",
    fieldsInfoTemplate: "",
    moreSettings: "",
    tocDisplay: "",
    baselayer: "",
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

    // Translate
    this.dataTranslate = await this.translate
      .getTranslation(this.translate.getDefaultLang())
      .toPromise();

    this.setValidation();
  }

  // init FormControl
  formInit() {
    this.createForm = this.formBuilder.group({
      id: [],
      layerGroupId: [],
      groupOrder: [],
      groupType: [],
      layerName: ["", Validators.maxLength(ValidateMaxLength.mediumText)],
      layerTitle: [],
      description: [],
      opacity: [],
      sourceId: [],
      status: [],
      extentMinx: [],
      extentMiny: [],
      extentMaxx: [],
      extentMaxy: [],
      minResolution: [],
      maxResolution: [],
      fieldsInfo: ["", Validators.maxLength(ValidateMaxLength.longText)],
      fieldsDisplay: ["", Validators.maxLength(ValidateMaxLength.longText)],
      fieldsInfoFormat: ["", Validators.maxLength(ValidateMaxLength.mediumText)],
      fieldsInfoTemplate: [],
      moreSettings: [],
      tocDisplay: [],
      baselayer: [],
    });

    // List projection
    this.listProjections = this.obj.listProjections;

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

  // Hàm set biến validation từ data translate
  setValidation() {
    this.validationErrorMessages = {
      layerName: {
        maxlength: this.dataTranslate.COMMON.default.maxLength
      },
      fieldsInfo: { maxlength: this.dataTranslate.COMMON.default.maxLength },
      fieldsDisplay: { maxlength: this.dataTranslate.COMMON.default.maxLength },
      fieldsInfoFormat: { maxlength: this.dataTranslate.COMMON.default.maxLength },
    };
  }

  // Update item
  public updateItem() {
    this.inputModel = this.createForm.value;
    this.mapFacadeService
      .getMLayerGroupService()
      .updateItem(this.inputModel)
      .subscribe(
        (res) => this.matSidenavService.doParentFunction("getAllItems"),
        (error: HttpErrorResponse) => {
          this.commonService.showeNotiResult(error.message, 2000);
        },
        () =>
          this.commonService.showeNotiResult(
            this.dataTranslate.MAP.layerGroupDetail.displayOptionsSuccess,
            2000
          )
      );
  }

  // Submit form
  async onSubmit() {
    if (this.createForm.valid === false) this.logAllValidationErrorMessages();
    else {
      this.updateItem();
      this.matSidenavService.close();
    }
  }

  // Reset form
  public onFormReset() {
    this.createForm.reset();
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
