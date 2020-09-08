import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from "@angular/forms";
import { InputTaiLieuModel } from "../../../../../../models/admin/baocao/tailieudinhkem.model";
import { MatsidenavService } from "../../../../../../services/utilities/matsidenav.service";
import { CommonServiceShared } from "../../../../../../services/utilities/common-service";
import { TranslateService } from "@ngx-translate/core";
import { BaocaoFacadeService } from "../../../../../../services/admin/baocao/baocao-facade.service";
import { HttpErrorResponse } from "@angular/common/http";
import { validationAllErrorMessagesService } from "../../../../../../services/utilities/validatorService";
import { CommonFacadeService } from "../../../../../../services/admin/common/common-facade.service";

@Component({
  selector: 'app-tailieudinhkem-io',
  templateUrl: './tailieudinhkem-io.component.html',
  styleUrls: ['./tailieudinhkem-io.component.scss']
})
export class TailieudinhkemIoComponent implements OnInit {

  // Chứa dữ liệu Form tài liệu đính kèm
  public tailieuIOForm: FormGroup;

  // Chứa dữ liệu đối tượng truyền từ list comp
  public obj: any;

  // Chứa kiểu form
  public purpose: string;

  // Chứa chế độ form
  public editMode: boolean;

  // Chứa dữ liệu input
  public inputModel: InputTaiLieuModel;

  // Chứa dữ liệu translate
  public dataTranslate: any;

  // Chứa dữ liệu file
  public fileData: File = null;

  // error message
  validationErrorMessages = {};


  // form errors
  formErrors = {
    tentailieu: "",
    thutu: "",
  };

  // Contructor
  constructor(
    public matSidenavService: MatsidenavService,
    private formBuilder: FormBuilder,
    public commonService: CommonServiceShared,
    private translate: TranslateService,
    public baoCaoFacadeService: BaocaoFacadeService,
    public commonFacadeService: CommonFacadeService
  ) { }

  async ngOnInit() {
    // Khởi tạo form
    await this.formInit();
    //Khởi tạo form theo dạng add or edit
    await this.bindingConfigAddOrUpdate();
    // Lấy dữ liệu translate
    await this.getDataTranslate();

  }

  /**
   * Hàm lấy dữ liệu translate
   */
  async getDataTranslate() {
    // Lấy ra biến translate của hệ thống
    this.dataTranslate = await this.translate
      .getTranslation(this.translate.getDefaultLang())
      .toPromise();
    // Hàm set validation cho form
    await this.setValidation();
  }

  /**
   * Hàm set validate
   */
  setValidation() {
    this.validationErrorMessages = {
    };
  }


  /**
   * Hàm khởi tạo form theo dạng edit
   */
  bindingConfigAddOrUpdate() {
    this.inputModel = new InputTaiLieuModel();
    // check edit
    this.formOnEdit();
  }

  /**
   * Hàm khởi tạo form
   */
  formInit() {
    this.tailieuIOForm = this.formBuilder.group({
      tentailieu: [""],
      thutu: [""],
    });
  }

  /**
   * Hàm set value cho form
   */
  async formOnEdit() {
    if (this.obj && this.purpose === 'edit') {
      this.tailieuIOForm.setValue({
        tentailieu: this.obj.tentailieu,
        thutu: this.obj.thutu,
      });
    }
  }

  /**
   * Hàm thực thi chức năng add và edit
   */
  async addOrUpdate(operMode: string) {
    const baoCaoFacadeService = this.baoCaoFacadeService.getTaiLieuDinhKemService();
    const fileService = this. commonFacadeService.getFileService();
    this.inputModel = this.tailieuIOForm.value;
    if (operMode === "new") {
      let formData: FormData = new FormData();
      formData.append("File", this.fileData);
      await fileService.addItem(formData).subscribe(res => {
        // Gán dữ liệu vào model
        this.inputModel.filedinhkem = res.filedinhkem;
        this.inputModel.dinhdang = res.dinhdang;
        this.inputModel.dungluong = res.dungluong;
        this.inputModel.duongdan = res.duongdan
        // gọi api thêm item vào bảng tailieu
        baoCaoFacadeService.addItem(this.inputModel).subscribe(
          (res) => this.matSidenavService.doParentFunction("reloadDataGrid"),
          (error: HttpErrorResponse) => {
            this.showDialogWarning(error.error.errors);
          },
          () =>
            this.commonService.showeNotiResult(
              this.dataTranslate.COMMON.default.successAdd,
              2000
            )
        );
      },
      (error: HttpErrorResponse) => {

      });
    } else if (operMode === "edit") {
      this.inputModel.idtailieu = this.obj.idtailieu;
      baoCaoFacadeService.updateItem(this.inputModel).subscribe(
        (res) => this.matSidenavService.doParentFunction("reloadDataGrid"),
        (error: HttpErrorResponse) => {
          this.showDialogWarning(error.error.errors);
        },
        () =>
          this.commonService.showeNotiResult(
            this.dataTranslate.COMMON.default.successEdit,
            2000
          )
      );
    }
  }

  /**
   * Hàm được gọi khi nhấn nút Lưu, Truyền vào operMode để biết là Edit hay tạo mới
   * @param operMode 
   */
  async onSubmit(operMode: string) {
    this.logAllValidationErrorMessages();
    if (this.tailieuIOForm.valid === true) {
      this.addOrUpdate(operMode);
      this.matSidenavService.close();
    }
  }

  /**
   * Hàm reset form, gọi khi nhấn nút reset dữ liệu
   */
  public onFormReset() {
    // Hàm .reset sẽ xóa trắng mọi control trên form
    this.tailieuIOForm.reset({
      tentailieu: "",
      thutu: "",
    });
  }

  /**
   * Hàm lưu và reset form để tiếp tục nhập mới dữ liệu. Trường hợp này khi người dùng muốn nhập dữ liệu liên tục
   * @param operMode 
   */
  async onContinueAdd(operMode: string) {
    this.logAllValidationErrorMessages();
    if (this.tailieuIOForm.valid === true) {
      this.addOrUpdate(operMode);
      this.onFormReset();
      this.purpose = "new";
    }
  }

  /**
   * Hàm kiểm tra validation form
   */
  public logAllValidationErrorMessages() {
    validationAllErrorMessagesService(
      this.tailieuIOForm,
      this.validationErrorMessages,
      this.formErrors
    );
  }

  /**
   * Hàm close sidenav
   */
  public closeTaiLieuDinhKemIOSidenav() {
    this.matSidenavService.close();
  }

  /**
   * Hàm xử lý file
   */
  public fileProgress(fileInput: any) {
    if(fileInput) {
      this.fileData = fileInput.target.files[0];
    }
  }

  /**
   * Hàm hiển thị cảnh báo error
   */
  public showDialogWarning(error: any) {
    // const dialog = this.modalDialog.open(MyAlertDialogComponent);
    // dialog.componentInstance.header = this.dataTranslate.COMMON.default.warnings;
    // dialog.componentInstance.content =
    //   "<b>" + error + "</b>";
    // dialog.componentInstance.visibleOkButton = false;
  }

  /**
   *  Hàm gọi từ function con gọi vào chạy function cha
   * @param methodName
   */
  doFunction(methodName) {
    this[methodName]();
  }
}
