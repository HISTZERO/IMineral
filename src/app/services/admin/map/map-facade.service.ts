import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { MapService } from "./map.service";
import { LayerService } from "./layer.service";
import { CategoryService } from "./category.service";
import { MapLayerService } from "./map-layer.service";
import { MapCommonService } from "./map-common.service";
import { ProjectionService } from "./projection.service";
import { LayerGroupService } from "./layer-group.service";
import { MLayerGroupService } from "./m-layer-group.service";
import { MapLayerGroupService } from "./map-layergroup.service";
import { GisAdvanceMapService } from "./gis-advance-map.service";
import { GisBaseMapService } from "src/app/services/admin/map/gisbasemap.service";

@Injectable({
  providedIn: "root",
})
export class MapFacadeService {
  constructor(private httpClient: HttpClient) {}

  // Layer service
  public getLayerService() {
    return new LayerService(this.httpClient);
  }

  // Map layer service
  public getMapLayerService() {
    return new MapLayerService(this.httpClient);
  }

  // Category service
  public getCategoryService() {
    return new CategoryService(this.httpClient);
  }

  // Layer group service
  public getLayerGroupService() {
    return new LayerGroupService(this.httpClient);
  }

  // MLayer group service
  public getMLayerGroupService() {
    return new MLayerGroupService(this.httpClient);
  }

  // Projection service
  public getProjectionService() {
    return new ProjectionService(this.httpClient);
  }

  // Map service
  public getMapService() {
    return new MapService(this.httpClient);
  }

  // Gis advance map service
  public getGisAdvanceMapService() {
    return new GisAdvanceMapService(this.httpClient);
  }

  // Map layer group service
  public getMapLayerGroupService() {
    return new MapLayerGroupService(this.httpClient);
  }

  // Gis Base Map service
  public getGisBaseMapService() {
    return new GisBaseMapService(this.httpClient);
  }

  // Các hàm dùng chung
  public getMapCommonService() {
    return new MapCommonService();
  }
}
