import { Component, OnInit, Input, ComponentFactoryResolver, EventEmitter, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { DmFacadeService } from "src/app/services/admin/danhmuc/danhmuc-facade.service";
import { DangKyHoatDongKhoangSanFacadeService } from 'src/app/services/admin/dangkyhoatdongkhoangsan/dangkyhoatdongkhoangsan-facade.service';
import { DangKyKhaiThacKsActionEnum } from 'src/app/shared/constants/enum';
import { CommonServiceShared } from 'src/app/services/utilities/common-service';
import { validationAllErrorMessagesService } from "src/app/services/utilities/validatorService";
import { OutputDmHeQuyChieuModel } from 'src/app/models/admin/danhmuc/hequychieu.model';
import { DangKhoangSan, DonViCongSuat, DonViDienTich, DonViDoSau, DonViThoiHan, DonViTruLuong, PhuongPhapKhaiThac } from 'src/app/shared/constants/common-constants';
import { OutputDkKhaiThacKhoangSanModel } from "src/app/models/admin/dangkyhoatdongkhoangsan/dkkhaithackhoangsan.model";

@Component({
  selector: 'app-dangkykhaithackhoangsan-io',
  templateUrl: './dangkykhaithackhoangsan-io.component.html',
  styleUrls: ['./dangkykhaithackhoangsan-io.component.scss']
})
export class DangkykhaithackhoangsanIoComponent implements OnInit {

  // tslint:disable-next-line: no-output-rename
  @Output("selectCurrentFormStateEvent") selectCurrentFormStateEvent: EventEmitter<number> = new EventEmitter();
  // tslint:disable-next-line: no-output-rename
  @Output("selectIdDangKyKhaiThacKhoangSanEvent") selectIdDangKyKhaiThacKhoangSanEvent: EventEmitter<string> = new EventEmitter();
  // tslint:disable-next-line: no-input-rename
  @Input("allowAutoInit") allowAutoInit = true;
  // Nhóm loại cấp phép
  // tslint:disable-next-line: no-input-rename
  @Input("nhomLoaiCapPhep") nhomLoaiCapPhep;
  // Chứa dữ liệu Form
  public dangKyKhaiThacKSIOForm: FormGroup;
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
  private dangKyKhaiThacKhoangSan: any;
  // Action thao tác dữ liệu
  public currentAction: number;
  // Action đăng ký thăm dò
  public ActionType = DangKyKhaiThacKsActionEnum;
  // Chứa phương pháp khai thác
  public phuongPhapKhaiThac = PhuongPhapKhaiThac;
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
    diadiem: "",
    dientichkhaithac: "",
    truluongdiachat: "",
    truluongkhaithac: "",
    thoihankhaithac: "",
    thoigianxaydungmo: "",
    phuongphapkhaithac: "",
    congsuatkhaithac: "",
    mucsaukhaithactu: "",
    mucsaukhaithacden: "",
    mucdichsudungkhoangsan: "",
    donvitruluong: "",
    donvicongsuat: "",
    donvidientich: "",
    donvithoihan: "",
    donvithoihanxaymo: "",
    donvichieusau: "",
    hequychieu: "",
  };

  constructor(
    private translate: TranslateService,
    private formBuilder: FormBuilder,
    private dmFacadeService: DmFacadeService,
    private dangKyHoatDongKhoangSanFacadeService: DangKyHoatDongKhoangSanFacadeService,
    public commonService: CommonServiceShared,
    private activatedRoute: ActivatedRoute,
    public cfr: ComponentFactoryResolver
  ) { }

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
      this.dangKyKhaiThacKhoangSan = await this.getDangKyKhaiThacKsByIdHoSo(this.idhoso);

      if (this.dangKyKhaiThacKhoangSan) {
        this.currentAction = DangKyKhaiThacKsActionEnum.Edit;
        this.selectIdDangKyKhaiThacKhoangSan();
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
    await this.formOnEdit(this.dangKyKhaiThacKhoangSan);

    return true;
  }

  /**
   * Hàm khởi tạo form
   */
  private formInit() {
    this.dangKyKhaiThacKSIOForm = this.formBuilder.group({
      diadiem: ["", Validators.required],
      dientichkhaithac: [""],
      truluongdiachat: [""],
      truluongkhaithac: [""],
      thoihankhaithac: [""],
      thoigianxaydungmo: [""],
      phuongphapkhaithac: [""],
      congsuatkhaithac: [""],
      mucsaukhaithactu: [""],
      mucsaukhaithacden: [""],
      donvitruluong: [""],
      donvicongsuat: [""],
      donvithoihanxaymo: [""],
      mucdichsudungkhoangsan: ["", Validators.required],
      donvidientich: ["", Validators.required],
      donvithoihan: ["", Validators.required],
      donvichieusau: ["", Validators.required],
      hequychieu: ["", Validators.required]
    });
  }

  /**
   * Hàm lấy dữ liệu translate
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
   * Hàm set value cho form
   */
  private async formOnEdit(item: OutputDkKhaiThacKhoangSanModel) {
    if (this.currentAction === DangKyKhaiThacKsActionEnum.Edit && item) {
      this.dangKyKhaiThacKSIOForm.setValue({
        diadiem: item.diadiem,
        dientichkhaithac: item.dientichkhaithac,
        truluongdiachat: item.truluongdiachat,
        truluongkhaithac: item.truluongkhaithac,
        thoihankhaithac: item.thoihankhaithac,
        thoigianxaydungmo: item.thoigianxaydungmo,
        phuongphapkhaithac: item.phuongphapkhaithac,
        congsuatkhaithac: item.congsuatkhaithac,
        mucsaukhaithactu: item.mucsaukhaithactu,
        mucsaukhaithacden: item.mucsaukhaithacden,
        donvitruluong: item.donvitruluong,
        donvicongsuat: item.donvicongsuat,
        donvithoihanxaymo: item.donvithoihanxaymo,
        mucdichsudungkhoangsan: item.mucdichsudungkhoangsan,
        dangkhoangsan: item.dangkhoangsan,
        donvidientich: item.donvidientich,
        donvithoihan: item.donvithoihan,
        donvichieusau: item.donvichieusau,
        hequychieu: item.hequychieu
      });
    }
  }

  /**
   * Hàm set validate
   */
  private setValidation() {
    this.validationErrorMessages = {
      diadiem: { required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkykhaithackhoangsan.diadiemRequired },
      dientichthamdo: { required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkykhaithackhoangsan.dientichthamdoRequired, pattern: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkykhaithackhoangsan.dientichthamdoFormat },
      chieusauthamdotu: { required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkykhaithackhoangsan.chieusauthamdotuRequired, pattern: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkykhaithackhoangsan.chieusauthamdotuFormat },
      chieusauthamdoden: { required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkykhaithackhoangsan.chieusauthamdodenRequired, pattern: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkykhaithackhoangsan.chieusauthamdodenFormat },
      thoihanthamdo: { required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkykhaithackhoangsan.thoihanthamdoRequired, pattern: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkykhaithackhoangsan.thoihanthamdoFormat },
      mucdichsudungkhoangsan: { required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkykhaithackhoangsan.mucdichsudungkhoangsanRequired },
      donvidientich: { required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkykhaithackhoangsan.donvidientichRequired },
      donvithoihan: { required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkykhaithackhoangsan.donvithoihanRequired },
      donvichieusau: { required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkykhaithackhoangsan.donvichieusauRequired },
      hequychieu: { required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkykhaithackhoangsan.hequychieuRequired },
    };
  }

  /**
   * Hàm lấy danh sách Lĩnh Vực
   */
  async geAllHeQuyChieu() {
    const allHeQuyChieuData: any = await this.dmFacadeService
      .getDmHeQuyChieuService()
      .getFetchAll({ PageNumber: 1, PageSize: -1 });
    this.allHeQuyChieu = allHeQuyChieuData.items;
    this.HeQuyChieuFilters = allHeQuyChieuData.items;
  }

  /**
   * Lấy dữ liệu hồ sơ theo IdHoSo
   * @param idHoSo
   */
  private async getDangKyKhaiThacKsByIdHoSo(idHoSo: string) {
    const dkKhaiThacKhoangSanService = this.dangKyHoatDongKhoangSanFacadeService.getDangKyKhaiThacKhoangSanService();
    const dangKyItem = await dkKhaiThacKhoangSanService.getFetchAll({Idhoso: idHoSo});
    return dangKyItem;
  }

  /**
   * Lưu dữ liệu đăng ký khai thác khoáng sản
   */
  async saveItemDangKyKhaiThacKhoangSan() {
    this.logAllValidationErrorMessages();

    if (!this.dangKyKhaiThacKSIOForm.valid) {
      return;
    }

    // Gán dữ liệu input vào model
    const dkKhaiThacKhoangSanService = this.dangKyHoatDongKhoangSanFacadeService.getDangKyKhaiThacKhoangSanService();
    const inputModel = this.dangKyKhaiThacKSIOForm.value;
    inputModel.idhoso = this.idhoso;
    if (this.currentAction === DangKyKhaiThacKsActionEnum.Add) {
      dkKhaiThacKhoangSanService.addItem(inputModel).subscribe(
        async (res) => {
          this.dangKyKhaiThacKhoangSan = inputModel;
          this.dangKyKhaiThacKhoangSan.iddangkykhaithac = res.iddangkykhaithac;
          this.currentAction = DangKyKhaiThacKsActionEnum.Edit;
          this.selectCurrentFormState();
          this.selectIdDangKyKhaiThacKhoangSan();
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
      inputModel.iddangkykhaithac = this.dangKyKhaiThacKhoangSan.iddangkykhaithac;
      dkKhaiThacKhoangSanService.updateItem(inputModel).subscribe(
        async (res) => {
          this.dangKyKhaiThacKhoangSan = inputModel;
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
   * Hàm kiểm tra validation form
   */
  private logAllValidationErrorMessages() {
    validationAllErrorMessagesService(
      this.dangKyKhaiThacKSIOForm,
      this.validationErrorMessages,
      this.formErrors
    );
  }

  /**
   * Select inserted state of form
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
   * Lấy thông tin id hồ sơ sau khi thêm mới một hồ sơ
   */
  private selectIdDangKyKhaiThacKhoangSan() {
    this.selectIdDangKyKhaiThacKhoangSanEvent.emit(this.dangKyKhaiThacKhoangSan.iddangkykhaithac);
  }

  /**
   * Xóa item đăng ký khai thác khoáng sản
   */
  deleteItemDangKyKhaiThacKhoangSan() {
    const dialogRef = this.commonService.confirmDeleteDiaLogService(
      this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkykhaithackhoangsan.contentDelete,
      this.dangKyKhaiThacKhoangSan.diadiem
    );
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === "confirm") {
        await this.dangKyHoatDongKhoangSanFacadeService
          .getDangKyKhaiThacKhoangSanService()
          .deleteItem({iddangkykhaithac: this.dangKyKhaiThacKhoangSan.iddangkykhaithac})
          .subscribe(
            () => {
              this.dangKyKhaiThacKhoangSan = null;
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
    this.dangKyKhaiThacKSIOForm.reset();
  }
}
