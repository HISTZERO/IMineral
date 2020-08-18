import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { HttpErrorResponse } from "@angular/common/http";

import { InputCapTruLuongModel } from "src/app/models/admin/danhmuc/captruluong.model";
import { TrangThai } from "src/app/shared/constants/trangthai-constants";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { DmFacadeService } from "src/app/services/admin/danhmuc/danhmuc-facade.service";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { validationAllErrorMessagesService } from "src/app/services/utilities/validatorService";

@Component({
  selector: 'app-captruluong-io',
  templateUrl: './captruluong-io.component.html',
  styleUrls: ['./captruluong-io.component.scss']
})
export class CaptruluongIoComponent implements OnInit {

 // Chứa dữ liệu Form
 public capTruLuongIOForm: FormGroup;

 // Chứa dữ liệu đối tượng truyền từ list comp
 public obj: any;

 // Chứa kiểu form
 public purpose: string;

 // Chứa chế độ form
 public editMode: boolean;

 // Chứa dữ liệu input
 public inputModel: InputCapTruLuongModel;

 // Chứa dữ liệu Trạng thái
 public trangthai = TrangThai;

 // Chứa dữ liệu translate
 public dataTranslate: any;

 // error message
 validationErrorMessages = {};

 // form errors
 formErrors = {
   macaptruluong: "",
   tencaptruluong: "",
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
    tencaptruluong: { required: this.dataTranslate.DANHMUC.captruluong.tencaptruluongRequired}, 
    thutu: { pattern: this.dataTranslate.DANHMUC.captruluong.thutuIsNumber }
   };
 }

 /**
  * Hàm khởi tạo form theo dạng edit
  */
 bindingConfigAddOrUpdate() {
   this.editMode = false;
   this.inputModel = new InputCapTruLuongModel();
   // check edit
   this.formOnEdit();
 }

 /**
  * Hàm khởi tạo form
  */
 formInit() {
   this.capTruLuongIOForm = this.formBuilder.group({
     macaptruluong: [""],
     tencaptruluong: ["", Validators.required],
     mota: [""],
     trangthai: [""],
     thutu: ["", Validators.pattern("^[0-9-+]+$")],
   });
 }

 /**
  * Hàm set value cho form
  */
 formOnEdit() {
   if (this.obj && this.purpose === 'edit') {
     this.capTruLuongIOForm.setValue({
       macaptruluong: this.obj.macaptruluong,
       tencaptruluong: this.obj.tencaptruluong,
       mota: this.obj.mota,
       trangthai: this.obj.trangthai,
       thutu: this.obj.thutu,
     });
   }
   this.editMode = true;
 }

 /**
  * Hàm thực thi chức năng add và edit
  */
 private addOrUpdate(operMode: string) {
   const dmFacadeService = this.dmFacadeService.getCapTruLuongService();
   this.inputModel = this.capTruLuongIOForm.value;
   if (operMode === "new") {
     dmFacadeService.addItem(this.inputModel).subscribe(
       (res) => this.matSidenavService.doParentFunction("getAllCapTruLuong"),
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
     this.inputModel.idcaptruluong = this.obj.idcaptruluong;
     dmFacadeService.updateItem(this.inputModel).subscribe(
       (res) => this.matSidenavService.doParentFunction("getAllCapTruLuong"),
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
   if (this.capTruLuongIOForm.valid === true) {
     this.addOrUpdate(operMode);
     this.matSidenavService.close();
   }
 }

 /**
  * Hàm reset form, gọi khi nhấn nút reset dữ liệu
  */
 public onFormReset() {
   // Hàm .reset sẽ xóa trắng mọi control trên form
   this.capTruLuongIOForm.reset();
 }

 /**
  * Hàm lưu và reset form để tiếp tục nhập mới dữ liệu. Trường hợp này khi người dùng muốn nhập dữ liệu liên tục
  * @param operMode 
  */
 async onContinueAdd(operMode: string) {
   this.logAllValidationErrorMessages();
   if (this.capTruLuongIOForm.valid === true) {
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
     this.capTruLuongIOForm,
     this.validationErrorMessages,
     this.formErrors
   );
 }

 /**
  * Hàm close sidenav
  */
 public closeCapTruLuongIOSidenav() {
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
