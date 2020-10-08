import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { HttpErrorResponse } from "@angular/common/http";
import { InputCpThamDoCongTrinhModel } from "src/app/models/admin/capphephoatdongkhoangsan/cpthamdocongtrinh.model";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { validationAllErrorMessagesService } from "src/app/services/utilities/validatorService";
import { CapPhepHoatDongKhoangSanFacadeService } from 'src/app/services/admin/capphephoatdongkhoangsan/capphephoatdongkhoangsan-facade.service';
import { OutputDmHeQuyChieuModel } from 'src/app/models/admin/danhmuc/hequychieu.model';
import { DmFacadeService } from 'src/app/services/admin/danhmuc/danhmuc-facade.service';

@Component({
  selector: 'app-cp-tdks-congtrinhthamdo-io',
  templateUrl: './cp-tdks-congtrinhthamdo-io.component.html',
  styleUrls: ['./cp-tdks-congtrinhthamdo-io.component.scss']
})
export class CpTdksCongtrinhthamdoIoComponent implements OnInit {

  // Chứa dữ liệu Form
  public cpThamDoCongTrinhIOForm: FormGroup;

  // Chứa dữ liệu đối tượng truyền từ list comp
  public obj: any;

  // Chứa kiểu form
  public purpose: string;

  // Chứa dữ liệu input
  public inputModel: InputCpThamDoCongTrinhModel;

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
    ghichu: ""
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
      sohieu: {required: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.capphepthamdocongtrinh.sohieuRequired},
      chieusau: {required: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.capphepthamdocongtrinh.chieusauRequired , pattern: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.capphepthamdocongtrinh.chieusauFormat },
      toadox: {required: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.capphepthamdocongtrinh.toadoxRequired , pattern: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.capphepthamdocongtrinh.toadoxFormat },
      toadoy: {required: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.capphepthamdocongtrinh.toadoyRequired , pattern: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.capphepthamdocongtrinh.toadoyFormat },
      hequychieu: {required: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.capphepthamdocongtrinh.hequychieuRequired},
    };
  }

  /**
   * Hàm khởi tạo form theo dạng edit
   */
  bindingConfigAddOrUpdate() {
    this.inputModel = new InputCpThamDoCongTrinhModel();
    this.formOnEdit();
  }

  /**
   * Hàm khởi tạo form
   */
  formInit() {
    this.cpThamDoCongTrinhIOForm = this.formBuilder.group({
      sohieu: ["", Validators.required],
      chieusau: ["", [Validators.required, Validators.pattern("^[0-9]+\\.{0,1}\\d{0,2}$")]],
      toadox: ["", [Validators.required, Validators.pattern("^[0-9]+\\.{0,1}\\d{0,2}$")]],
      toadoy: ["", [Validators.required, Validators.pattern("^[0-9]+\\.{0,1}\\d{0,2}$")]],
      hequychieu: ["", Validators.required],
      ghichu: [""]
    });
  }

  /**
   * hàm set value cho form
   */
  formOnEdit() {
    if (this.obj && this.purpose === 'edit') {
      this.cpThamDoCongTrinhIOForm.setValue({
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
    const cpThamDoCongTrinhService = this.capPhepHoatDongKhoangSanFacadeService.getCapPhepThamDoCongTrinhService();
    // Gán dữ liệu input vào model
    this.inputModel = this.cpThamDoCongTrinhIOForm.value;
    this.inputModel.idcapphepthamdo = this.obj.idcapphepthamdo;
    if (operMode === "new") {
      cpThamDoCongTrinhService.addItem(this.inputModel).subscribe(
        (res) => this.matSidenavService.doParentFunction("getAllCpThamDoCongTrinh"),
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
        (res) => this.matSidenavService.doParentFunction("getAllCpThamDoCongTrinh"),
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
    if (this.cpThamDoCongTrinhIOForm.valid === true) {
      this.addOrUpdate(operMode);
      this.matSidenavService.close();
    }
  }

  /**
   * Hàm reset form, gọi khi nhấn nút reset dữ liệu
   */
  public onFormReset() {
    // Hàm .reset sẽ xóa trắng mọi control trên form
    this.cpThamDoCongTrinhIOForm.reset();
  }

  /**
   * Hàm lưu và reset form để tiếp tục nhập mới dữ liệu. Trường hợp này khi người dùng muốn nhập dữ liệu liên tục
   * @param operMode
   */
  async onContinueAdd(operMode: string) {
    this.logAllValidationErrorMessages();
    if (this.cpThamDoCongTrinhIOForm.valid === true) {
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
      this.cpThamDoCongTrinhIOForm,
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
