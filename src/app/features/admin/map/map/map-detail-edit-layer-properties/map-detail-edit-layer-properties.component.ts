import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";

import { InputLayerModel } from "src/app/models/admin/map/layer.model";
import { MapFacadeService } from "src/app/services/admin/map/map-facade.service";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { MapStatus } from "src/app/shared/constants/map-constants";
import {
  validationAllErrorMessagesService,
} from "src/app/services/utilities/validatorService";
import { ValidateMaxLength } from "src/app/shared/constants/consts/enum";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'app-map-detail-edit-layer-properties',
  templateUrl: './map-detail-edit-layer-properties.component.html',
  styleUrls: ['./map-detail-edit-layer-properties.component.scss']
})
export class MapDetailEditLayerPropertiesComponent implements OnInit {

  // public submitted = false;
  public obj: any;
  public editMode: boolean;
  public createForm: FormGroup;
  public Editor = ClassicEditor;
  public inputModel: InputLayerModel;

  // Map status
  public mapStatus = MapStatus;

  // List projection
  public listProjections: Object[];

  // Data Translate
  public dataTranslate: any;

  // error message
  validationErrorMessages = {
  };

  // form errors
  formErrors = {
    mapId: [""],
    guid: [""],
    mapOrder: [""],
    layerGroupId: [""],
    groupOrder: [""],
    layerType: [""],
    layerName: [""],
    layerTitle: [""],
    description: [""],
    opacity: [""],
    sourceId: [""],
    status: [""],
    siteId: [""],
    extentMinx: [""],
    extentMiny: [""],
    extentMaxx: [""],
    extentMaxy: [""],
    minResolution: [""],
    maxResolution: [""],
    baselayer: [""],
    fieldsInfo: [""],
    fieldsDisplay: [""],
    fieldsInfoFormat: [""],
    fieldsInfoTemplate: [""],
    moreSettings: [""],
    legendEnabled: [""],
    tocDisplay: [""],
    userId: [""],
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
      mapId: [],
      guid: [],
      mapOrder: [],
      layerGroupId: [],
      groupOrder: [],
      layerType: ["", Validators.maxLength(ValidateMaxLength.longText)],
      layerName: ["", Validators.maxLength(ValidateMaxLength.mediumText)],
      layerTitle: [],
      description: [],
      opacity: [],
      sourceId: [],
      status: [],
      siteId: [],
      extentMinx: [],
      extentMiny: [],
      extentMaxx: [],
      extentMaxy: [],
      minResolution: [],
      maxResolution: [],
      baselayer: [],
      fieldsInfo: ["", Validators.maxLength(ValidateMaxLength.longText)],
      fieldsDisplay: ["", Validators.maxLength(ValidateMaxLength.longText)],
      fieldsInfoFormat: ["", Validators.maxLength(ValidateMaxLength.mediumText)],
      fieldsInfoTemplate: [],
      moreSettings: [],
      legendEnabled: [],
      tocDisplay: [],
      userId: [],
    });

    // List projection
    this.listProjections = this.obj.listProjections;

    // When edit
    // Set form value from object
    if (this.obj.data !== undefined) {
      let newObj = this.commonService.mapObjectAndForm(this.obj.data, this.createForm);
      this.createForm.setValue({ ...newObj });
    }
  }

  // Update item
  public updateItem() {
    let item: any = this.createForm.value;
    item.name = item.layerTitle;
    this.matSidenavService.doParentFunction(
      "updateDisplayOptions",
      this.createForm.value
    );
  }

  // Hàm set biến validation từ data translate
  setValidation() {
    this.validationErrorMessages = {
      layerType: { maxlength: this.dataTranslate.COMMON.default.maxLength },
      layerName: {
        maxlength: this.dataTranslate.COMMON.default.maxLength
      },
      fieldsInfo: { maxlength: this.dataTranslate.COMMON.default.maxLength },
      fieldsDisplay: { maxlength: this.dataTranslate.COMMON.default.maxLength },
      fieldsInfoFormat: { maxlength: this.dataTranslate.COMMON.default.maxLength },
    };
  }

  // Submit form
  async onSubmit() {
    if (this.createForm.valid === false) {
      this.logAllValidationErrorMessages();
    } else {
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
