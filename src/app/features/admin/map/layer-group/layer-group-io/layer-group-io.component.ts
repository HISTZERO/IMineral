import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { TranslateService } from "@ngx-translate/core";

import { MapFacadeService } from "src/app/services/admin/map/map-facade.service";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { LayerGroupStatus } from "src/app/shared/constants/map-constants";
import { validationAllErrorMessagesService } from "src/app/services/utilities/validatorService";
import { InputLayerGroupModel } from "src/app/models/admin/map/layer-group.model";
import { ValidateMaxLength } from "src/app/shared/constants/consts/enum";

@Component({
  selector: "app-layer-group-io",
  templateUrl: "./layer-group-io.component.html",
  styleUrls: ["./layer-group-io.component.scss"],
})
export class LayerGroupIoComponent implements OnInit {
  // public submitted = false;
  public obj: any;
  public purpose: string;
  public editMode: boolean;
  public createForm: FormGroup;
  public Editor = ClassicEditor;
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
    groupKey: "",
    groupName: "",
    groupType: "",
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
    // Translate
    this.dataTranslate = await this.translate
      .getTranslation(this.translate.getDefaultLang())
      .toPromise();

    this.setValidation();
    this.groupIdAndGroupName = this.obj.groupIdAndGroupName;
    if (this.obj.data) {
      this.groupIdAndGroupName = this.groupIdAndGroupName.filter(
        (item) => item.id !== this.obj.data.id
      );
    }
  }

  // init FormControl
  formInit() {
    this.createForm = this.formBuilder.group({
      id: [],
      groupType: [0],
      description: [],
      groupKey: ["", [Validators.required, Validators.maxLength(ValidateMaxLength.mediumText)]],
      groupName: ["", [Validators.required, Validators.maxLength(ValidateMaxLength.mediumText)]],
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

  // Hàm set biến validation từ data translate
  setValidation() {
    this.validationErrorMessages = {
      groupKey: {
        required: this.dataTranslate.MAP.layerGroup.groupKeyRequired,
        maxlength: this.dataTranslate.COMMON.default.maxLength
      },
      groupName: {
        required: this.dataTranslate.MAP.layerGroup.groupNameRequired,
        maxlength: this.dataTranslate.COMMON.default.maxLength
      },
      status: { required: this.dataTranslate.MAP.layerGroup.statusRequired },
    };
  }

  // Add or update form
  private addOrUpdate() {
    this.inputModel = this.createForm.value;
    const itemService = this.mapFacadeService.getLayerGroupService();
    if (this.inputModel.id) {
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
          this.dataTranslate.MAP.layerGroup.notiAddSuccess,
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
          this.dataTranslate.MAP.layerGroup.notiEditSuccess,
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
