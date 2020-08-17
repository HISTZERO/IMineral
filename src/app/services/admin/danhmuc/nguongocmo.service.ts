import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";
import { InputNguonGocMoModel, OutputNguonGocMoModel } from "src/app/models/admin/danhmuc/nguongocmo.model";
import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";

@Injectable({
  providedIn: 'root'
})
export class NguongocmoService extends RepositoryEloquentService {

  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient,
      inputModelName: new InputNguonGocMoModel(),
      outputModelName: new OutputNguonGocMoModel(),
      apiUrl: environment.apiIMineral + ServiceName.NGUONGOCMO
    });
  }

  public checkBeDeleted(id: number) {
    return "ok";
  }

}
