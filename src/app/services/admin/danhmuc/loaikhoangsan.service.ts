import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";
import { OutputDmLoaiKhoangSanModel, InputDmLoaiKhoangSanModel } from "src/app/models/admin/danhmuc/loaikhoangsan.model";
import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";

@Injectable({
  providedIn: 'root'
})
export class DmLoaikhoangsanService extends RepositoryEloquentService {

  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient,
      inputModelName: new InputDmLoaiKhoangSanModel(),
      outputModelName: new OutputDmLoaiKhoangSanModel(),
      apiUrl: environment.apiIMineral + ServiceName.LOAIKHOANGSAN
    });
  }

  public checkBeDeleted(id: number) {
    return "ok";
  }


}
