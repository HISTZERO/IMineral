import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import {
  InputMapLayerGroupModel,
  OutputMapLayerGroupModel,
} from "src/app/models/admin/map/map-layergroup.model";
import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";
import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";

@Injectable({
  providedIn: "root",
})
export class MapLayerGroupService extends RepositoryEloquentService {
  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient: httpClient,
      inputModelName: new InputMapLayerGroupModel(),
      outputModelName: new OutputMapLayerGroupModel(),
      apiUrl: environment.apiIMineral + ServiceName.MAPLAYERGROUP,
    });
  }

  public checkBeDeleted(id: number) {
    return "ok";
  }
}
