import { HttpErrorResponse } from "@angular/common/http";
import {
  Component,
  ComponentFactoryResolver,
  Input,
  OnInit,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { OutputDKDauGiaKhoangSanModel } from "src/app/models/admin/dangkyhoatdongkhoangsan/dangkydaugia/dangkydaugia.model";
import { DangKyHoatDongKhoangSanFacadeService } from "src/app/services/admin/dangkyhoatdongkhoangsan/dangkyhoatdongkhoangsan-facade.service";
import { DmFacadeService } from "src/app/services/admin/danhmuc/danhmuc-facade.service";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { validationAllErrorMessagesService } from 'src/app/services/utilities/validatorService';
import { DonViDienTich } from "src/app/shared/constants/common-constants";
import {
  DangKyThamDoActionEnum,
  HoSoActionEnum,
} from "src/app/shared/constants/enum";
import { DefaultValue } from "src/app/shared/constants/global-var";

@Component({
  selector: "app-dgq-thongtinchitiet",
  templateUrl: "./dgq-thongtinchitiet.component.html",
  styleUrls: ["./dgq-thongtinchitiet.component.scss"],
})
export class DgqThongtinchitietComponent implements OnInit {
  // tslint:disable-next-line: no-input-rename
  @Input("allowAutoInit") allowAutoInit = true;
  // Hành động trước
  public currentAction: number = 2;

  public disabledDeleteButton: boolean = true;

  // Hành động chức năng của hồ sơ
  public ActionType = HoSoActionEnum;
  // Chứa dữ liệu translate
  public dataTranslate: any;
  // lưu dữ liệu đơn vị diện tích
  public donViDienTichList = DonViDienTich;
  // Chứa dữ liệu Form
  public dangKyDauGiaKhaiThacForm: FormGroup;
  // chứa dữ liệu Id Hồ sơ
  public idhoso: string;
  // object chứa thông tin bản ghi
  public dangKyDauGiaKSItem: OutputDKDauGiaKhoangSanModel;

  // Map Type lỗi - thông báo
  validationErrorMessages = {};

  // đối tượng chứa lỗi sẽ append trên giao diện
  formErrors = {
    sothongbao: DefaultValue.Empty,
    tenkhuvucdaugia: DefaultValue.Empty,
    diadiem: DefaultValue.Empty,
    tenloaikhoangsan: DefaultValue.Empty,
    dientichkhuvuc: DefaultValue.Empty,
    donvidientich: DefaultValue.Empty,
  };

  constructor(
    private translate: TranslateService,
    private formBuilder: FormBuilder,
    private dmFacadeService: DmFacadeService,
    public commonService: CommonServiceShared,
    private dangKyHoatDongKhoangSanFacadeService: DangKyHoatDongKhoangSanFacadeService,
    private activatedRoute: ActivatedRoute,
    public cfr: ComponentFactoryResolver
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
      sothongbao: {pattern: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.thongTinChiTietDauGiaQuyen.soThongBaoIsNumber},
      tenkhuvucdaugia: {required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.thongTinChiTietDauGiaQuyen.tenKhuVucDauGiaRequired},
      diadiem: {required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.thongTinChiTietDauGiaQuyen.diaDiemRequired},
      tenloaikhoangsan: {required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.thongTinChiTietDauGiaQuyen.tenLoaiKhoangSanRequired},
      dientichkhuvuc: {
        required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.thongTinChiTietDauGiaQuyen.dienTichKhuVucRequired,
        pattern: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.thongTinChiTietDauGiaQuyen.dienTichKhuVucIsNumber,
      },
      donvidientich: {required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.thongTinChiTietDauGiaQuyen.donViDienTichRequired}
    };
    console.log(this.validationErrorMessages);
  }

  /**
   * Hàm khởi tạo form
   */
  private formInit() {
    this.dangKyDauGiaKhaiThacForm = this.formBuilder.group({
      sothongbao: [DefaultValue.Empty, Validators.pattern("^[0-9]*$")],
      ngaythongbao: [DefaultValue.Empty],
      coquanthongbao: [DefaultValue.Empty],
      tenkhuvucdaugia: [DefaultValue.Empty, Validators.required],
      diadiem: [DefaultValue.Empty, Validators.required],
      tenloaikhoangsan: [DefaultValue.Empty, Validators.required],
      dientichkhuvuc: [
        DefaultValue.Empty,
        [Validators.required, Validators.pattern("^[0-9-+]+$")],
      ],
      donvidientich: [DefaultValue.Empty, Validators.required],
    });
  }
  /**
   * Khởi tạo form
   */
  async manualDataInit() {
    //lấy id hồ sơ
    this.activatedRoute.queryParamMap.subscribe((param: any) => {
      if (param && param.params && param.params.idhoso) {
        this.idhoso = param.params.idhoso;
      }
    });

    if (
      this.idhoso !== DefaultValue.Null &&
      this.idhoso !== DefaultValue.Undefined &&
      this.idhoso.trim() !== DefaultValue.Empty
    ) {
      //Lấy thông tin đăng ký đấu giá khai thác
      this.dangKyDauGiaKSItem = await this.getDangKyDauGiaKhoangSan(
        this.idhoso
      );
      if (this.dangKyDauGiaKSItem) {
        this.currentAction = DangKyThamDoActionEnum.Edit;
        // Khởi tạo dữ liệu form trong trường hợp sửa dữ liệu Hồ Sơ
        await this.formOnEdit();
      } else {
        this.currentAction = DangKyThamDoActionEnum.Add;
        this.onFormReset();
      }
      this.selectCurrentFormState();
    }

    // Lấy dữ liệu hệ quy chiếu
    // await this.geAllHeQuyChieu();

    return true;
  }

  /**
   * hàm set value cho form
   */
  private async formOnEdit() {
    if (this.currentAction === DangKyThamDoActionEnum.Edit) {
      if (this.dangKyDauGiaKSItem) {
        this.dangKyDauGiaKhaiThacForm.setValue({
          sothongbao: this.dangKyDauGiaKSItem.sothongbao,
          ngaythongbao: this.dangKyDauGiaKSItem.ngaythongbao,
          coquanthongbao: this.dangKyDauGiaKSItem.coquanthongbao,
          tenkhuvucdaugia: this.dangKyDauGiaKSItem.tenkhuvucdaugia,
          diadiem: this.dangKyDauGiaKSItem.diadiem,
          tenloaikhoangsan: this.dangKyDauGiaKSItem.tenloaikhoangsan,
          dientichkhuvuc: this.dangKyDauGiaKSItem.dientichkhuvuc,
          donvidientich: this.dangKyDauGiaKSItem.donvidientich,
        });
      }
    }
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

    // this.selectCurrentFormStateEvent.emit(this.currentAction);
  }
  /**
   * Lấy dữ liệu hồ sơ theo IdHoSo
   * @param idHoSo
   */
  private async getDangKyDauGiaKhoangSan(idHoSo: string) {
    const dauGiaKhaiThacService = this.dangKyHoatDongKhoangSanFacadeService.getDangKyDauGiaKSService();
    const dangKyItem = (await dauGiaKhaiThacService
      .getByid(idHoSo)
      .toPromise()) as OutputDKDauGiaKhoangSanModel;
    return dangKyItem;
  }

  //Lưu thông tin đăng ký đấu giá khai thác khoáng sản
  async saveDangKyDauGiaKhaiThacKS() {
     this.logAllValidationErrorMessages();

    if (!this.dangKyDauGiaKhaiThacForm.valid) {
      return;
    }

    // Gán dữ liệu input vào model
    const dauGiaKhaiThacService = this.dangKyHoatDongKhoangSanFacadeService.getDangKyDauGiaKSService();
    const inputModel = this.dangKyDauGiaKhaiThacForm.value;
    inputModel.idhoso = this.idhoso;
    if (this.currentAction === DangKyThamDoActionEnum.Add) {
      dauGiaKhaiThacService.addItem(inputModel).subscribe(
        async (res) => {
          this.dangKyDauGiaKSItem = inputModel;
          this.dangKyDauGiaKSItem.iddangkydaugia = res.iddangkydaugia;
          this.currentAction = DangKyThamDoActionEnum.Edit;
          this.selectCurrentFormState();
          // this.selectIdDangKyThamDo();
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
      inputModel.iddangkydaugia = this.dangKyDauGiaKSItem.iddangkydaugia;
      dauGiaKhaiThacService.updateItem(inputModel).subscribe(
        async (res) => {
          this.dangKyDauGiaKSItem = inputModel;
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
      this.dangKyDauGiaKhaiThacForm,
      this.validationErrorMessages,
      this.formErrors
    );
  }

  /**
   * Xóa đăng ký thăm do theo Id hồ sơ
   */
  deleteDangKyDauGiaKhaiThacKS() {
    const dialogRef = this.commonService.confirmDeleteDiaLogService(
      this.dataTranslate.DANGKYHOATDONGKHOANGSAN.thongTinChiTietDauGiaQuyen
        .contentDelete,
      this.dangKyDauGiaKSItem.diadiem
    );
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === "confirm") {
        var idDangKyDauGia: string = this.dangKyDauGiaKSItem.iddangkydaugia;
        await this.dangKyHoatDongKhoangSanFacadeService
          .getDangKyDauGiaKSService()
          .deleteItem({ idDangKyDauGia })
          .subscribe(
            () => {
              this.dangKyDauGiaKSItem = null;
              this.currentAction = DangKyThamDoActionEnum.Add;
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
    this.dangKyDauGiaKhaiThacForm.reset();
  }
}
