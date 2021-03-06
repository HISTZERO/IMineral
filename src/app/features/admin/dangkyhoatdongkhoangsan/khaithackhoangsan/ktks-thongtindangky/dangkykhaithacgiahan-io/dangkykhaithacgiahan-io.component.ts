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
import {ActivatedRoute} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpErrorResponse} from '@angular/common/http';
import {MatSidenav} from "@angular/material";

import {DmFacadeService} from "src/app/services/admin/danhmuc/danhmuc-facade.service";
import {DangKyHoatDongKhoangSanFacadeService} from 'src/app/services/admin/dangkyhoatdongkhoangsan/dangkyhoatdongkhoangsan-facade.service';
import {DangKyKhaiThacKsActionEnum} from 'src/app/shared/constants/enum';
import {CommonServiceShared} from 'src/app/services/utilities/common-service';
import {validationAllErrorMessagesService} from "src/app/services/utilities/validatorService";
import {OutputDmHeQuyChieuModel} from 'src/app/models/admin/danhmuc/hequychieu.model';
import {
  DangKhoangSan,
  DonViCongSuat,
  DonViDienTich,
  DonViDoSau,
  DonViThoiHan,
  DonViTruLuong
} from 'src/app/shared/constants/common-constants';
import {GiayphepOptionComponent} from "src/app/features/admin/hosogiayto/giayphep/giayphep-option/giayphep-option.component";
import {MatsidenavService} from "src/app/services/utilities/matsidenav.service";
import {OutputGiayPhepModel} from "src/app/models/admin/hosogiayto/giayphep.model";
import {OutputDkKhaiThacGiaHanModel} from "src/app/models/admin/dangkyhoatdongkhoangsan/dangkykhaithac/dkkhaithacgiahan.model";
import {DefaultValue} from "src/app/shared/constants/global-var";

@Component({
  selector: 'app-dangkykhaithacgiahan-io',
  templateUrl: './dangkykhaithacgiahan-io.component.html',
  styleUrls: ['./dangkykhaithacgiahan-io.component.scss']
})
export class DangkykhaithacgiahanIoComponent implements OnInit {

  @ViewChild(Type, {static: true}) public matSidenav: MatSidenav;
  @ViewChild(Type, {read: ViewContainerRef, static: true}) public content: ViewContainerRef;

  // tslint:disable-next-line: no-output-rename
  @Output("selectCurrentFormStateEvent") selectCurrentFormStateEvent: EventEmitter<number> = new EventEmitter();

  // tslint:disable-next-line: no-output-rename
  @Output("selectIdDangKyKhaiThacKhoangSanEvent") selectIdDangKyKhaiThacKhoangSanEvent: EventEmitter<string> = new EventEmitter();

  // tslint:disable-next-line: no-input-rename
  @Input("allowAutoInit") allowAutoInit = true;

  // Output geometry event
  @Output("selectGeometryEvent") selectGeometryEvent: EventEmitter<any> = new EventEmitter();

  // Nhóm loại cấp phép
  // tslint:disable-next-line: no-input-rename
  @Input("nhomLoaiCapPhep") nhomLoaiCapPhep;

  // Chứa dữ liệu Form
  public dangKyKhaiThacGiaHanIOForm: FormGroup;

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
  private dangKyKhaiThacGiaHan: any;

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

  // lưu dữ liệu đơn vị diện tích
  public donViDoSauList = DonViDoSau;

  // Chứa đơn vị công suất
  public donViCongSuat = DonViCongSuat;

  // error message
  validationErrorMessages = {};

  // form errors
  formErrors = {
    truluongdacapphep: DefaultValue.Empty,
    truluongkhaithac: DefaultValue.Empty,
    thoihankhaithac: DefaultValue.Empty,
    giahandenngay: DefaultValue.Empty,
    donvitruluong: DefaultValue.Empty,
    donvidientich: DefaultValue.Empty,
    donvithoihan: DefaultValue.Empty,
    lydogiahan: DefaultValue.Empty,
    hequychieu: DefaultValue.Empty,
    idgiayphep: DefaultValue.Empty,
    sogiayphep: DefaultValue.Empty
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
   * Khởi tạo form
   */
  async manualDataInit() {
    this.activatedRoute.queryParamMap.subscribe((param: any) => {
      if (param && param.params && param.params.idhoso) {
        this.idhoso = param.params.idhoso;
      }
    });

    if (this.idhoso !== null && this.idhoso !== undefined) {
      this.dangKyKhaiThacGiaHan = await this.getDangKyKhaiThacGiaHanByIdHoSo(this.idhoso);

      if (this.dangKyKhaiThacGiaHan) {
        this.selectGeometryEvent.emit(this.dangKyKhaiThacGiaHan.geowgs);
        this.currentAction = DangKyKhaiThacKsActionEnum.Edit;
        this.selectIddangKyKhaiThacGiaHan();
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
    await this.formOnEdit(this.dangKyKhaiThacGiaHan);

    return true;
  }

  /**
   * Hàm khởi tạo form
   */
  private formInit() {
    this.dangKyKhaiThacGiaHanIOForm = this.formBuilder.group({
      truluongdacapphep: [DefaultValue.Empty, [Validators.required, Validators.pattern("^[0-9-+]+$")]],
      truluongkhaithac: [DefaultValue.Empty, [Validators.required, Validators.pattern("^[0-9-+]+$")]],
      thoihankhaithac: [DefaultValue.Empty, [Validators.required, Validators.pattern("^[0-9-+]+$")]],
      giahandenngay: [DefaultValue.Empty, Validators.required],
      donvitruluong: [DefaultValue.Empty, Validators.required],
      lydogiahan: [DefaultValue.Empty],
      donvithoihan: [DefaultValue.Empty, Validators.required],
      hequychieu: [DefaultValue.Empty, Validators.required],
      idgiayphep: [DefaultValue.Empty, Validators.required],
      sogiayphep: [DefaultValue.Empty, Validators.required]
    });
    this.dangKyKhaiThacGiaHanIOForm.controls.sogiayphep.disable({onlySelf: true});
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
  private async formOnEdit(item: OutputDkKhaiThacGiaHanModel) {
    if (this.currentAction === DangKyKhaiThacKsActionEnum.Edit && item) {
      this.dangKyKhaiThacGiaHanIOForm.setValue({
        truluongdacapphep: item.truluongdacapphep,
        truluongkhaithac: item.truluongkhaithac,
        thoihankhaithac: item.thoihankhaithac,
        giahandenngay: item.giahandenngay,
        donvitruluong: item.donvitruluong,
        donvithoihan: item.donvithoihan,
        lydogiahan: item.lydogiahan,
        hequychieu: item.hequychieu,
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
      truluongdacapphep: {
        required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkykhaithacgiahan.truluongdacapphepRequired,
        pattern: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkykhaithacgiahan.numberRequired
      },
      truluongkhaithac: {
        required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkykhaithacgiahan.truluongkhaithacRequired,
        pattern: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkykhaithacgiahan.numberRequired
      },
      thoihankhaithac: {
        required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkykhaithacgiahan.thoihankhaithacRequired,
        pattern: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkykhaithacgiahan.numberRequired
      },
      giahandenngay: {required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkykhaithacgiahan.giahandenngayRequired},
      donvitruluong: {required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkykhaithacgiahan.donvitruluongRequired},
      donvithoihan: {required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkykhaithacgiahan.donvithoihanRequired},
      hequychieu: {required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkykhaithacgiahan.hequychieuRequired},
      idgiayphep: {required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkykhaithacgiahan.sogiayphepRequired},
      sogiayphep: {required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkykhaithacgiahan.sogiayphepRequired}
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
   * Lấy dữ liệu hồ sơ theo IdHoSo
   * @param idHoSo
   */
  private async getDangKyKhaiThacGiaHanByIdHoSo(idHoSo: string) {
    const dkKhaiThacGiaHanService = this.dangKyHoatDongKhoangSanFacadeService.getDangKyKhaiThacGiaHanService();
    const dangKyItem = await dkKhaiThacGiaHanService.getFetchAll({Idhoso: idHoSo});
    return dangKyItem;
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
   * Lấy dữ liệu hồ sơ theo idGiayPhep
   * @param idGiayPhep
   */
  private async cloneThongTinDangKyKhaiThacFromGiayPhepLS(idGiayPhep: string) {
    const khaiThacGiahanService = this.dangKyHoatDongKhoangSanFacadeService.getDangKyKhaiThacGiaHanService();
    const dkKhaiThacItem = await khaiThacGiahanService.cloneThongTinDangKyKhaiThacFromGiayPhepLS(idGiayPhep).toPromise();

    if (dkKhaiThacItem) {
      return dkKhaiThacItem as OutputDkKhaiThacGiaHanModel;
    }
    return null;
  }

  /**
   * lấy item dữ liệu đối tượng cá nhân từ popup
   */
  async selectItemGiayPhep(item: OutputGiayPhepModel) {
    if (item !== null && item !== undefined) {
      this.dangKyKhaiThacGiaHanIOForm.controls.sogiayphep.setValue(item.sogiayphep);
      this.dangKyKhaiThacGiaHanIOForm.controls.idgiayphep.setValue(item.idgiayphep);

      const data = await this.cloneThongTinDangKyKhaiThacFromGiayPhepLS(item.idgiayphep);

      if (data) {
        this.dangKyKhaiThacGiaHanIOForm.controls.truluongdacapphep.setValue(data.truluongdacapphep);
        this.dangKyKhaiThacGiaHanIOForm.controls.truluongkhaithac.setValue(data.truluongkhaithac);
        this.dangKyKhaiThacGiaHanIOForm.controls.thoihankhaithac.setValue(data.thoihankhaithac);
        this.dangKyKhaiThacGiaHanIOForm.controls.giahandenngay.setValue(data.giahandenngay);
        this.dangKyKhaiThacGiaHanIOForm.controls.donvitruluong.setValue(data.donvitruluong);
        this.dangKyKhaiThacGiaHanIOForm.controls.donvidientich.setValue(data.donvidientich);
        this.dangKyKhaiThacGiaHanIOForm.controls.donvithoihan.setValue(data.donvithoihan);
        this.dangKyKhaiThacGiaHanIOForm.controls.lydogiahan.setValue(data.lydogiahan);
        this.dangKyKhaiThacGiaHanIOForm.controls.hequychieu.setValue(data.hequychieu);
      }

    }
  }

  /**
   * Lưu dữ liệu đăng ký khai thác gia hạn
   */
  async saveItemdangKyKhaiThacGiaHan() {
    this.logAllValidationErrorMessages();

    if (!this.dangKyKhaiThacGiaHanIOForm.valid) {
      return;
    }

    // Gán dữ liệu input vào model
    const dkKhaiThacGiaHanService = this.dangKyHoatDongKhoangSanFacadeService.getDangKyKhaiThacGiaHanService();
    const inputModel = this.dangKyKhaiThacGiaHanIOForm.value;
    inputModel.idhoso = this.idhoso;
    if (this.currentAction === DangKyKhaiThacKsActionEnum.Add) {
      dkKhaiThacGiaHanService.addItem(inputModel).subscribe(
        async (res) => {
          this.dangKyKhaiThacGiaHan = inputModel;
          this.dangKyKhaiThacGiaHan.iddangkykhaithac = res.iddangkykhaithac;
          this.currentAction = DangKyKhaiThacKsActionEnum.Edit;
          this.selectCurrentFormState();
          this.selectIddangKyKhaiThacGiaHan();
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
      inputModel.iddangkykhaithac = this.dangKyKhaiThacGiaHan.iddangkykhaithac;
      dkKhaiThacGiaHanService.updateItem(inputModel).subscribe(
        async (res) => {
          this.dangKyKhaiThacGiaHan = inputModel;
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
      this.dangKyKhaiThacGiaHanIOForm,
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
  private selectIddangKyKhaiThacGiaHan() {
    this.selectIdDangKyKhaiThacKhoangSanEvent.emit(this.dangKyKhaiThacGiaHan.iddangkykhaithac);
  }

  /**
   *
   */
  deleteItemdangKyKhaiThacGiaHan() {
    const dialogRef = this.commonService.confirmDeleteDiaLogService(
      "",
      ""
    );
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === "confirm") {
        await this.dangKyHoatDongKhoangSanFacadeService
          .getDangKyKhaiThacGiaHanService()
          .deleteItem({iddangkykhaithac: this.dangKyKhaiThacGiaHan.iddangkykhaithac})
          .subscribe(
            () => {
              this.dangKyKhaiThacGiaHan = null;
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
    this.dangKyKhaiThacGiaHanIOForm.reset({
      truluongdacapphep: DefaultValue.Empty,
      truluongkhaithac: DefaultValue.Empty,
      thoihankhaithac: DefaultValue.Empty,
      giahandenngay: DefaultValue.Empty,
      donvitruluong: DefaultValue.Empty,
      donvidientich: DefaultValue.Empty,
      donvithoihan: DefaultValue.Empty,
      lydogiahan: DefaultValue.Empty,
      hequychieu: DefaultValue.Empty,
      idgiayphep: DefaultValue.Empty,
      sogiayphep: DefaultValue.Empty
    });
  }

  // Hàm dùng để gọi các hàm khác, truyền vào tên hàm cần thực thi
  doFunction(methodName, obj) {
    this[methodName](obj);
  }
}
