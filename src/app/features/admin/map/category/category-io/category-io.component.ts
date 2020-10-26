import { HttpErrorResponse } from "@angular/common/http";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

import { CategoryTypes } from "src/app/shared/constants/map-constants";
import { MapFacadeService } from "src/app/services/admin/map/map-facade.service";
import { InputProjectionModel } from "src/app/models/admin/map/projection.model";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import {
  validationAllErrorMessagesService,
} from "src/app/services/utilities/validatorService";
import { ValidateMaxLength } from "src/app/shared/constants/consts/enum";

@Component({
  selector: "app-category-io",
  templateUrl: "./category-io.component.html",
  styleUrls: ["./category-io.component.scss"],
})
export class CategoryIoComponent implements OnInit {
  // public submitted = false;
  public obj: any;
  public purpose: string;
  public editMode: boolean;
  public createForm: FormGroup;
  public inputModel: InputProjectionModel;

  // Contain all categories
  public categoriesInSelect: any[];

  // Category types
  // Show on select
  public categoryTypes = CategoryTypes;

  // Data translate
  public dataTranslate: any;

  // Error message
  validationErrorMessages = {};

  // form errors
  formErrors = {
    parentId: "",
    catType: "",
    catOrder: "",
    catName: "",
    slug: "",
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

    await this.setValidation();

  }

  // Hàm set validate
  setValidation() {
    this.validationErrorMessages = {
      catName: {
        maxlength: this.dataTranslate.COMMON.default.maxLength
      },
      slug: {
        maxlength: this.dataTranslate.COMMON.default.maxLength
      },

    };
  }

  // init FormControl
  formInit() {
    this.createForm = this.formBuilder.group({
      id: [],
      parentId: [],
      catType: [],
      catOrder: [],
      catName: ["", Validators.maxLength(ValidateMaxLength.longText)],
      slug: ["", Validators.maxLength(ValidateMaxLength.mediumText)],
    });

    // Set data
    this.categoriesInSelect = this.obj.categoriesInSelect;

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
    const itemService = this.mapFacadeService.getCategoryService();
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
          this.dataTranslate.MAP.category.notiAddSuccess,
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
          this.dataTranslate.MAP.category.notiEditSuccess,
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
