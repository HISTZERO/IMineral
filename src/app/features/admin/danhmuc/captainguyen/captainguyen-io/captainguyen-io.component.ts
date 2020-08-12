import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { HttpErrorResponse } from "@angular/common/http";

import { InputCapTaiNguyenModel } from "src/app/models/admin/danhmuc/captainguyen.model";
import { OutputDvhcModel } from "src/app/models/admin/danhmuc/dvhc.model";
import { TrangThai } from "src/app/shared/constants/trangthai-constants";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { DmFacadeService } from "src/app/services/admin/danhmuc/danhmuc-facade.service";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { validationAllErrorMessagesService } from "src/app/services/utilities/validatorService";

@Component({
  selector: 'app-captainguyen-io',
  templateUrl: './captainguyen-io.component.html',
  styleUrls: ['./captainguyen-io.component.scss']
})
export class CaptainguyenIoComponent implements OnInit {

  // Chứa dữ liệu Form
  public capTaiNguyenIOForm: FormGroup;

  // Chứa dữ liệu đối tượng truyền từ list comp
  public obj: any;

  // Chứa kiểu form
  public purpose: string;

  // Chứa chế độ form
  public editMode: boolean;

  // Chứa dữ liệu input
  public inputModel: InputCapTaiNguyenModel;

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

  // Chứa dữ liệu Trạng thái
  public trangthai = TrangThai;

  // Chứa dữ liệu translate
  public dataTranslate: any;

  // error message
  validationErrorMessages = {};

  // form errors
  formErrors = {
    macaptainguyen: "",
    tencaptainguyen: "",
    nhomcaptainguyen: "",
    mota: "",
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
  public setValidation() {
    this.validationErrorMessages = {};
  }

  /**
   * Hàm khởi tạo form theo dạng edit
   */
  public bindingConfigAddOrUpdate() {
    this.showDvhcTinh();
    this.editMode = false;
    this.inputModel = new InputCapTaiNguyenModel();
    // check edit
    this.formOnEdit();
  }

  /**
   * Hàm khởi tạo form
   */
  public formInit() {
    this.capTaiNguyenIOForm = this.formBuilder.group({
      macaptainguyen: [""],
      tencaptainguyen: [""],
      nhomcaptainguyen: [""],
      mota: [""],
      trangthai: [""],
      thutu: [""],
    });
  }

  /**
   * hàm set value cho form
   */
  public formOnEdit() {
    if (this.obj && this.purpose === 'edit') {
      this.capTaiNguyenIOForm.setValue({
        macaptainguyen: this.obj.macaptainguyen,
        tencaptainguyen: this.obj.tencaptainguyen,
        nhomcaptainguyen: this.obj.nhomcaptainguyen,
        mota: this.obj.mota,
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
    if (!this.capTaiNguyenIOForm.value.matinh === true) {
      this.allHuyen = [];
      this.dvhcDistrictFilters = [];
      this.allXa = [];
      this.dvhcWardFilters = [];
      if (this.editMode === true) {
        this.capTaiNguyenIOForm.controls["mahuyen"].setValue("");
      }
    }
    if (!this.capTaiNguyenIOForm.value.matinh === false) {
      if (this.editMode === true) {
        this.capTaiNguyenIOForm.controls["mahuyen"].setValue("");
      }
      this.allXa = [];
      this.dvhcWardFilters = [];
      this.allHuyen = await this.dmFacadeService
        .getDistrictService()
        .getFetchAll({ matinh: this.capTaiNguyenIOForm.value.matinh });
      this.dvhcDistrictFilters = this.allHuyen;
    }
  }

  /**
   * Hàm lấy danh sách Dvhc Xã
   */
  async showDvhcXa() {
    if (!this.capTaiNguyenIOForm.value.mahuyen === true) {
      this.allXa = [];
      this.dvhcWardFilters = [];
      if (this.editMode === true) {
        this.capTaiNguyenIOForm.controls["maxa"].setValue("");
      }
    }
    if (
      !this.capTaiNguyenIOForm.value.matinh === false &&
      !this.capTaiNguyenIOForm.value.mahuyen === false
    ) {
      if (this.editMode === true) {
        this.capTaiNguyenIOForm.controls["maxa"].setValue("");
      }
      this.allXa = await this.dmFacadeService
        .getWardService()
        .getFetchAll({ mahuyen: this.capTaiNguyenIOForm.value.mahuyen });
      this.dvhcWardFilters = this.allXa;
    }
  }

  /**
   * Hàm thực thi chức năng add và edit
   */
  private addOrUpdate(operMode: string) {
    const dmFacadeService = this.dmFacadeService.getCapTaiNguyenService();
    this.inputModel = this.capTaiNguyenIOForm.value;
    if (operMode === "new") {
      dmFacadeService.addItem(this.inputModel).subscribe(
        (res) => this.matSidenavService.doParentFunction("getAllCapTaiNguyen"),
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
      const id: string = this.obj.id;
      this.inputModel.idcaptainguyen = id;
      dmFacadeService.updateItem(this.inputModel).subscribe(
        (res) => this.matSidenavService.doParentFunction("getAllCapTaiNguyen"),
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
    if (this.capTaiNguyenIOForm.valid === true) {
      this.addOrUpdate(operMode);
      this.matSidenavService.close();
    }
  }

  /**
   * Hàm reset form, gọi khi nhấn nút reset dữ liệu
   */
  public onFormReset() {
    // Hàm .reset sẽ xóa trắng mọi control trên form
    this.capTaiNguyenIOForm.reset();
  }

  /**
   * Hàm lưu và reset form để tiếp tục nhập mới dữ liệu. Trường hợp này khi người dùng muốn nhập dữ liệu liên tục
   * @param operMode 
   */
  async onContinueAdd(operMode: string) {
    this.logAllValidationErrorMessages();
    if (this.capTaiNguyenIOForm.valid === true) {
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
      this.capTaiNguyenIOForm,
      this.validationErrorMessages,
      this.formErrors
    );
  }

  /**
   * Hàm close sidenav
   */
  public closeCapTaiNguyenIOSidenav() {
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
