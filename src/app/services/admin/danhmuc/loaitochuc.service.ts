import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";
import { InputLoaiToChucModel, OutputLoaiToChucModel } from "src/app/models/admin/danhmuc/loaitochuc.model";
import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";

@Injectable({
  providedIn: 'root'
})
export class LoaitochucService extends RepositoryEloquentService {

  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient,
      inputModelName: new InputLoaiToChucModel(),
      outputModelName: new OutputLoaiToChucModel(),
      apiUrl: environment.apiIMineral + ServiceName.LOAITOCHUC
    });
  }

  public checkBeDeleted(id: number) {
    return "ok";
  }

}
