import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { HttpErrorResponse } from "@angular/common/http";

import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { validationAllErrorMessagesService } from "src/app/services/utilities/validatorService";
import { DangKyHoatDongKhoangSanFacadeService } from 'src/app/services/admin/dangkyhoatdongkhoangsan/dangkyhoatdongkhoangsan-facade.service';
import { OutputDmHeQuyChieuModel } from 'src/app/models/admin/danhmuc/hequychieu.model';
import { DmFacadeService } from 'src/app/services/admin/danhmuc/danhmuc-facade.service';
import { InputDkThamDoCongTrinhModel } from "src/app/models/admin/dangkyhoatdongkhoangsan/dangkythamdo/dkthamdocongtrinh.model";
import { DefaultValue } from 'src/app/shared/constants/global-var';

@Component({
  selector: 'app-congtrinhthamdo-io',
  templateUrl: './congtrinhthamdo-io.component.html',
  styleUrls: ['./congtrinhthamdo-io.component.scss']
})
export class CongtrinhthamdoIoComponent implements OnInit {

  // Chứa dữ liệu Form
  public dKThamDoCongTrinhIOForm: FormGroup;

  // Chứa dữ liệu đối tượng truyền từ list comp
  public obj: any;

  // Chứa kiểu form
  public purpose: string;

  // Chứa dữ liệu input
  public inputModel: InputDkThamDoCongTrinhModel;

  // Chứa danh sách Lĩnh Vực
  public allHeQuyChieu: OutputDmHeQuyChieuModel[];

  // Filter Lĩnh Vực
  public HeQuyChieuFilters: OutputDmHeQuyChieuModel[];


  // Chứa dữ liệu translate
  public dataTranslate: any;

  // error message
  validationErrorMessages = {};

  // form errors
  formErrors = {
    sohieu: DefaultValue.Empty,
    chieusau: DefaultValue.Empty,
    toadox: DefaultValue.Empty,
    toadoy: DefaultValue.Empty,
    hequychieu: DefaultValue.Empty,
    ghichu: DefaultValue.Empty
  };

  constructor(
    public matSidenavService: MatsidenavService,
    public dangKyHoatDongKhoangSanFacadeService: DangKyHoatDongKhoangSanFacadeService,
    public dmFacadeService: DmFacadeService,
    private formBuilder: FormBuilder,
    public commonService: CommonServiceShared,
    private translate: TranslateService) { }

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
      sohieu: { required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkythamdocongtrinh.sohieuRequired },
      chieusau: { required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkythamdocongtrinh.chieusauRequired, pattern: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkythamdocongtrinh.chieusauFormat },
      toadox: { required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkythamdocongtrinh.toadoxRequired, pattern: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkythamdocongtrinh.toadoxFormat },
      toadoy: { required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkythamdocongtrinh.toadoyRequired, pattern: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkythamdocongtrinh.toadoyFormat },
      hequychieu: { required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkythamdocongtrinh.hequychieuRequired },
    };
  }

  /**
   * Hàm khởi tạo form theo dạng edit
   */
  bindingConfigAddOrUpdate() {
    this.inputModel = new InputDkThamDoCongTrinhModel();
    this.formOnEdit();
  }

  /**
   * Hàm khởi tạo form
   */
  formInit() {
    this.dKThamDoCongTrinhIOForm = this.formBuilder.group({
      sohieu: [DefaultValue.Empty, Validators.required],
      chieusau: [DefaultValue.Empty, [Validators.required, Validators.pattern("^[0-9]+\\.{0,1}\\d{0,2}$")]],
      toadox: [DefaultValue.Empty, [Validators.required, Validators.pattern("^[0-9]+\\.{0,1}\\d{0,2}$")]],
      toadoy: [DefaultValue.Empty, [Validators.required, Validators.pattern("^[0-9]+\\.{0,1}\\d{0,2}$")]],
      hequychieu: [DefaultValue.Empty, Validators.required],
      ghichu: [DefaultValue.Empty]
    });
  }

  /**
   * hàm set value cho form
   */
  formOnEdit() {
    if (this.obj && this.purpose === 'edit') {
      this.dKThamDoCongTrinhIOForm.setValue({
        sohieu: this.obj.sohieu,
        chieusau: this.obj.chieusau,
        toadox: this.obj.toadox,
        toadoy: this.obj.toadoy,
        hequychieu: this.obj.hequychieu,
        ghichu: this.obj.ghichu
      });
    }
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
   * Hàm thực thi chức năng add và edit
   */
  private addOrUpdate(operMode: string) {
    const dKThamDoCongTrinhService = this.dangKyHoatDongKhoangSanFacadeService.getDangKyThamDoCongTrinhService();
    // Gán dữ liệu input vào model
    this.inputModel = this.dKThamDoCongTrinhIOForm.value;
    this.inputModel.iddangkythamdo = this.obj.iddangkythamdo;
    if (operMode === "new") {
      dKThamDoCongTrinhService.addItem(this.inputModel).subscribe(
        (res) => this.matSidenavService.doParentFunction("getAllDkThamDoCongTrinh"),
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
      this.inputModel.idcongtrinh = this.obj.idcongtrinh;
      dKThamDoCongTrinhService.updateItem(this.inputModel).subscribe(
        (res) => this.matSidenavService.doParentFunction("getAllDkThamDoCongTrinh"),
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
    if (this.dKThamDoCongTrinhIOForm.valid === true) {
      this.addOrUpdate(operMode);
      this.matSidenavService.close();
    }
  }

  /**
   * Hàm reset form, gọi khi nhấn nút reset dữ liệu
   */
  public onFormReset() {
    // Hàm .reset sẽ xóa trắng mọi control trên form
    this.dKThamDoCongTrinhIOForm.reset();
  }

  /**
   * Hàm lưu và reset form để tiếp tục nhập mới dữ liệu. Trường hợp này khi người dùng muốn nhập dữ liệu liên tục
   * @param operMode
   */
  async onContinueAdd(operMode: string) {
    this.logAllValidationErrorMessages();
    if (this.dKThamDoCongTrinhIOForm.valid === true) {
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
      this.dKThamDoCongTrinhIOForm,
      this.validationErrorMessages,
      this.formErrors
    );
  }

  /**
   * Hàm close sidenav
   */
  closeCongTrinhThamDoIOSidenav() {
    this.matSidenavService.close();
  }
}
