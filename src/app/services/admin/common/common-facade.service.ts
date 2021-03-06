import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { GmediaService } from "src/app/services/admin/common/gmedia.service";
import { HighchartService } from "src/app/services/admin/common/highchart.service";
import { FileService } from "src/app/services/admin/common/file.service";

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

  public getFileService() {
    return new FileService(this.httpClient);
  }
}
