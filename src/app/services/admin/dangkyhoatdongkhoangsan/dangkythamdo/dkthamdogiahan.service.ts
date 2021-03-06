import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";
import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";
import { InputDkThamDoGiaHanModel, OutputDkThamDoGiaHanModel } from "src/app/models/admin/dangkyhoatdongkhoangsan/dangkythamdo/dkthamdogiahan.model";

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

  public getDangKyThamDoByIdHoSo(idHoSo: any) {
    try {
      return this.httpClient.get(`${this.apiUrl}?idhoso=${idHoSo}`, {
        headers: this.headers,
      });
    } catch (error) {

    }
  }

  public deleteDangKyThamDoByIdHoSo(idHoSo: string) {
    try {
      this.setServiceInfo({
        apiUrl: environment.apiIMineral + ServiceName.DANGKYTHAMDOGIAHAN + "/deletebyidhoso"
      });

      return this.httpClient.delete<any>(`${this.apiUrl}?idhoso=${idHoSo}`, {
        headers: this.headers,
      });
    } catch (error) {

    }
  }

  public cloneThongTinDangKyThamDoFromGiayPhepLS(idGiayPhep: string) {
    try {
      this.setServiceInfo({
        apiUrl: environment.apiIMineral + ServiceName.DANGKYTHAMDOGIAHAN + "/clonethongtindangkythamdofromgiayphepls"
      });

      return this.httpClient.get<any>(`${this.apiUrl}?idgiayphep=${idGiayPhep}`, {
        headers: this.headers,
      });
    } catch (error) {

    }
  }
}
