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
  DonViCongSuat,
  DonViDienTich,
  DonViDoSau,
  DonViThoiHan,
  DonViTruLuong,
  PhuongPhapKhaiThac
} from 'src/app/shared/constants/common-constants';
import {OutputDkKhaiThacKhoangSanDuAnModel} from "src/app/models/admin/dangkyhoatdongkhoangsan/dangkykhaithac/dkkhaithackhoangsanduan.model";
import {DefaultValue} from "src/app/shared/constants/global-var";


@Component({
  selector: 'app-dangkykhaithackhoangsanduan-io',
  templateUrl: './dangkykhaithackhoangsanduan-io.component.html',
  styleUrls: ['./dangkykhaithackhoangsanduan-io.component.scss']
})
export class DangkykhaithackhoangsanduanIoComponent implements OnInit {


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
  public dangKyKhaiThacKhoangSanDuAnIOForm: FormGroup;
  // Chứa dữ liệu translate
  public dataTranslate: any;
  // Chứa danh sách Hệ quy chiếu
  public allHeQuyChieu: OutputDmHeQuyChieuModel[];
  public HeQuyChieuFilters: OutputDmHeQuyChieuModel[];
  // chứa dữ liệu Id Hồ sơ
  public idhoso: string;
  // chứa dữ liệu đăng ký thăm dò
  private dangKyKhaiThacKhoangSanDuAn: any;
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

  // Chứa phương pháp khai thác
  public phuongPhapKhaiThac = PhuongPhapKhaiThac;

  // form errors
  formErrors = {
    tenduan: DefaultValue.Empty,
    soquyetdinh: DefaultValue.Empty,
    ngaykyquyetdinh: DefaultValue.Empty,
    coquanpheduyet: DefaultValue.Empty,
    diadiem: DefaultValue.Empty,
    dientichkhaithac: DefaultValue.Empty,
    truluongdiachat: DefaultValue.Empty,
    truluongkhaithac: DefaultValue.Empty,
    thoihankhaithac: DefaultValue.Empty,
    phuongphapkhaithac: DefaultValue.Empty,
    congsuatkhaithac: DefaultValue.Empty,
    mucsaukhaithactu: DefaultValue.Empty,
    mucsaukhaithacden: DefaultValue.Empty,
    mucdichsudungkhoangsan: DefaultValue.Empty,
    donvitruluong: DefaultValue.Empty,
    donvicongsuat: DefaultValue.Empty,
    donvidientich: DefaultValue.Empty,
    donvithoihan: DefaultValue.Empty,
    donvichieusau: DefaultValue.Empty,
    hequychieu: DefaultValue.Empty
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
      this.dangKyKhaiThacKhoangSanDuAn = await this.getDangKyKhaiThacKhoangSanDuAnByIdHoSo(this.idhoso);

      if (this.dangKyKhaiThacKhoangSanDuAn) {
        this.selectGeometryEvent.emit(this.dangKyKhaiThacKhoangSanDuAn.geowgs);
        this.currentAction = DangKyKhaiThacKsActionEnum.Edit;
        this.selectIddangKyKhaiThacKhoangSanDuAn();
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
    await this.formOnEdit(this.dangKyKhaiThacKhoangSanDuAn);

    return true;
  }

  /**
   * Hàm khởi tạo form
   */
  private formInit() {
    this.dangKyKhaiThacKhoangSanDuAnIOForm = this.formBuilder.group({
      tenduan: [DefaultValue.Empty, Validators.required],
      soquyetdinh: [DefaultValue.Empty, Validators.required],
      ngaykyquyetdinh: [DefaultValue.Empty],
      coquanpheduyet: [DefaultValue.Empty, Validators.required],
      diadiem: [DefaultValue.Empty, Validators.required],
      dientichkhaithac: [DefaultValue.Empty, [Validators.required, Validators.pattern("^[0-9-+]+$")]],
      truluongdiachat: [DefaultValue.Empty, [Validators.required, Validators.pattern("^[0-9-+]+$")]],
      truluongkhaithac: [DefaultValue.Empty, [Validators.required, Validators.pattern("^[0-9-+]+$")]],
      thoihankhaithac: [DefaultValue.Empty, [Validators.required, Validators.pattern("^[0-9-+]+$")]],
      phuongphapkhaithac: [DefaultValue.Empty, Validators.required],
      congsuatkhaithac: [DefaultValue.Empty, [Validators.required, Validators.pattern("^[0-9-+]+$")]],
      mucsaukhaithactu: [DefaultValue.Empty, Validators.pattern("^[0-9-+]+$")],
      mucsaukhaithacden: [DefaultValue.Empty, Validators.pattern("^[0-9-+]+$")],
      mucdichsudungkhoangsan: [DefaultValue.Empty],
      donvitruluong: [DefaultValue.Empty, Validators.required],
      donvicongsuat: [DefaultValue.Empty, Validators.required],
      donvidientich: [DefaultValue.Empty, Validators.required],
      donvithoihan: [DefaultValue.Empty, Validators.required],
      donvichieusau: [DefaultValue.Empty],
      hequychieu: [DefaultValue.Empty, Validators.required],
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
  private async formOnEdit(item: OutputDkKhaiThacKhoangSanDuAnModel) {
    if (this.currentAction === DangKyKhaiThacKsActionEnum.Edit && item) {
      this.dangKyKhaiThacKhoangSanDuAnIOForm.setValue({
        tenduan: item.tenduan,
        soquyetdinh: item.soquyetdinh,
        ngaykyquyetdinh: item.ngaykyquyetdinh,
        coquanpheduyet: item.coquanpheduyet,
        diadiem: item.diadiem,
        dientichkhaithac: item.dientichkhaithac,
        truluongdiachat: item.truluongdiachat,
        truluongkhaithac: item.truluongkhaithac,
        thoihankhaithac: item.thoihankhaithac,
        phuongphapkhaithac: item.phuongphapkhaithac,
        congsuatkhaithac: item.congsuatkhaithac,
        mucsaukhaithactu: item.mucsaukhaithactu,
        mucsaukhaithacden: item.mucsaukhaithacden,
        mucdichsudungkhoangsan: item.mucdichsudungkhoangsan,
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
      tenduan: {required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkykhaithackhoangsanduan.tenduanRequired},
      soquyetdinh: {required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkykhaithackhoangsanduan.soquyetdinhRequired},
      coquanpheduyet: {required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkykhaithackhoangsanduan.coquanpheduyetRequired},
      diadiem: {required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkykhaithackhoangsanduan.diadiemRequired},
      dientichkhaithac: {
        required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkykhaithackhoangsanduan.dientichkhaithacRequired,
        pattern: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkykhaithackhoangsanduan.numberRequired
      },
      truluongdiachat: {
        required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkykhaithackhoangsanduan.truluongdiachatRequired,
        pattern: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkykhaithackhoangsanduan.numberRequired
      },
      truluongkhaithac: {
        required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkykhaithackhoangsanduan.truluongkhaithacRequired,
        pattern: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkykhaithackhoangsanduan.numberRequired
      },
      thoihankhaithac: {
        required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkykhaithackhoangsanduan.thoihankhaithacRequired,
        pattern: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkykhaithackhoangsanduan.numberRequired
      },
      phuongphapkhaithac: {
        required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkykhaithackhoangsanduan.phuongphapkhaithacRequired,
      },
      congsuatkhaithac: {
        required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkykhaithackhoangsanduan.congsuatkhaithacRequired,
        pattern: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkykhaithackhoangsanduan.numberRequired
      },
      mucsaukhaithactu: {
        pattern: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkykhaithackhoangsanduan.numberRequired
      },
      mucsaukhaithacden: {
        pattern: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkykhaithackhoangsanduan.numberRequired
      },
      donvitruluong: {required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkykhaithackhoangsanduan.donvitruluongRequired},
      donvicongsuat: {required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkykhaithackhoangsanduan.donvicongsuatRequired},
      donvidientich: {required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkykhaithackhoangsanduan.donvidientichRequired},
      donvithoihan: {required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkykhaithackhoangsanduan.donvithoihanRequired},
      hequychieu: {required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkykhaithackhoangsanduan.hequychieuRequired},
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
  private async getDangKyKhaiThacKhoangSanDuAnByIdHoSo(idHoSo: string) {
    const dkKhaiThacKhoangSanDuAnService = this.dangKyHoatDongKhoangSanFacadeService.getDangKyKhaiThacKhoangSanDuAnService();
    const dangKyItem = await dkKhaiThacKhoangSanDuAnService.getFetchAll({Idhoso: idHoSo});
    return dangKyItem;
  }

  async saveItemdangKyKhaiThacKhoangSanDuAn() {
    this.logAllValidationErrorMessages();

    if (!this.dangKyKhaiThacKhoangSanDuAnIOForm.valid) {
      return;
    }

    // Gán dữ liệu input vào model
    const dkKhaiThacKhoangSanDuAnService = this.dangKyHoatDongKhoangSanFacadeService.getDangKyKhaiThacKhoangSanDuAnService();
    const inputModel = this.dangKyKhaiThacKhoangSanDuAnIOForm.value;
    inputModel.idhoso = this.idhoso;
    if (this.currentAction === DangKyKhaiThacKsActionEnum.Add) {
      dkKhaiThacKhoangSanDuAnService.addItem(inputModel).subscribe(
        async (res) => {
          this.dangKyKhaiThacKhoangSanDuAn = inputModel;
          this.dangKyKhaiThacKhoangSanDuAn.iddangkykhaithac = res.iddangkykhaithac;
          this.currentAction = DangKyKhaiThacKsActionEnum.Edit;
          this.selectCurrentFormState();
          this.selectIddangKyKhaiThacKhoangSanDuAn();
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
      inputModel.iddangkykhaithac = this.dangKyKhaiThacKhoangSanDuAn.iddangkykhaithac;
      dkKhaiThacKhoangSanDuAnService.updateItem(inputModel).subscribe(
        async (res) => {
          this.dangKyKhaiThacKhoangSanDuAn = inputModel;
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
      this.dangKyKhaiThacKhoangSanDuAnIOForm,
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
  private selectIddangKyKhaiThacKhoangSanDuAn() {
    this.selectIdDangKyKhaiThacKhoangSanEvent.emit(this.dangKyKhaiThacKhoangSanDuAn.iddangkykhaithac);
  }

  /**
   *
   */
  deleteItemdangKyKhaiThacKhoangSanDuAn() {
    const dialogRef = this.commonService.confirmDeleteDiaLogService(
      "",
      ""
    );
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === "confirm") {
        await this.dangKyHoatDongKhoangSanFacadeService
          .getDangKyKhaiThacKhoangSanDuAnService()
          .deleteItem({iddangkykhaithac: this.dangKyKhaiThacKhoangSanDuAn.iddangkykhaithac})
          .subscribe(
            () => {
              this.dangKyKhaiThacKhoangSanDuAn = null;
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
    this.dangKyKhaiThacKhoangSanDuAnIOForm.reset({
      tenduan: DefaultValue.Empty,
      soquyetdinh: DefaultValue.Empty,
      ngaykyquyetdinh: DefaultValue.Empty,
      coquanpheduyet: DefaultValue.Empty,
      diadiem: DefaultValue.Empty,
      dientichkhaithac: DefaultValue.Empty,
      truluongdiachat: DefaultValue.Empty,
      truluongkhaithac: DefaultValue.Empty,
      thoihankhaithac: DefaultValue.Empty,
      phuongphapkhaithac: DefaultValue.Empty,
      congsuatkhaithac: DefaultValue.Empty,
      mucsaukhaithactu: DefaultValue.Empty,
      mucsaukhaithacden: DefaultValue.Empty,
      mucdichsudungkhoangsan: DefaultValue.Empty,
      donvitruluong: DefaultValue.Empty,
      donvicongsuat: DefaultValue.Empty,
      donvidientich: DefaultValue.Empty,
      donvithoihan: DefaultValue.Empty,
      donvichieusau: DefaultValue.Empty,
      hequychieu: DefaultValue.Empty
    });
  }


}
