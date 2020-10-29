import { Component, OnInit, Input, ComponentFactoryResolver, EventEmitter, Output, ViewChild, Type, ViewContainerRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSidenav } from "@angular/material";

import { DangKyHoatDongKhoangSanFacadeService } from 'src/app/services/admin/dangkyhoatdongkhoangsan/dangkyhoatdongkhoangsan-facade.service';
import { DangKyKhaiThacTraLaiActionEnum, DangKyTraLaiGiayPhepActionEnum } from 'src/app/shared/constants/enum';
import { CommonServiceShared } from 'src/app/services/utilities/common-service';
import { validationAllErrorMessagesService } from "src/app/services/utilities/validatorService";
import { OutputDkKhaiThacTraLaiModel } from "src/app/models/admin/dangkyhoatdongkhoangsan/dangkytralai/dkkhaithactralai.model";
import { GiayphepOptionComponent } from "src/app/features/admin/hosogiayto/giayphep/giayphep-option/giayphep-option.component";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { OutputGiayPhepModel } from "src/app/models/admin/hosogiayto/giayphep.model";
import { OutputDmHeQuyChieuModel } from "src/app/models/admin/danhmuc/hequychieu.model";
import { DonViDienTich } from "src/app/shared/constants/common-constants";
import { DmFacadeService } from "src/app/services/admin/danhmuc/danhmuc-facade.service";

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
  @Output("selectIdDangKyTraLaiEvent") selectIdDangKyTraLaiEvent: EventEmitter<string> = new EventEmitter();

  // tslint:disable-next-line: no-input-rename
  @Input("allowAutoInit") allowAutoInit = true;

  // Output geometry event
  @Output("selectGeometryEvent") selectGeometryEvent: EventEmitter<any> = new EventEmitter();

  // Chứa dữ liệu Form
  public dangKyKhaiThacTraLaiIOForm: FormGroup;

  // Chứa dữ liệu translate
  public dataTranslate: any;

  // chứa dữ liệu Id Hồ sơ
  public idhoso: string;

  // chứa dữ liệu đăng ký khai thác trả lại
  private dangKyKhaiThacTraLai: any;

  // Action thao tác dữ liệu
  public currentAction: number;

  // Action đăng ký khai thác trả lại
  public ActionType = DangKyKhaiThacTraLaiActionEnum;

  // disable delete button
  public disabledDeleteButton = false;

  // Chứa giá trị xác định loại khai thác trả lại
  public isTraLaiDienTichKhaiThac: boolean = false;

  // Chứa danh sách Hệ quy chiếu
  public allHeQuyChieu: OutputDmHeQuyChieuModel[];
  public HeQuyChieuFilters: OutputDmHeQuyChieuModel[];

  // lưu dữ liệu đơn vị diện tích
  public donViDienTichList = DonViDienTich;

  // error message
  validationErrorMessages = {};

  // form errors
  formErrors = {
    dientichdacapphep: "",
    dientichkhaithac: "",
    dientichtralai: "",
    donvidientich: "",
    lydotralai: "",
    idgiayphep: "",
    sogiayphep: "",
    hequychieu: ""
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
        this.selectGeometryEvent.emit(this.dangKyKhaiThacTraLai.geowgs);
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
      idgiayphep: [""],
      sogiayphep: ["", Validators.required],
      hequychieu: [""]
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
  private async getDangKyKhaiThacTraLaiByIdHoSo(idHoSo: string) {
    const dkKhaiThacTraLaiService = this.dangKyHoatDongKhoangSanFacadeService.getDangKyKhaiThacTraLaiService();
    const dangKyItem = await dkKhaiThacTraLaiService.getFetchAll({ idhoso: idHoSo });
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
    if (this.currentAction === DangKyKhaiThacTraLaiActionEnum.Add) {
      dkKhaiThacKhoangSanService.addItem(inputModel).subscribe(
        async (res) => {
          this.dangKyKhaiThacTraLai = inputModel;
          this.dangKyKhaiThacTraLai.iddangkykhaithac = res.iddangkykhaithac;
          this.currentAction = DangKyKhaiThacTraLaiActionEnum.Edit;
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
    } else if (this.currentAction === DangKyKhaiThacTraLaiActionEnum.Edit) {
      inputModel.iddangkykhaithac = this.dangKyKhaiThacTraLai.iddangkykhaithac;
      dkKhaiThacKhoangSanService.updateItem(inputModel).subscribe(
        async (res) => {
          this.dangKyKhaiThacTraLai = inputModel;
          this.currentAction = DangKyKhaiThacTraLaiActionEnum.Edit;
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
    this.matSidenavService.setTitle(this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkykhaithactralai.titleGiayPhepSelect);
    this.matSidenavService.setContentComp(GiayphepOptionComponent, "select");
    this.matSidenavService.open();
  }

  /**
   * Lấy dữ liệu hồ sơ theo idGiayPhep
   * @param idGiayPhep
   */
  private async cloneThongTinDangKyKhaiThacTraLaiFromGiayPhepLS(idGiayPhep: string) {
    const khaiThacTraLaiService = this.dangKyHoatDongKhoangSanFacadeService.getDangKyKhaiThacTraLaiService();
    const dkKhaiThacTraLaiItem = await khaiThacTraLaiService.cloneThongTinDangKyKhaiThacTraLaiFromGiayPhepLS(idGiayPhep).toPromise();

    if (dkKhaiThacTraLaiItem) {
      return dkKhaiThacTraLaiItem as OutputDkKhaiThacTraLaiModel;
    }
    return null;
  }

  /**
   * lấy item dữ liệu đối tượng cá nhân từ popup
   */
  async selectItemGiayPhep(item: OutputGiayPhepModel) {
    if (item !== null && item !== undefined) {
      this.dangKyKhaiThacTraLaiIOForm.controls.sogiayphep.setValue(item.sogiayphep);
      this.dangKyKhaiThacTraLaiIOForm.controls.idgiayphep.setValue(item.idgiayphep);

      const data = await this.cloneThongTinDangKyKhaiThacTraLaiFromGiayPhepLS(item.idgiayphep);

      if (data) {
        this.dangKyKhaiThacTraLaiIOForm.controls.dientichdacapphep.setValue(data.dientichdacapphep);
        this.dangKyKhaiThacTraLaiIOForm.controls.dientichkhaithac.setValue(data.dientichkhaithac);
        this.dangKyKhaiThacTraLaiIOForm.controls.dientichtralai.setValue(data.dientichtralai);
        this.dangKyKhaiThacTraLaiIOForm.controls.donvidientich.setValue(data.donvidientich);
        this.dangKyKhaiThacTraLaiIOForm.controls.lydotralai.setValue(data.lydotralai);
        this.dangKyKhaiThacTraLaiIOForm.controls.hequychieu.setValue(data.hequychieu);
      }
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
    if (this.currentAction === DangKyKhaiThacTraLaiActionEnum.Edit) {
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
    this.selectIdDangKyTraLaiEvent.emit(this.dangKyKhaiThacTraLai.iddangkykhaithac);
  }

  /**
   * Xóa item đăng ký khai thác khoáng sản
   */
  deleteItemDangKyKhaiThacTraLai() {
    const dialogRef = this.commonService.confirmDeleteDiaLogService(
      this.isTraLaiDienTichKhaiThac ? this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkykhaithactralai.contentDeleteTraLaiDienTich : this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkykhaithactralai.contentDelete,
      ""
    );
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === "confirm") {
        await this.dangKyHoatDongKhoangSanFacadeService
          .getDangKyKhaiThacTraLaiService()
          .deleteItem({ iddangkykhaithac: this.dangKyKhaiThacTraLai.iddangkykhaithac })
          .subscribe(
            () => {
              this.dangKyKhaiThacTraLai = null;
              this.currentAction = DangKyKhaiThacTraLaiActionEnum.Add;
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
      idgiayphep: "",
      sogiayphep: "",
      hequychieu: ""
    });
  }


  // Hàm dùng để gọi các hàm khác, truyền vào tên hàm cần thực thi
  doFunction(methodName, obj) {
    this[methodName](obj);
  }
}
