import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";
import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";
import { InputDkKhaiThacVatLieuXayDungModel, OutputDkKhaiThacVatLieuXayDungModel } from "src/app/models/admin/dangkyhoatdongkhoangsan/dangkykhaithac/dkkhaithacvlxd.model";

@Injectable({
  providedIn: 'root'
})
export class DkkhaithacvlxdService extends RepositoryEloquentService {

  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient,
      inputModelName: new InputDkKhaiThacVatLieuXayDungModel(),
      outputModelName: new OutputDkKhaiThacVatLieuXayDungModel(),
      apiUrl: environment.apiIMineral + ServiceName.DANGKYKHAITHACVLXD
    });
  }

  public checkBeDeleted(id: string) {
    return "ok";
  }

}
