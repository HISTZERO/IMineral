import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { HttpErrorResponse } from "@angular/common/http";

import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { validationAllErrorMessagesService } from "src/app/services/utilities/validatorService";
import { CapPhepHoatDongKhoangSanFacadeService } from 'src/app/services/admin/capphephoatdongkhoangsan/capphephoatdongkhoangsan-facade.service';
import { OutputDmHeQuyChieuModel } from 'src/app/models/admin/danhmuc/hequychieu.model';
import { DmFacadeService } from 'src/app/services/admin/danhmuc/danhmuc-facade.service';
import { InputCpKhaiThacCongTrinhModel } from "src/app/models/admin/capphephoatdongkhoangsan/cpkhaithackhoangsan/cpkhaithaccongtrinh.model";

@Component({
  selector: 'app-cp-ktks-congtrinhkhaithac-io',
  templateUrl: './cp-ktks-congtrinhkhaithac-io.component.html',
  styleUrls: ['./cp-ktks-congtrinhkhaithac-io.component.scss']
})
export class CpKtksCongtrinhkhaithacIoComponent implements OnInit {

  // Chứa dữ liệu Form
  public cpKhaiThacCongTrinhIOForm: FormGroup;

  // Chứa dữ liệu đối tượng truyền từ list comp
  public obj: any;

  // Chứa kiểu form
  public purpose: string;

  // Chứa dữ liệu input
  public inputModel: InputCpKhaiThacCongTrinhModel;

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
    sohieu: "",
    chieusau: "",
    toadox: "",
    toadoy: "",
    hequychieu: "",
    ghichu: "",
    luuluong: "",
    chedokhaithac: "",
    hathap: "",
    mucnuoctinh: "",
  };

  constructor(public matSidenavService: MatsidenavService,
    public capPhepHoatDongKhoangSanFacadeService: CapPhepHoatDongKhoangSanFacadeService,
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
      sohieu: { required: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.capphepkhaithaccongtrinh.sohieuRequired },
      chieusau: { required: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.capphepkhaithaccongtrinh.chieusauRequired, pattern: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.capphepkhaithaccongtrinh.chieusauFormat },
      toadox: { required: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.capphepkhaithaccongtrinh.toadoxRequired, pattern: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.capphepkhaithaccongtrinh.toadoxFormat },
      toadoy: { required: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.capphepkhaithaccongtrinh.toadoyRequired, pattern: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.capphepkhaithaccongtrinh.toadoyFormat },
      hequychieu: { required: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.capphepkhaithaccongtrinh.hequychieuRequired },
    };
  }

  /**
   * Hàm khởi tạo form theo dạng edit
   */
  bindingConfigAddOrUpdate() {
    this.inputModel = new InputCpKhaiThacCongTrinhModel();
    this.formOnEdit();
  }

  /**
   * Hàm khởi tạo form
   */
  formInit() {
    this.cpKhaiThacCongTrinhIOForm = this.formBuilder.group({
      sohieu: ["", Validators.required],
      chieusau: ["", [Validators.required, Validators.pattern("^[0-9]+\\.{0,1}\\d{0,2}$")]],
      toadox: ["", [Validators.required, Validators.pattern("^[0-9]+\\.{0,1}\\d{0,2}$")]],
      toadoy: ["", [Validators.required, Validators.pattern("^[0-9]+\\.{0,1}\\d{0,2}$")]],
      hequychieu: ["", Validators.required],
      ghichu: [""],
      luuluong: [""],
      chedokhaithac: [""],
      hathap: [""],
      mucnuoctinh: [""],
    });
  }

  /**
   * hàm set value cho form
   */
  formOnEdit() {
    if (this.obj && this.purpose === 'edit') {
      this.cpKhaiThacCongTrinhIOForm.setValue({
        sohieu: this.obj.sohieu,
        chieusau: this.obj.chieusau,
        toadox: this.obj.toadox,
        toadoy: this.obj.toadoy,
        hequychieu: this.obj.hequychieu,
        ghichu: this.obj.ghichu,
        luuluong: this.obj.luuluong,
        chedokhaithac: this.obj.chedokhaithac,
        hathap: this.obj.hathap,
        mucnuoctinh: this.obj.mucnuoctinh,
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
    const cpThamDoCongTrinhService = this.capPhepHoatDongKhoangSanFacadeService.getCapPhepKhaiThacCongTrinhService();
    // Gán dữ liệu input vào model
    this.inputModel = this.cpKhaiThacCongTrinhIOForm.value;
    this.inputModel.idcapphepkhaithac = this.obj.idcapphepkhaithac;
    if (operMode === "new") {
      cpThamDoCongTrinhService.addItem(this.inputModel).subscribe(
        (res) => this.matSidenavService.doParentFunction("getAllCpKhaiThacCongTrinh"),
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
      cpThamDoCongTrinhService.updateItem(this.inputModel).subscribe(
        (res) => this.matSidenavService.doParentFunction("getAllCpKhaiThacCongTrinh"),
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
    if (this.cpKhaiThacCongTrinhIOForm.valid === true) {
      this.addOrUpdate(operMode);
      this.matSidenavService.close();
    }
  }

  /**
   * Hàm reset form, gọi khi nhấn nút reset dữ liệu
   */
  public onFormReset() {
    // Hàm .reset sẽ xóa trắng mọi control trên form
    this.cpKhaiThacCongTrinhIOForm.reset();
  }

  /**
   * Hàm lưu và reset form để tiếp tục nhập mới dữ liệu. Trường hợp này khi người dùng muốn nhập dữ liệu liên tục
   * @param operMode
   */
  async onContinueAdd(operMode: string) {
    this.logAllValidationErrorMessages();
    if (this.cpKhaiThacCongTrinhIOForm.valid === true) {
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
      this.cpKhaiThacCongTrinhIOForm,
      this.validationErrorMessages,
      this.formErrors
    );
  }

  /**
   * Hàm close sidenav
   */
  closeCongTrinhKhaiThacIOSidenav() {
    this.matSidenavService.close();
  }

}
