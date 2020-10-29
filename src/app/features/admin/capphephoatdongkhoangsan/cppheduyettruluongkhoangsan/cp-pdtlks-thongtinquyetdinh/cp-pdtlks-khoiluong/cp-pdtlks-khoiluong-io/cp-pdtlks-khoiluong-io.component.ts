import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { InputCpPheDuyetTruLuongKhoiTruLuongModel } from "src/app/models/admin/capphephoatdongkhoangsan/cppheduyettruluongkhoangsan/cpPheDuyetTruLuongKhoiTruLuong.model";
import { OutputDmCapTruLuongModel } from "src/app/models/admin/danhmuc/captruluong.model";
import { CapPhepHoatDongKhoangSanFacadeService } from "src/app/services/admin/capphephoatdongkhoangsan/capphephoatdongkhoangsan-facade.service";
import { DmFacadeService } from "src/app/services/admin/danhmuc/danhmuc-facade.service";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { validationAllErrorMessagesService } from "src/app/services/utilities/validatorService";
import {
  DonViDoSau,
  DonViTruLuong,
} from "src/app/shared/constants/common-constants";

@Component({
  selector: "app-cp-pdtlks-khoiluong-io",
  templateUrl: "./cp-pdtlks-khoiluong-io.component.html",
  styleUrls: ["./cp-pdtlks-khoiluong-io.component.scss"],
})
export class CpPdtlksKhoiluongIoComponent implements OnInit {
  public khoiLuongTruLuongForm: FormGroup;
  // Chứa dữ liệu đối tượng truyền từ list comp
  public obj: any;
  // Chứa kiểu form
  public purpose: string;
  // Chứa dữ liệu translate
  public dataTranslate: any;
  public donViTruLuongData: any = DonViTruLuong;
  public capTruLuongData: OutputDmCapTruLuongModel[];
  // Danh sách đơn vị độ sâu
  public donViDoSauList = DonViDoSau;
  // Chứa dữ liệu input
  public inputModel: InputCpPheDuyetTruLuongKhoiTruLuongModel;
  // error message
  validationErrorMessages = {};
  // Form errors khu vực
  formErrors = {
    idcaptruluong: "",
    tenkhoitruluong: "",
    truluong: "",
    mucsaucaodothapnhat: "",
    mucsaucaodocaonhat: "",
    donvitruluong: "",
    donvichieusau: "",
  };
  constructor(
    public matSidenavService: MatsidenavService,
    public capPhepHoatDongKhoangSanFacadeService: CapPhepHoatDongKhoangSanFacadeService,
    public dmFacadeService: DmFacadeService,
    private formBuilder: FormBuilder,
    public commonService: CommonServiceShared,
    private translate: TranslateService
  ) {}

  async ngOnInit() {
    // Khởi tạo form
    this.formInit();
    // Lấy dữ liệu translate
    await this.getDataTranslate();

    //Lấy dữ liệu Cấp trữ lượng
    await this.getAllcapTruLuongData();

    // Khởi tạo form theo dạng add or edit (nếu là edit thì binding dữ liệu trên UI)
    await this.bindingConfigAddOrUpdate();
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

  setValidation() {
    this.validationErrorMessages = {
      idcaptruluong: {
        required: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN
          .cappheppheduyettruluongkhoangsan_khoiluong.captruluongRequired,
      },
      tenkhoitruluong: {
        required: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN
          .cappheppheduyettruluongkhoangsan_khoiluong.tenkhoitruluongRequired,
      },
      truluong: {
        required: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN
          .cappheppheduyettruluongkhoangsan_khoiluong.truluongRequired,
        pattern: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN
          .cappheppheduyettruluongkhoangsan_khoiluong.truluongIsNumber,
      },
      mucsaucaodothapnhat: {
        required: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN
          .cappheppheduyettruluongkhoangsan_khoiluong
          .mucsaucaodothapnhatRequired,
        pattern: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN
          .cappheppheduyettruluongkhoangsan_khoiluong
          .mucsaucaodothapnhatIsNumber,
      },
      mucsaucaodocaonhat: {
        required: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN
          .cappheppheduyettruluongkhoangsan_khoiluong
          .mucsaucaodocaonhatRequired,
        pattern: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN
          .cappheppheduyettruluongkhoangsan_khoiluong
          .mucsaucaodocaonhatIsNumber,
      },
      donvitruluong: {
        required: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN
          .cappheppheduyettruluong_loaikhoangsan.donvitruluongRequired,
      },
      donvichieusau: {
        required: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN
          .cappheppheduyettruluongkhoangsan_khoiluong.donvichieusauRequired,
      },
    };
  }
  /**
   * Hàm lấy dữ liệu Cấp trữ lượng
   */
  async getAllcapTruLuongData(param: any = { PageNumber: 1, PageSize: -1 }) {
    const listData: any = await this.dmFacadeService
      .getDmCapTruLuongService()
      .getFetchAll(param);
    this.capTruLuongData = listData.items;
  }

  /**
   * Hàm khởi tạo form theo dạng edit
   */
  async bindingConfigAddOrUpdate() {
    this.inputModel = new InputCpPheDuyetTruLuongKhoiTruLuongModel();
    //default dữ liệu combo
    // check edit
    await this.formOnEdit();
  }

  /**
   * hàm set value cho form, lần đầu khi EDIT
   */
  async formOnEdit() {
    if (this.obj && this.purpose === "edit") {
      //gán dữ liệu vào form
      this.khoiLuongTruLuongForm.setValue({
        idcaptruluong: this.obj.idcaptruluong,
        tenkhoitruluong: this.obj.tenkhoitruluong,
        truluong: this.obj.truluong,
        mucsaucaodothapnhat: this.obj.mucsaucaodothapnhat,
        mucsaucaodocaonhat: this.obj.mucsaucaodocaonhat,
        donvitruluong: this.obj.donvitruluong,
        donvichieusau: this.obj.donvichieusau,
        ghichu: this.obj.ghichu,
      });
    }
  }

  /**
   * Hàm khởi tạo form
   */
  formInit() {
    this.khoiLuongTruLuongForm = this.formBuilder.group({
      idcaptruluong: ["", Validators.required],
      tenkhoitruluong: ["", Validators.required],
      truluong: ["", [Validators.required, Validators.pattern("^[0-9-+]+$")]],
      mucsaucaodothapnhat: [
        "",
        [Validators.required, Validators.pattern("^[0-9-+]+$")],
      ],
      mucsaucaodocaonhat: [
        "",
        [Validators.required, Validators.pattern("^[0-9-+]+$")],
      ],
      donvitruluong: ["", Validators.required],
      donvichieusau: ["", Validators.required],
      ghichu: [""],
    });
  }

  /**
   * Hàm close sidenav
   */
  public closeCpThamDoLoaiKhoangSanIOSidenav() {
    this.matSidenavService.close();
  }

  /**
   * Hàm được gọi khi nhấn nút Lưu, Truyền vào operMode để biết là Edit hay tạo mới
   * @param operMode
   */
  async onSubmit(operMode: string) {
    debugger;
    this.logAllValidationErrorMessages();
    if (this.khoiLuongTruLuongForm.valid === true) {
      this.addOrUpdate(operMode);
      this.matSidenavService.close();
    }
  }
  /**
   * hàm kiểm tra validation form
   */
  public logAllValidationErrorMessages() {
    validationAllErrorMessagesService(
      this.khoiLuongTruLuongForm,
      this.validationErrorMessages,
      this.formErrors
    );
  }

  /**
   * Hàm thực thi chức năng add và edit
   */
  private addOrUpdate(operMode: string) {
    const khoiLuongTruLuongService = this.capPhepHoatDongKhoangSanFacadeService.getCapPhepPheDuyetTLKS_khoiLuongTruLuongService();
    // Gán dữ liệu input vào model
    this.inputModel = this.khoiLuongTruLuongForm.value;
    this.inputModel.idpheduyettruluong = this.obj.idpheduyettruluong;
    //Thêm
    if (operMode === "new") {
      khoiLuongTruLuongService.addItem(this.inputModel).subscribe(
        (res) =>
          this.matSidenavService.doParentFunction(
            "layDanhSachKhoiLuongTruLuong"
          ),
        (error: HttpErrorResponse) => {
          this.commonService.showDialogWarning(error.error.errors);
        },
        () =>
          this.commonService.showeNotiResult(
            this.dataTranslate.COMMON.default.successAdd,
            2000
          )
      );
    }
    //Sửa
    else if (operMode === "edit") {
      this.inputModel.idpheduyettruluongkhoitruluong = this.obj.idpheduyettruluongkhoitruluong;
      khoiLuongTruLuongService.updateItem(this.inputModel).subscribe(
        (res) =>
          this.matSidenavService.doParentFunction(
            "layDanhSachKhoiLuongTruLuong"
          ),
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
   * Hàm lưu và reset form để tiếp tục nhập mới dữ liệu. Trường hợp này khi người dùng muốn nhập dữ liệu liên tục
   * @param operMode
   */
  async onContinueAdd(operMode: string) {
    this.logAllValidationErrorMessages();
    if (this.khoiLuongTruLuongForm.valid === true) {
      this.addOrUpdate(operMode);
      this.onFormReset();
      this.purpose = "new";
    }
  }

    /**
   * Hàm reset form, gọi khi nhấn nút reset dữ liệu
   */
  public onFormReset() {
    // Hàm .reset sẽ xóa trắng mọi control trên form
    this.khoiLuongTruLuongForm.reset();
  }
}
