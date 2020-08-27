import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { HttpErrorResponse } from "@angular/common/http";

import { InputDmCoQuanQuanLyModel } from "src/app/models/admin/danhmuc/coquanquanly.model";
import { OutputDmDvhcModel } from "src/app/models/admin/danhmuc/dvhc.model";
import { TrangThai } from "src/app/shared/constants/trangthai-constants";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { DmFacadeService } from "src/app/services/admin/danhmuc/danhmuc-facade.service";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { validationAllErrorMessagesService } from "src/app/services/utilities/validatorService";

@Component({
  selector: 'app-coquanquanly-io',
  templateUrl: './coquanquanly-io.component.html',
  styleUrls: ['./coquanquanly-io.component.scss']
})
export class DmCoquanquanlyIoComponent implements OnInit {

  // Chứa dữ liệu Form
  public coQuanQuanLyIOForm: FormGroup;

  // Chứa dữ liệu đối tượng truyền từ list comp
  public obj: any;

  // Chứa kiểu form
  public purpose: string;

  // Chứa chế độ form
  public editMode: boolean;

  // Chứa dữ liệu input
  public inputModel: InputDmCoQuanQuanLyModel;

  // Chứa danh sách Dvhc Tỉnh
  public allTinh: any;

  // Chứa danh sách Dvhc Huyện
  public allHuyen: any;

  // Chứa danh sách Dvhc Xã
  public allXa: any;

  // Filter Đơn vị hành chính Tỉnh
  public dvhcProvinceFilters: OutputDmDvhcModel[];

  // Filter Đơn vị hành chính Huyện
  public dvhcDistrictFilters: OutputDmDvhcModel[];

  // Filter Đơn vị hành chính Xã
  public dvhcWardFilters: OutputDmDvhcModel[];

  // Chứa dữ liệu Trạng thái
  public trangthai = TrangThai;

  // Chứa kiểu boolean hiển thị thuộc tính column
  public classColDvhc: boolean = false;

  // Chứa dữ liệu translate
  public dataTranslate: any;

  // Chứa thông tin combobox được backup trong trường hợp update
  public dataComboboxModel: any;

  // Chứa tên hiển thị dvhc Tỉnh
  public tenTinhDisplay: string;

  // Chứa tên hiển thị dvhc Huyện
  public tenHuyenDisplay: string;

  // Chứa tên hiển thị dvhc Xã
  public tenXaDisplay: string;


  // error message
  validationErrorMessages = {};

  // form errors
  formErrors = {
    tencoquanquanly: "",
    diachi: "",
    macoquanquanly: "",
    fax: "",
    website: "",
    mota: "",
    dienthoai: "",
    email: "",
    tinh: "",
    huyen: "",
    xa: "",
    thutu: "",
  };

  // Contructor
  constructor(
    public matSidenavService: MatsidenavService,
    public dmFacadeService: DmFacadeService,
    private formBuilder: FormBuilder,
    public commonService: CommonServiceShared,
    private translate: TranslateService
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
      tencoquanquanly: { required: this.dataTranslate.DANHMUC.coquanquanly.tencoquanquanlyRequired },
      dienthoai: { pattern: this.dataTranslate.DANHMUC.coquanquanly.dienthoaiIsNumber },
      matinh: { required: this.dataTranslate.DANHMUC.coquanquanly.matinhRequired },
      mahuyen: { required: this.dataTranslate.DANHMUC.coquanquanly.mahuyenRequired },
      thutu: { pattern: this.dataTranslate.DANHMUC.coquanquanly.thutuIsNumber },
      email: { email: this.dataTranslate.DANHMUC.coquanquanly.emailCheck },
    };
  }

  /**
   * Hàm khởi tạo form theo dạng edit
   */
  bindingConfigAddOrUpdate() {
    this.showDvhcTinh();
    this.editMode = false;
    this.inputModel = new InputDmCoQuanQuanLyModel();
    // check edit
    this.formOnEdit();
  }

  /**
   * Hàm khởi tạo form
   */
  formInit() {
    this.coQuanQuanLyIOForm = this.formBuilder.group({
      tencoquanquanly: ["", Validators.required],
      macoquanquanly: [""],
      diachi: [""],
      fax: [""],
      website: [""],
      mota: [""],
      dienthoai: ["", Validators.pattern("^[0-9-+]+$")],
      email: ["", Validators.email],
      tinh: ["", Validators.required],
      tinhcombobox: [""],
      huyen: ["", Validators.required],
      huyencombobox: [""],
      xa: ["", Validators.required],
      xacombobox: [""],
      thutu: ["", Validators.pattern("^[0-9-+]+$")],
    });
  }

  /**
   * hàm set value cho form
   */
  async formOnEdit() {
    if (this.obj && this.purpose === 'edit') {
      this.classColDvhc = true;
      this.coQuanQuanLyIOForm.setValue({
        tencoquanquanly: this.obj.tencoquanquanly,
        diachi: this.obj.diachi,
        macoquanquanly: this.obj.macoquanquanly,
        fax: this.obj.fax,
        website: this.obj.website,
        mota: this.obj.mota,
        dienthoai: this.obj.dienthoai,
        email: this.obj.email,
        tinhcombobox: { idtinh: this.obj.idtinh, matinh: this.obj.matinh, tentinh: this.obj.tentinh },
        tinh: { idtinh: this.obj.idtinh, matinh: this.obj.matinh },
        huyencombobox: { idhuyen: this.obj.idhuyen, mahuyen: this.obj.mahuyen, tenhuyen: this.obj.tenhuyen },
        huyen: { idhuyen: this.obj.idhuyen, mahuyen: this.obj.mahuyen },
        xacombobox: { idxa: this.obj.idxa, maxa: this.obj.maxa, tenxa: this.obj.tenxa },
        xa: { idxa: this.obj.idxa, maxa: this.obj.maxa },
        thutu: this.obj.thutu,
      });

      this.dataComboboxModel = {
        idtinh: this.obj.idtinh,
        matinh: this.obj.matinh,
        tentinh: this.obj.tentinh,
        idhuyen: this.obj.idhuyen,
        mahuyen: this.obj.mahuyen,
        tenhuyen: this.obj.tenhuyen,
        idxa: this.obj.idxa,
        maxa: this.obj.maxa,
        tenxa: this.obj.tenxa
      };

      await this.showDvhcHuyen();
      await this.showDvhcXa();
      this.selectXa();
    }
    this.editMode = true;
  }

  /**
   * Hàm lấy danh sách Dvhc Tỉnh
   */
  async showDvhcTinh() {
    const allTinhData: any = await this.dmFacadeService
      .getProvinceService()
      .getFetchAll();
    this.allTinh = allTinhData;
    this.dvhcProvinceFilters = allTinhData;
  }

  /**
   * Hàm lấy danh sách Dvhc Huyện
   */
  async showDvhcHuyen() {
    if (!this.coQuanQuanLyIOForm.value.tinhcombobox === true) {
      this.allHuyen = [];
      this.dvhcDistrictFilters = [];
      this.allXa = [];
      this.dvhcWardFilters = [];
      if (this.editMode === true) {
        this.coQuanQuanLyIOForm.controls["huyencombobox"].setValue("");
      }
    }
    if (!this.coQuanQuanLyIOForm.value.tinhcombobox === false) {
      if (this.editMode === true) {
        this.coQuanQuanLyIOForm.controls["huyencombobox"].setValue("");
      }
      this.allXa = [];
      this.dvhcWardFilters = [];
      this.allHuyen = await this.dmFacadeService
        .getDistrictService()
        .getByid(this.coQuanQuanLyIOForm.value.tinhcombobox.idtinh).toPromise();
      this.dvhcDistrictFilters = this.allHuyen;
    }

    this.selectTinh();
  }

  /**
   * Hàm lấy danh sách Dvhc Xã
   */
  async showDvhcXa() {
    if (!this.coQuanQuanLyIOForm.value.huyencombobox === true) {
      this.allXa = [];
      this.dvhcWardFilters = [];
      if (this.editMode === true) {
        this.coQuanQuanLyIOForm.controls["xacombobox"].setValue("");
      }
    }
    if (
      !this.coQuanQuanLyIOForm.value.tinhcombobox === false &&
      !this.coQuanQuanLyIOForm.value.huyencombobox === false
    ) {
      if (this.editMode === true) {
        this.coQuanQuanLyIOForm.controls["xacombobox"].setValue("");
      }
      this.allXa = await this.dmFacadeService
        .getWardService()
        .getByid(this.coQuanQuanLyIOForm.value.huyencombobox.idhuyen).toPromise();
      this.dvhcWardFilters = this.allXa;
    }

    this.selectHuyen();
  }

  /**
   * Hàm lấy tỉnh hiện tại
   */
  selectTinh() {
    if (this.obj && this.purpose === 'edit') {
      if (this.coQuanQuanLyIOForm.value.tinhcombobox) {
        this.coQuanQuanLyIOForm.controls["tinh"].setValue({
          idtinh: this.coQuanQuanLyIOForm.value.tinhcombobox.idtinh,
          matinh: this.coQuanQuanLyIOForm.value.tinhcombobox.matinh
        });
        this.tenTinhDisplay = this.coQuanQuanLyIOForm.value.tinhcombobox.tentinh;
        this.coQuanQuanLyIOForm.controls["huyen"].setValue("");
        this.tenHuyenDisplay = "";
        this.coQuanQuanLyIOForm.controls["xa"].setValue("");
        this.tenXaDisplay = "";
      } else {
        this.coQuanQuanLyIOForm.controls["tinh"].setValue({
          idtinh: this.dataComboboxModel.idtinh,
          matinh: this.dataComboboxModel.matinh
        });
        this.tenTinhDisplay = this.dataComboboxModel.tentinh;
        this.selectHuyen();
      }
    } else {
      this.coQuanQuanLyIOForm.controls["tinh"].setValue({
        idtinh: this.coQuanQuanLyIOForm.value.tinhcombobox.idtinh,
        matinh: this.coQuanQuanLyIOForm.value.tinhcombobox.matinh
      });
      this.tenTinhDisplay = "";
    }
  }

  /**
   * Hàm lấy tỉnh hiện tại
   */
  selectHuyen() {
    if (this.obj && this.purpose === 'edit') {
      if (this.coQuanQuanLyIOForm.value.huyencombobox) {
        this.coQuanQuanLyIOForm.controls["huyen"].setValue({
          idhuyen: this.coQuanQuanLyIOForm.value.huyencombobox.idhuyen,
          mahuyen: this.coQuanQuanLyIOForm.value.huyencombobox.mahuyen
        });
        this.tenHuyenDisplay = this.coQuanQuanLyIOForm.value.huyencombobox.tenhuyen;
        this.coQuanQuanLyIOForm.controls["xa"].setValue("");
        this.tenXaDisplay = "";
      } else {
        if (this.coQuanQuanLyIOForm.value.tinhcombobox) {
          this.coQuanQuanLyIOForm.controls["huyen"].setValue("");
          this.tenHuyenDisplay = "";
        } else {
          this.coQuanQuanLyIOForm.controls["huyen"].setValue({
            idhuyen: this.dataComboboxModel.idhuyen,
            mahuyen: this.dataComboboxModel.mahuyen
          });
          this.tenHuyenDisplay = this.dataComboboxModel.tenhuyen;
        }
        this.coQuanQuanLyIOForm.controls["xacombobox"].setValue("");
        this.selectXa();
      }
    } else {
      this.coQuanQuanLyIOForm.controls["huyen"].setValue({
        idhuyen: this.coQuanQuanLyIOForm.value.huyencombobox.idhuyen,
        mahuyen: this.coQuanQuanLyIOForm.value.huyencombobox.mahuyen
      });
      this.tenHuyenDisplay = "";
    }
  }

  /**
   * Hàm lấy tỉnh hiện tại
   */
  selectXa() {
    if (this.obj && this.purpose === 'edit') {
      if (this.coQuanQuanLyIOForm.value.xacombobox) {
        this.coQuanQuanLyIOForm.controls["xa"].setValue({
          idxa: this.coQuanQuanLyIOForm.value.xacombobox.idxa,
          maxa: this.coQuanQuanLyIOForm.value.xacombobox.maxa
        });
        this.tenXaDisplay = this.coQuanQuanLyIOForm.value.xacombobox.tenxa;
      } else {
        if (this.coQuanQuanLyIOForm.value.tinhcombobox || this.coQuanQuanLyIOForm.value.huyencombobox) {
          this.coQuanQuanLyIOForm.controls["xa"].setValue("");
          this.tenXaDisplay = "";
        } else {
          this.coQuanQuanLyIOForm.controls["xa"].setValue({
            idxa: this.dataComboboxModel.idxa,
            maxa: this.dataComboboxModel.maxa
          });
          this.tenXaDisplay = this.dataComboboxModel.tenxa;
        }
      }
    } else {
      this.coQuanQuanLyIOForm.controls["xa"].setValue({
        idxa: this.coQuanQuanLyIOForm.value.xacombobox.idxa,
        maxa: this.coQuanQuanLyIOForm.value.xacombobox.maxa
      });
      this.tenXaDisplay = "";
    }
  }

  /**
   * Hàm thực thi chức năng add và edit
   */
  private addOrUpdate(operMode: string) {
    const dmFacadeService = this.dmFacadeService.getDmCoQuanQuanLyService();
    const idtinh = this.coQuanQuanLyIOForm.value.tinh.idtinh;
    const idhuyen = this.coQuanQuanLyIOForm.value.huyen.idhuyen;
    const idxa = this.coQuanQuanLyIOForm.value.xa.idxa;
    this.inputModel = this.coQuanQuanLyIOForm.value;
    this.inputModel.matinh = this.coQuanQuanLyIOForm.value.tinh.matinh;
    this.inputModel.mahuyen = this.coQuanQuanLyIOForm.value.huyen.mahuyen;
    this.inputModel.maxa = this.coQuanQuanLyIOForm.value.xa.maxa;
    this.inputModel.idtinh = idtinh;
    this.inputModel.idhuyen = idhuyen;
    this.inputModel.idxa = idxa ? idxa : "";
    if (operMode === "new") {
      dmFacadeService.addItem(this.inputModel).subscribe(
        (res) => this.matSidenavService.doParentFunction("getAllCoQuanQuanLy"),
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
      this.inputModel.idcoquanquanly = this.obj.idcoquanquanly;
      this.inputModel.trangthai = this.obj.trangthai;
      dmFacadeService.updateItem(this.inputModel).subscribe(
        (res) => this.matSidenavService.doParentFunction("getAllCoQuanQuanLy"),
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
    if (this.coQuanQuanLyIOForm.valid === true) {
      this.addOrUpdate(operMode);
      this.matSidenavService.close();
    }
  }

  /**
   * Hàm reset form, gọi khi nhấn nút reset dữ liệu
   */
  public onFormReset() {
    // Hàm .reset sẽ xóa trắng mọi control trên form
    this.coQuanQuanLyIOForm.reset({
      tencoquanquanly: "",
      diachi: "",
      macoquanquanly: "",
      fax: "",
      website: "",
      mota: "",
      dienthoai: "",
      email: "",
      tinh: "",
      mahuyen: "",
      maxa: "",
      thutu: "",
    });
  }

  /**
   * Hàm lưu và reset form để tiếp tục nhập mới dữ liệu. Trường hợp này khi người dùng muốn nhập dữ liệu liên tục
   * @param operMode 
   */
  async onContinueAdd(operMode: string) {
    this.logAllValidationErrorMessages();
    if (this.coQuanQuanLyIOForm.valid === true) {
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
      this.coQuanQuanLyIOForm,
      this.validationErrorMessages,
      this.formErrors
    );
  }

  /**
  * Hàm check giá trị trong seletec option Tỉnh
  */
  public compareTinh(item1: any, item2: any) {
    if (item1.matinh === item2.matinh) {
      return true;
    } else {
      return false
    }
  }

  /**
   * Hàm check giá trị trong seletec option Huyện
   */
  public compareHuyen(item1: any, item2: any) {
    if (item1.mahuyen === item2.mahuyen) {
      return true;
    } else {
      return false
    }
  }

  /**
   * Hàm check giá trị trong seletec option Xã
   */
  public compareXa(item1: any, item2: any) {
    if (item1.maxa === item2.maxa) {
      return true;
    } else {
      return false
    }
  }

  /**
   * Hàm close sidenav
   */
  public closeCoQuanQuanLyIOSidenav() {
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
