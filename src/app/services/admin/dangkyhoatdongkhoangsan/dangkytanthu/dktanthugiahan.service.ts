import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";

import {RepositoryEloquentService} from "src/app/services/data/baserepository.service";
import {environment} from "src/environments/environment";
import {ServiceName} from "src/app/shared/constants/service-name";
import {
  InputDkTanThuGiaHanModel,
  OutputDkTanThuGiaHanModel
} from "src/app/models/admin/dangkyhoatdongkhoangsan/dangkytanthu/dktanthugiahan.model";

@Injectable({
  providedIn: 'root'
})
export class DktanthugiahanService extends RepositoryEloquentService {

  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient,
      inputModelName: new InputDkTanThuGiaHanModel(),
      outputModelName: new OutputDkTanThuGiaHanModel(),
      apiUrl: environment.apiIMineral + ServiceName.DANGKYTANTHUGIAHAN
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

  public getDangKyTanThuGiaHanByIdGiayPhep(idGiayPhep: any) {
    try {
      this.setServiceInfo({
        apiUrl: environment.apiIMineral + ServiceName.DANGKYTANTHUGIAHAN + "/clonethongtindangkytanthufromgiayphepls"
      });

      return this.httpClient.get(`${this.apiUrl}?idgiayphep=${idGiayPhep}`, {
        headers: this.headers,
      });
    } catch (error) {
    }
  }

  public deleteDangKyTanThuByIdHoSo(idHoSo: string) {
    try {
      this.setServiceInfo({
        apiUrl: environment.apiIMineral + ServiceName.DANGKYTANTHUGIAHAN + "/deletebyidhoso"
      });

      return this.httpClient.delete<any>(`${this.apiUrl}?idhoso=${idHoSo}`, {
        headers: this.headers,
      });
    } catch (error) {

    }
  }


}
