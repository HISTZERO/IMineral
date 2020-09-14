import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import {
  InputProjectionModel,
  OutputProjectionModel,
} from "src/app/models/admin/map/projection.model";
import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";
import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";

@Injectable({
  providedIn: "root",
})
export class ProjectionService extends RepositoryEloquentService {
  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient: httpClient,
      inputModelName: new InputProjectionModel(),
      outputModelName: new OutputProjectionModel(),
      apiUrl: environment.apiIMineral + ServiceName.PROJECTION,
    });
  }

  public checkBeDeleted(id: number) {
    return "ok";
  }
}
