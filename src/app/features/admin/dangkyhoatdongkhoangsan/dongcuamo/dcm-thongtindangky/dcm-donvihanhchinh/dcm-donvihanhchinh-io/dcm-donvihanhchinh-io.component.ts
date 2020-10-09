import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {InputDkKhaiThacDvhc} from "src/app/models/admin/dangkyhoatdongkhoangsan/dkkhaithacdvhc.model";
import {OutputDmDvhcModel} from "src/app/models/admin/danhmuc/dvhc.model";
import {MatsidenavService} from "src/app/services/utilities/matsidenav.service";
import {DmFacadeService} from "src/app/services/admin/danhmuc/danhmuc-facade.service";
import {DangKyHoatDongKhoangSanFacadeService} from "src/app/services/admin/dangkyhoatdongkhoangsan/dangkyhoatdongkhoangsan-facade.service";
import {CommonServiceShared} from "src/app/services/utilities/common-service";
import {TranslateService} from "@ngx-translate/core";
import {TrangThaiEnum} from "src/app/shared/constants/enum";
import {HttpErrorResponse} from "@angular/common/http";
import {validationAllErrorMessagesService} from "src/app/services/utilities/validatorService";

@Component({
  selector: 'app-dcm-donvihanhchinh-io',
  templateUrl: './dcm-donvihanhchinh-io.component.html',
  styleUrls: ['./dcm-donvihanhchinh-io.component.scss']
})
export class DcmDonvihanhchinhIoComponent implements OnInit {

  // Chứa dữ liệu Form
  public dangKyKhaiThacDvhcIOForm: FormGroup;

  // Chứa dữ liệu đối tượng truyền từ list comp
  public obj: any;

  // Chứa kiểu form
  public purpose: string;

  // Chứa chế độ form
  public editMode: boolean;

  // Chứa dữ liệu input
  public inputModel: InputDkKhaiThacDvhc;

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

  // Chứa dữ liệu translate
  public dataTranslate: any;

  // Chứa trạng thái hiển thị của combobox trên layout
  public classColWithFiftyPercentForCombobox = false;

  // chứa thông tin combobox được backup trong trường hợp update
  public dataComboboxModel: any;

  public tenTinhDisplay: string;

  public tenHuyenDisplay: string;

  public tenXaDisplay: string;

  // error message
  validationErrorMessages = {};

  // form errors
  formErrors = {
    tinh: "",
    huyen: "",
    xa: ""
  };

  constructor(public matSidenavService: MatsidenavService,
              public dmFacadeService: DmFacadeService,
              private dangKyHoatDongKhoangSanFacadeService: DangKyHoatDongKhoangSanFacadeService,
              private formBuilder: FormBuilder,
              public commonService: CommonServiceShared,
              private translate: TranslateService) { }

  async ngOnInit() {
    // Khởi tạo form
    this.formInit();
    // Lấy dữ liệu translate
    await this.getDataTranslate();
    // Khởi tạo form theo dạng add or edit
    await this.bindingConfigAddOrUpdate();
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
      tinh: { required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkythamdodvhc.matinhRequired },
      huyen: { required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkythamdodvhc.mahuyenRequired },
      xa: { required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkythamdodvhc.maxaRequired }
    };
  }

  /**
   * Hàm khởi tạo form theo dạng edit
   */
  async bindingConfigAddOrUpdate() {
    await this.showDvhcTinh();
    this.editMode = false;
    this.inputModel = new InputDkKhaiThacDvhc();
    // check edit
    await this.formOnEdit();
  }

  /**
   * Hàm khởi tạo form
   */
  formInit() {
    this.dangKyKhaiThacDvhcIOForm = this.formBuilder.group({
      tinh: ["", Validators.required],
      tinhcombobox: [""],
      huyen: ["", Validators.required],
      huyencombobox: [""],
      xa: ["", Validators.required],
      xacombobox: [""]
    });
  }

  /**
   * hàm set value cho form
   */
  async formOnEdit() {
    if (this.obj && this.purpose === 'edit') {
      this.classColWithFiftyPercentForCombobox = true;
      this.dangKyKhaiThacDvhcIOForm.setValue({
        tinhcombobox: { idtinh: this.obj.idtinh, matinh: this.obj.matinh, tentinh: this.obj.tentinh },
        tinh: { idtinh: this.obj.idtinh, matinh: this.obj.matinh },
        huyencombobox: { idhuyen: this.obj.idhuyen, mahuyen: this.obj.mahuyen, tenhuyen: this.obj.tenhuyen },
        huyen: { idhuyen: this.obj.idhuyen, mahuyen: this.obj.mahuyen },
        xacombobox: { idxa: this.obj.idxa, maxa: this.obj.maxa, tenxa: this.obj.tenxa },
        xa: { idxa: this.obj.idxa, maxa: this.obj.maxa }
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
      this.editMode = true;
    }
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
    if (!this.dangKyKhaiThacDvhcIOForm.value.tinhcombobox) {
      this.allHuyen = [];
      this.dvhcDistrictFilters = [];
      this.allXa = [];
      this.dvhcWardFilters = [];
      if (this.editMode === true) {
        this.dangKyKhaiThacDvhcIOForm.controls.huyencombobox.setValue("");
      }
    }
    if (this.dangKyKhaiThacDvhcIOForm.value.tinhcombobox) {
      if (this.editMode === true) {
        this.dangKyKhaiThacDvhcIOForm.controls.huyencombobox.setValue("");
      }
      this.allXa = [];
      this.dvhcWardFilters = [];
      this.allHuyen = await this.dmFacadeService
        .getDistrictService()
        .getFetchAll({ IdTinh: this.dangKyKhaiThacDvhcIOForm.value.tinhcombobox.idtinh, Trangthai: TrangThaiEnum.Active });
      this.dvhcDistrictFilters = this.allHuyen;
    }

    this.selectTinh();
  }

  /**
   * Hàm lấy danh sách Dvhc Xã
   */
  async showDvhcXa() {
    if (!this.dangKyKhaiThacDvhcIOForm.value.huyencombobox) {
      this.allXa = [];
      this.dvhcWardFilters = [];
      if (this.editMode === true) {
        this.dangKyKhaiThacDvhcIOForm.controls.xacombobox.setValue("");
      }
    }
    if ( this.dangKyKhaiThacDvhcIOForm.value.tinhcombobox && this.dangKyKhaiThacDvhcIOForm.value.huyencombobox) {
      if (this.editMode === true) {
        this.dangKyKhaiThacDvhcIOForm.controls.xacombobox.setValue("");
      }
      this.allXa = await this.dmFacadeService
        .getWardService()
        .getFetchAll({ IdHuyen: this.dangKyKhaiThacDvhcIOForm.value.huyencombobox.idhuyen, Tranthai: TrangThaiEnum.Active });
      this.dvhcWardFilters = this.allXa;
    }

    this.selectHuyen();
  }

  /**
   * Hàm lấy tỉnh hiện tại
   */
  selectTinh() {
    if (this.obj && this.purpose === 'edit') {
      if (this.dangKyKhaiThacDvhcIOForm.value.tinhcombobox) {
        this.dangKyKhaiThacDvhcIOForm.controls.tinh.setValue({
          idtinh: this.dangKyKhaiThacDvhcIOForm.value.tinhcombobox.idtinh,
          matinh: this.dangKyKhaiThacDvhcIOForm.value.tinhcombobox.matinh
        });
        this.tenTinhDisplay = this.dangKyKhaiThacDvhcIOForm.value.tinhcombobox.tentinh;
        this.dangKyKhaiThacDvhcIOForm.controls.huyen.setValue("");
        this.tenHuyenDisplay = "";
        this.dangKyKhaiThacDvhcIOForm.controls.xa.setValue("");
        this.tenXaDisplay = "";
      } else {
        this.dangKyKhaiThacDvhcIOForm.controls.tinh.setValue({
          idtinh: this.dataComboboxModel.idtinh,
          matinh: this.dataComboboxModel.matinh
        });
        this.tenTinhDisplay = this.dataComboboxModel.tentinh;
        this.selectHuyen();
      }
    } else {
      this.dangKyKhaiThacDvhcIOForm.controls.tinh.setValue({
        idtinh: this.dangKyKhaiThacDvhcIOForm.value.tinhcombobox.idtinh,
        matinh: this.dangKyKhaiThacDvhcIOForm.value.tinhcombobox.matinh
      });
      this.tenTinhDisplay = "";
    }
  }

  /**
   * Hàm lấy tỉnh hiện tại
   */
  selectHuyen() {
    if (this.obj && this.purpose === 'edit') {
      if (this.dangKyKhaiThacDvhcIOForm.value.huyencombobox) {
        this.dangKyKhaiThacDvhcIOForm.controls.huyen.setValue({
          idhuyen: this.dangKyKhaiThacDvhcIOForm.value.huyencombobox.idhuyen,
          mahuyen: this.dangKyKhaiThacDvhcIOForm.value.huyencombobox.mahuyen
        });
        this.tenHuyenDisplay = this.dangKyKhaiThacDvhcIOForm.value.huyencombobox.tenhuyen;
        this.dangKyKhaiThacDvhcIOForm.controls.xa.setValue("");
        this.tenXaDisplay = "";
      } else {
        if (this.dangKyKhaiThacDvhcIOForm.value.tinhcombobox) {
          this.dangKyKhaiThacDvhcIOForm.controls.huyen.setValue("");
          this.tenHuyenDisplay = "";
        } else {
          this.dangKyKhaiThacDvhcIOForm.controls.huyen.setValue({
            idhuyen: this.dataComboboxModel.idhuyen,
            mahuyen: this.dataComboboxModel.mahuyen
          });
          this.tenHuyenDisplay = this.dataComboboxModel.tenhuyen;
        }
        this.dangKyKhaiThacDvhcIOForm.controls.xacombobox.setValue("");
        this.selectXa();
      }
    } else {
      this.dangKyKhaiThacDvhcIOForm.controls.huyen.setValue({
        idhuyen: this.dangKyKhaiThacDvhcIOForm.value.huyencombobox.idhuyen,
        mahuyen: this.dangKyKhaiThacDvhcIOForm.value.huyencombobox.mahuyen
      });
      this.tenHuyenDisplay = "";
    }
  }

  /**
   * Hàm lấy tỉnh hiện tại
   */
  selectXa() {
    if (this.obj && this.purpose === 'edit') {
      if (this.dangKyKhaiThacDvhcIOForm.value.xacombobox) {
        this.dangKyKhaiThacDvhcIOForm.controls.xa.setValue({
          idxa: this.dangKyKhaiThacDvhcIOForm.value.xacombobox.idxa,
          maxa: this.dangKyKhaiThacDvhcIOForm.value.xacombobox.maxa
        });
        this.tenXaDisplay = this.dangKyKhaiThacDvhcIOForm.value.xacombobox.tenxa;
      } else {
        if (this.dangKyKhaiThacDvhcIOForm.value.tinhcombobox || this.dangKyKhaiThacDvhcIOForm.value.huyencombobox) {
          this.dangKyKhaiThacDvhcIOForm.controls.xa.setValue("");
          this.tenXaDisplay = "";
        } else {
          this.dangKyKhaiThacDvhcIOForm.controls.xa.setValue({
            idxa: this.dataComboboxModel.idxa,
            maxa: this.dataComboboxModel.maxa
          });
          this.tenXaDisplay = this.dataComboboxModel.tenxa;
        }
      }
    } else {
      this.dangKyKhaiThacDvhcIOForm.controls.xa.setValue({
        idxa: this.dangKyKhaiThacDvhcIOForm.value.xacombobox.idxa,
        maxa: this.dangKyKhaiThacDvhcIOForm.value.xacombobox.maxa
      });
      this.tenXaDisplay = "";
    }
  }


  /**
   * Hàm thực thi chức năng add và edit
   */
  private addOrUpdate(operMode: string) {
    const dkKhaiThacDvhcService = this.dangKyHoatDongKhoangSanFacadeService.getDangKyKhaiThacDvhcService();
    // Gán dữ liệu input vào model
    const idtinh = this.dangKyKhaiThacDvhcIOForm.value.tinh.idtinh;
    const idhuyen = this.dangKyKhaiThacDvhcIOForm.value.huyen.idhuyen;
    const idxa = this.dangKyKhaiThacDvhcIOForm.value.xa.idxa;
    this.inputModel.matinh = this.dangKyKhaiThacDvhcIOForm.value.tinh.matinh;
    this.inputModel.mahuyen = this.dangKyKhaiThacDvhcIOForm.value.huyen.mahuyen;
    this.inputModel.maxa = this.dangKyKhaiThacDvhcIOForm.value.xa.maxa;
    this.inputModel.idtinh = idtinh;
    this.inputModel.idhuyen = idhuyen;
    this.inputModel.idxa = idxa ? idxa : "";
    this.inputModel.iddangkykhaithac = this.obj.iddangkykhaithac;
    if (operMode === "new") {
      dkKhaiThacDvhcService.addItem(this.inputModel).subscribe(
        (res) => this.matSidenavService.doParentFunction("getAllDangKyKhaiThacDvhc"),
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
      this.inputModel.idkhaithacdvhc = this.obj.idkhaithacdvhc;
      dkKhaiThacDvhcService.updateItem(this.inputModel).subscribe(
        (res) => this.matSidenavService.doParentFunction("getAllDangKyKhaiThacDvhc"),
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
    if (this.dangKyKhaiThacDvhcIOForm.valid === true) {
      this.addOrUpdate(operMode);
      this.matSidenavService.close();
    }
  }

  /**
   * Hàm reset form, gọi khi nhấn nút reset dữ liệu
   */
  public onFormReset() {
    // Hàm .reset sẽ xóa trắng mọi control trên form
    this.dangKyKhaiThacDvhcIOForm.reset();
  }

  /**
   * Hàm lưu và reset form để tiếp tục nhập mới dữ liệu. Trường hợp này khi người dùng muốn nhập dữ liệu liên tục
   * @param operMode
   */
  async onContinueAdd(operMode: string) {
    this.logAllValidationErrorMessages();
    if (this.dangKyKhaiThacDvhcIOForm.valid === true) {
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
      this.dangKyKhaiThacDvhcIOForm,
      this.validationErrorMessages,
      this.formErrors
    );
  }

  /**
   * Hàm close sidenav
   */
  public closeDkKhaiThacDvhcIOSidenav() {
    this.matSidenavService.close();
  }


  /**
   * Hàm check giá trị trong seletec option Tỉnh
   */
  public compareTinh(item1: any, item2: any) {
    if (item1.matinh === item2.matinh) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Hàm check giá trị trong seletec option Huyện
   */
  public compareHuyen(item1: any, item2: any) {
    if (item1.mahuyen === item2.mahuyen) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Hàm check giá trị trong seletec option Xã
   */
  public compareXa(item1: any, item2: any) {
    if (item1.maxa === item2.maxa) {
      return true;
    } else {
      return false;
    }
  }

}
