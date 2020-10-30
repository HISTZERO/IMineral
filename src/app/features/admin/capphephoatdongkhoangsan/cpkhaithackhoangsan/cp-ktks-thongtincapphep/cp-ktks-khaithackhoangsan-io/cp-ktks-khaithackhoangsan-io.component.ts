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
import {HttpErrorResponse} from '@angular/common/http';
import {MatSidenav} from '@angular/material';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';

import {DmFacadeService} from 'src/app/services/admin/danhmuc/danhmuc-facade.service';
import {CommonServiceShared} from 'src/app/services/utilities/common-service';
import {MatsidenavService} from 'src/app/services/utilities/matsidenav.service';
import {CapPhepKhaiThacActionEnum, LoaiCapPhepEnum} from 'src/app/shared/constants/enum';
import {DefaultValue} from 'src/app/shared/constants/global-var';
import {OutputDmHeQuyChieuModel} from 'src/app/models/admin/danhmuc/hequychieu.model';
import {CapPhepHoatDongKhoangSanFacadeService} from 'src/app/services/admin/capphephoatdongkhoangsan/capphephoatdongkhoangsan-facade.service';
import {validationAllErrorMessagesService} from "src/app/services/utilities/validatorService";
import {
  DonViCongSuat,
  DonViDienTich,
  DonViDoSau,
  DonViThoiHan,
  DonViTruLuong,
  PhuongPhapKhaiThac
} from 'src/app/shared/constants/common-constants';
import {HoSoGiayToFacadeService} from 'src/app/services/admin/hosogiayto/hosogiayto-facade.service';
import {OutputGiayPhepModel} from 'src/app/models/admin/hosogiayto/giayphep.model';
import {OutputCpKhaiThacKhoangSanModel} from "src/app/models/admin/capphephoatdongkhoangsan/cpkhaithackhoangsan/cpkhaithackhoangsan.model";

@Component({
  selector: 'app-cp-ktks-khaithackhoangsan-io',
  templateUrl: './cp-ktks-khaithackhoangsan-io.component.html',
  styleUrls: ['./cp-ktks-khaithackhoangsan-io.component.scss']
})
export class CpKtksKhaithackhoangsanIoComponent implements OnInit {

  @ViewChild(Type, {static: true}) public matSidenav: MatSidenav;
  @ViewChild(Type, {read: ViewContainerRef, static: true}) public content: ViewContainerRef;
  // tslint:disable-next-line: no-output-rename
  @Output("selectCurrentFormStateEvent") selectCurrentFormStateEvent: EventEmitter<number> = new EventEmitter();
  // tslint:disable-next-line: no-output-rename
  @Output("selectIdCapPhepKhaiThacEvent") selectIdCapPhepKhaiThacEvent: EventEmitter<string> = new EventEmitter();
  // tslint:disable-next-line: no-input-rename
  @Input("allowAutoInit") allowAutoInit = true;
  // Chứa dữ liệu Form
  public capPhepKhaiThacIOForm: FormGroup;
  // Chứa dữ liệu translate
  public dataTranslate: any;
  // chứa dữ liệu Id giấy phép
  public idgiayphep: string;
  // chứa dữ liệu đăng ký khai thác
  private capPhepKhaiThacKhoangSan: OutputCpKhaiThacKhoangSanModel;
  // Action thao tác dữ liệu
  public currentAction: number;
  // disable delete button
  public disabledDeleteButton = false;
  // disable control diện tích trả lại
  public disabledDienTichTraLai = false;
  // Chứa danh sách Hệ quy chiếu
  public allHeQuyChieu: OutputDmHeQuyChieuModel[];
  public HeQuyChieuFilters: OutputDmHeQuyChieuModel[];
  // Action cấp khai thác
  public ActionType = CapPhepKhaiThacActionEnum;
  // lưu dữ liệu đơn vị diện tích
  public donViDienTichList = DonViDienTich;
  // Lưu trữ đơn vị thời hạn
  public donViThoiHanList = DonViThoiHan;
  // lưu dữ liệu đơn vị diện tích
  public donViDoSauList = DonViDoSau;
  // Chứa đon vị trữ lượng
  public donViTruLuongList = DonViTruLuong;
  // Chứa đơn vị công suất
  public donViCongSuat = DonViCongSuat;
  // Chứa phương pháp khai thác
  public phuongPhapKhaiThac = PhuongPhapKhaiThac;
  // tile form
  public title: string;
  // giấy phep item
  private itemGiayPhep: OutputGiayPhepModel;
  // Chứa thuộc tính hiển thị đóng cửa mỏ 1 phần
  public isDongCuaMoMotPhan: boolean = false;
  // Chứa thuốc tính hiển thị đóng cửa mỏ
  public isDongCuaMo: boolean = false;
  // Check trả lại một phần diện tích
  public isTraLaiMotPhanDienTichKhaiThac = false;
  // form errors
  formErrors = {
    tenmo: DefaultValue.Empty,
    sohieu: DefaultValue.Empty,
    diadiem: DefaultValue.Empty,
    duancongtrinh: DefaultValue.Empty,
    dientichkhaithac: DefaultValue.Empty,
    dientichtralai: DefaultValue.Empty,
    truluongdiachat: DefaultValue.Empty,
    truluongkhaithac: DefaultValue.Empty,
    truluongtralai: DefaultValue.Empty,
    thoihankhaithac: DefaultValue.Empty,
    ngaybdkhaithac: DefaultValue.Empty,
    ngayktkhaithac: DefaultValue.Empty,
    phuongphapkhaithac: DefaultValue.Empty,
    congsuatkhaithac: DefaultValue.Empty,
    mucsaukhaithactu: DefaultValue.Empty,
    mucsaukhaithacden: DefaultValue.Empty,
    dangkhoangsan: DefaultValue.Empty,
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
      tenmo: {required: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.cpktkskhaithackhoangsan.tenmoRequired},
      sohieu: {required: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.cpktkskhaithackhoangsan.sohieuRequired},
      diadiem: {required: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.cpktkskhaithackhoangsan.diadiemRequired},
      dientichkhaithac: {
        required: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.cpktkskhaithackhoangsan.dientichkhaithacRequired,
        pattern: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.cpktkskhaithackhoangsan.numberRequired
      },
      dientichtralai: {
        required: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.cpktkskhaithackhoangsan.dientichtralaiRequired,
        pattern: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.cpktkskhaithackhoangsan.numberRequired
      },
      truluongdiachat: {
        required: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.cpktkskhaithackhoangsan.truluongdiachatRequired,
        pattern: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.cpktkskhaithackhoangsan.numberRequired
      },
      truluongkhaithac: {
        required: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.cpktkskhaithackhoangsan.truluongkhaithacRequired,
        pattern: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.cpktkskhaithackhoangsan.numberRequired
      },
      truluongtralai: {
        required: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.cpktkskhaithackhoangsan.truluongtralaiRequired,
        pattern: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.cpktkskhaithackhoangsan.numberRequired
      },
      thoihankhaithac: {
        required: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.cpktkskhaithackhoangsan.thoihankhaithacRequired,
        pattern: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.cpktkskhaithackhoangsan.numberRequired
      },
      ngaybdkhaithac: {required: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.cpktkskhaithackhoangsan.ngaybdkhaithacRequired},
      ngayktkhaithac: {required: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.cpktkskhaithackhoangsan.ngayktkhaithacRequired},
      phuongphapkhaithac: {required: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.cpktkskhaithackhoangsan.phuongphapkhaithacRequired},
      congsuatkhaithac: {
        required: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.cpktkskhaithackhoangsan.congsuatkhaithacRequired,
        pattern: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.cpktkskhaithackhoangsan.numberRequired
      },
      mucsaukhaithactu: {pattern: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.cpktkskhaithackhoangsan.numberRequired},
      mucsaukhaithacden: {pattern: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.cpktkskhaithackhoangsan.numberRequired},
      donvitruluong: {required: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.cpktkskhaithackhoangsan.donvitruluongRequired},
      donvicongsuat: {required: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.cpktkskhaithackhoangsan.donvicongsuatRequired},
      donvidientich: {required: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.cpktkskhaithackhoangsan.donvidientichRequired},
      donvithoihan: {required: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.cpktkskhaithackhoangsan.donvithoihanRequired},
      hequychieu: {required: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.cpktkskhaithackhoangsan.hequychieuRequired},
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

    if (this.itemGiayPhep) {
      this.capPhepKhaiThacKhoangSan = await this.getCapPhepKhaiThacByIdGiayPhep(this.idgiayphep);

      if (this.itemGiayPhep.loaicapphep === LoaiCapPhepEnum.DongCuaMoKhoangSan) {
        this.isDongCuaMo = true;
      }

      if (this.itemGiayPhep.loaicapphep === LoaiCapPhepEnum.DongCuaMotPhanDienTichKhuVucKhaiThacKhoangSan) {
        this.isDongCuaMoMotPhan = true;
      }
      if (this.itemGiayPhep.loaicapphep === LoaiCapPhepEnum.TraLaiMotPhanDienTichKhuVucKhaiThacKhoangSan) {
        this.isTraLaiMotPhanDienTichKhaiThac = true;
      }

      if (this.capPhepKhaiThacKhoangSan) {
        this.currentAction = CapPhepKhaiThacActionEnum.Edit;
        this.selectIdCapPhepKhaiThac();
        this.selectCurrentFormState();
        this.setFormTitle();
      } else {
        this.currentAction = CapPhepKhaiThacActionEnum.Add;
        this.selectCurrentFormState();
        this.setFormTitle();
      }
    } else {
      this.currentAction = CapPhepKhaiThacActionEnum.None;
      return;
    }

    // Lấy dữ liệu hệ quy chiếu
    await this.geAllHeQuyChieu();
    // Khởi tạo dữ liệu form trong trường hợp sửa dữ liệu Hồ Sơ
    await this.formOnEdit(this.capPhepKhaiThacKhoangSan);

    return true;
  }

  /**
   * set form title
   */
  private setFormTitle() {
    if (this.currentAction === CapPhepKhaiThacActionEnum.Edit) {
      switch (this.itemGiayPhep.loaicapphep) {
        case LoaiCapPhepEnum.KhaiThacKhoangSan:
          this.title = this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.cpktkskhaithackhoangsan.titleEdit;
          break;
        case LoaiCapPhepEnum.KhaiThacKhoangSanGiaHan:
          this.title = this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.cpktkskhaithacgiahan.titleEdit;
          break;
        case LoaiCapPhepEnum.KhaiThacKhoangSanCoDuAnDauTu:
          this.title = this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.cpktkskhaithacduan.titleEdit;
          break;
        case LoaiCapPhepEnum.ThuHoiCatSoiDuAnNaoVetKhoiThong:
          this.title = this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.cpktkskhaithaccatsoi.titleEdit;
          break;
        case LoaiCapPhepEnum.KhaiThacKhoangSanLamVatLieuXayDung:
          this.title = this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.cpktkskhaithacvlxd.titleEdit;
          break;
        case LoaiCapPhepEnum.DieuChinhGiayPhepKhaiThac:
          this.title = this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.cpktkskhaithacdieuchinh.titleEdit;
          break;
        case LoaiCapPhepEnum.DongCuaMoKhoangSan:
          this.title = this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.cpdongcuamo.titleEdit;
          break;
        case LoaiCapPhepEnum.DongCuaMotPhanDienTichKhuVucKhaiThacKhoangSan:
          this.title = this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.cpdongcuamomotphan.titleEdit;
          break;
        case LoaiCapPhepEnum.TraLaiMotPhanDienTichKhuVucKhaiThacKhoangSan:
          this.title = this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.cappheptralaidientichkhaithackhoangsan.titleEdit;
          break;
        case LoaiCapPhepEnum.TraLaiMotPhanDienTichKhuVucThamDoKhoangSan:
          this.title = this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.cappheptralaidientichkhaithackhoangsan.titleEdit;
          break;
        default:
          this.title = DefaultValue.Empty;
          break;
      }
    } else if (this.currentAction === CapPhepKhaiThacActionEnum.Add) {
      switch (this.itemGiayPhep.loaicapphep) {
        case LoaiCapPhepEnum.KhaiThacKhoangSan:
          this.title = this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.cpktkskhaithackhoangsan.titleAdd;
          break;
        case LoaiCapPhepEnum.KhaiThacKhoangSanGiaHan:
          this.title = this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.cpktkskhaithacgiahan.titleAdd;
          break;
        case LoaiCapPhepEnum.KhaiThacKhoangSanCoDuAnDauTu:
          this.title = this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.cpktkskhaithacduan.titleAdd;
          break;
        case LoaiCapPhepEnum.ThuHoiCatSoiDuAnNaoVetKhoiThong:
          this.title = this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.cpktkskhaithaccatsoi.titleAdd;
          break;
        case LoaiCapPhepEnum.KhaiThacKhoangSanLamVatLieuXayDung:
          this.title = this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.cpktkskhaithacvlxd.titleAdd;
          break;
        case LoaiCapPhepEnum.DieuChinhGiayPhepKhaiThac:
          this.title = this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.cpktkskhaithacdieuchinh.titleAdd;
          break;
        case LoaiCapPhepEnum.DongCuaMoKhoangSan:
          this.title = this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.cpdongcuamo.titleAdd;
          break;
        case LoaiCapPhepEnum.DongCuaMotPhanDienTichKhuVucKhaiThacKhoangSan:
          this.title = this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.cpdongcuamomotphan.titleAdd;
          break;
        case LoaiCapPhepEnum.TraLaiMotPhanDienTichKhuVucKhaiThacKhoangSan:
          this.title = this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.cappheptralaidientichkhaithackhoangsan.titleAdd;
          break;
        case LoaiCapPhepEnum.TraLaiMotPhanDienTichKhuVucThamDoKhoangSan:
          this.title = this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.cappheptralaidientichkhaithackhoangsan.titleAdd;
          break;
        default:
          this.title = DefaultValue.Empty;
          break;
      }
    }
  }

  /**
   * Hàm khởi tạo form
   */
  private formInit() {
    this.capPhepKhaiThacIOForm = this.formBuilder.group({
      tenmo: [DefaultValue.Empty, Validators.required],
      sohieu: [DefaultValue.Empty, Validators.required],
      diadiem: [DefaultValue.Empty, Validators.required],
      duancongtrinh: [DefaultValue.Empty],
      dientichkhaithac: [DefaultValue.Empty, [Validators.required, Validators.pattern("^[0-9]+\\.{0,1}\\d{0,2}$")]],
      dientichtralai: [DefaultValue.Empty, [Validators.required, Validators.pattern("^[0-9]+\\.{0,1}\\d{0,2}$")]],
      truluongdiachat: [DefaultValue.Empty, [Validators.required, Validators.pattern("^[0-9]+\\.{0,1}\\d{0,2}$")]],
      truluongkhaithac: [DefaultValue.Empty, [Validators.required, Validators.pattern("^[0-9]+\\.{0,1}\\d{0,2}$")]],
      truluongtralai: [DefaultValue.Empty, [Validators.required, Validators.pattern("^[0-9]+\\.{0,1}\\d{0,2}$")]],
      thoihankhaithac: [DefaultValue.Empty, [Validators.required, Validators.pattern("^[0-9]+\\.{0,1}\\d{0,2}$")]],
      ngaybdkhaithac: [DefaultValue.Empty, Validators.required],
      ngayktkhaithac: [DefaultValue.Empty, Validators.required],
      phuongphapkhaithac: [DefaultValue.Empty, Validators.required],
      congsuatkhaithac: [DefaultValue.Empty, [Validators.required, Validators.pattern("^[0-9]+\\.{0,1}\\d{0,2}$")]],
      mucsaukhaithactu: [DefaultValue.Empty, Validators.pattern("^[0-9]+\\.{0,1}\\d{0,2}$")],
      mucsaukhaithacden: [DefaultValue.Empty, Validators.pattern("^[0-9]+\\.{0,1}\\d{0,2}$")],
      dangkhoangsan: [DefaultValue.Empty],
      donvitruluong: [DefaultValue.Empty, Validators.required],
      donvicongsuat: [DefaultValue.Empty, Validators.required],
      donvidientich: [DefaultValue.Empty, Validators.required],
      donvithoihan: [DefaultValue.Empty, Validators.required],
      donvichieusau: [DefaultValue.Empty],
      hequychieu: [DefaultValue.Empty, Validators.required],
    });
  }

  /**
   * hàm set value cho form
   */
  private async formOnEdit(item: OutputCpKhaiThacKhoangSanModel) {
    if (this.currentAction === CapPhepKhaiThacActionEnum.Edit && item) {
      this.capPhepKhaiThacIOForm.setValue({
        tenmo: item.tenmo,
        sohieu: item.sohieu,
        diadiem: item.diadiem,
        duancongtrinh: item.duancongtrinh,
        dientichkhaithac: item.dientichkhaithac,
        dientichtralai: item.dientichtralai,
        truluongdiachat: item.truluongdiachat,
        truluongkhaithac: item.truluongkhaithac,
        truluongtralai: item.truluongtralai,
        thoihankhaithac: item.thoihankhaithac,
        ngaybdkhaithac: item.ngaybdkhaithac,
        ngayktkhaithac: item.ngayktkhaithac,
        phuongphapkhaithac: item.phuongphapkhaithac,
        congsuatkhaithac: item.congsuatkhaithac,
        mucsaukhaithactu: item.mucsaukhaithactu,
        mucsaukhaithacden: item.mucsaukhaithacden,
        dangkhoangsan: item.dangkhoangsan,
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
  private async getCapPhepKhaiThacByIdGiayPhep(idGiayPhep: string) {
    const cpKhaiThacKhoangSanService = this.capPhepHoatDongKhoangSanFacadeService.getCapPhepKhaiThacKhoangSanService();
    const dangKyItem = await cpKhaiThacKhoangSanService.getCapPhepKhaiThacByIdGiayPhep(idGiayPhep).toPromise() as OutputCpKhaiThacKhoangSanModel;
    return dangKyItem;
  }

  /**
   * lấy thông tin id hồ sơ sau khi thêm mới một hồ sơ
   */
  private selectIdCapPhepKhaiThac() {
    this.selectIdCapPhepKhaiThacEvent.emit(this.capPhepKhaiThacKhoangSan.idcapphepkhaithac);
  }

  /**
   * select inserted state of form
   */
  private selectCurrentFormState() {
    if (this.currentAction === CapPhepKhaiThacActionEnum.Edit) {
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
      this.capPhepKhaiThacIOForm,
      this.validationErrorMessages,
      this.formErrors
    );
  }

  /**
   * save cấp phép khai thác khoáng sản
   */
  async saveItemCapPhepKhaiThac() {
    this.logAllValidationErrorMessages();

    if (!this.capPhepKhaiThacIOForm.valid) {
      return;
    }

    // Gán dữ liệu input vào model
    const dkKhaiThacKhoangSanService = this.capPhepHoatDongKhoangSanFacadeService.getCapPhepKhaiThacKhoangSanService();
    const inputModel = this.capPhepKhaiThacIOForm.value;
    inputModel.idgiayphep = this.idgiayphep;
    if (this.currentAction === CapPhepKhaiThacActionEnum.Add) {
      dkKhaiThacKhoangSanService.addItem(inputModel).subscribe(
        async (res) => {
          this.capPhepKhaiThacKhoangSan = inputModel;
          this.capPhepKhaiThacKhoangSan.idcapphepkhaithac = res.idcapphepkhaithac;
          this.currentAction = CapPhepKhaiThacActionEnum.Edit;
          this.selectCurrentFormState();
          this.selectIdCapPhepKhaiThac();
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
    } else if (this.currentAction === CapPhepKhaiThacActionEnum.Edit) {
      inputModel.idcapphepkhaithac = this.capPhepKhaiThacKhoangSan.idcapphepkhaithac;
      dkKhaiThacKhoangSanService.updateItem(inputModel).subscribe(
        async (res) => {
          this.capPhepKhaiThacKhoangSan = inputModel;
          this.currentAction = CapPhepKhaiThacActionEnum.Edit;
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
   * Xóa đăng ký khai thác theo Id hồ sơ
   */
  deleteItemCapPhepKhaiThacKhoangSan() {
    const dialogRef = this.commonService.confirmDeleteDiaLogService(
      this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.cpktkskhaithackhoangsan.contentDelete,
      ""
    );
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === "confirm") {
        await this.capPhepHoatDongKhoangSanFacadeService
          .getCapPhepKhaiThacKhoangSanService()
          .deleteCapPhepKhaiThacByIdGiayPhep(this.idgiayphep)
          .subscribe(
            () => {
              this.capPhepKhaiThacKhoangSan = null;
              this.currentAction = CapPhepKhaiThacActionEnum.Add;
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
    this.capPhepKhaiThacIOForm.reset();
  }

}
