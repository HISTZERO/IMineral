import {Component, ComponentFactoryResolver, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpErrorResponse} from '@angular/common/http';

import {DmFacadeService} from "src/app/services/admin/danhmuc/danhmuc-facade.service";
import {DangKyHoatDongKhoangSanFacadeService} from 'src/app/services/admin/dangkyhoatdongkhoangsan/dangkyhoatdongkhoangsan-facade.service';
import {DangKyKhaiThacKsActionEnum} from 'src/app/shared/constants/enum';
import {CommonServiceShared} from 'src/app/services/utilities/common-service';
import {validationAllErrorMessagesService} from "src/app/services/utilities/validatorService";
import {OutputDmHeQuyChieuModel} from 'src/app/models/admin/danhmuc/hequychieu.model';
import {
  DonViDienTich,
  DonViThoiHan,
  DonViTruLuong,
  PhuongPhapKhaiThac
} from 'src/app/shared/constants/common-constants';
import {OutputDkKhaiThacCatSoiModel} from "src/app/models/admin/dangkyhoatdongkhoangsan/dangkythamdo/dkkhaithaccatsoi.model";
import {DefaultValue} from "src/app/shared/constants/global-var";

@Component({
  selector: 'app-dangkykhaithaccaisoi-io',
  templateUrl: './dangkykhaithaccaisoi-io.component.html',
  styleUrls: ['./dangkykhaithaccaisoi-io.component.scss']
})
export class DangkykhaithaccaisoiIoComponent implements OnInit {

  // tslint:disable-next-line: no-output-rename
  @Output("selectCurrentFormStateEvent") selectCurrentFormStateEvent: EventEmitter<number> = new EventEmitter();

  // tslint:disable-next-line: no-output-rename
  @Output("selectIdDangKyKhaiThacKhoangSanEvent") selectIdDangKyKhaiThacKhoangSanEvent: EventEmitter<string> = new EventEmitter();

  // tslint:disable-next-line: no-input-rename
  @Input("allowAutoInit") allowAutoInit = true;

  // Nhóm loại cấp phép
  // tslint:disable-next-line: no-input-rename
  @Input("nhomLoaiCapPhep") nhomLoaiCapPhep;

  // Output geometry event
  @Output("selectGeometryEvent") selectGeometryEvent: EventEmitter<any> = new EventEmitter();

  // Chứa dữ liệu Form
  public dangKyKhaiThacCatSoiIOForm: FormGroup;

  // Chứa dữ liệu translate
  public dataTranslate: any;

  // Chứa danh sách Hệ quy chiếu
  public allHeQuyChieu: OutputDmHeQuyChieuModel[];
  public HeQuyChieuFilters: OutputDmHeQuyChieuModel[];

  // chứa dữ liệu Id Hồ sơ
  public idhoso: string;

  // chứa dữ liệu đăng ký thăm dò
  private dangKyKhaiThacCatSoi: any;

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

  // Chứa phương pháp khai thác
  public phuongPhapKhaiThac = PhuongPhapKhaiThac;

  // error message
  validationErrorMessages = {};

  // form errors
  formErrors = {
    tenduan: DefaultValue.Empty,
    soquyetdinh: DefaultValue.Empty,
    diadiem: DefaultValue.Empty,
    ngaykyquyetdinh: DefaultValue.Empty,
    coquanpheduyet: DefaultValue.Empty,
    dientichkhaithac: DefaultValue.Empty,
    tongkhoiluongnaovet: DefaultValue.Empty,
    truluongkhaithac: DefaultValue.Empty,
    phuongphapkhaithac: DefaultValue.Empty,
    thoihankhaithac: DefaultValue.Empty,
    donvidientich: DefaultValue.Empty,
    donvitruluong: DefaultValue.Empty,
    donvithoihan: DefaultValue.Empty,
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
      this.dangKyKhaiThacCatSoi = await this.getDangKyKhaiThacCatSoiByIdHoSo(this.idhoso);

      if (this.dangKyKhaiThacCatSoi) {
        this.selectGeometryEvent.emit(this.dangKyKhaiThacCatSoi.geowgs);
        this.currentAction = DangKyKhaiThacKsActionEnum.Edit;
        this.selectIddangKyKhaiThacCatSoi();
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
    await this.formOnEdit(this.dangKyKhaiThacCatSoi);

    return true;
  }

  /**
   * Hàm khởi tạo form
   */
  private formInit() {
    this.dangKyKhaiThacCatSoiIOForm = this.formBuilder.group({
      tenduan: [DefaultValue.Empty, Validators.required],
      soquyetdinh: [DefaultValue.Empty, Validators.required],
      ngaykyquyetdinh: [DefaultValue.Empty],
      coquanpheduyet: [DefaultValue.Empty, Validators.required],
      dientichkhaithac: [DefaultValue.Empty, [Validators.required, Validators.pattern("^[0-9]+\\.{0,1}\\d{0,2}$")]],
      tongkhoiluongnaovet: [DefaultValue.Empty, [Validators.required, Validators.pattern("^[0-9]+\\.{0,1}\\d{0,2}$")]],
      truluongkhaithac: [DefaultValue.Empty, [Validators.required, Validators.pattern("^[0-9]+\\.{0,1}\\d{0,2}$")]],
      phuongphapkhaithac: [DefaultValue.Empty, Validators.required],
      thoihankhaithac: [DefaultValue.Empty, [Validators.required, Validators.pattern("^[0-9]+\\.{0,1}\\d{0,2}$")]],
      donvidientich: [DefaultValue.Empty, Validators.required],
      donvitruluong: [DefaultValue.Empty, Validators.required],
      donvithoihan: [DefaultValue.Empty, Validators.required],
      hequychieu: [DefaultValue.Empty, Validators.required],
      diadiem: [DefaultValue.Empty, Validators.required]
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
  private async formOnEdit(item: OutputDkKhaiThacCatSoiModel) {
    if (this.currentAction === DangKyKhaiThacKsActionEnum.Edit && item) {
      this.dangKyKhaiThacCatSoiIOForm.setValue({
        tenduan: item.tenduan,
        soquyetdinh: item.soquyetdinh,
        ngaykyquyetdinh: item.ngaykyquyetdinh,
        coquanpheduyet: item.coquanpheduyet,
        dientichkhaithac: item.dientichkhaithac,
        tongkhoiluongnaovet: item.tongkhoiluongnaovet,
        truluongkhaithac: item.truluongkhaithac,
        phuongphapkhaithac: item.phuongphapkhaithac,
        thoihankhaithac: item.thoihankhaithac,
        donvidientich: item.donvidientich,
        donvitruluong: item.donvitruluong,
        donvithoihan: item.donvithoihan,
        hequychieu: item.hequychieu,
        diadiem: item.diadiem
      });
    }
  }

  /**
   * Hàm set validate
   */
  private setValidation() {
    this.validationErrorMessages = {
      tenduan: {required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkykhaithaccatsoi.tenduanRequired},
      soquyetdinh: {required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkykhaithaccatsoi.soquyetdinhRequired},
      coquanpheduyet: {required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkykhaithaccatsoi.coquanpheduyetRequired},
      dientichkhaithac: {
        required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkykhaithaccatsoi.dientichkhaithacRequired,
        pattern: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkykhaithaccatsoi.numberRequired
      },
      tongkhoiluongnaovet: {
        required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkykhaithaccatsoi.tongkhoiluongnaovetRequired,
        pattern: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkykhaithaccatsoi.numberRequired
      },
      truluongkhaithac:  {
        required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkykhaithaccatsoi.truluongkhaithacRequired,
        pattern: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkykhaithaccatsoi.numberRequired
      },
      phuongphapkhaithac: {required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkykhaithaccatsoi.phuongphapkhaithacRequired},
      thoihankhaithac:  {
        required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkykhaithaccatsoi.thoihankhaithacRequired,
        pattern: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkykhaithaccatsoi.numberRequired
      },
      donvidientich: {required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkykhaithaccatsoi.donvidientichRequired},
      donvitruluong: {required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkykhaithaccatsoi.donvitruluongRequired},
      donvithoihan: {required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkykhaithaccatsoi.donvithoihanRequired},
      hequychieu: {required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkykhaithaccatsoi.hequychieuRequired},
      diadiem: {required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkykhaithaccatsoi.diadiemRequired},
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
  private async getDangKyKhaiThacCatSoiByIdHoSo(idHoSo: string) {
    const dkKhaiThacCatSoiService = this.dangKyHoatDongKhoangSanFacadeService.getDangKyKhaiThacCatSoiService();
    const dangKyItem = await dkKhaiThacCatSoiService.getFetchAll({Idhoso: idHoSo});
    return dangKyItem;
  }

  async saveItemdangKyKhaiThacCatSoi() {
    this.logAllValidationErrorMessages();

    if (!this.dangKyKhaiThacCatSoiIOForm.valid) {
      return;
    }

    // Gán dữ liệu input vào model
    const dkKhaiThacCatSoiService = this.dangKyHoatDongKhoangSanFacadeService.getDangKyKhaiThacCatSoiService();
    const inputModel = this.dangKyKhaiThacCatSoiIOForm.value;
    inputModel.idhoso = this.idhoso;
    if (this.currentAction === DangKyKhaiThacKsActionEnum.Add) {
      dkKhaiThacCatSoiService.addItem(inputModel).subscribe(
        async (res) => {
          this.dangKyKhaiThacCatSoi = inputModel;
          this.dangKyKhaiThacCatSoi.iddangkykhaithac = res.iddangkykhaithac;
          this.currentAction = DangKyKhaiThacKsActionEnum.Edit;
          this.selectCurrentFormState();
          this.selectIddangKyKhaiThacCatSoi();
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
      inputModel.iddangkykhaithac = this.dangKyKhaiThacCatSoi.iddangkykhaithac;
      dkKhaiThacCatSoiService.updateItem(inputModel).subscribe(
        async (res) => {
          this.dangKyKhaiThacCatSoi = inputModel;
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
      this.dangKyKhaiThacCatSoiIOForm,
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
  private selectIddangKyKhaiThacCatSoi() {
    this.selectIdDangKyKhaiThacKhoangSanEvent.emit(this.dangKyKhaiThacCatSoi.iddangkykhaithac);
  }

  /**
   *
   */
  deleteItemdangKyKhaiThacCatSoi() {
    const dialogRef = this.commonService.confirmDeleteDiaLogService(
      this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkykhaithaccatsoi.contentDelete,
      this.dangKyKhaiThacCatSoi.tenduan
    );
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === "confirm") {
        await this.dangKyHoatDongKhoangSanFacadeService
          .getDangKyKhaiThacCatSoiService()
          .deleteItem({iddangkykhaithac: this.dangKyKhaiThacCatSoi.iddangkykhaithac})
          .subscribe(
            () => {
              this.dangKyKhaiThacCatSoi = null;
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
    this.dangKyKhaiThacCatSoiIOForm.reset({
      tenduan: DefaultValue.Empty,
      soquyetdinh: DefaultValue.Empty,
      ngaykyquyetdinh: DefaultValue.Empty,
      coquanpheduyet: DefaultValue.Empty,
      dientichkhaithac: DefaultValue.Empty,
      tongkhoiluongnaovet: DefaultValue.Empty,
      truluongkhaithac: DefaultValue.Empty,
      phuongphapkhaithac: DefaultValue.Empty,
      thoihankhaithac: DefaultValue.Empty,
      donvidientich: DefaultValue.Empty,
      donvikhoiluong: DefaultValue.Empty,
      donvithoihan: DefaultValue.Empty,
      hequychieu: DefaultValue.Empty,
      diadiem: DefaultValue.Empty
    });
  }

}
