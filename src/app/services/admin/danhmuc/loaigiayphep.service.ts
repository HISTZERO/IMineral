import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";
import { InputDmLoaiGiayPhepModel, OutputDmLoaiGiayPhepModel } from "src/app/models/admin/danhmuc/loaigiayphep.model";
import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";

@Injectable({
  providedIn: 'root'
})
export class DmLoaigiayphepService extends RepositoryEloquentService {

  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient,
      inputModelName: new InputDmLoaiGiayPhepModel(),
      outputModelName: new OutputDmLoaiGiayPhepModel(),
      apiUrl: environment.apiIMineral + ServiceName.LOAIGIAYPHEP
    });
  }

  /**
   * Hàm update status
   * @param params
   */
  public updateStatusItemsLoaiGiayPhep(params) {
    this.setServiceInfo({
      apiUrl: environment.apiIMineral + ServiceName.LOAIGIAYPHEP + '/updateliststatus'
    });
    return this.updateItem(params);
  }

  /**
   * Hàm delete array item
   * @param params
   */
  public deleteItemsLoaiGiayPhep(params) {
    this.setServiceInfo({
      apiUrl: environment.apiIMineral + ServiceName.LOAIGIAYPHEP + '/removelist'
    });
    return this.updateItem(params);
  }

  public checkBeDeleted(id: string) {
    return "ok";
  }


}
