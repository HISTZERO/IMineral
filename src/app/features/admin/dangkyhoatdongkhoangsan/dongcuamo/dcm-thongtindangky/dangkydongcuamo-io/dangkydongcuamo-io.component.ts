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
import {DonViDienTich} from "src/app/shared/constants/common-constants";
import {DangKyKhaiThacKsActionEnum} from "src/app/shared/constants/enum";
import {TranslateService} from "@ngx-translate/core";
import {DmFacadeService} from "src/app/services/admin/danhmuc/danhmuc-facade.service";
import {DangKyHoatDongKhoangSanFacadeService} from "src/app/services/admin/dangkyhoatdongkhoangsan/dangkyhoatdongkhoangsan-facade.service";
import {CommonServiceShared} from "src/app/services/utilities/common-service";
import {ActivatedRoute} from "@angular/router";
import {HttpErrorResponse} from "@angular/common/http";
import {validationAllErrorMessagesService} from "src/app/services/utilities/validatorService";
import {DefaultValue} from "src/app/shared/constants/global-var";
import {OutputDkDongCuaMoModel} from "src/app/models/admin/dangkyhoatdongkhoangsan/dangkydongcuamo/dkdongcuamo.model";
import {GiayphepOptionComponent} from "src/app/features/admin/hosogiayto/giayphep/giayphep-option/giayphep-option.component";
import {MatsidenavService} from "src/app/services/utilities/matsidenav.service";
import {MatSidenav} from "@angular/material/sidenav";
import {OutputGiayPhepModel} from "src/app/models/admin/hosogiayto/giayphep.model";

@Component({
  selector: 'app-dangkydongcuamo-io',
  templateUrl: './dangkydongcuamo-io.component.html',
  styleUrls: ['./dangkydongcuamo-io.component.scss']
})
export class DangkydongcuamoIoComponent implements OnInit {

  @ViewChild(Type, {static: true}) public matSidenav: MatSidenav;
  @ViewChild(Type, {read: ViewContainerRef, static: true}) public content: ViewContainerRef;
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
    donvidientich: DefaultValue.Empty,
    hequychieu: DefaultValue.Empty,
    loaidongcua: DefaultValue.Empty,
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
      dientichdongcua: [DefaultValue.Empty, [Validators.required, Validators.pattern("^[0-9-+]+$")]],
      donvidientich: [DefaultValue.Empty, Validators.required],
      hequychieu: [DefaultValue.Empty, Validators.required],
      loaidongcua: [DefaultValue.Empty],
      dientichkhaithac: [DefaultValue.Empty],
      idgiayphep: [DefaultValue.Empty],
      sogiayphep: [DefaultValue.Empty],
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
        idgiayphep: item.idgiayphep,
        sogiayphep: item.sogiayphep,
      });
    }
  }

  /**
   * Hàm set validate
   */
  private setValidation() {
    this.validationErrorMessages = {
      dientichdongcua: {
        required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkydongcuadientich.dientichdongcuaRequired,
        pattern: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkydongcuadientich.numberRequired
      },
      donvidientich: {required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkydongcuadientich.donvidientichRequired},
      hequychieu: {required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkydongcuadientich.hequychieuRequired},
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
      this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkydongcuamo.contentDelete,
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
      donvidientich: DefaultValue.Empty,
      hequychieu: DefaultValue.Empty,
      loaidongcua: DefaultValue.Empty,
    });
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
  private async selectItemGiayPhep(item: OutputGiayPhepModel) {
    if (item !== null && item !== undefined) {
      this.dangKyDongCuaIOForm.controls.sogiayphep.setValue(item.sogiayphep);
      this.dangKyDongCuaIOForm.controls.idgiayphep.setValue(item.idgiayphep);
      const itemDongCua: any = await this.fillItemGiaHan(item.idgiayphep);
      this.dangKyDongCuaIOForm.controls.dientichdongcua.setValue(itemDongCua.dientichdongcua);
      this.dangKyDongCuaIOForm.controls.donvidientich.setValue(itemDongCua.donvidientich);
      this.dangKyDongCuaIOForm.controls.hequychieu.setValue(itemDongCua.hequychieu);
    }
  }

  // Hàm dùng để gọi các hàm khác, truyền vào tên hàm cần thực thi
  doFunction(methodName, obj) {
    this[methodName](obj);
  }

  private async fillItemGiaHan(idGiayPhep: string) {
    const dkDongCuaMoService = this.dangKyHoatDongKhoangSanFacadeService.getDangKyDongCuaMoService();
    const itemDongCua = await dkDongCuaMoService.getDangKyDongCuaMoByIdGiayPhep(idGiayPhep).toPromise();
    return itemDongCua;
  }
}
