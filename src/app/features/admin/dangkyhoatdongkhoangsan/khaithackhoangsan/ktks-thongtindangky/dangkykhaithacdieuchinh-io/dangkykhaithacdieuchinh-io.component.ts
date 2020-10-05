import { Component, OnInit, Input, ComponentFactoryResolver, EventEmitter, Output, ViewChild, Type, ViewContainerRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSidenav } from "@angular/material";

import { DmFacadeService } from "src/app/services/admin/danhmuc/danhmuc-facade.service";
import { DangKyHoatDongKhoangSanFacadeService } from 'src/app/services/admin/dangkyhoatdongkhoangsan/dangkyhoatdongkhoangsan-facade.service';
import { DangKyKhaiThacKsActionEnum } from 'src/app/shared/constants/enum';
import { CommonServiceShared } from 'src/app/services/utilities/common-service';
import { validationAllErrorMessagesService } from "src/app/services/utilities/validatorService";
import { OutputDmHeQuyChieuModel } from 'src/app/models/admin/danhmuc/hequychieu.model';
import { DonViCongSuat, DonViDienTich, DonViDoSau, DonViThoiHan, DonViTruLuong, PhuongPhapKhaiThac } from 'src/app/shared/constants/common-constants';
import { OutputDkKhaiThacDieuChinhModel } from "src/app/models/admin/dangkyhoatdongkhoangsan/dkkhaithacdieuchinh.model";
import { OutputGiayPhepModel } from "src/app/models/admin/capphephoatdongkhoangsan/giayphep.model";
import { GiayphepOptionComponent } from "src/app/features/admin/hosogiayto/giayphep/giayphep-option/giayphep-option.component";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";

@Component({
  selector: 'app-dangkykhaithacdieuchinh-io',
  templateUrl: './dangkykhaithacdieuchinh-io.component.html',
  styleUrls: ['./dangkykhaithacdieuchinh-io.component.scss']
})
export class DangkykhaithacdieuchinhIoComponent implements OnInit {

  @ViewChild(Type, { static: true }) public matSidenav: MatSidenav;
  @ViewChild(Type, { read: ViewContainerRef, static: true }) public content: ViewContainerRef;

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
  public dangKyKhaiThacDieuChinhIOForm: FormGroup;

  // Chứa dữ liệu translate
  public dataTranslate: any;

  // Chứa danh sách Hệ quy chiếu
  public allHeQuyChieu: OutputDmHeQuyChieuModel[];
  public HeQuyChieuFilters: OutputDmHeQuyChieuModel[];

  // chứa dữ liệu Id Hồ sơ
  public idhoso: string;

  // chứa dữ liệu đăng ký khai thác điều chỉnh
  private dangKyKhaiThacDieuChinh: any;

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
    dientichkhaithac: "",
    truluongdiachat: "",
    truluongkhaithac: "",
    thoihankhaithac: "",
    phuongphapkhaithac: "",
    congsuatkhaithac: "",
    mucsaukhaithactu: "",
    mucsaukhaithacden: "",
    donvitruluong: "",
    donvicongsuat: "",
    donvidientich: "",
    donvithoihan: "",
    donvichieusau: "",
    hequychieu: "",
    idgiayphep: "",
    sogiayphep: "",
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
      this.dangKyKhaiThacDieuChinh = await this.getDangKyKhaiThacDieuChinhByIdHoSo(this.idhoso);

      if (this.dangKyKhaiThacDieuChinh) {
        this.currentAction = DangKyKhaiThacKsActionEnum.Edit;
        this.selectIdDangKyKhaiThacDieuChinh();
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
    await this.formOnEdit(this.dangKyKhaiThacDieuChinh);

    return true;
  }


  /**
   * lấy item dữ liệu đối tượng cá nhân từ popup
   */
  private selectItemGiayPhep(item: OutputGiayPhepModel) {
    if (item !== null && item !== undefined) {
      this.dangKyKhaiThacDieuChinhIOForm.controls.sogiayphep.setValue(item.sogiayphep);
      this.dangKyKhaiThacDieuChinhIOForm.controls.idgiayphep.setValue(item.idgiayphep);
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
   * Hàm khởi tạo form
   */
  private formInit() {
    this.dangKyKhaiThacDieuChinhIOForm = this.formBuilder.group({
      dientichkhaithac: [""],
      truluongdiachat: [""],
      truluongkhaithac: [""],
      thoihankhaithac: [""],
      phuongphapkhaithac: [""],
      congsuatkhaithac: [""],
      mucsaukhaithactu: [""],
      mucsaukhaithacden: [""],
      donvitruluong: [""],
      donvicongsuat: [""],
      donvidientich: ["", Validators.required],
      donvithoihan: ["", Validators.required],
      donvichieusau: ["", Validators.required],
      hequychieu: ["", Validators.required],
      idgiayphep: ["", Validators.required],
      sogiayphep: ["", Validators.required]
    });
    this.dangKyKhaiThacDieuChinhIOForm.controls.sogiayphep.disable({ onlySelf: true });
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
  private async formOnEdit(item: OutputDkKhaiThacDieuChinhModel) {
    if (this.currentAction === DangKyKhaiThacKsActionEnum.Edit && item) {
      this.dangKyKhaiThacDieuChinhIOForm.setValue({
        dientichkhaithac: item.dientichkhaithac,
        truluongdiachat: item.truluongdiachat,
        truluongkhaithac: item.truluongkhaithac,
        thoihankhaithac: item.thoihankhaithac,
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
    };
  }

  /**
   * Hàm lấy danh sách Hệ quy chiếu
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
  private async getDangKyKhaiThacDieuChinhByIdHoSo(idHoSo: string) {
    const dkKhaiThacDieuChinhService = this.dangKyHoatDongKhoangSanFacadeService.getDangKyKhaiThacDieuChinhService();
    const dangKyItem = await dkKhaiThacDieuChinhService.getFetchAll({ Idhoso: idHoSo });
    return dangKyItem;
  }

  /**
   * Lưu dữ liệu đăng ký khai thác điều chỉnh
   */
  async saveItemDangKyKhaiThacDieuChinh() {
    this.logAllValidationErrorMessages();

    if (!this.dangKyKhaiThacDieuChinhIOForm.valid) {
      return;
    }

    // Gán dữ liệu input vào model
    const dkKhaiThacDieuChinhService = this.dangKyHoatDongKhoangSanFacadeService.getDangKyKhaiThacDieuChinhService();
    const inputModel = this.dangKyKhaiThacDieuChinhIOForm.value;
    inputModel.idhoso = this.idhoso;
    if (this.currentAction === DangKyKhaiThacKsActionEnum.Add) {
      dkKhaiThacDieuChinhService.addItem(inputModel).subscribe(
        async (res) => {
          this.dangKyKhaiThacDieuChinh = inputModel;
          this.dangKyKhaiThacDieuChinh.iddangkykhaithac = res.iddangkykhaithac;
          this.currentAction = DangKyKhaiThacKsActionEnum.Edit;
          this.selectCurrentFormState();
          this.selectIdDangKyKhaiThacDieuChinh();
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
      inputModel.iddangkykhaithac = this.dangKyKhaiThacDieuChinh.iddangkykhaithac;
      dkKhaiThacDieuChinhService.updateItem(inputModel).subscribe(
        async (res) => {
          this.dangKyKhaiThacDieuChinh = inputModel;
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
      this.dangKyKhaiThacDieuChinhIOForm,
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
  private selectIdDangKyKhaiThacDieuChinh() {
    this.selectIdDangKyKhaiThacKhoangSanEvent.emit(this.dangKyKhaiThacDieuChinh.iddangkykhaithac);
  }

  /**
   * Xóa item đăng ký khai thác điều chỉnh
   */
  deleteItemDangKyKhaiThacDieuChinh() {
    const dialogRef = this.commonService.confirmDeleteDiaLogService(
      this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkykhaithacdieuchinh.contentDelete,
      this.dangKyKhaiThacDieuChinh.diadiem
    );
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === "confirm") {
        await this.dangKyHoatDongKhoangSanFacadeService
          .getDangKyKhaiThacDieuChinhService()
          .deleteItem({ iddangkykhaithac: this.dangKyKhaiThacDieuChinh.iddangkykhaithac })
          .subscribe(
            () => {
              this.dangKyKhaiThacDieuChinh = null;
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
    this.dangKyKhaiThacDieuChinhIOForm.reset({
      dientichkhaithac: "",
      truluongdiachat: "",
      truluongkhaithac: "",
      thoihankhaithac: "",
      phuongphapkhaithac: "",
      congsuatkhaithac: "",
      mucsaukhaithactu: "",
      mucsaukhaithacden: "",
      donvitruluong: "",
      donvicongsuat: "",
      donvidientich: "",
      donvithoihan: "",
      donvichieusau: "",
      hequychieu: "",
      idgiayphep: "",
      sogiayphep: "",
    });
  }

  // Hàm dùng để gọi các hàm khác, truyền vào tên hàm cần thực thi
  doFunction(methodName, obj) {
    this[methodName](obj);
  }
}
