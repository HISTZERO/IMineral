import {Component, OnInit, ViewChild} from '@angular/core';
import {GridComponent, TextWrapSettingsModel} from "@syncfusion/ej2-angular-grids";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {LoaiCapPhepEnum} from "src/app/shared/constants/enum";
import {OutputDmHeQuyChieuModel} from "src/app/models/admin/danhmuc/hequychieu.model";
import {DonViDienTich} from "src/app/shared/constants/common-constants";
import {SettingsCommon} from "src/app/shared/constants/setting-common";
import {DefaultValue} from "src/app/shared/constants/global-var";
import {MatsidenavService} from "src/app/services/utilities/matsidenav.service";
import {CapPhepHoatDongKhoangSanFacadeService} from "src/app/services/admin/capphephoatdongkhoangsan/capphephoatdongkhoangsan-facade.service";
import {DmFacadeService} from "src/app/services/admin/danhmuc/danhmuc-facade.service";
import {CommonServiceShared} from "src/app/services/utilities/common-service";
import {TranslateService} from "@ngx-translate/core";
import {HttpErrorResponse} from "@angular/common/http";
import {validationAllErrorMessagesService} from "src/app/services/utilities/validatorService";
import {OutputCpDauGiaToaDoKhuVucModel} from "src/app/models/admin/capphephoatdongkhoangsan/cpdaugiakhaithac/cpdaugiatoadokhuvuc.model";
import {InputCpDauGiaKhuVucModel} from "src/app/models/admin/capphephoatdongkhoangsan/cpdaugiakhaithac/cpdaugiakhuvuc.model";

@Component({
  selector: 'app-cp-daugiakhaithac-khuvuc-io',
  templateUrl: './cp-daugiakhaithac-khuvuc-io.component.html',
  styleUrls: ['./cp-daugiakhaithac-khuvuc-io.component.scss']
})
export class CpDaugiakhaithacKhuvucIoComponent implements OnInit {


  // Viewchild template
  @ViewChild("gridCpToaDoKhuVuc", {static: false}) public gridCpToaDoKhuVuc: GridComponent;

  // Chứa dữ liệu Form khu vực
  public cpDauGiaKhuVucIOForm: FormGroup;

  // Chứa dữ liệu Form Tọa độ
  public cpDauGiaToaDoKhuVucIOForm: FormGroup;

  // Chứa danh sách tọa độ
  public listToaDoKhuVuc: OutputCpDauGiaToaDoKhuVucModel[] = [];

  // Chứa loại cấp phép
  public loaiCapPhep = LoaiCapPhepEnum;

  // Chứa dữ liệu đối tượng truyền từ list comp
  public obj: any;

  // Chứa kiểu form
  public purpose: string;

  // Chứa dữ liệu input khu vực thăm dò
  public inputModelKhuVuc: InputCpDauGiaKhuVucModel;

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

  // Chứa thông báo lỗi thứ tự
  public errorThuTu = DefaultValue.Empty;

  // error message
  validationErrorMessages = {};

  // Chứa error tọa độ khu vực
  public validationErrorToaDo = {};
  // Lưu tên hệ quy chiếu sử dụng hiện tại
  public tenHeQuyChieu = DefaultValue.Empty;

  // Form errors khu vực
  formErrors = {
    tenkhuvuc: DefaultValue.Empty,
    dientich: DefaultValue.Empty,
    donvidientich: DefaultValue.Empty,
    // hequychieu: DefaultValue.Empty,
  };

  // Form errors tọa độ
  formErrorsToaDo = {
    thutu: DefaultValue.Empty,
    sohieu: DefaultValue.Empty,
    toadox: DefaultValue.Empty,
    toadoy: DefaultValue.Empty,
  };

  constructor(
    public matSidenavService: MatsidenavService,
    public capPhepHoatDongKhoangSanFacadeService: CapPhepHoatDongKhoangSanFacadeService,
    public dmFacadeService: DmFacadeService,
    private formBuilder: FormBuilder,
    public commonService: CommonServiceShared,
    private translate: TranslateService) {
  }

  async ngOnInit() {
    // Khởi tạo form
    await this.formInit();
    // Lấy dữ liệu translate
    await this.getDataTranslate();
    // Lấy dữ liệu hệ quy chiếu
    await this.geAllHeQuyChieu();
    // Khởi tạo form theo dạng add or edit
    await this.bindingConfigAddOrUpdate();
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
    // Error message khu vực
    this.validationErrorMessages = {
      tenkhuvuc: {required: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.capphepthamdokhuvuc.tenkhuvucRequired},
      dientich: {required: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.capphepthamdokhuvuc.dientichRequired},
      donvidientich: {required: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.capphepthamdokhuvuc.donvidientichRequired}
      // hequychieu: { required: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.capphepthamdokhuvuc.hequychieuRequired },
    };

    // Error message Tọa độ
    this.validationErrorToaDo = {
      thutu: {
        required: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.capphepthamdokhuvuc.thutuRequired,
        pattern: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.capphepthamdokhuvuc.thutuIsNumber
      },
      sohieu: {required: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.capphepthamdokhuvuc.sohieuRequired},
      toadox: {
        required: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.capphepthamdokhuvuc.toadoxRequired,
        pattern: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.capphepthamdokhuvuc.toadoxIsNumber,
      },
      toadoy: {
        required: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.capphepthamdokhuvuc.toadoyRequired,
        pattern: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.capphepthamdokhuvuc.toadoyIsNumber
      }
    };
  }

  /**
   * Hàm khởi tạo form theo dạng edit
   */
  bindingConfigAddOrUpdate() {
    this.inputModelKhuVuc = new InputCpDauGiaKhuVucModel();
    this.formOnEdit();

    if (this.obj && this.obj.hequychieu !== DefaultValue.Undefined && this.obj.hequychieu !== DefaultValue.Null && this.obj.hequychieu.trim() !== DefaultValue.Empty) {
      this.tenHeQuyChieu = this.getTenHeQuyChieu(this.obj.hequychieu);
    }
  }

  /**
   * Hàm khởi tạo form
   */
  formInit() {
    this.cpDauGiaKhuVucIOForm = this.formBuilder.group({
      tenkhuvuc: [DefaultValue.Empty, Validators.required],
      dientich: [DefaultValue.Empty, [Validators.required, Validators.pattern(/^[-+]?\d*\.?\d*$/)]],
      donvidientich: [DefaultValue.Empty, Validators.required],
      // hequychieu: [DefaultValue.Empty, Validators.required],
    });

    this.cpDauGiaToaDoKhuVucIOForm = this.formBuilder.group({
      thutu: [DefaultValue.Empty, [Validators.required, Validators.pattern(/^[-+]?\d*\.?\d*$/)]],
      sohieu: [DefaultValue.Empty, Validators.required],
      toadox: [DefaultValue.Empty, [Validators.required, Validators.pattern(/^[-+]?\d*\.?\d*$/)]],
      toadoy: [DefaultValue.Empty, [Validators.required, Validators.pattern(/^[-+]?\d*\.?\d*$/)]],
    });
  }

  /**
   * hàm set value cho form
   */
  formOnEdit() {
    if (this.obj && this.purpose === 'edit') {
      this.cpDauGiaKhuVucIOForm.setValue({
        tenkhuvuc: this.obj.tenkhuvuc,
        dientich: this.obj.dientich,
        donvidientich: this.obj.donvidientich,
        // hequychieu: this.obj.hequychieu,
      });
      this.listToaDoKhuVuc = this.obj.lstToaDo;
    }
  }

  /**
   * Hàm hiển thị tên hệ quy chiếu
   */
  private getTenHeQuyChieu(srid: string) {
    if (this.allHeQuyChieu && this.allHeQuyChieu.length > DefaultValue.Zero) {
      const itemHeQuyChieu = this.allHeQuyChieu.find(item => item.srid === srid);

      if (itemHeQuyChieu) {
        let data = this.dataTranslate.DANHMUC.hequychieu.meridian + DefaultValue.Colon + itemHeQuyChieu.meridian;
        data += DefaultValue.Hyphen + this.dataTranslate.DANHMUC.hequychieu.prjzone + DefaultValue.Colon + itemHeQuyChieu.prjzone;
        return data;
      }
    }

    return DefaultValue.Empty;
  }

  /**
   * Hàm lấy danh sách Hệ quy chiếu
   */
  async geAllHeQuyChieu() {
    const allHeQuyChieuData: any = await this.dmFacadeService
      .getDmHeQuyChieuService()
      .getFetchAll({PageNumber: 1, PageSize: -1});
    this.allHeQuyChieu = allHeQuyChieuData.items;
    this.HeQuyChieuFilters = allHeQuyChieuData.items;
  }

  /**
   * Hàm thực thi chức năng add và edit
   */
  async addOrUpdate(operMode: string) {

    const cpDauGiaKhuVucService = this.capPhepHoatDongKhoangSanFacadeService.getCapPhepDauGiaKhuVucService();
    // Gán dữ liệu input vào model
    this.inputModelKhuVuc = this.cpDauGiaKhuVucIOForm.value;
    this.inputModelKhuVuc.idcapphepdaugia = this.obj.idcapphepdaugia;
    this.inputModelKhuVuc.loaicapphep = this.obj.loaicapphep;
    this.inputModelKhuVuc.hequychieu = this.obj.hequychieu;
    if (operMode === "new") {
      this.inputModelKhuVuc.lstToado = await this.generateModelData();
      cpDauGiaKhuVucService.addItem(this.inputModelKhuVuc).subscribe(
        (res) => {
          this.listToaDoKhuVuc = [];
          this.matSidenavService.doParentFunction("getAllCpDauGiaKhuVuc");
        },
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
      this.inputModelKhuVuc.iddaugiakhuvuc = this.obj.iddaugiakhuvuc;
      this.inputModelKhuVuc.idcapphepdaugia = this.obj.idcapphepdaugia;
      this.inputModelKhuVuc.lstToado = await this.generateModelData();
      cpDauGiaKhuVucService.updateItem(this.inputModelKhuVuc).subscribe(
        (res) => {
          this.listToaDoKhuVuc = [];
          this.matSidenavService.doParentFunction("getAllCpDauGiaKhuVuc");
        },
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
   * Tạo model dữ liệu insert và update
   */
  async generateModelData() {
    const listToaDo = [];

    // tạo đối tượng dữ liệu
    for (const i of this.listToaDoKhuVuc) {
      const item = {
        idcapphepdaugia: this.obj.idcapphepdaugia,
        iddaugiakhuvuc: this.purpose === 'edit' && this.obj && this.obj.iddaugiakhuvuc ? this.obj.iddaugiakhuvuc : DefaultValue.Empty,
        loaicapphep: this.obj.loaicapphep,
        sohieu: i.sohieu,
        thutu: i.thutu,
        toadox: i.toadox,
        toadoy: i.toadoy,
      };
      // Thêm vào mảng
      listToaDo.push(item);
    }

    return listToaDo;
  }

  /**
   * Hàm được gọi khi nhấn nút Lưu, Truyền vào operMode để biết là Edit hay tạo mới
   * @param operMode
   */
  async onSubmit(operMode: string) {
    this.logAllValidationErrorMessages();
    if (this.cpDauGiaKhuVucIOForm.valid === true) {
      this.addOrUpdate(operMode);
      this.matSidenavService.close();
    }
  }


  /**
   * Hàm reset form, gọi khi nhấn nút reset dữ liệu
   */
  public onFormReset() {
    // Hàm .reset sẽ xóa trắng mọi control trên form
    this.cpDauGiaKhuVucIOForm.reset({
      tenkhuvuc: DefaultValue.Empty,
      dientich: DefaultValue.Empty,
      donvidientich: DefaultValue.Empty,
      hequychieu: DefaultValue.Empty,
    });

    this.cpDauGiaToaDoKhuVucIOForm.reset({
      thutu: DefaultValue.Empty,
      sohieu: DefaultValue.Empty,
      toadox: DefaultValue.Empty,
      toadoy: DefaultValue.Empty,
    });
  }

  /**
   * Hàm lưu và reset form để tiếp tục nhập mới dữ liệu. Trường hợp này khi người dùng muốn nhập dữ liệu liên tục
   * @param operMode
   */
  async onContinueAdd(operMode: string) {
    this.logAllValidationErrorMessages();
    if (this.cpDauGiaKhuVucIOForm.valid === true) {
      await this.addOrUpdate(operMode);
      this.onFormReset();
      this.purpose = "new";
    }
  }

  /**
   * Hàm kiểm tra validation form khu vực
   */
  public logAllValidationErrorMessages() {
    validationAllErrorMessagesService(
      this.cpDauGiaKhuVucIOForm,
      this.validationErrorMessages,
      this.formErrors
    );
  }

  /**
   * Hàm kiểm tra validation form tọa độ
   */
  public logAllValidationErrorMessagesToaDo() {
    validationAllErrorMessagesService(
      this.cpDauGiaToaDoKhuVucIOForm,
      this.validationErrorToaDo,
      this.formErrorsToaDo
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
    this.logAllValidationErrorMessagesToaDo();
    const dataToaDo: any = [this.cpDauGiaToaDoKhuVucIOForm.value];
    let status = true;

    // Check dữ liệu thứ tự có trùng không
    for (let i = this.listToaDoKhuVuc.length; i--;) {
      if (dataToaDo.find(item => item.thutu === this.listToaDoKhuVuc[i].thutu)) {
        this.errorThuTu = this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.capphepthamdokhuvuc.thutuDuplicate;
        status = false;
      }
    }

    // Nếu không trùng thì thêm vào grid
    if (status === true && this.cpDauGiaToaDoKhuVucIOForm.valid === true) {
      this.listToaDoKhuVuc.push(this.cpDauGiaToaDoKhuVucIOForm.value);
      this.gridCpToaDoKhuVuc.refresh();
      this.cpDauGiaToaDoKhuVucIOForm.reset();
      this.errorThuTu = DefaultValue.Empty;
    }
  }

  /**
   * Hàm xóa item trên grid
   * @param data
   */
  public deleteToaDoKhuVuc(data: any) {
    // Thêm item vào mảng
    const itemList: any[] = [];
    itemList.push(data);

    // Xóa item đã chọn trong danh sách
    for (let i = this.listToaDoKhuVuc.length; i--;) {
      if (itemList.find(item => item.thutu === this.listToaDoKhuVuc[i].thutu)) {
        this.listToaDoKhuVuc.splice(i, 1);
      }
    }

    // Làm mới grid
    this.gridCpToaDoKhuVuc.refresh();
  }


}
