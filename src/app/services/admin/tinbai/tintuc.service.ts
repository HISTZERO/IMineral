import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import {
  InputTintucModel,
  OutputTintucModel,
} from "src/app/models/admin/tinbai/tintuc.model";
import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";
import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";

@Injectable({
  providedIn: "root",
})
export class TbTintucService extends RepositoryEloquentService {
  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient,
      inputModelName: new InputTintucModel(),
      outputModelName: new OutputTintucModel(),
      apiUrl: environment.apiCommonURL + ServiceName.TINTUC,
    });
  }

  public checkBeDeleted(id: number) {
    return "ok";
  }
}
