import { HttpErrorResponse } from "@angular/common/http";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { TranslateService } from "@ngx-translate/core";

import { InputMapModel } from "src/app/models/admin/map/map.model";
import { MapUnits, MapStatus, Widgets, WidgetPositions } from "src/app/shared/constants/map-constants";
import { MapFacadeService } from "src/app/services/admin/map/map-facade.service";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import {
  validationAllErrorMessagesService,
} from "src/app/services/utilities/validatorService";
import { MatDialog } from "@angular/material/dialog";
import { MatdialogService } from "src/app/services/utilities/matdialog.service";
import { ThuvienComponent } from "src/app/features/admin/thuvien/thuvien.component";
import { OutputCategoryModel } from "src/app/models/admin/map/category.model";
import { ValidateMaxLength } from "src/app/shared/constants/consts/enum";

@Component({
  selector: "app-map-io",
  templateUrl: "./map-io.component.html",
  styleUrls: ["./map-io.component.scss"],
})
export class MapIoComponent implements OnInit {
  // public submitted = false;
  public obj: any;
  public purpose: string;
  public editMode: boolean;
  public createForm: FormGroup;
  public Editor = ClassicEditor;
  public inputModel: InputMapModel;

  // List map status and units
  // Show on select
  public mapUnits = MapUnits;
  public mapStatus = MapStatus;
  public widgetItems = Widgets;
  public selectedSlugs: any[] = [];
  public widgetPositions = WidgetPositions;

  // Những biến dành cho phần file
  mDialog: any;
  srcanh = "";
  public fileArray: any;

  // List projection
  // public listProjections: Object[] = [];
  public listProjections: any;

  // List categories
  public categories: OutputCategoryModel[];

  // Data translate
  public dataTranslate: any;

  // Default widget 
  public defaultWidgets: any[] = [
    {
      slug: '',
      position: ''
    }
  ]

  // Error message
  validationErrorMessages = {};

  // form errors
  formErrors = {
    objKey: "",
    mapTitle: "",
    categories: "",
    mapSlug: "",
    mapAbstract: "",
    extentMinx: "",
    extentMiny: "",
    extentMaxx: "",
    extentMaxy: "",
    center: "",
    unit: "",
    sizeX: "",
    sizeY: "",
    projectionId: "",
    webMinscale: "",
    webMaxscale: "",
    zoomLevel: "",
    refImageLink: "",
    status: "",
    treelayer: "",
  };

  constructor(
    private formBuilder: FormBuilder,
    public mapFacadeService: MapFacadeService,
    public commonService: CommonServiceShared,
    public matSidenavService: MatsidenavService,
    private imDialog: MatDialog,
    imDialogService: MatdialogService,
    private translate: TranslateService
  ) {
    this.matSidenavService.okCallBackFunction = null;
    this.matSidenavService.cancelCallBackFunction = null;
    this.matSidenavService.confirmStatus = null;
    this.mDialog = imDialogService;
    this.mDialog.initDialg(imDialog);

  }

  async ngOnInit() {

    // Widgets
    if (this.obj.data && this.obj.data.widgets) {
      this.defaultWidgets = JSON.parse(this.obj.data.widgets.replace(/\\\"/g, '"'));
      this.selectedSlugs = this.defaultWidgets
        .map(widget => widget.slug)
        .filter(slug => slug !== null);
    }

    // Tạo mới form
    await this.formInit();

    // Translate
    this.dataTranslate = await this.translate
      .getTranslation(this.translate.getDefaultLang())
      .toPromise();

    this.setValidation();
    this.categories = this.obj.categories;
    this.listProjections = this.obj.listProjections;
  }

  // Hàm set biến validation từ data translate
  setValidation() {
    this.validationErrorMessages = {
      categories: { required: this.dataTranslate.MAP.map.categoriesRequired },
      mapTitle: { maxlength: this.dataTranslate.COMMON.default.maxLength },
      mapSlug: { maxlength: this.dataTranslate.COMMON.default.maxLength },
      center: { maxlength: this.dataTranslate.COMMON.default.maxLength },
      unit: { maxlength: this.dataTranslate.COMMON.default.maxLength },
      sizeX: { maxlength: this.dataTranslate.COMMON.default.maxLength },
      sizeY: { maxlength: this.dataTranslate.COMMON.default.maxLength }
    };
  }

  removeWidget(index: number) {
    this.defaultWidgets.splice(index, 1);
    this.selectedSlugs = this.defaultWidgets
      .map(widget => widget.slug)
      .filter(slug => slug !== null);
  }

  addNewWidget() {
    this.defaultWidgets.push({
      slug: '',
      position: ''
    });
  }

  selectedWidget(args: any, index: number) {
    this.defaultWidgets[index].slug = args.value;
    this.selectedSlugs = this.defaultWidgets
      .map(widget => widget.slug)
      .filter(slug => slug !== null);
  }

  selectedPosition(args: any, index: number) {
    this.defaultWidgets[index].position = args.value;
  }

  compareFn(item1, item2) {
    return item1 && item2 ? item1 === item2.id : item1 === item2;
  }

  compareData(item1, item2) {
    return item1 && item2 && (item1 === item2.slug || item1 === item2.position);
  }

  // init FormControl
  formInit() {
    this.createForm = this.formBuilder.group({
      id: [],
      categories: ["", Validators.required],
      objKey: [],
      mapTitle: ["", Validators.maxLength(ValidateMaxLength.mediumText)],
      mapSlug: ["", Validators.maxLength(ValidateMaxLength.mediumText)],
      mapAbstract: [],
      extentMinx: [],
      extentMiny: [],
      extentMaxx: [],
      extentMaxy: [],
      center: ["", Validators.maxLength(ValidateMaxLength.mediumText)],
      unit: ["", Validators.maxLength(ValidateMaxLength.mediumText)],
      sizeX: ["", Validators.maxLength(ValidateMaxLength.mediumText)],
      sizeY: ["", Validators.maxLength(ValidateMaxLength.mediumText)],
      projectionId: [],
      webMinscale: [],
      webMaxscale: [],
      zoomLevel: [],
      refImageLink: [],
      status: [],
      treelayer: [],
    });

    // When edit
    // Set form value from object
    if (this.obj.data !== undefined) {
      let newObj = this.commonService.mapObjectAndForm(
        this.obj.data,
        this.createForm
      );
      this.createForm.setValue({ ...newObj });
      this.srcanh = this.obj.data.refImageLink;
    }
  }

  // Add or update form
  private addOrUpdate() {
    this.inputModel = this.createForm.value;
    this.inputModel.refImageLink = this.srcanh;
    const itemService = this.mapFacadeService.getMapService();
    if (this.inputModel.id !== null) {
      this.updateItem(itemService);
    } else {
      delete this.inputModel.id;
      this.addItem(itemService);
    }
  }

  public getCategoryIds(categories) {
    return categories
      .map((cat) => {
        return cat.id ? cat.id : cat;
      })
      .join(",");
  }

  // Add item
  public addItem(itemService) {

    // Set category ids
    this.inputModel.categories = this.getCategoryIds(
      this.inputModel.categories
    );

    // Widgets
    this.inputModel.widgets = JSON.stringify(this.defaultWidgets)
      .replace(/\"/g, '\\"');

    itemService.addItem(this.inputModel).subscribe(
      () => this.matSidenavService.doParentFunction("getAllItems"),
      (error: HttpErrorResponse) => {
        this.commonService.showeNotiResult(error.message, 2000);
      },
      () =>
        this.commonService.showeNotiResult(
          this.dataTranslate.MAP.map.notiAddSuccess,
          2000
        )
    );
  }

  // Update item
  public updateItem(itemService) {

    // Set category ids
    this.inputModel.categories = this.getCategoryIds(
      this.inputModel.categories
    );

    // Widgets
    this.inputModel.widgets = JSON.stringify(this.defaultWidgets)
      .replace(/\"/g, '\\"');

    itemService.updateItem(this.inputModel).subscribe(
      (res) => this.matSidenavService.doParentFunction("getAllItems"),
      (error: HttpErrorResponse) => {
        this.commonService.showeNotiResult(error.message, 2000);
      },
      () =>
        this.commonService.showeNotiResult(
          this.dataTranslate.MAP.map.notiEditSuccess,
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

  /**
   * Hàm đóng mat dialog
   */
  closeMatDialog() {
    this.imDialog.closeAll();
  }

  /**
   * Hàm mở thư viện dialog
   */
  public showMatDialog() {
    this.mDialog.setDialog(
      this,
      ThuvienComponent,
      "showFileSelect",
      "closeMatDialog",
      "simpleFileV1",
      "75%"
    );
    this.mDialog.open();
  }

  /**
   * Hiển thị những file select trong thư viện
   */
  showFileSelect() {
    this.fileArray = this.mDialog.dataResult;
    this.srcanh = this.fileArray[0].link;
  }

  /**
   * Xóa ảnh hiện có
   */
  deleteAnh() {
    this.srcanh = "";
  }

  /**
   * Hiển thị thông tin ảnh
   */
  showPreviewImage() {
    window.open(this.srcanh, "_blank");
  }

  /**
   *  Hàm gọi từ function con gọi vào chạy function cha
   * @param methodName
   */
  doFunction(methodName) {
    this[methodName]();
  }
}
