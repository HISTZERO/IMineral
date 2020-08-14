import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";
import { InputLoaiCapPhepModel, OutputLoaiCapPhepModel } from "src/app/models/admin/danhmuc/loaicapphep.model";
import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";

@Injectable({
  providedIn: 'root'
})
export class LoaicapphepService extends RepositoryEloquentService {

  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient,
      inputModelName: new InputLoaiCapPhepModel(),
      outputModelName: new OutputLoaiCapPhepModel(),
      apiUrl: environment.apiCategoryURL + ServiceName.LOAICAPPHEP
    });
  }

  public checkBeDeleted(id: string) {
    return "ok";
  }

}
