import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpErrorResponse } from "@angular/common/http";
import { TranslateService } from "@ngx-translate/core";
import { DatePipe } from "@angular/common";

import { InputDiemMoModel } from "src/app/models/admin/diemquang-moquang/diemmo.model";
import { DiemQuangMoQuangFacadeService } from "src/app/services/admin/diemquang-moquang/diemquang-moquang-facade.service";
import { validationAllErrorMessagesService } from "src/app/services/utilities/validatorService";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { OutputDmHeQuyChieuModel } from 'src/app/models/admin/danhmuc/hequychieu.model';
import { DmFacadeService } from 'src/app/services/admin/danhmuc/danhmuc-facade.service';

@Component({
  selector: 'app-diemquang-io',
  templateUrl: './diemquang-io.component.html',
  styleUrls: ['./diemquang-io.component.scss']
})
export class DiemquangIoComponent implements OnInit {
  // Chứa dữ liệu Form
  public diemmoIOForm: FormGroup;

  // Chứa dữ liệu đối tượng truyền từ list comp
  public obj: any;

  // Chứa kiểu form
  public purpose: string;

  // Chứa chế độ form
  public editMode: boolean;

  // Chứa dữ liệu input
  public inputModel: InputDiemMoModel;

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
    sohieumo: "",
    tenmo: "",
    diadiem: "",
    loaikhoangsan: "",
    nguongocmo: "",
    tobando: "",
    dientich: "",
    truluong: "",
    chieudaytu: "",
    chieudayden: "",
    donvitruluong: "",
    donvidientich: "",
    captainguyen: "",
    dacdiem: "",
    quymo: "",
    mucdodieutra: "",
    hientrang: "",
    thanhphankhoangvat: "",
    dieukienkhaithac: "",
    hequychieu: "",
    toadox: "",
    toadoy: ""
  };

  constructor(public matSidenavService: MatsidenavService,
    public diemQuangMoQuangFacadeService: DiemQuangMoQuangFacadeService,
    private formBuilder: FormBuilder,
    public commonService: CommonServiceShared,
    public dmFacadeService: DmFacadeService,
    private translate: TranslateService,
    public datePipe: DatePipe
  ) { }

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
    this.diemmoIOForm = this.formBuilder.group({
      sohieumo: [""],
      tenmo: ["", Validators.required],
      diadiem: ["", Validators.required],
      loaikhoangsan: [""],
      nguongocmo: [""],
      tobando: [""],
      dientich: ["", [Validators.required, Validators.pattern("^[0-9]+\\.{0,1}\\d{0,2}$")]],
      truluong: ["", [Validators.required, Validators.pattern("^[0-9]+\\.{0,1}\\d{0,2}$")]],
      chieudaytu: ["", [Validators.required, Validators.pattern("^[0-9]+\\.{0,1}\\d{0,2}$")]],
      chieudayden: ["", [Validators.required, Validators.pattern("^[0-9]+\\.{0,1}\\d{0,2}$")]],
      donvitruluong: ["", Validators.required],
      donvidientich: ["", Validators.required],
      captainguyen: [""],
      dacdiem: [""],
      quymo: [""],
      mucdodieutra: [""],
      hientrang: [""],
      thanhphankhoangvat: [""],
      dieukienkhaithac: [""],
      toadox: ["", [Validators.required, Validators.pattern("^[0-9]+\\.{0,1}\\d{0,2}$")]],
      toadoy: ["", [Validators.required, Validators.pattern("^[0-9]+\\.{0,1}\\d{0,2}$")]],
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
      tenmo: { required: this.dataTranslate.DIEMQUANGMOQUANG.diemmo.tenmoRequired },
      diadiem: { required: this.dataTranslate.DIEMQUANGMOQUANG.diemmo.diadiemRequired },
      dientich: { required: this.dataTranslate.DIEMQUANGMOQUANG.diemmo.dientichRequired, pattern: this.dataTranslate.DIEMQUANGMOQUANG.diemmo.dientichFormat },
      truluong: { required: this.dataTranslate.DIEMQUANGMOQUANG.diemmo.truluongRequired, pattern: this.dataTranslate.DIEMQUANGMOQUANG.diemmo.truluongFormat },
      chieudaytu: { required: this.dataTranslate.DIEMQUANGMOQUANG.diemmo.chieudaytuRequired, pattern: this.dataTranslate.DIEMQUANGMOQUANG.diemmo.chieudaytuFormat },
      chieudayden: { required: this.dataTranslate.DIEMQUANGMOQUANG.diemmo.chieudaydenRequired, pattern: this.dataTranslate.DIEMQUANGMOQUANG.diemmo.chieudaydenFormat },
      donvitruluong: { required: this.dataTranslate.DIEMQUANGMOQUANG.diemmo.donvitruluongRequired },
      donvidientich: { required: this.dataTranslate.DIEMQUANGMOQUANG.diemmo.donvidientichRequired },
      toadox: { required: this.dataTranslate.DIEMQUANGMOQUANG.diemmo.toadoxRequired, pattern: this.dataTranslate.DIEMQUANGMOQUANG.diemmo.toadoxFormat },
      toadoy: { required: this.dataTranslate.DIEMQUANGMOQUANG.diemmo.toadoyRequired, pattern: this.dataTranslate.DIEMQUANGMOQUANG.diemmo.toadoyFormat },
      hequychieu: { required: this.dataTranslate.DIEMQUANGMOQUANG.diemmo.hequychieuRequired },
    };
  }

  /**
   * Hàm khởi tạo form theo dạng edit
   */
  bindingConfigAddOrUpdate() {
    this.editMode = false;
    this.inputModel = new InputDiemMoModel();
    // check edit
    this.formOnEdit();
  }

  /**
   * hàm set value cho form
   */
  formOnEdit() {
    if (this.obj && this.purpose === 'edit') {
      this.diemmoIOForm.setValue({
        sohieumo: this.obj.sohieumo,
        tenmo: this.obj.tenmo,
        diadiem: this.obj.diadiem,
        loaikhoangsan: this.obj.loaikhoangsan,
        nguongocmo: this.obj.nguongocmo,
        tobando: this.obj.tobando,
        dientich: this.obj.dientich,
        truluong: this.obj.truluong,
        chieudaytu: this.obj.chieudaytu,
        chieudayden: this.obj.chieudayden,
        donvitruluong: this.obj.donvitruluong,
        donvidientich: this.obj.donvidientich,
        captainguyen: this.obj.captainguyen,
        dacdiem: this.obj.dacdiem,
        quymo: this.obj.quymo,
        mucdodieutra: this.obj.mucdodieutra,
        hientrang: this.obj.hientrang,
        thanhphankhoangvat: this.obj.thanhphankhoangvat,
        dieukienkhaithac: this.obj.dieukienkhaithac,
        hequychieu: this.obj.hequychieu,
        toadox: this.obj.toadox,
        toadoy: this.obj.toadoy
      });
    }
    this.editMode = true;
  }

  /**
   * Hàm thực thi chức năng add và edit
   */
  private addOrUpdate(operMode: string) {
    // Gán dữ liệu input vào model
    const diemQuangMoQuangFacadeService = this.diemQuangMoQuangFacadeService.getDiemMoService();
    this.inputModel = this.diemmoIOForm.value;
    if (operMode === "new") {
      diemQuangMoQuangFacadeService.addItem(this.inputModel).subscribe(
        (res) => this.matSidenavService.doParentFunction("getAllDiemMo"),
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
      this.inputModel.idmo = this.obj.idmo;
      diemQuangMoQuangFacadeService.updateItem(this.inputModel).subscribe(
        (res) => this.matSidenavService.doParentFunction("getAllDiemMo"),
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
    if (this.diemmoIOForm.valid === true) {
      this.addOrUpdate(operMode);
      this.matSidenavService.close();
    }
  }

  /**
   * Hàm reset form, gọi khi nhấn nút reset dữ liệu
   */
  public onFormReset() {
    // Hàm .reset sẽ xóa trắng mọi control trên form
    this.diemmoIOForm.reset();
  }

  /**
   * Hàm lưu và reset form để tiếp tục nhập mới dữ liệu. Trường hợp này khi người dùng muốn nhập dữ liệu liên tục
   * @param operMode
   */
  async onContinueAdd(operMode: string) {
    this.logAllValidationErrorMessages();
    if (this.diemmoIOForm.valid === true) {
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
      this.diemmoIOForm,
      this.validationErrorMessages,
      this.formErrors
    );
  }

  /**
   * Hàm close sidenav
   */
  public closediemmoIOSidenav() {
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
