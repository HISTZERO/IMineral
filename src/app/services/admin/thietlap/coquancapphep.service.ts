import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";
import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";
import {InputHsCoQuanCapPhepModel, OutputHsCoQuanCapPhepModel} from "src/app/models/admin/thietlap/coquancapphep.model";

@Injectable({
  providedIn: 'root'
})
export class CoquancapphepService extends RepositoryEloquentService {

  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient: httpClient,
      inputModelName: new InputHsCoQuanCapPhepModel(),
      outputModelName: new OutputHsCoQuanCapPhepModel(),
      apiUrl: environment.apiIMineral + ServiceName.COQUANCAPPHEP
    });
  }

  /**
   * Lấy về danh sách cơ quan tiếp nhận
   */
  public getAllCoQuanCapPhep(param) {
    this.setServiceInfo({
      apiUrl: environment.apiIMineral + ServiceName.COQUANCAPPHEP + "/" + ServiceName.GETALLCOQUANCAPPHEP
    });
    return this.getFetchAll(param);
  }

  public checkBeDeleted(id: string) {
    return "ok";
  }

}
