import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";
import { InputToChucModel, OutputToChucModel } from "src/app/models/admin/danhmuc/tochuc.model";
import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";

@Injectable({
  providedIn: 'root'
})
export class TochucService extends RepositoryEloquentService {

  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient,
      inputModelName: new InputToChucModel(),
      outputModelName: new OutputToChucModel(),
      apiUrl: environment.apiCategoryURL + ServiceName.TOCHUC
    });
  }

  public checkBeDeleted(id: number) {
    return "ok";
  }

}
