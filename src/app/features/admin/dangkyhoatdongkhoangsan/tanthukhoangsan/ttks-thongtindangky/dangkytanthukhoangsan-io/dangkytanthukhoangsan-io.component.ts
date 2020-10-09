import {Component, ComponentFactoryResolver, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {OutputDmHeQuyChieuModel} from "src/app/models/admin/danhmuc/hequychieu.model";
import {DangKyKhaiThacKsActionEnum} from "src/app/shared/constants/enum";
import {
  DonViCongSuat,
  DonViDienTich,
  DonViDoSau,
  DonViThoiHan,
  DonViTruLuong,
} from "src/app/shared/constants/common-constants";
import {TranslateService} from "@ngx-translate/core";
import {DmFacadeService} from "src/app/services/admin/danhmuc/danhmuc-facade.service";
import {DangKyHoatDongKhoangSanFacadeService} from "src/app/services/admin/dangkyhoatdongkhoangsan/dangkyhoatdongkhoangsan-facade.service";
import {CommonServiceShared} from "src/app/services/utilities/common-service";
import {ActivatedRoute} from "@angular/router";
import {HttpErrorResponse} from "@angular/common/http";
import {validationAllErrorMessagesService} from "src/app/services/utilities/validatorService";
import {OutputDkTanThuKhoangSanModel} from "src/app/models/admin/dangkyhoatdongkhoangsan/dangkytanthu/dktanthukhoangsan.model";
import {DefaultValue} from "src/app/shared/constants/global-var";

@Component({
  selector: 'app-dangkytanthukhoangsan-io',
  templateUrl: './dangkytanthukhoangsan-io.component.html',
  styleUrls: ['./dangkytanthukhoangsan-io.component.scss']
})
export class DangkytanthukhoangsanIoComponent implements OnInit {


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
  public dangKyTanThuKhoangSanIOForm: FormGroup;

  // Chứa dữ liệu translate
  public dataTranslate: any;

  // Chứa danh sách Hệ quy chiếu
  public allHeQuyChieu: OutputDmHeQuyChieuModel[];
  public HeQuyChieuFilters: OutputDmHeQuyChieuModel[];

  // chứa dữ liệu Id Hồ sơ
  public idhoso: string;

  // chứa dữ liệu đăng ký tận thu
  private dangKyTanThuKhoangSan: any;

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
    diadiem: DefaultValue.Empty,
    dientichkhaithac: DefaultValue.Empty,
    truluongdiachat: DefaultValue.Empty,
    truluongkhaithac: DefaultValue.Empty,
    thoihankhaithac: DefaultValue.Empty,
    congsuatkhaithac: DefaultValue.Empty,
    mucsaukhaithactu: DefaultValue.Empty,
    mucsaukhaithacden: DefaultValue.Empty,
    donvitruluong: DefaultValue.Empty,
    donvicongsuat: DefaultValue.Empty,
    donvidientich: DefaultValue.Empty,
    donvithoihan: DefaultValue.Empty,
    donvichieusau: DefaultValue.Empty,
    hequychieu: DefaultValue.Empty,
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
      this.dangKyTanThuKhoangSan = await this.getdangKyTanThuKhoangSanByIdHoSo(this.idhoso);

      if (this.dangKyTanThuKhoangSan) {
        this.currentAction = DangKyKhaiThacKsActionEnum.Edit;
        this.selectIddangKyTanThuKhoangSan();
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
    await this.formOnEdit(this.dangKyTanThuKhoangSan);

    return true;
  }

  /**
   * Hàm khởi tạo form
   */
  private formInit() {
    this.dangKyTanThuKhoangSanIOForm = this.formBuilder.group({
      diadiem: [DefaultValue.Empty, Validators.required],
      dientichkhaithac: [DefaultValue.Empty, [Validators.required, Validators.pattern("^[0-9-+]+$")]],
      truluongdiachat: [DefaultValue.Empty, [Validators.required, Validators.pattern("^[0-9-+]+$")]],
      truluongkhaithac: [DefaultValue.Empty, [Validators.required, Validators.pattern("^[0-9-+]+$")]],
      thoihankhaithac: [DefaultValue.Empty, [Validators.required, Validators.pattern("^[0-9-+]+$")]],
      congsuatkhaithac: [DefaultValue.Empty, [Validators.required, Validators.pattern("^[0-9-+]+$")]],
      mucsaukhaithactu: [DefaultValue.Empty, [ Validators.pattern("^[0-9-+]+$")]],
      mucsaukhaithacden: [DefaultValue.Empty, [Validators.pattern("^[0-9-+]+$")]],
      donvitruluong: [DefaultValue.Empty],
      donvicongsuat: [DefaultValue.Empty],
      donvidientich: [DefaultValue.Empty],
      donvithoihan: [DefaultValue.Empty],
      donvichieusau: [DefaultValue.Empty],
      hequychieu: [DefaultValue.Empty],
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
  private async formOnEdit(item: OutputDkTanThuKhoangSanModel) {
    if (this.currentAction === DangKyKhaiThacKsActionEnum.Edit && item) {
      this.dangKyTanThuKhoangSanIOForm.setValue({
        diadiem: item.diadiem,
        dientichkhaithac: item.dientichkhaithac,
        truluongdiachat: item.truluongdiachat,
        truluongkhaithac: item.truluongkhaithac,
        thoihankhaithac: item.thoihankhaithac,
        congsuatkhaithac: item.congsuatkhaithac,
        mucsaukhaithactu: item.mucsaukhaithactu,
        mucsaukhaithacden: item.mucsaukhaithacden,
        donvitruluong: item.donvitruluong,
        donvicongsuat: item.donvicongsuat,
        donvidientich: item.donvidientich,
        donvithoihan: item.donvithoihan,
        donvichieusau: item.donvichieusau,
        hequychieu: item.hequychieu,
      });
    }
  }

  /**
   * Hàm set validate
   */
  private setValidation() {
    this.validationErrorMessages = {
      diadiem: {required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkytanthukhoangsan.diadiemRequired},
      dientichkhaithac: {
        required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkytanthukhoangsan.dientichkhaithacRequired,
        pattern: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkytanthukhoangsan.numberRequired
      },
      truluongdiachat: {
        required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkytanthukhoangsan.truluongdiachatRequired,
        pattern: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkytanthukhoangsan.numberRequired
      },
      truluongkhaithac: {
        required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkytanthukhoangsan.truluongdiachatRequired,
        pattern: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkytanthukhoangsan.numberRequired
      },
      thoihankhaithac: {
        required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkytanthukhoangsan.thoihankhaithacRequired,
        pattern: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkytanthukhoangsan.numberRequired
      },
      congsuatkhaithac: {
        required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkytanthukhoangsan.congsuatkhaithacRequired,
        pattern: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkytanthukhoangsan.numberRequired
      },
      mucsaukhaithactu: {pattern: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkytanthukhoangsan.numberRequired},
      mucsaukhaithacden: {pattern: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkytanthukhoangsan.numberRequired},
    };
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
  private async getdangKyTanThuKhoangSanByIdHoSo(idHoSo: string) {
    const dkTanThuKhoangSanService = this.dangKyHoatDongKhoangSanFacadeService.getDangKyTanThuKhoangSanService();
    const dangKyItem = await dkTanThuKhoangSanService.getFetchAll({Idhoso: idHoSo});
    return dangKyItem;
  }

  async saveItemdangKyTanThuKhoangSan() {
    this.logAllValidationErrorMessages();

    if (!this.dangKyTanThuKhoangSanIOForm.valid) {
      return;
    }

    // Gán dữ liệu input vào model
    const dkTanThuKhoangSanService = this.dangKyHoatDongKhoangSanFacadeService.getDangKyTanThuKhoangSanService();
    const inputModel = this.dangKyTanThuKhoangSanIOForm.value;
    inputModel.idhoso = this.idhoso;
    if (this.currentAction === DangKyKhaiThacKsActionEnum.Add) {
      dkTanThuKhoangSanService.addItem(inputModel).subscribe(
        async (res) => {
          this.dangKyTanThuKhoangSan = inputModel;
          this.dangKyTanThuKhoangSan.iddangkytanthu = res.iddangkytanthu;
          this.currentAction = DangKyKhaiThacKsActionEnum.Edit;
          this.selectCurrentFormState();
          this.selectIddangKyTanThuKhoangSan();
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
      inputModel.iddangkytanthu = this.dangKyTanThuKhoangSan.iddangkytanthu;
      dkTanThuKhoangSanService.updateItem(inputModel).subscribe(
        async (res) => {
          this.dangKyTanThuKhoangSan = inputModel;
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
      this.dangKyTanThuKhoangSanIOForm,
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
  private selectIddangKyTanThuKhoangSan() {
    this.selectIdDangKyTanThuKhoangSanEvent.emit(this.dangKyTanThuKhoangSan.iddangkytanthu);
  }

  /**
   *
   */
  deleteItemdangKyTanThuKhoangSan() {
    const dialogRef = this.commonService.confirmDeleteDiaLogService(
      this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkytanthukhoangsan.contentDelete,
      this.dangKyTanThuKhoangSan.tenduan
    );
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === "confirm") {
        await this.dangKyHoatDongKhoangSanFacadeService
          .getDangKyTanThuKhoangSanService()
          .deleteItem({iddangkytanthu: this.dangKyTanThuKhoangSan.iddangkytanthu})
          .subscribe(
            () => {
              this.dangKyTanThuKhoangSan = null;
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
    this.dangKyTanThuKhoangSanIOForm.reset({
      diadiem: DefaultValue.Empty,
      dientichkhaithac: DefaultValue.Empty,
      truluongdiachat: DefaultValue.Empty,
      truluongkhaithac: DefaultValue.Empty,
      thoihankhaithac: DefaultValue.Empty,
      congsuatkhaithac: DefaultValue.Empty,
      mucsaukhaithactu: DefaultValue.Empty,
      mucsaukhaithacden: DefaultValue.Empty,
      donvitruluong: DefaultValue.Empty,
      donvicongsuat: DefaultValue.Empty,
      donvidientich: DefaultValue.Empty,
      donvithoihan: DefaultValue.Empty,
      donvichieusau: DefaultValue.Empty,
      hequychieu: DefaultValue.Empty,
    });
  }


}
