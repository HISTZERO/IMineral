import { Component, OnInit, ViewChild } from '@angular/core';
import { GridComponent, TextWrapSettingsModel } from "@syncfusion/ej2-angular-grids";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material";
import { TranslateService } from "@ngx-translate/core";
import { HttpErrorResponse } from "@angular/common/http";

import { OutputDmHeQuyChieuModel } from "src/app/models/admin/danhmuc/hequychieu.model";
import { DonViDienTich } from "src/app/shared/constants/common-constants";
import { SettingsCommon } from "src/app/shared/constants/setting-common";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { DangKyHoatDongKhoangSanFacadeService } from "src/app/services/admin/dangkyhoatdongkhoangsan/dangkyhoatdongkhoangsan-facade.service";
import { DmFacadeService } from "src/app/services/admin/danhmuc/danhmuc-facade.service";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { validationAllErrorMessagesService } from "src/app/services/utilities/validatorService";
import { InputDkTanThuKhuVucModel } from "src/app/models/admin/dangkyhoatdongkhoangsan/dangkytanthu/dktanthukhuvuc.model";
import { OutputDkThamDoToaDoKhuVucModel } from "src/app/models/admin/dangkyhoatdongkhoangsan/dangkythamdo/dkthamdotoadokhuvuc.model";
import { ViewcoordinatesComponent } from "src/app/shared/components/viewcoordinates/viewcoordinates.component";
import { MatdialogService } from "src/app/services/utilities/matdialog.service";
import { MapFacadeService } from "src/app/services/admin/map/map-facade.service";
import { DefaultValue } from "src/app/shared/constants/global-var";

@Component({
  selector: 'app-ttks-khuvuctanthu-io',
  templateUrl: './ttks-khuvuctanthu-io.component.html',
  styleUrls: ['./ttks-khuvuctanthu-io.component.scss']
})
export class TtksKhuvuctanthuIoComponent implements OnInit {


  // Viewchild template
  @ViewChild("gridDkToaDoKhuVuc", { static: false }) public gridDkToaDoKhuVuc: GridComponent;

  // Chứa dữ liệu Form khu vực
  public dKTanThuKhuVucIOForm: FormGroup;

  // Chứa dữ liệu Form Tọa độ
  public dkTanThuToaDoKhuVucIOForm: FormGroup;

  // Chứa danh sách tọa độ
  public listToaDoKhuVuc: OutputDkThamDoToaDoKhuVucModel[] = [];

  public tenHeQuyChieu = DefaultValue.Empty;

  // Chứa dữ liệu đối tượng truyền từ list comp
  public obj: any;

  // Chứa kiểu form
  public purpose: string;

  // Chứa dữ liệu input khu vực thăm dò
  public inputModelKhuVuc: InputDkTanThuKhuVucModel;

  // Chứa danh sách Hệ quy chiếu
  public allHeQuyChieu: OutputDmHeQuyChieuModel[];

  // Filter Hệ quy chiếu
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
  // public loaiKhuVuc = LoaiKhuVucThamDo;

  // Chứa thông báo lỗi thứ tự
  public errorThuTu: string = "";

  // error message
  validationErrorMessages = {};

  // Chứa error tọa độ khu vực
  public validationErrorToaDo = {};

  // Chứa trạng thái hiển thị nút xem bản đồ khu vực
  public showButtonViewMap: boolean = false;

  // Chứa service matdialog
  public mDialog: any;

  // Chứa geoJson
  public dataGeoJson: any;

  // Form errors khu vực
  formErrors = {
    tenkhuvuc: "",
    dientich: "",
    donvidientich: "",
    // loaikhuvuc: "",
    hequychieu: "",
  };

  // Form errors tọa độ
  formErrorsToaDo = {
    thutu: "",
    sohieu: "",
    toadox: "",
    toadoy: "",
  };

  constructor(public matSidenavService: MatsidenavService,
    public dangKyHoatDongKhoangSanFacadeService: DangKyHoatDongKhoangSanFacadeService,
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
      tenkhuvuc: { required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkykhaithackhuvuc.tenkhuvucRequired },
      dientich: { required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkykhaithackhuvuc.dientichRequired },
      donvidientich: { required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkykhaithackhuvuc.donvidientichRequired },
      hequychieu: { required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkykhaithackhuvuc.hequychieuRequired },
    };

    // Error message Tọa độ
    this.validationErrorToaDo = {
      thutu: {
        required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkykhaithackhuvuc.thutuRequired,
        pattern: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkykhaithackhuvuc.thutuIsNumber
      },
      sohieu: { required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkykhaithackhuvuc.sohieuRequired },
      toadox: {
        required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkykhaithackhuvuc.toadoxRequired,
        pattern: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkykhaithackhuvuc.toadoxIsNumber,
      },
      toadoy: {
        required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkykhaithackhuvuc.toadoyRequired,
        pattern: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkykhaithackhuvuc.toadoyIsNumber
      }
    };
  }

  /**
   * Hàm khởi tạo form theo dạng edit
   */
  bindingConfigAddOrUpdate() {
    this.inputModelKhuVuc = new InputDkTanThuKhuVucModel();
    this.formOnEdit();

    if (this.obj && this.obj.hequychieu !== DefaultValue.Undefined && this.obj.hequychieu !== DefaultValue.Null && this.obj.hequychieu.trim() !== DefaultValue.Empty) {
      this.tenHeQuyChieu = this.getTenHeQuyChieu(this.obj.hequychieu);
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
   * Hàm khởi tạo form
   */
  formInit() {
    this.dKTanThuKhuVucIOForm = this.formBuilder.group({
      tenkhuvuc: ["", Validators.required],
      dientich: ["", [Validators.required, Validators.pattern(/^[-+]?\d*\.?\d*$/)]],
      donvidientich: ["", Validators.required],
      // loaikhuvuc: [0],
      //hequychieu: ["", Validators.required],
    });

    this.dkTanThuToaDoKhuVucIOForm = this.formBuilder.group({
      thutu: ["", [Validators.required, Validators.pattern(/^[-+]?\d*\.?\d*$/)]],
      sohieu: ["", Validators.required],
      toadox: ["", [Validators.required, Validators.pattern(/^[-+]?\d*\.?\d*$/)]],
      toadoy: ["", [Validators.required, Validators.pattern(/^[-+]?\d*\.?\d*$/)]],
    });
  }

  /**
   * hàm set value cho form
   */
  formOnEdit() {
    if (this.obj && this.purpose === 'edit') {
      this.dKTanThuKhuVucIOForm.setValue({
        tenkhuvuc: this.obj.tenkhuvuc,
        dientich: this.obj.dientich,
        donvidientich: this.obj.donvidientich,
        //hequychieu: this.obj.hequychieu,
      });

      this.listToaDoKhuVuc = this.obj.lstToaDo;

      // Kiểm tra dữ liệu để hiển thị nút xem bản đồ
      this.checkStateButtonViewMap();
    }
  }

  /**
   * Tạo model dữ liệu insert và update
   */
  async generateModelData(idtanthukhuvuc?: string) {
    let listToaDo = {
      list: []
    };

    // tạo đối tượng dữ liệu
    for (let i of this.listToaDoKhuVuc) {
      let item = {
        iddangkytanthu: this.obj.iddangkytanthu,
        idtanthukhuvuc: idtanthukhuvuc ? idtanthukhuvuc : this.obj.idtanthukhuvuc,
        sohieu: i.sohieu,
        thutu: i.thutu,
        toadox: i.toadox,
        toadoy: i.toadoy,
      };
      // Thêm vào mảng
      listToaDo.list.push(item);
    }

    return listToaDo;
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
    const dKTanThuKhuVucService = this.dangKyHoatDongKhoangSanFacadeService.getDangkyTanThuKhuVucService();
    // Gán dữ liệu input vào model
    this.inputModelKhuVuc = this.dKTanThuKhuVucIOForm.value;
    this.inputModelKhuVuc.iddangkytanthu = this.obj.iddangkytanthu;
    this.inputModelKhuVuc.hequychieu = this.obj.hequychieu;

    if (operMode === "new") {
      this.inputModelKhuVuc.toadokhuvuc = await this.generateModelData();
      dKTanThuKhuVucService.insertKhuVucVaToaDoTanThu(this.inputModelKhuVuc).subscribe(
        (res) => {
          this.matSidenavService.doParentFunction("getAllDkTanThuKhuVuc");
          this.matSidenavService.doParentFunction("callBackTabThongTin");

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
      this.inputModelKhuVuc.idtanthukhuvuc = this.obj.idtanthukhuvuc;
      this.inputModelKhuVuc.iddangkytanthu = this.obj.iddangkytanthu;
      this.inputModelKhuVuc.toadokhuvuc = await this.generateModelData(this.obj.iddangkytanthu);
      dKTanThuKhuVucService.updateKhuVucVaToaDoTanThu(this.inputModelKhuVuc).subscribe(
        (res) => {
          this.matSidenavService.doParentFunction("getAllDkTanThuKhuVuc");
          this.matSidenavService.doParentFunction("callBackTabThongTin");
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
   * Hàm được gọi khi nhấn nút Lưu, Truyền vào operMode để biết là Edit hay tạo mới
   * @param operMode
   */
  async onSubmit(operMode: string) {
    this.logAllValidationErrorMessages();
    if (this.dKTanThuKhuVucIOForm.valid === true) {
      this.addOrUpdate(operMode);
      this.matSidenavService.close();
    }
  }

  /**
   * Hàm reset form, gọi khi nhấn nút reset dữ liệu
   */
  public onFormReset() {
    // Hàm .reset sẽ xóa trắng mọi control trên form
    this.dKTanThuKhuVucIOForm.reset({
      tenkhuvuc: "",
      dientich: "",
      donvidientich: "",
      // loaikhuvuc: 0,
      hequychieu: "",
    });

    this.dkTanThuToaDoKhuVucIOForm.reset({
      thutu: "",
      sohieu: "",
      toadox: "",
      toadoy: "",
    });
  }

  /**
   * Hàm lưu và reset form để tiếp tục nhập mới dữ liệu. Trường hợp này khi người dùng muốn nhập dữ liệu liên tục
   * @param operMode
   */
  async onContinueAdd(operMode: string) {
    this.logAllValidationErrorMessages();
    if (this.dKTanThuKhuVucIOForm.valid === true) {
      this.addOrUpdate(operMode);
      this.onFormReset();
      this.purpose = "new";
    }
  }

  /**
   * Hàm kiểm tra validation form khu vực
   */
  public logAllValidationErrorMessages() {
    validationAllErrorMessagesService(
      this.dKTanThuKhuVucIOForm,
      this.validationErrorMessages,
      this.formErrors
    );
  }

  /**
   * Hàm kiểm tra validation form tọa độ
   */
  public logAllValidationErrorMessagesToaDo() {
    validationAllErrorMessagesService(
      this.dkTanThuToaDoKhuVucIOForm,
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
    let dataToaDo: any = [this.dkTanThuToaDoKhuVucIOForm.value];
    let status: boolean = true;

    // Check dữ liệu thứ tự có trùng không
    for (let i = this.listToaDoKhuVuc.length; i--;) {
      if (dataToaDo.find(item => item.thutu === this.listToaDoKhuVuc[i].thutu)) {
        this.errorThuTu = this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkykhaithackhuvuc.thutuDuplicate;
        status = false;
      }
    }

    // Nếu không trùng thì thêm vào grid
    if (status === true && this.dkTanThuToaDoKhuVucIOForm.valid === true) {
      this.listToaDoKhuVuc.push(this.dkTanThuToaDoKhuVucIOForm.value);
      this.gridDkToaDoKhuVuc.refresh();
      this.dkTanThuToaDoKhuVucIOForm.reset();
      this.errorThuTu = "";

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
    let item: any[] = [];
    item.push(data);

    // Xóa item đã chọn trong danh sách
    for (let i = this.listToaDoKhuVuc.length; i--;) {
      if (item.find(item => item.thutu === this.listToaDoKhuVuc[i].thutu)) {
        this.listToaDoKhuVuc.splice(i, 1);
      }
    }

    // Kiểm tra dữ liệu để hiển thị nút xem bản đồ
    this.checkStateButtonViewMap();

    // Làm mới grid
    this.gridDkToaDoKhuVuc.refresh();
  }

  /**
   * Lấy danh sách Tọa độ theo khu vực
   * @param idthamdokhuvuc
   */
  async getToaDoByIdKhuVuc(idtanthukhuvuc: string) {
    const listToaDo: any = await this.dangKyHoatDongKhoangSanFacadeService
      .getDangKyThamDoToaDoKhuVucService()
      .getFetchAll({ idtanthukhuvuc: idtanthukhuvuc });
    this.listToaDoKhuVuc = listToaDo;
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
