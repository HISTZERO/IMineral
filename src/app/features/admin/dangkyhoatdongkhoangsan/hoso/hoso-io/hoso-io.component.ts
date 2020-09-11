import { Component, OnInit, Input, ViewContainerRef, ViewChild, ComponentFactoryResolver } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LoaiDoiTuong, HinhThucNopHoSo, HinhThucNhanKetQua } from 'src/app/shared/constants/common-constants';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoaiDoiTuongEnum, TrangThaiEnum, Paging, HoSoActionEnum, InsertedState } from 'src/app/shared/constants/enum';
import { LoaiGiayTo } from 'src/app/shared/constants/loaigiayto-constants';
import { DmFacadeService } from "src/app/services/admin/danhmuc/danhmuc-facade.service";
import { OutputDmLoaiCapPhepModel } from 'src/app/models/admin/danhmuc/loaicapphep.model';
import { OutputHsCoQuanTiepNhanModel } from 'src/app/models/admin/thietlap/coquantiepnhan.model';
import { HethongFacadeService } from 'src/app/services/admin/hethong/hethong-facade.service';
import { ActivatedRoute } from '@angular/router';
import { DangKyHoatDongKhoangSanFacadeService } from 'src/app/services/admin/dangkyhoatdongkhoangsan/dangkyhoatdongkhoangsan-facade.service';
import { InputHoSoModel, OutputHoSoModel } from 'src/app/models/admin/dangkyhoatdongkhoangsan/hoso.model';
import { CommonServiceShared } from 'src/app/services/utilities/common-service';
import { HttpErrorResponse } from '@angular/common/http';
import { validationAllErrorMessagesService } from "src/app/services/utilities/validatorService";
import { MatsidenavService } from 'src/app/services/utilities/matsidenav.service';
import { MatSidenav } from '@angular/material';
import { DmCanhanOptionComponent } from '../../../danhmuc/canhan/canhan-option/canhan-option.component';

@Component({
  selector: 'app-hoso-io',
  templateUrl: './hoso-io.component.html',
  styleUrls: ['./hoso-io.component.scss']
})
export class HosoIoComponent implements OnInit {
  @ViewChild("compio", { read: ViewContainerRef, static: true }) public content: ViewContainerRef;
  @ViewChild("aside", { static: true }) public matSidenav: MatSidenav;
  // tslint:disable-next-line: no-input-rename
  @Input("allowAutoInit") allowAutoInit = true;
  // Nhóm loại cấp phép
  // tslint:disable-next-line: no-input-rename
  @Input("nhomLoaiCapPhep") nhomLoaiCapPhep;
  // State của Save button
  // tslint:disable-next-line: no-input-rename
  @Input("insertedState") insertedState = InsertedState.SaveAndRefresh;
  // Chứa dữ liệu Form
  public hosoIOForm: FormGroup;
  // Chứa dữ liệu translate
  public dataTranslate: any;
  // Chứa dữ liệu loại đối tượng
  public loaiDoiTuongList = LoaiDoiTuong;
  // Chứa dữ liệu loại giấy tờ
  public loaiGiayToList = LoaiGiayTo;
  public loaiGiayToFilters = LoaiGiayTo;
  // Chứa dữ liệu hình thức nộp hồ sơ
  public hinhThucNopHoSoList = HinhThucNopHoSo;
  public hinhThucNopHoSoFilters = HinhThucNopHoSo;
  // Chứa dữ liệu hình thức nhận kết quả
  public hinhThucNhanKetQuaList = HinhThucNhanKetQua;
  public hinhThucNhanKetQuaFilters = HinhThucNhanKetQua;
  // Chứa dữ liệu loại cấp phép
  public loaiCapPhepList: OutputDmLoaiCapPhepModel[];
  public loaiCapPhepFilters: OutputDmLoaiCapPhepModel[];
  // Chứa dữ liệu cơ quan tiếp nhận
  public coQuanTiepNhanList: OutputHsCoQuanTiepNhanModel[];
  public coQuanTiepNhanFilters: OutputHsCoQuanTiepNhanModel[];
  // chứa dữ liệu Id Hồ sơ
  private idhoso: string;
  // Action thao tác dữ liệu
  private currentAction: number;
  // Chứa dữ liệu input
  public inputModel: InputHoSoModel;
  // error message
  validationErrorMessages = {};

  // form errors
  formErrors = {
    mahoso: "",
    mabiennhan: "",
    soden: "",
    ngaynop: "",
    ngaytiepnhan: "",
    ngaytraketqua: "",
    loaidoituong: "",
    loaicapphep: "",
    hinhthucnophoso: "",
    hinhthucnhanketqua: "",
    idcoquantiepnhan: "",
    tencanhantochuc: "",
    sogiayto: "",
    loaigiayto: "",
    ngaycap: "",
    noicap: "",
    diachi: "",
    dienthoai: "",
    fax: "",
    email: "",
    website: "",
  };

  constructor(private translate: TranslateService,
              private formBuilder: FormBuilder,
              private dmFacadeService: DmFacadeService,
              private hethongFacadeService: HethongFacadeService,
              private dangKyHoatDongKhoangSanFacadeService: DangKyHoatDongKhoangSanFacadeService,
              public commonService: CommonServiceShared,
              private activatedRoute: ActivatedRoute,
              public matSidenavService: MatsidenavService,
              public cfr: ComponentFactoryResolver) { }

  async ngOnInit() {
    if (this.allowAutoInit) {
      await this.manualInit();
    }
  }

  /**
   * Khởi tạo form
   */
  async manualInit() {
    this.activatedRoute.queryParamMap.subscribe((param: any) => {
      this.idhoso = param.params.idhoso;
    });

    if (this.idhoso !== null && this.idhoso !== undefined) {
      this.currentAction = HoSoActionEnum.Edit;
    } else {
      this.currentAction = HoSoActionEnum.Add;
    }

    // Khởi tạo form
    this.formInit();
    // Lấy dữ liệu translate
    await this.getDataTranslate();
    // Khởi tạo sidenav
    this.matSidenavService.setSidenav(this.matSidenav, this, this.content, this.cfr);
    // Lấy dữ liệu loại cấp phép
    await this.getLoaiCapPhepAll();
    // Lấy dữ liệu cơ quan tiếp nhận
    await this.getCoQuanTiepNhanAll();
    // Khởi tạo dữ liệu form trong trường hợp sửa dữ liệu Hồ Sơ
    await this.formOnEdit();
  }

  /**
   * Hàm khởi tạo form
   */
  private formInit() {
    this.hosoIOForm = this.formBuilder.group({
      mahoso: ["", Validators.required],
      mabiennhan: [""],
      soden: [""],
      ngaynop: ["", Validators.required],
      ngaytiepnhan: ["", Validators.required],
      ngaytraketqua: ["", Validators.required],
      loaidoituong: [LoaiDoiTuongEnum.ToChuc, Validators.required],
      loaicapphep: ["", Validators.required],
      hinhthucnophoso: ["", Validators.required],
      hinhthucnhanketqua: ["", Validators.required],
      idcoquantiepnhan: ["", Validators.required],
      tencanhantochuc: ["", Validators.required],
      sogiayto: ["", Validators.required],
      loaigiayto: ["", Validators.required],
      ngaycap: ["", Validators.required],
      noicap: ["", Validators.required],
      diachi: ["", Validators.required],
      dienthoai: ["", Validators.pattern("^[0-9-+]+$")],
      fax: [""],
      email: [""],
      website: [""],
    });
  }

  /**
   * hàm lấy dữ liệu translate
   */
  public async getDataTranslate() {
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
  private async formOnEdit() {
    if (this.currentAction === HoSoActionEnum.Edit) {
      this.inputModel = await this.getHoSoById(this.idhoso);
      this.hosoIOForm.setValue({
        mahoso: this.inputModel.mahoso,
        mabiennhan: this.inputModel.mabiennhan,
        soden: this.inputModel.soden,
        ngaynop: this.inputModel.ngaynop,
        ngaytiepnhan: this.inputModel.ngaytiepnhan,
        ngaytraketqua: this.inputModel.ngaytraketqua,
        loaidoituong: this.inputModel.loaidoituong,
        loaicapphep: this.inputModel.loaicapphep,
        hinhthucnophoso: this.inputModel.hinhthucnophoso,
        hinhthucnhanketqua: this.inputModel.hinhthucnhanketqua,
        idcoquantiepnhan: this.inputModel.idcoquantiepnhan,
        tencanhantochuc: this.inputModel.tencanhantochuc,
        sogiayto: this.inputModel.sogiayto,
        loaigiayto: this.inputModel.loaigiayto,
        ngaycap: this.inputModel.ngaycap,
        noicap: this.inputModel.noicap,
        diachi: this.inputModel.diachi,
        dienthoai: this.inputModel.dienthoai,
        fax: this.inputModel.fax,
        email: this.inputModel.email,
        website: this.inputModel.website,
      });
    }
  }

  /**
   * Hàm set validate
   */
  private setValidation() {
    this.validationErrorMessages = {
      mahoso: { required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.hoso.mahosoRequired },
      mabiennhan: { required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.hoso.mabiennhanRequired },
      // soden: { required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.hoso.sodenRequired },
      ngaynop: { required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.hoso.ngaynopRequired },
      ngaytiepnhan: { required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.hoso.ngaytiepnhanRequired },
      ngaytraketqua: { required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.hoso.ngaytraketquaRequired },
      loaidoituong: { required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.hoso.loaidoituongRequired },
      loaicapphep: { required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.hoso.loaicapphepRequired },
      hinhthucnophoso: { required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.hoso.hinhthucnophosoRequired },
      hinhthucnhanketqua: { required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.hoso.hinhthucnhanketquaRequired },
      idcoquantiepnhan: { required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.hoso.idcoquantiepnhanRequired },
      tencanhantochuc: { required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.hoso.tencanhantochucRequired },
      sogiayto: { required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.hoso.sogiaytoRequired },
      loaigiayto: { required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.hoso.loaigiaytoRequired },
      ngaycap: { required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.hoso.ngaycapRequired },
      noicap: { required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.hoso.noicapRequired },
      diachi: { required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.hoso.diachiRequired },
      // dienthoai: { required: this.dataTranslate.DANGKYHOATDONGKHOANGSAN.hoso.dienthoaiRequired },
    };
  }

  async getLoaiCapPhepAll() {
    const listData: any = await this.dmFacadeService
      .getDmLoaiCapPhepService()
      .getFetchAll({Nhomloaicapphep: this.nhomLoaiCapPhep, TrangThai: TrangThaiEnum.Active, PageNumber: Paging.PageNumber, PageSize: Paging.PageSize });
    this.loaiCapPhepList = listData.items;
    this.loaiCapPhepFilters = listData.items;
  }

  async getCoQuanTiepNhanAll() {
    const listData: any = await this.hethongFacadeService
      .getCoQuanTiepNhanService()
      .getFetchAll({PageNumber: Paging.PageNumber, PageSize: Paging.PageSize });
    this.coQuanTiepNhanList = listData.items;
    this.coQuanTiepNhanFilters = listData.items;
  }

  /**
   * Lấy dữ liệu hồ sơ theo IdHoSo
   * @param idHoSo
   */
  private async getHoSoById(idHoSo: string) {
    const dangKyHoatDongKhoangSanFacadeService = this.dangKyHoatDongKhoangSanFacadeService.getHoSoService();
    const hosoItem = await dangKyHoatDongKhoangSanFacadeService.getByid(idHoSo).toPromise();
    return hosoItem;
  }

  async saveItemHoSo() {
    this.logAllValidationErrorMessages();

    if (!this.hosoIOForm.valid) {
      return;
    }

    if (this.currentAction === HoSoActionEnum.Add && (this.insertedState === InsertedState.SaveAndRefresh || this.insertedState === InsertedState.SaveAndEdit)) {
      // Gán dữ liệu input vào model
      const dangKyHoatDongKhoangSanFacadeService = this.dangKyHoatDongKhoangSanFacadeService.getHoSoService();
      this.inputModel = this.hosoIOForm.value;
      const currentLoaiCapPhep = this.loaiCapPhepList.find(item => item.maloaicapphep === this.hosoIOForm.controls.loaicapphep.value);
      this.inputModel.idthutuchanhchinh = currentLoaiCapPhep.idthutuchanhchinh;
      this.inputModel.nhomloaicapphep = currentLoaiCapPhep.nhomloaicapphep;
      dangKyHoatDongKhoangSanFacadeService.addItem(this.inputModel).subscribe(
        async (res) => {
          if (this.insertedState === InsertedState.SaveAndEdit) {
            this.idhoso = res.idhoso;
            this.currentAction = HoSoActionEnum.Edit;
          } else {
            this.onFormReset();
          }
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
    } else if (this.currentAction === HoSoActionEnum.Edit) {

    }
  }

  /**
   * hàm kiểm tra validation form
   */
  private logAllValidationErrorMessages() {
    validationAllErrorMessagesService(
      this.hosoIOForm,
      this.validationErrorMessages,
      this.formErrors
    );
  }

  /**
   * Hàm reset form, gọi khi nhấn nút reset dữ liệu
   */
  public onFormReset() {
    // Hàm .reset sẽ xóa trắng mọi control trên form
    this.hosoIOForm.reset();
    this.hosoIOForm.controls.loaidoituong.setValue(LoaiDoiTuongEnum.ToChuc);
    this.hosoIOForm.controls.loaigiayto.setValue("");
    this.hosoIOForm.controls.loaicapphep.setValue("");
    this.hosoIOForm.controls.hinhthucnophoso.setValue("");
    this.hosoIOForm.controls.hinhthucnhanketqua.setValue("");
    this.hosoIOForm.controls.idcoquantiepnhan.setValue("");
  }

   /**
    * Hàm mở sidenav
    */
  public openIOSidenav() {
    this.matSidenavService.setTitle(this.dataTranslate.DANHMUC.canhan.titleSelect);
    this.matSidenavService.setContentComp(DmCanhanOptionComponent, "select");
    this.matSidenavService.open();
  }

  /**
   * Hàm đóng sidenav
   */
  public closeIOSidenav() {
    this.matSidenavService.close();
  }
}
