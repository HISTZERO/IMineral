import {Component, ComponentFactoryResolver, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {OutputDmHeQuyChieuModel} from "src/app/models/admin/danhmuc/hequychieu.model";
import {DangKyKhaiThacKsActionEnum} from "src/app/shared/constants/enum";
import {DonViDienTich} from "src/app/shared/constants/common-constants";
import {DefaultValue} from "src/app/shared/constants/global-var";
import {TranslateService} from "@ngx-translate/core";
import {DmFacadeService} from "src/app/services/admin/danhmuc/danhmuc-facade.service";
import {DangKyHoatDongKhoangSanFacadeService} from "src/app/services/admin/dangkyhoatdongkhoangsan/dangkyhoatdongkhoangsan-facade.service";
import {CommonServiceShared} from "src/app/services/utilities/common-service";
import {ActivatedRoute} from "@angular/router";
import {OutputDkDongCuaMoModel} from "src/app/models/admin/dangkyhoatdongkhoangsan/dkdongcuamo.model";
import {HttpErrorResponse} from "@angular/common/http";
import {validationAllErrorMessagesService} from "src/app/services/utilities/validatorService";

@Component({
  selector: 'app-dangkydongcuadientich-io',
  templateUrl: './dangkydongcuadientich-io.component.html',
  styleUrls: ['./dangkydongcuadientich-io.component.scss']
})
export class DangkydongcuadientichIoComponent implements OnInit {

  // tslint:disable-next-line: no-output-rename
  @Output("selectCurrentFormStateEvent") selectCurrentFormStateEvent: EventEmitter<number> = new EventEmitter();
  // tslint:disable-next-line: no-output-rename
  @Output("selectIdDangKyDongCuaMoEvent") selectIdDangKyDongCuaMoEvent: EventEmitter<string> = new EventEmitter();
  // tslint:disable-next-line: no-input-rename
  @Input("allowAutoInit") allowAutoInit = true;
  // Nhóm loại cấp phép
  // tslint:disable-next-line: no-input-rename
  @Input("nhomLoaiCapPhep") nhomLoaiCapPhep;
  // Chứa dữ liệu Form
  public dangKyDongCuaIOForm: FormGroup;
  // Chứa dữ liệu translate
  public dataTranslate: any;
  // Chứa danh sách Hệ quy chiếu
  public allHeQuyChieu: OutputDmHeQuyChieuModel[];
  public HeQuyChieuFilters: OutputDmHeQuyChieuModel[];
  // chứa dữ liệu Id Hồ sơ
  public idhoso: string;

  public loaidongcua: number;
  // chứa dữ liệu đăng ký
  private dangKyDongCuaMo: any;
  // Action thao tác dữ liệu
  public currentAction: number;
  // Action đăng ký thăm dò
  public ActionType = DangKyKhaiThacKsActionEnum;
  // disable delete button
  public disabledDeleteButton = false;
  // lưu dữ liệu đơn vị diện tích
  public donViDienTichList = DonViDienTich;
  // error message
  validationErrorMessages = {};

  // form errors
  formErrors = {
    dientichdongcua: DefaultValue.Empty,
    dientichkhaithac: DefaultValue.Empty,
    donvidientich: DefaultValue.Empty,
    hequychieu: DefaultValue.Empty,
    loaidongcua: DefaultValue.Empty,
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
      this.dangKyDongCuaMo = await this.getDangKyKhaiThacKsByIdHoSo(this.idhoso);

      if (this.dangKyDongCuaMo) {
        this.currentAction = DangKyKhaiThacKsActionEnum.Edit;
        this.selectIdDangKyDongCuaMo();
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
    await this.formOnEdit(this.dangKyDongCuaMo);

    return true;
  }

  /**
   * Hàm khởi tạo form
   */
  private formInit() {
    this.dangKyDongCuaIOForm = this.formBuilder.group({
      dientichdongcua: [DefaultValue.Empty],
      donvidientich: [DefaultValue.Empty],
      hequychieu: [DefaultValue.Empty],
      loaidongcua: [DefaultValue.Empty],
      dientichkhaithac: [DefaultValue.Empty]
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
  private async formOnEdit(item: OutputDkDongCuaMoModel) {
    if (this.currentAction === DangKyKhaiThacKsActionEnum.Edit && item) {
      this.dangKyDongCuaIOForm.setValue({
        dientichdongcua: item.dientichdongcua,
        donvidientich: item.donvidientich,
        hequychieu: item.hequychieu,
        loaidongcua: item.loaidongcua,
        dientichkhaithac: item.dientichkhaithac,
      });
    }
  }

  /**
   * Hàm set validate
   */
  private setValidation() {
    this.validationErrorMessages = {};
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
  private async getDangKyKhaiThacKsByIdHoSo(idHoSo: string) {
    const dkKhaiThacDongCuaService = this.dangKyHoatDongKhoangSanFacadeService.getDangKyDongCuaMoService();
    const dangKyItem = await dkKhaiThacDongCuaService.getFetchAll({Idhoso: idHoSo});
    return dangKyItem;
  }

  /**
   * Lưu dữ liệu đăng ký khai thác khoáng sản
   */
  async saveItemDangKyDongCuaMo() {
    this.logAllValidationErrorMessages();

    if (!this.dangKyDongCuaIOForm.valid) {
      return;
    }

    // Gán dữ liệu input vào model
    const dkKhaiThacDongCuaService = this.dangKyHoatDongKhoangSanFacadeService.getDangKyDongCuaMoService();
    const inputModel = this.dangKyDongCuaIOForm.value;
    inputModel.idhoso = this.idhoso;
    if (this.currentAction === DangKyKhaiThacKsActionEnum.Add) {
      dkKhaiThacDongCuaService.addItem(inputModel).subscribe(
        async (res) => {
          this.dangKyDongCuaMo = inputModel;
          this.dangKyDongCuaMo.iddangkykhaithac = res.iddangkykhaithac;
          this.currentAction = DangKyKhaiThacKsActionEnum.Edit;
          this.selectCurrentFormState();
          this.selectIdDangKyDongCuaMo();
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
      inputModel.iddangkykhaithac = this.dangKyDongCuaMo.iddangkykhaithac;
      dkKhaiThacDongCuaService.updateItem(inputModel).subscribe(
        async (res) => {
          this.dangKyDongCuaMo = inputModel;
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
      this.dangKyDongCuaIOForm,
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
  private selectIdDangKyDongCuaMo() {
    this.selectIdDangKyDongCuaMoEvent.emit(this.dangKyDongCuaMo.iddangkykhaithac);
  }

  /**
   * Xóa item đăng ký khai thác khoáng sản
   */
  deleteItemDangKyDongCuaMo() {
    const dialogRef = this.commonService.confirmDeleteDiaLogService(
      this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkydongcuadientich.contentDelete,
      this.dangKyDongCuaMo.diadiem
    );
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === "confirm") {
        await this.dangKyHoatDongKhoangSanFacadeService
          .getDangKyDongCuaMoService()
          .deleteItem({iddangkykhaithac: this.dangKyDongCuaMo.iddangkykhaithac})
          .subscribe(
            () => {
              this.dangKyDongCuaMo = null;
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
    this.dangKyDongCuaIOForm.reset({
      dientichdongcua: DefaultValue.Empty,
      dientichkhaithac: DefaultValue.Empty,
      donvidientich: DefaultValue.Empty,
      hequychieu: DefaultValue.Empty,
      loaidongcua: DefaultValue.Empty,
    });
  }

}
