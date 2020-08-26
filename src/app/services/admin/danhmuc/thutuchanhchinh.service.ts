import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";
import { InputDmThuTucHanhChinhModel, OutputDmThuTucHanhChinhModel } from "src/app/models/admin/danhmuc/thutuchanhchinh.model";
import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";

@Injectable({
  providedIn: 'root'
})
export class DmThutuchanhchinhService extends RepositoryEloquentService {

  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient,
      inputModelName: new InputDmThuTucHanhChinhModel(),
      outputModelName: new OutputDmThuTucHanhChinhModel(),
      apiUrl: environment.apiIMineral + ServiceName.THUTUCHANHCHINH
    });
  }

  public checkBeDeleted(id: number) {
    return "ok";
  }

  /**
   * Hàm update status
   * @param params
   */
  public updateStatusArrayItem(params) {
    this.setServiceInfo({
      apiUrl: environment.apiIMineral + ServiceName.THUTUCHANHCHINH + '/updateliststatus'
    });
    return this.updateItem(params);
  }

  public deleteItemsThuTucHanhChinh(params) {
    this.setServiceInfo({
      apiUrl: environment.apiIMineral + ServiceName.THUTUCHANHCHINH + '/removelist'
    });
    return this.updateItem(params);
  }
}
