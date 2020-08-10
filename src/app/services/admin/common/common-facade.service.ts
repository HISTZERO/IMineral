import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { ObjkeyService } from "src/app/services/admin/common/objkey.service";
import { GmediaService } from "src/app/services/admin/common/gmedia.service";
import { HighchartService } from "src/app/services/admin/common/highchart.service";
import { ObjOptValueService } from "src/app/services/admin/common/obj-opt-value.service";

@Injectable({
  providedIn: "root"
})
export class CommonFacadeService {

  constructor(private httpClient: HttpClient) { }

  public getHighchartService() {
    return new HighchartService();
  }

  // Gmedia service
  public getGmediaService() {
    return new GmediaService(this.httpClient);
  }

  public getObjKeyService() {
    return new ObjkeyService(this.httpClient);
  }

  public getObjOptValueService() {
    return new ObjOptValueService(this.httpClient);
  }
}
