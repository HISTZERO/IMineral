import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";
import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";
import { InputDkTanThuDvhc, OutputDkTanThuDvhc } from "src/app/models/admin/dangkyhoatdongkhoangsan/dangkytanthu/dktanthudvhc.model";

@Injectable({
  providedIn: 'root'
})
export class DktanthudvhcService extends RepositoryEloquentService {

  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient,
      inputModelName: new InputDkTanThuDvhc(),
      outputModelName: new OutputDkTanThuDvhc(),
      apiUrl: environment.apiIMineral + ServiceName.DANGKYTANTHUDVHC
    });
  }

  public checkBeDeleted(id: string) {
    return "ok";
  }

  public getDangKyTanThuDvhcByIdDangKyTanThu(idDangKyTanThu: any) {
    try {
      return this.httpClient.get(`${this.apiUrl}?iddangkytanthu=${idDangKyTanThu}`, {
        headers: this.headers,
      });
    } catch (error) {

    }
  }

  public getDangKyTanThuDvhcById(idDangKyTanThu: any) {
    this.setServiceInfo({
      apiUrl: environment.apiIMineral + ServiceName.DANGKYTANTHUDVHC + "/idtanthudvhc"
    });

    try {
      return this.httpClient.get(`${this.apiUrl}?idtanthudvhc=${idDangKyTanThu}`, {
        headers: this.headers,
      });
    } catch (error) {

    }
  }
}
