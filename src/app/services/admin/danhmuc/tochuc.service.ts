import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";
import { InputDmToChucModel, OutputDmToChucModel } from "src/app/models/admin/danhmuc/tochuc.model";
import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";

@Injectable({
  providedIn: 'root'
})
export class DmTochucService extends RepositoryEloquentService {

  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient,
      inputModelName: new InputDmToChucModel(),
      outputModelName: new OutputDmToChucModel(),
      apiUrl: environment.apiIMineral + ServiceName.TOCHUC
    });
  }

  public checkBeDeleted(id: number) {
    return "ok";
  }

}