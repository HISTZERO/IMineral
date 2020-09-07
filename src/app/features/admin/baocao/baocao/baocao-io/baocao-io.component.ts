import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from "@angular/forms";
import { DatePipe } from "@angular/common";
import { TranslateService } from "@ngx-translate/core";
import { MatDialog } from "@angular/material";
import { HttpErrorResponse } from "@angular/common/http";
import { ActivatedRoute } from "@angular/router";

import { InputBaoCaoModel } from "src/app/models/admin/baocao/baocao-dieutrakhaosat.model";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { DmFacadeService } from "src/app/services/admin/danhmuc/danhmuc-facade.service";
import { BaocaoFacadeService } from "src/app/services/admin/baocao/baocao-facade.service";
import { validationAllErrorMessagesService } from "src/app/services/utilities/validatorService";
import { MyAlertDialogComponent } from "src/app/shared/components/my-alert-dialog/my-alert-dialog.component";
import { OutputDmLoaiBaoCaoModel } from "src/app/models/admin/danhmuc/loaibaocao.model";
import { DoiTuongBaoCao } from "src/app/shared/constants/common-constants";
import { idNhomBaoCao } from "src/app/shared/constants/nhombaocao-constants";

@Component({
  selector: 'app-baocao-io',
  templateUrl: './baocao-io.component.html',
  styleUrls: ['./baocao-io.component.scss']
})
export class BaocaoIoComponent implements OnInit {

  // Chứa dữ liệu Form báo cáo
  public baoCaoIOForm: FormGroup;

  // Chứa dữ liệu đối tượng truyền từ list comp
  public obj: any;

  // Chứa kiểu form
  public purpose: string;

  // Chứa danh sách Loại Báo Cáo
  public listLoaiBaoCao: OutputDmLoaiBaoCaoModel[];

  // Chứa chế độ form
  public editMode: boolean;

  // Chứa dữ liệu input
  public inputModel: InputBaoCaoModel;

  // Chứa dữ liệu translate
  public dataTranslate: any;

  // Chứa dữ liệu đối tượng báo cáo
  public doiTuongBaoCao = DoiTuongBaoCao;

  // Chứa key báo cáo
  public keyBaoCao: string;

  // error message
  validationErrorMessages = {};


  // form errors
  formErrors = {
    sobaocao: "",
    tenbaocao: "",
    diadiem: "",
    ngaybaocao: "",
    idloaibaocao: "",
    nhombaocao: "",
    baocaonam: "",
    donvibaocao: "",
    doituongbaocao: "",
    ghichu: "",
  };

  // Contructor
  constructor(
    public matSidenavService: MatsidenavService,
    private formBuilder: FormBuilder,
    public commonService: CommonServiceShared,
    private translate: TranslateService,
    public datePipe: DatePipe,
    public dmFacadeService: DmFacadeService,
    public baoCaoFacadeService: BaocaoFacadeService,
    public modalDialog: MatDialog,
    public activatedRoute: ActivatedRoute,
  ) { }

  async ngOnInit() {
    // Lấy dữ liệu loại báo cáo
    this.getAllLoaiBaoCao();
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
   * Lấy dữ liệu từ url
   */
  public getDataByUrl() {
    this.keyBaoCao = this.activatedRoute.snapshot.paramMap.get('key');
  }

  /**
  * Hàm lấy dữ liệu Loại báo cáo
  */
  async getAllLoaiBaoCao(param: any = { PageNumber: 1, PageSize: -1 }) {
    const listData: any = await this.dmFacadeService
      .getDmLoaiBaoCaoService()
      .getFetchAll(param);
    this.listLoaiBaoCao = listData.items;
  }


  /**
   * Hàm khởi tạo form theo dạng edit
   */
  bindingConfigAddOrUpdate() {
    this.inputModel = new InputBaoCaoModel();
    // check edit
    this.formOnEdit();
  }

  /**
   * Hàm khởi tạo form
   */
  formInit() {
    this.baoCaoIOForm = this.formBuilder.group({
      sobaocao: [""],
      tenbaocao: [""],
      diadiem: [""],
      ngaybaocao: [""],
      idloaibaocao: [""],
      nhombaocao: [""],
      baocaonam: [""],
      donvibaocao: [""],
      doituongbaocao: [""],
      ghichu: [""],
    });
  }

  /**
   * hàm set value cho form
   */
  async formOnEdit() {
    if (this.obj && this.purpose === 'edit') {
      this.baoCaoIOForm.setValue({
        sobaocao: this.obj.sobaocao,
        tenbaocao: this.obj.tenbaocao,
        diadiem: this.obj.diadiem,
        ngaybaocao: this.obj.ngaybaocao,
        idloaibaocao: this.obj.idloaibaocao,
        nhombaocao: this.obj.nhombaocao,
        baocaonam: this.obj.baocaonam,
        donvibaocao: this.obj.donvibaocao,
        doituongbaocao: this.obj.doituongbaocao,
        ghichu: this.obj.ghichu,
      });
    }
  }

  /**
   * Hàm thực thi chức năng add và edit
   */
  private addOrUpdate(operMode: string) {
    const baoCaoFacadeService = this.baoCaoFacadeService.getBaoCaoService();
    this.inputModel = this.baoCaoIOForm.value;
    if (operMode === "new") {
      this.inputModel.nhombaocao = idNhomBaoCao[this.keyBaoCao];
      baoCaoFacadeService.addItem(this.inputModel).subscribe(
        (res) => this.matSidenavService.doParentFunction("reloadDataGrid"),
        (error: HttpErrorResponse) => {
          this.showDialogWarning(error.error.errors);
        },
        () =>
          this.commonService.showeNotiResult(
            this.dataTranslate.COMMON.default.successAdd,
            2000
          )
      );
    } else if (operMode === "edit") {
      this.inputModel.idbaocao = this.obj.idbaocao;
      baoCaoFacadeService.updateItem(this.inputModel).subscribe(
        (res) => this.matSidenavService.doParentFunction("reloadDataGrid"),
        (error: HttpErrorResponse) => {
          this.showDialogWarning(error.error.errors);
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
    if (this.baoCaoIOForm.valid === true) {
      this.addOrUpdate(operMode);
      this.matSidenavService.close();
    }
  }

  /**
   * Hàm reset form, gọi khi nhấn nút reset dữ liệu
   */
  public onFormReset() {
    // Hàm .reset sẽ xóa trắng mọi control trên form
    this.baoCaoIOForm.reset({
      sobaocao: "",
      tenbaocao: "",
      diadiem: "",
      ngaybaocao: "",
      idloaibaocao: "",
      nhombaocao: "",
      baocaonam: "",
      donvibaocao: "",
      doituongbaocao: "",
      ghichu: "",
    });
  }

  /**
   * Hàm lưu và reset form để tiếp tục nhập mới dữ liệu. Trường hợp này khi người dùng muốn nhập dữ liệu liên tục
   * @param operMode 
   */
  async onContinueAdd(operMode: string) {
    this.logAllValidationErrorMessages();
    if (this.baoCaoIOForm.valid === true) {
      this.addOrUpdate(operMode);
      this.onFormReset();
      this.purpose = "new";
    }
  }

  /**
   * Hàm kiểm tra validation form
   */
  public logAllValidationErrorMessages() {
    validationAllErrorMessagesService(
      this.baoCaoIOForm,
      this.validationErrorMessages,
      this.formErrors
    );
  }

  /**
   * Hàm close sidenav
   */
  public closeBaoCaoIOSidenav() {
    this.matSidenavService.close();
  }

  /**
   * Hàm hiển thị cảnh báo error
   */
  public showDialogWarning(error: any) {
    const dialog = this.modalDialog.open(MyAlertDialogComponent);
    dialog.componentInstance.header = this.dataTranslate.COMMON.default.warnings;
    dialog.componentInstance.content =
      "<b>" + error + "</b>";
    dialog.componentInstance.visibleOkButton = false;
  }

  /**
   *  Hàm gọi từ function con gọi vào chạy function cha
   * @param methodName
   */
  doFunction(methodName) {
    this[methodName]();
  }
}
