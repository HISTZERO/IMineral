import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { CommonFacadeService } from "src/app/services/admin/common/common-facade.service";
import { ThietlapFacadeService } from "src/app/services/admin/thietlap/thietlap-facade.service";


@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.scss']
})
// export interface SearchModel {
//   keyValue: any;
//   objKey: string;
// }
export class SearchBoxComponent implements OnInit {
  @Output() objkey = new EventEmitter<any>();
  @Output() keyvalue = new EventEmitter<any>();
  // @Output() searchobj = new EventEmitter<any>();
  @Output() version = new EventEmitter<any>();
  // @Output() searchobj = new EventEmitter<SearchModel>();
  // searchmodel: SearchModel;
  public dataResult: any;
  public keyValue: any;
  public objKey: any;
  loaitramFilters: any;
  listDataLoaitram: any;
  public searchForm: FormGroup;
  formErrors = {
    keyValue: "",
  };

  // error message
  validationErrorMessages = {
    keyValue: { required: "Vui lòng nhập từ khóa tìm kiếm" },
  };
  constructor(
    private formBuilder: FormBuilder,
    public thietlapFacadeService: ThietlapFacadeService,
    public commonFacadeService: CommonFacadeService,
  ) {
  }

  ngOnInit() {
    this.showLoaitram();
    this.bindingConfigValidation();
  }
  bindingConfigValidation() {
    this.searchForm = this.formBuilder.group({
      keyValue: ["", Validators.required],
      objKey: [""],
    });
  }
  // lấy danh sách loại trạm
  async showLoaitram() {
    this.listDataLoaitram = await this.commonFacadeService.getObjKeyService().getFetchAll();
    this.loaitramFilters = this.listDataLoaitram;
  }
  async search() {
    const version = Date.now()
    this.objkey.next(this.objKey);
    this.keyvalue.next(this.keyValue);
    // this.searchobj.next(this.searchForm.controls);
    this.version.next(version);
    // console.log(version);
  }
}
