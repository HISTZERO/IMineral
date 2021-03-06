import { Component, OnInit, Input, ViewContainerRef, ViewChild, ComponentFactoryResolver, EventEmitter, Output, Type } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DangKyThamDoActionEnum } from 'src/app/shared/constants/enum';
import { DmFacadeService } from "src/app/services/admin/danhmuc/danhmuc-facade.service";
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { DangKyHoatDongKhoangSanFacadeService } from 'src/app/services/admin/dangkyhoatdongkhoangsan/dangkyhoatdongkhoangsan-facade.service';
import { CommonServiceShared } from 'src/app/services/utilities/common-service';
import { validationAllErrorMessagesService } from "src/app/services/utilities/validatorService";
import { OutputDmHeQuyChieuModel } from 'src/app/models/admin/danhmuc/hequychieu.model';
import { DangKhoangSan, DonViDienTich } from 'src/app/shared/constants/common-constants';
import { MatSidenav } from '@angular/material';
import { MatsidenavService } from 'src/app/services/utilities/matsidenav.service';
import { GiayphepOptionComponent } from 'src/app/features/admin/hosogiayto/giayphep/giayphep-option/giayphep-option.component';
import { OutputGiayPhepModel } from 'src/app/models/admin/hosogiayto/giayphep.model';
import { OutputDkThamDoGiaHanModel } from "src/app/models/admin/dangkyhoatdongkhoangsan/dangkythamdo/dkthamdogiahan.model";
import { DefaultValue } from 'src/app/shared/constants/global-var';

@Component({
  selector: 'app-dangkythamdogiahan-io',
  templateUrl: './dangkythamdogiahan-io.component.html',
  styleUrls: ['./dangkythamdogiahan-io.component.scss']
})
export class DangkythamdogiahanIoComponent implements OnInit {
  @ViewChild(Type, { static: true }) public matSidenav: MatSidenav;
  @ViewChild(Type, { read: ViewContainerRef, static: true }) public content: ViewContainerRef;
  // tslint:disable-next-line: no-output-rename
  @Output("selectCurrentFormStateEvent") selectCurrentFormStateEvent: EventEmitter<number> = new EventEmitter();
   // tslint:disable-next-line: no-output-rename
  @Output("selectIdDangKyThamDoEvent") selectIdDangKyThamDoEvent: EventEmitter<string> = new EventEmitter();
  // tslint:disable-next-line: no-output-rename
  @Output("selectHeQuyChieuEvent") selectHeQuyChieuEvent: EventEmitter<string> = new EventEmitter();
  // Output geometry event
  @Output("selectGeometryEvent") selectGeometryEvent: EventEmitter<any> = new EventEmitter();
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
  // chứa dữ liệu đăng ký thăm dò
  private dangKyThamDoGiaHan: OutputDkThamDoGiaHanModel;
  // Dạng khoáng sản
  public dangKhoangSanList = DangKhoangSan;
  // chứa dữ liệu Id Hồ sơ
  public idhoso: string;
  // Action thao tác dữ liệu
  public currentAction: number;
  // Action đăng ký thăm dò
  public ActionType = DangKyThamDoActionEnum;
  // disable delete button
  public disabledDeleteButton = false;
  // disable control hệ quy chiếu
  public disabledHeQuyChieu = false;
  // lưu dữ liệu đơn vị diện tích
  public donViDienTichList = DonViDienTich;
  // Lưu tên hệ quy chiếu sử dụng hiện tại
  public tenHeQuyChieu = DefaultValue.Empty;
  // error message
  validationErrorMessages = {};

  // form errors
  formErrors = {
    dientichcapphep: DefaultValue.Empty,
    dientichthamdo: DefaultValue.Empty,
    dientichtralai: DefaultValue.Empty,
    donvidientich: DefaultValue.Empty,
    giahandenngay: DefaultValue.Empty,
    lydogiahan: DefaultValue.Empty,
    hequychieu: DefaultValue.Empty,
    sogiayphep: DefaultValue.Empty,
    idgiayphep: DefaultValue.Empty,
  };

  constructor(private translate: TranslateService,
              private formBuilder: FormBuilder,
              private dmFacadeService: DmFacadeService,
              private dangKyHoatDongKhoangSanFacadeService: DangKyHoatDongKhoangSanFacadeService,
              public commonService: CommonServiceShared,
              public matSidenavService: MatsidenavService,
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

    if (this.idhoso !== DefaultValue.Null && this.idhoso !== DefaultValue.Undefined && this.idhoso.trim() !== DefaultValue.Empty) {
      this.dangKyThamDoGiaHan = await this.getDangKyThamDoByIdHoSo(this.idhoso);

      if (this.dangKyThamDoGiaHan) {
        this.selectGeometryEvent.emit(this.dangKyThamDoGiaHan.geowgs);
        this.currentAction = DangKyThamDoActionEnum.Edit;
        this.selectIdDangKyThamDo();
        this.selectHeQuyChieu();
        this.selectCurrentFormState();
      } else {
        this.currentAction = DangKyThamDoActionEnum.Add;
        this.selectCurrentFormState();
      }
    } else {
      this.currentAction = DangKyThamDoActionEnum.None;
      return;
    }

    // Lấy dữ liệu hệ quy chiếu
    await this.geAllHeQuyChieu();
    // Khởi tạo dữ liệu form trong trường hợp sửa dữ liệu đăng ký thăm dò
    await this.formOnEdit(this.dangKyThamDoGiaHan);

    return true;
  }

  /**
   * Hàm khởi tạo form
   */
  private formInit() {
    this.dangKyThamDoIOForm = this.formBuilder.group({
      dientichcapphep: [DefaultValue.Empty, [Validators.required, Validators.pattern("^[0-9]+\\.{0,1}\\d{0,2}$")]],
      dientichthamdo: [DefaultValue.Empty, [Validators.required, Validators.pattern("^[0-9]+\\.{0,1}\\d{0,2}$")]],
      dientichtralai: [DefaultValue.Empty,  Validators.pattern("^[0-9]+\\.{0,1}\\d{0,2}$")],
      donvidientich: [DefaultValue.Empty, Validators.required],
      giahandenngay: [DefaultValue.Empty, Validators.required],
      lydogiahan: [DefaultValue.Empty],
      hequychieu: [DefaultValue.Empty, Validators.required],
      sogiayphep: [DefaultValue.Empty, Validators.required],
      idgiayphep: [DefaultValue.Empty, Validators.required]
    });

    this.dangKyThamDoIOForm.controls.sogiayphep.disable({ onlySelf: true });
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
  private async formOnEdit(item: OutputDkThamDoGiaHanModel) {
    if (this.currentAction === DangKyThamDoActionEnum.Edit && item) {
      this.dangKyThamDoIOForm.setValue({
        dientichcapphep: item.dientichcapphep,
        dientichthamdo: item.dientichthamdo,
        dientichtralai: item.dientichtralai,
        donvidientich: item.donvidientich,
        giahandenngay: item.giahandenngay,
        lydogiahan: item.lydogiahan,
        hequychieu: item.hequychieu,
        sogiayphep: item.sogiayphep,
        idgiayphep: item.idgiayphep
      });

      this.showViewOfHeQuyChieu(item);
    }
  }

  private showViewOfHeQuyChieu(item: OutputDkThamDoGiaHanModel) {
    if (item && item.hequychieu !== DefaultValue.Undefined && item.hequychieu !== DefaultValue.Null && item.hequychieu.trim() !== DefaultValue.Empty) {
      this.tenHeQuyChieu = this.getTenHeQuyChieu(item.hequychieu);
    } else {
      this.tenHeQuyChieu = this.getTenHeQuyChieu(DefaultValue.Empty);
    }
  }
  /**
   * Hàm hiển thị tên hệ quy chiếu
   */
  private getTenHeQuyChieu(srid: string) {
    if (this.allHeQuyChieu && this.allHeQuyChieu.length > DefaultValue.Zero) {
      const itemHeQuyChieu = this.allHeQuyChieu.find(item => item.srid === srid);

      if (itemHeQuyChieu) {
        let data = this.dataTranslate.DANHMUC.hequychieu.meridian + DefaultValue.Colon + itemHeQuyChieu.meridian;
        data += DefaultValue.Hyphen + this.dataTranslate.DANHMUC.hequychieu.prjzone + DefaultValue.Colon + itemHeQuyChieu.prjzone;
        return data;
      }
    }

    return DefaultValue.Empty;
  }


  /**
   * Hàm set validate
   */
  private setValidation() {
    this.validationErrorMessages = {
      dientichcapphep: { required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkythamdogiahan.dientichcapphepRequired, pattern: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkythamdogiahan.dientichcapphepFormat },
      dientichthamdo: { required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkythamdogiahan.dientichthamdoRequired, pattern: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkythamdogiahan.dientichthamdoFormat },
      dientichtralai: { pattern: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkythamdogiahan.dientichtralaiFormat },
      donvidientich: { required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkythamdogiahan.donvidientichRequired },
      giahandenngay: { required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkythamdogiahan.giahandenngayRequired },
      hequychieu: { required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkythamdogiahan.hequychieuRequired },
      idgiayphep: { required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkythamdogiahan.idgiayphepRequired },
      sogiayphep: { required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkythamdogiahan.sogiayphepRequired }
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
   * set default hệ quy chiếu
   */

  setDefaultHeQuyChieu(srid: string) {
    if (this.allHeQuyChieu && this.allHeQuyChieu.length > DefaultValue.Zero) {
      const data = this.allHeQuyChieu.find(item => item.srid === srid);

      if (data) {
        this.dangKyThamDoIOForm.controls.hequychieu.setValue(srid);
      }
    }
  }

  /**
   * Lấy dữ liệu hồ sơ theo IdHoSo
   * @param idHoSo
   */
  private async getDangKyThamDoByIdHoSo(idHoSo: string) {
    const thamDoGiahanService = this.dangKyHoatDongKhoangSanFacadeService.getDangKyThamDoGiaHanService();
    const dangKyItem = await thamDoGiahanService.getDangKyThamDoByIdHoSo(idHoSo).toPromise()

    if (dangKyItem) {
      return dangKyItem as OutputDkThamDoGiaHanModel;
    }
    return null;
  }

  openGiayPhepIOSidenav() {
     // clear Sidenav
     this.matSidenavService.clearSidenav();
     // Khởi tạo sidenav
     this.matSidenavService.setSidenav(this.matSidenav, this, this.content, this.cfr);
     this.matSidenavService.setTitle(this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkythamdogiahan.titleGiayPhepSelect);
     this.matSidenavService.setContentComp(GiayphepOptionComponent, "select");
     this.matSidenavService.open();
  }

  /**
   * Lấy dữ liệu hồ sơ theo idGiayPhep
   * @param idGiayPhep
   */

  private async cloneThongTinDangKyThamDoFromGiayPhepLS(idGiayPhep: string) {
    const thamDoGiahanService = this.dangKyHoatDongKhoangSanFacadeService.getDangKyThamDoGiaHanService();
    const cpThamDoItem = await thamDoGiahanService.cloneThongTinDangKyThamDoFromGiayPhepLS(idGiayPhep).toPromise();

    if (cpThamDoItem) {
      return cpThamDoItem as OutputDkThamDoGiaHanModel;
    }
    return null;
  }

  /**
   * lấy item dữ liệu đối tượng cá nhân từ popup
   */
  private async selectItemGiayPhep(item: OutputGiayPhepModel) {
    if (item !== DefaultValue.Null && item !== DefaultValue.Undefined) {
      this.dangKyThamDoIOForm.controls.sogiayphep.setValue(item.sogiayphep);
      this.dangKyThamDoIOForm.controls.idgiayphep.setValue(item.idgiayphep);

      const data = await this.cloneThongTinDangKyThamDoFromGiayPhepLS(item.idgiayphep);

      if (data) {
        this.dangKyThamDoIOForm.controls.donvidientich.setValue(data.donvidientich);
        this.dangKyThamDoIOForm.controls.dientichtralai.setValue(data.dientichtralai);
        this.dangKyThamDoIOForm.controls.dientichthamdo.setValue(data.dientichthamdo);
        this.dangKyThamDoIOForm.controls.dientichcapphep.setValue(data.dientichcapphep);
        this.dangKyThamDoIOForm.controls.hequychieu.setValue(data.hequychieu);
      }
    }
  }

  async saveItemDangKyThamDo() {
    this.logAllValidationErrorMessages();

    if (!this.dangKyThamDoIOForm.valid) {
      return;
    }

    // Gán dữ liệu input vào model
    const dkThamDoGiaHanFacadeService = this.dangKyHoatDongKhoangSanFacadeService.getDangKyThamDoGiaHanService();
    const inputModel = this.dangKyThamDoIOForm.value;
    inputModel.idhoso = this.idhoso;
    if (this.currentAction === DangKyThamDoActionEnum.Add) {
      dkThamDoGiaHanFacadeService.addItem(inputModel).subscribe(
        async (res) => {
          this.dangKyThamDoGiaHan = inputModel;
          this.dangKyThamDoGiaHan.iddangkythamdo = res.iddangkythamdo;
          this.currentAction = DangKyThamDoActionEnum.Edit;
          this.selectCurrentFormState();
          this.selectIdDangKyThamDo();
          this.showViewOfHeQuyChieu(this.dangKyThamDoGiaHan);
          this.selectHeQuyChieu();
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
      inputModel.iddangkythamdo = this.dangKyThamDoGiaHan.iddangkythamdo;
      dkThamDoGiaHanFacadeService.updateItem(inputModel).subscribe(
        async (res) => {
          this.currentAction = DangKyThamDoActionEnum.Edit;
          this.selectCurrentFormState();
          this.showViewOfHeQuyChieu(this.dangKyThamDoGiaHan);
          this.selectHeQuyChieu();
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
    if (this.currentAction === DangKyThamDoActionEnum.Edit) {
      this.disabledDeleteButton = false;
    } else {
      this.disabledDeleteButton = true;
    }

    this.selectCurrentFormStateEvent.emit(this.currentAction);
  }

  /**
   * lấy thông tin id hồ sơ sau khi thêm mới một hồ sơ
   */
  private selectIdDangKyThamDo() {
    this.selectIdDangKyThamDoEvent.emit(this.dangKyThamDoGiaHan.iddangkythamdo);
  }

  /**
   * lấy thông tin id hồ sơ sau khi thêm mới một hồ sơ
   */
  private selectHeQuyChieu() {
    if (this.dangKyThamDoGiaHan) {
      this.selectHeQuyChieuEvent.emit(this.dangKyThamDoGiaHan.hequychieu);
    } else {
      this.selectHeQuyChieuEvent.emit(DefaultValue.Empty);
    }
  }

  /**
   * Xóa đăng ky thăm do theo ID hồ sơ
   */
  deleteItemDangKyThamDoGiaHan() {
    const dialogRef = this.commonService.confirmDeleteDiaLogService(
      this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkythamdogiahan.contentDelete,
      this.dangKyThamDoGiaHan.sogiayphep
    );
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === "confirm") {
        await this.dangKyHoatDongKhoangSanFacadeService
          .getDangKyThamDoGiaHanService()
          .deleteDangKyThamDoByIdHoSo(this.idhoso)
          .subscribe(
            () => {
              this.dangKyThamDoGiaHan = null;
              this.currentAction = DangKyThamDoActionEnum.Add;
              this.onFormReset();
              this.selectCurrentFormState();
              this.showViewOfHeQuyChieu(this.dangKyThamDoGiaHan);
              this.selectHeQuyChieu();
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
    this.dangKyThamDoIOForm.reset();
  }

  // Hàm dùng để gọi các hàm khác, truyền vào tên hàm cần thực thi
  doFunction(methodName, obj) {
    this[methodName](obj);
  }
}
