import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import {
  InputCoquantochucModel,
  OutputCoquantochucModel
} from "src/app/models/admin/danhmuc/coquantochuc.model";
import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";
import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";

@Injectable({
  providedIn: "root"
})
export class DmCoquantochucService extends RepositoryEloquentService {
  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient: httpClient,
      inputModelName: new InputCoquantochucModel(),
      outputModelName: new OutputCoquantochucModel(),
      apiUrl: environment.apiCategoryURL + ServiceName.COQUANTOCHUC
    });
  }
  public checkBeDeleted(id: number) {
    return "ok";
  }
}
