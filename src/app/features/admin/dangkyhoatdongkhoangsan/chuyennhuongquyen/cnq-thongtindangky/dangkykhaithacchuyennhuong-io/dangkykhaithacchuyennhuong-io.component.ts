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
import {MatSidenav} from "@angular/material/sidenav";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {LoaiDoiTuong} from "src/app/shared/constants/common-constants";
import {LoaiGiayTo} from "src/app/shared/constants/loaigiayto-constants";
import {DangKyKhaiThacKsActionEnum, LoaiDoiTuongEnum} from "src/app/shared/constants/enum";
import {DefaultValue} from "src/app/shared/constants/global-var";
import {TranslateService} from "@ngx-translate/core";
import {DmFacadeService} from "src/app/services/admin/danhmuc/danhmuc-facade.service";
import {DangKyHoatDongKhoangSanFacadeService} from "src/app/services/admin/dangkyhoatdongkhoangsan/dangkyhoatdongkhoangsan-facade.service";
import {CommonServiceShared} from "src/app/services/utilities/common-service";
import {ActivatedRoute} from "@angular/router";
import {MatsidenavService} from "src/app/services/utilities/matsidenav.service";
import {OutputGiayPhepModel} from "src/app/models/admin/hosogiayto/giayphep.model";
import {GiayphepOptionComponent} from "src/app/features/admin/hosogiayto/giayphep/giayphep-option/giayphep-option.component";
import {OutputDkThamDoChuyenNhuongModel} from "src/app/models/admin/dangkyhoatdongkhoangsan/dangkykhaithac/dkthamdochuyennhuong.model";
import {HttpErrorResponse} from "@angular/common/http";
import {validationAllErrorMessagesService} from "src/app/services/utilities/validatorService";
import {OutputDmCanhanModel} from "src/app/models/admin/danhmuc/canhan.model";
import {OutputDmToChucModel} from "src/app/models/admin/danhmuc/tochuc.model";
import {DmCanhanOptionComponent} from "src/app/features/admin/danhmuc/canhan/canhan-option/canhan-option.component";
import {DmTochucOptionComponent} from "src/app/features/admin/danhmuc/tochuc/tochuc-option/tochuc-option.component";

@Component({
  selector: 'app-dangkykhaithacchuyennhuong-io',
  templateUrl: './dangkykhaithacchuyennhuong-io.component.html',
  styleUrls: ['./dangkykhaithacchuyennhuong-io.component.scss']
})
export class DangkykhaithacchuyennhuongIoComponent implements OnInit {


  @ViewChild(Type, {static: true}) public matSidenav: MatSidenav;
  @ViewChild(Type, {read: ViewContainerRef, static: true}) public content: ViewContainerRef;

  // tslint:disable-next-line: no-output-rename
  @Output("selectCurrentFormStateEvent") selectCurrentFormStateEvent: EventEmitter<number> = new EventEmitter();

  // tslint:disable-next-line: no-output-rename
  @Output("selectIdDangKyChuyenNhuongEvent") selectIdDangKyChuyenNhuongEvent: EventEmitter<string> = new EventEmitter();

  // tslint:disable-next-line: no-input-rename
  @Input("allowAutoInit") allowAutoInit = true;

  // Nhóm loại cấp phép
  // tslint:disable-next-line: no-input-rename
  @Input("nhomLoaiCapPhep") nhomLoaiCapPhep;

  // Chứa dữ liệu Form
  public dangKyKhaiThacChuyenNhuongIOForm: FormGroup;

  // Chứa dữ liệu translate
  public dataTranslate: any;
  // Chứa dữ liệu loại đối tượng
  public loaiDoiTuongList = LoaiDoiTuong;
  // Chứa dữ liệu loại giấy tờ
  public loaiGiayToList = LoaiGiayTo;
  public loaiGiayToFilters = LoaiGiayTo;

  // chứa dữ liệu Id Hồ sơ
  public idhoso: string;

  // chứa dữ liệu đăng ký khai thác điều chỉnh
  private dangKyKhaiThacChuyenNhuong: any;

  // Action thao tác dữ liệu
  public currentAction: number;

  // Action đăng ký thăm dò
  public ActionType = DangKyKhaiThacKsActionEnum;

  // disable delete button
  public disabledDeleteButton = false;

  // error message
  validationErrorMessages = {};

  // form errors
  formErrors = {
    sohopdong: DefaultValue.Empty,
    idgiayphep: DefaultValue.Empty,
    sogiayphep: DefaultValue.Empty,
    ngayhopdong: DefaultValue.Empty,
    mahoso: DefaultValue.Empty,
    mabiennhan: DefaultValue.Empty,
    soden: DefaultValue.Empty,
    ngaynop: DefaultValue.Empty,
    ngaytiepnhan: DefaultValue.Empty,
    ngaytraketqua: DefaultValue.Empty,
    loaidoituong: DefaultValue.Empty,
    loaicapphep: DefaultValue.Empty,
    hinhthucnophoso: DefaultValue.Empty,
    hinhthucnhanketqua: DefaultValue.Empty,
    idcoquantiepnhan: DefaultValue.Empty,
    idcanhantochuc: DefaultValue.Empty,
    tencanhantochuc: DefaultValue.Empty,
    sogiayto: DefaultValue.Empty,
    loaigiayto: DefaultValue.Empty,
    ngaycap: DefaultValue.Empty,
    noicap: DefaultValue.Empty,
    diachi: DefaultValue.Empty,
    dienthoai: DefaultValue.Empty,
    fax: DefaultValue.Empty,
    email: DefaultValue.Empty,
    website: DefaultValue.Empty,
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
      this.dangKyKhaiThacChuyenNhuong = await this.getDangKyKhaiThacChuyenNhuongByIdHoSo(this.idhoso);

      if (this.dangKyKhaiThacChuyenNhuong) {
        this.currentAction = DangKyKhaiThacKsActionEnum.Edit;
        this.selectIdDangKyKhaiThacChuyenNhuong();
        this.selectCurrentFormState();
      } else {
        this.currentAction = DangKyKhaiThacKsActionEnum.Add;
        this.selectCurrentFormState();
      }
    } else {
      this.currentAction = DangKyKhaiThacKsActionEnum.None;
      return;
    }


    // Khởi tạo dữ liệu form trong trường hợp sửa dữ liệu Hồ Sơ
    await this.formOnEdit(this.dangKyKhaiThacChuyenNhuong);

    return true;
  }


  /**
   * lấy item dữ liệu đối tượng cá nhân từ popup
   */
  private selectItemGiayPhep(item: OutputGiayPhepModel) {
    if (item !== null && item !== undefined) {
      this.dangKyKhaiThacChuyenNhuongIOForm.controls.sogiayphep.setValue(item.sogiayphep);
      this.dangKyKhaiThacChuyenNhuongIOForm.controls.idgiayphep.setValue(item.idgiayphep);
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
    this.dangKyKhaiThacChuyenNhuongIOForm = this.formBuilder.group({
      idgiayphep: [DefaultValue.Empty],
      sogiayphep: [DefaultValue.Empty],
      sohopdong: [DefaultValue.Empty],
      ngayhopdong: [DefaultValue.Empty],
      loaidoituong: [DefaultValue.Empty],
      idcanhantochuc: [DefaultValue.Empty,  ],
      tencanhantochuc: [DefaultValue.Empty,  ],
      sogiayto: [DefaultValue.Empty,  ],
      sogiaytoDisplay: [DefaultValue.Empty],
      loaigiayto: [DefaultValue.Empty,  ],
      loaigiaytoDisplay: [DefaultValue.Empty],
      ngaycap: [DefaultValue.Empty,  ],
      ngaycapDisplay: [DefaultValue.Empty],
      noicap: [DefaultValue.Empty,  ],
      noicapDisplay: [DefaultValue.Empty],
      diachi: [DefaultValue.Empty,  ],
      diachiDisplay: [DefaultValue.Empty],
      dienthoai: [DefaultValue.Empty, Validators.pattern("^[0-9-+]+$")],
      fax: [DefaultValue.Empty],
      email: [DefaultValue.Empty],
      website: [DefaultValue.Empty],
    });
    this.dangKyKhaiThacChuyenNhuongIOForm.controls.sogiayphep.disable({onlySelf: true});
    this.dangKyKhaiThacChuyenNhuongIOForm.controls.tencanhantochuc.disable({ onlySelf: true });
    this.dangKyKhaiThacChuyenNhuongIOForm.controls.loaigiaytoDisplay.disable({ onlySelf: true });
    this.dangKyKhaiThacChuyenNhuongIOForm.controls.sogiaytoDisplay.disable({ onlySelf: true });
    this.dangKyKhaiThacChuyenNhuongIOForm.controls.ngaycapDisplay.disable({ onlySelf: true });
    this.dangKyKhaiThacChuyenNhuongIOForm.controls.noicapDisplay.disable({ onlySelf: true });
    this.dangKyKhaiThacChuyenNhuongIOForm.controls.diachiDisplay.disable({ onlySelf: true });
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
  private async formOnEdit(item: OutputDkThamDoChuyenNhuongModel) {
    if (this.currentAction === DangKyKhaiThacKsActionEnum.Edit && item) {
      this.dangKyKhaiThacChuyenNhuongIOForm.setValue({
        idgiayphep: item.idgiayphep,
        sogiayphep: item.sogiayphep,
        sohopdong: item.sohopdong,
        ngayhopdong: item.ngayhopdong,
        loaidoituong: item.loaidoituong,
        idcanhantochuc: item.idcanhantochuc,
        tencanhantochuc: item.tencanhantochuc,
        sogiayto: item.sogiayto,
        sogiaytoDisplay: item.sogiayto,
        loaigiayto: item.loaigiayto,
        loaigiaytoDisplay: item.loaigiayto,
        ngaycap: item.ngaycap,
        ngaycapDisplay:  item.ngaycap,
        noicap: item.noicap,
        noicapDisplay: item.noicap,
        diachi: item.diachi,
        diachiDisplay: item.diachi,
        dienthoai: item.dienthoai,
        fax: item.fax,
        email: item.email,
        website: item.website,
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
   * Lấy dữ liệu hồ sơ theo IdHoSo
   * @param idHoSo
   */
  private async getDangKyKhaiThacChuyenNhuongByIdHoSo(idHoSo: string) {
    const dkKhaiThacChuyenNhuongService = this.dangKyHoatDongKhoangSanFacadeService.getDangKyKhaiThacChuyenNhuongService();
    const dangKyItem = await dkKhaiThacChuyenNhuongService.getFetchAll({Idhoso: idHoSo});
    return dangKyItem;
  }

  /**
   * Lưu dữ liệu đăng ký khai thác điều chỉnh
   */
  async saveItemDangKyKhaiThacChuyenNhuong() {
    this.logAllValidationErrorMessages();

    if (!this.dangKyKhaiThacChuyenNhuongIOForm.valid) {
      return;
    }

    // Gán dữ liệu input vào model
    const dkKhaiThacChuyenNhuongService = this.dangKyHoatDongKhoangSanFacadeService.getDangKyKhaiThacChuyenNhuongService();
    const inputModel = this.dangKyKhaiThacChuyenNhuongIOForm.value;
    inputModel.idhoso = this.idhoso;
    inputModel.tencanhantochuc = this.dangKyKhaiThacChuyenNhuongIOForm.controls.tencanhantochuc.value;
    if (this.currentAction === DangKyKhaiThacKsActionEnum.Add) {
      dkKhaiThacChuyenNhuongService.addItem(inputModel).subscribe(
        async (res) => {
          this.dangKyKhaiThacChuyenNhuong = inputModel;
          this.dangKyKhaiThacChuyenNhuong.iddangkykhaithac = res.iddangkykhaithac;
          this.currentAction = DangKyKhaiThacKsActionEnum.Edit;
          this.selectCurrentFormState();
          this.selectIdDangKyKhaiThacChuyenNhuong();
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
      inputModel.iddangkykhaithac = this.dangKyKhaiThacChuyenNhuong.iddangkykhaithac;
      dkKhaiThacChuyenNhuongService.updateItem(inputModel).subscribe(
        async (res) => {
          this.dangKyKhaiThacChuyenNhuong = inputModel;
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
      this.dangKyKhaiThacChuyenNhuongIOForm,
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
  private selectIdDangKyKhaiThacChuyenNhuong() {
    this.selectIdDangKyChuyenNhuongEvent.emit(this.dangKyKhaiThacChuyenNhuong.iddangkykhaithac);
  }

  /**
   * Xóa item đăng ký khai thác điều chỉnh
   */
  deleteItemDangKyKhaiThacChuyenNhuong() {
    const dialogRef = this.commonService.confirmDeleteDiaLogService(
      this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkythamdochuyennhuong.contentDelete,
      this.dangKyKhaiThacChuyenNhuong.sohopdong
    );
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === "confirm") {
        await this.dangKyHoatDongKhoangSanFacadeService
          .getDangKyKhaiThacChuyenNhuongService()
          .deleteItem({iddangkykhaithac: this.dangKyKhaiThacChuyenNhuong.iddangkykhaithac})
          .subscribe(
            () => {
              this.dangKyKhaiThacChuyenNhuong = null;
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
    this.dangKyKhaiThacChuyenNhuongIOForm.reset({
      idgiayphep: "",
      sogiayphep: "",
    });
  }

  // Hàm dùng để gọi các hàm khác, truyền vào tên hàm cần thực thi
  doFunction(methodName, obj) {
    this[methodName](obj);
  }

  /**
   * Thay đổi loại đối tượng trên form
   */
  selectItemLoaiDoiTuongChange() {
    this.ClearThongTinCaNhanToChucOnUI();
  }

  /**
   * CLear dữ liệu thông tin cá nhân tổ chức trên form UI
   */
  private ClearThongTinCaNhanToChucOnUI() {
    this.dangKyKhaiThacChuyenNhuongIOForm.controls.idcanhantochuc.setValue(DefaultValue.Empty);
    this.dangKyKhaiThacChuyenNhuongIOForm.controls.tencanhantochuc.setValue(DefaultValue.Empty);
    this.dangKyKhaiThacChuyenNhuongIOForm.controls.loaigiayto.setValue(DefaultValue.Empty);
    this.dangKyKhaiThacChuyenNhuongIOForm.controls.loaigiaytoDisplay.setValue(DefaultValue.Empty);
    this.dangKyKhaiThacChuyenNhuongIOForm.controls.sogiayto.setValue(DefaultValue.Empty);
    this.dangKyKhaiThacChuyenNhuongIOForm.controls.sogiaytoDisplay.setValue(DefaultValue.Empty);
    this.dangKyKhaiThacChuyenNhuongIOForm.controls.ngaycap.setValue(DefaultValue.Empty);
    this.dangKyKhaiThacChuyenNhuongIOForm.controls.ngaycapDisplay.setValue(DefaultValue.Empty);
    this.dangKyKhaiThacChuyenNhuongIOForm.controls.noicap.setValue(DefaultValue.Empty);
    this.dangKyKhaiThacChuyenNhuongIOForm.controls.noicapDisplay.setValue(DefaultValue.Empty);
    this.dangKyKhaiThacChuyenNhuongIOForm.controls.diachi.setValue(DefaultValue.Empty);
    this.dangKyKhaiThacChuyenNhuongIOForm.controls.diachiDisplay.setValue(DefaultValue.Empty);
    this.dangKyKhaiThacChuyenNhuongIOForm.controls.dienthoai.setValue(DefaultValue.Empty);
  }

  /**
   * khởi tạo thông tin cá nhân tổ chức trên form UI
   */
  private CreateThongTinCaNhanToChucOnUI(item: any, loaiDoiTuong: number) {
    if (loaiDoiTuong !== LoaiDoiTuongEnum.CaNhan && loaiDoiTuong !== LoaiDoiTuongEnum.ToChuc) {
      this.ClearThongTinCaNhanToChucOnUI();
      return;
    }

    this.dangKyKhaiThacChuyenNhuongIOForm.controls.loaidoituong.setValue(loaiDoiTuong);
    this.dangKyKhaiThacChuyenNhuongIOForm.controls.idcanhantochuc.setValue(item.idcanhantochuc);
    this.dangKyKhaiThacChuyenNhuongIOForm.controls.tencanhantochuc.setValue(item.tencanhantochuc);
    this.dangKyKhaiThacChuyenNhuongIOForm.controls.loaigiayto.setValue(item.loaigiayto);
    this.dangKyKhaiThacChuyenNhuongIOForm.controls.loaigiaytoDisplay.setValue(item.loaigiayto);
    this.dangKyKhaiThacChuyenNhuongIOForm.controls.sogiayto.setValue(item.sogiayto);
    this.dangKyKhaiThacChuyenNhuongIOForm.controls.sogiaytoDisplay.setValue(item.sogiayto);
    this.dangKyKhaiThacChuyenNhuongIOForm.controls.ngaycap.setValue(item.ngaycap);
    this.dangKyKhaiThacChuyenNhuongIOForm.controls.ngaycapDisplay.setValue(item.ngaycap);
    this.dangKyKhaiThacChuyenNhuongIOForm.controls.noicap.setValue(item.noicap);
    this.dangKyKhaiThacChuyenNhuongIOForm.controls.noicapDisplay.setValue(item.noicap);
    this.dangKyKhaiThacChuyenNhuongIOForm.controls.diachi.setValue(item.diachi);
    this.dangKyKhaiThacChuyenNhuongIOForm.controls.diachiDisplay.setValue(item.diachi);
    this.dangKyKhaiThacChuyenNhuongIOForm.controls.dienthoai.setValue(item.dienthoai);
  }

  /**
   * lấy item dữ liệu đối tượng cá nhân từ popup
   */
  private selectItemCaNhan(item: OutputDmCanhanModel) {
    if (item !== DefaultValue.Null && item !== DefaultValue.Undefined) {
      const data: any = Object.assign({}, item);
      data.tencanhantochuc = item.hovaten;
      data.idcanhantochuc = item.idcanhan;
      this.CreateThongTinCaNhanToChucOnUI(data, LoaiDoiTuongEnum.CaNhan);
    }
  }

  /**
   * lấy item dữ liệu đối tượng tổ chức từ popup
   */
  private selectItemToChuc(item: OutputDmToChucModel) {
    if (item !== DefaultValue.Null && item !== DefaultValue.Undefined) {
      const data: any = Object.assign({}, item);
      data.tencanhantochuc = item.tentochuc;
      data.idcanhantochuc = item.idtochuc;
      this.CreateThongTinCaNhanToChucOnUI(data,  LoaiDoiTuongEnum.ToChuc);
    }
  }

  /**
   * Hàm mở sidenav
   */
  openIOSidenav() {
    // clear Sidenav
    this.matSidenavService.clearSidenav();
    // Khởi tạo sidenav
    this.matSidenavService.setSidenav(this.matSidenav, this, this.content, this.cfr);
    const loaiDoiTuong = this.dangKyKhaiThacChuyenNhuongIOForm.controls.loaidoituong.value;

    if (loaiDoiTuong === LoaiDoiTuongEnum.CaNhan) {
      this.matSidenavService.setTitle(this.dataTranslate.DANHMUC.canhan.titleSelect);
      this.matSidenavService.setContentComp(DmCanhanOptionComponent, "select");
      this.matSidenavService.open();
    } else if (loaiDoiTuong === LoaiDoiTuongEnum.ToChuc) {
      this.matSidenavService.setTitle(this.dataTranslate.DANHMUC.tochuc.titleSelect);
      this.matSidenavService.setContentComp(DmTochucOptionComponent, "select");
      this.matSidenavService.open();
    } else {
      const informationDialogRef = this.commonService.informationDiaLogService(
        DefaultValue.Empty,
        this.dataTranslate.HOSOGIAYTO.hoso.chonloaidoituongRequiredDialog,
        this.dataTranslate.HOSOGIAYTO.hoso.informedDialogTitle,
      );
    }
  }

  /**
   * Hàm đóng sidenav
   */
  closeIOSidenav() {
    this.matSidenavService.close();
  }

}
