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
import {CapPhepDauGiaKhaiThacActionEnum, LoaiCapPhepEnum} from 'src/app/shared/constants/enum';
import {DefaultValue} from 'src/app/shared/constants/global-var';
import {OutputDmHeQuyChieuModel} from 'src/app/models/admin/danhmuc/hequychieu.model';
import {CapPhepHoatDongKhoangSanFacadeService} from 'src/app/services/admin/capphephoatdongkhoangsan/capphephoatdongkhoangsan-facade.service';
import {validationAllErrorMessagesService} from "src/app/services/utilities/validatorService";
import {DonViDienTich} from 'src/app/shared/constants/common-constants';
import {HoSoGiayToFacadeService} from 'src/app/services/admin/hosogiayto/hosogiayto-facade.service';
import {OutputGiayPhepModel} from 'src/app/models/admin/hosogiayto/giayphep.model';
import {OutputCpDauGiaKhaiThacModel} from "src/app/models/admin/capphephoatdongkhoangsan/cpdaugiakhaithac/cpdaugiakhaithac.model";
import {OutputCpTanThuKhoangSanModel} from "src/app/models/admin/capphephoatdongkhoangsan/cptanthukhoangsan/cptanthukhoangsan.model";

@Component({
  selector: 'app-cp-daugiakhaithac-io',
  templateUrl: './cp-daugiakhaithac-io.component.html',
  styleUrls: ['./cp-daugiakhaithac-io.component.scss']
})
export class CpDaugiakhaithacIoComponent implements OnInit {
  @ViewChild(Type, {static: true}) public matSidenav: MatSidenav;
  @ViewChild(Type, {read: ViewContainerRef, static: true}) public content: ViewContainerRef;
  // tslint:disable-next-line: no-output-rename
  @Output("selectCurrentFormStateEvent") selectCurrentFormStateEvent: EventEmitter<number> = new EventEmitter();
  // tslint:disable-next-line: no-output-rename
  @Output("selectIdCapPhepDauGiaEvent") selectIdCapPhepDauGiaEvent: EventEmitter<string> = new EventEmitter();
  // tslint:disable-next-line: no-input-rename
  @Input("allowAutoInit") allowAutoInit = true;

  // tslint:disable-next-line: no-output-rename
  @Output("selectHeQuyChieuEvent") selectHeQuyChieuEvent: EventEmitter<string> = new EventEmitter();
  // Chứa dữ liệu Form
  public capPhepKhaiThacIOForm: FormGroup;
  // Chứa dữ liệu translate
  public dataTranslate: any;
  // chứa dữ liệu Id giấy phép
  public idgiayphep: string;
  // chứa dữ liệu đăng ký khai thác
  private dauGiaKhaiThac: OutputCpDauGiaKhaiThacModel;
  // Action thao tác dữ liệu
  public currentAction: number;
  // disable delete button
  public disabledDeleteButton = false;
  // Chứa danh sách Hệ quy chiếu
  public allHeQuyChieu: OutputDmHeQuyChieuModel[];
  public HeQuyChieuFilters: OutputDmHeQuyChieuModel[];
  // Action cấp khai thác
  public ActionType = CapPhepDauGiaKhaiThacActionEnum;
  // lưu dữ liệu đơn vị diện tích
  public donViDienTichList = DonViDienTich;
  // tile form
  public title: string;
  // giấy phep item
  private itemGiayPhep: OutputGiayPhepModel;

  // Lưu tên hệ quy chiếu sử dụng hiện tại
  public tenHeQuyChieu = DefaultValue.Empty;
  // disable control hệ quy chiếu
  public disabledHeQuyChieu = false;

  // form errors
  formErrors = {
    idcapphepdaugia: DefaultValue.Empty,
    tenkhuvucdaugia: DefaultValue.Empty,
    diadiem: DefaultValue.Empty,
    tenloaikhoangsan: DefaultValue.Empty,
    dientich: DefaultValue.Empty,
    donvidientich: DefaultValue.Empty,
    giatrungdaugia: DefaultValue.Empty,
    idgiayphep: DefaultValue.Empty,
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
      tenkhuvucdaugia: {required: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.capphepdaugiaquyenkhaithac.tenkhuvucdaugiaRequired},
      diadiem: {required: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.capphepdaugiaquyenkhaithac.diadiemRequired},
      tenloaikhoangsan: {required: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.capphepdaugiaquyenkhaithac.tenloaikhoangsanRequired},
      dientich: {
        required: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.capphepdaugiaquyenkhaithac.tenloaikhoangsanRequired,
        pattern: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.capphepdaugiaquyenkhaithac.numberRequired
      },
      donvidientich: {required: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.capphepdaugiaquyenkhaithac.tenloaikhoangsanRequired},
      giatrungdaugia: {
        required: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.capphepdaugiaquyenkhaithac.giatritrungdaugiaRequired,
        pattern: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.capphepdaugiaquyenkhaithac.numberRequired
      },
      hequychieu: {required: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.capphepdaugiaquyenkhaithac.hequychieuRequired},
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
      this.dauGiaKhaiThac = await this.getCapPhepDauGiaByIdGiayPhep(this.idgiayphep);

      if (this.dauGiaKhaiThac) {
        this.currentAction = CapPhepDauGiaKhaiThacActionEnum.Edit;
        this.selectIdCapPhepKhaiThac();
        this.selectCurrentFormState();
        this.selectHeQuyChieu();
        this.setFormTitle();
      } else {
        this.currentAction = CapPhepDauGiaKhaiThacActionEnum.Add;
        this.selectCurrentFormState();
        this.setFormTitle();
      }
    } else {
      this.currentAction = CapPhepDauGiaKhaiThacActionEnum.None;
      return;
    }

    // Lấy dữ liệu hệ quy chiếu
    await this.geAllHeQuyChieu();
    // Khởi tạo dữ liệu form trong trường hợp sửa dữ liệu Hồ Sơ
    await this.formOnEdit(this.dauGiaKhaiThac);

    return true;
  }

  /**
   * set form title
   */
  private setFormTitle() {
    if (this.currentAction === CapPhepDauGiaKhaiThacActionEnum.Edit) {
      switch (this.itemGiayPhep.loaicapphep) {
        case LoaiCapPhepEnum.DauGiaQuyenKhaiThacKhoangSanKhuVucChuaThamDo:
          this.title = this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.capphepdaugiaquyenkhaithac.titleEditChuaThamDo;
          break;
        case LoaiCapPhepEnum.DauGiaQuyenKhaiThacKhoangSanKhuVucDaThamDo:
          this.title = this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.capphepdaugiaquyenkhaithac.titleEditDaThamDo;
          break;
        default:
          this.title = DefaultValue.Empty;
          break;
      }
    } else if (this.currentAction === CapPhepDauGiaKhaiThacActionEnum.Add) {
      switch (this.itemGiayPhep.loaicapphep) {
        case LoaiCapPhepEnum.DauGiaQuyenKhaiThacKhoangSanKhuVucChuaThamDo:
          this.title = this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.capphepdaugiaquyenkhaithac.titleAddChuaThamDo;
          break;
        case LoaiCapPhepEnum.DauGiaQuyenKhaiThacKhoangSanKhuVucDaThamDo:
          this.title = this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.capphepdaugiaquyenkhaithac.titleAddDaThamDo;
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
      tenkhuvucdaugia: [DefaultValue.Empty, Validators.required],
      diadiem: [DefaultValue.Empty, Validators.required],
      tenloaikhoangsan: [DefaultValue.Empty, Validators.required],
      dientich: [DefaultValue.Empty, [Validators.required, Validators.pattern("^[0-9]+\\.{0,1}\\d{0,2}$")]],
      donvidientich: [DefaultValue.Empty, Validators.required],
      giatrungdaugia: [DefaultValue.Empty, [Validators.required, Validators.pattern("^[0-9]+\\.{0,1}\\d{0,2}$")]],
      hequychieu: [DefaultValue.Empty, Validators.required],
    });
  }

  /**
   * hàm set value cho form
   */
  private async formOnEdit(item: OutputCpDauGiaKhaiThacModel) {
    if (this.currentAction === CapPhepDauGiaKhaiThacActionEnum.Edit && item) {
      this.capPhepKhaiThacIOForm.setValue({
        diadiem: item.diadiem,
        tenkhuvucdaugia: item.tenkhuvucdaugia,
        tenloaikhoangsan: item.tenloaikhoangsan,
        dientich: item.dientich,
        donvidientich: item.donvidientich,
        giatrungdaugia: item.giatrungdaugia,
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
  private async getCapPhepDauGiaByIdGiayPhep(idGiayPhep: string) {
    const cpDauGiaKhaiThacService = this.capPhepHoatDongKhoangSanFacadeService.getCapPhepDauGiaService();
    const dangKyItem = await cpDauGiaKhaiThacService.getCapPhepDauGiaByIdGiayPhep(idGiayPhep).toPromise() as OutputCpDauGiaKhaiThacModel;
    return dangKyItem;
  }

  /**
   * lấy thông tin id hồ sơ sau khi thêm mới một hồ sơ
   */
  private selectIdCapPhepKhaiThac() {
    this.selectIdCapPhepDauGiaEvent.emit(this.dauGiaKhaiThac.idcapphepdaugia);
  }

  /**
   * select inserted state of form
   */
  private selectCurrentFormState() {
    if (this.currentAction === CapPhepDauGiaKhaiThacActionEnum.Edit) {
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
    const dkDauGiaKhaiThacService = this.capPhepHoatDongKhoangSanFacadeService.getCapPhepDauGiaService();
    const inputModel = this.capPhepKhaiThacIOForm.value;
    inputModel.idgiayphep = this.idgiayphep;
    if (this.currentAction === CapPhepDauGiaKhaiThacActionEnum.Add) {
      dkDauGiaKhaiThacService.addItem(inputModel).subscribe(
        async (res) => {
          this.dauGiaKhaiThac = inputModel;
          this.dauGiaKhaiThac.idcapphepdaugia = res.idcapphepdaugia;
          this.currentAction = CapPhepDauGiaKhaiThacActionEnum.Edit;
          this.selectCurrentFormState();
          this.setFormTitle();
          this.selectIdCapPhepKhaiThac();
          this.showViewOfHeQuyChieu(this.dauGiaKhaiThac);
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
    } else if (this.currentAction === CapPhepDauGiaKhaiThacActionEnum.Edit) {
      inputModel.idcapphepdaugia = this.dauGiaKhaiThac.idcapphepdaugia;
      dkDauGiaKhaiThacService.updateItem(inputModel).subscribe(
        async (res) => {
          this.dauGiaKhaiThac = inputModel;
          this.currentAction = CapPhepDauGiaKhaiThacActionEnum.Edit;
          this.selectCurrentFormState();
          this.setFormTitle();
          this.showViewOfHeQuyChieu(this.dauGiaKhaiThac);
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
          .getCapPhepDauGiaService()
          .deleteCapPhepDauGiaByIdGiayPhep(this.idgiayphep)
          .subscribe(
            () => {
              this.dauGiaKhaiThac = null;
              this.currentAction = CapPhepDauGiaKhaiThacActionEnum.Add;
              this.onFormReset();
              this.selectCurrentFormState();
              this.setFormTitle();
              this.showViewOfHeQuyChieu(this.dauGiaKhaiThac);
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
    this.capPhepKhaiThacIOForm.reset();
    this.disabledHeQuyChieu = false;
    this.capPhepKhaiThacIOForm.controls.donvidientich.setValue(DefaultValue.Empty);
    this.capPhepKhaiThacIOForm.controls.donvithoihan.setValue(DefaultValue.Empty);
    this.capPhepKhaiThacIOForm.controls.donvichieusau.setValue(DefaultValue.Empty);
    this.capPhepKhaiThacIOForm.controls.hequychieu.setValue(DefaultValue.Empty);
  }

  /**
   * lấy thông tin hệ quy chiếu
   */
  private selectHeQuyChieu() {
    if (this.dauGiaKhaiThac) {
      this.selectHeQuyChieuEvent.emit(this.dauGiaKhaiThac.hequychieu);
    } else {
      this.selectHeQuyChieuEvent.emit(DefaultValue.Empty);
    }
  }

  private showViewOfHeQuyChieu(item: OutputCpDauGiaKhaiThacModel) {
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


}
