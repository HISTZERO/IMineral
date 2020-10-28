import { Component, Input, OnInit } from '@angular/core';
import { GisAdvanceMapService } from "../../../services/admin/map/gis-advance-map.service";
import { GisBaseMapService } from "../../../services/admin/map/gisbasemap.service";
import { MapFacadeService } from "../../../services/admin/map/map-facade.service";

@Component({
  selector: 'app-toadokhuvuc',
  templateUrl: './toadokhuvuc.component.html',
  styleUrls: ['./toadokhuvuc.component.scss']
})
export class ToadokhuvucComponent implements OnInit {

  // Chứa geometry dạng text
  @Input() GeometryText: any;

  // Chứa geoJson trả về
  public geoJson: any;

  @Input("allowAutoInit") allowAutoInit = false;


  public gisAdvanceMapService:  GisAdvanceMapService;

  constructor(
    private mapFacadeService: MapFacadeService
  ) {
    this.gisAdvanceMapService = this.mapFacadeService.getGisAdvanceMapService();
  }

  async ngOnInit() {
      await this.manualDataInit();
  }


  public manualDataInit() {
    this.mapInit();
  }

  /**
   * Hàm khởi tạo bản đồ
   */
  async mapInit() {
    this.gisAdvanceMapService.setBaseMap("osm");
    this.gisAdvanceMapService.setZoom(7);
    this.gisAdvanceMapService.setCenter(11701591.8, 2384835.28);
    await this.gisAdvanceMapService.mapInit("viewMap");
    if (this.GeometryText) {
      await this.convertGeometry();
      await this.gisAdvanceMapService.drawGraphicByGeoMetry(this.geoJson);
    }
  }

  /**
   * Hàm call api convert geoText 
   */
  async convertGeometry() {
    this.geoJson = await this.mapFacadeService.getGeometryService().getGeoJson(this.GeometryText).toPromise();
  }
}
