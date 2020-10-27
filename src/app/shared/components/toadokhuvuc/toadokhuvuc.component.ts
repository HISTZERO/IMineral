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

  @Input("allowAutoInit") allowAutoInit = false;


  public gisBaseMapService: GisBaseMapService;
  public gisAdvanceMapService:  GisAdvanceMapService;

  constructor(
    private mapFacadeService: MapFacadeService
  ) {
    this.gisBaseMapService = this.mapFacadeService.getGisBaseMapService();
    this.gisAdvanceMapService = this.mapFacadeService.getGisAdvanceMapService();
  }

  async ngOnInit() {
      await this.manualDataInit();
  }

  async convertGeoTextToGeoJson() {
  }

  public manualDataInit() {
    this.mapInit();
  }

  /**
   * Hàm khởi tạo bản đồ
   */
  async mapInit() {
    await this.gisAdvanceMapService.setBaseMap("osm");
    await this.gisAdvanceMapService.mapInit("viewMap");
    await this.gisAdvanceMapService.setView(
      "11744206.278690362, 1827895.5331194468",
      7
    );
    // this.gisBaseMapService.setBaseMap("osm");
    // this.gisBaseMapService.setZoom(12);
    // this.gisBaseMapService.setCenter(11701591.8, 1824835.28);
    // await this.gisBaseMapService.mapInit("viewMap");
  }
}
