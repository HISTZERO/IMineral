import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { ThietlapFacadeService } from "src/app/services/admin/thietlap/thietlap-facade.service";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { HttpErrorResponse } from "@angular/common/http";
import { validationAllErrorMessagesService } from "src/app/services/utilities/validatorService";
import { InputObjTypesModel } from "src/app/models/admin/thietlap/objTypes.model";
import { CallFunctionService } from "src/app/services/utilities/call-function.service";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-thietlaptram-io",
  templateUrl: "./thietlaptram-io.component.html",
  styleUrls: ["./thietlaptram-io.component.scss"],
})
export class ThietlaptramIoComponent implements OnInit {
  thietLapTramIOForm: FormGroup;
  submitted = false;
  public obj: any;
  public purpose: string;
  public inputModel: InputObjTypesModel;
  public model: any;
  errorKey: any;
  errorName: any;
  errorAlert: boolean;
  dataAlert: any;

  // Error message
  validationErrorMessages = {};

  // Biến dùng translate
  dataTranslate: any;

  // Form errors
  formErrors = {
    otypeName: "",
    otypeKey: "",
    otypeCat: "",
  };
  constructor(
    public matSidenavService: MatsidenavService,
    public thietLapFacadeService: ThietlapFacadeService,
    private formBuilder: FormBuilder,
    public commonService: CommonServiceShared,
    private callFunctionService: CallFunctionService,
    private translate: TranslateService
  ) {
    this.matSidenavService.okCallBackFunction = null;
    this.matSidenavService.cancelCallBackFunction = null;
    this.matSidenavService.confirmStatus = null;
  }

  async ngOnInit() {
    await this.formInit();
    await this.bindingConfigAddOrUpdate();

    // Lấy dữ liệu biến translate để gán vào các biến trong component
    this.dataTranslate = await this.translate
      .getTranslation(this.translate.getDefaultLang())
      .toPromise();

    this.setValidation();
  }

  // Hàm set biến validation từ data translate
  setValidation() {
    this.validationErrorMessages = {
      otypeName: {
        required: this.dataTranslate.THIETLAP.thietlaptram.otypeNameRequired,
      },
      otypeKey: {
        required: this.dataTranslate.THIETLAP.thietlaptram.otypeKeyRequired,
      },
      otypeCat: {
        required: this.dataTranslate.THIETLAP.thietlaptram.otypeCatRequired,
      },
    };
  }
  /**
   * Config form use Add or Update
   */
  bindingConfigAddOrUpdate() {
    // Khởi tạo đối tượng InputObjTypesModel gán vào biến inputModel
    this.inputModel = new InputObjTypesModel();
    // Hàm check edit
    this.formOnEdit();
  }

  /**
   * Init FormControl
   */
  formInit() {
    // Hàm thiết lập form và các trường của form
    this.thietLapTramIOForm = this.formBuilder.group({
      otypeName: ["", Validators.required],
      otypeKey: ["", Validators.required],
      otypeCat: ["", Validators.required],
    });
  }

  /**
   * Init edit form
   */
  formOnEdit() {
    // Nếu biến obj có dữ liệu và biến purpose = edit thì chạy các function bên trong
    if (this.obj && this.purpose === "edit") {
      this.thietLapTramIOForm.setValue({
        otypeName: this.obj.otypeName,
        otypeKey: this.obj.otypeKey,
        otypeCat: this.obj.otypeCat,
      });
    }
  }

  /**
   *  Hàm check validator trường input otypeKey không được trùng
   */
  public checkOtypeKey(): boolean {
    let key: string = this.thietLapTramIOForm.value.otypeKey; // Lấy value từ input otypeKey
    let keyValueLower: any;
    if (key) {
      keyValueLower = key.toLocaleLowerCase(); // Convert value key to LowerCase
    }
    let arrayKey = this.obj.arrayOtypeKey; // Lấy Array otypeKey từ bên list truyền sang qua biến obj
    let arrayKeyLower: any = [];
    if (arrayKey) {
      arrayKeyLower = arrayKey.map((k) => k.toLocaleLowerCase()); // Convert value arrayKey to LowerCase bằng phương thức map()
    }
    if (this.purpose === "edit") {
      if (key === this.obj.otypeKey) {
        this.errorKey = "";
        return true;
      } else {
        if (arrayKeyLower.indexOf(keyValueLower) !== -1) {
          // Gán string vào biến hiển thị error
          this.errorKey = this.dataTranslate.THIETLAP.thietlaptram.errorKey;
          return false;
        } else {
          // Biến error gán bằng rỗng
          this.errorKey = "";
          return true;
        }
      }
    } else {
      // Tìm kiếm trong arrayKey1 với từ khóa là key1 nếu trùng thì return false , không trùng thì return true
      if (arrayKeyLower.indexOf(keyValueLower) !== -1) {
        // Gán string vào biến hiển thị error
        this.errorKey = this.dataTranslate.THIETLAP.thietlaptram.errorKey;
        return false;
      } else {
        // Biến error gán bằng rỗng
        this.errorKey = "";
        return true;
      }
    }
  }

  /**
   * Hàm check validator trường input otypeName không được trùng
   */
  public checkOtypeName(): boolean {
    // Lấy value input otypeName gán vào biến name
    let name: string = this.thietLapTramIOForm.value.otypeName;
    let nameLower: any;
    if (name) {
      // Convert biến name thành lowerCase và gán vào biến name1
      nameLower = name.toLowerCase();
    }
    // Lấy Array otypeName từ bên list truyền sang qua biến obj rồi gán vào biến arrayName
    let arrayName = this.obj.arrayOtypeName;
    let arrayNameLower: any = [];
    if (arrayName) {
      // Convert value arrayKey to LowerCase bằng phương thức map() rồi gán arrayName1
      arrayNameLower = arrayName.map((n) => n.toLowerCase());
    }
    if (this.purpose === "edit") {
      if (name === this.obj.otypeName) {
        this.errorName = "";
        return true;
      } else {
        if (arrayNameLower.indexOf(nameLower) !== -1) {
          // Gán dữ liệu vào biến hiển thì error
          this.errorName = this.dataTranslate.THIETLAP.thietlaptram.errorName;
          return false;
        } else {
          // Gán biến hiển hiển thị error là  trống (không hiển thị error)
          this.errorName = "";
          return true;
        }
      }
    } else {
      // check nếu trong arrayName1 tồn tại name1 thì return false nếu không tồn tại thì return true
      if (arrayNameLower.indexOf(nameLower) !== -1) {
        // Gán dữ liệu vào biến hiển thì error
        this.errorName = this.dataTranslate.THIETLAP.thietlaptram.errorName;
        return false;
      } else {
        // Gán biến hiển hiển thị error là  trống (không hiển thị error)
        this.errorName = "";
        return true;
      }
    }
  }
  /**
   * Hàm Add and Update
   * @param operMode
   */
  private addOrUpdate(operMode: string) {
    this.errorAlert = false;
    // Lấy value từ form gán vào biến inputModel
    this.inputModel = this.thietLapTramIOForm.value;
    // Nếu operMode = new thì chạy các function
    if (operMode === "new") {
      // Call method addItem truyền vào inputModel
      this.thietLapFacadeService
        .getObjTypeService()
        .addItem(this.inputModel)
        .subscribe(
          (res) => {
            this.matSidenavService.doParentFunction("getAllThietLapTram"); // Call function parent
            const data = {
              type: "new",
              data: res,
            };
            this.callFunctionService.callFunctionEvent(data); // Call function sidenav component
          },
          (error: HttpErrorResponse) => {
            // Hàm show error
            // this.commonService.showError(error);
            this.dataAlert = [];
            this.errorAlert = true;
            this.dataAlert = error.error.errors;
          },
          () => {
            this.commonService.showeNotiResult(
              this.dataTranslate.COMMON.default.successAdd,
              2000
            );
          }
        );
    } else if (operMode === "edit") {
      // Nếu operMode = edit thì chạy các function
      // Gán id lấy từ obj và biến id
      const id: number = this.obj.id;
      // Gán biến id vào thuộc tính id trong inputMode
      this.inputModel.id = id;
      // Call function update truyền vào inputModel
      this.thietLapFacadeService
        .getObjTypeService()
        .updateItem(this.inputModel)
        .subscribe(
          (res) => {
            this.matSidenavService.doParentFunction("getAllThietLapTram");
            const data = {
              type: "edit",
              data: res,
            };
            this.callFunctionService.callFunctionEvent(data);
          }, // Call function parent
          (error: HttpErrorResponse) => {
            this.commonService.showError(error); // Hàm show error
          },
          () =>
            // Update thành công thì hiển thị thông báo
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
    // Call function check validotor
    this.logAllValidationErrorMessages();
    // Gọi hàm check OtypeName trả về true/false gán vào biến checkName
    const checkName = this.checkOtypeName();
    // Gọi hàm check OtypeKey trả về true/false gán vào biến checkKey
    const checkKey = this.checkOtypeKey();
    // Nếu form valid, checkName, checkKey = true thì Call function addOrUpdate
    if (
      this.thietLapTramIOForm.valid &&
      checkKey === true &&
      checkName === true
    ) {
      this.addOrUpdate(operMode);
      this.matSidenavService.close();
    }
  }

  /**
   * Hàm reset form, gọi khi nhấn nút reset dữ liệu
   */
  public onFormReset() {
    // Hàm .reset sẽ xóa trắng mọi control trên form
    this.thietLapTramIOForm.reset();
    // Trong trường hợp mong muốn reset một số trường về giá trị mặc định thì dùng .patchValue
    // https://angular.io/guide/reactive-forms#patching-the-model-value
  }

  /**
   * Hàm lưu và reset form để tiếp tục nhập mới dữ liệu. Trường hợp này khi người dùng muốn nhập dữ liệu liên tục
   * @param operMode
   */
  async onContinueAdd(operMode: string) {
    // Call function check validotor
    this.logAllValidationErrorMessages();
    // Gọi hàm check OtypeName trả về true/false gán vào biến checkName
    const checkName = this.checkOtypeName();
    // Gọi hàm check OtypeKey trả về true/false gán vào biến checkKey
    const checkKey = this.checkOtypeKey();
    // Nếu form valid, checkName, checkKey = true thì Call function addOrUpdate
    if (
      this.thietLapTramIOForm.valid &&
      checkKey === true &&
      checkName === true
    ) {
      this.addOrUpdate(operMode);
      // hàm reset lại form
      this.onFormReset();
      // Gán biến purpose = new
      this.purpose = "new";
    }
  }

  /**
   * Validation error message
   */
  public logAllValidationErrorMessages() {
    validationAllErrorMessagesService(
      this.thietLapTramIOForm,
      this.validationErrorMessages,
      this.formErrors
    );
  }

  /**
   * Hàm đóng sidenav
   */
  public closeThietLapTramIOSidebar() {
    this.matSidenavService.close();
  }
}
