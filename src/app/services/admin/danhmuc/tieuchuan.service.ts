import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import {
  InputTieuchuanModel,
  OutputTieuchuanModel
} from "src/app/models/admin/danhmuc/tieuchuan.model";
import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";
import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";

@Injectable({
  providedIn: "root"
})
export class TieuchuanService extends RepositoryEloquentService {
  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient,
      inputModelName: new InputTieuchuanModel(),
      outputModelName: new OutputTieuchuanModel(),
      apiUrl: environment.apiCategoryURL + ServiceName.TIEUCHUAN
    });
  }

  public checkBeDeleted(id: number) {
    return "ok";
  }
}
