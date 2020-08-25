import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';

import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";
import { InputDmLoaiTaiLieuModel, OutputDmLoaiTaiLieuModel } from "src/app/models/admin/danhmuc/loaitailieu.model";
import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";

@Injectable({
  providedIn: 'root'
})
export class DmLoaitailieuService extends RepositoryEloquentService {

  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient,
      inputModelName: new InputDmLoaiTaiLieuModel(),
      outputModelName: new OutputDmLoaiTaiLieuModel(),
      apiUrl: environment.apiIMineral + ServiceName.LOAITAILIEU
    });
  }

  /**
   * Hàm update status
   * @param params
   */
  public updateStatusItemsLoaiTaiLieu(params) {
    this.setServiceInfo({
      apiUrl: environment.apiIMineral + ServiceName.LOAITAILIEU + '/updateliststatus'
    });
    return this.updateItem(params);
  }

  /**
   * Hàm delete array item
   * @param params
   */
  public deleteItemsLoaiTaiLieu(params) {
    this.setServiceInfo({
      apiUrl: environment.apiIMineral + ServiceName.LOAITAILIEU + '/removelist'
    });
    return this.updateItem(params);
  }

  public checkBeDeleted(id: number) {
    return "ok";
  }


}
