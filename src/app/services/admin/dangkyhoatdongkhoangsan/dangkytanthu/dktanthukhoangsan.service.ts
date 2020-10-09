import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";
import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";
import {
  InputDkTanThuKhoangSanModel,
  OutputDkTanThuKhoangSanModel
} from "src/app/models/admin/dangkyhoatdongkhoangsan/dangkytanthu/dktanthukhoangsan.model";

@Injectable({
  providedIn: 'root'
})
export class DktanthukhoangsanService extends RepositoryEloquentService {

  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient,
      inputModelName: new InputDkTanThuKhoangSanModel(),
      outputModelName: new OutputDkTanThuKhoangSanModel(),
      apiUrl: environment.apiIMineral + ServiceName.DANGKYTANTHUKHOANGSAN
    });
  }

  public checkBeDeleted(id: string) {
    return "ok";
  }

  public getDangKyTanThuByIdHoSo(idHoSo: any) {
    try {
      return this.httpClient.get(`${this.apiUrl}?idhoso=${idHoSo}`, {
        headers: this.headers,
      });
    } catch (error) {

    }
  }

  public deleteDangKyTanThuByIdHoSo(idHoSo: string) {
    try {
      this.setServiceInfo({
        apiUrl: environment.apiIMineral + ServiceName.DANGKYTANTHUKHOANGSAN + "/deletebyidhoso"
      });

      return this.httpClient.delete<any>(`${this.apiUrl}?idhoso=${idHoSo}`, {
        headers: this.headers,
      });
    } catch (error) {

    }
  }
}
