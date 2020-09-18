import { Component, OnInit, Input, ViewContainerRef, ViewChild, ComponentFactoryResolver, EventEmitter, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { InsertedState, DangKyThamDoActionEnum, DangKhoangSanEnum } from 'src/app/shared/constants/enum';
import { DmFacadeService } from "src/app/services/admin/danhmuc/danhmuc-facade.service";
import { HethongFacadeService } from 'src/app/services/admin/hethong/hethong-facade.service';
import { ActivatedRoute } from '@angular/router';
import { DangKyHoatDongKhoangSanFacadeService } from 'src/app/services/admin/dangkyhoatdongkhoangsan/dangkyhoatdongkhoangsan-facade.service';
import { InputDkThamDoKhoangSanModel, OutputDkThamDoKhoangSanModel } from 'src/app/models/admin/dangkyhoatdongkhoangsan/dkthamdokhoangsan.model';
import { CommonServiceShared } from 'src/app/services/utilities/common-service';
import { HttpErrorResponse } from '@angular/common/http';
import { validationAllErrorMessagesService } from "src/app/services/utilities/validatorService";
import { OutputDmHeQuyChieuModel } from 'src/app/models/admin/danhmuc/hequychieu.model';
import { DangKhoangSan } from 'src/app/shared/constants/common-constants';

@Component({
  selector: 'app-dangkythamdokhoangsan-io',
  templateUrl: './dangkythamdokhoangsan-io.component.html',
  styleUrls: ['./dangkythamdokhoangsan-io.component.scss']
})
export class DangkythamdokhoangsanIoComponent implements OnInit {
  // tslint:disable-next-line: no-output-rename
  @Output("selectCurrentFormStateEvent") selectCurrentFormStateEvent: EventEmitter<number> = new EventEmitter();
  // tslint:disable-next-line: no-output-rename
  @Output("selectNewInsertedDangKyThamDoEvent") selectNewInsertedDangKyThamDoEvent: EventEmitter<string> = new EventEmitter();
  // tslint:disable-next-line: no-input-rename
  @Input("allowAutoInit") allowAutoInit = true;
  // Nhóm loại cấp phép
  // tslint:disable-next-line: no-input-rename
  @Input("nhomLoaiCapPhep") nhomLoaiCapPhep;
  // Chứa dữ liệu Form
  public dangKyThamDoIOForm: FormGroup;
  // Chứa dữ liệu translate
  public dataTranslate: any;
  // Chứa danh sách Hệ quy chiếu
  public allHeQuyChieu: OutputDmHeQuyChieuModel[];
  public HeQuyChieuFilters: OutputDmHeQuyChieuModel[];
  // Dạng khoáng sản
  public dangKhoangSanList = DangKhoangSan;
  // chứa dữ liệu Id Hồ sơ
  public idhoso: string;
  // chứa dữ liệu Id đăng ký thăm dò
  private iddangkythamdo: string;
  // Action thao tác dữ liệu
  public currentAction: number;
  // Action đăng ký thăm dò
  public ActionType = DangKyThamDoActionEnum;
  // disable delete button
  public disabledDeleteButton = false;
  // error message
  validationErrorMessages = {};

  // form errors
  formErrors = {
    diadiem: "",
    dientichthamdo: "",
    chieusauthamdotu: "",
    chieusauthamdoden: "",
    thoihanthamdo: "",
    mucdichsudungkhoangsan: "",
    dangkhoangsan: "",
    donvidientich: "",
    donvithoihan: "",
    donvichieusau: "",
    hequychieu: ""
  };

  constructor(private translate: TranslateService,
              private formBuilder: FormBuilder,
              private dmFacadeService: DmFacadeService,
              private dangKyHoatDongKhoangSanFacadeService: DangKyHoatDongKhoangSanFacadeService,
              public commonService: CommonServiceShared,
              private activatedRoute: ActivatedRoute,
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
   * Khởi tạo form
   */
  async manualDataInit() {
    this.activatedRoute.queryParamMap.subscribe((param: any) => {
      if (param && param.params && param.params.idhoso) {
        this.idhoso = param.params.idhoso;
      }
    });

    let dangKyThamDo: any;
    if (this.idhoso !== null && this.idhoso !== undefined) {
      dangKyThamDo = await this.getDangKyThamDoByIdHoSo(this.idhoso);

      if (dangKyThamDo) {
        this.iddangkythamdo = dangKyThamDo.iddangkythamdo;
        this.currentAction = DangKyThamDoActionEnum.Edit;
      } else {
        this.currentAction = DangKyThamDoActionEnum.Add;
      }
    } else {
      this.currentAction = DangKyThamDoActionEnum.None;
      return;
    }

    // Lấy dữ liệu hệ quy chiếu
    await this.geAllHeQuyChieu();
    // Khởi tạo dữ liệu form trong trường hợp sửa dữ liệu Hồ Sơ
    await this.formOnEdit(dangKyThamDo);

    return true;
  }

  /**
   * Hàm khởi tạo form
   */
  private formInit() {
    this.dangKyThamDoIOForm = this.formBuilder.group({
      diadiem: ["", Validators.required],
      dientichthamdo: ["", [Validators.required, Validators.pattern("^[0-9]+\\.{0,1}\\d{0,2}$")]],
      chieusauthamdotu: ["", [Validators.required, Validators.pattern("^[0-9]+\\.{0,1}\\d{0,2}$")]],
      chieusauthamdoden: ["", [Validators.required, Validators.pattern("^[0-9]+\\.{0,1}\\d{0,2}$")]],
      thoihanthamdo: ["", Validators.required],
      mucdichsudungkhoangsan: ["", Validators.required],
      dangkhoangsan: [DangKhoangSanEnum.KhoangSanRan, Validators.required],
      donvidientich: ["", Validators.required],
      donvithoihan: ["", Validators.required],
      donvichieusau: ["", Validators.required],
      hequychieu: ["", Validators.required]
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
  private async formOnEdit(item: OutputDkThamDoKhoangSanModel) {
    if (this.currentAction === DangKyThamDoActionEnum.Edit && item) {
      this.dangKyThamDoIOForm.setValue({
        diadiem: item.diadiem,
        dientichthamdo: item.dientichthamdo,
        chieusauthamdotu: item.chieusauthamdotu,
        chieusauthamdoden: item.chieusauthamdoden,
        thoihanthamdo: item.thoihanthamdo,
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
      diadiem: { required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkythamdokhoangsan.diadiemRequired },
      dientichthamdo: { required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkythamdokhoangsan.dientichthamdoRequired, pattern: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkythamdokhoangsan.dientichthamdoFormat },
      chieusauthamdotu: { required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkythamdokhoangsan.chieusauthamdotuRequired, pattern: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkythamdokhoangsan.chieusauthamdotuFormat },
      chieusauthamdoden: { required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkythamdokhoangsan.chieusauthamdodenRequired, pattern: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkythamdokhoangsan.chieusauthamdodenFormat },
      thoihanthamdo: { required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkythamdokhoangsan.thoihanthamdoRequired },
      mucdichsudungkhoangsan: { required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkythamdokhoangsan.mucdichsudungkhoangsanRequired },
      dangkhoangsan: { required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkythamdokhoangsan.dangkhoangsanRequired },
      donvidientich: { required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkythamdokhoangsan.donvidientichRequired },
      donvithoihan: { required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkythamdokhoangsan.donvithoihanRequired },
      donvichieusau: { required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkythamdokhoangsan.donvichieusauRequired },
      hequychieu: { required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkythamdokhoangsan.hequychieuRequired },
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
  private async getDangKyThamDoByIdHoSo(idHoSo: string) {
    const dkThamDoKhoangSanService = this.dangKyHoatDongKhoangSanFacadeService.getDangKyThamDoService();
    const dangKyItem = await dkThamDoKhoangSanService.getDangKyThamDoByIdHoSo(idHoSo).toPromise();
    return dangKyItem;
  }

  async saveItemDangKyThamDo() {
    this.logAllValidationErrorMessages();

    if (!this.dangKyThamDoIOForm.valid) {
      return;
    }

    // Gán dữ liệu input vào model
    const dkThamDoKhoangSanService = this.dangKyHoatDongKhoangSanFacadeService.getHoSoService();
    const inputModel = this.dangKyThamDoIOForm.value;
    inputModel.idhoso = this.idhoso;
    if (this.currentAction === DangKyThamDoActionEnum.Add) {
      dkThamDoKhoangSanService.addItem(inputModel).subscribe(
        async (res) => {
          this.iddangkythamdo = res.iddangkythamdo;
          this.currentAction = DangKyThamDoActionEnum.Edit;
          this.selectCurrentFormState();
          this.selectNewInsertedDangKyThamDo();
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
    } else if (this.currentAction === DangKyThamDoActionEnum.Edit) {
      inputModel.iddangkythamdo = this.iddangkythamdo;
      dkThamDoKhoangSanService.updateItem(inputModel).subscribe(
        async (res) => {
          this.currentAction = DangKyThamDoActionEnum.Edit;
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
      this.dangKyThamDoIOForm,
      this.validationErrorMessages,
      this.formErrors
    );
  }

  /**
   * select inserted state of form
   */
  private selectCurrentFormState() {
    this.selectCurrentFormStateEvent.emit(this.currentAction);
  }

  /**
   * lấy thông tin id hồ sơ sau khi thêm mới một hồ sơ
   */
  private selectNewInsertedDangKyThamDo() {
    this.selectNewInsertedDangKyThamDoEvent.emit(this.iddangkythamdo);
  }

}
