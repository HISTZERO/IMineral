import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";
import {InputDkThamDoKhoangSanModel, OutputDkThamDoKhoangSanModel } from "src/app/models/admin/dangkyhoatdongkhoangsan/dkthamdokhoangsan.model";
import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";

@Injectable({
  providedIn: 'root'
})
export class DkThamDoKhoangSanService extends RepositoryEloquentService {

  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient,
      inputModelName: new InputDkThamDoKhoangSanModel(),
      outputModelName: new OutputDkThamDoKhoangSanModel(),
      apiUrl: environment.apiIMineral + ServiceName.DkThamDoKhoangSan
    });
  }

  public checkBeDeleted(id: string) {
    return "ok";
  }

  public getDangKyThamDoByidHoSo(idhoso: any) {
    this.setServiceInfo({
      apiUrl: environment.apiIMineral + ServiceName.DkThamDoKhoangSan
    });

    try {
      return this.httpClient.get(`${this.apiUrl}?Idhoso=${idhoso}`, {
        headers: this.headers,
      });
    } catch (error) {

    }
  }
}
