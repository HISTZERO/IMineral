import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { HttpErrorResponse } from "@angular/common/http";
import { DatePipe } from "@angular/common";

import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { KhuVucKhoangSanFacadeService } from "src/app/services/admin/khuvuckhoangsan/khuvuckhoangsan-facade.service";
import { validationAllErrorMessagesService } from "src/app/services/utilities/validatorService";
import { InputKhuVucKhoangSanDocHaiModel } from "src/app/models/admin/khuvuckhoangsan/khuvuckhoangsandochai.model";

@Component({
  selector: 'app-khuvuckhoangsandochai-io',
  templateUrl: './khuvuckhoangsandochai-io.component.html',
  styleUrls: ['./khuvuckhoangsandochai-io.component.scss']
})
export class KhuvuckhoangsandochaiIoComponent implements OnInit {

  // Chứa dữ liệu Form khu vực khoáng sản độc hại
  public kvKhoangSanDocHaiIOForm: FormGroup;

  // Chứa dữ liệu đối tượng truyền từ list comp
  public obj: any;

  // Chứa kiểu form
  public purpose: string;

  // Chứa chế độ form
  public editMode: boolean;

  // Chứa dữ liệu input
  public inputModel: InputKhuVucKhoangSanDocHaiModel;

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
    hequychieu: ""
  };

  // Contructor
  constructor(
    public matSidenavService: MatsidenavService,
    private formBuilder: FormBuilder,
    public commonService: CommonServiceShared,
    private translate: TranslateService,
    public datePipe: DatePipe,
    public khuvuckhoangsanFacadeService: KhuVucKhoangSanFacadeService,
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
    };
  }

  /**
   * Hàm khởi tạo form theo dạng edit
   */
  bindingConfigAddOrUpdate() {
    this.inputModel = new InputKhuVucKhoangSanDocHaiModel();
    // check edit
    this.formOnEdit();
  }

  /**
   * Hàm khởi tạo form
   */
  formInit() {
    this.kvKhoangSanDocHaiIOForm = this.formBuilder.group({
      sohieu: [""],
      tenkhuvuc: [""],
      diadiem: [""],
      dientich: [""],
      donvidientich: [""],
      mota: [""],
      doituongloaihinh: [""],
      loaikhoangsan: [""],
      soquyetdinh: [""],
      ngayquyetdinh: [""],
      hequychieu: [""]
    });
  }

  /**
   * hàm set value cho form
   */
  async formOnEdit() {
    if (this.obj && this.purpose === 'edit') {
      this.kvKhoangSanDocHaiIOForm.setValue({
        sohieu: this.obj.sohieu,
        tenkhuvuc: this.obj.tenkhuvuc,
        diadiem: this.obj.diadiem,
        dientich: this.obj.dientich,
        donvidientich: this.obj.donvidientich,
        mota: this.obj.mota,
        doituongloaihinh: this.obj.doituongloaihinh,
        loaikhoangsan: this.obj.loaikhoangsan,
        soquyetdinh: this.obj.soquyetdinh,
        ngayquyetdinh: this.obj.ngayquyetdinh,
        hequychieu: this.obj.hequychieu
      });
    }
  }

  /**
   * Hàm thực thi chức năng add và edit
   */
  private addOrUpdate(operMode: string) {
    const kvKhoangSanFacadeService = this.khuvuckhoangsanFacadeService.getKhuVucKhoangSanDocHaiService();
    this.inputModel = this.kvKhoangSanDocHaiIOForm.value;
    // this.inputModel.ngaycap = this.datePipe.transform(this.canhanIOForm.value.ngaycap, "yyyy-MM-dd");
    if (operMode === "new") {
      kvKhoangSanFacadeService.addItem(this.inputModel).subscribe(
        (res) => this.matSidenavService.doParentFunction("getAllKhuVucKhoangSanDocHai"),
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
      kvKhoangSanFacadeService.updateItem(this.inputModel).subscribe(
        (res) => this.matSidenavService.doParentFunction("getAllKhuVucKhoangSanDocHai"),
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
    if (this.kvKhoangSanDocHaiIOForm.valid === true) {
      this.addOrUpdate(operMode);
      this.matSidenavService.close();
    }
  }

  /**
   * Hàm reset form, gọi khi nhấn nút reset dữ liệu
   */
  public onFormReset() {
    // Hàm .reset sẽ xóa trắng mọi control trên form
    this.kvKhoangSanDocHaiIOForm.reset({
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
      hequychieu: ""
    });
  }

  /**
   * Hàm lưu và reset form để tiếp tục nhập mới dữ liệu. Trường hợp này khi người dùng muốn nhập dữ liệu liên tục
   * @param operMode 
   */
  async onContinueAdd(operMode: string) {
    this.logAllValidationErrorMessages();
    if (this.kvKhoangSanDocHaiIOForm.valid === true) {
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
      this.kvKhoangSanDocHaiIOForm,
      this.validationErrorMessages,
      this.formErrors
    );
  }

  /**
   * Hàm close sidenav
   */
  public closeKhuVucKhoangSanIOSidenav() {
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
