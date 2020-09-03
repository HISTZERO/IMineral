import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { HttpErrorResponse } from "@angular/common/http";
import { InputKhuVucToaDoModel } from "src/app/models/admin/khuvuckhoangsan/khuvuctoado.model";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { KhuvuctoadoService } from "src/app/services/admin/khuvuckhoangsan/khuvuctoado.service";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { validationAllErrorMessagesService } from "src/app/services/utilities/validatorService";

@Component({
  selector: 'app-khuvuctoado-io',
  templateUrl: './khuvuctoado-io.component.html',
  styleUrls: ['./khuvuctoado-io.component.scss']
})
export class KhuvuctoadoIoComponent implements OnInit {

  // Chứa dữ liệu Form
  public khuvuctoadoIOForm: FormGroup;

  // Chứa dữ liệu đối tượng truyền từ list comp
  public obj: any;

  // Chứa kiểu form
  public purpose: string;

  // Chứa chế độ form
  public editMode: boolean;

  // Chứa dữ liệu input
  public inputModel: InputKhuVucToaDoModel;

  // Chứa dữ liệu translate
  public dataTranslate: any;

  // error message
  validationErrorMessages = {};

  // form errors
  formErrors = {
    sohieu: "",
    toadox: "",
    toadoy: "",
    loaikhuvuc: "",
    idkhuvuc: ""
  };

  constructor(public matSidenavService: MatsidenavService,
              public khuvuctoadoService: KhuvuctoadoService,
              private formBuilder: FormBuilder,
              public commonService: CommonServiceShared,
              private translate: TranslateService) { }

  async ngOnInit() {
    // Khởi tạo form
    await this.formInit();
    // Khởi tạo form theo dạng add or edit
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
      toadox: {required: this.dataTranslate.KHUVUCKHOANGSAN.khuvuctoado.toadoxRequired , pattern: this.dataTranslate.KHUVUCKHOANGSAN.khuvuctoado.toadoxFormat },
      t0adoy: {required: this.dataTranslate.KHUVUCKHOANGSAN.khuvuctoado.toadoyRequired , pattern: this.dataTranslate.KHUVUCKHOANGSAN.khuvuctoado.toadoyFormat }
    };
  }

  /**
   * Hàm khởi tạo form theo dạng edit
   */
  bindingConfigAddOrUpdate() {
    this.editMode = false;
    this.inputModel = new InputKhuVucToaDoModel();
    // check edit
    this.formOnNewOrEdit();
  }

  /**
   * Hàm khởi tạo form
   */
  formInit() {
    this.khuvuctoadoIOForm = this.formBuilder.group({
      sohieu: [""],
      toadox: ["", [Validators.required, Validators.pattern("^[0-9]+\.{0,1}\d{0,2}$")]],
      toadoy: ["", [Validators.required, Validators.pattern("^[0-9]+\.{0,1}\d{0,2}$")]],
      loaikhuvuc: ["", Validators.required],
      idkhuvuc: ["", Validators.required]
    });
  }

  /**
   * hàm set value cho form
   */
  formOnNewOrEdit() {
    if (this.obj && this.purpose === 'edit') {
      this.khuvuctoadoIOForm.setValue({
        sohieu: this.obj.sohieu,
        toadox: this.obj.toadox,
        toadoy: this.obj.toadoy,
        loaikhuvuc: this.obj.loaikhuvuc,
        idkhuvuc: this.obj.idkhuvuc
      });

      this.editMode = true;
    } else if (this.obj && this.purpose === 'new') {
      this.khuvuctoadoIOForm.setValue({
        sohieu: "",
        toadox: "",
        toadoy: "",
        loaikhuvuc: this.obj.loaikhuvuc,
        idkhuvuc: this.obj.idkhuvuc
      });
    }
  }

  /**
   * Hàm thực thi chức năng add và edit
   */
  private addOrUpdate(operMode: string) {
    // Gán dữ liệu input vào model
    this.inputModel = this.khuvuctoadoIOForm.value;
    if (operMode === "new") {
      this.inputModel.idkhuvuc = this.obj.idkhuvuc;
      this.inputModel.loaikhuvuc = this.obj.loaikhuvuc;
      const inputData = {data: this.inputModel, purpose: 'new'};
      this.matSidenavService.doParentFunction("addOrUpdateGrid", inputData);
    } else if (operMode === "edit") {
      this.inputModel.idkhuvuctoado = this.obj.idkhuvuctoado;
      this.inputModel.idkhuvuc = this.obj.idkhuvuc;
      this.inputModel.loaikhuvuc = this.obj.loaikhuvuc;
      const inputData = {data: this.inputModel, purpose: 'edit'};
      this.matSidenavService.doParentFunction("addOrUpdateGrid", inputData);
    }
  }

  /**
   * Hàm được gọi khi nhấn nút Lưu, Truyền vào operMode để biết là Edit hay tạo mới
   * @param operMode
   */
  async onSubmit(operMode: string) {
    this.logAllValidationErrorMessages();
    if (this.khuvuctoadoIOForm.valid === true) {
      this.addOrUpdate(operMode);
      this.matSidenavService.close();
    }
  }

  /**
   * Hàm lưu và reset form để tiếp tục nhập mới dữ liệu. Trường hợp này khi người dùng muốn nhập dữ liệu liên tục
   * @param operMode
   */
  async onContinueAdd(operMode: string) {
    this.logAllValidationErrorMessages();
    if (this.khuvuctoadoIOForm.valid === true) {
      this.addOrUpdate(operMode);
      this.onFormReset();
      this.purpose = "new";
    }
  }

  /**
   * hàm kiểm tra validation form
   */
  logAllValidationErrorMessages() {
    validationAllErrorMessagesService(
      this.khuvuctoadoIOForm,
      this.validationErrorMessages,
      this.formErrors
    );
  }

  /**
   * Hàm reset form, gọi khi nhấn nút reset dữ liệu
   */
  onFormReset() {
    // Hàm .reset sẽ xóa trắng mọi control trên form
    this.khuvuctoadoIOForm.reset();
  }

  /**
   * Hàm close sidenav
   */
  closeKhuVucToaDoIOSidenav() {
    this.matSidenavService.close();
  }

}
