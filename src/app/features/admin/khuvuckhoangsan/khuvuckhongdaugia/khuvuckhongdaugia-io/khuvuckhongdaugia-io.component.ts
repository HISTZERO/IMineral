import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpErrorResponse } from "@angular/common/http";
import { TranslateService } from "@ngx-translate/core";
import { DatePipe } from "@angular/common";

import { InputKhuVucKhongDauGiaModel } from "src/app/models/admin/khuvuckhoangsan/khuvuckhongdaugia.model";
import { KhuVucKhoangSanFacadeService } from "src/app/services/admin/khuvuckhoangsan/khuvuckhoangsan-facade.service";
import { validationAllErrorMessagesService } from "src/app/services/utilities/validatorService";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";

@Component({
  selector: 'app-khuvuckhongdaugia-io',
  templateUrl: './khuvuckhongdaugia-io.component.html',
  styleUrls: ['./khuvuckhongdaugia-io.component.scss']
})
export class KhuvuckhongdaugiaIoComponent implements OnInit {
  // Chứa dữ liệu Form
  public khuvuckhongdaugiaIOForm: FormGroup;

  // Chứa dữ liệu đối tượng truyền từ list comp
  public obj: any;

  // Chứa kiểu form
  public purpose: string;

  // Chứa chế độ form
  public editMode: boolean;

  // Chứa dữ liệu input
  public inputModel: InputKhuVucKhongDauGiaModel;

  // Chứa dữ liệu translate
  public dataTranslate: any;

  // error message
  validationErrorMessages = {};

  // form errors
  formErrors = {
    sohieu: "",
    tenkhuvuc: "",
    diadiem: "",
    dientich: "",
    donvidientich: "",
    mota: "",
    doituongloaihinh: "",
    loaikhoangsan: "",
    soquyetdinh: "",
    ngayquyetdinh: "",
    hequychieu: "",
  };

  constructor(public matSidenavService: MatsidenavService,
              public khuVucKhoangSanFacadeService: KhuVucKhoangSanFacadeService,
              private formBuilder: FormBuilder,
              public commonService: CommonServiceShared,
              private translate: TranslateService,
              public datePipe: DatePipe) { }

  async ngOnInit() {
    // Khởi tạo form
    await this.formInit();
    // Khởi tạo form theo dạng add or edit
    await this.bindingConfigAddOrUpdate();
    // Lấy dữ liệu translate
    await this.getDataTranslate();
  }

  /**
   * Hàm khởi tạo form
   */
  formInit() {
    this.khuvuckhongdaugiaIOForm = this.formBuilder.group({
      sohieu: [""],
      tenkhuvuc: ["", Validators.required],
      diadiem: ["", Validators.required],
      dientich: ["", Validators.pattern("/^\d+\.\d{0,2}$/")],
      donvidientich: [""],
      mota: [""],
      doituongloaihinh: [""],
      loaikhoangsan: [""],
      soquyetdinh: [""],
      ngayquyetdinh: [""],
      hequychieu: ["", Validators.required]
    });
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
      tenkhuvuc: { required: this.dataTranslate.KHUVUCKHOANGSAN.khuvuckhongdaugia.tenkhuvucRequired },
      diadiem: { required: this.dataTranslate.KHUVUCKHOANGSAN.khuvuckhongdaugia.diadiemRequired },
      dientich: { pattern: this.dataTranslate.KHUVUCKHOANGSAN.khuvuckhongdaugia.dientichIsNumber },
      hequychieu: { required: this.dataTranslate.KHUVUCKHOANGSAN.khuvucdaugia.hequychieuRequired }
    };
  }

  /**
   * Hàm khởi tạo form theo dạng edit
   */
  bindingConfigAddOrUpdate() {
    this.editMode = false;
    this.inputModel = new InputKhuVucKhongDauGiaModel();
    // check edit
    this.formOnEdit();
  }

  /**
   * hàm set value cho form
   */
  formOnEdit() {
    if (this.obj && this.purpose === 'edit') {
      this.khuvuckhongdaugiaIOForm.setValue({
        sohieu: this.obj.sohieu,
        tenkhuvuc: this.obj.tenkhuvuc,
        diadiem: this.obj.diadiem,
        dientich: this.obj.dientich,
        donvidientich: this.obj.donvidientich,
        doituongloaihinh: this.obj.doituongloaihinh,
        loaikhoangsan: this.obj.loaikhoangsan,
        soquyetdinh: this.obj.soquyetdinh,
        ngayquyetdinh: this.obj.ngayquyetdinh,
        mota: this.obj.mota,
        hequychieu: this.obj.hequychieu
      });
    }
    this.editMode = true;
  }

  /**
   * Hàm thực thi chức năng add và edit
   */
  private addOrUpdate(operMode: string) {
    // Gán dữ liệu input vào model
    const khuVucKhoangSanFacadeService = this.khuVucKhoangSanFacadeService.getKhuVucKhongDauGiaService();
    this.inputModel = this.khuvuckhongdaugiaIOForm.value;
    if (operMode === "new") {
      khuVucKhoangSanFacadeService.addItem(this.inputModel).subscribe(
        (res) => this.matSidenavService.doParentFunction("getAllKhuVucKhongDauGia"),
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
      this.inputModel.idkhuvuc = this.obj.idkhuvuc;
      khuVucKhoangSanFacadeService.updateItem(this.inputModel).subscribe(
        (res) => this.matSidenavService.doParentFunction("getAllKhuVucKhongDauGia"),
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
    if (this.khuvuckhongdaugiaIOForm.valid === true) {
      this.addOrUpdate(operMode);
      this.matSidenavService.close();
    }
  }

  /**
   * Hàm reset form, gọi khi nhấn nút reset dữ liệu
   */
  public onFormReset() {
    // Hàm .reset sẽ xóa trắng mọi control trên form
    this.khuvuckhongdaugiaIOForm.reset();
  }

  /**
   * Hàm lưu và reset form để tiếp tục nhập mới dữ liệu. Trường hợp này khi người dùng muốn nhập dữ liệu liên tục
   * @param operMode
   */
  async onContinueAdd(operMode: string) {
    this.logAllValidationErrorMessages();
    if (this.khuvuckhongdaugiaIOForm.valid === true) {
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
      this.khuvuckhongdaugiaIOForm,
      this.validationErrorMessages,
      this.formErrors
    );
  }

  /**
   * Hàm close sidenav
   */
  public closeKhuVucKhongDauGiaIOSidenav() {
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