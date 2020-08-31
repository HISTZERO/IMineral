import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import {
  InputDmHeQuyChieuModel,
  OutputDmHeQuyChieuModel
} from "src/app/models/admin/danhmuc/hequychieu.model";
import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";
import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";

@Injectable({
  providedIn: "root"
})
export class DmHequychieuService extends RepositoryEloquentService {
  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient,
      inputModelName: new InputDmHeQuyChieuModel(),
      outputModelName: new OutputDmHeQuyChieuModel(),
      apiUrl: environment.apiIMineral + ServiceName.HEQUYCHIEU
    });
  }

  public checkBeDeleted(id: number) {
    return "ok";
  }
}
