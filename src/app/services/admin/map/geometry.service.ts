import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";
import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";

@Injectable({
  providedIn: 'root'
})
export class GeometryService extends RepositoryEloquentService {

  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient: httpClient,
      inputModelName: null,
      outputModelName: null,
      apiUrl: environment.apiIMineral + ServiceName.GEOMETRY
    });
  }

  // Get geoJson by list item
  public getGeoJsonByListItem(listItem: any, srid: number) {
    this.setServiceInfo({
      apiUrl: `${environment.apiIMineral + ServiceName.GEOMETRY}/GetGeotryjson?srid=${srid}`
    });
    return this.addItem(listItem);
  }

  // Get geoJson by list item
  public getGeoJson(body: any) {
    this.setServiceInfo({
      apiUrl: `${environment.apiIMineral + ServiceName.GEOMETRY}?geotext=${body}`
    });
    return this.addItem("");
  }

  public checkBeDeleted(id: number) {
    return "ok";
  }

}
