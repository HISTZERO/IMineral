import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpErrorResponse } from "@angular/common/http";
import { TranslateService } from "@ngx-translate/core";
import { DatePipe } from "@angular/common";
import { MatDialog } from "@angular/material";

import { InputKhuVucDauGiaModel } from "src/app/models/admin/khuvuckhoangsan/khuvucdaugia.model";
import { KhuVucKhoangSanFacadeService } from "src/app/services/admin/khuvuckhoangsan/khuvuckhoangsan-facade.service";
import { validationAllErrorMessagesService } from "src/app/services/utilities/validatorService";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { OutputDmHeQuyChieuModel } from 'src/app/models/admin/danhmuc/hequychieu.model';
import { DmFacadeService } from 'src/app/services/admin/danhmuc/danhmuc-facade.service';
import { MyAlertDialogComponent } from "src/app/shared/components/my-alert-dialog/my-alert-dialog.component";

@Component({
  selector: 'app-khuvucdaugia-io',
  templateUrl: './khuvucdaugia-io.component.html',
  styleUrls: ['./khuvucdaugia-io.component.scss']
})
export class KhuvucdaugiaIoComponent implements OnInit {
  // Chứa dữ liệu Form
  public khuvucdaugiaIOForm: FormGroup;

  // Chứa dữ liệu đối tượng truyền từ list comp
  public obj: any;

  // Chứa kiểu form
  public purpose: string;

  // Chứa chế độ form
  public editMode: boolean;

  // Chứa dữ liệu input
  public inputModel: InputKhuVucDauGiaModel;

  // Chứa dữ liệu translate
  public dataTranslate: any;

  // Chứa danh sách Lĩnh Vực
  public allHeQuyChieu: OutputDmHeQuyChieuModel[];

  // Filter Lĩnh Vực
  public HeQuyChieuFilters: OutputDmHeQuyChieuModel[];

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

  constructor(public matSidenavService: MatsidenavService,
              public khuVucKhoangSanFacadeService: KhuVucKhoangSanFacadeService,
              public dmFacadeService: DmFacadeService,
              private formBuilder: FormBuilder,
              public commonService: CommonServiceShared,
              private translate: TranslateService,
              public modalDialog: MatDialog,
              public datePipe: DatePipe) { }

  async ngOnInit() {
    // Khởi tạo form
    await this.formInit();
    // Khởi tạo form theo dạng add or edit
    await this.bindingConfigAddOrUpdate();
    // Lấy dữ liệu translate
    await this.getDataTranslate();
    // Lấy dữ liệu hệ quy chiếu
    await this.geAllHeQuyChieu();
  }

  /**
   * Hàm khởi tạo form
   */
  formInit() {
    this.khuvucdaugiaIOForm = this.formBuilder.group({
      sohieu: [""],
      tenkhuvuc: ["", Validators.required],
      diadiem: ["", Validators.required],
      dientich: ["", [Validators.required, Validators.pattern("^[0-9]+\\.{0,1}\\d{0,2}$")]],
      donvidientich: ["", Validators.required],
      mota: [""],
      doituongloaihinh: [""],
      loaikhoangsan: [""],
      soquyetdinh: [""],
      ngayquyetdinh: [""],
      hequychieu: ["", Validators.required]
    });
  }


  /**
   * Hàm lấy danh sách Lĩnh Vực
   */
  async geAllHeQuyChieu() {
    const allHeQuyChieuData: any = await this.dmFacadeService
      .getDmHeQuyChieuService()
      .getFetchAll({ PageNumber: 1, PageSize: -1 });
    this.allHeQuyChieu = allHeQuyChieuData.items;
    this.HeQuyChieuFilters = allHeQuyChieuData.items;
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
      tenkhuvuc: { required: this.dataTranslate.KHUVUCKHOANGSAN.khuvucdaugia.tenkhuvucRequired },
      diadiem: { required: this.dataTranslate.KHUVUCKHOANGSAN.khuvucdaugia.diadiemRequired },
      dientich: { required: this.dataTranslate.KHUVUCKHOANGSAN.khuvucdaugia.dientichRequired, pattern: this.dataTranslate.KHUVUCKHOANGSAN.khuvucdaugia.dientichFormat },
      donvidientich: { required: this.dataTranslate.KHUVUCKHOANGSAN.khuvucdaugia.donvidientichRequired },
      hequychieu: { required: this.dataTranslate.KHUVUCKHOANGSAN.khuvucdaugia.hequychieuRequired }
    };
  }

  /**
   * Hàm khởi tạo form theo dạng edit
   */
  bindingConfigAddOrUpdate() {
    this.editMode = false;
    this.inputModel = new InputKhuVucDauGiaModel();
    // check edit
    this.formOnEdit();
  }

  /**
   * hàm set value cho form
   */
  formOnEdit() {
    if (this.obj && this.purpose === 'edit') {
      this.khuvucdaugiaIOForm.setValue({
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
    const khuVucKhoangSanFacadeService = this.khuVucKhoangSanFacadeService.getKhuVucDauGiaService();
    this.inputModel = this.khuvucdaugiaIOForm.value;
    if (operMode === "new") {
      khuVucKhoangSanFacadeService.addItem(this.inputModel).subscribe(
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
      this.inputModel.idkhuvuc = this.obj.idkhuvuc;
      khuVucKhoangSanFacadeService.updateItem(this.inputModel).subscribe(
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
    if (this.khuvucdaugiaIOForm.valid === true) {
      this.addOrUpdate(operMode);
      this.matSidenavService.close();
    }
  }

  /**
   * Hàm reset form, gọi khi nhấn nút reset dữ liệu
   */
  public onFormReset() {
    // Hàm .reset sẽ xóa trắng mọi control trên form
    this.khuvucdaugiaIOForm.reset();
  }

  /**
   * Hàm lưu và reset form để tiếp tục nhập mới dữ liệu. Trường hợp này khi người dùng muốn nhập dữ liệu liên tục
   * @param operMode
   */
  async onContinueAdd(operMode: string) {
    this.logAllValidationErrorMessages();
    if (this.khuvucdaugiaIOForm.valid === true) {
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
      this.khuvucdaugiaIOForm,
      this.validationErrorMessages,
      this.formErrors
    );
  }

  /**
   * Hàm close sidenav
   */
  public closeKhuVucDauGiaIOSidenav() {
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
