import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpErrorResponse } from "@angular/common/http";
import { MatSnackBar } from "@angular/material/snack-bar";
import { DmFacadeService } from "src/app/services/admin/danhmuc/danhmuc-facade.service";
import { TranslateService } from "@ngx-translate/core";

import { validationAllErrorMessagesService } from "src/app/services/utilities/validatorService";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { MatDialog } from "@angular/material/dialog";
import { MatdialogService } from "src/app/services/utilities/matdialog.service";
import { InputThietbiquantracModel } from "src/app/models/admin/danhmuc/thietbiquantrac.model";
import { translateConstants } from "src/app/shared/constants/translate-constants";

@Component({
  selector: "app-thietbiquantrac-io",
  templateUrl: "./thietbiquantrac-io.component.html",
  styleUrls: ["./thietbiquantrac-io.component.scss"],
})
export class DmThietbiquantracIoComponent implements OnInit {
  thietbiquantracIOForm: FormGroup;
  public obj: any;
  public purpose: string;
  public editMode: boolean;
  public inputModel: InputThietbiquantracModel;
  public model: any;
  // Những biến dành cho phần file
  mDialog: any;
  public fileArray: any;

  // Các biến translate
  dataTranslate: any;

  // error message
  validationErrorMessages = {};

  // form errors
  formErrors = {
    ten: "",
  };

  constructor(
    public matSidenavService: MatsidenavService,
    public dmFacadeService: DmFacadeService,
    private formBuilder: FormBuilder,
    // tslint:disable-next-line:variable-name
    private _snackBar: MatSnackBar,
    public commonService: CommonServiceShared,
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
    await this.bindingConfigAddOrUpdate();

    // Lấy ra biến translate của hệ thống
    this.dataTranslate = await this.translate
      .getTranslation(this.translate.getDefaultLang())
      .toPromise();
    await this.setValidation();
  }

  setValidation() {
    this.validationErrorMessages = {
      ten: {
        required: this.dataTranslate.DANHMUC.thamso.tenthamsoRequired,
      },
    };
  }

  bindingConfigAddOrUpdate() {
    this.editMode = false;
    this.inputModel = new InputThietbiquantracModel();
    // check edit
    this.formOnEdit();
  }

  // init FormControl
  formInit() {
    this.thietbiquantracIOForm = this.formBuilder.group({
      ten: ["", Validators.required],
      hangsanxuat: [""],
      model: [""],
      phuongphapqt: [""],
    });
  }

  // init edit form
  formOnEdit() {
    if (this.obj) {
      this.thietbiquantracIOForm.setValue({
        ten: this.obj.ten,
        hangsanxuat: this.obj.hangsanxuat,
        model: this.obj.model,
        phuongphapqt: this.obj.phuongphapqt,
      });
    }
    this.editMode = true;
  }
  // add or update form
  private addOrUpdate(operMode: string) {
    const dmFacadeService = this.dmFacadeService.getDmThietbiquantracService();
    this.inputModel = this.thietbiquantracIOForm.value;
    if (operMode === "new") {
      dmFacadeService.addItem(this.inputModel).subscribe(
        (res) =>
          this.matSidenavService.doParentFunction("getAllThietbiquantrac"),
        (error: HttpErrorResponse) => {
          this.commonService.showError(error);
        },
        () =>
          this.commonService.showeNotiResult(
            this.dataTranslate.COMMON.default.successAdd,
            2000
          )
      );
    } else if (operMode === "edit") {
      const id: number = this.obj.id;
      this.inputModel.id = id;
      dmFacadeService.updateItem(this.inputModel).subscribe(
        (res) =>
          this.matSidenavService.doParentFunction("getAllThietbiquantrac"),
        (error: HttpErrorResponse) => {
          this.commonService.showError(error);
        },
        () =>
          this.commonService.showeNotiResult(
            this.dataTranslate.COMMON.default.successEdit,
            2000
          )
      );
    }
  }

  // Hàm được gọi khi nhấn nút Lưu, Truyền vào operMode để biết là Edit hay tạo mới
  async onSubmit(operMode: string) {
    this.logAllValidationErrorMessages();
    if (this.thietbiquantracIOForm.valid === true) {
      this.addOrUpdate(operMode);
      this.matSidenavService.close();
    }
  }

  // Hàm reset form, gọi khi nhấn nút reset dữ liệu
  public onFormReset() {
    // Hàm .reset sẽ xóa trắng mọi control trên form
    this.thietbiquantracIOForm.reset();
    // Trong trường hợp mong muốn reset một số trường về giá trị mặc định thì dùng .patchValue
    // https://angular.io/guide/reactive-forms#patching-the-model-value
  }

  // Hàm lưu và reset form để tiếp tục nhập mới dữ liệu. Trường hợp này khi người dùng muốn nhập dữ liệu liên tục
  async onContinueAdd(operMode: string) {
    this.logAllValidationErrorMessages();
    if (this.thietbiquantracIOForm.valid === true) {
      this.addOrUpdate(operMode);
      this.onFormReset();
      this.purpose = "new";
    }
  }

  // Validation click submit
  public logAllValidationErrorMessages() {
    validationAllErrorMessagesService(
      this.thietbiquantracIOForm,
      this.validationErrorMessages,
      this.formErrors
    );
  }

  public closeThietbiquantracIOSidebar() {
    this.matSidenavService.close();
  }

  /**
   * Hàm đóng mat dialog
   */
  closeMatDialog() {
    this.imDialog.closeAll();
  }

  /**
   *  Hàm gọi từ function con gọi vào chạy function cha
   * @param methodName
   */
  doFunction(methodName) {
    this[methodName]();
  }
}
