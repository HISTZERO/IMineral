import { Component, OnInit, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LoaiDoiTuong, HinhThucNopHoSo, HinhThucNhanKetQua } from 'src/app/shared/constants/common-constants';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoaiDoiTuongEnum, TrangThaiEnum, Paging } from 'src/app/shared/constants/enum';
import { LoaiGiayTo } from 'src/app/shared/constants/loaigiayto-constants';
import { DmFacadeService } from "src/app/services/admin/danhmuc/danhmuc-facade.service";
import { OutputDmLoaiCapPhepModel } from 'src/app/models/admin/danhmuc/loaicapphep.model';

@Component({
  selector: 'app-hoso-io',
  templateUrl: './hoso-io.component.html',
  styleUrls: ['./hoso-io.component.scss']
})
export class HosoIoComponent implements OnInit {
  // tslint:disable-next-line: no-input-rename
  @Input("allowAutoInit") allowAutoInit = true;
  // Nhóm loại cấp phép Input property
  // tslint:disable-next-line: no-input-rename
  @Input("nhomLoaiCapPhep") nhomLoaiCapPhep;
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
              private dmFacadeService: DmFacadeService) { }

  async ngOnInit() {
    if (this.allowAutoInit) {
      await this.manualInit();
    }
  }

  /**
   * Khởi tạo form
   */
  async manualInit() {
    // Khởi tạo form
    this.formInit();
    // Lấy dữ liệu translate
    await this.getDataTranslate();
    // Lấy dữ liệu loại cấp phép
    await this.getLoaiCapPhepAll();
  }

  /**
   * Hàm khởi tạo form
   */
  formInit() {
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
  async getDataTranslate() {
    // Lấy ra biến translate của hệ thống
    this.dataTranslate = await this.translate
      .getTranslation(this.translate.getDefaultLang())
      .toPromise();
    // Hàm set validation cho form
    await this.setValidation();
  }

  /**
   * Hàm set validate
   */
  setValidation() {
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
}
