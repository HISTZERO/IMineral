import { v4 as uuidv4 } from "uuid";
import { Component, OnInit } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { TranslateService } from "@ngx-translate/core";

import { MapFacadeService } from "src/app/services/admin/map/map-facade.service";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { LayerGroupStatus } from "src/app/shared/constants/map-constants";
import { validationAllErrorMessagesService } from "src/app/services/utilities/validatorService";
import { InputLayerGroupModel } from "src/app/models/admin/map/layer-group.model";

@Component({
  selector: "app-map-detail-add-new-group-io",
  templateUrl: "./map-detail-add-new-group-io.component.html",
  styleUrls: ["./map-detail-add-new-group-io.component.scss"],
})
export class MapDetailAddNewGroupIoComponent implements OnInit {
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

    // Lấy dữ liệu biến translate để gán vào các biến trong component
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
      groupType: [1],
      description: [],
      groupKey: ["", Validators.required],
      groupName: ["", Validators.required],
      status: ["", Validators.required],
    });
  }

  // Hàm set biến validation từ data translate
  setValidation() {
    this.validationErrorMessages = {
      groupKey: {
        required: this.dataTranslate.MAP.mapDetailAddNewGroup
          .groupKeyRequired,
      },
      groupName: {
        required: this.dataTranslate.MAP.mapDetailAddNewGroup
          .groupNameRequired,
      },
      status: {
        required: this.dataTranslate.MAP.mapDetailAddNewGroup.statusRequired,
      },
    };
  }

  // Add item
  public addItem() {
    // Item service
    let itemService: any = this.mapFacadeService.getLayerGroupService();

    // Lưu
    itemService.addItem(this.createForm.value).subscribe(
      async (res) => {
        // Lưu thành công
        if (res.id) {
          // Gán thuộc tính
          let groupLayer: any = {};
          groupLayer.id = res.id;
          groupLayer.status = res.status;
          groupLayer.mapLayerGroupName = res.groupName;
          groupLayer.guid = uuidv4().toUpperCase();
          groupLayer.name = res.groupName;
          groupLayer.groupType = res.groupType;
          groupLayer.childs = [];

          // Nếu không chọn group cha
          if (this.obj.parentItem.id === null) {
            this.obj.listItems.push(groupLayer);
          } else {
            await this.recursiveAddItem(
              this.obj.listItems,
              this.obj.parentItem,
              groupLayer
            );
          }

          await this.matSidenavService.doParentFunction(
            "updateListItems",
            this.obj.listItems
          );
          await this.matSidenavService.close();
        }
      },
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

  /**
   * Hàm đệ quy xử lý việc thêm nhóm lớp vào nhóm lớp
   * @param listItems Lớp và nhóm lớp dạng tree
   * @param parentItem Nhóm lớp cha
   */
  recursiveAddItem(listItems, parentItem, groupLayer) {
    listItems.map((item) => {
      if (item.id === parentItem.id) {
        listItems.push(groupLayer);
      } else if (item.childs) {
        this.recursiveAddItem(item.childs, parentItem, groupLayer);
      }
    });
  }

  // Submit form
  async onSubmit() {
    if (this.createForm.valid === false) {
      this.logAllValidationErrorMessages();
    } else {
      this.addItem();
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
