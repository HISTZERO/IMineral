import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { GridComponent, TextWrapSettingsModel } from "@syncfusion/ej2-angular-grids";

import { InputDkThamDoToaDoKhuVucModel, OutputDkThamDoToaDoKhuVucModel } from "src/app/models/admin/dangkyhoatdongkhoangsan/dkthamdotoadokhuvuc.model";
import { InputDkThamDoKhuVucModel } from "src/app/models/admin/dangkyhoatdongkhoangsan/dkthamdokhuvuc.model";
import { OutputDmHeQuyChieuModel } from "src/app/models/admin/danhmuc/hequychieu.model";
import { DangKyHoatDongKhoangSanFacadeService } from "src/app/services/admin/dangkyhoatdongkhoangsan/dangkyhoatdongkhoangsan-facade.service";
import { DmFacadeService } from "src/app/services/admin/danhmuc/danhmuc-facade.service";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { validationAllErrorMessagesService } from "src/app/services/utilities/validatorService";
import { DonViDienTich, LoaiKhuVucThamDo } from "src/app/shared/constants/common-constants";
import { SettingsCommon } from "src/app/shared/constants/setting-common";
import { LoaiCapPhepEnum } from "src/app/shared/constants/enum";

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
  public listToaDoKhuVuc: OutputDkThamDoToaDoKhuVucModel[] = [];

  // Chứa loại cấp phép
  public loaiCapPhep = LoaiCapPhepEnum;

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

  // Chứa thông báo lỗi thứ tự
  public errorThuTu: string = "";

  // error message
  validationErrorMessages = {};

  // Chứa error tọa độ khu vực
  public validationErrorToaDo = {}

  // Form errors khu vực
  formErrors = {
    tenkhuvuc: "",
    dientich: "",
    donvidientich: "",
    loaikhuvuc: "",
    hequychieu: "",
  };

  // Form errors tọa độ
  formErrorsToaDo = {
    thutu: "",
    sohieu: "",
    toadox: "",
    toadoy: "",
  }

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
    // Error message khu vực
    this.validationErrorMessages = {
      tenkhuvuc: { required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkythamdokhuvuc.tenkhuvucRequired },
      dientich: { required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkythamdokhuvuc.dientichRequired },
      donvidientich: { required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkythamdokhuvuc.donvidientichRequired },
      hequychieu: { required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkythamdokhuvuc.hequychieuRequired },
    };

    // Error message Tọa độ
    this.validationErrorToaDo = {
      thutu: {
        required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkythamdokhuvuc.thutuRequired,
        pattern: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkythamdokhuvuc.thutuIsNumber
      },
      sohieu: { required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkythamdokhuvuc.sohieuRequired },
      toadox: {
        required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkythamdokhuvuc.toadoxRequired,
        pattern: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkythamdokhuvuc.toadoxIsNumber,
      },
      toadoy: {
        required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkythamdokhuvuc.toadoyRequired,
        pattern: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkythamdokhuvuc.toadoyIsNumber
      }
    }
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
      dientich: ["", [Validators.required, Validators.pattern(/^[-+]?\d*\.?\d*$/)]],
      donvidientich: ["", Validators.required],
      loaikhuvuc: [0],
      hequychieu: ["", Validators.required],
    });

    this.dkThamDoToaDoKhuVucIOForm = this.formBuilder.group({
      thutu: ["", [Validators.required, Validators.pattern(/^[-+]?\d*\.?\d*$/)]],
      sohieu: ["", Validators.required],
      toadox: ["", [Validators.required, Validators.pattern(/^[-+]?\d*\.?\d*$/)]],
      toadoy: ["", [Validators.required, Validators.pattern(/^[-+]?\d*\.?\d*$/)]],
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

      this.getToaDoByIdKhuVuc(this.obj.idthamdokhuvuc);
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
  private addOrUpdate(operMode: string) {
    const dKThamDoKhuVucService = this.dangKyHoatDongKhoangSanFacadeService.getDangKyThamDoKhuVucService();
    const dkThamDoToaDoKhuVuc = this.dangKyHoatDongKhoangSanFacadeService.getDangKyThamDoToaDoKhuVucService();
    // Gán dữ liệu input vào model
    this.inputModelKhuVuc = this.dKThamDoKhuVucIOForm.value;
    this.inputModelKhuVuc.iddangkythamdo = this.obj.iddangkythamdo;

    if (operMode === "new") {
      dKThamDoKhuVucService.addItem(this.inputModelKhuVuc).subscribe(
        (res) => {
          this.addOrUpdateToaDoKhuVuc(res.idthamdokhuvuc);
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
      this.inputModelKhuVuc.idthamdokhuvuc = this.obj.idthamdokhuvuc;
      this.inputModelKhuVuc.iddangkythamdo = this.obj.iddangkythamdo;
      dKThamDoKhuVucService.updateItem(this.inputModelKhuVuc).subscribe(
        (res) => {
          this.addOrUpdateToaDoKhuVuc();
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
    if (this.dKThamDoKhuVucIOForm.valid === true) {
      this.addOrUpdate(operMode);
      this.matSidenavService.close();
    }
  }

  async addOrUpdateToaDoKhuVuc(idthamdokhuvuc?: string) {
    let dataToaDo: any[] = [];
    const loaiKhuVuc = this.dKThamDoKhuVucIOForm.value.loaikhuvuc;
    const idDangKyThamDo = this.obj.iddangkythamdo;
    const loaiCapPhep = this.obj.loaicapphep;
    let test2 = {
      list: []
    };
    for (let i of this.listToaDoKhuVuc) {
      let item = {
        iddangkythamdo: idDangKyThamDo,
        idthamdokhuvuc: idthamdokhuvuc ? idthamdokhuvuc : this.obj.idthamdokhuvuc,
        loaicapphep: loaiCapPhep,
        loaikhuvuc: loaiKhuVuc,
        sohieu: "aaaa",
        thutu: "1",
        toadox: "2215073",
        toadoy: "585453",
      };
      test2.list.push(item);
    }

    let test = {
      list: [
        {
          iddangkythamdo: idDangKyThamDo,
          idthamdokhuvuc: idthamdokhuvuc,
          loaicapphep: loaiCapPhep,
          loaikhuvuc: loaiKhuVuc,
          sohieu: "aaaa",
          thutu: "1",
          toadox: "2215073",
          toadoy: "585453",
        },
        {
          iddangkythamdo: idDangKyThamDo,
          idthamdokhuvuc: idthamdokhuvuc,
          loaicapphep: loaiCapPhep,
          loaikhuvuc: loaiKhuVuc,
          sohieu: "aaaa",
          thutu: "1",
          toadox: "2215073",
          toadoy: "585453",
        },
        {
          iddangkythamdo: idDangKyThamDo,
          idthamdokhuvuc: idthamdokhuvuc,
          loaicapphep: loaiCapPhep,
          loaikhuvuc: loaiKhuVuc,
          sohieu: "aaaa",
          thutu: "1",
          toadox: "2215073",
          toadoy: "585453",
        }
      ]
    };



    console.log(test);
    console.log(test2);
    await this.dangKyHoatDongKhoangSanFacadeService.getDangKyThamDoToaDoKhuVucService().addItem(test2).subscribe((res) => {
      this.matSidenavService.doParentFunction("getAllDkThamDoKhuVuc");
    });
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

    this.dkThamDoToaDoKhuVucIOForm.reset({
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
    if (this.dKThamDoKhuVucIOForm.valid === true) {
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
      this.dKThamDoKhuVucIOForm,
      this.validationErrorMessages,
      this.formErrors
    );
  }

  /**
   * Hàm kiểm tra validation form tọa độ
   */
  public logAllValidationErrorMessagesToaDo() {
    validationAllErrorMessagesService(
      this.dkThamDoToaDoKhuVucIOForm,
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
    let dataToaDo: any = [this.dkThamDoToaDoKhuVucIOForm.value];
    let status: boolean = true;

    // Check dữ liệu thứ tự có trùng không
    for (let i = this.listToaDoKhuVuc.length; i--;) {
      if (dataToaDo.find(item => item.thutu === this.listToaDoKhuVuc[i].thutu)) {
        this.errorThuTu = this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkythamdokhuvuc.thutuDuplicate;
        status = false;
      }
    }

    // Nếu không trùng thì thêm vào grid
    if (status === true && this.dkThamDoToaDoKhuVucIOForm.valid === true) {
      this.listToaDoKhuVuc.push(this.dkThamDoToaDoKhuVucIOForm.value);
      this.gridDkToaDoKhuVuc.refresh();
      this.dkThamDoToaDoKhuVucIOForm.reset();
      this.errorThuTu = "";
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

    // Làm mới grid
    this.gridDkToaDoKhuVuc.refresh();
  }

  /**
   * Lấy danh sách Tọa độ theo khu vực
   * @param idthamdokhuvuc
   */
  async getToaDoByIdKhuVuc(idthamdokhuvuc: string) {
    let listToaDo: any = await this.dangKyHoatDongKhoangSanFacadeService
      .getDangKyThamDoToaDoKhuVucService()
      .getFetchAll({ idthamdokhuvuc: idthamdokhuvuc });
    this.listToaDoKhuVuc = listToaDo;
  }
}
