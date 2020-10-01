import { Component, OnInit, Input, ComponentFactoryResolver, EventEmitter, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { DmFacadeService } from "src/app/services/admin/danhmuc/danhmuc-facade.service";
import { DangKyHoatDongKhoangSanFacadeService } from 'src/app/services/admin/dangkyhoatdongkhoangsan/dangkyhoatdongkhoangsan-facade.service';
import { DangKhoangSanEnum, DangKyKhaiThacKsActionEnum } from 'src/app/shared/constants/enum';
import { CommonServiceShared } from 'src/app/services/utilities/common-service';
import { validationAllErrorMessagesService } from "src/app/services/utilities/validatorService";
import { OutputDmHeQuyChieuModel } from 'src/app/models/admin/danhmuc/hequychieu.model';
import {
  DangKhoangSan,
  DonViCongSuat,
  DonViDienTich,
  DonViDoSau,
  DonViThoiHan,
  DonViTruLuong
} from 'src/app/shared/constants/common-constants';
import { OutputDkKhaiThacVatLieuXayDungModel } from "src/app/models/admin/dangkyhoatdongkhoangsan/dkkhaithacvlxd.model";

@Component({
  selector: 'app-dangkykhaithacvlxd-io',
  templateUrl: './dangkykhaithacvlxd-io.component.html',
  styleUrls: ['./dangkykhaithacvlxd-io.component.scss']
})
export class DangkykhaithacvlxdIoComponent implements OnInit {


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
  public dangKyKhaiThacVLXDIOForm: FormGroup;
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
  private dangKyKhaiThacVLXD: any;
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
    tenduan: "",
    soquyetdinh: "",
    ngaykyquyetdinh: "",
    coquanpheduyet: "",
    dientichkhaithac: "",
    truluongkhaithac: "",
    congsuatkhaithac: "",
    mucsaukhaithactu: "",
    mucsaukhaithacden: "",
    khaithacdenngay: "",
    kehoachkhaithac: "",
    donvidientich: "",
    donvitruluong: "",
    donvicongsuat: "",
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
      this.dangKyKhaiThacVLXD = await this.getDangKyKhaiThacVLXDByIdHoSo(this.idhoso);

      if (this.dangKyKhaiThacVLXD) {
        this.currentAction = DangKyKhaiThacKsActionEnum.Edit;
        this.selectIddangKyKhaiThacVLXD();
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
    await this.formOnEdit(this.dangKyKhaiThacVLXD);

    return true;
  }

  /**
   * Hàm khởi tạo form
   */
  private formInit() {
    this.dangKyKhaiThacVLXDIOForm = this.formBuilder.group({
      tenduan: ["", Validators.required],
      soquyetdinh: ["", Validators.required],
      ngaykyquyetdinh: [""],
      coquanpheduyet: [""],
      dientichkhaithac: ["", Validators.required],
      khoiluongkhaithac: ["", Validators.required],
      congsuatkhaithac: ["", Validators.required],
      mucsaukhaithactu: [""],
      mucsaukhaithacden: [""],
      khaithacdenngay: [""],
      kehoachkhaithac: [""],
      donvidientich: ["", Validators.required],
      donvitruluong: ["", Validators.required],
      donvicongsuat: ["", Validators.required],
      donvichieusau: [""],
      hequychieu: [""],
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
  private async formOnEdit(item: OutputDkKhaiThacVatLieuXayDungModel) {
    if (this.currentAction === DangKyKhaiThacKsActionEnum.Edit && item) {
      this.dangKyKhaiThacVLXDIOForm.setValue({
        tenduan: item.tenduan,
        soquyetdinh: item.soquyetdinh,
        ngaykyquyetdinh: item.ngaykyquyetdinh,
        coquanpheduyet: item.coquanpheduyet,
        dientichkhaithac: item.dientichkhaithac,
        truluongkhaithac: item.truluongkhaithac,
        congsuatkhaithac: item.congsuatkhaithac,
        mucsaukhaithactu: item.mucsaukhaithactu,
        mucsaukhaithacden: item.mucsaukhaithacden,
        khaithacdenngay: item.khaithacdenngay,
        kehoachkhaithac: item.kehoachkhaithac,
        donvidientich: item.donvidientich,
        donvitruluong: item.donvitruluong,
        donvicongsuat: item.donvicongsuat,
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
      dientichkhaithac: { required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkykhaithacvlxd.dientichkhaithacRequired },
      khoiluongkhaithac: { required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkykhaithacvlxd.khoiluongkhaithacRequired },
      congsuatkhaithac: { required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkykhaithacvlxd.congsuatkhaithacRequired },
      donvidientich: { required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkykhaithacvlxd.donvidientichRequired },
      donvitruluong: { required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkykhaithacvlxd.donvitruluongRequired },
      donvicongsuat: { required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkykhaithacvlxd.donvicongsuatRequired },
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
  private async getDangKyKhaiThacVLXDByIdHoSo(idHoSo: string) {
    const dkKhaiThacVLXDService = this.dangKyHoatDongKhoangSanFacadeService.getDangkyKhaiThacVLXDService();
    const dangKyItem = await dkKhaiThacVLXDService.getFetchAll({ Idhoso: idHoSo });
    return dangKyItem;
  }

  async saveItemdangKyKhaiThacVLXD() {
    this.logAllValidationErrorMessages();

    if (!this.dangKyKhaiThacVLXDIOForm.valid) {
      return;
    }

    // Gán dữ liệu input vào model
    const dkKhaiThacVLXDService = this.dangKyHoatDongKhoangSanFacadeService.getDangkyKhaiThacVLXDService();
    const inputModel = this.dangKyKhaiThacVLXDIOForm.value;
    inputModel.idhoso = this.idhoso;
    if (this.currentAction === DangKyKhaiThacKsActionEnum.Add) {
      dkKhaiThacVLXDService.addItem(inputModel).subscribe(
        async (res) => {
          this.dangKyKhaiThacVLXD = inputModel;
          this.dangKyKhaiThacVLXD.iddangkykhaithac = res.iddangkykhaithac;
          this.currentAction = DangKyKhaiThacKsActionEnum.Edit;
          this.selectCurrentFormState();
          this.selectIddangKyKhaiThacVLXD();
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
      inputModel.iddangkykhaithac = this.dangKyKhaiThacVLXD.iddangkykhaithac;
      dkKhaiThacVLXDService.updateItem(inputModel).subscribe(
        async (res) => {
          this.dangKyKhaiThacVLXD = inputModel;
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
      this.dangKyKhaiThacVLXDIOForm,
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
  private selectIddangKyKhaiThacVLXD() {
    this.selectIdDangKyKhaiThacKhoangSanEvent.emit(this.dangKyKhaiThacVLXD.iddangkykhaithac);
  }

  /**
   *
   */
  deleteItemdangKyKhaiThacVLXD() {
    const dialogRef = this.commonService.confirmDeleteDiaLogService(
      "",
      ""
    );
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === "confirm") {
        await this.dangKyHoatDongKhoangSanFacadeService
          .getDangkyKhaiThacVLXDService()
          .deleteItem({ iddangkykhaithac: this.dangKyKhaiThacVLXD.iddangkykhaithac })
          .subscribe(
            () => {
              this.dangKyKhaiThacVLXD = null;
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
    this.dangKyKhaiThacVLXDIOForm.reset({
      tenduan: "",
      soquyetdinh: "",
      ngaykyquyetdinh: "",
      coquanpheduyet: "",
      dientichkhaithac: "",
      truluongkhaithac: "",
      congsuatkhaithac: "",
      mucsaukhaithactu: "",
      mucsaukhaithacden: "",
      khaithacdenngay: "",
      kehoachkhaithac: "",
      donvidientich: "",
      donvitruluong: "",
      donvicongsuat: "",
      donvichieusau: "",
      hequychieu: "",
    });
  }


}
