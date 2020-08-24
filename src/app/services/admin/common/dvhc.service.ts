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
  public checkBeDeleted(id: number) {
    return "ok";
  }
}
