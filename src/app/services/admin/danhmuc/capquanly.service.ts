import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";
import { InputCapQuanLyModel, OutputCapQuanLyModel } from "src/app/models/admin/danhmuc/capquanly.model";
import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";

@Injectable({
  providedIn: 'root'
})
export class CapquanlyService extends RepositoryEloquentService {

  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient,
      inputModelName: new InputCapQuanLyModel(),
      outputModelName: new OutputCapQuanLyModel(),
      apiUrl: environment.apiCategoryURL + ServiceName.CAPQUANLY
    });
  }

  public checkBeDeleted(id: number) {
    return "ok";
  }

}
