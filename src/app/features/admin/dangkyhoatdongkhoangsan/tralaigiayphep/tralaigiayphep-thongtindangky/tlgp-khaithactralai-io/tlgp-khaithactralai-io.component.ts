import { Component, OnInit, Input, ComponentFactoryResolver, EventEmitter, Output, ViewChild, Type, ViewContainerRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { DmFacadeService } from "src/app/services/admin/danhmuc/danhmuc-facade.service";
import { DangKyHoatDongKhoangSanFacadeService } from 'src/app/services/admin/dangkyhoatdongkhoangsan/dangkyhoatdongkhoangsan-facade.service';
import { DangKyKhaiThacKsActionEnum, DangKyTraLaiGiayPhepActionEnum } from 'src/app/shared/constants/enum';
import { CommonServiceShared } from 'src/app/services/utilities/common-service';
import { validationAllErrorMessagesService } from "src/app/services/utilities/validatorService";
import { OutputDmHeQuyChieuModel } from 'src/app/models/admin/danhmuc/hequychieu.model';
import { DangKhoangSan, DonViCongSuat, DonViDienTich, DonViDoSau, DonViThoiHan, DonViTruLuong, PhuongPhapKhaiThac } from 'src/app/shared/constants/common-constants';
import { OutputDkKhaiThacKhoangSanModel } from "src/app/models/admin/dangkyhoatdongkhoangsan/dkkhaithackhoangsan.model";
import { OutputDkKhaiThacTraLaiModel } from "../../../../../../models/admin/dangkyhoatdongkhoangsan/dkkhaithactralai.model";
import { GiayphepOptionComponent } from "../../../../hosogiayto/giayphep/giayphep-option/giayphep-option.component";
import { MatSidenav } from "@angular/material";
import { MatsidenavService } from "../../../../../../services/utilities/matsidenav.service";
import { OutputGiayPhepModel } from "../../../../../../models/admin/hosogiayto/giayphep.model";

@Component({
  selector: 'app-tlgp-khaithactralai-io',
  templateUrl: './tlgp-khaithactralai-io.component.html',
  styleUrls: ['./tlgp-khaithactralai-io.component.scss']
})
export class TlgpKhaithactralaiIoComponent implements OnInit {

  @ViewChild(Type, { static: true }) public matSidenav: MatSidenav;
  @ViewChild(Type, { read: ViewContainerRef, static: true }) public content: ViewContainerRef;


  // tslint:disable-next-line: no-output-rename
  @Output("selectCurrentFormStateEvent") selectCurrentFormStateEvent: EventEmitter<number> = new EventEmitter();

  // tslint:disable-next-line: no-output-rename
  @Output("selectIdDangKyKhaiThacTraLaiEvent") selectIdDangKyKhaiThacTraLaiEvent: EventEmitter<string> = new EventEmitter();

  // tslint:disable-next-line: no-input-rename
  @Input("allowAutoInit") allowAutoInit = true;

  // Nhóm loại cấp phép
  // tslint:disable-next-line: no-input-rename
  @Input("nhomLoaiCapPhep") nhomLoaiCapPhep;

  // Chứa dữ liệu Form
  public dangKyKhaiThacTraLaiIOForm: FormGroup;

  // Chứa dữ liệu translate
  public dataTranslate: any;

  // Chứa danh sách Hệ quy chiếu
  public allHeQuyChieu: OutputDmHeQuyChieuModel[];
  public HeQuyChieuFilters: OutputDmHeQuyChieuModel[];

  // Dạng khoáng sản
  public dangKhoangSanList = DangKhoangSan;

  // chứa dữ liệu Id Hồ sơ
  public idhoso: string;

  // chứa dữ liệu đăng ký khai thác trả lại
  private dangKyKhaiThacTraLai: any;

  // Action thao tác dữ liệu
  public currentAction: number;

  // Action đăng ký khai thác trả lại
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
    dientichdacapphep: "",
    dientichkhaithac: "",
    dientichtralai: "",
    donvidientich: "",
    lydotralai: "",
    hequychieu: "",
    loaitralai: "",
    idgiayphep: "",
    sogiayphep: ""
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
      this.dangKyKhaiThacTraLai = await this.getDangKyKhaiThacTraLaiByIdHoSo(this.idhoso);

      if (this.dangKyKhaiThacTraLai) {
        this.currentAction = DangKyTraLaiGiayPhepActionEnum.Edit;
        this.selectIdDangKyKhaiThacTraLai();
        this.selectCurrentFormState();
      } else {
        this.currentAction = DangKyTraLaiGiayPhepActionEnum.Add;
        this.selectCurrentFormState();
      }
    } else {
      this.currentAction = DangKyTraLaiGiayPhepActionEnum.None;
      return;
    }

    // Lấy dữ liệu hệ quy chiếu
    await this.geAllHeQuyChieu();

    // Khởi tạo dữ liệu form trong trường hợp sửa dữ liệu Hồ Sơ
    await this.formOnEdit(this.dangKyKhaiThacTraLai);

    return true;
  }

  /**
   * Hàm khởi tạo form
   */
  private formInit() {
    this.dangKyKhaiThacTraLaiIOForm = this.formBuilder.group({
      dientichdacapphep: [""],
      dientichkhaithac: [""],
      dientichtralai: [""],
      donvidientich: [""],
      lydotralai: [""],
      hequychieu: [""],
      loaitralai: [""],
      idgiayphep: [""],
      sogiayphep: ["", Validators.required]
    });
    this.dangKyKhaiThacTraLaiIOForm.controls.sogiayphep.disable({ onlySelf: true });
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
  private async formOnEdit(item: OutputDkKhaiThacTraLaiModel) {
    if (this.currentAction === DangKyTraLaiGiayPhepActionEnum.Edit && item) {
      this.dangKyKhaiThacTraLaiIOForm.setValue({
        dientichdacapphep: item.dientichdacapphep,
        dientichkhaithac: item.dientichkhaithac,
        dientichtralai: item.dientichtralai,
        donvidientich: item.donvidientich,
        lydotralai: item.lydotralai,
        hequychieu: item.hequychieu,
        loaitralai: item.loaitralai,
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
  private async getDangKyKhaiThacTraLaiByIdHoSo(idHoSo: string) {
    const dkKhaiThacKhoangSanService = this.dangKyHoatDongKhoangSanFacadeService.getDangKyKhaiThacKhoangSanService();
    const dangKyItem = await dkKhaiThacKhoangSanService.getFetchAll({ Idhoso: idHoSo });
    return dangKyItem;
  }

  /**
   * Lưu dữ liệu đăng ký khai thác khoáng sản
   */
  async saveItemDangKyKhaiThacKhoangSan() {
    this.logAllValidationErrorMessages();

    if (!this.dangKyKhaiThacTraLaiIOForm.valid) {
      return;
    }

    // Gán dữ liệu input vào model
    const dkKhaiThacKhoangSanService = this.dangKyHoatDongKhoangSanFacadeService.getDangKyKhaiThacTraLaiService();
    const inputModel = this.dangKyKhaiThacTraLaiIOForm.value;
    inputModel.idhoso = this.idhoso;
    if (this.currentAction === DangKyKhaiThacKsActionEnum.Add) {
      dkKhaiThacKhoangSanService.addItem(inputModel).subscribe(
        async (res) => {
          this.dangKyKhaiThacTraLai = inputModel;
          this.dangKyKhaiThacTraLai.iddangkykhaithac = res.iddangkykhaithac;
          this.currentAction = DangKyKhaiThacKsActionEnum.Edit;
          this.selectCurrentFormState();
          this.selectIdDangKyKhaiThacTraLai();
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
      inputModel.iddangkykhaithac = this.dangKyKhaiThacTraLai.iddangkykhaithac;
      dkKhaiThacKhoangSanService.updateItem(inputModel).subscribe(
        async (res) => {
          this.dangKyKhaiThacTraLai = inputModel;
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
   * lấy item dữ liệu đối tượng cá nhân từ popup
   */
  private selectItemGiayPhep(item: OutputGiayPhepModel) {
    if (item !== null && item !== undefined) {
      this.dangKyKhaiThacTraLaiIOForm.controls.sogiayphep.setValue(item.sogiayphep);
      this.dangKyKhaiThacTraLaiIOForm.controls.idgiayphep.setValue(item.idgiayphep);
    }
  }
  
  /**
   * Hàm kiểm tra validation form
   */
  private logAllValidationErrorMessages() {
    validationAllErrorMessagesService(
      this.dangKyKhaiThacTraLaiIOForm,
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
  private selectIdDangKyKhaiThacTraLai() {
    this.selectIdDangKyKhaiThacTraLaiEvent.emit(this.dangKyKhaiThacTraLai.iddangkykhaithac);
  }

  /**
   * Xóa item đăng ký khai thác khoáng sản
   */
  deleteItemDangKyKhaiThacTraLai() {
    const dialogRef = this.commonService.confirmDeleteDiaLogService(
      this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkykhaithackhoangsan.contentDelete,
      this.dangKyKhaiThacTraLai.diadiem
    );
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === "confirm") {
        await this.dangKyHoatDongKhoangSanFacadeService
          .getDangKyKhaiThacTraLaiService()
          .deleteItem({ iddangkykhaithac: this.dangKyKhaiThacTraLai.iddangkykhaithac })
          .subscribe(
            () => {
              this.dangKyKhaiThacTraLai = null;
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
    this.dangKyKhaiThacTraLaiIOForm.reset({
      dientichdacapphep: "",
      dientichkhaithac: "",
      dientichtralai: "",
      donvidientich: "",
      lydotralai: "",
      hequychieu: "",
      loaitralai: "",
      idgiayphep: "",
    });
  }


  // Hàm dùng để gọi các hàm khác, truyền vào tên hàm cần thực thi
  doFunction(methodName, obj) {
    this[methodName](obj);
  }
}
