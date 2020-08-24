import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";
import { InputDmCapTaiNguyenModel, OutputDmCapTaiNguyenModel } from "src/app/models/admin/danhmuc/captainguyen.model";
import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";

@Injectable({
  providedIn: 'root'
})
export class DmCaptainguyenService extends RepositoryEloquentService {

  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient,
      inputModelName: new InputDmCapTaiNguyenModel(),
      outputModelName: new OutputDmCapTaiNguyenModel(),
      apiUrl: environment.apiIMineral + ServiceName.CAPTAINGUYEN
    });
  }

  /**
   * Hàm update status
   * @param params
   */
  public updateStatusItemsCapTaiNguyen(params) {
    this.setServiceInfo({
      apiUrl: environment.apiIMineral + ServiceName.CAPTAINGUYEN + '/updateliststatus'
    });
    return this.updateItem(params);
  }

  /**
   * Hàm delete array item
   * @param params
   */
  public deleteItemsCapTaiNguyen(params) {
    this.setServiceInfo({
      apiUrl: environment.apiIMineral + ServiceName.CAPTAINGUYEN + '/removelist'
    });
    return this.deleteItem(params);
  }

  public checkBeDeleted(id: number) {
    return "ok";
  }

}
