import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import {
  InputDmLinhvucModel,
  OutputDmLinhvucModel
} from "src/app/models/admin/danhmuc/linhvuc.model";
import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";
import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";

@Injectable({
  providedIn: "root"
})
export class DmLinhvucService extends RepositoryEloquentService {
  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient,
      inputModelName: new InputDmLinhvucModel(),
      outputModelName: new OutputDmLinhvucModel(),
      apiUrl: environment.apiIMineral + ServiceName.LINHVUC
    });
  }

  public checkBeDeleted(id: number) {
    return "ok";
  }

  /**
   * Hàm update status
   * @param params
   */
  public updateStatusArrayItem(params) {
    this.setServiceInfo({
      apiUrl: environment.apiIMineral + ServiceName.LINHVUC + '/updateliststatus'
    });
    return this.updateItem(params);
  }

  public deleteItemsLinhVuc(params) {
    this.setServiceInfo({
      apiUrl: environment.apiIMineral + ServiceName.LINHVUC + '/removelist'
    });
    return this.updateItem(params);
  }
}
