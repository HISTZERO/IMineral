import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import {
  InputMapLayerModel,
  OutputMapLayerModel,
} from "src/app/models/admin/map/map-layer.model";
import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";
import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";

@Injectable({
  providedIn: "root",
})
export class MapLayerService extends RepositoryEloquentService {
  // Api url
  public mapLayerApiUrl: string = `${environment.apiIMineral}${ServiceName.MAPLAYER}`;

  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient: httpClient,
      inputModelName: new InputMapLayerModel(),
      outputModelName: new OutputMapLayerModel(),
      apiUrl:environment.apiIMineral + ServiceName.MAPLAYER,
    });
  }

  public getAllMapLayersByMapId(mapId) {
    let apiUrl: string = `${this.mapLayerApiUrl}/get-all-mapLayer-layer-by-mapId/${mapId}`;
    this.setServiceInfo({ apiUrl });
    return this.getFetchAll();
  }

  // Add layer groups
  public addLayerGroups(params) {
    this.setServiceInfo({
      apiUrl: `${this.mapLayerApiUrl}/layerGroupIds`,
    });
    return this.addItem(params);
  }

  // Add layers
  public addLayers(params) {
    this.setServiceInfo({ apiUrl: `${this.mapLayerApiUrl}/layerIds` });
    return this.addItem(params);
  }

  // Clone data
  public cloneLayer(params) {
    this.setServiceInfo({
      apiUrl: `${this.mapLayerApiUrl}/itemIds`,
    });
    return this.addItem(params);
  }

  public checkBeDeleted(id: number) {
    return "ok";
  }
}
