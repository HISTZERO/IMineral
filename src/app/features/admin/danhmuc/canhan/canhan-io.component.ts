import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpErrorResponse } from "@angular/common/http";
import { TranslateService } from "@ngx-translate/core";

import { InputCanhanModel } from "src/app/models/admin/danhmuc/canhan.model";
import { OutputDvhcModel } from "src/app/models/admin/danhmuc/dvhc.model";
import { DmFacadeService } from "src/app/services/admin/danhmuc/danhmuc-facade.service";
import { validationAllErrorMessagesService } from "src/app/services/utilities/validatorService";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { LoaiGiayTo } from "src/app/shared/constants/loaigiayto-constants";
import { TrangThai } from "src/app/shared/constants/trangthai-constants";
@Component({
  selector: "app-canhan-io",
  templateUrl: "./canhan-io.component.html",
  styleUrls: ["./canhan-io.component.scss"],
})
export class DmCanhanIoComponent implements OnInit {
  // Chứa dữ liệu Form
  public canhanIOForm: FormGroup;

  // Chứa dữ liệu đối tượng truyền từ list comp
  public obj: any;

  // Chứa kiểu form
  public purpose: string;

  // Chứa chế độ form
  public editMode: boolean;

  // Chứa dữ liệu input
  public inputModel: InputCanhanModel;

  // Chứa danh sách Dvhc Tỉnh
  public allTinh: any;

  // Chứa danh sách Dvhc Huyện
  public allHuyen: any;

  // Chứa danh sách Dvhc Xã
  public allXa: any;
  
  // Filter Đơn vị hành chính Tỉnh
  public dvhcProvinceFilters: OutputDvhcModel[];

  // Filter Đơn vị hành chính Huyện
  public dvhcDistrictFilters: OutputDvhcModel[];

  // Filter Đơn vị hành chính Xã
  public dvhcWardFilters: OutputDvhcModel[];
  
  // Chứa dữ liệu loại giấy tờ
  public loaigiayto = LoaiGiayTo;

  // Chứa dữ liệu Trạng thái
  public trangthai = TrangThai;

  // Chứa dữ liệu translate
  public dataTranslate: any;

  // error message
  validationErrorMessages = {};

  // form errors
  formErrors = {
    hovaten: "",
    diachi: "",
    sogiayto: "",
    loaigiayto: "",
    ngaycap: "",
    noicap: "",
    dienthoai: "",
    email: "",
    matinh: "",
    mahuyen: "",
    maxa: "",
    trangthai: "",
    thutu: "",
  };

  // Contructor
  constructor(
    public matSidenavService: MatsidenavService,
    public dmFacadeService: DmFacadeService,
    private formBuilder: FormBuilder,
    public commonService: CommonServiceShared,
    private translate: TranslateService
  ) {}

  async ngOnInit() {
    // Khởi tạo form
    await this.formInit();
    //Khởi tạo form theo dạng add or edit
    await this.bindingConfigAddOrUpdate();
    // Lấy dữ liệu translate
    await this.getDataTranslate();
    
  }

  /**
   * hàm lấy dữ liệu translate
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
      hovaten: { required: this.dataTranslate.DANHMUC.canhan.hovatenRequired },
      dienthoai: { pattern: this.dataTranslate.DANHMUC.canhan.dienthoaiIsNumber},
      matinh: { required: this.dataTranslate.DANHMUC.canhan.matinhRequired },
      mahuyen: { required: this.dataTranslate.DANHMUC.canhan.mahuyenRequired },
    };
  }

  /**
   * Hàm khởi tạo form theo dạng edit
   */
  bindingConfigAddOrUpdate() {
    this.showDvhcTinh();
    this.editMode = false;
    this.inputModel = new InputCanhanModel();
    // check edit
    this.formOnEdit();
  }

  /**
   * Hàm khởi tạo form
   */
  formInit() {
    this.canhanIOForm = this.formBuilder.group({
      hovaten: ["", Validators.required],
      diachi: [""],
      sogiayto: [""],
      loaigiayto: [""],
      ngaycap: [""],
      noicap: [""],
      dienthoai: ["", Validators.pattern("^[0-9-+]+$")],
      email: [""],
      matinh: ["", Validators.required],
      mahuyen: ["", Validators.required],
      maxa: [""],
      trangthai: [""],
      thutu: [""],
    });
  }

  /**
   * hàm set value cho form
   */
  formOnEdit() {
    if (this.obj) {
      this.canhanIOForm.setValue({
        hovaten: this.obj.hovaten,
        diachi: this.obj.diachi,
        sogiayto: this.obj.sogiayto,
        loaigiayto: this.obj.loaigiayto,
        ngaycap: this.obj.ngaycap,
        noicap: this.obj.noicap,
        dienthoai: this.obj.dienthoai,
        email: this.obj.email,
        matinh: this.obj.matinh,
        mahuyen: this.obj.mahuyen,
        maxa: this.obj.maxa,
        trangthai: this.obj.trangthai,
        thutu: this.obj.thutu,
      });
      this.showDvhcHuyen();
      this.showDvhcXa();
    }
    this.editMode = true;
  }

  /**
   * Hàm lấy danh sách Dvhc Tỉnh
   */
  async showDvhcTinh() {
    const allTinhData: any = await this.dmFacadeService
      .getProvinceService()
      .getFetchAll({ PageNumber: 1, PageSize: -1 });
    this.allTinh = allTinhData.items;
    this.dvhcProvinceFilters = allTinhData.items;
  }

  /**
   * Hàm lấy danh sách Dvhc Huyện
   */
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

  /**
   * Hàm lấy danh sách Dvhc Xã
   */
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

  /**
   * Hàm thực thi chức năng add và edit
   */
  private addOrUpdate(operMode: string) {
    const dmFacadeService = this.dmFacadeService.getDmCanhanService();
    this.inputModel = this.canhanIOForm.value;
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
      this.inputModel.idcanhan = id;
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

  /**
   * Hàm được gọi khi nhấn nút Lưu, Truyền vào operMode để biết là Edit hay tạo mới
   * @param operMode 
   */
  async onSubmit(operMode: string) {
    this.logAllValidationErrorMessages();
    if (this.canhanIOForm.valid === true) {
      this.addOrUpdate(operMode);
      this.matSidenavService.close();
    }
  }

  /**
   * Hàm reset form, gọi khi nhấn nút reset dữ liệu
   */
  public onFormReset() {
    // Hàm .reset sẽ xóa trắng mọi control trên form
    this.canhanIOForm.reset();
  }

  /**
   * Hàm lưu và reset form để tiếp tục nhập mới dữ liệu. Trường hợp này khi người dùng muốn nhập dữ liệu liên tục
   * @param operMode 
   */
  async onContinueAdd(operMode: string) {
    this.logAllValidationErrorMessages();
    if (this.canhanIOForm.valid === true) {
      this.addOrUpdate(operMode);
      this.onFormReset();
      this.purpose = "new";
    }
  }

  /**
   * hàm kiểm tra validation form
   */
  public logAllValidationErrorMessages() {
    validationAllErrorMessagesService(
      this.canhanIOForm,
      this.validationErrorMessages,
      this.formErrors
    );
  }

  /**
   * Hàm close sidenav
   */
  public closeCanhanIOSidenav() {
    this.matSidenavService.close();
  }


  /**
   *  Hàm gọi từ function con gọi vào chạy function cha
   * @param methodName
   */
  doFunction(methodName) {
    this[methodName]();
  }
}
