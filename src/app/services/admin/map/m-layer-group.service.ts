import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import {
  InputMapGroupLayerModel,
  OutputMapGroupLayerModel
} from "src/app/models/admin/map/m-group-layer.model";
import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";
import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";

@Injectable({
  providedIn: "root"
})
export class MLayerGroupService extends RepositoryEloquentService {

  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient: httpClient,
      inputModelName: new InputMapGroupLayerModel(),
      outputModelName: new OutputMapGroupLayerModel(),
      apiUrl: environment.apiIMineral + ServiceName.MLAYERGROUP
    });
  }

  public getTreeGroupsAndLayers() {
    this.setServiceInfo({
      apiUrl: environment.apiIMineral + ServiceName.MLAYERGROUP + '/get-tree-layer'
    });
    return this.getFetchAll();
  }

  public groupOrder(body: any): Observable<any> {
    let apiUrl = environment.apiIMineral + ServiceName.MLAYERGROUP + '/groupOrder'
    return this.httpClient.put(apiUrl, body, {
      headers: this.headers
    });
  }

  public checkBeDeleted(id: number) {
    return "ok";
  }
}
