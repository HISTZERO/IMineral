import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { HttpErrorResponse } from "@angular/common/http";

import { InputCoQuanQuanLyModel } from "src/app/models/admin/danhmuc/coquanquanly.model";
import { OutputDvhcModel } from "src/app/models/admin/danhmuc/dvhc.model";
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
export class CoquanquanlyIoComponent implements OnInit {

   // Chứa dữ liệu Form
   public coQuanQuanLyIOForm: FormGroup;

   // Chứa dữ liệu đối tượng truyền từ list comp
   public obj: any;
 
   // Chứa kiểu form
   public purpose: string;
 
   // Chứa chế độ form
   public editMode: boolean;
 
   // Chứa dữ liệu input
   public inputModel: InputCoQuanQuanLyModel;
 
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
     tencoquanquanly: "",
     diachi: "",
     macoquanquanly: "",
     fax: "",
     website: "",
     mota: "",
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
      tencoquanquanly: { required: this.dataTranslate.DANHMUC.coquanquanly.tencoquanquanlyRequired },
      dienthoai: { pattern: this.dataTranslate.DANHMUC.coquanquanly.dienthoaiIsNumber},
      matinh: { required: this.dataTranslate.DANHMUC.coquanquanly.matinhRequired },
      mahuyen: { required: this.dataTranslate.DANHMUC.coquanquanly.mahuyenRequired },
      thutu: { pattern: this.dataTranslate.DANHMUC.coquanquanly.thutuIsNumber },
      email: { email: this.dataTranslate.DANHMUC.coquanquanly.emailCheck},
     };
   }
 
   /**
    * Hàm khởi tạo form theo dạng edit
    */
   bindingConfigAddOrUpdate() {
     this.showDvhcTinh();
     this.editMode = false;
     this.inputModel = new InputCoQuanQuanLyModel();
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
       matinh: ["", Validators.required],
       mahuyen: ["", Validators.required],
       maxa: [""],
       trangthai: [""],
       thutu: ["", Validators.pattern("^[0-9-+]+$")],
     });
   }
 
   /**
    * hàm set value cho form
    */
   formOnEdit() {
     if (this.obj && this.purpose === 'edit') {
       this.coQuanQuanLyIOForm.setValue({
         tencoquanquanly: this.obj.tencoquanquanly,
         diachi: this.obj.diachi,
         macoquanquanly: this.obj.macoquanquanly,
         fax: this.obj.fax,
         website: this.obj.website,
         mota: this.obj.mota,
         dienthoai: this.obj.dienthoai,
         email: this.obj.email,
         matinh: {idtinh: this.obj.idtinh, matinh: this.obj.matinh},
         mahuyen: {idhuyen: this.obj.idhuyen, mahuyen: this.obj.mahuyen},
         maxa: {idxa: this.obj.idxa, maxa: this.obj.maxa},
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
     if (!this.coQuanQuanLyIOForm.value.matinh === true) {
       this.allHuyen = [];
       this.dvhcDistrictFilters = [];
       this.allXa = [];
       this.dvhcWardFilters = [];
       if (this.editMode === true) {
         this.coQuanQuanLyIOForm.controls["mahuyen"].setValue("");
       }
     }
     if (!this.coQuanQuanLyIOForm.value.matinh === false) {
       if (this.editMode === true) {
         this.coQuanQuanLyIOForm.controls["mahuyen"].setValue("");
       }
       this.allXa = [];
       this.dvhcWardFilters = [];
       this.allHuyen = await this.dmFacadeService
         .getDistrictService()
         .getFetchAll({ matinh: this.coQuanQuanLyIOForm.value.matinh.matinh });
       this.dvhcDistrictFilters = this.allHuyen;
     }
   }
 
   /**
    * Hàm lấy danh sách Dvhc Xã
    */
   async showDvhcXa() {
     if (!this.coQuanQuanLyIOForm.value.mahuyen === true) {
       this.allXa = [];
       this.dvhcWardFilters = [];
       if (this.editMode === true) {
         this.coQuanQuanLyIOForm.controls["maxa"].setValue("");
       }
     }
     if (
       !this.coQuanQuanLyIOForm.value.matinh === false &&
       !this.coQuanQuanLyIOForm.value.mahuyen === false
     ) {
       if (this.editMode === true) {
         this.coQuanQuanLyIOForm.controls["maxa"].setValue("");
       }
       this.allXa = await this.dmFacadeService
         .getWardService()
         .getFetchAll({ mahuyen: this.coQuanQuanLyIOForm.value.mahuyen.mahuyen });
       this.dvhcWardFilters = this.allXa;
     }
   }
 
   /**
    * Hàm thực thi chức năng add và edit
    */
   private addOrUpdate(operMode: string) {
    const dmFacadeService = this.dmFacadeService.getCoQuanQuanLyService();
    const idtinh = this.coQuanQuanLyIOForm.value.matinh.idtinh;
    const idhuyen = this.coQuanQuanLyIOForm.value.mahuyen.idhuyen;
    const idxa =  this.coQuanQuanLyIOForm.value.maxa.idxa;
    this.inputModel = this.coQuanQuanLyIOForm.value;
    this.inputModel.matinh = this.coQuanQuanLyIOForm.value.matinh.matinh;
    this.inputModel.mahuyen = this.coQuanQuanLyIOForm.value.mahuyen.mahuyen;
    this.inputModel.maxa = this.coQuanQuanLyIOForm.value.maxa.maxa;
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
     this.coQuanQuanLyIOForm.reset();
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
    if(item1.matinh === item2.matinh) {
      return true;
    } else {
      return false
    }
  }

  /**
   * Hàm check giá trị trong seletec option Huyện
   */
  public compareHuyen(item1: any, item2: any) {
    if(item1.mahuyen === item2.mahuyen) {
      return true;
    } else {
      return false
    }
  }

  /**
   * Hàm check giá trị trong seletec option Xã
   */
  public compareXa(item1: any, item2: any) {
    if(item1.maxa === item2.maxa) {
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
