import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";
import { InputDmLoaiToChucModel, OutputDmLoaiToChucModel } from "src/app/models/admin/danhmuc/loaitochuc.model";
import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";

@Injectable({
  providedIn: 'root'
})
export class DmLoaitochucService extends RepositoryEloquentService {

  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient,
      inputModelName: new InputDmLoaiToChucModel(),
      outputModelName: new OutputDmLoaiToChucModel(),
      apiUrl: environment.apiIMineral + ServiceName.LOAITOCHUC
    });
  }

  public checkBeDeleted(id: number) {
    return "ok";
  }

}
