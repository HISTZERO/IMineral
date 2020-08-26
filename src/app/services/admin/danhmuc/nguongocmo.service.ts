import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";
import { InputDmNguonGocMoModel, OutputDmNguonGocMoModel } from "src/app/models/admin/danhmuc/nguongocmo.model";
import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";

@Injectable({
  providedIn: 'root'
})
export class DmNguongocmoService extends RepositoryEloquentService {

  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient,
      inputModelName: new InputDmNguonGocMoModel(),
      outputModelName: new OutputDmNguonGocMoModel(),
      apiUrl: environment.apiIMineral + ServiceName.NGUONGOCMO
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
      apiUrl: environment.apiIMineral + ServiceName.NGUONGOCMO + '/updateliststatus'
    });
    return this.updateItem(params);
  }

  public deleteItemsNguonGocMo(params) {
    this.setServiceInfo({
      apiUrl: environment.apiIMineral + ServiceName.NGUONGOCMO + '/removelist'
    });
    return this.updateItem(params);
  }
}
