import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { GridComponent, TextWrapSettingsModel } from "@syncfusion/ej2-angular-grids";
import { MatDialog } from "@angular/material";

import { OutputCpThamDoToaDoKhuVucModel } from "src/app/models/admin/capphephoatdongkhoangsan/cpthamdotoadokhuvuc.model";
import { OutputDmHeQuyChieuModel } from "src/app/models/admin/danhmuc/hequychieu.model";
import { DmFacadeService } from "src/app/services/admin/danhmuc/danhmuc-facade.service";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { validationAllErrorMessagesService } from "src/app/services/utilities/validatorService";
import { DonViDienTich, LoaiKhuVucThamDo } from "src/app/shared/constants/common-constants";
import { SettingsCommon } from "src/app/shared/constants/setting-common";
import { LoaiCapPhepEnum } from "src/app/shared/constants/enum";
import { CapPhepHoatDongKhoangSanFacadeService } from 'src/app/services/admin/capphephoatdongkhoangsan/capphephoatdongkhoangsan-facade.service';
import { DefaultValue } from 'src/app/shared/constants/global-var';
import { InputCpKhaiThacKhuVucModel } from "src/app/models/admin/capphephoatdongkhoangsan/cpkhaithackhoangsan/cpkhaithackhuvuc.model";
import { ViewcoordinatesComponent } from "src/app/shared/components/viewcoordinates/viewcoordinates.component";
import { MatdialogService } from "src/app/services/utilities/matdialog.service";
import { MapFacadeService } from "src/app/services/admin/map/map-facade.service";

@Component({
  selector: 'app-cp-ktks-khuvuckhaithac-io',
  templateUrl: './cp-ktks-khuvuckhaithac-io.component.html',
  styleUrls: ['./cp-ktks-khuvuckhaithac-io.component.scss']
})
export class CpKtksKhuvuckhaithacIoComponent implements OnInit {

  // Viewchild template
  @ViewChild("gridCpToaDoKhuVuc", { static: false }) public gridCpToaDoKhuVuc: GridComponent;

  // Chứa dữ liệu Form khu vực
  public cpKhaiThacKhuVucIOForm: FormGroup;

  // Chứa dữ liệu Form Tọa độ
  public cpThamDoToaDoKhuVucIOForm: FormGroup;

  // Chứa danh sách tọa độ
  public listToaDoKhuVuc: OutputCpThamDoToaDoKhuVucModel[] = [];

  // Chứa loại cấp phép
  public loaiCapPhep = LoaiCapPhepEnum;

  // Chứa dữ liệu đối tượng truyền từ list comp
  public obj: any;

  // Chứa kiểu form
  public purpose: string;

  // Chứa dữ liệu input khu vực thăm dò
  public inputModelKhuVuc: InputCpKhaiThacKhuVucModel;

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

  // Chứa thông báo lỗi thứ tự
  public errorThuTu = DefaultValue.Empty;

  // Chứa thông báo lỗi item tọa độ
  public errorToaDo = DefaultValue.Empty;

  // error message
  validationErrorMessages = {};

  // Chứa error tọa độ khu vực
  public validationErrorToaDo = {};

  public mDialog: any;

  // Chứa geoJson
  public dataGeoJson: any;

  // Chứa trạng thái hiển thị nút xem bản đồ khu vực
  public showButtonViewMap: boolean = false;

  // Form errors khu vực
  formErrors = {
    tenkhuvuc: DefaultValue.Empty,
    dientich: DefaultValue.Empty,
    donvidientich: DefaultValue.Empty,
    loaikhuvuc: DefaultValue.Empty,
    hequychieu: DefaultValue.Empty,
  };

  // Form errors tọa độ
  formErrorsToaDo = {
    thutu: DefaultValue.Empty,
    sohieu: DefaultValue.Empty,
    toadox: DefaultValue.Empty,
    toadoy: DefaultValue.Empty,
  }

  constructor(
    public matSidenavService: MatsidenavService,
    public capPhepHoatDongKhoangSanFacadeService: CapPhepHoatDongKhoangSanFacadeService,
    public dmFacadeService: DmFacadeService,
    private formBuilder: FormBuilder,
    public commonService: CommonServiceShared,
    private translate: TranslateService,
    private imDialog: MatDialog,
    imDialogService: MatdialogService,
    private mapFacadeService: MapFacadeService,
  ) {
    this.mDialog = imDialogService;
    this.mDialog.initDialg(imDialog);
  }

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
    // Error message khu vực
    this.validationErrorMessages = {
      tenkhuvuc: { required: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.capphepkhaithackhuvuc.tenkhuvucRequired },
      dientich: { required: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.capphepkhaithackhuvuc.dientichRequired },
      donvidientich: { required: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.capphepkhaithackhuvuc.donvidientichRequired },
      hequychieu: { required: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.capphepkhaithackhuvuc.hequychieuRequired },
    };

    // Error message Tọa độ
    this.validationErrorToaDo = {
      thutu: {
        required: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.capphepkhaithackhuvuc.thutuRequired,
        pattern: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.capphepkhaithackhuvuc.thutuIsNumber
      },
      sohieu: { required: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.capphepkhaithackhuvuc.sohieuRequired },
      toadox: {
        required: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.capphepkhaithackhuvuc.toadoxRequired,
        pattern: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.capphepkhaithackhuvuc.toadoxIsNumber,
      },
      toadoy: {
        required: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.capphepkhaithackhuvuc.toadoyRequired,
        pattern: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.capphepkhaithackhuvuc.toadoyIsNumber
      }
    }
  }

  /**
   * Hàm khởi tạo form theo dạng edit
   */
  bindingConfigAddOrUpdate() {
    this.inputModelKhuVuc = new InputCpKhaiThacKhuVucModel();
    this.formOnEdit();
  }

  /**
   * Hàm khởi tạo form
   */
  formInit() {
    this.cpKhaiThacKhuVucIOForm = this.formBuilder.group({
      tenkhuvuc: [DefaultValue.Empty, Validators.required],
      dientich: [DefaultValue.Empty, [Validators.required, Validators.pattern(/^[-+]?\d*\.?\d*$/)]],
      donvidientich: [DefaultValue.Empty, Validators.required],
      loaikhuvuc: [0],
      hequychieu: [DefaultValue.Empty, Validators.required],
    });

    this.cpThamDoToaDoKhuVucIOForm = this.formBuilder.group({
      thutu: [DefaultValue.Empty, [Validators.required, Validators.pattern(/^[-+]?\d*\.?\d*$/)]],
      sohieu: [DefaultValue.Empty, Validators.required],
      toadox: [DefaultValue.Empty, [Validators.required, Validators.pattern(/^[-+]?\d*\.?\d*$/)]],
      toadoy: [DefaultValue.Empty, [Validators.required, Validators.pattern(/^[-+]?\d*\.?\d*$/)]],
    })
  }

  /**
   * hàm set value cho form
   */
  formOnEdit() {
    if (this.obj && this.purpose === 'edit') {
      this.cpKhaiThacKhuVucIOForm.setValue({
        tenkhuvuc: this.obj.tenkhuvuc,
        dientich: this.obj.dientich,
        donvidientich: this.obj.donvidientich,
        loaikhuvuc: this.obj.loaikhuvuc,
        hequychieu: this.obj.hequychieu,
      });

      this.listToaDoKhuVuc = this.obj.listtoado;

      // Kiểm tra dữ liệu để hiển thị nút xem bản đồ
      this.checkStateButtonViewMap();
    }
  }

  /**
   * Hàm lấy danh sách Hệ quy chiếu
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
  async addOrUpdate(operMode: string) {

    const cpThamDoKhuVucService = this.capPhepHoatDongKhoangSanFacadeService.getCapPhepKhaiThacKhuVucService();
    // Gán dữ liệu input vào model
    this.inputModelKhuVuc = this.cpKhaiThacKhuVucIOForm.value;
    this.inputModelKhuVuc.idcapphepkhaithac = this.obj.idcapphepkhaithac;
    this.inputModelKhuVuc.loaicapphep = this.obj.loaicapphep;

    if (operMode === "new") {
      this.inputModelKhuVuc.listtoado = await this.generateModelData();
      await cpThamDoKhuVucService.insertCapPhepKhaiThacKhuVuc(this.inputModelKhuVuc).subscribe(
        (res) => {
          this.listToaDoKhuVuc = [];
          this.matSidenavService.doParentFunction("getAllCpKhaiThacKhuVuc");
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
      this.inputModelKhuVuc.idkhaithackhuvuc = this.obj.idkhaithackhuvuc;
      this.inputModelKhuVuc.idcapphepkhaithac = this.obj.idcapphepkhaithac;
      this.inputModelKhuVuc.listtoado = await this.generateModelData();
      cpThamDoKhuVucService.updateCapPhepKhaiThacKhuVuc(this.inputModelKhuVuc).subscribe(
        (res) => {
          this.listToaDoKhuVuc = [];
          this.matSidenavService.doParentFunction("getAllCpKhaiThacKhuVuc");
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
        idcapphepkhaithac: this.obj.idcapphepkhaithac,
        idkhaithackhuvuc: this.purpose === 'edit' && this.obj && this.obj.idkhaithackhuvuc ? this.obj.idkhaithackhuvuc : DefaultValue.Empty,
        loaicapphep: this.obj.loaicapphep,
        loaikhuvuc: this.cpKhaiThacKhuVucIOForm.value.loaikhuvuc,
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
    if (this.listToaDoKhuVuc.length >= 3) {
      if (this.cpKhaiThacKhuVucIOForm.valid === true) {
        this.addOrUpdate(operMode);
        this.matSidenavService.close();
      }
    } else {
      this.errorToaDo = this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.capphepkhaithackhuvuc.errorToaDo;
    }

  }


  /**
   * Hàm reset form, gọi khi nhấn nút reset dữ liệu
   */
  public onFormReset() {
    // Hàm .reset sẽ xóa trắng mọi control trên form
    this.cpKhaiThacKhuVucIOForm.reset({
      tenkhuvuc: DefaultValue.Empty,
      dientich: DefaultValue.Empty,
      donvidientich: DefaultValue.Empty,
      loaikhuvuc: 0,
      hequychieu: DefaultValue.Empty,
    });

    this.cpThamDoToaDoKhuVucIOForm.reset({
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
    if (this.listToaDoKhuVuc.length >= 3) {
      if (this.cpKhaiThacKhuVucIOForm.valid === true) {
        this.addOrUpdate(operMode);
        this.onFormReset();
        this.purpose = "new";
      }
    } else {
      this.errorToaDo = this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.capphepkhaithackhuvuc.errorToaDo;
    }
  }

  /**
   * Hàm kiểm tra validation form khu vực
   */
  public logAllValidationErrorMessages() {
    validationAllErrorMessagesService(
      this.cpKhaiThacKhuVucIOForm,
      this.validationErrorMessages,
      this.formErrors
    );
  }

  /**
   * Hàm kiểm tra validation form tọa độ
   */
  public logAllValidationErrorMessagesToaDo() {
    validationAllErrorMessagesService(
      this.cpThamDoToaDoKhuVucIOForm,
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
    const dataToaDo: any = [this.cpThamDoToaDoKhuVucIOForm.value];
    let status = true;

    // Check dữ liệu thứ tự có trùng không
    for (let i = this.listToaDoKhuVuc.length; i--;) {
      if (dataToaDo.find(item => item.thutu === this.listToaDoKhuVuc[i].thutu)) {
        this.errorThuTu = this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.capphepkhaithackhuvuc.thutuDuplicate;
        status = false;
      }
    }

    // Nếu không trùng thì thêm vào grid
    if (status === true && this.cpThamDoToaDoKhuVucIOForm.valid === true) {
      this.listToaDoKhuVuc.push(this.cpThamDoToaDoKhuVucIOForm.value);
      this.gridCpToaDoKhuVuc.refresh();
      this.cpThamDoToaDoKhuVucIOForm.reset();
      this.errorThuTu = DefaultValue.Empty;

      // Kiểm tra dữ liệu để hiển thị nút xem bản đồ
      this.checkStateButtonViewMap();
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

    // Kiểm tra dữ liệu để hiển thị nút xem bản đồ
    this.checkStateButtonViewMap();
    
    // Làm mới grid
    this.gridCpToaDoKhuVuc.refresh();
  }

  // Hàm hiển thị bản đồ khu vực trên dialog
  async openDialogBanDoKhuVuc() {
    await this.customDataViewMap();
    await this.mDialog.setDialog(this, ViewcoordinatesComponent, "", "", this.dataGeoJson, "70%", "70vh");
    await this.mDialog.open();
  }

  /**
   * Check dữ liệu để hiển thị nút xem bản đồ khu vực
   */
  public checkStateButtonViewMap() {
    // Kiểm tra nếu dữ liệu tọa độ lớn hơn hoặc bằng 3 thì hiển thị nút xem bản đồ khu vực
    if (this.listToaDoKhuVuc.length >= 3) {
      this.showButtonViewMap = true;
    } else {
      this.showButtonViewMap = false;
    }
  }

  /**
   * Custom dữ liệu tọa độ để hiển thị lên bản đồ
   */
  async customDataViewMap() {
    let listData: any = [];

    await this.listToaDoKhuVuc.map(toado => {
      listData.push({
        toadox: toado.toadox,
        toadoy: toado.toadoy,
      });
    });

    this.dataGeoJson = await this.mapFacadeService.getGeometryService().getGeoJsonByListItem(listData, this.obj.hequychieu).toPromise();
  }
}
