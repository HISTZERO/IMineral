import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";
import {InputDkThamDoDvhc, OutputDkThamDoDvhc } from "src/app/models/admin/dangkyhoatdongkhoangsan/dkthamdodvhc.model";
import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";

@Injectable({
  providedIn: 'root'
})
export class DkThamDoDvhcService extends RepositoryEloquentService {

  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient,
      inputModelName: new InputDkThamDoDvhc(),
      outputModelName: new OutputDkThamDoDvhc(),
      apiUrl: environment.apiIMineral + ServiceName.DANGKYTHAMDODVHC
    });
  }

  public checkBeDeleted(id: string) {
    return "ok";
  }

  public getDangKyThamDoDvhcByIdDangKyThamDo(idDangKyThamDo: any) {
    try {
      return this.httpClient.get(`${this.apiUrl}?iddangkythamdo=${idDangKyThamDo}`, {
        headers: this.headers,
      });
    } catch (error) {

    }
  }
}
