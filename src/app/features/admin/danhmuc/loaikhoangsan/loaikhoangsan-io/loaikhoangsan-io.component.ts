import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { HttpErrorResponse } from "@angular/common/http";

import { InputLoaiKhoangSanModel } from "src/app/models/admin/danhmuc/loaikhoangsan.model";
import { TrangThai } from "src/app/shared/constants/trangthai-constants";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { DmFacadeService } from "src/app/services/admin/danhmuc/danhmuc-facade.service";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { validationAllErrorMessagesService } from "src/app/services/utilities/validatorService";
import { OutputNhomKhoangSanModel } from "src/app/models/admin/danhmuc/nhomkhoangsan.model";

@Component({
  selector: 'app-loaikhoangsan-io',
  templateUrl: './loaikhoangsan-io.component.html',
  styleUrls: ['./loaikhoangsan-io.component.scss']
})
export class LoaikhoangsanIoComponent implements OnInit {

   // Chứa dữ liệu Form
   public loaiKhoangSanIOForm: FormGroup;

   // Chứa dữ liệu Nhóm khoáng sản
   public listNhomKhoangSan: OutputNhomKhoangSanModel[];

   // Chứa dữ liệu Nhóm khoáng sản để tìm kiếm
   public listNhomKhoangSanFilter: OutputNhomKhoangSanModel[];


   // Chứa dữ liệu đối tượng truyền từ list comp
   public obj: any;
 
   // Chứa kiểu form
   public purpose: string;
 
   // Chứa chế độ form
   public editMode: boolean;
 
   // Chứa dữ liệu input
   public inputModel: InputLoaiKhoangSanModel;
 
   // Chứa dữ liệu Trạng thái
   public trangthai = TrangThai;
 
   // Chứa dữ liệu translate
   public dataTranslate: any;
 
   // error message
   validationErrorMessages = {};
 
   // form errors
   formErrors = {
     maloaikhoangsan: "",
     tenloaikhoangsan: "",
     mota: "",
     trangthai: "",
     thutu: "",
     idnhomkhoangsan: ""
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
     // Lấy dữ liệu nhóm khoáng sản
     this.getAllNhomKhoangSan();
     
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
   setValidation() {
     this.validationErrorMessages = {
        tenloaikhoangsan: { required: this.dataTranslate.DANHMUC.loaikhoangsan.tenloaikhoangsanRequired },
        thutu: { pattern: this.dataTranslate.DANHMUC.loaikhoangsan.thutuIsNumber }
     };
   }
 
    /**
    * Hàm lấy dữ liệu Nhóm khoáng sản
    */
   async getAllNhomKhoangSan() {
    this.listNhomKhoangSan = [];
    const listData: any = await this.dmFacadeService
      .getNhomKhoangSanService()
      .getFetchAll({ PageNumber: 1, PageSize: -1 });
    // this.listNhomKhoangSan = listData.items;
  }

   /**
    * Hàm khởi tạo form theo dạng edit
    */
   bindingConfigAddOrUpdate() {
     this.editMode = false;
     this.inputModel = new InputLoaiKhoangSanModel();
     // check edit
     this.formOnEdit();
   }
 
   /**
    * Hàm khởi tạo form
    */
   formInit() {
     this.loaiKhoangSanIOForm = this.formBuilder.group({
       maloaikhoangsan: [""],
       tenloaikhoangsan: ["", Validators.required],
       mota: [""],
       trangthai: [""],
       thutu: ["", Validators.pattern("^[0-9-+]+$")],
       idnhomkhoangsan: [""]
     });
   }
 
   /**
    * hàm set value cho form
    */
   formOnEdit() {
     if (this.obj && this.purpose === 'edit') {
       this.loaiKhoangSanIOForm.setValue({
         maloaikhoangsan: this.obj.maloaikhoangsan,
         tenloaikhoangsan: this.obj.tenloaikhoangsan,
         mota: this.obj.mota,
         trangthai: this.obj.trangthai,
         thutu: this.obj.thutu,
         idnhomkhoangsan: +this.obj.idnhomkhoangsan
       });
     }
     this.editMode = true;
   }
 
   /**
    * Hàm thực thi chức năng add và edit
    */
   private addOrUpdate(operMode: string) {
     const dmFacadeService = this.dmFacadeService.getLoaiKhoangSanService();
     this.inputModel = this.loaiKhoangSanIOForm.value;
     if (operMode === "new") {
       dmFacadeService.addItem(this.inputModel).subscribe(
         (res) => this.matSidenavService.doParentFunction("getAllLoaiKhoangSan"),
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
       this.inputModel.idloaikhoangsan = this.obj.idloaikhoangsan;
       dmFacadeService.updateItem(this.inputModel).subscribe(
         (res) => this.matSidenavService.doParentFunction("getAllLoaiKhoangSan"),
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
     if (this.loaiKhoangSanIOForm.valid === true) {
       this.addOrUpdate(operMode);
       this.matSidenavService.close();
     }
   }
 
   /**
    * Hàm reset form, gọi khi nhấn nút reset dữ liệu
    */
   public onFormReset() {
     // Hàm .reset sẽ xóa trắng mọi control trên form
     this.loaiKhoangSanIOForm.reset();
   }
 
   /**
    * Hàm lưu và reset form để tiếp tục nhập mới dữ liệu. Trường hợp này khi người dùng muốn nhập dữ liệu liên tục
    * @param operMode 
    */
   async onContinueAdd(operMode: string) {
     this.logAllValidationErrorMessages();
     if (this.loaiKhoangSanIOForm.valid === true) {
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
       this.loaiKhoangSanIOForm,
       this.validationErrorMessages,
       this.formErrors
     );
   }
 
   /**
    * Hàm close sidenav
    */
   public closeLoaiKhoangSanIOSidenav() {
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
