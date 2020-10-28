import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { MapService } from "src/app/services/admin/map/map.service";
import { LayerService } from "src/app/services/admin/map/layer.service";
import { CategoryService } from "src/app/services/admin/map/category.service";
import { MapLayerService } from "src/app/services/admin/map/map-layer.service";
import { MapCommonService } from "src/app/services/admin/map/map-common.service";
import { ProjectionService } from "src/app/services/admin/map/projection.service";
import { LayerGroupService } from "src/app/services/admin/map/layer-group.service";
import { MLayerGroupService } from "src/app/services/admin/map/m-layer-group.service";
import { MapLayerGroupService } from "src/app/services/admin/map/map-layergroup.service";
import { GisAdvanceMapService } from "src/app/services/admin/map/gis-advance-map.service";
import { GisBaseMapService } from "src/app/services/admin/map/gisbasemap.service";
import { GeometryService } from "src/app/services/admin/map/geometry.service";

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

  // geometry service
  public getGeometryService() {
    return new GeometryService(this.httpClient);
  }
}
