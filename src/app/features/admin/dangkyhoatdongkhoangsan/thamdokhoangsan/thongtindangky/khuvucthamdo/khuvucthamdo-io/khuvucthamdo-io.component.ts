import { HttpErrorResponse } from "@angular/common/http";
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { GridComponent, TextWrapSettingsModel } from "@syncfusion/ej2-angular-grids";
import { InputDkThamDoToaDoKhuVucModel } from "../../../../../../../models/admin/dangkyhoatdongkhoangsan/dkthamdotoadokhuvuc.model";
import { InputDkThamDoKhuVucModel } from "../../../../../../../models/admin/dangkyhoatdongkhoangsan/dkthamsokhuvuc.model";
import { OutputDmHeQuyChieuModel } from "../../../../../../../models/admin/danhmuc/hequychieu.model";
import { DangKyHoatDongKhoangSanFacadeService } from "../../../../../../../services/admin/dangkyhoatdongkhoangsan/dangkyhoatdongkhoangsan-facade.service";
import { DmFacadeService } from "../../../../../../../services/admin/danhmuc/danhmuc-facade.service";
import { CommonServiceShared } from "../../../../../../../services/utilities/common-service";
import { MatsidenavService } from "../../../../../../../services/utilities/matsidenav.service";
import { validationAllErrorMessagesService } from "../../../../../../../services/utilities/validatorService";
import { DonViDienTich, LoaiKhuVucThamDo } from "../../../../../../../shared/constants/common-constants";
import { SettingsCommon } from "../../../../../../../shared/constants/setting-common";

@Component({
  selector: 'app-khuvucthamdo-io',
  templateUrl: './khuvucthamdo-io.component.html',
  styleUrls: ['./khuvucthamdo-io.component.scss']
})
export class KhuvucthamdoIoComponent implements OnInit {

  // Viewchild template
  @ViewChild("gridDkToaDoKhuVuc", { static: false }) public gridDkToaDoKhuVuc: GridComponent;

  // Chứa dữ liệu Form khu vực
  public dKThamDoKhuVucIOForm: FormGroup;

  // Chứa dữ liệu Form Tọa độ
  public dkThamDoToaDoKhuVucIOForm: FormGroup;

  // Chứa danh sách tọa độ
  public listToaDoKhuVuc: any = [];

  // Chứa dữ liệu đối tượng truyền từ list comp
  public obj: any;

  // Chứa kiểu form
  public purpose: string;

  // Chứa dữ liệu input khu vực thăm dò
  public inputModelKhuVuc: InputDkThamDoKhuVucModel;

  // Chứa dữ liệu input tọa độ khu vực
  public inputModelToaDo: InputDkThamDoToaDoKhuVucModel;

  // Chứa danh sách Lĩnh Vực
  public allHeQuyChieu: OutputDmHeQuyChieuModel[];

  // Filter Lĩnh Vực
  public HeQuyChieuFilters: OutputDmHeQuyChieuModel[];

  // Chứa dữ liệu translate
  public dataTranslate: any;

  // lưu dữ liệu đơn vị diện tích
  public donViDienTichList = DonViDienTich;

  // Chứa thiết lập grid
  public settingsCommon = new SettingsCommon();

  // Chứa kiểu wrap text trên grid
  public wrapSettings: TextWrapSettingsModel;

  // Chứa danh sách loại khu vực thăm dò
  public loaiKhuVuc = LoaiKhuVucThamDo;


  // error message
  validationErrorMessages = {};

  // form errors
  formErrors = {
    tenkhuvuc: "",
    dientich: "",
    donvidientich: "",
    loaikhuvuc: "",
    hequychieu: "",
  };

  constructor(public matSidenavService: MatsidenavService,
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
    this.inputModelKhuVuc = new InputDkThamDoKhuVucModel();
    this.inputModelToaDo = new InputDkThamDoToaDoKhuVucModel();
    this.formOnEdit();
  }

  /**
   * Hàm khởi tạo form
   */
  formInit() {
    this.dKThamDoKhuVucIOForm = this.formBuilder.group({
      tenkhuvuc: ["", Validators.required],
      dientich: ["", Validators.required],
      donvidientich: ["", Validators.required],
      loaikhuvuc: [0],
      hequychieu: ["", Validators.required],
    });

    this.dkThamDoToaDoKhuVucIOForm = this.formBuilder.group({
      thutu: ["", Validators.required],
      sohieu: ["", Validators.required],
      toadox: ["", Validators.required],
      toadoy: ["", Validators.required],
    })
  }

  /**
   * hàm set value cho form
   */
  formOnEdit() {
    if (this.obj && this.purpose === 'edit') {
      this.dKThamDoKhuVucIOForm.setValue({
        tenkhuvuc: this.obj.tenkhuvuc,
        dientich: this.obj.dientich,
        donvidientich: this.obj.donvidientich,
        loaikhuvuc: this.obj.loaikhuvuc,
        hequychieu: this.obj.hequychieu,
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
    const dKThamDoKhuVucService = this.dangKyHoatDongKhoangSanFacadeService.getDangKyThamDoKhuVucService();
    // Gán dữ liệu input vào model
    this.inputModelKhuVuc = this.dKThamDoKhuVucIOForm.value;
    this.inputModelKhuVuc.iddangkythamdo = this.obj.iddangkythamdo;
    if (operMode === "new") {
      dKThamDoKhuVucService.addItem(this.inputModelKhuVuc).subscribe(
        (res) => this.matSidenavService.doParentFunction("getAllDkThamDoKhuVuc"),
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
      this.inputModelKhuVuc.idthamdokhuvuc = this.obj.idthamdokhuvuc;
      this.inputModelKhuVuc.iddangkythamdo = this.obj.iddangkythamdo;
      dKThamDoKhuVucService.updateItem(this.inputModelKhuVuc).subscribe(
        (res) => this.matSidenavService.doParentFunction("getAllDkThamDoKhuVuc"),
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
    if (this.dKThamDoKhuVucIOForm.valid === true) {
      this.addOrUpdate(operMode);
      this.matSidenavService.close();
    }
  }

  /**
   * Hàm reset form, gọi khi nhấn nút reset dữ liệu
   */
  public onFormReset() {
    // Hàm .reset sẽ xóa trắng mọi control trên form
    this.dKThamDoKhuVucIOForm.reset({
      tenkhuvuc: "",
      dientich: "",
      donvidientich: "",
      loaikhuvuc: 0,
      hequychieu: "",
    });
  }

  /**
   * Hàm lưu và reset form để tiếp tục nhập mới dữ liệu. Trường hợp này khi người dùng muốn nhập dữ liệu liên tục
   * @param operMode
   */
  async onContinueAdd(operMode: string) {
    this.logAllValidationErrorMessages();
    if (this.dKThamDoKhuVucIOForm.valid === true) {
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
      this.dKThamDoKhuVucIOForm,
      this.validationErrorMessages,
      this.formErrors
    );
  }

  /**
   * Hàm close sidenav
   */
  closeKhuVucToaDoIOSidenav() {
    this.matSidenavService.close();
  }

  /**
   * Lưu tọa độ khu vực
   */
  public saveToaDoKhuVuc() {
    this.listToaDoKhuVuc.push(this.dkThamDoToaDoKhuVucIOForm.value);
    this.gridDkToaDoKhuVuc.refresh();
    this.dkThamDoToaDoKhuVucIOForm.reset();
  }

  public editToaDoKhuVuc(item: any) {
    this.dkThamDoToaDoKhuVucIOForm.setValue({
      thutu: item.thutu,
      sohieu: item.sohieu,
      toadox: item.toadox,
      toadoy: item.toadoy,
    });
  }

  public deleteToaDoKhuVuc(item: any) {

  }
}
