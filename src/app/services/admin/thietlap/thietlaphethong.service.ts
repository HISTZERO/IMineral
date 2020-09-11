import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";
import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";
import {
  InputThietLapHeThongModel,
  OutputThietLapHeThongModel
} from "src/app/models/admin/thietlap/thietlap-hethong.model";

@Injectable({
  providedIn: 'root'
})
export class ThietlaphethongService extends RepositoryEloquentService {

  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient: httpClient,
      inputModelName: new InputThietLapHeThongModel(),
      outputModelName: new OutputThietLapHeThongModel(),
      apiUrl: environment.apiIMineral + ServiceName.THIETLAPHETHONG
    });
  }

  
  public checkBeDeleted(id: number) {
    return "ok";
  }
}
