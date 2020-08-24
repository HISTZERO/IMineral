import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";
import { InputDmNhomKhoangSanModel, OutputDmNhomKhoangSanModel } from "src/app/models/admin/danhmuc/nhomkhoangsan.model";
import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";

@Injectable({
  providedIn: 'root'
})
export class DmNhomkhoangsanService extends RepositoryEloquentService {

  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient,
      inputModelName: new InputDmNhomKhoangSanModel(),
      outputModelName: new OutputDmNhomKhoangSanModel(),
      apiUrl: environment.apiIMineral + ServiceName.NHOMKHOANGSAN
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
      apiUrl: environment.apiIMineral + ServiceName.NHOMKHOANGSAN + '/updateliststatus'
    });
    return this.updateItem(params);
  }
}
