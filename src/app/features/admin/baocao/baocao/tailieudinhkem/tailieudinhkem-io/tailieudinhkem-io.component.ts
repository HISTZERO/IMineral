import { Component, OnInit } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { HttpErrorResponse } from "@angular/common/http";
import { ActivatedRoute } from "@angular/router";

import { InputTaiLieuModel } from "src/app/models/admin/baocao/tailieudinhkem.model";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { BaocaoFacadeService } from "src/app/services/admin/baocao/baocao-facade.service";
import { validationAllErrorMessagesService } from "src/app/services/utilities/validatorService";
import { CommonFacadeService } from "src/app/services/admin/common/common-facade.service";

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
  public validationErrorMessages = {};

  // Chứa tên file
  public fileName: string;


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
    public commonFacadeService: CommonFacadeService,
    public activatedRoute: ActivatedRoute
  ) { }

  async ngOnInit() {
    // Khởi tạo form
    await this.formInit();
    // Lấy dữ liệu translate
    await this.getDataTranslate();
    // Khởi tạo form theo dạng add or edit
    await this.bindingConfigAddOrUpdate();

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
    this.fileName = this.dataTranslate.BAOCAO.tailieudinhkem.addFile;
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
      this.fileName = this.obj.filedinhkem;
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
    const idbaocao: string = this.activatedRoute.snapshot.paramMap.get('id');
    const tailieuService = this.baoCaoFacadeService.getTaiLieuDinhKemService();
    this.inputModel = this.tailieuIOForm.value;
    if (operMode === "new") {
      const formData: FormData = new FormData();
      formData.append("File", this.fileData);
      formData.append("Idbaocao", idbaocao);
      formData.append("Tentailieu", this.inputModel.tentailieu);
      formData.append("Thutu", this.inputModel.thutu);
      tailieuService.addItem(formData).subscribe(
        (res) => this.matSidenavService.doParentFunction("reloadDataGrid"),
        (error: HttpErrorResponse) => {
          this.commonService.showDialogWarning(error.error.errors);
        },
        () =>
          this.commonService.showeNotiResult(
            this.dataTranslate.COMMON.default.successAdd,
            2000
          )
      );
    } else if (operMode === "edit") {
      const formData: FormData = new FormData();
      formData.append("File", this.fileData);
      formData.append("Idbaocao", idbaocao);
      formData.append("Tentailieu", this.inputModel.tentailieu);
      formData.append("Thutu", this.inputModel.thutu);
      formData.append("Idtailieu", this.obj.idtailieu);
      tailieuService.updateItem(formData).subscribe(
        (res) => this.matSidenavService.doParentFunction("reloadDataGrid"),
        (error: HttpErrorResponse) => {
          this.commonService.showDialogWarning(error.error.errors);
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
    if (fileInput) {
      this.fileData = fileInput.target.files[0];
      this.fileName = this.fileData.name;
    }
  }

  /**
   *  Hàm gọi từ function con gọi vào chạy function cha
   * @param methodName
   */
  doFunction(methodName) {
    this[methodName]();
  }
}
