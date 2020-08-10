import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { TranslateService } from "@ngx-translate/core";

import { TinbaiFacadeService } from "src/app/services/admin/tinbai/tinbai-facade.service";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import {
  validationAllErrorMessagesService,
  validationErrorMessagesService,
} from "src/app/services/utilities/validatorService";
import { InputChudeModel } from "src/app/models/admin/tinbai/chude.model";
import { CatTypes, ParentIds } from "src/app/shared/constants/tinbai-constants";
import { translateConstants } from "src/app/shared/constants/translate-constants";

@Component({
  selector: "app-chude-io",
  templateUrl: "./chude-io.component.html",
  styleUrls: ["./chude-io.component.scss"],
})
export class ChudeIoComponent implements OnInit {
  // public submitted = false;
  public obj: any;
  public purpose: string;
  public editMode: boolean;
  public createForm: FormGroup;
  public Editor = ClassicEditor;
  public inputModel: InputChudeModel;

  // Biến lưu tên người dùng nhập
  public inputCatNameText: any;

  // Biến lưu slug gợi ý
  public outputSlugText: string;

  // List catType, ParentId Show on select
  public listCatType = CatTypes;
  public listParentId = ParentIds;

  // Các biến translate
  dataTranslate: any;

  // Error message
  validationErrorMessages = {};

  // form errors
  formErrors = {
    parentId: "",
    catType: "",
    catName: "",
    slug: "",
  };

  constructor(
    private formBuilder: FormBuilder,
    public tbFacadeService: TinbaiFacadeService,
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

    // Lấy ra biến translate của hệ thống
    this.dataTranslate = await this.translate
      .getTranslation(this.translate.getDefaultLang())
      .toPromise();
    await this.setValidation();
  }

  setValidation() {
    this.validationErrorMessages = {
      parentId: {
        required: this.dataTranslate.TINBAI.chude.parentIdRequired,
      },
      catType: { required: this.dataTranslate.TINBAI.chude.catTYpeRequired },
      catName: { required: this.dataTranslate.TINBAI.chude.catNameRequired },
      slug: { required: this.dataTranslate.TINBAI.chude.slugRequired },
    };
  }

  // init FormControl
  formInit() {
    this.createForm = this.formBuilder.group({
      id: [],
      parentId: ["", Validators.required],
      catType: ["", Validators.required],
      slug: ["", Validators.required],
      catName: ["", Validators.required],
    });

    // When edit
    // Set form value from object
    if (this.obj !== undefined) {
      let newObj = this.commonService.mapObjectAndForm(
        this.obj,
        this.createForm
      );
      this.createForm.setValue({ ...newObj });
    }
  }

  // Add or update form
  private addOrUpdate() {
    this.inputModel = this.createForm.value;
    const itemService = this.tbFacadeService.getTbChudeService();
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
      () => this.matSidenavService.doParentFunction("getAllChude"),
      (error: HttpErrorResponse) => {
        this.commonService.showeNotiResult(error.message, 2000);
      },
      () =>
        this.commonService.showeNotiResult(
          this.dataTranslate.COMMON.default.successAdd,
          2000
        )
    );
  }

  // Update item
  public updateItem(itemService) {
    itemService.updateItem(this.inputModel).subscribe(
      (res) => this.matSidenavService.doParentFunction("getAllChude"),
      (error: HttpErrorResponse) => {
        this.commonService.showeNotiResult(error.message, 2000);
      },
      () =>
        this.commonService.showeNotiResult(
          this.dataTranslate.COMMON.default.successEdit,
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

  // Hàm gợi ý Slug khi nhập tên chủ đề
  translateSlug() {
    this.inputCatNameText = this.createForm.get("catName").value;
    this.outputSlugText = this.convertNameToSlug(this.inputCatNameText);
    this.createForm.get("slug").setValue(this.outputSlugText);
  }

  // Hàm convert name thành slug
  public convertNameToSlug(name: string) {
    const slug = this.removeAccents(name.toLowerCase().trim()).replace(
      / /g,
      "-"
    );
    return slug;
  }

  // Hàm bỏ dấu tiếng việt
  public removeAccents(str) {
    var AccentsMap = [
      "aàảãáạăằẳẵắặâầẩẫấậ",
      "AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬ",
      "dđ",
      "DĐ",
      "eèẻẽéẹêềểễếệ",
      "EÈẺẼÉẸÊỀỂỄẾỆ",
      "iìỉĩíị",
      "IÌỈĨÍỊ",
      "oòỏõóọôồổỗốộơờởỡớợ",
      "OÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢ",
      "uùủũúụưừửữứự",
      "UÙỦŨÚỤƯỪỬỮỨỰ",
      "yỳỷỹýỵ",
      "YỲỶỸÝỴ",
    ];
    for (var i = 0; i < AccentsMap.length; i++) {
      var re = new RegExp("[" + AccentsMap[i].substr(1) + "]", "g");
      var char = AccentsMap[i][0];
      str = str.replace(re, char);
    }
    return str;
  }

  public closeIOSidebar() {
    this.matSidenavService.close();
  }
}
