import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";
import {
  InputThietbiquantracModel,
  OutputThietbiquantracModel
} from "src/app/models/admin/danhmuc/thietbiquantrac.model";
import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";

@Injectable({
  providedIn: "root"
})
export class DmThietbiquantracService extends RepositoryEloquentService {
  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient,
      inputModelName: new InputThietbiquantracModel(),
      outputModelName: new OutputThietbiquantracModel(),
      apiUrl: environment.apiCategoryURL + ServiceName.THIETBIQUANTRAC
    });
  }

  public checkBeDeleted(id: number) {
    return "ok";
  }
}
