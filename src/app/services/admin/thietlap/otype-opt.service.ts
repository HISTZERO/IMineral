import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";
import { InputOtypeOptsModel, OutputOtypeOptsModel } from "src/app/models/admin/thietlap/otypeOpts.model";
import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";

@Injectable({
  providedIn: 'root'
})
export class OtypeOptService extends RepositoryEloquentService {

  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient: httpClient,
      inputModelName: new InputOtypeOptsModel(),
      outputModelName: new OutputOtypeOptsModel(),
      apiUrl: environment.apiCommonURL + ServiceName.OTYPEOPT,
    });
  }

  async getAllByOtypeKey(otypeKey: string, listOrio?: string) {
    this.setServiceInfo({
      apiUrl: `${environment.apiCommonURL}${ServiceName.OTYPEOPT}/get-all-by-otypeKey/${otypeKey}/listInIO`
    });
    const listData = await this.getFetchAll({ listInIO: listOrio });
    return listData;
  }
  public checkBeDeleted(id: number) {
    return "ok";
  }
}
