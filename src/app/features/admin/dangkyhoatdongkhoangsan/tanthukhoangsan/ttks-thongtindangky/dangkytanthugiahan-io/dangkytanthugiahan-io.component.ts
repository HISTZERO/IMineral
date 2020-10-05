import {Component, ComponentFactoryResolver, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {OutputDmHeQuyChieuModel} from "src/app/models/admin/danhmuc/hequychieu.model";
import {DangKyKhaiThacKsActionEnum} from "src/app/shared/constants/enum";
import {
  DonViDienTich,
  DonViThoiHan,
  DonViTruLuong,
  DonViCongSuat,
  DonViDoSau,
} from "src/app/shared/constants/common-constants";
import {TranslateService} from "@ngx-translate/core";
import {DmFacadeService} from "src/app/services/admin/danhmuc/danhmuc-facade.service";
import {DangKyHoatDongKhoangSanFacadeService} from "src/app/services/admin/dangkyhoatdongkhoangsan/dangkyhoatdongkhoangsan-facade.service";
import {CommonServiceShared} from "src/app/services/utilities/common-service";
import {ActivatedRoute} from "@angular/router";
import {HttpErrorResponse} from "@angular/common/http";
import {validationAllErrorMessagesService} from "src/app/services/utilities/validatorService";
import {OutputDkTanThuGiaHanModel} from "src/app/models/admin/dangkyhoatdongkhoangsan/dktanthugiahan.model";


@Component({
  selector: 'app-dangkytanthugiahan-io',
  templateUrl: './dangkytanthugiahan-io.component.html',
  styleUrls: ['./dangkytanthugiahan-io.component.scss']
})
export class DangkytanthugiahanIoComponent implements OnInit {


  // tslint:disable-next-line: no-output-rename
  @Output("selectCurrentFormStateEvent") selectCurrentFormStateEvent: EventEmitter<number> = new EventEmitter();

  // tslint:disable-next-line: no-output-rename
  @Output("selectIdDangKyTanThuKhoangSanEvent") selectIdDangKyTanThuKhoangSanEvent: EventEmitter<string> = new EventEmitter();

  // tslint:disable-next-line: no-input-rename
  @Input("allowAutoInit") allowAutoInit = true;

  // Nhóm loại cấp phép
  // tslint:disable-next-line: no-input-rename
  @Input("nhomLoaiCapPhep") nhomLoaiCapPhep;

  // Chứa dữ liệu Form
  public dangKyTanThuGiaHanIOForm: FormGroup;

  // Chứa dữ liệu translate
  public dataTranslate: any;

  // Chứa danh sách Hệ quy chiếu
  public allHeQuyChieu: OutputDmHeQuyChieuModel[];
  public HeQuyChieuFilters: OutputDmHeQuyChieuModel[];

  // chứa dữ liệu Id Hồ sơ
  public idhoso: string;

  // chứa dữ liệu đăng ký tận thu
  private dangKyTanThuGiaHan: any;

  // Action thao tác dữ liệu
  public currentAction: number;

  // Action đăng ký thăm dò
  public ActionType = DangKyKhaiThacKsActionEnum;

  // disable delete button
  public disabledDeleteButton = false;

  // lưu dữ liệu đơn vị diện tích
  public donViDienTichList = DonViDienTich;

  // Chứa đon vị trữ lượng
  public donViTruLuongList = DonViTruLuong;

  // Lưu trữ đơn vị thời hạn
  public donViThoiHanList = DonViThoiHan;

  // Lưu trữ đơn vị thời hạn
  public donViCongSuatList = DonViCongSuat;

  // Lưu trữ đơn vị thời hạn
  public donViChieuSauList = DonViDoSau;


  // error message
  validationErrorMessages = {};

  // form errors
  formErrors = {
    truluongconlai: "",
    thoihankhaithac: "",
    giahandenngay: "",
    donvitruluong: "",
    donvithoihan: "",
    lydogiahan: "",
    idhoso: "",
    idgiayphep: "",
  };

  constructor(
    private translate: TranslateService,
    private formBuilder: FormBuilder,
    private dmFacadeService: DmFacadeService,
    private dangKyHoatDongKhoangSanFacadeService: DangKyHoatDongKhoangSanFacadeService,
    public commonService: CommonServiceShared,
    private activatedRoute: ActivatedRoute,
    public cfr: ComponentFactoryResolver
  ) {
  }

  async ngOnInit() {
    // Khởi tạo form
    this.formInit();
    // Lấy dữ liệu translate
    await this.getDataTranslate();

    if (this.allowAutoInit) {
      await this.manualDataInit();
    }
  }

  /**
   * Khởi tạo form
   */
  async manualDataInit() {
    this.activatedRoute.queryParamMap.subscribe((param: any) => {
      if (param && param.params && param.params.idhoso) {
        this.idhoso = param.params.idhoso;
      }
    });

    if (this.idhoso !== null && this.idhoso !== undefined) {
      this.dangKyTanThuGiaHan = await this.getdangKyTanThuGiaHanByIdHoSo(this.idhoso);

      if (this.dangKyTanThuGiaHan) {
        this.currentAction = DangKyKhaiThacKsActionEnum.Edit;
        this.selectIddangKyTanThuGiaHan();
        this.selectCurrentFormState();
      } else {
        this.currentAction = DangKyKhaiThacKsActionEnum.Add;
        this.selectCurrentFormState();
      }
    } else {
      this.currentAction = DangKyKhaiThacKsActionEnum.None;
      return;
    }

    // Lấy dữ liệu hệ quy chiếu
    await this.geAllHeQuyChieu();
    // Khởi tạo dữ liệu form trong trường hợp sửa dữ liệu Hồ Sơ
    await this.formOnEdit(this.dangKyTanThuGiaHan);

    return true;
  }

  /**
   * Hàm khởi tạo form
   */
  private formInit() {
    this.dangKyTanThuGiaHanIOForm = this.formBuilder.group({
      truluongconlai: [""],
      thoihankhaithac: [""],
      giahandenngay: [""],
      donvitruluong: [""],
      donvithoihan: [""],
      lydogiahan: [""],
      idhoso: [""],
      idgiayphep: [""],
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
   * hàm set value cho form
   */
  private async formOnEdit(item: OutputDkTanThuGiaHanModel) {
    if (this.currentAction === DangKyKhaiThacKsActionEnum.Edit && item) {
      this.dangKyTanThuGiaHanIOForm.setValue({
        truluongconlai: item.truluongconlai,
        thoihankhaithac: item.thoihankhaithac,
        giahandenngay: item.giahandenngay,
        donvitruluong: item.donvitruluong,
        donvithoihan: item.donvithoihan,
        lydogiahan: item.lydogiahan,
        idhoso: item.idhoso,
        idgiayphep: item.idgiayphep,
      });
    }
  }

  /**
   * Hàm set validate
   */
  private setValidation() {
    this.validationErrorMessages = {};
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
   * Lấy dữ liệu hồ sơ theo IdHoSo
   * @param idHoSo
   */
  private async getdangKyTanThuGiaHanByIdHoSo(idHoSo: string) {
    const dkTanThuGiaHanService = this.dangKyHoatDongKhoangSanFacadeService.getDangKyTanThuGiaHanService();
    const dangKyItem = await dkTanThuGiaHanService.getFetchAll({Idhoso: idHoSo});
    return dangKyItem;
  }

  async saveItemdangKyTanThuKhoangSan() {
    this.logAllValidationErrorMessages();

    if (!this.dangKyTanThuGiaHanIOForm.valid) {
      return;
    }

    // Gán dữ liệu input vào model
    const dkTanThuGiaHanService = this.dangKyHoatDongKhoangSanFacadeService.getDangKyTanThuGiaHanService();
    const inputModel = this.dangKyTanThuGiaHanIOForm.value;
    inputModel.idhoso = this.idhoso;
    if (this.currentAction === DangKyKhaiThacKsActionEnum.Add) {
      dkTanThuGiaHanService.addItem(inputModel).subscribe(
        async (res) => {
          this.dangKyTanThuGiaHan = inputModel;
          this.dangKyTanThuGiaHan.iddangkytanthu = res.iddangkytanthu;
          this.currentAction = DangKyKhaiThacKsActionEnum.Edit;
          this.selectCurrentFormState();
          this.selectIddangKyTanThuGiaHan();
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
    } else if (this.currentAction === DangKyKhaiThacKsActionEnum.Edit) {
      inputModel.iddangkytanthu = this.dangKyTanThuGiaHan.iddangkytanthu;
      dkTanThuGiaHanService.updateItem(inputModel).subscribe(
        async (res) => {
          this.dangKyTanThuGiaHan = inputModel;
          this.currentAction = DangKyKhaiThacKsActionEnum.Edit;
          this.selectCurrentFormState();
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
   * hàm kiểm tra validation form
   */
  private logAllValidationErrorMessages() {
    validationAllErrorMessagesService(
      this.dangKyTanThuGiaHanIOForm,
      this.validationErrorMessages,
      this.formErrors
    );
  }

  /**
   * select inserted state of form
   */
  private selectCurrentFormState() {
    if (this.currentAction === DangKyKhaiThacKsActionEnum.Edit) {
      this.disabledDeleteButton = false;
    } else {
      this.disabledDeleteButton = true;
    }

    this.selectCurrentFormStateEvent.emit(this.currentAction);
  }

  /**
   * lấy thông tin id hồ sơ sau khi thêm mới một hồ sơ
   */
  private selectIddangKyTanThuGiaHan() {
    this.selectIdDangKyTanThuKhoangSanEvent.emit(this.dangKyTanThuGiaHan.iddangkytanthu);
  }

  /**
   *
   */
  deleteItemdangKyTanThuKhoangSan() {
    const dialogRef = this.commonService.confirmDeleteDiaLogService(
      this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangKyTanThuKhoangSan.contentDelete,
      this.dangKyTanThuGiaHan.tenduan
    );
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === "confirm") {
        await this.dangKyHoatDongKhoangSanFacadeService
          .getDangKyTanThuGiaHanService()
          .deleteItem({iddangkytanthu: this.dangKyTanThuGiaHan.iddangkytanthu})
          .subscribe(
            () => {
              this.dangKyTanThuGiaHan = null;
              this.currentAction = DangKyKhaiThacKsActionEnum.Add;
              this.onFormReset();
              this.selectCurrentFormState();
            },
            (error: HttpErrorResponse) => {
              this.commonService.showDialogWarning(error.error.errors);
            },
            () =>
              this.commonService.showeNotiResult(
                this.dataTranslate.COMMON.default.successDelete,
                2000
              )
          );
      }
    });
  }

  /**
   * Hàm reset form, gọi khi nhấn nút reset dữ liệu
   */
  onFormReset() {
    // Hàm .reset sẽ xóa trắng mọi control trên form
    this.dangKyTanThuGiaHanIOForm.reset({
      truluongconlai: "",
      thoihankhaithac: "",
      giahandenngay: "",
      donvitruluong: "",
      donvithoihan: "",
      lydogiahan: "",
      idhoso: "",
      idgiayphep: "",
    });
  }


}
