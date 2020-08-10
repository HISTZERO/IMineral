import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import {
  InputTangchuanuocModel,
  OutputTangchuanuocModel
} from "src/app/models/admin/danhmuc/tangchuanuoc.model";
import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";
import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";

@Injectable({
  providedIn: "root"
})
export class TangchuanuocService extends RepositoryEloquentService {
  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient: httpClient,
      inputModelName: new InputTangchuanuocModel(),
      outputModelName: new OutputTangchuanuocModel(),
      apiUrl: environment.apiCategoryURL + ServiceName.TANGCHUANUOC
    });
  }

  public checkBeDeleted(id: number) {
    return "ok";
  }
}
