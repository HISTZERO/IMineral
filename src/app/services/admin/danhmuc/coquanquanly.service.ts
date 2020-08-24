import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";
import { InputDmCoQuanQuanLyModel, OutputDmCoQuanQuanLyModel } from "src/app/models/admin/danhmuc/coquanquanly.model";
import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";

@Injectable({
  providedIn: 'root'
})
export class DmCoquanquanlyService extends RepositoryEloquentService {

  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient,
      inputModelName: new InputDmCoQuanQuanLyModel(),
      outputModelName: new OutputDmCoQuanQuanLyModel(),
      apiUrl: environment.apiIMineral + ServiceName.COQUANQUANLY
    });
  }

  /**
   * Hàm update status
   * @param params
   */
  public updateStatusItemsCoQuanQuanLy(params) {
    this.setServiceInfo({
      apiUrl: environment.apiIMineral + ServiceName.COQUANQUANLY + '/updateliststatus'
    });
    return this.updateItem(params);
  }

  /**
   * Hàm delete array item
   * @param params
   */
  public deleteItemsCoQuanQuanLy(params) {
    this.setServiceInfo({
      apiUrl: environment.apiIMineral + ServiceName.COQUANQUANLY + '/removelist'
    });
    return this.deleteItem(params);
  }

  public checkBeDeleted(id: number) {
    return "ok";
  }


}
