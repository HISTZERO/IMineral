import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatSelectChange } from "@angular/material";
import { TranslateService } from "@ngx-translate/core";
import { InputCpPheDuyetTLLoaiKSModel } from "src/app/models/admin/capphephoatdongkhoangsan/cppheduyettruluongkhoangsan/cppheduyettruluongloaikhoangsan.model";
import { InputCpThamDoLoaiKhoangSanModel } from "src/app/models/admin/capphephoatdongkhoangsan/cpthamdoloaikhoangsan.model";
import { OutputDmCapTruLuongModel } from "src/app/models/admin/danhmuc/captruluong.model";
import { OutputDmLoaiKhoangSanModel } from "src/app/models/admin/danhmuc/loaikhoangsan.model";
import { OutputDmNhomKhoangSanModel } from "src/app/models/admin/danhmuc/nhomkhoangsan.model";
import { CapPhepHoatDongKhoangSanFacadeService } from "src/app/services/admin/capphephoatdongkhoangsan/capphephoatdongkhoangsan-facade.service";
import { DmFacadeService } from "src/app/services/admin/danhmuc/danhmuc-facade.service";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { validationAllErrorMessagesService } from "src/app/services/utilities/validatorService";
import { CapPhepPheDuyetTLKS_PhanLoai } from "src/app/shared/constants/cappheptruluong-constants";
import { DonViTruLuong } from "src/app/shared/constants/common-constants";
import { Paging, TrangThaiEnum } from "src/app/shared/constants/enum";

@Component({
  selector: "app-cp-pdtlks-loaikhoangsan-io",
  templateUrl: "./cp-pdtlks-loaikhoangsan-io.component.html",
  styleUrls: ["./cp-pdtlks-loaikhoangsan-io.component.scss"],
})
export class CpPdtlksLoaikhoangsanIoComponent implements OnInit {
  // Chứa dữ liệu đối tượng truyền từ list comp
  public obj: any;
  // Chứa kiểu form
  public purpose: string;
  // Chứa dữ liệu Form
  public cpThamDoLoaiKhoangSanIOForm: FormGroup;
  // Chứa trạng thái hiển thị của combobox trên layout
  public classColWithFiftyPercentForCombobox = false;
  // Chứa danh sách Loại khoáng sản
  public allLoaiKhoangSan: OutputDmLoaiKhoangSanModel[];
  // Filter Loại khoáng sản
  public loaiKhoangSanFilters: OutputDmLoaiKhoangSanModel[];
  public tenLoaiKhoangSanDisplay: string;
  public tenNhomKhoangSanDisplay: string;
  // Chứa danh sách Nhóm khoáng sản
  public allNhomKhoangSan: OutputDmNhomKhoangSanModel[];
  // Filter Nhóm khoáng sản
  public nhomKhoangSanFilters: OutputDmNhomKhoangSanModel[];
  //Danh mục phân loại
  public phanLoaiData: any = CapPhepPheDuyetTLKS_PhanLoai;
  public capTruLuongData: OutputDmCapTruLuongModel[];
  public donViTruLuongData: any = DonViTruLuong;
  // Chứa dữ liệu input
  public inputModel: InputCpPheDuyetTLLoaiKSModel;
  // Chứa dữ liệu translate
  public dataTranslate: any;
  // error message
  validationErrorMessages = {};

  // form errors
  formErrors = {
    tenkhoangsan: "",
    idloaikhoangsan: "",
    idnhomkhoangsan: "",
    idcaptruluong: "",
    truluong: "",
    donvitruluong: "",
    phanloai: "",
  };
  constructor(
    public matSidenavService: MatsidenavService,
    public dmFacadeService: DmFacadeService,
    private capPhepHoatDongKhoangSanFacadeService: CapPhepHoatDongKhoangSanFacadeService,
    private formBuilder: FormBuilder,
    public commonService: CommonServiceShared,
    private translate: TranslateService
  ) {}

  async ngOnInit() {
    // Khởi tạo form
    this.formInit();
    // Lấy dữ liệu translate
    await this.getDataTranslate();

    // Lấy dữ liệu nhóm khoáng sản
    await this.getAllNhomKhoangSan();

    //Lấy dữ liệu Cấp trữ lượng
    await this.getAllcapTruLuongData();

    // Khởi tạo form theo dạng add or edit (nếu là edit thì binding dữ liệu trên UI)
    await this.bindingConfigAddOrUpdate();
  }

  /**
   * Hàm khởi tạo form
   */
  formInit() {
    this.cpThamDoLoaiKhoangSanIOForm = this.formBuilder.group({
      tenkhoangsan: ["", Validators.required],
      idloaikhoangsan: ["", Validators.required],
      idnhomkhoangsan: ["", Validators.required],
      idcaptruluong: ["", Validators.required],
      truluong: ["", [Validators.required, Validators.pattern("^[0-9-+]+$")]],
      donvitruluong: ["", Validators.required],
      phanloai: ["", Validators.required],
    });
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
      tenkhoangsan: {
        required: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN
          .cappheppheduyettruluong_loaikhoangsan.tenkhoangsanRequired,
      },
      idloaikhoangsan: {
        required: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN
          .cappheppheduyettruluong_loaikhoangsan.loaikhoangsanRequired,
      },
      idnhomkhoangsan: {
        required: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN
          .cappheppheduyettruluong_loaikhoangsan.nhomkhoangsanRequired,
      },
      idcaptruluong: {
        required: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN
          .cappheppheduyettruluong_loaikhoangsan.captruluongRequired,
      },
      truluong: {
        required: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN
          .cappheppheduyettruluong_loaikhoangsan.captruluongRequired,
        pattern: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN
          .cappheppheduyettruluongkhoangsan_khoiluong.truluongIsNumber,
      },
      donvitruluong: {
        required: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN
          .cappheppheduyettruluong_loaikhoangsan.donvitruluongRequired,
      },
      phanloai: {
        required: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN
          .cappheppheduyettruluong_loaikhoangsan.phanloaiRequired,
      },
    };
  }

  /**
   * Hàm khởi tạo form theo dạng edit
   */
  async bindingConfigAddOrUpdate() {
    this.inputModel = new InputCpPheDuyetTLLoaiKSModel();
    //default dữ liệu combo
    // check edit
    await this.formOnEdit();
  }

  /**
   * hàm set value cho form, lần đầu khi EDIT
   */
  async formOnEdit() {
    if (this.obj && this.purpose === "edit") {
      this.classColWithFiftyPercentForCombobox = true;
      //Lấy danh sách Loại khoáng sản theo Nhóm
      await this.getAllLoaiKhoangSan(this.obj.idnhomkhoangsan);
      //gán dữ liệu vào form
      this.cpThamDoLoaiKhoangSanIOForm.setValue({
        tenkhoangsan: this.obj.tenkhoangsan,
        idloaikhoangsan: this.obj.idloaikhoangsan,
        idnhomkhoangsan: this.obj.idnhomkhoangsan,
        idcaptruluong: this.obj.idcaptruluong,
        truluong: this.obj.truluong,
        donvitruluong: this.obj.donvitruluong,
        phanloai: this.obj.phanloai,
      });

      this.tenNhomKhoangSanDisplay = this.obj.tennhomkhoangsan;
      this.tenLoaiKhoangSanDisplay = this.obj.tenloaikhoangsan;
    }
  }

  /**
   * Hàm lấy danh sách nhóm khoáng sản
   */
  async getAllNhomKhoangSan() {
    const allNhomKhoangSanData: any = await this.dmFacadeService
      .getDmNhomKhoangSanService()
      .getFetchAll({
        Trangthai: TrangThaiEnum.Active,
        PageNumber: 1,
        PageSize: -1,
      });
    this.allNhomKhoangSan = allNhomKhoangSanData.items;
    this.nhomKhoangSanFilters = allNhomKhoangSanData.items;
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
   * Hàm lấy danh sách Loại khoáng sản theo Nhóm khoáng sản
   */
  async getAllLoaiKhoangSan(idNhomKhoangSan: string) {
    const allLoaikhoangSanData: any = await this.dmFacadeService
      .getDmLoaiKhoangSanService()
      .getFetchAll({
        Idnhomkhoangsan: idNhomKhoangSan,
        Trangthai: TrangThaiEnum.Active,
        PageNumber: Paging.PageNumber,
        PageSize: Paging.PageSize,
      });
    this.allLoaiKhoangSan = allLoaikhoangSanData.items;
    this.loaiKhoangSanFilters = allLoaikhoangSanData.items;
  }

  //xử lý khi chọn Nhóm Khoáng sản
  async selectNhomKhoangSanHandler(event: MatSelectChange) {
    const idNhomKhoangSan = event.value;
    if (idNhomKhoangSan) {
      //Load combobox loại khoáng sản
      await this.getAllLoaiKhoangSan(idNhomKhoangSan);
    } else {
      this.allLoaiKhoangSan = [];
      this.loaiKhoangSanFilters = [];
    }

    //đẩy thông tin sang cột bên nếu là edit
    if (this.purpose == "edit") {
      this.tenNhomKhoangSanDisplay = event.source.triggerValue;
      this.tenLoaiKhoangSanDisplay = null;
      if (event.value == "") {
        this.tenNhomKhoangSanDisplay = this.obj.tennhomkhoangsan;
        this.tenLoaiKhoangSanDisplay = this.obj.tenloaikhoangsan;
      }
    }
  }
  /**
   * xử lý khi chọn Loại khoáng sản
   */
  selectLoaiKhoangSanHandler(event: MatSelectChange) {
    if (this.purpose == "edit") {
      this.tenLoaiKhoangSanDisplay = event.source.triggerValue;
      if (event.value == "") {
        debugger;
        this.tenLoaiKhoangSanDisplay = null;
      }
    }
  }
  /**
   * Hàm được gọi khi nhấn nút Lưu, Truyền vào operMode để biết là Edit hay tạo mới
   * @param operMode
   */
  async onSubmit(operMode: string) {
    this.logAllValidationErrorMessages();
    if (this.cpThamDoLoaiKhoangSanIOForm.valid === true) {
      this.addOrUpdate(operMode);
      this.matSidenavService.close();
    }
  }
  /**
   * hàm kiểm tra validation form
   */
  public logAllValidationErrorMessages() {
    validationAllErrorMessagesService(
      this.cpThamDoLoaiKhoangSanIOForm,
      this.validationErrorMessages,
      this.formErrors
    );
  }

  /**
   * Hàm thực thi chức năng add và edit
   */
  private addOrUpdate(operMode: string) {
    const cpThamDoLoaiKhoangSanService = this.capPhepHoatDongKhoangSanFacadeService.getCapPhepPheDuyetTLKS_loaiKSService();
    // Gán dữ liệu input vào model
    this.inputModel = this.cpThamDoLoaiKhoangSanIOForm.value;
    this.inputModel.idpheduyettruluong = this.obj.idpheduyettruluong;
    debugger;
    //Thêm
    if (operMode === "new") {
      cpThamDoLoaiKhoangSanService.addItem(this.inputModel).subscribe(
        (res) =>
          this.matSidenavService.doParentFunction(
            "getAllLoaiKhoangSanTheoPheDuyetTruLuong"
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
      this.inputModel.idpheduyettruluongloaikhoangsan = this.obj.idpheduyettruluongloaikhoangsan;
      cpThamDoLoaiKhoangSanService.updateItem(this.inputModel).subscribe(
        (res) =>
          this.matSidenavService.doParentFunction(
            "getAllLoaiKhoangSanTheoPheDuyetTruLuong"
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
    if (this.cpThamDoLoaiKhoangSanIOForm.valid === true) {
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
    this.cpThamDoLoaiKhoangSanIOForm.reset();
  }

  /**
   * Hàm close sidenav
   */
  public closeCpThamDoLoaiKhoangSanIOSidenav() {
    this.matSidenavService.close();
  }
}
