import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpErrorResponse } from "@angular/common/http";
import { TranslateService } from "@ngx-translate/core";
import { DatePipe } from "@angular/common";

import { InputDmCanhanModel } from "src/app/models/admin/danhmuc/canhan.model";
import { OutputDmDvhcModel } from "src/app/models/admin/danhmuc/dvhc.model";
import { DmFacadeService } from "src/app/services/admin/danhmuc/danhmuc-facade.service";
import { validationAllErrorMessagesService } from "src/app/services/utilities/validatorService";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { LoaiGiayTo } from "src/app/shared/constants/loaigiayto-constants";
import { TrangThai } from "src/app/shared/constants/trangthai-constants";

import { TrangThaiEnum } from "src/app/shared/constants/enum";

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
  public inputModel: InputDmCanhanModel;

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

  // Chứa dữ liệu loại giấy tờ
  public loaigiayto = LoaiGiayTo;

  // Chứa dữ liệu Trạng thái
  public trangthai = TrangThai;

  // Chứa dữ liệu translate
  public dataTranslate: any;

  // Chứa kiểu boolean hiển thị thuộc tính column
  public classColDvhc: boolean = false;

  // error message
  validationErrorMessages = {};

  // Chứa thông tin combobox được backup trong trường hợp update
  public dataComboboxModel: any;

  // Chứa tên hiển thị dvhc Tỉnh
  public tenTinhDisplay: string;

  // Chứa tên hiển thị dvhc Huyện
  public tenHuyenDisplay: string;

  // Chứa tên hiển thị dvhc Xã
  public tenXaDisplay: string;

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
    tinh: "",
    huyen: "",
    xa: "",
    tinhcombobox: "",
    huyencombobox: "",
    xacombobox: "",
    thutu: "",
  };

  // Contructor
  constructor(
    public matSidenavService: MatsidenavService,
    public dmFacadeService: DmFacadeService,
    private formBuilder: FormBuilder,
    public commonService: CommonServiceShared,
    private translate: TranslateService,
    public datePipe: DatePipe
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
      hovaten: { required: this.dataTranslate.DANHMUC.canhan.hovatenRequired },
      dienthoai: {
        required: this.dataTranslate.DANHMUC.canhan.dienthoaiRequired,
        pattern: this.dataTranslate.DANHMUC.canhan.dienthoaiIsNumber
      },
      tinh: { required: this.dataTranslate.DANHMUC.canhan.matinhRequired },
      huyen: { required: this.dataTranslate.DANHMUC.canhan.mahuyenRequired },
      xa: { required: this.dataTranslate.DANHMUC.canhan.maxaRequired },
      email: {
        required: this.dataTranslate.DANHMUC.canhan.emailRequired,
        email: this.dataTranslate.DANHMUC.canhan.emailCheck
      },
      thutu: { pattern: this.dataTranslate.DANHMUC.canhan.thutuIsNumber }
    };
  }

  /**
   * Hàm khởi tạo form theo dạng edit
   */
  bindingConfigAddOrUpdate() {
    this.showDvhcTinh();
    this.editMode = false;
    this.inputModel = new InputDmCanhanModel();
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
      dienthoai: ["", [Validators.required, Validators.pattern("^[0-9-+]+$")]],
      email: ["", [Validators.required, Validators.email]],
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
      this.canhanIOForm.setValue({
        hovaten: this.obj.hovaten,
        diachi: this.obj.diachi,
        sogiayto: this.obj.sogiayto,
        loaigiayto: this.obj.loaigiayto,
        ngaycap: this.obj.ngaycap,
        noicap: this.obj.noicap,
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
      .getFetchAll({ Trangthai: TrangThaiEnum.Active });
    this.allTinh = allTinhData;
    this.dvhcProvinceFilters = allTinhData;
  }

  /**
   * Hàm lấy danh sách Dvhc Huyện
   */
  async showDvhcHuyen() {
    if (!this.canhanIOForm.value.tinhcombobox === true) {
      this.allHuyen = [];
      this.dvhcDistrictFilters = [];
      this.allXa = [];
      this.dvhcWardFilters = [];
      if (this.editMode === true) {
        this.canhanIOForm.controls["huyencombobox"].setValue("");
      }
    }
    if (!this.canhanIOForm.value.tinhcombobox === false) {
      if (this.editMode === true) {
        this.canhanIOForm.controls["huyencombobox"].setValue("");
      }
      this.allXa = [];
      this.dvhcWardFilters = [];
      this.allHuyen = await this.dmFacadeService
        .getDistrictService()
        .getFetchAll({ IdTinh: this.canhanIOForm.value.tinhcombobox.idtinh, Trangthai: TrangThaiEnum.Active });
      this.dvhcDistrictFilters = this.allHuyen;
    }

    this.selectTinh();
  }

  /**
   * Hàm lấy danh sách Dvhc Xã
   */
  async showDvhcXa() {
    if (!this.canhanIOForm.value.huyencombobox === true) {
      this.allXa = [];
      this.dvhcWardFilters = [];
      if (this.editMode === true) {
        this.canhanIOForm.controls["xacombobox"].setValue("");
      }
    }
    if (
      !this.canhanIOForm.value.tinhcombobox === false &&
      !this.canhanIOForm.value.huyencombobox === false
    ) {
      if (this.editMode === true) {
        this.canhanIOForm.controls["xacombobox"].setValue("");
      }
      this.allXa = await this.dmFacadeService
        .getWardService()
        .getFetchAll({ IdHuyen: this.canhanIOForm.value.huyencombobox.idhuyen, Trangthai: TrangThaiEnum.Active });
      this.dvhcWardFilters = this.allXa;
    }

    this.selectHuyen();
  }

  /**
   * Hàm lấy tỉnh hiện tại
   */
  selectTinh() {
    if (this.obj && this.purpose === 'edit') {
      if (this.canhanIOForm.value.tinhcombobox) {
        this.canhanIOForm.controls["tinh"].setValue({
          idtinh: this.canhanIOForm.value.tinhcombobox.idtinh,
          matinh: this.canhanIOForm.value.tinhcombobox.matinh
        });
        this.tenTinhDisplay = this.canhanIOForm.value.tinhcombobox.tentinh;
        this.canhanIOForm.controls["huyen"].setValue("");
        this.tenHuyenDisplay = "";
        this.canhanIOForm.controls["xa"].setValue("");
        this.tenXaDisplay = "";
      } else {
        this.canhanIOForm.controls["tinh"].setValue({
          idtinh: this.dataComboboxModel.idtinh,
          matinh: this.dataComboboxModel.matinh
        });
        this.tenTinhDisplay = this.dataComboboxModel.tentinh;
        this.selectHuyen();
      }
    } else {
      this.canhanIOForm.controls["tinh"].setValue({
        idtinh: this.canhanIOForm.value.tinhcombobox.idtinh,
        matinh: this.canhanIOForm.value.tinhcombobox.matinh
      });
      this.tenTinhDisplay = "";
    }
  }

  /**
   * Hàm lấy tỉnh hiện tại
   */
  selectHuyen() {
    if (this.obj && this.purpose === 'edit') {
      if (this.canhanIOForm.value.huyencombobox) {
        this.canhanIOForm.controls["huyen"].setValue({
          idhuyen: this.canhanIOForm.value.huyencombobox.idhuyen,
          mahuyen: this.canhanIOForm.value.huyencombobox.mahuyen
        });
        this.tenHuyenDisplay = this.canhanIOForm.value.huyencombobox.tenhuyen;
        this.canhanIOForm.controls["xa"].setValue("");
        this.tenXaDisplay = "";
      } else {
        if (this.canhanIOForm.value.tinhcombobox) {
          this.canhanIOForm.controls["huyen"].setValue("");
          this.tenHuyenDisplay = "";
        } else {
          this.canhanIOForm.controls["huyen"].setValue({
            idhuyen: this.dataComboboxModel.idhuyen,
            mahuyen: this.dataComboboxModel.mahuyen
          });
          this.tenHuyenDisplay = this.dataComboboxModel.tenhuyen;
        }
        this.canhanIOForm.controls["xacombobox"].setValue("");
        this.selectXa();
      }
    } else {
      this.canhanIOForm.controls["huyen"].setValue({
        idhuyen: this.canhanIOForm.value.huyencombobox.idhuyen,
        mahuyen: this.canhanIOForm.value.huyencombobox.mahuyen
      });
      this.tenHuyenDisplay = "";
    }
  }

  /**
   * Hàm lấy tỉnh hiện tại
   */
  selectXa() {
    if (this.obj && this.purpose === 'edit') {
      if (this.canhanIOForm.value.xacombobox) {
        this.canhanIOForm.controls["xa"].setValue({
          idxa: this.canhanIOForm.value.xacombobox.idxa,
          maxa: this.canhanIOForm.value.xacombobox.maxa
        });
        this.tenXaDisplay = this.canhanIOForm.value.xacombobox.tenxa;
      } else {
        if (this.canhanIOForm.value.tinhcombobox || this.canhanIOForm.value.huyencombobox) {
          this.canhanIOForm.controls["xa"].setValue("");
          this.tenXaDisplay = "";
        } else {
          this.canhanIOForm.controls["xa"].setValue({
            idxa: this.dataComboboxModel.idxa,
            maxa: this.dataComboboxModel.maxa
          });
          this.tenXaDisplay = this.dataComboboxModel.tenxa;
        }
      }
    } else {
      this.canhanIOForm.controls["xa"].setValue({
        idxa: this.canhanIOForm.value.xacombobox.idxa,
        maxa: this.canhanIOForm.value.xacombobox.maxa
      });
      this.tenXaDisplay = "";
    }
  }

  /**
   * Hàm thực thi chức năng add và edit
   */
  private addOrUpdate(operMode: string) {
    // Gán dữ liệu input vào model
    const idtinh = this.canhanIOForm.value.tinh.idtinh;
    const idhuyen = this.canhanIOForm.value.huyen.idhuyen;
    const idxa = this.canhanIOForm.value.xa.idxa;
    const dmFacadeService = this.dmFacadeService.getDmCanhanService();
    this.inputModel = this.canhanIOForm.value;
    this.inputModel.matinh = this.canhanIOForm.value.tinh.matinh;
    this.inputModel.mahuyen = this.canhanIOForm.value.huyen.mahuyen;
    this.inputModel.maxa = this.canhanIOForm.value.xa.maxa;
    this.inputModel.idtinh = idtinh;
    this.inputModel.idhuyen = idhuyen;
    this.inputModel.idxa = idxa ? idxa : "";
    this.inputModel.ngaycap = this.datePipe.transform(this.canhanIOForm.value.ngaycap, "yyyy-MM-dd");
    if (operMode === "new") {
      dmFacadeService.addItem(this.inputModel).subscribe(
        (res) => this.matSidenavService.doParentFunction("getAllCanhan"),
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
      this.inputModel.idcanhan = this.obj.idcanhan;
      this.inputModel.trangthai = this.obj.trangthai;
      dmFacadeService.updateItem(this.inputModel).subscribe(
        (res) => this.matSidenavService.doParentFunction("getAllCanhan"),
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
    this.canhanIOForm.reset({
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
      thutu: "",
    });
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
