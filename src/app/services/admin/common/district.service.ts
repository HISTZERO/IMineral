import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";
import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";
import { InputDvhcModel, OutputDvhcModel } from "src/app/models/admin/danhmuc/dvhc.model";

@Injectable({
  providedIn: "root"
})
export class DistrictService extends RepositoryEloquentService {

  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient,
      inputModelName: new InputDvhcModel(),
      outputModelName: new OutputDvhcModel(),
      apiUrl: environment.apiCategoryURL + ServiceName.DISTRICT,
    });
  }
  public checkBeDeleted(id: number) {
    return "ok";
  }
}
