import { TranslateService } from "@ngx-translate/core";
import { Component, OnInit } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { FormBuilder, FormGroup } from "@angular/forms";

import { LayerGroupStatus } from "src/app/shared/constants/map-constants";
import { InputLayerGroupModel } from "src/app/models/admin/map/layer-group.model";
import { MapFacadeService } from "src/app/services/admin/map/map-facade.service";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { validationAllErrorMessagesService } from "src/app/services/utilities/validatorService";

@Component({
  selector: "app-map-detail-edit-layergroup-properties",
  templateUrl: "./map-detail-edit-layergroup-properties.component.html",
  styleUrls: ["./map-detail-edit-layergroup-properties.component.scss"],
})
export class MapDetailEditLayergroupPropertiesComponent implements OnInit {
  // public submitted = false;
  public obj: any;
  public purpose: string;
  public createForm: FormGroup;
  public inputModel: InputLayerGroupModel;

  // List status Show on select
  public layerGroupStatus = LayerGroupStatus;

  public groupIdAndGroupName: any[];

  // Data translate
  public dataTranslate: any;

  // Error message
  validationErrorMessages = {};

  // form errors
  formErrors = {
    guid: "",
    mapId: "",
    status: "",
    groupType: "",
    layerGroupId: "",
    layerGroupParentId: "",
    mapLayerGroupName: "",
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

  }

  // init FormControl
  formInit() {
    this.createForm = this.formBuilder.group({
      guid: [],
      mapId: [],
      status: [],
      groupType: [],
      layerGroupId: [],
      mapLayerGroupName: [],
      layerGroupParentId: [],
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

  // Add item
  public addItem(itemService) {
    itemService.addItem(this.inputModel).subscribe(
      () => this.matSidenavService.doParentFunction("getAllItems"),
      (error: HttpErrorResponse) => {
        this.commonService.showeNotiResult(error.message, 2000);
      },
      () =>
        this.commonService.showeNotiResult(
          this.dataTranslate.MAP.mapDetailAddNewGroup.addGroupLayerSuccess,
          2000
        )
    );
  }

  // Update item
  public updateItem() {
    let item: any = this.createForm.value;
    item.name = item.mapLayerGroupName;
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
