import {
  Component,
  ComponentFactoryResolver,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Type,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {HttpErrorResponse} from '@angular/common/http';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {MatSidenav} from '@angular/material';
import {DangKyThamDoActionEnum} from 'src/app/shared/constants/enum';
import {DmFacadeService} from "src/app/services/admin/danhmuc/danhmuc-facade.service";
import {DangKyHoatDongKhoangSanFacadeService} from 'src/app/services/admin/dangkyhoatdongkhoangsan/dangkyhoatdongkhoangsan-facade.service';
import {CommonServiceShared} from 'src/app/services/utilities/common-service';
import {validationAllErrorMessagesService} from "src/app/services/utilities/validatorService";
import {OutputDmHeQuyChieuModel} from 'src/app/models/admin/danhmuc/hequychieu.model';
import {DangKhoangSan, DonViDienTich, DonViDoSau, DonViThoiHan} from 'src/app/shared/constants/common-constants';
import {MatsidenavService} from 'src/app/services/utilities/matsidenav.service';
import {OutputDkThamDoKhoangSanModel} from "src/app/models/admin/dangkyhoatdongkhoangsan/dangkythamdo/dkthamdokhoangsan.model";
import {DefaultValue} from 'src/app/shared/constants/global-var';

@Component({
  selector: 'app-dangkythamdokhoangsan-io',
  templateUrl: './dangkythamdokhoangsan-io.component.html',
  styleUrls: ['./dangkythamdokhoangsan-io.component.scss']
})
export class DangkythamdokhoangsanIoComponent implements OnInit {
  @ViewChild(Type, {static: true}) public matSidenav: MatSidenav;
  @ViewChild(Type, {read: ViewContainerRef, static: true}) public content: ViewContainerRef;
  // tslint:disable-next-line: no-output-rename
  @Output("selectCurrentFormStateEvent") selectCurrentFormStateEvent: EventEmitter<number> = new EventEmitter();
  // tslint:disable-next-line: no-output-rename
  @Output("selectIdDangKyThamDoEvent") selectIdDangKyThamDoEvent: EventEmitter<string> = new EventEmitter();
  // tslint:disable-next-line: no-output-rename
  @Output("selectHeQuyChieuEvent") selectHeQuyChieuEvent: EventEmitter<string> = new EventEmitter();
  // Output geometry event
  @Output("selectGeometryEvent") selectGeometryEvent: EventEmitter<any> = new EventEmitter();
  // tslint:disable-next-line: no-input-rename
  @Input("allowAutoInit") allowAutoInit = true;
  // Nhóm loại cấp phép
  // tslint:disable-next-line: no-input-rename
  @Input("nhomLoaiCapPhep") nhomLoaiCapPhep;
  // Chứa dữ liệu Form
  public dangKyThamDoIOForm: FormGroup;
  // Chứa dữ liệu translate
  public dataTranslate: any;
  // Chứa danh sách Hệ quy chiếu
  public allHeQuyChieu: OutputDmHeQuyChieuModel[];
  public HeQuyChieuFilters: OutputDmHeQuyChieuModel[];
  // Dạng khoáng sản
  public dangKhoangSanList = DangKhoangSan;
  // chứa dữ liệu Id Hồ sơ
  public idhoso: string;
  // chứa dữ liệu đăng ký thăm dò
  private dangKyThamDoKhoangSan: OutputDkThamDoKhoangSanModel;
  // Action thao tác dữ liệu
  public currentAction: number;
  // Action đăng ký thăm dò
  public ActionType = DangKyThamDoActionEnum;
  // disable delete button
  public disabledDeleteButton = false;
  // lưu dữ liệu đơn vị diện tích
  public donViDienTichList = DonViDienTich;
  // Lưu trữ đơn vị thời hạn
  public donViThoiHanList = DonViThoiHan;
  // lưu dữ liệu đơn vị diện tích
  public donViDoSauList = DonViDoSau;
  // disable control hệ quy chiếu
  public disabledHeQuyChieu = false;
  // Lưu tên hệ quy chiếu sử dụng hiện tại
  public tenHeQuyChieu = DefaultValue.Empty;
  // error message
  validationErrorMessages = {};

  // form errors
  formErrors = {
    diadiem: DefaultValue.Empty,
    dientichthamdo: DefaultValue.Empty,
    chieusauthamdotu: DefaultValue.Empty,
    chieusauthamdoden: DefaultValue.Empty,
    thoihanthamdo: DefaultValue.Empty,
    mucdichsudungkhoangsan: DefaultValue.Empty,
    donvidientich: DefaultValue.Empty,
    donvithoihan: DefaultValue.Empty,
    donvichieusau: DefaultValue.Empty,
    hequychieu: DefaultValue.Empty
  };

  constructor(private translate: TranslateService,
              private formBuilder: FormBuilder,
              private dmFacadeService: DmFacadeService,
              private dangKyHoatDongKhoangSanFacadeService: DangKyHoatDongKhoangSanFacadeService,
              public commonService: CommonServiceShared,
              private activatedRoute: ActivatedRoute,
              public matSidenavService: MatsidenavService,
              public cfr: ComponentFactoryResolver) {
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

    if (this.idhoso !== DefaultValue.Null && this.idhoso !== DefaultValue.Undefined && this.idhoso.trim() !== DefaultValue.Empty) {
      this.dangKyThamDoKhoangSan = await this.getDangKyThamDoByIdHoSo(this.idhoso);

      if (this.dangKyThamDoKhoangSan) {
        this.selectGeometryEvent.emit(this.dangKyThamDoKhoangSan.geowgs);
        this.currentAction = DangKyThamDoActionEnum.Edit;
        this.selectIdDangKyThamDo();
        this.selectHeQuyChieu();
        this.selectCurrentFormState();
      } else {
        this.currentAction = DangKyThamDoActionEnum.Add;
        this.selectCurrentFormState();
      }
    } else {
      this.currentAction = DangKyThamDoActionEnum.None;
      return;
    }

    // Lấy dữ liệu hệ quy chiếu
    await this.geAllHeQuyChieu();
    // Khởi tạo dữ liệu form trong trường hợp sửa dữ liệu Hồ Sơ
    await this.formOnEdit(this.dangKyThamDoKhoangSan);

    return true;
  }

  /**
   * Hàm khởi tạo form
   */
  private formInit() {
    this.dangKyThamDoIOForm = this.formBuilder.group({
      diadiem: [DefaultValue.Empty, Validators.required],
      dientichthamdo: [DefaultValue.Empty, [Validators.required, Validators.pattern("^[0-9]+\\.{0,1}\\d{0,2}$")]],
      chieusauthamdotu: [DefaultValue.Empty, Validators.pattern("^[0-9]+\\.{0,1}\\d{0,2}$")],
      chieusauthamdoden: [DefaultValue.Empty, Validators.pattern("^[0-9]+\\.{0,1}\\d{0,2}$")],
      thoihanthamdo: [DefaultValue.Empty, [Validators.required, Validators.pattern("^[0-9]+\\.{0,1}\\d{0,2}$")]],
      mucdichsudungkhoangsan: [DefaultValue.Empty],
      donvidientich: [DefaultValue.Empty, Validators.required],
      donvithoihan: [DefaultValue.Empty, Validators.required],
      donvichieusau: [DefaultValue.Empty],
      hequychieu: [DefaultValue.Empty, Validators.required]
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
  private async formOnEdit(item: OutputDkThamDoKhoangSanModel) {
    if (this.currentAction === DangKyThamDoActionEnum.Edit && item) {
      this.dangKyThamDoIOForm.setValue({
        diadiem: item.diadiem,
        dientichthamdo: item.dientichthamdo,
        chieusauthamdotu: item.chieusauthamdotu,
        chieusauthamdoden: item.chieusauthamdoden,
        thoihanthamdo: item.thoihanthamdo,
        mucdichsudungkhoangsan: item.mucdichsudungkhoangsan,
        donvidientich: item.donvidientich,
        donvithoihan: item.donvithoihan,
        donvichieusau: item.donvichieusau,
        hequychieu: item.hequychieu
      });

      this.showViewOfHeQuyChieu(item);
    }
  }

  private showViewOfHeQuyChieu(item: OutputDkThamDoKhoangSanModel) {
    if (item && item.hequychieu !== DefaultValue.Undefined && item.hequychieu !== DefaultValue.Null && item.hequychieu.trim() !== DefaultValue.Empty) {
      this.tenHeQuyChieu = this.getTenHeQuyChieu(item.hequychieu);
    } else {
      this.tenHeQuyChieu = this.getTenHeQuyChieu(DefaultValue.Empty);
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
   * Hàm set validate
   */
  private setValidation() {
    this.validationErrorMessages = {
      diadiem: {required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkythamdokhoangsan.diadiemRequired},
      dientichthamdo: {
        required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkythamdokhoangsan.dientichthamdoRequired,
        pattern: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkythamdokhoangsan.dientichthamdoFormat
      },
      chieusauthamdotu: {pattern: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkythamdokhoangsan.chieusauthamdotuFormat},
      chieusauthamdoden: {pattern: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkythamdokhoangsan.chieusauthamdodenFormat},
      thoihanthamdo: {
        required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkythamdokhoangsan.thoihanthamdoRequired,
        pattern: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkythamdokhoangsan.thoihanthamdoFormat
      },
      donvidientich: {required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkythamdokhoangsan.donvidientichRequired},
      donvithoihan: {required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkythamdokhoangsan.donvithoihanRequired},
      hequychieu: {required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkythamdokhoangsan.hequychieuRequired},
    };
  }

  /**
   * Hàm lấy danh sách Lĩnh Vực
   */
  async geAllHeQuyChieu() {
    const allHeQuyChieuData: any = await this.dmFacadeService
      .getDmHeQuyChieuService()
      .getFetchAll({PageNumber: 1, PageSize: -1});
    this.allHeQuyChieu = allHeQuyChieuData.items;
    this.HeQuyChieuFilters = allHeQuyChieuData.items;
  }

  /**
   * set default hệ quy chiếu
   */

  setDefaultHeQuyChieu(srid: string) {
    if (this.allHeQuyChieu && this.allHeQuyChieu.length > DefaultValue.Zero) {
      const data = this.allHeQuyChieu.find(item => item.srid === srid);

      if (data) {
        this.dangKyThamDoIOForm.controls.hequychieu.setValue(srid);
      }
    }
  }

  /**
   * Lấy dữ liệu hồ sơ theo IdHoSo
   * @param idHoSo
   */
  private async getDangKyThamDoByIdHoSo(idHoSo: string) {
    const dkThamDoKhoangSanService = this.dangKyHoatDongKhoangSanFacadeService.getDangKyThamDoKhoangSanService();
    const dangKyItem = await dkThamDoKhoangSanService.getDangKyThamDoByIdHoSo(idHoSo).toPromise() as OutputDkThamDoKhoangSanModel;
    return dangKyItem;
  }

  async saveItemDangKyThamDo() {
    this.logAllValidationErrorMessages();

    if (!this.dangKyThamDoIOForm.valid) {
      return;
    }

    // Gán dữ liệu input vào model
    const dkThamDoKhoangSanService = this.dangKyHoatDongKhoangSanFacadeService.getDangKyThamDoKhoangSanService();
    const inputModel = this.dangKyThamDoIOForm.value;
    inputModel.idhoso = this.idhoso;
    if (this.currentAction === DangKyThamDoActionEnum.Add) {
      dkThamDoKhoangSanService.addItem(inputModel).subscribe(
        async (res) => {
          this.dangKyThamDoKhoangSan = inputModel;
          this.dangKyThamDoKhoangSan.iddangkythamdo = res.iddangkythamdo;
          this.currentAction = DangKyThamDoActionEnum.Edit;
          this.selectCurrentFormState();
          this.selectIdDangKyThamDo();
          this.showViewOfHeQuyChieu(this.dangKyThamDoKhoangSan);
          this.selectHeQuyChieu();
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
    } else if (this.currentAction === DangKyThamDoActionEnum.Edit) {
      inputModel.iddangkythamdo = this.dangKyThamDoKhoangSan.iddangkythamdo;
      dkThamDoKhoangSanService.updateItem(inputModel).subscribe(
        async (res) => {
          this.dangKyThamDoKhoangSan = inputModel;
          this.currentAction = DangKyThamDoActionEnum.Edit;
          this.selectCurrentFormState();
          this.showViewOfHeQuyChieu(this.dangKyThamDoKhoangSan);
          this.selectHeQuyChieu();
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
      this.dangKyThamDoIOForm,
      this.validationErrorMessages,
      this.formErrors
    );
  }

  /**
   * select inserted state of form
   */
  private selectCurrentFormState() {
    if (this.currentAction === DangKyThamDoActionEnum.Edit) {
      this.disabledDeleteButton = false;
    } else {
      this.disabledDeleteButton = true;
    }

    this.selectCurrentFormStateEvent.emit(this.currentAction);
  }

  /**
   * lấy thông tin id hồ sơ sau khi thêm mới một hồ sơ
   */
  private selectIdDangKyThamDo() {
    this.selectIdDangKyThamDoEvent.emit(this.dangKyThamDoKhoangSan.iddangkythamdo);
  }

  /**
   * lấy thông tin id hồ sơ sau khi thêm mới một hồ sơ
   */
  private selectHeQuyChieu() {
    if (this.dangKyThamDoKhoangSan) {
      this.selectHeQuyChieuEvent.emit(this.dangKyThamDoKhoangSan.hequychieu);
    } else {
      this.selectHeQuyChieuEvent.emit(DefaultValue.Empty);
    }
  }

  /**
   * Xóa đăng ký thăm do theo Id hồ sơ
   */
  deleteItemDangKyThamDoKhoangSan() {
    const dialogRef = this.commonService.confirmDeleteDiaLogService(
      this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkythamdokhoangsan.contentDelete,
      this.dangKyThamDoKhoangSan.diadiem
    );
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === "confirm") {
        await this.dangKyHoatDongKhoangSanFacadeService
          .getDangKyThamDoKhoangSanService()
          .deleteDangKyThamDoByIdHoSo(this.idhoso)
          .subscribe(
            () => {
              this.dangKyThamDoKhoangSan = DefaultValue.Null;
              this.currentAction = DangKyThamDoActionEnum.Add;
              this.selectCurrentFormState();
              this.onFormReset();
              this.showViewOfHeQuyChieu(this.dangKyThamDoKhoangSan);
              this.selectHeQuyChieu();
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
    this.dangKyThamDoIOForm.reset();
    this.disabledHeQuyChieu = false;
    this.dangKyThamDoIOForm.controls.donvidientich.setValue(DefaultValue.Empty);
    this.dangKyThamDoIOForm.controls.donvithoihan.setValue(DefaultValue.Empty);
    this.dangKyThamDoIOForm.controls.donvichieusau.setValue(DefaultValue.Empty);
    this.dangKyThamDoIOForm.controls.hequychieu.setValue(DefaultValue.Empty);
  }
}
