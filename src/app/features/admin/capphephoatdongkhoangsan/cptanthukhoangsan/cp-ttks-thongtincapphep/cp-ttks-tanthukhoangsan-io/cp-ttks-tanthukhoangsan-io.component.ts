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
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {OutputDmHeQuyChieuModel} from "src/app/models/admin/danhmuc/hequychieu.model";
import {CapPhepThamDoActionEnum, LoaiCapPhepEnum} from "src/app/shared/constants/enum";
import {
  DonViCongSuat,
  DonViDienTich,
  DonViDoSau,
  DonViThoiHan,
  DonViTruLuong,
  PhuongPhapKhaiThac
} from "src/app/shared/constants/common-constants";
import {OutputGiayPhepModel} from "src/app/models/admin/hosogiayto/giayphep.model";
import {DefaultValue} from "src/app/shared/constants/global-var";
import {TranslateService} from "@ngx-translate/core";
import {DmFacadeService} from "src/app/services/admin/danhmuc/danhmuc-facade.service";
import {CommonServiceShared} from "src/app/services/utilities/common-service";
import {ActivatedRoute} from "@angular/router";
import {MatsidenavService} from "src/app/services/utilities/matsidenav.service";
import {CapPhepHoatDongKhoangSanFacadeService} from "src/app/services/admin/capphephoatdongkhoangsan/capphephoatdongkhoangsan-facade.service";
import {HoSoGiayToFacadeService} from "src/app/services/admin/hosogiayto/hosogiayto-facade.service";
import {validationAllErrorMessagesService} from "src/app/services/utilities/validatorService";
import {HttpErrorResponse} from "@angular/common/http";
import {MatSidenav} from "@angular/material/sidenav";
import {OutputCpTanThuKhoangSanModel} from "src/app/models/admin/capphephoatdongkhoangsan/cptanthukhoangsan/cptanthukhoangsan.model";

@Component({
  selector: 'app-cp-ttks-tanthukhoangsan-io',
  templateUrl: './cp-ttks-tanthukhoangsan-io.component.html',
  styleUrls: ['./cp-ttks-tanthukhoangsan-io.component.scss']
})
export class CpTtksTanthukhoangsanIoComponent implements OnInit {

  @ViewChild(Type, {static: true}) public matSidenav: MatSidenav;
  @ViewChild(Type, {read: ViewContainerRef, static: true}) public content: ViewContainerRef;
  // tslint:disable-next-line: no-output-rename
  @Output("selectCurrentFormStateEvent") selectCurrentFormStateEvent: EventEmitter<number> = new EventEmitter();
  // tslint:disable-next-line: no-output-rename
  @Output("selectIdCapPhepTanThuEvent") selectIdCapPhepTanThuEvent: EventEmitter<string> = new EventEmitter();
  // tslint:disable-next-line: no-input-rename
  @Input("allowAutoInit") allowAutoInit = true;
  // Chứa dữ liệu Form
  public capPhepTanThuIOForm: FormGroup;
  // Chứa dữ liệu translate
  public dataTranslate: any;
  // chứa dữ liệu Id giấy phép
  public idgiayphep: string;
  // chứa dữ liệu đăng ký thăm dò
  private capPhepTanThuKhoangSan: OutputCpTanThuKhoangSanModel;
  // Action thao tác dữ liệu
  public currentAction: number;
  // disable delete button
  public disabledDeleteButton = false;
  // disable control diện tích trả lại
  public disabledDienTichTraLai = false;
  // Chứa danh sách Hệ quy chiếu
  public allHeQuyChieu: OutputDmHeQuyChieuModel[];
  public HeQuyChieuFilters: OutputDmHeQuyChieuModel[];
  // Action cấp thăm dò
  public ActionType = CapPhepThamDoActionEnum;
  // lưu dữ liệu đơn vị diện tích
  public donViDienTichList = DonViDienTich;
  // Lưu trữ đơn vị thời hạn
  public donViThoiHanList = DonViThoiHan;
  // lưu dữ liệu đơn vị diện tích
  public donViDoSauList = DonViDoSau;
  // lưu dữ liệu đơn vị trữ lượng
  public donViTruLuongList = DonViTruLuong;
  // lưu dữ liệu đơn vị công suất
  public donViCongSuatList = DonViCongSuat;
  // Chứa phương pháp khai thác
  public phuongPhapKhaiThac = PhuongPhapKhaiThac;
  // tile form
  public title: string;
  // giấy phep item
  private itemGiayPhep: OutputGiayPhepModel;
  // form errors
  formErrors = {
    tenkhuvuctanthu: DefaultValue.Empty,
    diadiem: DefaultValue.Empty,
    dientichkhaithac: DefaultValue.Empty,
    truluongdiachat: DefaultValue.Empty,
    truluongkhaithac: DefaultValue.Empty,
    thoihankhaithac: DefaultValue.Empty,
    ngaybdkhaithac: DefaultValue.Empty,
    ngayktkhaithac: DefaultValue.Empty,
    phuongphapkhaithac: DefaultValue.Empty,
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
      tenkhuvuctanthu: {required: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.cpttkstanthukhoangsan.tenkhuvuctanthuRequired},
      diadiem: {required: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.cpttkstanthukhoangsan.diadiemRequired},
      dientichkhaithac: {
        required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.cpttkstanthukhoangsan.dientichkhaithacRequired,
        pattern: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.cpttkstanthukhoangsan.numberRequired
      },
      truluongdiachat: {
        required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.cpttkstanthukhoangsan.truluongdiachatRequired,
        pattern: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.cpttkstanthukhoangsan.numberRequired
      },
      truluongkhaithac: {
        required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.cpttkstanthukhoangsan.truluongkhaithacRequired,
        pattern: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.cpttkstanthukhoangsan.numberRequired
      },
      congsuatkhaithac: {required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.cpttkstanthukhoangsan.congsuatkhaithacRequired},
      mucsaukhaithactu: {pattern: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.cpttkstanthukhoangsan.numberRequired},
      mucsaukhaithacden: {pattern: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.cpttkstanthukhoangsan.numberRequired},
      donvidientich: {required: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.cpttkstanthukhoangsan.donvidientichRequired},
      donvithoihan: {required: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.cpttkstanthukhoangsan.donvithoihanRequired},
      donvichieusau: {required: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.cpttkstanthukhoangsan.donvichieusauRequired},
      hequychieu: {required: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.cpttkstanthukhoangsan.hequychieuRequired},
      donvitruluong: {required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.cpttkstanthukhoangsan.donvitruluongRequired},
      donvicongsuat: {required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.cpttkstanthukhoangsan.donvicongsuatRequired},
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

    if (this.itemGiayPhep && (this.itemGiayPhep.loaicapphep === LoaiCapPhepEnum.KhaiThacTanThuKhoangSan || this.itemGiayPhep.loaicapphep === LoaiCapPhepEnum.KhaiThacTanThuKhoangSanGiaHan)) {
      this.capPhepTanThuKhoangSan = await this.getCapPhepTanThuByIdGiayPhep(this.idgiayphep);

      if (this.capPhepTanThuKhoangSan) {
        this.currentAction = CapPhepThamDoActionEnum.Edit;
        this.selectIdCapPhepTanThu();
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
    await this.formOnEdit(this.capPhepTanThuKhoangSan);

    return true;
  }

  /**
   * set form title
   */
  private setFormTitle() {
    if (this.currentAction === CapPhepThamDoActionEnum.Edit) {
      if (this.itemGiayPhep.loaicapphep === LoaiCapPhepEnum.KhaiThacTanThuKhoangSan) {
        this.title = this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.cpttkstanthukhoangsan.titleEdit;
      } else if (this.itemGiayPhep.loaicapphep === LoaiCapPhepEnum.KhaiThacTanThuKhoangSanGiaHan) {
        this.title = this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.cpttkstanthukhoangsangiahan.titleEdit;
      } else {
        this.title = DefaultValue.Empty;
      }
    } else if (this.currentAction === CapPhepThamDoActionEnum.Add) {
      if (this.itemGiayPhep.loaicapphep === LoaiCapPhepEnum.KhaiThacTanThuKhoangSan) {
        this.title = this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.cpttkstanthukhoangsan.titleAdd;
      } else if (this.itemGiayPhep.loaicapphep === LoaiCapPhepEnum.KhaiThacTanThuKhoangSanGiaHan) {
        this.title = this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.cpttkstanthukhoangsangiahan.titleAdd;
      } else {
        this.title = DefaultValue.Empty;
      }
    }
  }

  /**
   * Hàm khởi tạo form
   */
  private formInit() {
    this.capPhepTanThuIOForm = this.formBuilder.group({
      tenkhuvuctanthu: [DefaultValue.Empty, Validators.required],
      diadiem: [DefaultValue.Empty, Validators.required],
      dientichkhaithac: [DefaultValue.Empty, [Validators.required, Validators.pattern("^[0-9]+\\.{0,1}\\d{0,2}$")]],
      truluongdiachat: [DefaultValue.Empty, [Validators.required, Validators.pattern("^[0-9]+\\.{0,1}\\d{0,2}$")]],
      truluongkhaithac: [DefaultValue.Empty, [Validators.required, Validators.pattern("^[0-9]+\\.{0,1}\\d{0,2}$")]],
      thoihankhaithac: [DefaultValue.Empty, [Validators.required, Validators.pattern("^[0-9]+\\.{0,1}\\d{0,2}$")]],
      ngaybdkhaithac: [DefaultValue.Empty],
      ngayktkhaithac: [DefaultValue.Empty],
      phuongphapkhaithac: [DefaultValue.Empty, Validators.required],
      congsuatkhaithac: [DefaultValue.Empty, [Validators.required, Validators.pattern("^[0-9]+\\.{0,1}\\d{0,2}$")]],
      mucsaukhaithactu: [DefaultValue.Empty, Validators.pattern("^[0-9]+\\.{0,1}\\d{0,2}$")],
      mucsaukhaithacden: [DefaultValue.Empty, Validators.pattern("^[0-9]+\\.{0,1}\\d{0,2}$")],
      donvitruluong: [DefaultValue.Empty, Validators.required],
      donvicongsuat: [DefaultValue.Empty, Validators.required],
      donvidientich: [DefaultValue.Empty, Validators.required],
      donvithoihan: [DefaultValue.Empty, Validators.required],
      donvichieusau: [DefaultValue.Empty, Validators.required],
      hequychieu: [DefaultValue.Empty, Validators.required],
    });
  }

  /**
   * hàm set value cho form
   */
  private async formOnEdit(item: OutputCpTanThuKhoangSanModel) {
    if (this.currentAction === CapPhepThamDoActionEnum.Edit && item) {
      this.capPhepTanThuIOForm.setValue({
        tenkhuvuctanthu: item.tenkhuvuctanthu,
        diadiem: item.diadiem,
        dientichkhaithac: item.dientichkhaithac,
        truluongdiachat: item.truluongdiachat,
        truluongkhaithac: item.truluongkhaithac,
        thoihankhaithac: item.thoihankhaithac,
        ngaybdkhaithac: item.ngaybdkhaithac,
        ngayktkhaithac: item.ngayktkhaithac,
        phuongphapkhaithac: item.phuongphapkhaithac,
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
   * Lấy dữ liệu hồ sơ theo idGiayPhep
   * @param idGiayPhep
   */
  private async getCapPhepTanThuByIdGiayPhep(idGiayPhep: string) {
    const cpTanThuKhoangSanService = this.capPhepHoatDongKhoangSanFacadeService.getCapPhepTanThuKhoangSanService();
    const dangKyItem = await cpTanThuKhoangSanService.getCapPhepTanThuByIdGiayPhep(idGiayPhep).toPromise() as OutputCpTanThuKhoangSanModel;
    return dangKyItem;
  }

  /**
   * lấy thông tin id hồ sơ sau khi thêm mới một hồ sơ
   */
  private selectIdCapPhepTanThu() {
    this.selectIdCapPhepTanThuEvent.emit(this.capPhepTanThuKhoangSan.idcappheptanthu);
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
      this.capPhepTanThuIOForm,
      this.validationErrorMessages,
      this.formErrors
    );
  }

  /**
   * save cấp phép thăm dò khoáng sản
   */
  async saveItemCapPhepTanThu() {
    this.logAllValidationErrorMessages();

    if (!this.capPhepTanThuIOForm.valid) {
      return;
    }

    // Gán dữ liệu input vào model
    const dkTanThuKhoangSanService = this.capPhepHoatDongKhoangSanFacadeService.getCapPhepTanThuKhoangSanService();
    const inputModel = this.capPhepTanThuIOForm.value;
    inputModel.idgiayphep = this.idgiayphep;
    if (this.currentAction === CapPhepThamDoActionEnum.Add) {
      dkTanThuKhoangSanService.addItem(inputModel).subscribe(
        async (res) => {
          this.capPhepTanThuKhoangSan = inputModel;
          this.capPhepTanThuKhoangSan.idcappheptanthu = res.idcappheptanthu;
          this.currentAction = CapPhepThamDoActionEnum.Edit;
          this.selectCurrentFormState();
          this.selectIdCapPhepTanThu();
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
      inputModel.idcappheptanthu = this.capPhepTanThuKhoangSan.idcappheptanthu;
      dkTanThuKhoangSanService.updateItem(inputModel).subscribe(
        async (res) => {
          this.capPhepTanThuKhoangSan = inputModel;
          this.currentAction = CapPhepThamDoActionEnum.Edit;
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
   * Xóa đăng ký thăm do theo Id hồ sơ
   */
  deleteItemCapPhepTanThuKhoangSan() {
    const dialogRef = this.commonService.confirmDeleteDiaLogService(
      this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.cpttkstanthukhoangsan.contentDelete,
      this.capPhepTanThuKhoangSan.diadiem
    );
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === "confirm") {
        await this.capPhepHoatDongKhoangSanFacadeService
          .getCapPhepTanThuKhoangSanService()
          .deleteCapPhepTanThuByIdGiayPhep(this.idgiayphep)
          .subscribe(
            () => {
              this.capPhepTanThuKhoangSan = null;
              this.currentAction = CapPhepThamDoActionEnum.Add;
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
    this.capPhepTanThuIOForm.reset();
  }

}
