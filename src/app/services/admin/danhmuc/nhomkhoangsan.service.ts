import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";
import { InputNhomKhoangSanModel, OutputNhomKhoangSanModel } from "src/app/models/admin/danhmuc/nhomkhoangsan.model";
import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";

@Injectable({
  providedIn: 'root'
})
export class NhomkhoangsanService extends RepositoryEloquentService {

  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient,
      inputModelName: new InputNhomKhoangSanModel(),
      outputModelName: new OutputNhomKhoangSanModel(),
      apiUrl: environment.apiCategoryURL + ServiceName.NHOMKHOANGSAN
    });
  }

  public checkBeDeleted(id: number) {
    return "ok";
  }

}
