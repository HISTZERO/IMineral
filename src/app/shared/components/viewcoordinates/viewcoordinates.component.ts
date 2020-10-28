import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

import { MapFacadeService } from "src/app/services/admin/map/map-facade.service";
import { GisBaseMapService } from "src/app/services/admin/map/gisbasemap.service";
import { CommonFacadeService } from "src/app/services/admin/common/common-facade.service";
import { GisAdvanceMapService } from "../../../services/admin/map/gis-advance-map.service";

@Component({
  selector: 'app-viewcoordinates',
  templateUrl: './viewcoordinates.component.html',
  styleUrls: ['./viewcoordinates.component.scss']
})
export class ViewcoordinatesComponent implements OnInit {

  // Khai báo biến của gis Base Map service
  public gisAdvanceMapService: GisAdvanceMapService;
  constructor(
    public mapFacadeService: MapFacadeService,
    public dialogRef: MatDialogRef<ViewcoordinatesComponent>,
    @Inject(MAT_DIALOG_DATA) public dataGetIO: any,
    public cmFacadeService: CommonFacadeService
  ) {
    // Get new service
    this.gisAdvanceMapService = this.mapFacadeService.getGisAdvanceMapService();
  }

  async ngOnInit() {
    await this.mapInit();
  }

  // Khởi tạo bản đồ
  async mapInit() {
    console.log(this.dataGetIO.model);
    this.gisAdvanceMapService.setBaseMap("osm");
    this.gisAdvanceMapService.setZoom(7);
    this.gisAdvanceMapService.setCenter(11701591.8, 2384835.28);
    await this.gisAdvanceMapService.mapInit("mapViewDialog");
    this.gisAdvanceMapService.drawGraphicByGeoMetry(this.dataGetIO.model);
  }

}
