import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import {
  InputHsCoQuanTiepNhanModel,
  OutputHsCoQuanTiepNhanModel
} from "src/app/models/admin/thietlap/coquantiepnhan.model";
import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";
import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";

@Injectable({
  providedIn: "root"
})
export class HsCoquantiepnhanService extends RepositoryEloquentService {
  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient,
      inputModelName: new InputHsCoQuanTiepNhanModel(),
      outputModelName: new OutputHsCoQuanTiepNhanModel(),
      apiUrl: environment.apiIMineral + ServiceName.COQUANTIEPNHAN
    });
  }

  public checkBeDeleted(id: number) {
    return "ok";
  }
}
