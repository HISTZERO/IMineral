import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";
import {OutputHoSoModel, InputHoSoModel } from "src/app/models/admin/dangkyhoatdongkhoangsan/hoso.model";
import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";

@Injectable({
  providedIn: 'root'
})
export class HosoService extends RepositoryEloquentService {

  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient,
      inputModelName: new InputHoSoModel(),
      outputModelName: new OutputHoSoModel(),
      apiUrl: environment.apiIMineral + ServiceName.HOSO
    });
  }

  public checkBeDeleted(id: string) {
    return "ok";
  }

}
