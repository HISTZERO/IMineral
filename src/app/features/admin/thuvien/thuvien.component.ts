import { TranslateService } from "@ngx-translate/core";
import { Component, Inject, OnInit, HostListener, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatMenuTrigger } from "@angular/material/menu";
import { DatePipe } from "@angular/common";
import { HttpErrorResponse } from "@angular/common/http";
import { SplitAreaDirective, SplitComponent } from "angular-split";

import {
  displayFieldCssService,
  validationAllErrorMessagesService, ValidatorToaDoService
} from "src/app/services/utilities/validatorService";
import { OutputProjectionModel } from "src/app/models/admin/map/projection.model";
import { MapFacadeService } from "src/app/services/admin/map/map-facade.service";
import { ObjKeyArray } from "src/app/shared/constants/objkey-constants";
import { InputGmediaModel, OutputGmediaModel } from "src/app/models/admin/common/gmedia.model";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { MatdialogService } from "src/app/services/utilities/matdialog.service";
import { MyAlertDialogComponent } from "src/app/shared/components/my-alert-dialog/my-alert-dialog.component";
import { CommonFacadeService } from "src/app/services/admin/common/common-facade.service";
import { ThietlapFacadeService } from "src/app/services/admin/thietlap/thietlap-facade.service";
import { _editMediaAction, _MediaDeleteAction } from "src/app/shared/constants/actions/common/media";
import { ThietLapHeThong } from "src/app/shared/constants/setting-common";

@Component({
  selector: 'app-thuvien',
  templateUrl: './thuvien.component.html',
  styleUrls: ['./thuvien.component.scss']
})
export class ThuvienComponent implements OnInit {
  // @ts-ignore
  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;
  ObjKeyArray = ObjKeyArray.ArrayObj;
  mediaIOForm: FormGroup;
  arrayIndex: number[] = [];
  activeTabCheck = 0;
  setSearch = '';
  changeClass = 'overflow-hidden';
  pageNumber: number;
  pageSize: number;
  listData: any;
  listDataItems: OutputGmediaModel[] = [];
  loaiGiaoDien: number;
  maxHeight = '55vh';
  type = '';
  checkLoadMore = true;
  navArray = [
    { title: "Quản trị", url: "/admin" },
    {
      title: "Thư viện",
      url: "/admin/thuvien"
    }
  ];
  @ViewChild('split', { static: false }) split: SplitComponent;
  @ViewChild('area1', { static: false }) area1: SplitAreaDirective;
  @ViewChild('area2', { static: false }) area2: SplitAreaDirective;
  @HostListener('scroll', ['$event'])
  public projection: any;
  public projectionFilters: OutputProjectionModel[];
  errorX = '';
  errorY = '';
  errorSrid = '';
  errorKieuToaDo = '';
  validationErrorMessages = {};

  // Các biến translate
  public dataTranslate: any;

  inputModel: InputGmediaModel;
  // form errors
  formErrors = {
    toadox: "",
    toadoy: "",
    caodoz: "",
    srid: "",
    vitri: "",
    objKey: "",
    tieude: "",
    idLoaitailieu: "",
    tacgia: "",
    nguoiky: "",
    note: "",
    kieutoado: ""
  };
  buttonArray = [];

  // Danh sách các quyền
  deleteMediaAction = _MediaDeleteAction;
  editMediaAction = _editMediaAction;
  constructor(
    public dialogRef: MatDialogRef<ThuvienComponent>,
    @Inject(MAT_DIALOG_DATA) public dataGetIO: any,
    private formBuilder: FormBuilder,
    public mapFacadeService: MapFacadeService,
    public cmFacadeService: CommonFacadeService,
    public validatorToaDoService: ValidatorToaDoService,
    private datePipe: DatePipe,
    public commonService: CommonServiceShared,
    public imDialogService: MatdialogService,
    private modalDialog: MatDialog,
    public thietlapFacadeService: ThietlapFacadeService,
    private translate: TranslateService) {
  }

  async ngOnInit() {
    await this.bindingConfigValidation();
    // Lấy dữ liệu biến translate để gán vào các biến trong component
    this.dataTranslate = await this.translate
      .getTranslation(this.translate.getDefaultLang())
      .toPromise();

    this.getPagesize();
    this.getLoaiGiaoDien();
    this.showProjection();
  }

  /**
   * Lấy pageSize trong bảng setting theo mediaPageSize
   */
  async getPagesize() {
    // Get settings
    const pageSize: any = await this.thietlapFacadeService
      .getThietLapHeThongService()
      .getSettingKey({ key: ThietLapHeThong.mediaPageSize });
    this.pageSize = pageSize;
    this.getPageMedia();
  }
  /**
   * Set loại giao diện nào của thư viện
   */
  getLoaiGiaoDien() {
    this.loaiGiaoDien = 0;
    if (this.dataGetIO.model === 'simpleFileV1') {
      this.loaiGiaoDien = 1;
      this.maxHeight = '400px';
      this.type = 'img';
    } else {
      if (this.dataGetIO.model === 'simpleFileV2') {
        this.loaiGiaoDien = 2;
        this.maxHeight = '400px';
      }
    }
  }

  /**
   * Get all phân trang Media
   */
  getPageMedia() {
    this.arrayIndex = [];
    this.pageNumber = 1;
    this.cmFacadeService
      .getGmediaService()
      .getAll({ PageNumber: 1, PageSize: this.pageSize, Type: this.type }).subscribe(data => {
        this.listData = data;
        if (this.listData.items.length < this.pageSize) {
          this.checkLoadMore = false;
        }
        this.listDataItems = this.listData.items;
        this.setIconShow();
      });
  }
  // config input validation form
  bindingConfigValidation() {
    this.mediaIOForm = this.formBuilder.group({
      toadox: ["", Validators.pattern(/^[-+]?\d*\.?\d*$/)],
      toadoy: ["", Validators.pattern(/^[-+]?\d*\.?\d*$/)],
      caodoz: ["", Validators.pattern(/^[-+]?\d*\.?\d*$/)],
      srid: [""],
      vitri: [""],
      objKey: [""],
      tieude: [""],
      idLoaitailieu: [""],
      tacgia: [""],
      nguoiky: [""],
      note: [""],
      kieutoado: [""]
    });
  }

  setValueToForm(data) {
    this.mediaIOForm.setValue({
      toadox: data.toadox,
      toadoy: data.toadoy,
      caodoz: data.caodoz,
      srid: data.srid,
      vitri: data.vitri,
      objKey: data.objKey,
      tieude: data.tieude,
      idLoaitailieu: data.idLoaitailieu,
      tacgia: data.tacgia,
      nguoiky: data.nguoiky,
      note: data.note,
      kieutoado: data.kieutoado
    });
  }
  /**
   * Thêm File vào  side bar khi select và nếu chỉ chọn 1 file sẽ lưu file đó
   */
  addFiles() {
    this.imDialogService.dataResult = null;
    const arrayFileChecked: any[] = [];
    this.listDataItems.map((value) => {
      if (value.checked === true) {
        arrayFileChecked.push(value);
      }
    });
    this.errorX = '';
    this.errorY = '';
    this.errorSrid = '';
    this.errorKieuToaDo = '';
    // Gọi service validator Tọa độ x, y. srid
    this.validatorToaDoService.validatorToaDo(this.mediaIOForm);
    this.errorX = this.validatorToaDoService.errorX;
    this.errorY = this.validatorToaDoService.errorY;
    this.errorSrid = this.validatorToaDoService.errorSrid;
    this.errorKieuToaDo = this.validatorToaDoService.errorKieuToaDo;
    if (this.validatorToaDoService.submit === true) {
      if (!this.mediaIOForm.value.kieutoado === true) {
        this.mediaIOForm.controls.srid.setValue("");
        this.mediaIOForm.controls.toadox.setValue("");
        this.mediaIOForm.controls.toadoy.setValue("");
        this.mediaIOForm.controls.caodoz.setValue("");
      }
      this.inputModel = this.mediaIOForm.value;
      this.inputModel.id = arrayFileChecked[0].id;
      this.inputModel.link = arrayFileChecked[0].link;
      this.cmFacadeService
        .getGmediaService()
        .updateItem(this.inputModel)
        .subscribe(
          res => {
            if (this.dataGetIO.model) {
              this.imDialogService.dataResult = arrayFileChecked;
              this.dialogRef.close(`Oke`);
            } else {
              this.getPageMedia();
            }
          },
          (error: HttpErrorResponse) => this.commonService.showError(error),
          () => {
            if (this.loaiGiaoDien === 0) {
              this.commonService.showeNotiResult(
                this.dataTranslate.COMMON.default.successEdit,
                2000
              );
            }
          }
        );
    }
  }

  /**
   * function button hủy bỏ
   */
  onNoClick() {
    this.dialogRef.close();
  }

  downloadFile() {
    this.listDataItems.map((data) => {
      if (data.checked === true) {
        window.open(data.link, "_blank");
      }
    });
  }
  /**
   * Delete file hoặc multifile
   */
  async deleteFile() {
    const arrayIdFileChecked: number[] = [];
    this.listDataItems.map((data) => {
      if (data.checked === true) {
        arrayIdFileChecked.push(data.id);
      }
    });
    const dialogRef = this.modalDialog.open(MyAlertDialogComponent);
    this.cmFacadeService
      .getGmediaService()
      .deleteArrayItem(arrayIdFileChecked).subscribe(
        () => this.getPageMedia(),
        (error: HttpErrorResponse) => {
          this.commonService.showeNotiResult(error.message, 2000);
        },
        () => this.commonService.showeNotiResult(this.dataTranslate.COMMON.default.successDelete, 2000)
      );
  }
  /**
   * Get hệ tọa độ srid
   */
  async showProjection() {
    this.projection = await this.mapFacadeService
      .getProjectionService()
      .getFetchAll();
    this.projectionFilters = this.projection;
  }

  /**
   * Validate khi click nút submit
   */
  public logAllValidationErrorMessages() {
    validationAllErrorMessagesService(
      this.mediaIOForm,
      this.validationErrorMessages,
      this.formErrors
    );
  }

  /**
   * Reset lại validator tọa độ
   */
  public resetValidator() {
    this.errorX = '';
    this.errorY = '';
    this.errorSrid = '';
  }
  /**
   * display fields css
   * @param field
   */
  public displayFieldCss(field: string) {
    displayFieldCssService(field);
  }

  /**
   * Hàm khi checked 1 file
   * @param checked
   * @param i
   */
  showOptions(checked, i) {
    this.listDataItems[i].checked = checked;
    if (this.loaiGiaoDien === 0) {
      if (this.listDataItems[i].checked === true) {
        this.arrayIndex.push(i);
        this.setValueToForm(this.listDataItems[this.arrayIndex[0]]);
      } else {
        this.arrayIndex.splice(this.arrayIndex.indexOf(i), 1);
        if (this.arrayIndex.length === 0) {
        } else { this.setValueToForm(this.listDataItems[this.arrayIndex[0]]); }
      }
    } else {
      if ((this.loaiGiaoDien === 1) || (this.loaiGiaoDien === 2)) {
        if (this.listDataItems[i].checked === true) {
          this.arrayIndex.push(i);
          this.setValueToForm(this.listDataItems[this.arrayIndex[0]]);
          if (this.arrayIndex.length > 1) {
            this.listDataItems[this.arrayIndex[0]].checked = false;
            this.arrayIndex.splice(0, 1);
            this.setValueToForm(this.listDataItems[this.arrayIndex[0]]);
          }
        } else { this.arrayIndex = []; }
      }
    }
  }

  /**
   * Hàm khi click vào thẻ div body img ảnh file
   * @param i
   */
  clickDivFile(i) {
    this.listDataItems[i].checked = !this.listDataItems[i].checked;
    if (this.loaiGiaoDien === 0) {
      if (this.listDataItems[i].checked === true) {
        this.arrayIndex.push(i);
        this.setValueToForm(this.listDataItems[this.arrayIndex[0]]);
      } else {
        this.arrayIndex.splice(this.arrayIndex.indexOf(i), 1);
        if (this.arrayIndex.length === 0) {
        } else { this.setValueToForm(this.listDataItems[this.arrayIndex[0]]); }
      }
    } else {
      if ((this.loaiGiaoDien === 1) || (this.loaiGiaoDien === 2)) {
        if (this.listDataItems[i].checked === true) {
          this.arrayIndex.push(i);
          this.setValueToForm(this.listDataItems[this.arrayIndex[0]]);
          if (this.arrayIndex.length > 1) {
            this.listDataItems[this.arrayIndex[0]].checked = false;
            this.arrayIndex.splice(0, 1);
            this.setValueToForm(this.listDataItems[this.arrayIndex[0]]);
          }
        } else { this.arrayIndex = []; }
      }
    }
  }
  /**
   * Hàm lăn thanh cuộn đến cuối
   * @param event
   */
  async onScroll(event: any) {
    if (this.checkLoadMore === true) {
      if ((event.target.offsetHeight + event.target.scrollTop + 2) >= event.target.scrollHeight) {
        this.pageNumber++;
        if (!this.setSearch === true) {
          this.cmFacadeService
            .getGmediaService()
            .getAll({ PageNumber: this.pageNumber, PageSize: this.pageSize, Type: this.type }).subscribe(data => {
              this.listData = data;
              if (this.listData.items.length < this.pageSize) {
                this.checkLoadMore = false;
              }
              this.listDataItems.push.apply(this.listDataItems, this.listData.items);
              this.setIconShow();
            });
        } else {
          this.cmFacadeService
            .getGmediaService()
            .searchItem({ Tieude: this.setSearch, PageNumber: this.pageNumber, PageSize: this.pageSize, Type: this.type }).subscribe(data => {
              this.listData = data;
              if (this.listData.items.length < this.pageSize) {
                this.checkLoadMore = false;
              }
              this.listDataItems.push.apply(this.listDataItems, this.listData.items);
              this.setIconShow();
            });
        }
      }
    }
  }

  /**
   * Sự kiện thay đổi tab
   * @param event
   */
  selectTabChange(event) {
    this.activeTabCheck = 0;
    if (event.index === 1) {
      this.activeTabCheck = 1;
    }
  }

  /**
   * Sự kiện lấy dữ liệu từ tab upload chuyền sang
   * @param event
   */
  getDataUpload(event) {
    this.activeTabCheck = 0;
    this.arrayIndex = [];
    this.pageNumber = 1;
    for (let i = 0; i < event.length; i++) {
      this.arrayIndex.push(i);
    }
    // Load lại data và select file vừa upload
    this.cmFacadeService
      .getGmediaService()
      .getAll({ PageNumber: 1, PageSize: this.pageSize, Type: this.type }).subscribe(data => {
        this.listData = data;
        this.listDataItems = this.listData.items;
        this.setValueToForm(this.listDataItems[this.arrayIndex[0]]);
        for (let i = 0; i < event.length; i++) {
          this.listDataItems[i].checked = true;
        }
        this.setIconShow();
      });
  }

  /**
   * Hàm search enter key
   * @param data
   */
  searchEnter(data) {
    if (data) {
      this.setSearch = data;
      this.arrayIndex = [];
      this.cmFacadeService
        .getGmediaService()
        .searchItem({ Tieude: data, PageNumber: 1, PageSize: this.pageSize, Type: this.type }).subscribe(obj => {
          this.listData = obj;
          this.listDataItems = this.listData.items;
          this.setIconShow();
        });
    } else { this.getPageMedia(); this.setSearch = ''; }
  }

  /**
   * show icon docx, xlsx, pdf,...
   */
  setIconShow() {
    this.listDataItems.map((value, index) => {
      switch (value.type) {
        case '.docx':
          this.listDataItems[index].iconFile = "fas fa-file-word";
          break;
        case '.pdf':
          this.listDataItems[index].iconFile = "fas fa-file-pdf";
          break;
        case '.xls':
          this.listDataItems[index].iconFile = "fas fa-file-excel";
          break;
        case '.pptx':
          this.listDataItems[index].iconFile = "fas fa-file-powerpoint";
          break;
        case '.js':
        case '.html':
          this.listDataItems[index].iconFile = "fas fa-file-code";
          break;
        case '.mp4':
        case '.aiv':
        case '.mov':
        case '.flv':
          this.listDataItems[index].iconFile = "fas fa-file-video";
          break;
        case '.jpg':
        case '.gif':
        case '.png':
        case '.jpeg':
        case '.raw':
        case '.jfif': {
          this.listDataItems[index].iconFile = "";
          break;
        }
        default: {
          this.listDataItems[index].iconFile = "fas fa-file";
          break;
        }
      }
    });
  }

  /**
   * Hàm load thêm dữ liệu khi nhấn load more
   * @constructor
   */
  LoadMore() {
    this.pageNumber++;
    if (!this.setSearch === true) {
      this.cmFacadeService
        .getGmediaService()
        .getAll({ PageNumber: this.pageNumber, PageSize: this.pageSize, Type: this.type }).subscribe(data => {
          this.listData = data;
          if (this.listData.items.length < this.pageSize) {
            this.checkLoadMore = false;
          }
          this.listDataItems.push.apply(this.listDataItems, this.listData.items);
          this.setIconShow();
        });
    } else {
      this.cmFacadeService
        .getGmediaService()
        .searchItem({ Tieude: this.setSearch, PageNumber: this.pageNumber, PageSize: this.pageSize, Type: this.type }).subscribe(data => {
          this.listData = data;
          if (this.listData.items.length < this.pageSize) {
            this.checkLoadMore = false;
          }
          this.listDataItems.push.apply(this.listDataItems, this.listData.items);
          this.setIconShow();
        });
    }
  }
}
