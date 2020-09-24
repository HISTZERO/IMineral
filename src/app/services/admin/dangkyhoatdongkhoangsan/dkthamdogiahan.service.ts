import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";
import {InputDkThamDoGiaHanModel, OutputDkThamDoGiaHanModel } from "src/app/models/admin/dangkyhoatdongkhoangsan/dkthamdogiahan.model";
import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";

@Injectable({
  providedIn: 'root'
})
export class DkThamDoGiaHanService extends RepositoryEloquentService {

  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient,
      inputModelName: new InputDkThamDoGiaHanModel(),
      outputModelName: new OutputDkThamDoGiaHanModel(),
      apiUrl: environment.apiIMineral + ServiceName.DANGKYTHAMDOGIAHAN
    });
  }

  public checkBeDeleted(id: string) {
    return "ok";
  }

  public getDangKyThamDoByIdHoSo(idhoso: any) {
    try {
      return this.httpClient.get(`${this.apiUrl}?Idhoso=${idhoso}`, {
        headers: this.headers,
      });
    } catch (error) {

    }
  }

  public deleteDangKyThamDoByIdHoSo(idHoSo: string) {
    try {
      this.setServiceInfo({
        apiUrl: environment.apiIMineral + ServiceName.DANGKYTHAMDOGIAHAN + "/DeleteByIdhoso"
      });

      return this.httpClient.delete<any>(`${this.apiUrl}?Idhoso=${idHoSo}`, {
        headers: this.headers,
      });
    } catch (error) {

    }
  }
}
