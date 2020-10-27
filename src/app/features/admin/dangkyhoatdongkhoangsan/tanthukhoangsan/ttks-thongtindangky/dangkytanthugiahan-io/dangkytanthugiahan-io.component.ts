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
import {OutputDkTanThuGiaHanModel} from "src/app/models/admin/dangkyhoatdongkhoangsan/dangkytanthu/dktanthugiahan.model";
import {GiayphepOptionComponent} from "src/app/features/admin/hosogiayto/giayphep/giayphep-option/giayphep-option.component";
import {MatsidenavService} from "src/app/services/utilities/matsidenav.service";
import {MatSidenav} from "@angular/material/sidenav";
import {OutputGiayPhepModel} from "src/app/models/admin/hosogiayto/giayphep.model";
import {DefaultValue} from "src/app/shared/constants/global-var";


@Component({
  selector: 'app-dangkytanthugiahan-io',
  templateUrl: './dangkytanthugiahan-io.component.html',
  styleUrls: ['./dangkytanthugiahan-io.component.scss']
})
export class DangkytanthugiahanIoComponent implements OnInit {

  @ViewChild(Type, {static: true}) public matSidenav: MatSidenav;
  @ViewChild(Type, {read: ViewContainerRef, static: true}) public content: ViewContainerRef;

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
    truluongconlai: DefaultValue.Empty,
    thoihankhaithac: DefaultValue.Empty,
    giahandenngay: DefaultValue.Empty,
    donvitruluong: DefaultValue.Empty,
    donvithoihan: DefaultValue.Empty,
    lydogiahan: DefaultValue.Empty,
    idhoso: DefaultValue.Empty,
    idgiayphep: DefaultValue.Empty,
    sogiayphep: DefaultValue.Empty,
  };

  constructor(
    private translate: TranslateService,
    private formBuilder: FormBuilder,
    private dmFacadeService: DmFacadeService,
    private dangKyHoatDongKhoangSanFacadeService: DangKyHoatDongKhoangSanFacadeService,
    public commonService: CommonServiceShared,
    private activatedRoute: ActivatedRoute,
    public cfr: ComponentFactoryResolver,
    public matSidenavService: MatsidenavService
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
   * Mở sidenav giấy phép
   */
  openGiayPhepIOSidenav() {
    // clear Sidenav
    this.matSidenavService.clearSidenav();
    // Khởi tạo sidenav
    this.matSidenavService.setSidenav(this.matSidenav, this, this.content, this.cfr);
    this.matSidenavService.setTitle(this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkykhaithacdieuchinh.titleGiayPhepSelect);
    this.matSidenavService.setContentComp(GiayphepOptionComponent, "select");
    this.matSidenavService.open();
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
      truluongconlai: [DefaultValue.Empty, [Validators.required, Validators.pattern("^[0-9-+]+$")]],
      thoihankhaithac: [DefaultValue.Empty, [Validators.required, Validators.pattern("^[0-9-+]+$")]],
      giahandenngay: [DefaultValue.Empty, Validators.required],
      donvitruluong: [DefaultValue.Empty, Validators.required],
      donvithoihan: [DefaultValue.Empty, Validators.required],
      lydogiahan: [DefaultValue.Empty],
      idhoso: [DefaultValue.Empty],
      idgiayphep: [DefaultValue.Empty],
      sogiayphep: [DefaultValue.Empty]
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
        sogiayphep: item.sogiayphep
      });
    }
  }

  /**
   * Hàm set validate
   */
  private setValidation() {
    this.validationErrorMessages = {
      truluongconlai: {
        required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkytanthugiahan.truluongconlaiRequired,
        pattern: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkytanthugiahan.numberRequired
      },
      thoihankhaithac: {
        required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkytanthugiahan.thoihankhaithacRequired,
        pattern: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkytanthugiahan.numberRequired
      },
      donvitruluong: {
        required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkytanthugiahan.donvitruluongRequired,
      },
      donvithoihan: {
        required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkytanthugiahan.donvithoihanRequired,
      },
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
  private async getdangKyTanThuGiaHanByIdHoSo(idHoSo: string) {
    const dkTanThuGiaHanService = this.dangKyHoatDongKhoangSanFacadeService.getDangKyTanThuGiaHanService();
    const dangKyItem = await dkTanThuGiaHanService.getFetchAll({Idhoso: idHoSo});
    return dangKyItem;
  }

  async saveItemdangKyTanThuGiaHan() {
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
  deleteItemdangKyTanThuGiaHan() {
    const dialogRef = this.commonService.confirmDeleteDiaLogService(
      this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkytanthugiahan.contentDelete,
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
      truluongconlai: DefaultValue.Empty,
      thoihankhaithac: DefaultValue.Empty,
      giahandenngay: DefaultValue.Empty,
      donvitruluong: DefaultValue.Empty,
      donvithoihan: DefaultValue.Empty,
      lydogiahan: DefaultValue.Empty,
      idhoso: DefaultValue.Empty,
      idgiayphep: DefaultValue.Empty,
    });
  }
  /**
   * lấy item dữ liệu đối tượng cá nhân từ popup
   */
  private async selectItemGiayPhep(item: OutputGiayPhepModel) {
    if (item !== null && item !== undefined) {
      this.dangKyTanThuGiaHanIOForm.controls.sogiayphep.setValue(item.sogiayphep);
      this.dangKyTanThuGiaHanIOForm.controls.idgiayphep.setValue(item.idgiayphep);
      const itemGiaHan: any = await this.fillItemGiaHan(item.idgiayphep);
      this.dangKyTanThuGiaHanIOForm.controls.truluongconlai.setValue(itemGiaHan.truluongconlai);
      this.dangKyTanThuGiaHanIOForm.controls.thoihankhaithac.setValue(itemGiaHan.thoihankhaithac);
      this.dangKyTanThuGiaHanIOForm.controls.giahandenngay.setValue(itemGiaHan.giahandenngay);
      this.dangKyTanThuGiaHanIOForm.controls.lydogiahan.setValue(itemGiaHan.lydogiahan);
    }
  }

  // Hàm dùng để gọi các hàm khác, truyền vào tên hàm cần thực thi
  doFunction(methodName, obj) {
    this[methodName](obj);
  }

  private async fillItemGiaHan(idGiayPhep: string) {
    const dkTanThuGiaHanService = this.dangKyHoatDongKhoangSanFacadeService.getDangKyTanThuGiaHanService();
    const itemGiaHan = await dkTanThuGiaHanService.getDangKyTanThuGiaHanByIdGiayPhep(idGiayPhep).toPromise();
    return itemGiaHan;
  }
}
