import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HttpErrorResponse } from "@angular/common/http";

import { _MediaUploadAction } from 'src/app/shared/constants/actions/common/media';
import { GmediaArrayModel, GmediaModel, PreviewUrl } from "src/app/models/admin/common/gmedia.model";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { CommonFacadeService } from "src/app/services/admin/common/common-facade.service";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'app-tab-upload',
  templateUrl: './tab-upload.component.html',
  styleUrls: ['./tab-upload.component.scss']
})
export class TabUploadComponent implements OnInit {

  @Output() selectTab = new EventEmitter<any>();
  @Input() loaiGD: number;
  fileData: File = null;
  accept = '';
  previewUrl: PreviewUrl;
  srcanh: any = null;
  ArrayMedia: GmediaModel[] = [];
  Mediaitem = {} as GmediaModel;
  ParaMedia: GmediaArrayModel = new GmediaArrayModel();

  // Các biến translate
  public dataTranslate: any;

  // Danh sách các quyền
  uploadMediaAction = _MediaUploadAction;
  constructor(public cmFacadeService: CommonFacadeService,
    public commonService: CommonServiceShared,
    private translate: TranslateService) { }

  async ngOnInit() {
    // Lấy dữ liệu biến translate để gán vào các biến trong component
    this.dataTranslate = await this.translate
      .getTranslation(this.translate.getDefaultLang())
      .toPromise();

    this.setLoaiGiaoDien();
  }

  setLoaiGiaoDien() {
    if (this.loaiGD === 1) {
      this.accept = 'image/*';
    }
  }
  // Hàm upload ảnh
  async fileProgress(fileInput: any) {
    this.previewUrl = new PreviewUrl();
    this.ArrayMedia = [];
    let file: any;
    let splitGetType: string[];
    for (let i = 0; i < fileInput.target.files.length; i++) {
      this.fileData = fileInput.target.files[i] as File;
      splitGetType = this.fileData.name.split('.');
      this.Mediaitem.type = `.${splitGetType[splitGetType.length - 1]}`;
      file = (fileInput.target as HTMLInputElement).files[i];
      if (file) {
        const reader = new FileReader();
        reader.onload = handleReaderLoaded.bind(this);
        reader.readAsBinaryString(file);
      }
      this.preview(this.fileData.name);
    }
    function handleReaderLoaded(e) {
      const binaryString = e.target.result;
      const base64textString = btoa(binaryString);
      this.Mediaitem.base64 = base64textString;
      this.ArrayMedia.push(this.Mediaitem);
    }
  }

  // Hiển thị ảnh preview
  preview(name) {
    // Show preview
    const mimeType = this.fileData.type;
    if (mimeType.match(/image\/*/) == null) {
      this.previewUrl.name.push(name);
      this.previewUrl.link.push(null);
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(this.fileData);
    // tslint:disable-next-line:variable-name
    reader.onload = _event => {
      this.previewUrl.link.push(reader.result);
      this.previewUrl.name.push(name);
    };
  }

  /**
   * Hàm upload file
   */
  // hàm confirm upload
  uploadFile() {
    this.uploadImg();
  }

  async uploadImg() {
    this.ParaMedia.jsonParameter = this.ArrayMedia;
    await this.cmFacadeService
      .getGmediaService()
      .addItem(this.ParaMedia)
      .subscribe(
        res => {
          this.commonService.showeNotiResult(
            this.dataTranslate.COMMON.default.successAdd,
            2000
          );
          this.selectTab.emit(res);
        },
        (errResponse: HttpErrorResponse) => {
          if (errResponse.error instanceof Error) {
            this.commonService.showeNotiResult(errResponse.error.message, 2000);
          } else {
            this.commonService.showeNotiResult(errResponse.error, 2000);
          }
        }
      );
  }
}
