import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";
import { InputDmLoaiCapPhepModel, OutputDmLoaiCapPhepModel } from "src/app/models/admin/danhmuc/loaicapphep.model";
import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";

@Injectable({
  providedIn: 'root'
})
export class DmLoaicapphepService extends RepositoryEloquentService {

  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient,
      inputModelName: new InputDmLoaiCapPhepModel(),
      outputModelName: new OutputDmLoaiCapPhepModel(),
      apiUrl: environment.apiIMineral + ServiceName.LOAICAPPHEP
    });
  }

  /**
   * Hàm update status
   * @param params
   */
  public updateStatusItemsLoaiCapPhep(params) {
    this.setServiceInfo({
      apiUrl: environment.apiIMineral + ServiceName.LOAICAPPHEP + '/updateliststatus'
    });
    return this.updateItem(params);
  }

  /**
   * Hàm delete array item
   * @param params
   */
  public deleteItemsLoaiCapPhep(params) {
    this.setServiceInfo({
      apiUrl: environment.apiIMineral + ServiceName.LOAICAPPHEP + '/removelist'
    });
    return this.updateItem(params);
  }
  
  public checkBeDeleted(id: string) {
    return "ok";
  }

}
