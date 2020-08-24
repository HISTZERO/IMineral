import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";
import { InputDmCapQuanLyModel, OutputDmCapQuanLyModel } from "src/app/models/admin/danhmuc/capquanly.model";
import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";

@Injectable({
  providedIn: 'root'
})
export class DmCapquanlyService extends RepositoryEloquentService {

  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient,
      inputModelName: new InputDmCapQuanLyModel(),
      outputModelName: new OutputDmCapQuanLyModel(),
      apiUrl: environment.apiIMineral + ServiceName.CAPQUANLY
    });
  }

  /**
   * Hàm update status
   * @param params
   */
  public updateStatusItemsCapQuanLy(params) {
    this.setServiceInfo({
      apiUrl: environment.apiIMineral + ServiceName.CAPQUANLY + '/updateliststatus'
    });
    return this.updateItem(params);
  }

  /**
   * Hàm delete array item
   * @param params
   */
  public deleteItemsCapQuanLy(params) {
    this.setServiceInfo({
      apiUrl: environment.apiIMineral + ServiceName.CAPQUANLY + '/removelist'
    });
    return this.deleteItem(params);
  }

  public checkBeDeleted(id: number) {
    return "ok";
  }

}
