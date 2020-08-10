import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from "@angular/forms";
import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";

import { InputLayerModel } from "src/app/models/admin/map/layer.model";
import { MapFacadeService } from "src/app/services/admin/map/map-facade.service";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { MapStatus } from "src/app/shared/constants/map-constants";
import {
  validationAllErrorMessagesService,
} from "src/app/services/utilities/validatorService";

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

  // error message
  validationErrorMessages = {
  };

  // form errors
  formErrors = {
    mapId: [],
    guid: [],
    mapOrder: [],
    layerGroupId: [],
    groupOrder: [],
    layerType: [],
    layerName: [],
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
    fieldsInfo: [],
    fieldsDisplay: [],
    fieldsInfoFormat: [],
    fieldsInfoTemplate: [],
    moreSettings: [],
    legendEnabled: [],
    tocDisplay: [],
    userId: [],
  };

  constructor(
    private formBuilder: FormBuilder,
    public mapFacadeService: MapFacadeService,
    public commonService: CommonServiceShared,
    public matSidenavService: MatsidenavService,
  ) {
    this.matSidenavService.okCallBackFunction = null;
    this.matSidenavService.cancelCallBackFunction = null;
    this.matSidenavService.confirmStatus = null;
  }

  ngOnInit() {
    this.formInit();
  }

  // init FormControl
  formInit() {
    this.createForm = this.formBuilder.group({
      mapId: [],
      guid: [],
      mapOrder: [],
      layerGroupId: [],
      groupOrder: [],
      layerType: [],
      layerName: [],
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
      fieldsInfo: [],
      fieldsDisplay: [],
      fieldsInfoFormat: [],
      fieldsInfoTemplate: [],
      moreSettings: [],
      legendEnabled: [],
      tocDisplay: [],
      userId: []
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
