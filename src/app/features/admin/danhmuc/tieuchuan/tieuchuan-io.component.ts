import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { InputTieuchuanModel } from "src/app/models/admin/danhmuc/tieuchuan.model";
import {
  validationAllErrorMessagesService,
  validationErrorMessagesService,
} from "src/app/services/utilities/validatorService";
import { HttpErrorResponse } from "@angular/common/http";
import { DmFacadeService } from "src/app/services/admin/danhmuc/danhmuc-facade.service";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { DatePipe } from "@angular/common";
import { MatDialog } from "@angular/material/dialog";
import { MatdialogService } from "src/app/services/utilities/matdialog.service";
import { ThuvienComponent } from "src/app/features/admin/thuvien/thuvien.component";
import { TranslateService } from "@ngx-translate/core";
import { translateConstants } from "src/app/shared/constants/translate-constants";

@Component({
  selector: "app-tieuchuan-io",
  templateUrl: "./tieuchuan-io.component.html",
  styleUrls: ["./tieuchuan-io.component.scss"],
})
export class DmTieuchuanIoComponent implements OnInit {
  tieuchuanIOForm: FormGroup;
  submitted = false;
  public editMode: boolean;
  public purpose: string;
  public inputModel: InputTieuchuanModel;
  public obj: any;
  public doccument: any;
  docFilters: any;

  // Những biến dành cho phần file
  mDialog: any;
  srcanh = "";
  public fileArray: any;
  public typeFile: string;

  // Các biến translate
  public dataTranslate: any;

  // error message
  validationErrorMessages = {};

  // form errors
  formErrors = {
    tentieuchuan: "",
    sohieutieuchuan: "",
  };

  constructor(
    public matSidenavService: MatsidenavService,
    private formBuilder: FormBuilder,
    public commonService: CommonServiceShared,
    public dmFacadeService: DmFacadeService,
    private datePipe: DatePipe,
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
    await this.bindingConfigValidation();
    await this.bindingConfigAddOrUpdate();

    // Lấy ra biến translate của hệ thống
    this.dataTranslate = await this.translate
      .getTranslation(this.translate.getDefaultLang())
      .toPromise();
    await this.setValidation();
  }

  setValidation() {
    this.validationErrorMessages = {
      tentieuchuan: {
        required: this.dataTranslate.DANHMUC.tieuchuan.tenthamsoRequired,
      },
      sohieutieuchuan: {
        required: this.dataTranslate.DANHMUC.tieuchuan.sohieutieuchuanRequired,
      },
    };
  }

  // config Form use add or update
  bindingConfigAddOrUpdate() {
    this.editMode = false;
    this.inputModel = new InputTieuchuanModel();
    if (this.purpose === "new" || this.purpose === "edit") {
      this.editMode = true;
    }
    // check edit
    this.formOnEdit();
  }

  // init FormControl
  bindingConfigValidation() {
    this.tieuchuanIOForm = this.formBuilder.group({
      tentieuchuan: ["", Validators.required],
      sohieutieuchuan: ["", Validators.required],
      thoigianbanhanh: [""],
      coquanbanhanh: [""],
      hientrang: [""],
      tailieuLink: [""],
    });
  }

  // init edit form
  formOnEdit() {
    if (this.editMode === true && this.obj) {
      this.tieuchuanIOForm.setValue({
        tentieuchuan: this.obj.tentieuchuan,
        sohieutieuchuan: this.obj.sohieutieuchuan,
        thoigianbanhanh: this.obj.thoigianbanhanh,
        coquanbanhanh: this.obj.coquanbanhanh,
        hientrang: this.obj.hientrang,
        tailieuLink: this.obj.tailieuLink,
      });
      this.srcanh = this.obj.tailieuLink;
    }
  }

  // add or update form
  private addOrUpdate(operMode: string) {
    this.inputModel = this.tieuchuanIOForm.value;
    this.inputModel.tailieuLink = this.srcanh;
    this.inputModel.thoigianbanhanh = this.datePipe.transform(
      this.tieuchuanIOForm.value.thoigianbanhanh,
      "yyyy-MM-dd"
    );
    if (operMode === "new") {
      this.dmFacadeService
        .getTieuchuanService()
        .addItem(this.inputModel)
        .subscribe(
          (res) => this.matSidenavService.doParentFunction("getAllTieuchuan"),
          (error: HttpErrorResponse) => {
            this.commonService.showError(error);
          },
          () =>
            this.commonService.showeNotiResult(
              "Thêm mới tiêu chuẩn thành công!",
              2000
            )
        );
    } else if (operMode === "edit") {
      const id: number = this.obj.id;
      this.inputModel.id = id;
      this.dmFacadeService
        .getTieuchuanService()
        .updateItem(this.inputModel)
        .subscribe(
          (res) => this.matSidenavService.doParentFunction("getAllTieuchuan"),
          (error: HttpErrorResponse) => {
            this.commonService.showError(error);
          },
          () =>
            this.commonService.showeNotiResult(
              "Cập nhật tiêu chuẩn thành công!",
              2000
            )
        );
    }
  }

  // on submit
  async onSubmit(operMode: string) {
    this.logAllValidationErrorMessages();
    if (this.tieuchuanIOForm.valid === true) {
      this.addOrUpdate(operMode);
      this.matSidenavService.close();
    }
  }

  // save and reset form
  async addContinue(operMode: string) {
    this.logAllValidationErrorMessages();
    if (this.tieuchuanIOForm.valid === true) {
      this.addOrUpdate(operMode);
      this.onFormReset();
      this.purpose = "new";
    }
  }

  // reset form
  public onFormReset() {
    this.tieuchuanIOForm.reset();
  }

  // Validation click submit
  public logAllValidationErrorMessages() {
    validationAllErrorMessagesService(
      this.tieuchuanIOForm,
      this.validationErrorMessages,
      this.formErrors
    );
  }

  // close sidebar
  public closeTieuchuanIOSidebar() {
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
    this.srcanh = this.fileArray[0].link;
    this.typeFile = this.fileArray[0].type;
    this.setIconShow(this.typeFile);
  }

  /**
   * show icon docx, xlsx, pdf,...
   */
  setIconShow(type) {
    switch (type) {
      case ".docx":
        this.typeFile = "fas fa-file-word";
        break;
      case ".pdf":
        this.typeFile = "fas fa-file-pdf";
        break;
      case ".xls":
        this.typeFile = "fas fa-file-excel";
        break;
      case ".pptx":
        this.typeFile = "fas fa-file-powerpoint";
        break;
      case ".js":
      case ".html":
        this.typeFile = "fas fa-file-code";
        break;
      case ".mp4":
      case ".aiv":
      case ".mov":
      case ".flv":
        this.typeFile = "fas fa-file-video";
        break;
      case ".jpg":
      case ".gif":
      case ".png":
      case ".jpeg":
      case ".raw":
      case ".jfif": {
        this.typeFile = "fas fa-file-image";
        break;
      }
      default: {
        this.typeFile = "fas fa-file";
        break;
      }
    }
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
