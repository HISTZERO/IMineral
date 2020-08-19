import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { HttpErrorResponse } from "@angular/common/http";

import { InputDmThuTucHanhChinhModel } from "src/app/models/admin/danhmuc/thutuchanhchinh.model";
import { TrangThai } from "src/app/shared/constants/trangthai-constants";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { DmFacadeService } from "src/app/services/admin/danhmuc/danhmuc-facade.service";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { validationAllErrorMessagesService } from "src/app/services/utilities/validatorService";
import { OutputDmCapQuanLyModel } from "src/app/models/admin/danhmuc/capquanly.model";

@Component({
  selector: 'app-thutuchanhchinh-io',
  templateUrl: './thutuchanhchinh-io.component.html',
  styleUrls: ['./thutuchanhchinh-io.component.scss']
})
export class DmThutuchanhchinhIoComponent implements OnInit {

    // Chứa dữ liệu Form
    public thuTucHanhChinhIOForm: FormGroup;

    // Chứa dữ liệu đối tượng truyền từ list comp
    public obj: any;
  
    // Chứa kiểu form
    public purpose: string;
  
    // Chứa chế độ form
    public editMode: boolean;
  
    // Chứa dữ liệu input
    public inputModel: InputDmThuTucHanhChinhModel;

    // Chứa danh sách Cấp quản lý
    public listCapQuanLy: OutputDmCapQuanLyModel[];

    // Chứa danh sách Cấp quản lý để tìm kiếm
    public listCapQuanLyFilter: OutputDmCapQuanLyModel[];
  
    // Chứa dữ liệu Trạng thái
    public trangthai = TrangThai;
  
    // Chứa dữ liệu translate
    public dataTranslate: any;
  
    // error message
    validationErrorMessages = {};
  
    // form errors
    formErrors = {
      mathutuc: "",
      tenthutuc: "",
      idlinhvuc: "",
      idcapthuchien: "",
      doituongthuchien: "",
      coquanthuchien: "",
      ketquathuchien: "",
      yeucaudieukien: "",
      noitiepnhanhoso: "",
      trinhtuthuchien: "",
      cachthucthuchien: "",
      songaythuchien: "",
      trangthai: "",
      thutu: "",
      lephi: ""
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
      // Lấy dữ liệu Cấp quản lý
      this.getAllCapQuanLy();
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
        tenthutuc: { required: this.dataTranslate.DANHMUC.thutuchanhchinh.tenthutucRequired},
        songaythuchien: { pattern: this.dataTranslate.DANHMUC.thutuchanhchinh.songaythuchienIsNumber},
        thutu: { pattern: this.dataTranslate.DANHMUC.thutuchanhchinh.thutuIsNumber }
      };
    }
  
    /**
      * Hàm khởi tạo form theo dạng edit
      */
    bindingConfigAddOrUpdate() {
      this.editMode = false;
      this.inputModel = new InputDmThuTucHanhChinhModel();
      // check edit
      this.formOnEdit();
    }
  
    /**
      * Hàm khởi tạo form
      */
    formInit() {
      this.thuTucHanhChinhIOForm = this.formBuilder.group({
        mathutuc: [""],
        tenthutuc: ["", Validators.required],
        idlinhvuc: [""],
        idcapthuchien: [""],
        doituongthuchien: [""],
        coquanthuchien: [""],
        ketquathuchien: [""],
        yeucaudieukien: [""],
        noitiepnhanhoso: [""],
        trinhtuthuchien: [""],
        cachthucthuchien: [""],
        songaythuchien: ["", Validators.pattern("^[0-9-+]+$")],
        trangthai: [""],
        thutu: ["", Validators.pattern("^[0-9-+]+$")],
        lephi: [""]
      });
    }
  
    /**
      * hàm set value cho form
      */
    formOnEdit() {
      if (this.obj && this.purpose === 'edit') {
        this.thuTucHanhChinhIOForm.setValue({
          mathutuc: this.obj.mathutuc,
          tenthutuc: this.obj.tenthutuc,
          idlinhvuc: this.obj.idlinhvuc,
          idcapthuchien: this.obj.idcapthuchien,
          doituongthuchien: this.obj.doituongthuchien,
          coquanthuchien: this.obj.coquanthuchien,
          ketquathuchien: this.obj.ketquathuchien,
          yeucaudieukien: this.obj.yeucaudieukien,
          noitiepnhanhoso: this.obj.noitiepnhanhoso,
          trinhtuthuchien: this.obj.trinhtuthuchien,
          cachthucthuchien: this.obj.cachthucthuchien,
          songaythuchien: this.obj.songaythuchien,
          trangthai: this.obj.trangthai,
          thutu: this.obj.thutu,
          lephi: this.obj.lephi
        });
      }
      this.editMode = true;
    }
  
    /**
     * Hàm lấy dữ liệu Cấp quản lý
     */
    async getAllCapQuanLy() {
      const listData: any = await this.dmFacadeService
        .getDmCapQuanLyService()
        .getFetchAll({ PageNumber: 1, PageSize: -1 });
      this.listCapQuanLy = listData.items;
      this.listCapQuanLyFilter = listData.items;
    }

    /**
      * Hàm thực thi chức năng add và edit
      */
    private addOrUpdate(operMode: string) {
      const dmFacadeService = this.dmFacadeService.getDmThuTucHanhChinhService();
      this.inputModel = this.thuTucHanhChinhIOForm.value;
      if (operMode === "new") {
        dmFacadeService.addItem(this.inputModel).subscribe(
          (res) => this.matSidenavService.doParentFunction("getAllThuTucHanhChinh"),
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
        this.inputModel.idthutuchanhchinh = this.obj.idthutuchanhchinh;
        dmFacadeService.updateItem(this.inputModel).subscribe(
          (res) => this.matSidenavService.doParentFunction("getAllThuTucHanhChinh"),
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
      if (this.thuTucHanhChinhIOForm.valid === true) {
        this.addOrUpdate(operMode);
        this.matSidenavService.close();
      }
    }
  
    /**
      * Hàm reset form, gọi khi nhấn nút reset dữ liệu
      */
    public onFormReset() {
      // Hàm .reset sẽ xóa trắng mọi control trên form
      this.thuTucHanhChinhIOForm.reset();
    }
  
    /**
      * Hàm lưu và reset form để tiếp tục nhập mới dữ liệu. Trường hợp này khi người dùng muốn nhập dữ liệu liên tục
      * @param operMode 
      */
    async onContinueAdd(operMode: string) {
      this.logAllValidationErrorMessages();
      if (this.thuTucHanhChinhIOForm.valid === true) {
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
        this.thuTucHanhChinhIOForm,
        this.validationErrorMessages,
        this.formErrors
      );
    }
  
    /**
      * Hàm close sidenav
      */
    public closeThuTucHanhChinhIOSidenav() {
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
