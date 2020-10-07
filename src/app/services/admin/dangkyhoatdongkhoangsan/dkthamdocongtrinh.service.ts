import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";
import {InputDkThamDoCongTrinhModel, OutputDkThamDoCongTrinhModel } from "src/app/models/admin/dangkyhoatdongkhoangsan/dkthamdocongtrinh.model";
import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";

@Injectable({
  providedIn: 'root'
})
export class DkThamDoCongTrinhService extends RepositoryEloquentService {

  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient,
      inputModelName: new InputDkThamDoCongTrinhModel(),
      outputModelName: new OutputDkThamDoCongTrinhModel(),
      apiUrl: environment.apiIMineral + ServiceName.DANGKYTHAMDOCONGTRINH
    });
  }

  public checkBeDeleted(id: string) {
    return "ok";
  }

  public getDangKyThamDoCongTrinhByIdDangKyThamDo(idhoso: any) {
    try {
      return this.httpClient.get(`${this.apiUrl}?iddangkythamdo=${idhoso}`, {
        headers: this.headers,
      });
    } catch (error) {

    }
  }
}
