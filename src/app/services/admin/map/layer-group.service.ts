import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import {
  InputLayerGroupModel,
  OutputLayerGroupModel
} from "src/app/models/admin/map/layer-group.model";
import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";
import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";

@Injectable({
  providedIn: "root"
})
export class LayerGroupService extends RepositoryEloquentService {

  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient: httpClient,
      inputModelName: new InputLayerGroupModel(),
      outputModelName: new OutputLayerGroupModel(),
      apiUrl: environment.apiIMineral + ServiceName.LAYERGROUP
    });
  }

  public getGroupIdAndGroupName() {
    this.setServiceInfo({
      apiUrl: environment.apiIMineral + ServiceName.LAYERGROUP + '/get-groupId-groupName'
    });
    return this.getFetchAll();
  }

  public checkBeDeleted(id: number) {
    return "ok";
  }
}
