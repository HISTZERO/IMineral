import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import {
  InputLayerModel,
  OutputLayerModel
} from "src/app/models/admin/map/layer.model";
import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";
import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";

@Injectable({
  providedIn: "root"
})
export class LayerService extends RepositoryEloquentService {

  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient: httpClient,
      inputModelName: new InputLayerModel(),
      outputModelName: new OutputLayerModel(),
      apiUrl:environment.apiIMineral + ServiceName.LAYER
    });
  }

  // Get all layers select id and name
  public getAllIdName() {
    this.setServiceInfo({
      apiUrl:environment.apiIMineral + ServiceName.LAYER + '/get-all-id-name'
    });
    return this.getFetchAll();
  }

  public checkBeDeleted(id: number) {
    return "ok";
  }
}
