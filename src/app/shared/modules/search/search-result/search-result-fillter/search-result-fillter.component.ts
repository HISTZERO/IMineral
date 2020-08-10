import { DatePipe } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { OutputDvhcModel } from "src/app/models/admin/danhmuc/dvhc.model";
import { CommonServiceShared } from "src/app/services/utilities/common-service";
import { DmFacadeService } from "src/app/services/admin/danhmuc/danhmuc-facade.service";
import { displayFieldCssService } from "src/app/services/utilities/validatorService";

@Component({
  selector: 'app-search-result-fillter',
  templateUrl: './search-result-fillter.component.html',
  styleUrls: ['./search-result-fillter.component.scss']
})
export class SearchResultFillterComponent implements OnInit {
  searchDvhcForm: FormGroup;
  public allTinh: any;
  public allHuyen: any;
  public allXa: any;
  public allTinhData: any;
  public dvhcProvinceFilters: OutputDvhcModel[];
  public dvhcDistrictFilters: OutputDvhcModel[];
  public dvhcWardFilters: OutputDvhcModel[];
  validationErrorMessages = {
    matinh: { required: "Hãy chọn tỉnh!" },
    mahuyen: { required: "Hãy chọn huyện!" },
  };
  formErrors = {
    matinh: "",
    mahuyen: "",
    maxa: "",
  };
  constructor(
    private formBuilder: FormBuilder,
    public commonService: CommonServiceShared,
    public dmFacadeService: DmFacadeService,
    private http: HttpClient,
    private datePipe: DatePipe,
  ) { }

  ngOnInit(
  ) {
    this.bindingConfigValidation();
    this.showDvhcTinh();
  }
  // config input validation form
  bindingConfigValidation() {
    this.searchDvhcForm = this.formBuilder.group({
      matinh: ["", Validators.required],
      mahuyen: ["", Validators.required],
      maxa: [""],
    });
  }
  // Các hàm get đơn vị hành chính
  async showDvhcTinh() {
    this.allTinhData = await this.dmFacadeService
      .getProvinceService()
      .getFetchAll({ PageNumber: 1, PageSize: -1 });
    this.allTinh = this.allTinhData.items;
    this.dvhcProvinceFilters = this.allTinhData.items;
  }
  // show huyen
  async showDvhcHuyen() {
    if (!this.searchDvhcForm.value.matinh === true) {
      this.allHuyen = [];
      this.dvhcDistrictFilters = [];
      this.allXa = [];
      this.dvhcWardFilters = [];
      this.searchDvhcForm.controls["mahuyen"].setValue("");
    }
    if (!this.searchDvhcForm.value.matinh === false) {
      this.searchDvhcForm.controls["mahuyen"].setValue("");
      this.allXa = [];
      this.dvhcWardFilters = [];
      this.allHuyen = await this.dmFacadeService
        .getDistrictService()
        .getFetchAll({ matinh: this.searchDvhcForm.value.matinh });
      this.dvhcDistrictFilters = this.allHuyen;
    }
  }
  // show xa
  async showDvhcXa() {
    if (!this.searchDvhcForm.value.mahuyen === true) {
      this.allXa = [];
      this.dvhcWardFilters = [];
      this.searchDvhcForm.controls["maxa"].setValue("");
    }
    if (!this.searchDvhcForm.value.matinh === false && !this.searchDvhcForm.value.mahuyen === false) {
      this.searchDvhcForm.controls["maxa"].setValue("");
      this.allXa = await this.dmFacadeService
        .getWardService()
        .getFetchAll({ mahuyen: this.searchDvhcForm.value.mahuyen });
      this.dvhcWardFilters = this.allXa;
    }
  }
  // display fields css
  public displayFieldCss(field: string) {
    displayFieldCssService(field);
  }

}
