import { Component, ComponentFactoryResolver, EventEmitter, Input, OnInit, Output, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSidenav } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { DmFacadeService } from 'src/app/services/admin/danhmuc/danhmuc-facade.service';
import { CommonServiceShared } from 'src/app/services/utilities/common-service';
import { MatsidenavService } from 'src/app/services/utilities/matsidenav.service';
import { CapPhepKhaiThacActionEnum, LoaiCapPhepEnum } from 'src/app/shared/constants/enum';
import { DefaultValue } from 'src/app/shared/constants/global-var';
import { OutputDmHeQuyChieuModel } from 'src/app/models/admin/danhmuc/hequychieu.model';
import { CapPhepHoatDongKhoangSanFacadeService } from 'src/app/services/admin/capphephoatdongkhoangsan/capphephoatdongkhoangsan-facade.service';
import { validationAllErrorMessagesService } from "src/app/services/utilities/validatorService";
import { DonViCongSuat, DonViDienTich, DonViDoSau, DonViThoiHan, DonViTruLuong, PhuongPhapKhaiThac } from 'src/app/shared/constants/common-constants';
import { HoSoGiayToFacadeService } from 'src/app/services/admin/hosogiayto/hosogiayto-facade.service';
import { OutputGiayPhepModel } from 'src/app/models/admin/hosogiayto/giayphep.model';
import { OutputCpKhaiThacKhoangSanModel } from "src/app/models/admin/capphephoatdongkhoangsan/cpkhaithackhoangsan/cpkhaithackhoangsan.model";

@Component({
  selector: 'app-cp-ktks-khaithackhoangsan-io',
  templateUrl: './cp-ktks-khaithackhoangsan-io.component.html',
  styleUrls: ['./cp-ktks-khaithackhoangsan-io.component.scss']
})
export class CpKtksKhaithackhoangsanIoComponent implements OnInit {

  @ViewChild(Type, { static: true }) public matSidenav: MatSidenav;
  @ViewChild(Type, { read: ViewContainerRef, static: true }) public content: ViewContainerRef;
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
  // Chứa thuộc tính hiển thị tab thiết bị
  public showFormInput: boolean = false;
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
    public cfr: ComponentFactoryResolver) { }

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

      if (this.itemGiayPhep.loaicapphep === LoaiCapPhepEnum.KhaiThacKhoangSanGiaHan || this.itemGiayPhep.loaicapphep === LoaiCapPhepEnum.DongCuaMotPhanDienTichKhuVucKhaiThacKhoangSan) {
        this.showFormInput = true;
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
      if (this.itemGiayPhep.loaicapphep === LoaiCapPhepEnum.KhaiThacKhoangSan) {
        this.title = this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.cptdksthamdokhoangsan.titleEdit;
      } else if (this.itemGiayPhep.loaicapphep === LoaiCapPhepEnum.ThamDoGiaHan) {
        this.title = this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.cptdksthamdogiahan.titleEdit;
      } else {
        this.title = DefaultValue.Empty;
      }
    } else if (this.currentAction === CapPhepKhaiThacActionEnum.Add) {
      if (this.itemGiayPhep.loaicapphep === LoaiCapPhepEnum.KhaiThacKhoangSanGiaHan) {
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
    this.capPhepKhaiThacIOForm = this.formBuilder.group({
      tenmo: [DefaultValue.Empty],
      sohieu: [DefaultValue.Empty],
      diadiem: [DefaultValue.Empty],
      duancongtrinh: [DefaultValue.Empty],
      dientichkhaithac: [DefaultValue.Empty],
      dientichtralai: [DefaultValue.Empty],
      truluongdiachat: [DefaultValue.Empty],
      truluongkhaithac: [DefaultValue.Empty],
      truluongtralai: [DefaultValue.Empty],
      thoihankhaithac: [DefaultValue.Empty],
      ngaybdkhaithac: [DefaultValue.Empty],
      ngayktkhaithac: [DefaultValue.Empty],
      phuongphapkhaithac: [DefaultValue.Empty],
      congsuatkhaithac: [DefaultValue.Empty],
      mucsaukhaithactu: [DefaultValue.Empty],
      mucsaukhaithacden: [DefaultValue.Empty],
      dangkhoangsan: [DefaultValue.Empty],
      donvitruluong: [DefaultValue.Empty],
      donvicongsuat: [DefaultValue.Empty],
      donvidientich: [DefaultValue.Empty],
      donvithoihan: [DefaultValue.Empty],
      donvichieusau: [DefaultValue.Empty],
      hequychieu: [DefaultValue.Empty],
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
      .getFetchAll({ PageNumber: 1, PageSize: -1 });
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
      this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN.cptdksthamdokhoangsan.contentDelete,
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
