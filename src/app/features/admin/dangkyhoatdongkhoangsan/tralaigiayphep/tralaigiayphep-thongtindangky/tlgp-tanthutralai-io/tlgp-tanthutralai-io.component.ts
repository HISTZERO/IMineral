import { Component, OnInit, Input, ComponentFactoryResolver, EventEmitter, Output, ViewChild, Type, ViewContainerRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSidenav } from "@angular/material";

import { DangKyHoatDongKhoangSanFacadeService } from 'src/app/services/admin/dangkyhoatdongkhoangsan/dangkyhoatdongkhoangsan-facade.service';
import { DangKyTanThuTraLaiActionEnum, DangKyTraLaiGiayPhepActionEnum } from 'src/app/shared/constants/enum';
import { CommonServiceShared } from 'src/app/services/utilities/common-service';
import { validationAllErrorMessagesService } from "src/app/services/utilities/validatorService";
import { GiayphepOptionComponent } from "src/app/features/admin/hosogiayto/giayphep/giayphep-option/giayphep-option.component";
import { MatsidenavService } from "src/app/services/utilities/matsidenav.service";
import { OutputGiayPhepModel } from "src/app/models/admin/hosogiayto/giayphep.model";
import { OutputDkTanThuTraLaiModel } from "src/app/models/admin/dangkyhoatdongkhoangsan/dktanthutralai.model";

@Component({
  selector: 'app-tlgp-tanthutralai-io',
  templateUrl: './tlgp-tanthutralai-io.component.html',
  styleUrls: ['./tlgp-tanthutralai-io.component.scss']
})
export class TlgpTanthutralaiIoComponent implements OnInit {

  @ViewChild(Type, { static: true }) public matSidenav: MatSidenav;
  @ViewChild(Type, { read: ViewContainerRef, static: true }) public content: ViewContainerRef;


  // tslint:disable-next-line: no-output-rename
  @Output("selectCurrentFormStateEvent") selectCurrentFormStateEvent: EventEmitter<number> = new EventEmitter();

  // tslint:disable-next-line: no-output-rename
  @Output("selectIdDangKyTraLaiEvent") selectIdDangKyTraLaiEvent: EventEmitter<string> = new EventEmitter();

  // tslint:disable-next-line: no-input-rename
  @Input("allowAutoInit") allowAutoInit = true;

  // Chứa dữ liệu Form
  public dangKyTanThuTraLaiIOForm: FormGroup;

  // Chứa dữ liệu translate
  public dataTranslate: any;

  // chứa dữ liệu Id Hồ sơ
  public idhoso: string;

  // chứa dữ liệu đăng ký tận thu trả lại
  private dangKyTanThuTraLai: any;

  // Action thao tác dữ liệu
  public currentAction: number;

  // Action đăng ký tận thu trả lại
  public ActionType = DangKyTanThuTraLaiActionEnum;

  // disable delete button
  public disabledDeleteButton = false;

  // error message
  validationErrorMessages = {};

  // form errors
  formErrors = {
    lydotralai: "",
    idgiayphep: "",
    sogiayphep: ""
  };

  constructor(
    private translate: TranslateService,
    private formBuilder: FormBuilder,
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
      this.dangKyTanThuTraLai = await this.getDangKyTanThuTraLaiByIdHoSo(this.idhoso);

      if (this.dangKyTanThuTraLai) {
        this.currentAction = DangKyTraLaiGiayPhepActionEnum.Edit;
        this.selectIdDangKyTanThuTraLai();
        this.selectCurrentFormState();
      } else {
        this.currentAction = DangKyTraLaiGiayPhepActionEnum.Add;
        this.selectCurrentFormState();
      }
    } else {
      this.currentAction = DangKyTraLaiGiayPhepActionEnum.None;
      return;
    }

    // Khởi tạo dữ liệu form trong trường hợp sửa dữ liệu Hồ Sơ
    await this.formOnEdit(this.dangKyTanThuTraLai);

    return true;
  }

  /**
   * Hàm khởi tạo form
   */
  private formInit() {
    this.dangKyTanThuTraLaiIOForm = this.formBuilder.group({
      lydotralai: [""],
      idgiayphep: [""],
      sogiayphep: ["", Validators.required]
    });
    this.dangKyTanThuTraLaiIOForm.controls.sogiayphep.disable({ onlySelf: true });
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
  private async formOnEdit(item: OutputDkTanThuTraLaiModel) {
    if (this.currentAction === DangKyTraLaiGiayPhepActionEnum.Edit && item) {
      this.dangKyTanThuTraLaiIOForm.setValue({
        lydotralai: item.lydotralai,
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
   * Lấy dữ liệu hồ sơ theo IdHoSo
   * @param idHoSo
   */
  private async getDangKyTanThuTraLaiByIdHoSo(idHoSo: string) {
    const dkTanThuTraLaiService = this.dangKyHoatDongKhoangSanFacadeService.getDangKyTanThuTraLaiService();
    const dangKyItem = await dkTanThuTraLaiService.getFetchAll({ idhoso: idHoSo });
    return dangKyItem;
  }

  /**
   * Lưu dữ liệu đăng ký trả lại giấy phép tận thu
   */
  async saveItemDangKyTanThuTraLai() {
    this.logAllValidationErrorMessages();

    if (!this.dangKyTanThuTraLaiIOForm.valid) {
      return;
    }

    // Gán dữ liệu input vào model
    const dkTanThuTraLaiService = this.dangKyHoatDongKhoangSanFacadeService.getDangKyTanThuTraLaiService();
    const inputModel = this.dangKyTanThuTraLaiIOForm.value;
    inputModel.idhoso = this.idhoso;
    if (this.currentAction === DangKyTanThuTraLaiActionEnum.Add) {
      dkTanThuTraLaiService.addItem(inputModel).subscribe(
        async (res) => {
          this.dangKyTanThuTraLai = inputModel;
          this.dangKyTanThuTraLai.iddangkytanthu = res.iddangkytanthu;
          this.currentAction = DangKyTanThuTraLaiActionEnum.Edit;
          this.selectCurrentFormState();
          this.selectIdDangKyTanThuTraLai();
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
    } else if (this.currentAction === DangKyTanThuTraLaiActionEnum.Edit) {
      inputModel.iddangkytanthu = this.dangKyTanThuTraLai.iddangkytanthu;
      dkTanThuTraLaiService.updateItem(inputModel).subscribe(
        async (res) => {
          this.dangKyTanThuTraLai = inputModel;
          this.currentAction = DangKyTanThuTraLaiActionEnum.Edit;
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
    this.matSidenavService.setTitle(this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkytanthutralai.titleGiayPhepSelect);
    this.matSidenavService.setContentComp(GiayphepOptionComponent, "select");
    this.matSidenavService.open();
  }

  /**
   * lấy item dữ liệu đối tượng cá nhân từ popup
   */
  private selectItemGiayPhep(item: OutputGiayPhepModel) {
    if (item !== null && item !== undefined) {
      this.dangKyTanThuTraLaiIOForm.controls.sogiayphep.setValue(item.sogiayphep);
      this.dangKyTanThuTraLaiIOForm.controls.idgiayphep.setValue(item.idgiayphep);
    }
  }

  /**
   * Hàm kiểm tra validation form
   */
  private logAllValidationErrorMessages() {
    validationAllErrorMessagesService(
      this.dangKyTanThuTraLaiIOForm,
      this.validationErrorMessages,
      this.formErrors
    );
  }

  /**
   * Select inserted state of form
   */
  private selectCurrentFormState() {
    if (this.currentAction === DangKyTanThuTraLaiActionEnum.Edit) {
      this.disabledDeleteButton = false;
    } else {
      this.disabledDeleteButton = true;
    }

    this.selectCurrentFormStateEvent.emit(this.currentAction);
  }

  /**
   * Lấy thông tin id hồ sơ sau khi thêm mới một hồ sơ
   */
  private selectIdDangKyTanThuTraLai() {
    this.selectIdDangKyTraLaiEvent.emit(this.dangKyTanThuTraLai.iddangkytanthu);
  }

  /**
   * Xóa item đăng ký khai thác khoáng sản
   */
  deleteItemDangKyKhaiThacTraLai() {
    const dialogRef = this.commonService.confirmDeleteDiaLogService(
      this.dataTranslate.DANGKYHOATDONGKHOANGSAN.dangkytanthutralai.contentDelete,
      ""
    );
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === "confirm") {
        await this.dangKyHoatDongKhoangSanFacadeService
          .getDangKyTanThuTraLaiService()
          .deleteItem({ iddangkytanthu: this.dangKyTanThuTraLai.iddangkytanthu })
          .subscribe(
            () => {
              this.dangKyTanThuTraLai = null;
              this.currentAction = DangKyTanThuTraLaiActionEnum.Add;
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
    this.dangKyTanThuTraLaiIOForm.reset({
      lydotralai: "",
      idgiayphep: "",
      sogiayphep: ""
    });
  }


  // Hàm dùng để gọi các hàm khác, truyền vào tên hàm cần thực thi
  doFunction(methodName, obj) {
    this[methodName](obj);
  }

}
