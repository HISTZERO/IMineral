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
  public getGeoJsonByListItem(listItem: any) {
    this.setServiceInfo({
      apiUrl: `${environment.apiIMineral + ServiceName.GEOMETRY}/GetGeotryjson`
    });
    return this.addItem(listItem);
  }

  public checkBeDeleted(id: number) {
    return "ok";
  }

}
