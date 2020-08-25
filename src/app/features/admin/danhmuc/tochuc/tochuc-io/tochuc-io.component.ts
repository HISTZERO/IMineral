import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { HttpErrorResponse } from "@angular/common/http";
import { DatePipe } from "@angular/common";

import { InputDmToChucModel } from "src/app/models/admin/danhmuc/tochuc.model";
import { OutputDmDvhcModel } from "src/app/models/admin/danhmuc/dvhc.model";
import { TrangThai } from "src/app/shared/constants/trangthai-constants";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { DmFacadeService } from "src/app/services/admin/danhmuc/danhmuc-facade.service";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { validationAllErrorMessagesService } from "src/app/services/utilities/validatorService";
import { LoaiGiayTo } from "src/app/shared/constants/loaigiayto-constants";
import { OutputDmLoaiToChucModel } from "src/app/models/admin/danhmuc/loaitochuc.model";
import { TrangThaiEnum } from 'src/app/shared/constants/enum';

@Component({
  selector: 'app-tochuc-io',
  templateUrl: './tochuc-io.component.html',
  styleUrls: ['./tochuc-io.component.scss']
})
export class DmTochucIoComponent implements OnInit {

  // Chứa dữ liệu Form
  public tochucIOForm: FormGroup;

  // Chứa dữ liệu đối tượng truyền từ list comp
  public obj: any;

  // Chứa kiểu form
  public purpose: string;

  // Chứa chế độ form
  public editMode: boolean;

  // Chứa dữ liệu input
  public inputModel: InputDmToChucModel;

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

  // Chứa danh sách loại tổ chức
  public listLoaiToChuc: OutputDmLoaiToChucModel[];

  // Chứa danh sách loại tổ chức Filter
  public listLoaiToChucFilter: OutputDmLoaiToChucModel[];

  // Chứa dữ liệu Trạng thái
  public trangthai = TrangThai;

  // Chứa loại giấy tờ
  public loaigiayto = LoaiGiayTo;

  // Chứa dữ liệu translate
  public dataTranslate: any;

  // Chứa trạng thái hiển thị của combobox trên layout
  public classColWithFiftyPercentForCombobox  = false;

  // chứa thông tin combobox được backup trong trường hợp update
  public dataComboboxModel: any;

  public tenLoaiToChucDisplay: string;
  public tenTinhDisplay: string;
  public tenHuyenDisplay: string;
  public tenXaDisplay: string;

  // error message
  validationErrorMessages = {};

  // form errors
  formErrors = {
    tentochuc: "",
    diachi: "",
    sogiayto: "",
    loaigiayto: "",
    ngaycap: "",
    noicap: "",
    fax: "",
    website: "",
    idloaitochuc: "",
    dienthoai: "",
    email: "",
    tinh: "",
    huyen: "",
    xa: "",
    trangthai: "",
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
  ) {}

  async ngOnInit() {
    // Khởi tạo form
    this.formInit();
    // Khởi tạo form theo dạng add or edit
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
     tentochuc: { required: this.dataTranslate.DANHMUC.tochuc.tentochucRequired },
     diachi: { required: this.dataTranslate.DANHMUC.tochuc.diachitochucRequired },
     sogiayto: { required: this.dataTranslate.DANHMUC.tochuc.sogiaytoRequired },
     loaigiayto: { required: this.dataTranslate.DANHMUC.tochuc.loaigiaytoRequired },
     ngaycap: { required: this.dataTranslate.DANHMUC.tochuc.ngaycapRequired },
     noicap: { required: this.dataTranslate.DANHMUC.tochuc.noicapRequired },
     idloaitochuc: { required: this.dataTranslate.DANHMUC.tochuc.loaitochucRequired },
     dienthoai: { pattern: this.dataTranslate.DANHMUC.tochuc.dienthoaiIsNumber},
     tinh: { required: this.dataTranslate.DANHMUC.tochuc.matinhRequired },
     huyen: { required: this.dataTranslate.DANHMUC.tochuc.mahuyenRequired },
     xa: { required: this.dataTranslate.DANHMUC.tochuc.maxaRequired },
     thutu: { pattern: this.dataTranslate.DANHMUC.tochuc.thutuIsNumber },
     email: { email: this.dataTranslate.DANHMUC.tochuc.emailCheck}
    };
  }

  /**
   * Hàm lấy dữ liệu loại tổ chức
   */
  async getAllLoaiToChuc() {
    const listData: any = await this.dmFacadeService
      .getDmLoaiToChucService()
      .getFetchAll({Trangthai: TrangThaiEnum.Active, PageNumber: 1, PageSize: -1 });
    this.listLoaiToChuc = listData.items;
  }

  /**
   * Hàm khởi tạo form theo dạng edit
   */
  async bindingConfigAddOrUpdate() {
    await this.showDvhcTinh();
    this.editMode = false;
    this.inputModel = new InputDmToChucModel();
    // check edit
    await this.formOnEdit();
    this.getAllLoaiToChuc();
  }

  /**
   * Hàm khởi tạo form
   */
  formInit() {
    this.tochucIOForm = this.formBuilder.group({
      tentochuc: ["", Validators.required],
      diachi: ["", Validators.required],
      sogiayto: ["", Validators.required],
      loaigiayto: ["", Validators.required],
      ngaycap: ["", Validators.required],
      noicap: ["", Validators.required],
      idloaitochuc: ["", Validators.required],
      loaitochuccombobox: [""],
      fax: [""],
      website: [""],
      dienthoai: ["", Validators.pattern("^[0-9-+]+$")],
      email: ["", Validators.email],
      tinh: ["", Validators.required],
      tinhcombobox: [""],
      huyen: ["", Validators.required],
      huyencombobox: [""],
      xa: ["",  Validators.required],
      xacombobox: [""],
      trangthai: [""],
      thutu: ["", Validators.pattern("^[0-9-+]+$")],
    });
  }

  /**
   * hàm set value cho form
   */
  async formOnEdit() {
    if (this.obj && this.purpose === 'edit') {
      this.classColWithFiftyPercentForCombobox = true;
      this.tochucIOForm.setValue({
        tentochuc: this.obj.tentochuc,
        diachi: this.obj.diachi,
        sogiayto: this.obj.sogiayto,
        loaigiayto: this.obj.loaigiayto,
        ngaycap: this.obj.ngaycap,
        noicap: this.obj.noicap,
        idloaitochuc: this.obj.idloaitochuc,
        loaitochuccombobox: {idloaitochuc: this.obj.idloaitochuc, tenloaitochuc: this.obj.tenloaitochuc},
        fax: this.obj.fax,
        website: this.obj.website,
        dienthoai: this.obj.dienthoai,
        email: this.obj.email,
        tinhcombobox: {idtinh: this.obj.idtinh, matinh: this.obj.matinh, tentinh: this.obj.tentinh},
        tinh: {idtinh: this.obj.idtinh, matinh: this.obj.matinh},
        huyencombobox: {idhuyen: this.obj.idhuyen, mahuyen: this.obj.mahuyen, tenhuyen: this.obj.tenhuyen},
        huyen: {idhuyen: this.obj.idhuyen, mahuyen: this.obj.mahuyen},
        xacombobox: {idxa: this.obj.idxa, maxa: this.obj.maxa, tenxa: this.obj.tenxa},
        xa: {idxa: this.obj.idxa, maxa: this.obj.maxa},
        trangthai: this.obj.trangthai,
        thutu: this.obj.thutu,
      });

      this.dataComboboxModel = {
                                  idloaitochuc: this.obj.idloaitochuc,
                                  tenloaitochuc: this.obj.tenloaitochuc,
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

      this.tenLoaiToChucDisplay = this.obj.tenloaitochuc;
      await this.showDvhcHuyen();
      await this.showDvhcXa();
      this.selectXa();
    }
    this.editMode = true;
  }

  /**
   * Hàm lấy loại tổ chức hiện tại tử commbobox
   */
  async selectLoaiToChuc() {
    if (this.obj && this.purpose === 'edit') {
      if (this.tochucIOForm.value.loaitochuccombobox) {
        this.tochucIOForm.controls["idloaitochuc"].setValue(this.tochucIOForm.value.loaitochuccombobox.idloaitochuc);
        this.tenLoaiToChucDisplay = this.tochucIOForm.value.loaitochuccombobox.tenloaitochuc;
      } else {
        this.tochucIOForm.controls["idloaitochuc"].setValue(this.dataComboboxModel.idloaitochuc);
        this.tenLoaiToChucDisplay = this.dataComboboxModel.tenloaitochuc;
      }
    } else {
      this.tochucIOForm.controls["idloaitochuc"].setValue(this.tochucIOForm.value.loaitochuccombobox.idloaitochuc);
      this.tenLoaiToChucDisplay = "";
    }
  }

  /**
   * Hàm lấy danh sách Dvhc Tỉnh
   */
  async showDvhcTinh() {
    const allTinhData: any = await this.dmFacadeService
      .getProvinceService()
      .getFetchAll({ PageNumber: 1, PageSize: -1 });
    this.allTinh = allTinhData;
    this.dvhcProvinceFilters = allTinhData;
  }

  /**
   * Hàm lấy danh sách Dvhc Huyện
   */
  async showDvhcHuyen() {
    if (!this.tochucIOForm.value.tinhcombobox === true) {
      this.allHuyen = [];
      this.dvhcDistrictFilters = [];
      this.allXa = [];
      this.dvhcWardFilters = [];
      if (this.editMode === true) {
        this.tochucIOForm.controls["huyencombobox"].setValue("");
      }
    }
    if (!this.tochucIOForm.value.tinhcombobox === false) {
      if (this.editMode === true) {
        this.tochucIOForm.controls["huyencombobox"].setValue("");
      }
      this.allXa = [];
      this.dvhcWardFilters = [];
      this.allHuyen = await this.dmFacadeService
        .getDistrictService()
        .getByid(this.tochucIOForm.value.tinhcombobox.idtinh).toPromise();
      this.dvhcDistrictFilters = this.allHuyen;
    }

    this.selectTinh();
  }

  /**
   * Hàm lấy danh sách Dvhc Xã
   */
  async showDvhcXa() {
    if (!this.tochucIOForm.value.huyencombobox === true) {
      this.allXa = [];
      this.dvhcWardFilters = [];
      if (this.editMode === true) {
        this.tochucIOForm.controls["xacombobox"].setValue("");
      }
    }
    if (
      !this.tochucIOForm.value.tinhcombobox === false &&
      !this.tochucIOForm.value.huyencombobox === false
    ) {
      if (this.editMode === true) {
        this.tochucIOForm.controls["xacombobox"].setValue("");
      }
      this.allXa = await this.dmFacadeService
        .getWardService()
        .getByid(this.tochucIOForm.value.huyencombobox.idhuyen).toPromise();
      this.dvhcWardFilters = this.allXa;
    }

    this.selectHuyen();
  }

  /**
   * Hàm lấy tỉnh hiện tại
   */
  selectTinh() {
    if (this.obj && this.purpose === 'edit') {
      if (this.tochucIOForm.value.tinhcombobox !== "") {
        this.tochucIOForm.controls["tinh"].setValue({
                                                      idtinh: this.tochucIOForm.value.tinhcombobox.idtinh,
                                                      matinh: this.tochucIOForm.value.tinhcombobox.matinh
                                                    });
        this.tenTinhDisplay = this.tochucIOForm.value.tinhcombobox.tentinh;
        this.tochucIOForm.controls["huyen"].setValue("");
        this.tenHuyenDisplay = "";
        this.tochucIOForm.controls["xa"].setValue("");
        this.tenXaDisplay = "";
      } else {
        this.tochucIOForm.controls["tinh"].setValue({
                                                      idtinh: this.dataComboboxModel.idtinh,
                                                      matinh: this.dataComboboxModel.matinh
                                                    });
        this.tenTinhDisplay = this.dataComboboxModel.tentinh;
        this.selectHuyen();
      }
    } else {
      this.tochucIOForm.controls["tinh"].setValue({
                                                    idtinh: this.tochucIOForm.value.tinhcombobox.idtinh,
                                                    matinh: this.tochucIOForm.value.tinhcombobox.matinh
                                                  });
      this.tenTinhDisplay = "";
    }
  }

  /**
   * Hàm lấy tỉnh hiện tại
   */
  selectHuyen() {
    if (this.obj && this.purpose === 'edit') {
      if (this.tochucIOForm.value.huyencombobox !== "") {
        this.tochucIOForm.controls["huyen"].setValue({
                                                      idhuyen: this.tochucIOForm.value.huyencombobox.idhuyen,
                                                      mahuyen: this.tochucIOForm.value.huyencombobox.mahuyen
                                                    });
        this.tenHuyenDisplay = this.tochucIOForm.value.huyencombobox.tenhuyen;
        this.tochucIOForm.controls["xa"].setValue("");
        this.tenXaDisplay = "";
      } else {
        if (this.tochucIOForm.value.tinhcombobox !== "") {
          this.tochucIOForm.controls["huyen"].setValue("");
          this.tenHuyenDisplay = "";
        } else {
          this.tochucIOForm.controls["huyen"].setValue({
            idhuyen: this.dataComboboxModel.idhuyen,
            mahuyen: this.dataComboboxModel.mahuyen
          });
          this.tenHuyenDisplay = this.dataComboboxModel.tenhuyen;
        }
        this.tochucIOForm.controls["xacombobox"].setValue("");
        this.selectXa();
      }
    } else {
      this.tochucIOForm.controls["huyen"].setValue({
                                                    idhuyen: this.tochucIOForm.value.huyencombobox.idhuyen,
                                                    mahuyen: this.tochucIOForm.value.huyencombobox.mahuyen
                                                  });
      this.tenHuyenDisplay = "";
    }
  }

  /**
   * Hàm lấy tỉnh hiện tại
   */
  selectXa() {
    if (this.obj && this.purpose === 'edit') {
      if (this.tochucIOForm.value.xacombobox !== "") {
        this.tochucIOForm.controls["xa"].setValue({
                                                      idxa: this.tochucIOForm.value.xacombobox.idxa,
                                                      maxa: this.tochucIOForm.value.xacombobox.maxa
                                                    });
        this.tenXaDisplay = this.tochucIOForm.value.xacombobox.tenxa;
      } else {
        if (this.tochucIOForm.value.tinhcombobox !== "" || this.tochucIOForm.value.huyencombobox !== "") {
          this.tochucIOForm.controls["xa"].setValue("");
          this.tenXaDisplay = "";
        } else {
          this.tochucIOForm.controls["xa"].setValue({
            idxa: this.dataComboboxModel.idxa,
            maxa: this.dataComboboxModel.maxa
          });
          this.tenXaDisplay = this.dataComboboxModel.tenxa;
        }
      }
    } else {
      this.tochucIOForm.controls["xa"].setValue({
                                                    idxa: this.tochucIOForm.value.xacombobox.idxa,
                                                    maxa: this.tochucIOForm.value.xacombobox.maxa
                                                  });
      this.tenXaDisplay = "";
    }
  }

  /**
   * Hàm thực thi chức năng add và edit
   */
  private addOrUpdate(operMode: string) {
    const dmFacadeService = this.dmFacadeService.getDmToChucService();
    // Gán dữ liệu input vào model
    const idtinh = this.tochucIOForm.value.tinh.idtinh;
    const idhuyen = this.tochucIOForm.value.huyen.idhuyen;
    const idxa =  this.tochucIOForm.value.xa.idxa;
    this.inputModel = this.tochucIOForm.value;
    this.inputModel.matinh = this.tochucIOForm.value.tinh.matinh;
    this.inputModel.mahuyen = this.tochucIOForm.value.huyen.mahuyen;
    this.inputModel.maxa = this.tochucIOForm.value.xa.maxa;
    this.inputModel.idtinh = idtinh;
    this.inputModel.idhuyen = idhuyen;
    this.inputModel.idxa = idxa ? idxa : "";
    this.inputModel.ngaycap = this.datePipe.transform( this.tochucIOForm.value.ngaycap, "yyyy-MM-dd");
    if (operMode === "new") {
      dmFacadeService.addItem(this.inputModel).subscribe(
        (res) => this.matSidenavService.doParentFunction("getAllToChuc"),
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
      this.inputModel.idtochuc = this.obj.idtochuc;
      dmFacadeService.updateItem(this.inputModel).subscribe(
        (res) => this.matSidenavService.doParentFunction("getAllToChuc"),
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
    if (this.tochucIOForm.valid === true) {
      this.addOrUpdate(operMode);
      this.matSidenavService.close();
    }
  }

  /**
   * Hàm reset form, gọi khi nhấn nút reset dữ liệu
   */
  public onFormReset() {
    // Hàm .reset sẽ xóa trắng mọi control trên form
    this.tochucIOForm.reset();
  }

  /**
   * Hàm lưu và reset form để tiếp tục nhập mới dữ liệu. Trường hợp này khi người dùng muốn nhập dữ liệu liên tục
   * @param operMode
   */
  async onContinueAdd(operMode: string) {
    this.logAllValidationErrorMessages();
    if (this.tochucIOForm.valid === true) {
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
      this.tochucIOForm,
      this.validationErrorMessages,
      this.formErrors
    );
  }

  /**
   * Hàm check giá trị trong seletec option Tỉnh
   */
  public compareTinh(item1: any, item2: any) {
    if(item1.matinh === item2.matinh) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Hàm check giá trị trong seletec option Huyện
   */
  public compareHuyen(item1: any, item2: any) {
    if(item1.mahuyen === item2.mahuyen) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Hàm check giá trị trong seletec option Xã
   */
  public compareXa(item1: any, item2: any) {
    if(item1.maxa === item2.maxa) {
      return true;
    } else {
      return false;
    }
  }

   /**
    * Hàm check giá trị trong seletec option Tỉnh
    */
  public compareLoaiToChuc(item1: any, item2: any) {
    if(item1.idloaitochuc === item2.idloaitochuc) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Hàm close sidenav
   */
  public closeToChucIOSidenav() {
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
