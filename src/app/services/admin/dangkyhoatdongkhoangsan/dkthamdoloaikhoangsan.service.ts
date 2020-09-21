import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";
import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";
import { InputDkThamDoLoaiKhoangSan, OutputDkThamDoLoaiKhoangSan } from 'src/app/models/admin/dangkyhoatdongkhoangsan/dkthamdoloaikhoangsan.model';

@Injectable({
  providedIn: 'root'
})
export class DkThamDoLoaiKhoangSanService extends RepositoryEloquentService {

  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient,
      inputModelName: new InputDkThamDoLoaiKhoangSan(),
      outputModelName: new OutputDkThamDoLoaiKhoangSan(),
      apiUrl: environment.apiIMineral + ServiceName.DANGKYTHAMDOLOAIKHOANGSAN
    });
  }

  public checkBeDeleted(id: string) {
    return "ok";
  }

  public getDangKyThamDoLoaiKhoangSanByIdDangKyThamDo(idhoso: any) {
    try {
      return this.httpClient.get(`${this.apiUrl}?Iddangkythamdo=${idhoso}`, {
        headers: this.headers,
      });
    } catch (error) {

    }
  }
}