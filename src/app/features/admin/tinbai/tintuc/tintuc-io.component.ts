import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit, Input } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { TranslateService } from "@ngx-translate/core";

import { TinbaiFacadeService } from "src/app/services/admin/tinbai/tinbai-facade.service";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { validationAllErrorMessagesService } from "src/app/services/utilities/validatorService";
import { InputTintucModel } from "src/app/models/admin/tinbai/tintuc.model";
import { OutputTintucModel } from "src/app/models/admin/tinbai/tintuc.model";
import { AdminRoutingName } from "src/app/routes/admin-routes-name";
import { Router } from "@angular/router";
import { ActivatedRoute } from "@angular/router";
import { CategoryIds } from "src/app/shared/constants/tinbai-constants";
import { translateConstants } from "src/app/shared/constants/translate-constants";

@Component({
  selector: "app-tintuc-io",
  templateUrl: "./tintuc-io.component.html",
  styleUrls: ["./tintuc-io.component.scss"],
})
export class TintucIoComponent implements OnInit {
  // public submitted = false;
  public obj: any;
  public editMode: boolean;
  public createForm: FormGroup;
  public Editor = ClassicEditor;
  public inputModel: InputTintucModel;

  // Tin Tuc id
  private tinTucId: number;

  // List category Id Show on select
  public listCatId = CategoryIds;

  // Item
  public selectedItem: InputTintucModel;
  public listItems: OutputTintucModel[];

  // Biến lưu tên người dùng nhập
  public inputCatNameText: any;

  // Biến lưu slug gợi ý
  public outputSlugText: string;

  // Các biến translate
  dataTranslate: any;

  // Error message
  validationErrorMessages = {};

  // form errors
  formErrors = {
    author: "",
    title: "",
    content: "",
    slug: "",
    categoryId: "",
  };
  constructor(
    public router: Router,
    private route: ActivatedRoute,
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
    // lấy id của tin tức từ url
    this.tinTucId = parseInt(this.route.snapshot.paramMap.get("id"));
    // khởi tạo form
    await this.formInit();

    // Lấy ra biến translate của hệ thống
    this.dataTranslate = await this.translate
      .getTranslation(this.translate.getDefaultLang())
      .toPromise();
    await this.setValidation();
  }

  setValidation() {
    this.validationErrorMessages = {
      author: { required: this.dataTranslate.TINBAI.tintuc.authorRequired },
      title: { required: this.dataTranslate.TINBAI.tintuc.titleRequired },
      content: { required: this.dataTranslate.TINBAI.tintuc.contentRequired },
      slug: { required: this.dataTranslate.TINBAI.tintuc.slugRequired },
      categoryId: {
        required: this.dataTranslate.TINBAI.tintuc.categoryIdRequired,
      },
    };
  }

  // init FormControl
  formInit() {
    this.createForm = this.formBuilder.group({
      id: [],
      author: ["", Validators.required],
      title: ["", Validators.required],
      seoTitle: [""],
      slug: ["", Validators.required],
      image: [""],
      categoryId: ["", Validators.required],
      content: ["", Validators.required],
    });

    // When edit
    // Set form value from object
    if (this.tinTucId !== undefined) {
      this.getTinTucById();
    }
  }

  // Lấy tin tức theo id từ url và bind vào form
  getTinTucById() {
    this.tbFacadeService
      .getTbTintucService()
      .getByid(this.tinTucId)
      .subscribe((res) => {
        this.obj = res;
        let newObj = this.commonService.mapObjectAndForm(
          this.obj,
          this.createForm
        );
        this.createForm.setValue({ ...newObj });
      });
  }

  // Add or update form
  private addOrUpdate() {
    this.inputModel = this.createForm.value;
    // // loai bo <p></p> trong content
    // this.inputModel.content = this.inputModel.content.slice(
    //   3,
    //   this.inputModel.content.length - 4
    // );
    const itemService = this.tbFacadeService.getTbTintucService();
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
      () => this.matSidenavService.doParentFunction("getAllTintuc"),
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
      (res) => this.matSidenavService.doParentFunction("getAllTintuc"),
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
      this.closeTinTucIoPage();
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
  // Hàm đóng page TinTucIo điều hướng về trang tin tức
  public closeTinTucIoPage() {
    const lstName = AdminRoutingName;
    this.router.navigate([
      `${lstName.adminUri}/${lstName.tinbaiUri}/${lstName.tinTuc}`,
    ]);
  }

  // Hàm gợi ý Slug khi nhập tên chủ đề
  translateSlug() {
    this.inputCatNameText = this.createForm.get("title").value;
    this.outputSlugText = this.convertNameToSlug(this.inputCatNameText);
    this.createForm.get("slug").setValue(this.outputSlugText);
  }

  // Hàm convert name thành slug
  public convertNameToSlug(name) {
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
}
