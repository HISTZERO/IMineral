import { Component, OnInit, Input, ComponentFactoryResolver, EventEmitter, Output, ViewChild, Type, ViewContainerRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSidenav } from "@angular/material";

import { DangKyHoatDongKhoangSanFacadeService } from 'src/app/services/admin/dangkyhoatdongkhoangsan/dangkyhoatdongkhoangsan-facade.service';
import { DangKyThamDoTraLaiActionEnum, DangKyTraLaiGiayPhepActionEnum } from 'src/app/shared/constants/enum';
import { CommonServiceShared } from 'src/app/services/utilities/common-service';
import { validationAllErrorMessagesService } from "src/app/services/utilities/validatorService";
import { GiayphepOptionComponent } from "src/app/features/admin/hosogiayto/giayphep/giayphep-option/giayphep-option.component";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { OutputGiayPhepModel } from "src/app/models/admin/hosogiayto/giayphep.model";
import { OutputDkThamDoTraLaiModel } from "src/app/models/admin/dangkyhoatdongkhoangsan/dangkytralai/dkthamdotralai.model";
import { OutputDmHeQuyChieuModel } from "src/app/models/admin/danhmuc/hequychieu.model";
import { DmFacadeService } from "src/app/services/admin/danhmuc/danhmuc-facade.service";
import { DonViDienTich } from "src/app/shared/constants/common-constants";
import { DefaultValue } from "src/app/shared/constants/global-var";

@Component({
  selector: 'app-tlgp-thamdotralai-io',
  templateUrl: './tlgp-thamdotralai-io.component.html',
  styleUrls: ['./tlgp-thamdotralai-io.component.scss']
})
export class TlgpThamdotralaiIoComponent implements OnInit {

  @ViewChild(Type, { static: true }) public matSidenav: MatSidenav;
  @ViewChild(Type, { read: ViewContainerRef, static: true }) public content: ViewContainerRef;


  // tslint:disable-next-line: no-output-rename
  @Output("selectCurrentFormStateEvent") selectCurrentFormStateEvent: EventEmitter<number> = new EventEmitter();

  // tslint:disable-next-line: no-output-rename
  @Output("selectIdDangKyTraLaiEvent") selectIdDangKyTraLaiEvent: EventEmitter<string> = new EventEmitter();

  // tslint:disable-next-line: no-input-rename
  @Input("allowAutoInit") allowAutoInit = true;

  // Output geometry event
  @Output("selectGeometryEvent") selectGeometryEvent: EventEmitter<any> = new EventEmitter();

  // Chứa dữ liệu Form
  public dangKyThamDoTraLaiIOForm: FormGroup;

  // Chứa dữ liệu translate
  public dataTranslate: any;

  // chứa dữ liệu Id Hồ sơ
  public idhoso: string;

  // chứa dữ liệu đăng ký trả lại giấy phép thăm dò
  private dangKyThamDoTraLai: any;

  // Action thao tác dữ liệu
  public currentAction: number;

  // Action đăng ký thăm dò trả lại
  public ActionType = DangKyThamDoTraLaiActionEnum;

  // Chứa danh sách Hệ quy chiếu
  public allHeQuyChieu: OutputDmHeQuyChieuModel[];
  public HeQuyChieuFilters: OutputDmHeQuyChieuModel[];

  // lưu dữ liệu đơn vị diện tích
  public donViDienTichList = DonViDienTich;

  // Chứa giá trị xác định loại thăm dò trả lại
  public isTraLaiDienTichThamDo: boolean = false;

  // disable delete button
  public disabledDeleteButton = false;

  // error message
  validationErrorMessages = {};

  // form errors
  formErrors = {
    dientichthamdo: DefaultValue.Empty,
    dientichtralai: DefaultValue.Empty,
    donvidientich: DefaultValue.Empty,
    lydotralai: DefaultValue.Empty,
    hequychieu: DefaultValue.Empty,
    idgiayphep: DefaultValue.Empty,
    sogiayphep: DefaultValue.Empty
  };

  constructor(
    private translate: TranslateService,
    private formBuilder: FormBuilder,
    private dangKyHoatDongKhoangSanFacadeService: DangKyHoatDongKhoangSanFacadeService,
    public commonService: CommonServiceShared,
    private activatedRoute: ActivatedRoute,
    public cfr: ComponentFactoryResolver,
    public matSidenavService: MatsidenavService,
    private dmFacadeService: DmFacadeService,
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
      this.dangKyThamDoTraLai = await this.getDangKyThamDoTraLaiByIdHoSo(this.idhoso);

      if (this.dangKyThamDoTraLai) {
        this.selectGeometryEvent.emit(this.dangKyThamDoTraLai.geowgs);
        this.currentAction = DangKyTraLaiGiayPhepActionEnum.Edit;
        this.selectIdDangKyThamDoTraLai();
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
    await this.formOnEdit(this.dangKyThamDoTraLai);

    return true;
  }

  /**
   * Hàm khởi tạo form
   */
  private formInit() {
    this.dangKyThamDoTraLaiIOForm = this.formBuilder.group({
      dientichthamdo: [DefaultValue.Empty, [Validators.required, Validators.pattern("^[0-9-+]+$")]],
      dientichtralai: [DefaultValue.Empty, [Validators.required, Validators.pattern("^[0-9-+]+$")]],
      donvidientich: [DefaultValue.Empty, Validators.required],
      lydotralai: [DefaultValue.Empty],
      idgiayphep: [DefaultValue.Empty, Validators.required],
      sogiayphep: [DefaultValue.Empty, Validators.required],
      hequychieu: [DefaultValue.Empty, Validators.required]
    });
    this.dangKyThamDoTraLaiIOForm.controls.sogiayphep.disable({ onlySelf: true });
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
   * Hàm set value cho form
   */
  private async formOnEdit(item: OutputDkThamDoTraLaiModel) {
    if (this.currentAction === DangKyTraLaiGiayPhepActionEnum.Edit && item) {
      this.dangKyThamDoTraLaiIOForm.setValue({
        dientichthamdo: item.dientichthamdo,
        dientichtralai: item.dientichtralai,
        donvidientich: item.donvidientich,
        lydotralai: item.lydotralai,
        idgiayphep: item.idgiayphep,
        sogiayphep: item.sogiayphep,
        hequychieu: item.hequychieu
      });
    }
  }

  /**
   * Hàm set validate
   */
  private setValidation() {
    this.validationErrorMessages = {
      dientichthamdo: { required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkythamdotralai.dientichthamdoRequired, pattern: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkythamdotralai.numberRequired },
      dientichtralai: { required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkythamdotralai.dientichtralaiRequired, pattern: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkythamdotralai.numberRequired },
      donvidientich: { required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkythamdotralai.donvidientichRequired },
      idgiayphep: { required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkythamdotralai.sogiayphepRequired },
      sogiayphep: { required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkythamdotralai.sogiayphepRequired },
      hequychieu: { required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkythamdotralai.hequychieuRequired },
    };
  }


  /**
   * Lấy dữ liệu hồ sơ theo IdHoSo
   * @param idHoSo
   */
  private async getDangKyThamDoTraLaiByIdHoSo(idHoSo: string) {
    const dkThamDoTraLaiService = this.dangKyHoatDongKhoangSanFacadeService.getDangKyThamDoTraLaiService();
    const dangKyItem = await dkThamDoTraLaiService.getFetchAll({ idhoso: idHoSo });
    return dangKyItem;
  }

  /**
   * Lưu dữ liệu đăng ký thăm dò trả lại giấy phép
   */
  async saveItemDangKyThamDo() {
    this.logAllValidationErrorMessages();

    if (!this.dangKyThamDoTraLaiIOForm.valid) {
      return;
    }

    // Gán dữ liệu input vào model
    const dkThamDoTraLaiService = this.dangKyHoatDongKhoangSanFacadeService.getDangKyThamDoTraLaiService();
    const inputModel = this.dangKyThamDoTraLaiIOForm.value;
    inputModel.idhoso = this.idhoso;
    if (this.currentAction === DangKyThamDoTraLaiActionEnum.Add) {
      dkThamDoTraLaiService.addItem(inputModel).subscribe(
        async (res) => {
          this.dangKyThamDoTraLai = inputModel;
          this.dangKyThamDoTraLai.iddangkythamdo = res.iddangkythamdo;
          this.currentAction = DangKyThamDoTraLaiActionEnum.Edit;
          this.selectCurrentFormState();
          this.selectIdDangKyThamDoTraLai();
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
    } else if (this.currentAction === DangKyThamDoTraLaiActionEnum.Edit) {
      inputModel.iddangkythamdo = this.dangKyThamDoTraLai.iddangkythamdo;
      dkThamDoTraLaiService.updateItem(inputModel).subscribe(
        async (res) => {
          this.dangKyThamDoTraLai = inputModel;
          this.currentAction = DangKyThamDoTraLaiActionEnum.Edit;
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
    this.matSidenavService.setTitle(this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkythamdotralai.titleGiayPhepSelect);
    this.matSidenavService.setContentComp(GiayphepOptionComponent, "select");
    this.matSidenavService.open();
  }

  /**
   * Lấy dữ liệu hồ sơ theo idGiayPhep
   * @param idGiayPhep
   */
  private async cloneThongTinDangKyThamDoTraLaiFromGiayPhepLS(idGiayPhep: string) {
    const thamDoTraLaiService = this.dangKyHoatDongKhoangSanFacadeService.getDangKyThamDoTraLaiService();
    const dkThamDoTraLaiItem = await thamDoTraLaiService.cloneThongTinDangKyThamDoTraLaiFromGiayPhepLS(idGiayPhep).toPromise();

    if (dkThamDoTraLaiItem) {
      return dkThamDoTraLaiItem as OutputDkThamDoTraLaiModel;
    }
    return null;
  }

  /**
   * lấy item dữ liệu đối tượng cá nhân từ popup
   */
  async selectItemGiayPhep(item: OutputGiayPhepModel) {
    if (item !== null && item !== undefined) {
      this.dangKyThamDoTraLaiIOForm.controls.sogiayphep.setValue(item.sogiayphep);
      this.dangKyThamDoTraLaiIOForm.controls.idgiayphep.setValue(item.idgiayphep);

      const data = await this.cloneThongTinDangKyThamDoTraLaiFromGiayPhepLS(item.idgiayphep);

      if (data) {
        this.dangKyThamDoTraLaiIOForm.controls.dientichthamdo.setValue(data.dientichthamdo);
        this.dangKyThamDoTraLaiIOForm.controls.dientichtralai.setValue(data.dientichtralai);
        this.dangKyThamDoTraLaiIOForm.controls.donvidientich.setValue(data.donvidientich);
        this.dangKyThamDoTraLaiIOForm.controls.lydotralai.setValue(data.lydotralai);
        this.dangKyThamDoTraLaiIOForm.controls.hequychieu.setValue(data.hequychieu);
      }
    }
  }

  /**
   * Hàm kiểm tra validation form
   */
  private logAllValidationErrorMessages() {
    validationAllErrorMessagesService(
      this.dangKyThamDoTraLaiIOForm,
      this.validationErrorMessages,
      this.formErrors
    );
  }

  /**
   * Select inserted state of form
   */
  private selectCurrentFormState() {
    if (this.currentAction === DangKyThamDoTraLaiActionEnum.Edit) {
      this.disabledDeleteButton = false;
    } else {
      this.disabledDeleteButton = true;
    }

    this.selectCurrentFormStateEvent.emit(this.currentAction);
  }

  /**
   * Lấy thông tin id hồ sơ sau khi thêm mới một hồ sơ
   */
  private selectIdDangKyThamDoTraLai() {
    this.selectIdDangKyTraLaiEvent.emit(this.dangKyThamDoTraLai.iddangkythamdo);
  }

  /**
   * Xóa item đăng ký thăm dò khoáng sản
   */
  deleteItemDangKyThamDoTraLai() {
    const dialogRef = this.commonService.confirmDeleteDiaLogService(
      this.isTraLaiDienTichThamDo ? this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkythamdotralai.contentDeleteTraLaiDienTich : this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkythamdotralai.contentDelete,
      ""
    );
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === "confirm") {
        await this.dangKyHoatDongKhoangSanFacadeService
          .getDangKyThamDoTraLaiService()
          .deleteItem({ iddangkythamdo: this.dangKyThamDoTraLai.iddangkythamdo })
          .subscribe(
            () => {
              this.dangKyThamDoTraLai = null;
              this.currentAction = DangKyThamDoTraLaiActionEnum.Add;
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
    this.dangKyThamDoTraLaiIOForm.reset({
      dientichthamdo: "",
      dientichtralai: "",
      donvidientich: "",
      lydotralai: "",
      hequychieu: "",
      idgiayphep: "",
      sogiayphep: ""
    });
  }


  // Hàm dùng để gọi các hàm khác, truyền vào tên hàm cần thực thi
  doFunction(methodName, obj) {
    this[methodName](obj);
  }

}
