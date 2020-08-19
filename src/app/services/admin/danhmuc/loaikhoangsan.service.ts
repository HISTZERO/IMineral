import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";
import { OutputLoaiKhoangSanModel, InputLoaiKhoangSanModel } from "src/app/models/admin/danhmuc/loaikhoangsan.model";
import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";

@Injectable({
  providedIn: 'root'
})
export class LoaikhoangsanService extends RepositoryEloquentService {

  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient,
      inputModelName: new InputLoaiKhoangSanModel(),
      outputModelName: new OutputLoaiKhoangSanModel(),
      apiUrl: environment.apiIMineral + ServiceName.LOAIKHOANGSAN
    });
  }

  public checkBeDeleted(id: number) {
    return "ok";
  }


}
