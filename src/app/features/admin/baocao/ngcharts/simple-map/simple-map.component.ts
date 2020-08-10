import { Component, OnInit } from '@angular/core';
import { GisBaseMapService } from "src/app/services/admin/map/gisbasemap.service";
import { MapFacadeService } from "src/app/services/admin/map/map-facade.service";

@Component({
  selector: 'app-simple-map',
  templateUrl: './simple-map.component.html',
  styleUrls: ['./simple-map.component.scss']
})
export class SimpleMapComponent implements OnInit {

  public gisBaseMapService: GisBaseMapService;
  constructor(public mapFacadeService: MapFacadeService) {
    this.gisBaseMapService = this.mapFacadeService.getGisBaseMapService();
  }

  public setZoom() {
    this.gisBaseMapService.setView(100, 20, 18);
  }

  public setCenter() {
    this.gisBaseMapService.setView(105.8, 18);
  }

  public setView() {
    this.gisBaseMapService.setView(105.8, 20, 12);
  }

  async addMekong() {
    this.gisBaseMapService.setMarkers(
      [{ longtitute: 105, latitude: 8 }]
    )
  }
  async
  ngOnInit() {
    this.gisBaseMapService.setBaseMap("osm");
    this.gisBaseMapService.setCenter(105.8, 17);
    this.gisBaseMapService.setZoom(10);
    this.gisBaseMapService.mapInit("viewMap", 6);
  }

}
