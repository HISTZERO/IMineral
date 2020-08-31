import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";
import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";
import { InputKhuVucDuTruKhoangSanModel, OutputKhuVucDuTruKhoangSanModel } from "src/app/models/admin/khuvuckhoangsan/khuvucdutrukhoangsan.model";

@Injectable({
  providedIn: 'root'
})
export class KhuvucdutrukhoangsanService extends RepositoryEloquentService {

  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient,
      inputModelName: new InputKhuVucDuTruKhoangSanModel(),
      outputModelName: new OutputKhuVucDuTruKhoangSanModel(),
      apiUrl: environment.apiIMineral + ServiceName.KHUVUCDUTRUKHOANGSAN
    });
  }

  public checkBeDeleted(id: string) {
    return "ok";
  }


}
