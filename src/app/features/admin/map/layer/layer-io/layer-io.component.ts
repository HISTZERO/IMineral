import { HttpErrorResponse } from "@angular/common/http";
import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";
import { TranslateService } from "@ngx-translate/core";

import { InputLayerModel } from "src/app/models/admin/map/layer.model";
import { MapFacadeService } from "src/app/services/admin/map/map-facade.service";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { ThuvienComponent } from "src/app/features/admin/thuvien/thuvien.component";
import {
  LayerTypes,
  LayerStatus,
} from "src/app/shared/constants/map-constants";
import {
  validationAllErrorMessagesService,
} from "src/app/services/utilities/validatorService";
import { MatdialogService } from "src/app/services/utilities/matdialog.service";

@Component({
  selector: "app-layer-io",
  templateUrl: "./layer-io.component.html",
  styleUrls: ["./layer-io.component.scss"],
})
export class LayerIoComponent implements OnInit {
  public purpose: string;
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

  // Data Translate
  public dataTranslate: any;

  // error message
  validationErrorMessages = {};

  // form errors
  formErrors = {
    layerType: "",
    projectionId: "",
    layerName: "",
    bingKey: "",
    bingImageryset: "",
    mapquestLayer: "",
    wmsServertype: "",
    wmsUrl: "",
    wmsInfoUrl: "",
    wmsLayers: "",
    wmsTiled: "",
    wmsVersion: "",
    wfsUrl: "",
    wfsTypename: "",
    featureInfoTemplate: "",
    wfsVersion: "",
    gpxFilename: "",
    kmlFilename: "",
    postgisSchema: "",
    postgisHost: "",
    postgisPort: "",
    postgisUser: "",
    postgisPass: "",
    postgisDbname: "",
    postgisTable: "",
    postgisField: "",
    postgisAttributes: "",
    geojsonGeomtype: "",
    geojsonAttributes: "",
    geojsonFeatures: "",
    sourceUrl: "",
    shapefileFilename: "",
    shapefileGeomtype: "",
    shapefileWmsurl: "",
    shapefileMsclass: "",
    geopackageFilename: "",
    geopackageTable: "",
    geopackageFields: "",
    hasz: "",
    copyright: "",
    moreSettings: "",
    description: "",
    layerTitle: "",
    opacity: "",
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
    await this.formInit();

    // Lấy dữ liệu biến translate để gán vào các biến trong component
    this.dataTranslate = await this.translate
      .getTranslation(this.translate.getDefaultLang())
      .toPromise();

    this.setValidation();
  }

  // init FormControl
  formInit() {
    this.createForm = this.formBuilder.group({
      id: [],
      layerType: ["", Validators.required],
      projectionId: [""],
      layerName: ["", Validators.required],
      bingKey: [],
      bingImageryset: [],
      mapquestLayer: [],
      wmsServertype: [],
      wmsUrl: [],
      wmsInfoUrl: [],
      wmsLayers: [],
      wmsTiled: [],
      wmsVersion: [],
      wfsUrl: [],
      wfsTypename: [],
      featureInfoTemplate: [],
      wfsVersion: [],
      gpxFilename: [],
      kmlFilename: [],
      postgisSchema: [],
      postgisHost: [],
      postgisPort: [],
      postgisUser: [],
      postgisPass: [],
      postgisDbname: [],
      postgisTable: [],
      postgisField: [],
      sourceUrl: [],
      postgisAttributes: [],
      geojsonGeomtype: [],
      geojsonAttributes: [],
      geojsonFeatures: [],
      shapefileFilename: [],
      shapefileGeomtype: [],
      shapefileWmsurl: [],
      shapefileMsclass: [],
      geopackageFilename: [],
      geopackageTable: [],
      geopackageFields: [],
      hasz: [""],
      copyright: [""],
      moreSettings: [""],
      description: [""],
      layerTitle: [""],
      opacity: [""],
      status: [""],
      extentMinx: [""],
      extentMiny: [""],
      extentMaxx: [""],
      extentMaxy: [""],
      minResolution: [""],
      maxResolution: [""],
      fieldsInfo: [""],
      fieldsDisplay: [""],
      fieldsInfoFormat: [""],
      fieldsInfoTemplate: [""],
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
      layerType: { required: this.dataTranslate.MAP.layer.layerTypeRequired },
      layerName: { required: this.dataTranslate.MAP.layer.layerNameRequired },
    };
  }

  // Add or update form
  private addOrUpdate() {
    this.inputModel = this.createForm.value;
    const itemService = this.mapFacadeService.getLayerService();
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
          this.dataTranslate.MAP.layer.notiAddSuccess,
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
          this.dataTranslate.MAP.layer.notiEditSuccess,
          2000
        )
    );
  }

  // Những biến dành cho phần file
  public mDialog: any;
  public srcanh = "";
  public fileArray: any;

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
      "simpleFileV2",
      "75%"
    );
    this.mDialog.open();
  }

  /**
   * Hiển thị những file select trong thư viện
   */
  showFileSelect() {
    this.fileArray = this.mDialog.dataResult;
    this.createForm.patchValue({ sourceUrl: this.fileArray[0].link });
  }

  /**
   *  Hàm gọi từ function con gọi vào chạy function cha
   * @param methodName
   */
  doFunction(methodName) {
    this[methodName]();
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
