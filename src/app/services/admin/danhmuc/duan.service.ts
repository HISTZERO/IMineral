import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import {
  InputDuanModel,
  OutputDuanModel
} from "src/app/models/admin/danhmuc/duan.model";
import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";
import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";

@Injectable({
  providedIn: "root"
})
export class DuanService extends RepositoryEloquentService {
  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient,
      inputModelName: new InputDuanModel(),
      outputModelName: new OutputDuanModel(),
      apiUrl: environment.apiCategoryURL + ServiceName.DUAN
    });
  }

  public checkBeDeleted(id: number) {
    return "ok";
  }
}
