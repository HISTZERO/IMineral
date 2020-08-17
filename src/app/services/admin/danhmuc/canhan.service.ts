import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import {
  InputCanhanModel,
  OutputCanhanModel
} from "src/app/models/admin/danhmuc/canhan.model";
import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";
import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";

@Injectable({
  providedIn: "root"
})
export class DmCanhanService extends RepositoryEloquentService {
  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient,
      inputModelName: new InputCanhanModel(),
      outputModelName: new OutputCanhanModel(),
      apiUrl: environment.apiIMineral + ServiceName.CANHAN
    });
  }

  public checkBeDeleted(id: number) {
    return "ok";
  }
}
