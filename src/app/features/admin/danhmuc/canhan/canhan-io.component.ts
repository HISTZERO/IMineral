import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { HttpErrorResponse } from "@angular/common/http";
import { TranslateService } from "@ngx-translate/core";
import { MatDialog } from "@angular/material/dialog";

import { InputCanhanModel } from "src/app/models/admin/danhmuc/canhan.model";
import { OutputDvhcModel } from "src/app/models/admin/danhmuc/dvhc.model";
import { loaigiayto } from "src/app/shared/constants/enum";
import { DmFacadeService } from "src/app/services/admin/danhmuc/danhmuc-facade.service";
import {
  validationAllErrorMessagesService,
} from "src/app/services/utilities/validatorService";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { ThuvienComponent } from "src/app/features/admin/thuvien/thuvien.component";
import { MatdialogService } from "src/app/services/utilities/matdialog.service";
@Component({
  selector: "app-canhan-io",
  templateUrl: "./canhan-io.component.html",
  styleUrls: ["./canhan-io.component.scss"],
})
export class DmCanhanIoComponent implements OnInit {
  canhanIOForm: FormGroup;
  public obj: any;
  public purpose: string;
  public editMode: boolean;
  public inputModel: InputCanhanModel;
  public allTinhData: any;
  public allTinh: any;
  public allHuyen: any;
  public allXa: any;
  public model: any;
  // Những biến dành cho phần file
  mDialog: any;
  srcanh = "";
  public fileArray: any;
  // filter Đơn vị hành chính
  public dvhcProvinceFilters: OutputDvhcModel[];
  public dvhcDistrictFilters: OutputDvhcModel[];
  public dvhcWardFilters: OutputDvhcModel[];
  // loại giấy tờ CMND/hộ chiếu
  public loaigiayto = loaigiayto;

  // Các biến translate
  dataTranslate: any;

  // error message
  validationErrorMessages = {};

  // form errors
  formErrors = {
    hovaten: "",
    sodienthoai: "",
    matinh: "",
    mahuyen: "",
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
  // Hàm set validate
  setValidation() {
    this.validationErrorMessages = {
      hovaten: { required: this.dataTranslate.DANHMUC.canhan.hovatenRequired },
      sodienthoai: {
        pattern: this.dataTranslate.DANHMUC.canhan.sodienthoaiPattern,
      },
      matinh: { required: this.dataTranslate.DANHMUC.canhan.matinhRequired },
      mahuyen: { required: this.dataTranslate.DANHMUC.canhan.mahuyenRequired },
    };
  }

  bindingConfigAddOrUpdate() {
    this.showDvhcTinh();
    this.editMode = false;
    this.inputModel = new InputCanhanModel();
    // check edit
    this.formOnEdit();
  }

  // init FormControl
  formInit() {
    this.canhanIOForm = this.formBuilder.group({
      hovaten: ["", Validators.required],
      diachi: [""],
      matinh: ["", Validators.required],
      mahuyen: ["", Validators.required],
      maxa: [""],
      sodienthoai: ["", Validators.pattern("^[0-9-+]+$")],
      loaigiayto: [""],
      socmthochieu: [""],
      email: [""],
      note: [""],
      imgLink: [""],
    });
  }

  // init edit form
  formOnEdit() {
    if (this.obj) {
      this.canhanIOForm.setValue({
        hovaten: this.obj.hovaten,
        diachi: this.obj.diachi,
        matinh: this.obj.matinh,
        mahuyen: this.obj.mahuyen,
        maxa: this.obj.maxa,
        sodienthoai: this.obj.sodienthoai,
        loaigiayto: this.obj.loaigiayto,
        socmthochieu: this.obj.socmthochieu,
        email: this.obj.email,
        note: this.obj.note,
        imgLink: this.obj.imgLink,
      });
      this.srcanh = this.obj.imgLink;
      this.showDvhcHuyen();
      this.showDvhcXa();
    }
    this.editMode = true;
  }

  // Các hàm get đơn vị hành chính
  async showDvhcTinh() {
    this.allTinhData = await this.dmFacadeService
      .getProvinceService()
      .getFetchAll({ PageNumber: 1, PageSize: -1 });
    this.allTinh = this.allTinhData.items;
    this.dvhcProvinceFilters = this.allTinhData.items;
  }

  async showDvhcHuyen() {
    if (!this.canhanIOForm.value.matinh === true) {
      this.allHuyen = [];
      this.dvhcDistrictFilters = [];
      this.allXa = [];
      this.dvhcWardFilters = [];
      if (this.editMode === true) {
        this.canhanIOForm.controls["mahuyen"].setValue("");
      }
    }
    if (!this.canhanIOForm.value.matinh === false) {
      if (this.editMode === true) {
        this.canhanIOForm.controls["mahuyen"].setValue("");
      }
      this.allXa = [];
      this.dvhcWardFilters = [];
      this.allHuyen = await this.dmFacadeService
        .getDistrictService()
        .getFetchAll({ matinh: this.canhanIOForm.value.matinh });
      this.dvhcDistrictFilters = this.allHuyen;
    }
  }

  async showDvhcXa() {
    if (!this.canhanIOForm.value.mahuyen === true) {
      this.allXa = [];
      this.dvhcWardFilters = [];
      if (this.editMode === true) {
        this.canhanIOForm.controls["maxa"].setValue("");
      }
    }
    if (
      !this.canhanIOForm.value.matinh === false &&
      !this.canhanIOForm.value.mahuyen === false
    ) {
      if (this.editMode === true) {
        this.canhanIOForm.controls["maxa"].setValue("");
      }
      this.allXa = await this.dmFacadeService
        .getWardService()
        .getFetchAll({ mahuyen: this.canhanIOForm.value.mahuyen });
      this.dvhcWardFilters = this.allXa;
    }
  }

  // add or update form
  private addOrUpdate(operMode: string) {
    const dmFacadeService = this.dmFacadeService.getDmCanhanService();
    this.inputModel = this.canhanIOForm.value;
    this.inputModel.imgLink = this.srcanh;
    if (operMode === "new") {
      dmFacadeService.addItem(this.inputModel).subscribe(
        (res) => this.matSidenavService.doParentFunction("getAllCanhan"),
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
        (res) => this.matSidenavService.doParentFunction("getAllCanhan"),
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
    if (this.canhanIOForm.valid === true) {
      this.addOrUpdate(operMode);
      this.matSidenavService.close();
    }
  }

  // Hàm reset form, gọi khi nhấn nút reset dữ liệu
  public onFormReset() {
    // Hàm .reset sẽ xóa trắng mọi control trên form
    this.canhanIOForm.reset();
    // Trong trường hợp mong muốn reset một số trường về giá trị mặc định thì dùng .patchValue
    // https://angular.io/guide/reactive-forms#patching-the-model-value
  }

  // Hàm lưu và reset form để tiếp tục nhập mới dữ liệu. Trường hợp này khi người dùng muốn nhập dữ liệu liên tục
  async onContinueAdd(operMode: string) {
    this.logAllValidationErrorMessages();
    if (this.canhanIOForm.valid === true) {
      this.addOrUpdate(operMode);
      this.onFormReset();
      this.purpose = "new";
    }
  }

  // Validation click submit
  public logAllValidationErrorMessages() {
    validationAllErrorMessagesService(
      this.canhanIOForm,
      this.validationErrorMessages,
      this.formErrors
    );
  }

  public closeCanhanIOSidebar() {
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
   *  Hàm gọi từ function con gọi vào chạy function cha
   * @param methodName
   */
  doFunction(methodName) {
    this[methodName]();
  }
}
