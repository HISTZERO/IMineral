import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import {
  InputThamsoModel,
  OutputThamsoModel
} from "src/app/models/admin/danhmuc/thamso.model";
import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";
import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";

@Injectable({
  providedIn: "root"
})
export class ThamsoService extends RepositoryEloquentService {
  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient,
      inputModelName: new InputThamsoModel(),
      outputModelName: new OutputThamsoModel(),
      apiUrl: environment.apiCategoryURL + ServiceName.THAMSO
    });
  }

  public getThamSoByNhomThamSoId(params = {}) {
    let queryString = Object.keys(params)
      .map(key => key + "=" + params[key])
      .join("&");
    return this.httpClient.get(`${environment.apiCategoryURL + ServiceName.THAMSO + '/idnhomthamso'}?${queryString}`).toPromise();
  }

  public checkBeDeleted(id: number) {
    return "ok";
  }
}
