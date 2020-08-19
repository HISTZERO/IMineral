import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";
import { InputCoQuanQuanLyModel, OutputCoQuanQuanLyModel } from "src/app/models/admin/danhmuc/coquanquanly.model";
import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";

@Injectable({
  providedIn: 'root'
})
export class CoquanquanlyService extends RepositoryEloquentService {

  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient,
      inputModelName: new InputCoQuanQuanLyModel(),
      outputModelName: new OutputCoQuanQuanLyModel(),
      apiUrl: environment.apiIMineral + ServiceName.COQUANQUANLY
    });
  }

  public checkBeDeleted(id: number) {
    return "ok";
  }


}
