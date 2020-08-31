import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";
import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";
import { InputHeQuyChieuModel, OutputHeQuyChieuModel } from "src/app/models/admin/common/hequychieu.model";

@Injectable({
  providedIn: 'root'
})
export class HequychieuService extends RepositoryEloquentService {

  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient,
      inputModelName: new InputHeQuyChieuModel(),
      outputModelName: new OutputHeQuyChieuModel(),
      apiUrl: environment.apiIMineral + ServiceName.HEQUYCHIEU,
    });
  }

  public checkBeDeleted(id: string) {
    return "ok";
  }

}
