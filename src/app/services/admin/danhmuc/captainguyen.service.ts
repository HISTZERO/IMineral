import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";
import { InputCapTaiNguyenModel, OutputCapTaiNguyenModel } from "src/app/models/admin/danhmuc/captainguyen.model";
import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";

@Injectable({
  providedIn: 'root'
})
export class CaptainguyenService extends RepositoryEloquentService {

  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient,
      inputModelName: new InputCapTaiNguyenModel(),
      outputModelName: new OutputCapTaiNguyenModel(),
      apiUrl: environment.apiIMineral + ServiceName.CAPTAINGUYEN
    });
  }

  public checkBeDeleted(id: number) {
    return "ok";
  }

}
