import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";
import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";
import { InputHsCoQuanTiepNhanModel, OutputHsCoQuanTiepNhanModel } from "src/app/models/admin/thietlap/coquantiepnhan.model";

@Injectable({
  providedIn: 'root'
})
export class CoquantiepnhanService extends RepositoryEloquentService {

  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient: httpClient,
      inputModelName: new InputHsCoQuanTiepNhanModel(),
      outputModelName: new OutputHsCoQuanTiepNhanModel(),
      apiUrl: environment.apiIMineral + ServiceName.COQUANTIEPNHAN
    });
  }

  /**
   * Lấy về danh sách cơ quan tiếp nhận
   */
  public getAllCoQuanTiepNhan(param) {
    this.setServiceInfo({
      apiUrl: environment.apiIMineral + ServiceName.COQUANTIEPNHAN + "/" + ServiceName.GETALLCOQUANTIEPNHAN
    });
    return this.getFetchAll(param);
  }

  public checkBeDeleted(id: string) {
    return "ok";
  }

}
