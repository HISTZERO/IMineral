import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";
import {
  InputCongtyModel,
  OutputCongtyModel
} from "src/app/models/admin/danhmuc/congty.model";
import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";

@Injectable({
  providedIn: "root"
})
export class DmCongtyService extends RepositoryEloquentService {
  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient,
      inputModelName: new InputCongtyModel(),
      outputModelName: new OutputCongtyModel(),
      apiUrl: environment.apiCategoryURL + ServiceName.CONGTY
    });
  }

  public checkBeDeleted(id: number) {
    return "ok";
  }
}
