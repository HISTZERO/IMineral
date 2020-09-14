import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import {
  InputDmCanhanModel,
  OutputDmCanhanModel
} from "src/app/models/admin/danhmuc/canhan.model";
import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";
import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";

@Injectable({
  providedIn: "root"
})
export class DmCanhanService extends RepositoryEloquentService {
  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient,
      inputModelName: new InputDmCanhanModel(),
      outputModelName: new OutputDmCanhanModel(),
      apiUrl: environment.apiIMineral + ServiceName.CANHAN
    });
  }

  /**
   * Hàm update status
   * @param params
   */
  public updateStatusArrayItem(params) {
    this.setServiceInfo({
      apiUrl: environment.apiIMineral + ServiceName.CANHAN + '/updateliststatus'
    });
    return this.updateItem(params);
  }

  /**
   * Hàm delete array item
   * @param params
   */
  public deleteArrayItem(params) {
    this.setServiceInfo({
      apiUrl: environment.apiIMineral + ServiceName.CANHAN + '/removelist'
    });
    return this.updateItem(params);
  }

  public checkBeDeleted(id: string) {
    return "ok";
  }
}
