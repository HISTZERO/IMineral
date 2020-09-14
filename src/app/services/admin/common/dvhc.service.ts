import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { environment } from "src/environments/environment";
import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";
import { ServiceName } from 'src/app/shared/constants/service-name';

@Injectable({
  providedIn: 'root'
})
export class DmDvhcService extends RepositoryEloquentService {

  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient,
      inputModelName: null,
      outputModelName: null,
      apiUrl: environment.apiIMineral + ServiceName.DVHC,
    });
  }

  /**
   * Hàm update status
   * @param params
   */
  public updateStatusItems(params) {
    this.setServiceInfo({
      apiUrl: environment.apiIMineral + ServiceName.DVHC + '/updateliststatus'
    });
    return this.updateItem(params);
  }

  /**
   * Hàm delete array item
   * @param params
   */
  public deleteArrayItems(params) {
    this.setServiceInfo({
      apiUrl: environment.apiIMineral + ServiceName.CANHAN + '/removelist'
    });
    return this.updateItem(params);
  }
  public checkBeDeleted(id: string) {
    return "ok";
  }
}
