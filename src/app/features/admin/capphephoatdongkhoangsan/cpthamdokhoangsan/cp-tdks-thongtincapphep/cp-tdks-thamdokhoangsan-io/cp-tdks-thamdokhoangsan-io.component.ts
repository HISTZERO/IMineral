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
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {DmFacadeService} from 'src/app/services/admin/danhmuc/danhmuc-facade.service';
import {CommonServiceShared} from 'src/app/services/utilities/common-service';
import {MatsidenavService} from 'src/app/services/utilities/matsidenav.service';
import {CapPhepThamDoActionEnum, LoaiCapPhepEnum} from 'src/app/shared/constants/enum';
import {DefaultValue} from 'src/app/shared/constants/global-var';
import {OutputCpThamDoKhoangSanModel} from 'src/app/models/admin/capphephoatdongkhoangsan/cpthamdokhoangsan.model';
import {OutputDmHeQuyChieuModel} from 'src/app/models/admin/danhmuc/hequychieu.model';
import {CapPhepHoatDongKhoangSanFacadeService} from 'src/app/services/admin/capphephoatdongkhoangsan/capphephoatdongkhoangsan-facade.service';
import {validationAllErrorMessagesService} from "src/app/services/utilities/validatorService";
import {HttpErrorResponse} from '@angular/common/http';
import {DonViDienTich, DonViDoSau, DonViThoiHan} from 'src/app/shared/constants/common-constants';
import {MatSidenav} from '@angular/material';
import {HoSoGiayToFacadeService} from 'src/app/services/admin/hosogiayto/hosogiayto-facade.service';
import {OutputGiayPhepModel} from 'src/app/models/admin/hosogiayto/giayphep.model';

@Component({
  selector: 'app-cp-tdks-thamdokhoangsan-io',
  templateUrl: './cp-tdks-thamdokhoangsan-io.component.html',
  styleUrls: ['./cp-tdks-thamdokhoangsan-io.component.scss']
})
export class CpTdksThamdokhoangsanIoComponent implements OnInit {
  @ViewChild(Type, {static: true}) public matSidenav: MatSidenav;
  @ViewChild(Type, {read: ViewContainerRef, static: true}) public content: ViewContainerRef;
  // tslint:disable-next-line: no-output-rename
  @Output("selectCurrentFormStateEvent") selectCurrentFormStateEvent: EventEmitter<number> = new EventEmitter();
  // tslint:disable-next-line: no-output-rename
  @Output("selectHeQuyChieuEvent") selectHeQuyChieuEvent: EventEmitter<string> = new EventEmitter();
  // tslint:disable-next-line: no-output-rename
  @Output("selectIdCapPhepThamDoEvent") selectIdCapPhepThamDoEvent: EventEmitter<string> = new EventEmitter();
  // tslint:disable-next-line: no-input-rename
  @Input("allowAutoInit") allowAutoInit = true;
  // Chứa dữ liệu Form
  public capPhepThamDoIOForm: FormGroup;
  // Chứa dữ liệu translate
  public dataTranslate: any;
  // chứa dữ liệu Id giấy phép
  public idgiayphep: string;
  // chứa dữ liệu đăng ký thăm dò
  private capPhepThamDoKhoangSan: OutputCpThamDoKhoangSanModel;
  // Action thao tác dữ liệu
  public currentAction: number;
  // disable delete button
  public disabledDeleteButton = false;
  // disable control diện tích trả lại
  public disabledDienTichTraLai = false;
  // disable control hệ quy chiếu
  public disabledHeQuyChieu= false;
  // Chứa danh sách Hệ quy chiếu
  public allHeQuyChieu: OutputDmHeQuyChieuModel[];
  public HeQuyChieuFilters: OutputDmHeQuyChieuModel[];
  // Lưu tên hệ quy chiếu sử dụng hiện tại
  public tenHeQuyChieu = DefaultValue.Empty;
  // Action cấp thăm dò
  public ActionType = CapPhepThamDoActionEnum;
  // lưu dữ liệu đơn vị diện tích
  public donViDienTichList = DonViDienTich;
  // Lưu trữ đơn vị thời hạn
  public donViThoiHanList = DonViThoiHan;
  // lưu dữ liệu đơn vị diện tích
  public donViDoSauList = DonViDoSau;
  // tile form
  public title: string;
  // giấy phep item
  private itemGiayPhep: OutputGiayPhepModel;
  // form errors
  formErrors = {
    tenkhuvucthamdo: DefaultValue.Empty,
    diadiem: DefaultValue.Empty,
    dientichthamdo: DefaultValue.Empty,
    dientichtralai: DefaultValue.Empty,
    chieusauthamdotu: DefaultValue.Empty,
    chieusauthamdoden: DefaultValue.Empty,
    thoihanthamdo: DefaultValue.Empty,
    ngaybdthamdo: DefaultValue.Empty,
    ngayktthamdo: DefaultValue.Empty,
    mucdichsudungkhoangsan: DefaultValue.Empty,
    donvidientich: DefaultValue.Empty,
    donvithoihan: DefaultValue.Empty,
    donvichieusau: DefaultValue.Empty,
    hequychieu: DefaultValue.Empty,
  };

  // error message
  validationErrorMessages = {};

  constructor(
    private translate: TranslateService,
    private formBuilder: FormBuilder,
    private dmFacadeService: DmFacadeService,
    public commonService: CommonServiceShared,
    private activatedRoute: ActivatedRoute,
    public matSidenavService: MatsidenavService,
    private capPhepHoatDongKhoangSanFacadeService: CapPhepHoatDongKhoangSanFacadeService,
    private hoSoGiayToFacadeService: HoSoGiayToFacadeService,
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
  private setValidation() {
    this.validationErrorMessages = {
      tenkhuvucthamdo: {required: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.cptdksthamdokhoangsan.tenkhuvucthamdoRequired},
      diadiem: {required: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.cptdksthamdokhoangsan.diadiemRequired},
      dientichthamdo: {
        required: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.cptdksthamdokhoangsan.dientichthamdoRequired,
        pattern: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.cptdksthamdokhoangsan.dientichthamdoFormat
      },
      dientichtralai: {pattern: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.cptdksthamdokhoangsan.dientichtralaiFormat},
      chieusauthamdotu: {
        pattern: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.cptdksthamdokhoangsan.chieusauthamdotuFormat
      },
      chieusauthamdoden: {
        pattern: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.cptdksthamdokhoangsan.chieusauthamdodenFormat
      },
      thoihanthamdo: {
        required: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.cptdksthamdokhoangsan.thoihanthamdoRequired,
        pattern: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.cptdksthamdokhoangsan.thoihanthamdoFormat
      },
      ngaybdthamdo: {required: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.cptdksthamdokhoangsan.ngaybdthamdoRequired},
      ngayktthamdo: {required: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.cptdksthamdokhoangsan.ngayktthamdoRequired},
      mucdichsudungkhoangsan: {required: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.cptdksthamdokhoangsan.mucdichsudungkhoangsanRequired},
      donvidientich: {required: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.cptdksthamdokhoangsan.donvidientichRequired},
      donvithoihan: {required: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.cptdksthamdokhoangsan.donvithoihanRequired},
      hequychieu: {required: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.cptdksthamdokhoangsan.hequychieuRequired}
    };
  }

  /**
   * Khởi tạo form
   */
  async manualDataInit() {
    this.activatedRoute.queryParamMap.subscribe((param: any) => {
      if (param && param.params && param.params.idgiayphep) {
        this.idgiayphep = param.params.idgiayphep;
      }
    });

    if ((this.itemGiayPhep === DefaultValue.Null || this.itemGiayPhep === DefaultValue.Undefined)
      && this.idgiayphep !== DefaultValue.Null && this.idgiayphep !== DefaultValue.Undefined
      && this.idgiayphep.trim() !== DefaultValue.Empty) {
      this.itemGiayPhep = await this.hoSoGiayToFacadeService.getGiayPhepService().getByid(this.idgiayphep).toPromise() as OutputGiayPhepModel;
    }

    if (this.itemGiayPhep && (this.itemGiayPhep.loaicapphep === LoaiCapPhepEnum.ThamDoKhoangSan || this.itemGiayPhep.loaicapphep === LoaiCapPhepEnum.ThamDoGiaHan || this.itemGiayPhep.loaicapphep === LoaiCapPhepEnum.ChuyenNhuongQuyenThamDoKhoangSan)) {
      this.capPhepThamDoKhoangSan = await this.getCapPhepThamDoByIdGiayPhep(this.idgiayphep);
      if (this.capPhepThamDoKhoangSan) {
        this.currentAction = CapPhepThamDoActionEnum.Edit;
        this.selectIdCapPhepThamDo();
        this.selectHeQuyChieu();
        this.selectCurrentFormState();
        this.setFormTitle();
      } else {
        this.currentAction = CapPhepThamDoActionEnum.Add;
        this.selectCurrentFormState();
        this.setFormTitle();
      }
    } else {
      this.currentAction = CapPhepThamDoActionEnum.None;
      return;
    }

    // Lấy dữ liệu hệ quy chiếu
    await this.geAllHeQuyChieu();
    // Khởi tạo dữ liệu form trong trường hợp sửa dữ liệu Hồ Sơ
    await this.formOnEdit(this.capPhepThamDoKhoangSan);

    return true;
  }

  /**
   * set form title
   */
  private setFormTitle() {
    if (this.currentAction === CapPhepThamDoActionEnum.Edit) {
      if (this.itemGiayPhep.loaicapphep === LoaiCapPhepEnum.ThamDoKhoangSan) {
        this.title = this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.cptdksthamdokhoangsan.titleEdit;
      } else if (this.itemGiayPhep.loaicapphep === LoaiCapPhepEnum.ThamDoGiaHan) {
        this.title = this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.cptdksthamdogiahan.titleEdit;
      } else {
        this.title = DefaultValue.Empty;
      }
    } else if (this.currentAction === CapPhepThamDoActionEnum.Add) {
      if (this.itemGiayPhep.loaicapphep === LoaiCapPhepEnum.ThamDoKhoangSan) {
        this.title = this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.cptdksthamdokhoangsan.titleAdd;
      } else if (this.itemGiayPhep.loaicapphep === LoaiCapPhepEnum.ThamDoGiaHan) {
        this.title = this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.cptdksthamdogiahan.titleAdd;
      } else {
        this.title = DefaultValue.Empty;
      }
    }
  }

  /**
   * Hàm khởi tạo form
   */
  private formInit() {
    this.capPhepThamDoIOForm = this.formBuilder.group({
      tenkhuvucthamdo: [DefaultValue.Empty, Validators.required],
      diadiem: [DefaultValue.Empty, Validators.required],
      dientichthamdo: [DefaultValue.Empty, [Validators.required, Validators.pattern("^[0-9]+\\.{0,1}\\d{0,2}$")]],
      dientichtralai: [DefaultValue.Empty, Validators.pattern("^[0-9]+\\.{0,1}\\d{0,2}$")],
      chieusauthamdotu: [DefaultValue.Empty,  Validators.pattern("^[0-9]+\\.{0,1}\\d{0,2}$")],
      chieusauthamdoden: [DefaultValue.Empty,  Validators.pattern("^[0-9]+\\.{0,1}\\d{0,2}$")],
      thoihanthamdo: [DefaultValue.Empty, [Validators.required, Validators.pattern("^[0-9]+\\.{0,1}\\d{0,2}$")]],
      ngaybdthamdo: [DefaultValue.Empty, Validators.required],
      ngayktthamdo: [DefaultValue.Empty, Validators.required],
      mucdichsudungkhoangsan: [DefaultValue.Empty, Validators.required],
      donvidientich: [DefaultValue.Empty, Validators.required],
      donvithoihan: [DefaultValue.Empty, Validators.required],
      donvichieusau: [DefaultValue.Empty],
      hequychieu: [DefaultValue.Empty, Validators.required]
    });
  }

  /**
   * hàm set value cho form
   */
  private async formOnEdit(item: OutputCpThamDoKhoangSanModel) {
    if (this.currentAction === CapPhepThamDoActionEnum.Edit && item) {
      this.capPhepThamDoIOForm.setValue({
        tenkhuvucthamdo: item.tenkhuvucthamdo,
        diadiem: item.diadiem,
        dientichthamdo: item.dientichthamdo,
        dientichtralai: item.dientichtralai,
        chieusauthamdotu: item.chieusauthamdotu,
        chieusauthamdoden: item.chieusauthamdoden,
        thoihanthamdo: item.thoihanthamdo,
        ngaybdthamdo: item.ngaybdthamdo,
        ngayktthamdo: item.ngayktthamdo,
        mucdichsudungkhoangsan: item.mucdichsudungkhoangsan,
        // dangkhoangsan: item.dangkhoangsan,
        donvidientich: item.donvidientich,
        donvithoihan: item.donvithoihan,
        donvichieusau: item.donvichieusau,
        hequychieu: item.hequychieu
      });

      this.showViewOfHeQuyChieu(item);
    }
  }

  private showViewOfHeQuyChieu(item: OutputCpThamDoKhoangSanModel) {
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
        this.capPhepThamDoIOForm.controls.hequychieu.setValue(srid);
      }
    }
  }

  /**
   * Lấy dữ liệu hồ sơ theo idGiayPhep
   * @param idGiayPhep
   */
  private async getCapPhepThamDoByIdGiayPhep(idGiayPhep: string) {
    const cpThamDoKhoangSanService = this.capPhepHoatDongKhoangSanFacadeService.getCapPhepThamDoKhoangSanService();
    const dangKyItem = await cpThamDoKhoangSanService.getCapPhepThamDoByIdGiayPhep(idGiayPhep).toPromise() as OutputCpThamDoKhoangSanModel;
    return dangKyItem;
  }

  /**
   * lấy thông tin id hồ sơ sau khi thêm mới một hồ sơ
   */
  private selectIdCapPhepThamDo() {
    this.selectIdCapPhepThamDoEvent.emit(this.capPhepThamDoKhoangSan.idcapphepthamdo);
  }

  /**
   * lấy thông tin hệ quy chiếu
   */
  private selectHeQuyChieu() {
    if (this.capPhepThamDoKhoangSan) {
      this.selectHeQuyChieuEvent.emit(this.capPhepThamDoKhoangSan.hequychieu);
    } else {
      this.selectHeQuyChieuEvent.emit(DefaultValue.Empty);
    }
  }

  /**
   * select inserted state of form
   */
  private selectCurrentFormState() {
    if (this.currentAction === CapPhepThamDoActionEnum.Edit) {
      this.disabledDeleteButton = false;
    } else {
      this.disabledDeleteButton = true;
    }

    this.selectCurrentFormStateEvent.emit(this.currentAction);
  }

  /**
   * hàm kiểm tra validation form
   */
  private logAllValidationErrorMessages() {
    validationAllErrorMessagesService(
      this.capPhepThamDoIOForm,
      this.validationErrorMessages,
      this.formErrors
    );
  }

  /**
   * save cấp phép thăm dò khoáng sản
   */
  async saveItemCapPhepThamDo() {
    this.logAllValidationErrorMessages();

    if (!this.capPhepThamDoIOForm.valid) {
      return;
    }

    // Gán dữ liệu input vào model
    const dkThamDoKhoangSanService = this.capPhepHoatDongKhoangSanFacadeService.getCapPhepThamDoKhoangSanService();
    const inputModel = this.capPhepThamDoIOForm.value;
    inputModel.idgiayphep = this.idgiayphep;
    if (this.currentAction === CapPhepThamDoActionEnum.Add) {
      dkThamDoKhoangSanService.addItem(inputModel).subscribe(
        async (res) => {
          this.capPhepThamDoKhoangSan = inputModel;
          this.capPhepThamDoKhoangSan.idcapphepthamdo = res.idcapphepthamdo;
          this.currentAction = CapPhepThamDoActionEnum.Edit;
          this.selectCurrentFormState();
          this.setFormTitle();
          this.selectIdCapPhepThamDo();
          this.showViewOfHeQuyChieu(this.capPhepThamDoKhoangSan);
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
    } else if (this.currentAction === CapPhepThamDoActionEnum.Edit) {
      inputModel.idcapphepthamdo = this.capPhepThamDoKhoangSan.idcapphepthamdo;
      dkThamDoKhoangSanService.updateItem(inputModel).subscribe(
        async (res) => {
          this.capPhepThamDoKhoangSan = inputModel;
          this.currentAction = CapPhepThamDoActionEnum.Edit;
          this.selectCurrentFormState();
          this.setFormTitle();
          this.showViewOfHeQuyChieu(this.capPhepThamDoKhoangSan);
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
   * Xóa đăng ký thăm do theo Id hồ sơ
   */
  deleteItemCapPhepThamDoKhoangSan() {
    const dialogRef = this.commonService.confirmDeleteDiaLogService(
      this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.cptdksthamdokhoangsan.contentDelete,
      this.capPhepThamDoKhoangSan.diadiem
    );
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === "confirm") {
        await this.capPhepHoatDongKhoangSanFacadeService
          .getCapPhepThamDoKhoangSanService()
          .deleteCapPhepThamDoByIdGiayPhep(this.idgiayphep)
          .subscribe(
            () => {
              this.capPhepThamDoKhoangSan = DefaultValue.Null;
              this.currentAction = CapPhepThamDoActionEnum.Add;
              this.onFormReset();
              this.selectCurrentFormState();
              this.setFormTitle();
              this.showViewOfHeQuyChieu(this.capPhepThamDoKhoangSan);
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
    this.capPhepThamDoIOForm.reset();
    this.disabledHeQuyChieu = false;
    this.capPhepThamDoIOForm.controls.donvidientich.setValue(DefaultValue.Empty);
    this.capPhepThamDoIOForm.controls.donvithoihan.setValue(DefaultValue.Empty);
    this.capPhepThamDoIOForm.controls.donvichieusau.setValue(DefaultValue.Empty);
    this.capPhepThamDoIOForm.controls.hequychieu.setValue(DefaultValue.Empty);
  }
}
