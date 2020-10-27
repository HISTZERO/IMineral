import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {OutputDmNhomKhoangSanModel} from "src/app/models/admin/danhmuc/nhomkhoangsan.model";
import {OutputDmLoaiKhoangSanModel} from "src/app/models/admin/danhmuc/loaikhoangsan.model";
import {MatsidenavService} from "src/app/services/utilities/matsidenav.service";
import {DmFacadeService} from "src/app/services/admin/danhmuc/danhmuc-facade.service";
import {CapPhepHoatDongKhoangSanFacadeService} from "src/app/services/admin/capphephoatdongkhoangsan/capphephoatdongkhoangsan-facade.service";
import {CommonServiceShared} from "src/app/services/utilities/common-service";
import {TranslateService} from "@ngx-translate/core";
import {Paging, TrangThaiEnum} from "src/app/shared/constants/enum";
import {HttpErrorResponse} from "@angular/common/http";
import {validationAllErrorMessagesService} from "src/app/services/utilities/validatorService";
import {InputCpTanThuLoaiKhoangSanModel} from "src/app/models/admin/capphephoatdongkhoangsan/cptanthukhoangsan/cptanthuloaikhoangsan.model";

@Component({
  selector: 'app-cp-ttks-loaikhoangsan-io',
  templateUrl: './cp-ttks-loaikhoangsan-io.component.html',
  styleUrls: ['./cp-ttks-loaikhoangsan-io.component.scss']
})
export class CpTtksLoaikhoangsanIoComponent implements OnInit {

  // Chứa dữ liệu Form
  public cpTanThuLoaiKhoangSanIOForm: FormGroup;

  // Chứa dữ liệu đối tượng truyền từ list comp
  public obj: any;

  // Chứa kiểu form
  public purpose: string;

  // Chứa dữ liệu translate
  public dataTranslate: any;

  // Chứa dữ liệu input
  public inputModel: InputCpTanThuLoaiKhoangSanModel;

  // Chứa danh sách Dvhc Tỉnh
  public allNhomKhoangSan: OutputDmNhomKhoangSanModel[];

  // Chứa danh sách Dvhc Huyện
  public allLoaiKhoangSan: OutputDmLoaiKhoangSanModel[];

  // Filter Đơn vị hành chính Tỉnh
  public nhomKhoangSanFilters: OutputDmNhomKhoangSanModel[];

  // Filter Đơn vị hành chính Huyện
  public loaiKhoangSanFilters: OutputDmLoaiKhoangSanModel[];

  // Chứa trạng thái hiển thị của combobox trên layout
  public classColWithFiftyPercentForCombobox = false;

  public tenLoaiKhoangSanDisplay: string;

  public tenNhomKhoangSanDisplay: string;

  // error message
  validationErrorMessages = {};

  // form errors
  formErrors = {
    idloaikhoangsan: "",
    tenkhoangsan: "",
  };

  constructor(public matSidenavService: MatsidenavService,
              public dmFacadeService: DmFacadeService,
              private capPhepHoatDongKhoangSanFacadeService: CapPhepHoatDongKhoangSanFacadeService,
              private formBuilder: FormBuilder,
              public commonService: CommonServiceShared,
              private translate: TranslateService) {
  }

  async ngOnInit() {
    // Khởi tạo form
    this.formInit();
    // Lấy dữ liệu translate
    await this.getDataTranslate();
    // Khởi tạo form theo dạng add or edit
    await this.bindingConfigAddOrUpdate();
    // Lấy dữ liệu nhóm khoáng sản
    await this.geAllNhomKhoangSan();
    // Lấy dữ liệu loại khoáng sản
    await this.showLoaiKhoangSan(true);
  }

  /**
   * Hàm check giá trị trong seletect option Huyện
   */
  public compareNhomKhoangSan(item1: any, item2: any) {
    if (item1.idnhomkhoangsan === item2.idnhomkhoangsan) {
      return true;
    } else {
      return false;
    }
  }


  /**
   * Hàm check giá trị trong seletect option Huyện
   */
  public compareLoaiKhoangSan(item1: any, item2: any) {
    if (item1.idloaikhoangsan === item2.idloaikhoangsan) {
      return true;
    } else {
      return false;
    }
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
      idloaikhoangsan: {required: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.capphepthamdoloaikhoangsan.loaikhoangsanRequired},
      tenkhoangsan: {required: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.capphepthamdoloaikhoangsan.tenkhoangsanRequired},
    };
  }

  /**
   * Hàm khởi tạo form
   */
  formInit() {
    this.cpTanThuLoaiKhoangSanIOForm = this.formBuilder.group({
      nhomkhoangsan: [""],
      loaikhoangsan: [""],
      tenkhoangsan: ["", Validators.required],
      idloaikhoangsan: ["", Validators.required],
    });
  }

  /**
   * hàm set value cho form
   */
  async formOnEdit() {
    if (this.obj && this.purpose === 'edit') {
      this.classColWithFiftyPercentForCombobox = true;
      this.cpTanThuLoaiKhoangSanIOForm.setValue({
        nhomkhoangsan: {idnhomkhoangsan: this.obj.idnhomkhoangsan, tennhomkhoangsan: this.obj.tennhomkhoangsan},
        tenkhoangsan: this.obj.tenkhoangsan,
        idloaikhoangsan: this.obj.idloaikhoangsan,
        loaikhoangsan: {idloaikhoangsan: this.obj.idloaikhoangsan, tenloaikhoangsan: this.obj.tenloaikhoangsan}
      });
    }
  }

  /**
   * Hàm khởi tạo form theo dạng edit
   */
  async bindingConfigAddOrUpdate() {
    this.inputModel = new InputCpTanThuLoaiKhoangSanModel();
    // check edit
    await this.formOnEdit();
  }

  /**
   * Hàm lấy danh sách nhóm khoáng sản
   */
  async geAllNhomKhoangSan() {
    const allNhomKhoangSanData: any = await this.dmFacadeService
      .getDmNhomKhoangSanService()
      .getFetchAll({Trangthai: TrangThaiEnum.Active, PageNumber: 1, PageSize: -1});
    this.allNhomKhoangSan = allNhomKhoangSanData.items;
    this.nhomKhoangSanFilters = allNhomKhoangSanData.items;
  }

  /**
   * Hàm lấy danh sách nhóm khoáng sản
   */
  async geAllLoaiKhoangSan(idNhomKhoangSan: string) {
    const allLoaikhoangSanData: any = await this.dmFacadeService
      .getDmLoaiKhoangSanService()
      .getFetchAll({
        Idnhomkhoangsan: idNhomKhoangSan,
        Trangthai: TrangThaiEnum.Active,
        PageNumber: Paging.PageNumber,
        PageSize: Paging.PageSize
      });
    this.allLoaiKhoangSan = allLoaikhoangSanData.items;
    this.loaiKhoangSanFilters = allLoaikhoangSanData.items;
  }

  async showLoaiKhoangSan(inittState: boolean = false) {
    if (!this.cpTanThuLoaiKhoangSanIOForm.value.nhomkhoangsan) {
      this.allLoaiKhoangSan = [];
      this.loaiKhoangSanFilters = [];
      this.cpTanThuLoaiKhoangSanIOForm.controls.loaikhoangsan.setValue("");
    } else {
      if (!inittState) {
        this.cpTanThuLoaiKhoangSanIOForm.controls.loaikhoangsan.setValue("");
      }

      const nhomKhoangSan = this.cpTanThuLoaiKhoangSanIOForm.controls.nhomkhoangsan.value;
      await this.geAllLoaiKhoangSan(nhomKhoangSan.idnhomkhoangsan);
    }

    await this.selectNhomKhoangSan();
  }

  async selectNhomKhoangSan() {
    if (this.obj && this.purpose === 'edit') {
      if (this.cpTanThuLoaiKhoangSanIOForm.value.nhomkhoangsan) {
        this.tenNhomKhoangSanDisplay = this.cpTanThuLoaiKhoangSanIOForm.controls.nhomkhoangsan.value.tennhomkhoangsan;
      } else {
        this.tenNhomKhoangSanDisplay = this.obj.tennhomkhoangsan;
      }

    } else {
      this.tenNhomKhoangSanDisplay = "";
    }

    await this.selectLoaiKhoangSan();
  }

  async selectLoaiKhoangSan() {
    if (this.obj && this.purpose === 'edit') {
      if (this.cpTanThuLoaiKhoangSanIOForm.value.loaikhoangsan) {
        this.cpTanThuLoaiKhoangSanIOForm.controls
          .idloaikhoangsan
          .setValue(this.cpTanThuLoaiKhoangSanIOForm.controls.loaikhoangsan.value.idloaikhoangsan);
        this.tenLoaiKhoangSanDisplay = this.cpTanThuLoaiKhoangSanIOForm.controls.loaikhoangsan.value.tenloaikhoangsan;
      } else {
        if (this.cpTanThuLoaiKhoangSanIOForm.value.nhomkhoangsan) {
          this.cpTanThuLoaiKhoangSanIOForm.controls
            .idloaikhoangsan
            .setValue("");
          this.tenLoaiKhoangSanDisplay = "";
        } else {
          this.cpTanThuLoaiKhoangSanIOForm.controls
            .idloaikhoangsan
            .setValue(this.obj.idloaikhoangsan);
          this.tenLoaiKhoangSanDisplay = this.obj.tenloaikhoangsan;
        }
      }
    } else {
      if (this.cpTanThuLoaiKhoangSanIOForm.value.loaikhoangsan) {
        this.cpTanThuLoaiKhoangSanIOForm.controls
          .idloaikhoangsan
          .setValue(this.cpTanThuLoaiKhoangSanIOForm.controls.loaikhoangsan.value.idloaikhoangsan);
      } else {
        this.cpTanThuLoaiKhoangSanIOForm.controls
          .idloaikhoangsan
          .setValue("");
      }

      this.tenLoaiKhoangSanDisplay = "";
    }
  }

  /**
   * Hàm thực thi chức năng add và edit
   */
  private addOrUpdate(operMode: string) {
    const cpTanThuLoaiKhoangSanService = this.capPhepHoatDongKhoangSanFacadeService.getCapPhepTanThuLoaiKhoangSanService();
    // Gán dữ liệu input vào model
    this.inputModel.idloaikhoangsan = this.cpTanThuLoaiKhoangSanIOForm.controls.idloaikhoangsan.value;
    this.inputModel.idcappheptanthu = this.obj.idcappheptanthu;
    this.inputModel.tenkhoangsan = this.cpTanThuLoaiKhoangSanIOForm.controls.tenkhoangsan.value;
    if (operMode === "new") {
      cpTanThuLoaiKhoangSanService.addItem(this.inputModel).subscribe(
        (res) => this.matSidenavService.doParentFunction("getAllCpTanThuLoaiKhoangSan"),
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
      this.inputModel.idtanthuloaikhoangsan = this.obj.idtanthuloaikhoangsan;
      cpTanThuLoaiKhoangSanService.updateItem(this.inputModel).subscribe(
        (res) => this.matSidenavService.doParentFunction("getAllCpTanThuLoaiKhoangSan"),
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
    if (this.cpTanThuLoaiKhoangSanIOForm.valid === true) {
      this.addOrUpdate(operMode);
      this.matSidenavService.close();
    }
  }

  /**
   * Hàm reset form, gọi khi nhấn nút reset dữ liệu
   */
  public onFormReset() {
    // Hàm .reset sẽ xóa trắng mọi control trên form
    this.cpTanThuLoaiKhoangSanIOForm.reset();
  }

  /**
   * Hàm lưu và reset form để tiếp tục nhập mới dữ liệu. Trường hợp này khi người dùng muốn nhập dữ liệu liên tục
   * @param operMode
   */
  async onContinueAdd(operMode: string) {
    this.logAllValidationErrorMessages();
    if (this.cpTanThuLoaiKhoangSanIOForm.valid === true) {
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
      this.cpTanThuLoaiKhoangSanIOForm,
      this.validationErrorMessages,
      this.formErrors
    );
  }

  /**
   * Hàm close sidenav
   */
  public closeCpTanThuLoaiKhoangSanIOSidenav() {
    this.matSidenavService.close();
  }

}
