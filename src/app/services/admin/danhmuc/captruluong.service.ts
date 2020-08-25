import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';

import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";
import { InputDmCapTruLuongModel, OutputDmCapTruLuongModel } from "src/app/models/admin/danhmuc/captruluong.model";
import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";

@Injectable({
  providedIn: 'root'
})
export class DmCaptruluongService extends RepositoryEloquentService {

  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient,
      inputModelName: new InputDmCapTruLuongModel(),
      outputModelName: new OutputDmCapTruLuongModel(),
      apiUrl: environment.apiIMineral + ServiceName.CAPTRULUONG
    });
  }

  /**
   * Hàm update status
   * @param params
   */
  public updateStatusItemsCapTruLuong(params) {
    this.setServiceInfo({
      apiUrl: environment.apiIMineral + ServiceName.CAPTRULUONG + '/updateliststatus'
    });
    return this.updateItem(params);
  }

  /**
   * Hàm delete array item
   * @param params
   */
  public deleteItemsCapTruLuong(params) {
    this.setServiceInfo({
      apiUrl: environment.apiIMineral + ServiceName.CAPTRULUONG + '/removelist'
    });
    return this.updateItem(params);
  }

  public checkBeDeleted(id: number) {
    return "ok";
  }


}
