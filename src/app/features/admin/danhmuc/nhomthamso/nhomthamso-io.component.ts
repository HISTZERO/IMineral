import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { InputNhomthamsoModel } from "src/app/models/admin/danhmuc/nhomthamso.model";
import { DmFacadeService } from "src/app/services/admin/danhmuc/danhmuc-facade.service";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { validationAllErrorMessagesService } from "src/app/services/utilities/validatorService";
import { TranslateService } from "@ngx-translate/core";
import { translateConstants } from "src/app/shared/constants/translate-constants";

@Component({
  selector: "app-nhomthamso-io",
  templateUrl: "./nhomthamso-io.component.html",
  styleUrls: ["./nhomthamso-io.component.scss"],
})
export class DmNhomthamsoIoComponent implements OnInit {
  nhomthamsoIOForm: FormGroup;
  submitted = false;
  public obj: any;
  public purpose: string;
  public editMode: boolean;
  public inputNtsModel: InputNhomthamsoModel;
  // error message
  validationErrorMessages = {};

  // form errors
  formErrors = {
    tennhom: "",
    kyhieunhom: "",
  };

  // Biến dùng translate
  dataTranslate: any;

  constructor(
    public matSidenavService: MatsidenavService,
    public dmFacadeService: DmFacadeService,
    private formBuilder: FormBuilder,
    private commonService: CommonServiceShared,
    private translate: TranslateService
  ) {
    this.matSidenavService.okCallBackFunction = null;
    this.matSidenavService.cancelCallBackFunction = null;
    this.matSidenavService.confirmStatus = null;
  }

  async ngOnInit() {
    this.editMode = false;
    this.inputNtsModel = new InputNhomthamsoModel();
    // Nếu purpose là edit hay new thì đặt editMode thành true để hiển thị form nhập dữ liệu
    if (this.purpose === "edit" || this.purpose === "new") {
      this.editMode = true;
    }
    this.nhomthamsoIOForm = this.formBuilder.group({
      tennhom: ["", Validators.required],
      kyhieunhom: ["", Validators.required],
    });
    // Nếu editMode = true và purpose là edit (obj đã được set) thì sẽ set giá trị cho các input Textbox bằng đối tượng vừa được nhấn edit
    if (this.editMode === true && this.obj) {
      this.nhomthamsoIOForm.setValue({
        tennhom: this.obj.tennhom,
        kyhieunhom: this.obj.kyhieunhom,
      });
    }

    // Lấy ra biến translate của hệ thống
    this.dataTranslate = await this.translate
      .getTranslation(this.translate.getDefaultLang())
      .toPromise();
    await this.setValidation();
  }

  setValidation() {
    this.validationErrorMessages = {
      tennhom: {
        required: this.dataTranslate.DANHMUC.nhomthamso.tennhomRequired,
      },
      kyhieunhom: {
        required: this.dataTranslate.DANHMUC.nhomthamso.kyhieunhomRequired,
      },
    };
  }

  // Hàm được gọi khi nhấn nút Lưu, Truyền vào operMode để biết là Edit hay tạo mới
  async onSubmit(operMode: string) {
    this.logAllValidationErrorMessages();
    if (this.nhomthamsoIOForm.valid === true) {
      try {
        this.inputNtsModel = this.nhomthamsoIOForm.value;
        if (operMode === "new") {
          await this.dmFacadeService
            .getNhomthamsoService()
            .addItem(this.inputNtsModel)
            .subscribe((res) =>
              this.matSidenavService.doParentFunction("getAllNhomthamso")
            );
          this.commonService.showeNotiResult(
            this.dataTranslate.COMMON.default.successAdd,
            2000
          );
        } else if (operMode === "edit") {
          const idEdit: number = this.obj.id;
          this.inputNtsModel.id = idEdit;
          await this.dmFacadeService
            .getNhomthamsoService()
            .updateItem(this.inputNtsModel)
            .subscribe((res) =>
              this.matSidenavService.doParentFunction("getAllNhomthamso")
            );
          this.commonService.showeNotiResult(
            this.dataTranslate.COMMON.default.successEdit,
            2000
          );
        }
        this.matSidenavService.close();
      } catch (error) {
        this.commonService.showeNotiResult(error, 2000);
      }
    }
  }

  // Hàm reset form, gọi khi nhấn nút reset dữ liệu
  public onFormReset() {
    // Hàm .reset sẽ xóa trắng mọi control trên form
    this.nhomthamsoIOForm.reset();
    // Trong trường hợp mong muốn reset một số trường về giá trị mặc định thì dùng .patchValue
    // https://angular.io/guide/reactive-forms#patching-the-model-value
  }

  // Hàm lưu và reset form để tiếp tục nhập mới dữ liệu. Trường hợp này khi người dùng muốn nhập dữ liệu liên tục
  async onContinueAdd(operMode: string) {
    this.logAllValidationErrorMessages();
    if (this.nhomthamsoIOForm.valid === true) {
      try {
        this.inputNtsModel = this.nhomthamsoIOForm.value;
        if (operMode === "new") {
          await this.dmFacadeService
            .getNhomthamsoService()
            .addItem(this.inputNtsModel)
            .subscribe((res) =>
              this.matSidenavService.doParentFunction("getAllNhomthamso")
            );
          this.commonService.showeNotiResult(
            this.dataTranslate.COMMON.default.successAdd,
            2000
          );
        } else if (operMode === "edit") {
          const idEdit: number = this.obj.id;
          await this.dmFacadeService
            .getNhomthamsoService()
            .updateItem(this.inputNtsModel)
            .subscribe((res) =>
              this.matSidenavService.doParentFunction("getAllNhomthamso")
            );
          this.commonService.showeNotiResult(
            this.dataTranslate.COMMON.default.successEdit,
            2000
          );
        }
        this.onFormReset();
        // Sau khi reset form thì chuyển chế độ sang nhập mới (dù trước đó là edit hay nhập mới)
        this.purpose = "new";
      } catch (error) {
        this.commonService.showeNotiResult(error, 2000);
      }
    }
  }

  // Validation click submit
  public logAllValidationErrorMessages() {
    validationAllErrorMessagesService(
      this.nhomthamsoIOForm,
      this.validationErrorMessages,
      this.formErrors
    );
  }

  // Hàm đóng sidenav, gọi khi nhấn nút Hủy bỏ, Nếu cần thực thi một hàm nào đó ở Component cha (-list) thì set giá trị cho:
  // this.matSidenavService.cancelCallBackFunction = 'tên hàm';
  public closeNhomthamsoIOSidebar() {
    this.matSidenavService.close();
  }
}
