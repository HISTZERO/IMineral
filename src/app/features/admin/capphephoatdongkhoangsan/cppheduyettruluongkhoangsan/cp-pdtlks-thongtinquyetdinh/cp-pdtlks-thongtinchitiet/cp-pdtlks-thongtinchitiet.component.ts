import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { OutputCpPheDuyetTLKSModel } from "src/app/models/admin/capphephoatdongkhoangsan/cppheduyettruluongkhoangsan/cpPheDuyetTLKS.model";
import { CapPhepHoatDongKhoangSanFacadeService } from "src/app/services/admin/capphephoatdongkhoangsan/capphephoatdongkhoangsan-facade.service";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { validationAllErrorMessagesService } from 'src/app/services/utilities/validatorService';
import { DonViDienTich } from "src/app/shared/constants/common-constants";
import { ActionDataEnum } from "src/app/shared/constants/enum";
import { DefaultValue } from "src/app/shared/constants/global-var";

@Component({
  selector: "app-cp-pdtlks-thongtinchitiet",
  templateUrl: "./cp-pdtlks-thongtinchitiet.component.html",
  styleUrls: ["./cp-pdtlks-thongtinchitiet.component.scss"],
})
export class CpPdtlksThongtinchitietComponent implements OnInit {
  // tslint:disable-next-line: no-input-rename
  @Input("allowAutoInit") allowAutoInit = true;
  @Output() thongTinChiTietTonTaiTrigger = new EventEmitter();
  @Output() thongTinChiTietKhongTonTaiTrigger = new EventEmitter();

  public currentAction: number = 2;

  public disabledDeleteButton: boolean = true;

  // Hành động chức năng của hồ sơ
  public ActionType = ActionDataEnum;

  //chứa dữ liệu form
  public capPhepPheDuyetTLKSForm: FormGroup;
  // lưu dữ liệu đơn vị diện tích
  public donViDienTichList = DonViDienTich;
  // chứa dữ liệu Id giấy phép
  public idgiayphep: string;

  // object chứa thông tin bản ghi trả về từ api
  public capPhepPheDuyetTruLuongKSItem: OutputCpPheDuyetTLKSModel;
  // Chứa dữ liệu translate
  public dataTranslate: any;
  // Map Type lỗi - thông báo
  validationErrorMessages = {};

  // đối tượng chứa lỗi sẽ append trên giao diện
  formErrors = {
    tenkhuvucthamdo: DefaultValue.Empty,
    diadiem: DefaultValue.Empty,
    dientichthamdo: DefaultValue.Empty,
    donvidientich: DefaultValue.Empty,
  };

  constructor(
    private translate: TranslateService,
    private formBuilder: FormBuilder,
    public commonService: CommonServiceShared,
    private capPhepHoatDongKhoangSanFacadeService: CapPhepHoatDongKhoangSanFacadeService,
    private activatedRoute: ActivatedRoute
  ) {}

  async ngOnInit() {
    // Khởi tạo form
    this.formInit();
    // Lấy dữ liệu translate
    await this.getDataTranslate();
    this.setValidation();

    if (this.allowAutoInit) {
      await this.manualDataInit();
    }
  }

  /**
   * Hàm khởi tạo form + condition
   */
  private formInit() {
    this.capPhepPheDuyetTLKSForm = this.formBuilder.group({
      tenkhuvucthamdo: [DefaultValue.Empty, Validators.required],
      diadiem: [DefaultValue.Empty, Validators.required],
      dientichthamdo: [
        DefaultValue.Empty,
        [Validators.required, Validators.pattern("^[0-9-+]+$")],
      ],
      donvidientich: [DefaultValue.Empty, Validators.required],
    });
  }

  /**
   * Hàm lấy dữ liệu translate
   */
  async getDataTranslate() {
    // Get all langs
    this.dataTranslate = await this.translate
      .getTranslation(this.translate.getDefaultLang())
      .toPromise();
  }

  /**
   * Hàm set validate
   */
  private setValidation() {
    this.validationErrorMessages = {
      tenkhuvucthamdo: {
        required: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN
          .cappheppheduyettruluongkhoangsan_thongtinchitiet
          .tenkhuvucthamdoRequired,
      },
      diadiem: {
        required: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN
          .cappheppheduyettruluongkhoangsan_thongtinchitiet.diadiemRequired,
      },
      dientichthamdo: {
        required: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN
          .cappheppheduyettruluongkhoangsan_thongtinchitiet
          .dientichthamdoRequired,
        pattern: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN
          .cappheppheduyettruluongkhoangsan_thongtinchitiet
          .dientichthamdoIsNumber,
      },
      donvidientich: {
        required: this.dataTranslate.CAPPHEPHOATDONGKHOANGSAN
          .cappheppheduyettruluongkhoangsan_thongtinchitiet
          .donvidientichRequired,
      },
    };
  }

  /**
   * Khởi tạo form
   */
  async manualDataInit() {
    //Lấy id giấy phép
    this.activatedRoute.queryParamMap.subscribe((param: any) => {
      if (param && param.params && param.params.idgiayphep) {
        this.idgiayphep = param.params.idgiayphep;
      }
    });

    if (
      this.idgiayphep !== DefaultValue.Null &&
      this.idgiayphep !== DefaultValue.Undefined &&
      this.idgiayphep.trim() !== DefaultValue.Empty
    ) {
      //Lấy thông tin đăng ký đấu giá khai thác
      this.capPhepPheDuyetTruLuongKSItem = await this.layThongTinCapPhepPheDuyet(
        this.idgiayphep
      );

      if (this.capPhepPheDuyetTruLuongKSItem) {
        this.currentAction = ActionDataEnum.Edit;
        //fire sự kiện : bản ghi thông tin chi tiết tồn tại, đồng thời truyền theo ID của bản ghi Thông tin
         this.thongTinChiTietTonTaiTrigger.emit(this.capPhepPheDuyetTruLuongKSItem.idpheduyettruluong);
        // Khởi tạo dữ liệu form trong trường hợp sửa dữ liệu Hồ Sơ
        await this.formOnEdit();
      } else {
        this.currentAction = ActionDataEnum.Add;
        this.onFormReset();
      }
      this.selectCurrentFormState();
    }
    return true;
  }
  /**
   * Lấy dữ liệu hồ sơ theo id giấy phép
   * @param id
   */
  private async layThongTinCapPhepPheDuyet(id: string) {
    const capPhepTruLuongService = this.capPhepHoatDongKhoangSanFacadeService.getCapPhepPheDuyetTLKSService();
    const capPhepItem = (await capPhepTruLuongService
      .layThongTinCpPheDuyetTheoIdGiayPhep(id)
      .toPromise()) as OutputCpPheDuyetTLKSModel;
    return capPhepItem;
  }

  /**
   * hàm set value cho form
   */
  private async formOnEdit() {
    if (this.currentAction === ActionDataEnum.Edit) {
      if (this.capPhepPheDuyetTruLuongKSItem) {
        this.capPhepPheDuyetTLKSForm.setValue({
          tenkhuvucthamdo: this.capPhepPheDuyetTruLuongKSItem.tenkhuvucthamdo,
          diadiem: this.capPhepPheDuyetTruLuongKSItem.diadiem,
          dientichthamdo: this.capPhepPheDuyetTruLuongKSItem.dientichthamdo,
          donvidientich: this.capPhepPheDuyetTruLuongKSItem.donvidientich,
        });
      }
    }
  }


  //Lưu thông tin đăng ký đấu giá khai thác khoáng sản
  async saveCapPhepPheDuyetTruLuongKS() {
    this.logAllValidationErrorMessages();

   if (!this.capPhepPheDuyetTLKSForm.valid) {
     return;
   }
   // Gán dữ liệu input vào model
   const capPhepPheDuyetService = this.capPhepHoatDongKhoangSanFacadeService.getCapPhepPheDuyetTLKSService();
   const inputModel = this.capPhepPheDuyetTLKSForm.value;
   inputModel.idgiayphep = this.idgiayphep;
   if (this.currentAction === ActionDataEnum.Add) {
    capPhepPheDuyetService.addItem(inputModel).subscribe(
       async (res) => {
         this.capPhepPheDuyetTruLuongKSItem = inputModel;
         this.capPhepPheDuyetTruLuongKSItem.idpheduyettruluong = res.idpheduyettruluong;
         this.currentAction = ActionDataEnum.Edit;
         this.selectCurrentFormState();
         //fire sự kiện : bản ghi thông tin chi tiết tồn tại, đồng thời truyền theo ID của bản ghi Thông tin
      this.thongTinChiTietTonTaiTrigger.emit(this.capPhepPheDuyetTruLuongKSItem.idpheduyettruluong);
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
   } else if (this.currentAction === ActionDataEnum.Edit) {
     inputModel.idgiayphep = this.capPhepPheDuyetTruLuongKSItem.idgiayphep;
     inputModel.idpheduyettruluong=this.capPhepPheDuyetTruLuongKSItem.idpheduyettruluong;
     capPhepPheDuyetService.updateItem(inputModel).subscribe(
       async (res) => {
         this.capPhepPheDuyetTruLuongKSItem = inputModel;
         this.currentAction = ActionDataEnum.Edit;
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
  deleteCapPhepPheDuyetTruLuongKS() {
    const dialogRef = this.commonService.confirmDeleteDiaLogService(
      "",""
    );
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === "confirm") {
        var idpheduyettruluong: string = this.capPhepPheDuyetTruLuongKSItem.idpheduyettruluong;
        await this.capPhepHoatDongKhoangSanFacadeService
          .getCapPhepPheDuyetTLKSService()
          .deleteItem({ idpheduyettruluong })
          .subscribe(
            () => {
              this.capPhepPheDuyetTruLuongKSItem = null;
              this.currentAction = ActionDataEnum.Add;
              this.onFormReset();
              this.selectCurrentFormState();
              this.thongTinChiTietKhongTonTaiTrigger.emit(null);
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
    this.capPhepPheDuyetTLKSForm.reset();
  }
    /**
   * select inserted state of form
   */
  private selectCurrentFormState() {
    if (this.currentAction === ActionDataEnum.Edit) {
      this.disabledDeleteButton = false;
      
    } else {
      this.disabledDeleteButton = true;
    }
  }

   /**
   * hàm kiểm tra validation form
   */
  private logAllValidationErrorMessages() {
    validationAllErrorMessagesService(
      this.capPhepPheDuyetTLKSForm,
      this.validationErrorMessages,
      this.formErrors
    );
  }
}
