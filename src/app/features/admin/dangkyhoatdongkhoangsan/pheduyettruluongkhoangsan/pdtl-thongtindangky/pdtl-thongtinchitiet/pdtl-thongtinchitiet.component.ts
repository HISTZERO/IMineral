import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from "@angular/common/http";
import {
  Component,
  ComponentFactoryResolver,
  Input,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from "@angular/core";
import { Validators } from "@angular/forms";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatSidenav } from '@angular/material/sidenav';
import { ActivatedRoute } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { GiayphepOptionComponent } from 'src/app/features/admin/hosogiayto/giayphep/giayphep-option/giayphep-option.component';
import { OutputDKPheDuyetTruLuongKSModel } from "src/app/models/admin/dangkyhoatdongkhoangsan/pheduyettruluong/thongTinChiTietPheDuyetTruLuong.model";
import { OutputGiayPhepModel } from 'src/app/models/admin/hosogiayto/giayphep.model';
import { DangKyHoatDongKhoangSanFacadeService } from "src/app/services/admin/dangkyhoatdongkhoangsan/dangkyhoatdongkhoangsan-facade.service";
import { DmFacadeService } from "src/app/services/admin/danhmuc/danhmuc-facade.service";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { MatsidenavService } from 'src/app/services/utilities/matsidenav.service';
import { validationAllErrorMessagesService } from "src/app/services/utilities/validatorService";
import { ActionDataEnum } from "src/app/shared/constants/enum";
import { DefaultValue } from "src/app/shared/constants/global-var";

@Component({
  selector: "app-pdtl-thongtinchitiet",
  templateUrl: "./pdtl-thongtinchitiet.component.html",
  styleUrls: ["./pdtl-thongtinchitiet.component.scss"],
})
export class PdtlThongtinchitietComponent implements OnInit {
  // tslint:disable-next-line: no-input-rename
  @Input("allowAutoInit") allowAutoInit = true;
  @ViewChild("aside", { static: true }) public matSidenav: MatSidenav;
  @ViewChild("compio", { read: ViewContainerRef, static: true }) public content: ViewContainerRef;
  public currentAction: number = 2;

  public disabledDeleteButton: boolean = true;

  // Hành động chức năng của hồ sơ
  public ActionType = ActionDataEnum;
  // Chứa dữ liệu Form
  public pheDuyetTruLuongKSForm: FormGroup;
  // chứa dữ liệu Id Hồ sơ
  public idhoso: string;
  public idgiayphep:string;
  // object chứa thông tin bản ghi trả về từ api
  public dangKyPheDuyetTruLuongKSItem: OutputDKPheDuyetTruLuongKSModel;
  // Chứa dữ liệu translate
  public dataTranslate: any;
  // Map Type lỗi - thông báo
  validationErrorMessages = {};

  // đối tượng chứa lỗi sẽ append trên giao diện
  formErrors = {
    // iddkpheduyettruluong: DefaultValue.Empty,
    // idgiayphep: DefaultValue.Empty,
    tenbaocaothamdo: DefaultValue.Empty,
    ngaylapbaocao: DefaultValue.Empty,
    donvituvan: DefaultValue.Empty,
    // idhoso: DefaultValue.Empty,
    sogiayphep: DefaultValue.Empty,
    ngaycapphep: DefaultValue.Empty,
    coquancapphep: DefaultValue.Empty,
  };

  constructor(
    private translate: TranslateService,
    private formBuilder: FormBuilder,
    public commonService: CommonServiceShared,
    private dangKyHoatDongKhoangSanFacadeService: DangKyHoatDongKhoangSanFacadeService,
    private activatedRoute: ActivatedRoute,
    public cfr: ComponentFactoryResolver,
    public matSidenavService: MatsidenavService,
    public datePipe: DatePipe
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
    this.pheDuyetTruLuongKSForm = this.formBuilder.group({
      sogiayphep: [DefaultValue.Empty, Validators.required],
      ngaycapphep: { value: DefaultValue.Empty, disabled: true },
      coquancapphep: { value: DefaultValue.Empty, disabled: true },
      tenbaocaothamdo: [DefaultValue.Empty, Validators.required],
      ngaylapbaocao: [DefaultValue.Empty, Validators.required],
      donvituvan: [DefaultValue.Empty, Validators.required],
    });
    this.pheDuyetTruLuongKSForm.controls.sogiayphep.disable({ onlySelf: true });
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
      sogiayphep: {
        required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN
          .thongtinchitietpheduyettruluongks.sogiayphepthamdoRequired,
      },
      tenbaocaothamdo: {
        required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN
          .thongtinchitietpheduyettruluongks.tenbaocaothamdoRequired,
      },
      ngaylapbaocao: {
        required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN
          .thongtinchitietpheduyettruluongks.ngaylapbaocaoRequired,
      },
      donvituvan: {
        required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN
          .thongtinchitietpheduyettruluongks.donvituvanRequired,
      },
    };
  }

  /**
   * Get data lần đầu tiên
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
      this.dangKyPheDuyetTruLuongKSItem = await this.getDangKyPheDuyetTruLuongKhoangSan(
        this.idhoso
      );
      if (this.dangKyPheDuyetTruLuongKSItem) {
        this.currentAction = ActionDataEnum.Edit;
        // Khởi tạo dữ liệu form trong trường hợp sửa dữ liệu Hồ Sơ
        await this.formOnEdit();
      } else {
        this.currentAction = ActionDataEnum.Add;
        this.onFormReset();
      }
      this.selectCurrentFormState();
    }

    // Lấy dữ liệu hệ quy chiếu
    // await this.geAllHeQuyChieu();

    return true;
  }

  /**
   * Lấy dữ liệu hồ sơ theo IdHoSo
   * @param idHoSo
   */
  async getDangKyPheDuyetTruLuongKhoangSan(idHoSo: string) {
    const dkPheDuyetTruLuongService = this.dangKyHoatDongKhoangSanFacadeService.getDangKyPheDuyetTruLuongKSService();
    const dangKyItem = (await dkPheDuyetTruLuongService
      .getByIdHoSo(idHoSo)
      .toPromise()) as OutputDKPheDuyetTruLuongKSModel;
    console.log(dangKyItem);
    return dangKyItem;
  }
  /**
   * hàm set value cho form
   */
  private async formOnEdit() {
    if (this.currentAction === ActionDataEnum.Edit) {
      if (this.dangKyPheDuyetTruLuongKSItem) {
        this.pheDuyetTruLuongKSForm.setValue({
          tenbaocaothamdo: this.dangKyPheDuyetTruLuongKSItem.tenbaocaothamdo,
          ngaylapbaocao: this.dangKyPheDuyetTruLuongKSItem.ngaylapbaocao,
          donvituvan: this.dangKyPheDuyetTruLuongKSItem.donvituvan,
          sogiayphep: this.dangKyPheDuyetTruLuongKSItem.sogiayphep,
          ngaycapphep: this.datePipe.transform(this.dangKyPheDuyetTruLuongKSItem.ngaycapphep, "dd-MM-yyyy"),
          coquancapphep: this.dangKyPheDuyetTruLuongKSItem.coquancapphep,
        });
      }
    }
  }

  /**
   * Hàm reset form, gọi khi nhấn nút reset dữ liệu
   */
  onFormReset() {
    // Hàm .reset sẽ xóa trắng mọi control trên form
    this.pheDuyetTruLuongKSForm.reset();
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
   * Xóa đăng ký thăm do theo Id hồ sơ
   */
  deleteDangKyPheDuyetTruLuongKS() {
    const dialogRef = this.commonService.confirmDeleteDiaLogService(
      this.dataTranslate.DANGKYHOATDONGKHOANGSAN.thongtinchitietpheduyettruluongks
        .contentDelete,""
    );
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === "confirm") {
        var iddkpheduyettruluong: string = this.dangKyPheDuyetTruLuongKSItem.iddkpheduyettruluong;
        await this.dangKyHoatDongKhoangSanFacadeService
          .getDangKyPheDuyetTruLuongKSService()
          .deleteItem({ iddkpheduyettruluong })
          .subscribe(
            () => {
              this.dangKyPheDuyetTruLuongKSItem = null;
              this.currentAction = ActionDataEnum.Add;
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


  //mở sideNav chọn Số giấy phép thăm dò
  openDanhSachGiayPhepIOSidenav(): void {
       // clear Sidenav
    this.matSidenavService.clearSidenav();
    // Khởi tạo sidenav
    this.matSidenavService.setSidenav(this.matSidenav, this, this.content, this.cfr);
    this.matSidenavService.setTitle(this.dataTranslate.HOSOGIAYTO.giayphep.titleSelect);
    this.matSidenavService.setContentComp(GiayphepOptionComponent, "select");
    this.matSidenavService.open();
  }
  
    /**
   * Hàm đóng sidenav
   */
  closeIOSidenav() {
    this.matSidenavService.close();
  }
  /**
   * lấy item dữ liệu đối tượng giấy phép lịch sử từ popup
   */
  private selectItemGiayPhep(item: OutputGiayPhepModel) {
    if (item !== DefaultValue.Null && item !== DefaultValue.Undefined) {
      console.log(item);
      this.pheDuyetTruLuongKSForm.controls.sogiayphep.setValue(item.sogiayphep);
      this.idgiayphep=item.idgiayphep;
      //Lấy thông tin Giấy phép từ API + bind ra giao diện
      this.layThongTinGiayPhepThamDo();
      // this.pheDuyetTruLuongKSForm.controls.ngaycapphep.setValue(this.datePipe.transform(item.ngaycapphep, "dd-MM-yyyy"));
      // this.pheDuyetTruLuongKSForm.controls.coquancapphep.setValue(item.coquancapphep);
    }
  }
  
    // Hàm dùng để gọi các hàm khác, truyền vào tên hàm cần thực thi
    doFunction(methodName, obj) {
      this[methodName](obj);
    }

  /**
   * hàm kiểm tra validation form
   */
  private logAllValidationErrorMessages() {
    validationAllErrorMessagesService(
      this.pheDuyetTruLuongKSForm,
      this.validationErrorMessages,
      this.formErrors
    );
  }
  //Lấy thông tin hồ sơ bind lên giao diện khi người dùng nhập tay số giấy phép thăm dò
  async layThongTinGiayPhepThamDo(){
    var idgiayphepthamdo= this.idgiayphep;
    if(idgiayphepthamdo){
      const dkPheDuyetTruLuongService = this.dangKyHoatDongKhoangSanFacadeService.getDangKyPheDuyetTruLuongKSService();
      const sogiayphepItem = (await dkPheDuyetTruLuongService
        .layThongTinGiayPhepThamDo(idgiayphepthamdo)
        .toPromise()) as OutputDKPheDuyetTruLuongKSModel;
        if(sogiayphepItem){
          this.pheDuyetTruLuongKSForm.controls.ngaycapphep.setValue(this.datePipe.transform(sogiayphepItem.ngaycapphep, "dd-MM-yyyy"));
          this.pheDuyetTruLuongKSForm.controls.coquancapphep.setValue(sogiayphepItem.coquancapphep);
        }
        else{
          this.pheDuyetTruLuongKSForm.controls.ngaycapphep.setValue("");
          this.pheDuyetTruLuongKSForm.controls.coquancapphep.setValue("");
        }
      
      console.log(sogiayphepItem);
    }
   
  }

  //Lưu thông tin đăng ký đấu giá khai thác khoáng sản
  async saveDangKyPheDuyetTruLuongKS() {
    console.log(this.pheDuyetTruLuongKSForm.value);
    this.logAllValidationErrorMessages();

    if (!this.pheDuyetTruLuongKSForm.valid) {
      return;
    }

    // Gán dữ liệu input vào model
    const dkPheDuyetTruLuongService = this.dangKyHoatDongKhoangSanFacadeService.getDangKyPheDuyetTruLuongKSService();
    const inputModel = this.pheDuyetTruLuongKSForm.value;
    inputModel.idhoso = this.idhoso;
    inputModel.idgiayphep=this.idgiayphep;
    if (this.currentAction === ActionDataEnum.Add) {
      dkPheDuyetTruLuongService.addItem(inputModel).subscribe(
        async (res) => {
          this.dangKyPheDuyetTruLuongKSItem = inputModel;
          this.dangKyPheDuyetTruLuongKSItem.iddkpheduyettruluong =
            res.iddkpheduyettruluong;
            this.idgiayphep=this.dangKyPheDuyetTruLuongKSItem.idgiayphep;
          this.currentAction = ActionDataEnum.Edit;
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
    } else if (this.currentAction === ActionDataEnum.Edit) {
      inputModel.iddkpheduyettruluong = this.dangKyPheDuyetTruLuongKSItem.iddkpheduyettruluong;
      inputModel.idgiayphep=this.idgiayphep;
      dkPheDuyetTruLuongService.updateItem(inputModel).subscribe(
        async (res) => {
          this.dangKyPheDuyetTruLuongKSItem = inputModel;
          this.idgiayphep=this.dangKyPheDuyetTruLuongKSItem.idgiayphep;
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
}
