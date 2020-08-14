import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";
import { InputThuTucHanhChinhModel, OutputThuTucHanhChinhModel } from "src/app/models/admin/danhmuc/thutuchanhchinh.model";
import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";

@Injectable({
  providedIn: 'root'
})
export class ThutuchanhchinhService extends RepositoryEloquentService {

  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient,
      inputModelName: new InputThuTucHanhChinhModel(),
      outputModelName: new OutputThuTucHanhChinhModel(),
      apiUrl: environment.apiCategoryURL + ServiceName.THUTUCHANHCHINH
    });
  }

  public checkBeDeleted(id: number) {
    return "ok";
  }

}
