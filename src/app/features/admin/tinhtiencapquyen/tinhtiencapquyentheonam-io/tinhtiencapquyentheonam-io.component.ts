import { Component, ComponentFactoryResolver, EventEmitter, Input, OnInit, Output, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { CommonServiceShared } from 'src/app/services/utilities/common-service';
import { DefaultValue } from 'src/app/shared/constants/global-var';
import {HoSoGiayToFacadeService} from 'src/app/services/admin/hosogiayto/hosogiayto-facade.service';
import { TinhTienCapQuyenFacadeService } from 'src/app/services/admin/tinhtiencapquyen/tinhtiencapquyen-facade.service';
import { TinhTienCapQuyenKhaiThacKhoangSanActionEnum } from 'src/app/shared/constants/enum';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OutputTtTinhTienCapQuyenModel } from 'src/app/models/admin/tinhtiencapquyen/tttinhtiencapquyen.model';
import { OutputGiayPhepModel } from 'src/app/models/admin/hosogiayto/giayphep.model';
import { validationAllErrorMessagesService } from "src/app/services/utilities/validatorService";
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-tinhtiencapquyentheonam-io',
  templateUrl: './tinhtiencapquyentheonam-io.component.html',
  styleUrls: ['./tinhtiencapquyentheonam-io.component.scss']
})
export class TinhtiencapquyentheonamIoComponent implements OnInit {
  // Viewchild template
  @ViewChild("griTinhTienTheoNam", { static: false }) public griTinhTienTheoNam: GridComponent;
  @ViewChild(Type, { static: true }) public matSidenav: MatSidenav;
  @ViewChild(Type, { read: ViewContainerRef, static: true }) public content: ViewContainerRef;
  // tslint:disable-next-line: no-input-rename
  @Input("allowAutoInit") allowAutoInit = true;
  // tslint:disable-next-line: no-output-rename
  @Output("selectCurrentFormStateEvent") selectCurrentFormStateEvent: EventEmitter<number> = new EventEmitter();
  // Lưu trữ dữ liệu action hiện tại
  public currentAction: number;
  // Chứa dữ liệu translate
  public dataTranslate: any;
  // Lưu trữ dữ liệu id giấy phép
  public idgiayphep;
  // Lưu trữ dữ liệu thông tin quyết định tính tiền cấp quyền
  private itemQuyetDinh: OutputGiayPhepModel;
  // Lưu trữ dữ liệu tính tiền cấp quyền
  private itemTinhTienCapQuyen: OutputTtTinhTienCapQuyenModel;
  // tile form
  public title: string;
  // disable delete button
  public disabledDeleteButton = false;
  // Chứa dữ liệu Form
  public tinhTienTheoNamIOForm: FormGroup;
  // form errors
  formErrors = {
    giatinhtienlandau: DefaultValue.Empty,
    tongtienphainop: DefaultValue.Empty,
    solannop: DefaultValue.Empty,
    sotienhangnam: DefaultValue.Empty,
    sotienlandau: DefaultValue.Empty,
    namnoplandau: DefaultValue.Empty
  };

  // error message
  validationErrorMessages = {};

  constructor(
    private formBuilder: FormBuilder,
    private cfr: ComponentFactoryResolver,
    private translate: TranslateService,
    private activatedRoute: ActivatedRoute,
    public commonService: CommonServiceShared,
    private hoSoGiayToFacadeService: HoSoGiayToFacadeService,
    private tinhTienCapQuyenFacadeService: TinhTienCapQuyenFacadeService) { }

  async ngOnInit() {
    // Khởi tạo form
    this. formInit();
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

  async manualDataInit() {
    this.activatedRoute.queryParamMap.subscribe((param: any) => {
      if (param && param.params && param.params.idgiayphep) {
        this.idgiayphep = param.params.idgiayphep;
      }
    });

    if (this.idgiayphep === DefaultValue.Null || this.idgiayphep === DefaultValue.Undefined || this.idgiayphep.trim() === DefaultValue.Empty) {
      this.commonService.showDialogWarning(this.dataTranslate.TINHTIENCAPQUYEN.tinhtiencapquyentheonam.informedNotExistedQuyetDinhTinhTienCapQuyen);
      return false;
    }

    this.itemQuyetDinh =  await this.getQuyetDinhTinhTienCapQuyenById(this.idgiayphep);

    if (!this.itemQuyetDinh) {
      this.commonService.showDialogWarning(this.dataTranslate.TINHTIENCAPQUYEN.tinhtiencapquyentheonam.informedNotExistedQuyetDinhTinhTienCapQuyen);
      return false;
    }

    this.itemTinhTienCapQuyen = await this.getTinhTienCapQuyenByIdGiayPhep(this.idgiayphep);

    if (this.itemTinhTienCapQuyen) {
      this.currentAction = TinhTienCapQuyenKhaiThacKhoangSanActionEnum.Edit;
      this.selectCurrentFormState();
      this.setFormTitle();
    } else {
      this.currentAction = TinhTienCapQuyenKhaiThacKhoangSanActionEnum.Add;
      this.selectCurrentFormState();
      this.setFormTitle();
    }

    // Khởi tạo dữ liệu form trong trường hợp sửa dữ liệu tính tiền cấp quyền
    await this.formOnEdit(this.itemTinhTienCapQuyen);

    return true;
  }

  /**
   * Hàm khởi tạo form
   */
  private formInit() {
    this.tinhTienTheoNamIOForm = this.formBuilder.group({
      giatinhtienlandau: [DefaultValue.Empty, Validators.required],
      tongtienphainop: [DefaultValue.Empty, [Validators.required, Validators.pattern("^[0-9]+\\.{0,1}\\d{0,2}$")]],
      solannop: [DefaultValue.Empty, [Validators.required, Validators.pattern("^[0-9-+]+$")]],
      sotienhangnam: [DefaultValue.Empty, [Validators.required, Validators.pattern("^[0-9]+\\.{0,1}\\d{0,2}$")]],
      sotienlandau: [DefaultValue.Empty, [Validators.required, Validators.pattern("^[0-9]+\\.{0,1}\\d{0,2}$")]],
      namnoplandau: [DefaultValue.Empty, [Validators.required, Validators.pattern("^[0-9-+]+$")]]
    });
  }

  /**
   * hàm set value cho form
   */
  private async formOnEdit(item: OutputTtTinhTienCapQuyenModel) {
    if (this.currentAction === TinhTienCapQuyenKhaiThacKhoangSanActionEnum.Edit && item) {
      this.tinhTienTheoNamIOForm.setValue({
        giatinhtienlandau: item.giatinhtienlandau,
        tongtienphainop: item.tongtienphainop,
        solannop: item.solannop,
        sotienhangnam: item.sotienhangnam,
        sotienlandau: item.sotienlandau,
        namnoplandau: item.namnoplandau
      });
    }
  }

  /**
   * Hàm set validate
   */
  private setValidation() {
    this.validationErrorMessages = {
      giatinhtienlandau: { required: this.dataTranslate.TINHTIENCAPQUYEN.tinhtiencapquyentheonam.giatinhtienlandauRequired },
      tongtienphainop: { required: this.dataTranslate.TINHTIENCAPQUYEN.tinhtiencapquyentheonam.tongtienphainopRequired, pattern: this.dataTranslate.TINHTIENCAPQUYEN.tinhtiencapquyentheonam.tongtienphainopFormat},
      solannop: { required: this.dataTranslate.TINHTIENCAPQUYEN.tinhtiencapquyentheonam.solannopRequired, pattern: this.dataTranslate.TINHTIENCAPQUYEN.tinhtiencapquyentheonam.solannopFormat },
      sotienhangnam: { required: this.dataTranslate.TINHTIENCAPQUYEN.tinhtiencapquyentheonam.sotienhangnamRequired, pattern: this.dataTranslate.TINHTIENCAPQUYEN.tinhtiencapquyentheonam.sotienhangnamFormat },
      sotienlandau: { required: this.dataTranslate.TINHTIENCAPQUYEN.tinhtiencapquyentheonam.sotienlandauRequired, pattern: this.dataTranslate.TINHTIENCAPQUYEN.tinhtiencapquyentheonam.sotienlandauFormat },
      namnoplandau: { required: this.dataTranslate.TINHTIENCAPQUYEN.tinhtiencapquyentheonam.namnoplandauRequired, pattern: this.dataTranslate.TINHTIENCAPQUYEN.tinhtiencapquyentheonam.namnoplandauFormat }
    };
  }

  /**
   * Lấy dữ liệu quyết định tính tiền cấp quyền
   * @param IdGiayPhep
   */
  private async getQuyetDinhTinhTienCapQuyenById(IdGiayPhep: string) {
    const giayPhepService = this.hoSoGiayToFacadeService.getGiayPhepService();
    const itemQuyetDinh = await giayPhepService.getByid(IdGiayPhep).toPromise();

    if (itemQuyetDinh) {
      return itemQuyetDinh as OutputGiayPhepModel;
    }

    return null;
  }

  /**
   * Lấy dữ liệu tính tiền cấp quyền
   * @param IdGiayPhep
   */
  private async getTinhTienCapQuyenByIdGiayPhep(IdGiayPhep: string) {
    const tinhTienCapQuyenService = this.tinhTienCapQuyenFacadeService.getTinhTienCapQuyenKhaiThacKhoangSanService();
    const itemTinhTienCapQuyen = await tinhTienCapQuyenService.getTinhTienCapQuyenByIdGiayPhep(IdGiayPhep).toPromise();

    if (itemTinhTienCapQuyen) {
      return itemTinhTienCapQuyen as OutputTtTinhTienCapQuyenModel;
    }

    return null;
  }

  /**
   * set form title
   */
  private setFormTitle() {
    if (this.currentAction === TinhTienCapQuyenKhaiThacKhoangSanActionEnum.Edit) {
      this.title = this.dataTranslate.TINHTIENCAPQUYEN.tinhtiencapquyentheonam.titleEdit;
    } else if (this.currentAction === TinhTienCapQuyenKhaiThacKhoangSanActionEnum.Add) {
      this.title = this.dataTranslate.TINHTIENCAPQUYEN.tinhtiencapquyentheonam.titleAdd;
    } else {
      this.title = DefaultValue.Empty;
    }
  }

  /**
   * select inserted state of form
   */
  private selectCurrentFormState() {
    if (this.currentAction === TinhTienCapQuyenKhaiThacKhoangSanActionEnum.Edit) {
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
      this.tinhTienTheoNamIOForm,
      this.validationErrorMessages,
      this.formErrors
    );
  }

  /**
   * save tính tiền cấp quyền
   */
  async saveItemTinhTienCapQuyen() {
    this.logAllValidationErrorMessages();

    if (!this.tinhTienTheoNamIOForm.valid) {
      return;
    }

    // Gán dữ liệu input vào model
    const tinhTienCapQuyenService = this.tinhTienCapQuyenFacadeService.getTinhTienCapQuyenKhaiThacKhoangSanService();
    const inputModel = this.tinhTienTheoNamIOForm.value;
    inputModel.idgiayphep = this.itemQuyetDinh.idgiayphep;
    if (this.currentAction === TinhTienCapQuyenKhaiThacKhoangSanActionEnum.Add) {
      tinhTienCapQuyenService.addItem(inputModel).subscribe(
        async (res) => {
          this.itemTinhTienCapQuyen = inputModel;
          this.itemTinhTienCapQuyen.idtinhtiencapquyen = res.idtinhtiencapquyen;
          this.currentAction = TinhTienCapQuyenKhaiThacKhoangSanActionEnum.Edit;
          this.selectCurrentFormState();
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
    } else if (this.currentAction === TinhTienCapQuyenKhaiThacKhoangSanActionEnum.Edit) {
      inputModel.idtinhtiencapquyen = this.itemTinhTienCapQuyen.idtinhtiencapquyen;
      tinhTienCapQuyenService.updateItem(inputModel).subscribe(
        async (res) => {
          this.itemTinhTienCapQuyen = inputModel;
          this.currentAction = TinhTienCapQuyenKhaiThacKhoangSanActionEnum.Edit;
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
   * Xóa đăng ký thăm do theo Id hồ sơ
   */
  deleteItemTinhTienCapQuyen() {
    const dialogRef = this.commonService.confirmDeleteDiaLogService(
      this.dataTranslate.TINHTIENCAPQUYEN.tinhtiencapquyentheonam.contentDelete,
      this.itemQuyetDinh.sogiayphep
    );
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === "confirm") {
        await this.tinhTienCapQuyenFacadeService
          .getTinhTienCapQuyenKhaiThacKhoangSanService()
          .deleteItem({idtinhtiencapquyen: this.itemTinhTienCapQuyen.idtinhtiencapquyen})
          .subscribe(
            () => {
              this.itemTinhTienCapQuyen = null;
              this.currentAction = TinhTienCapQuyenKhaiThacKhoangSanActionEnum.Add;
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
    this.tinhTienTheoNamIOForm.reset();
  }
}
