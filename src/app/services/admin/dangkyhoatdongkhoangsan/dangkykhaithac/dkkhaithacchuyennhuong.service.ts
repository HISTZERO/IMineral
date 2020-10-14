import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";

import {RepositoryEloquentService} from "src/app/services/data/baserepository.service";
import {environment} from "src/environments/environment";
import {ServiceName} from "src/app/shared/constants/service-name";
import {
  InputDkThamDoChuyenNhuongModel,
  OutputDkThamDoChuyenNhuongModel
} from "src/app/models/admin/dangkyhoatdongkhoangsan/dangkykhaithac/dkthamdochuyennhuong.model";

@Injectable({
  providedIn: 'root'
})
export class DkkhaithacchuyennhuongService extends RepositoryEloquentService {

  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient,
      inputModelName: new InputDkThamDoChuyenNhuongModel(),
      outputModelName: new OutputDkThamDoChuyenNhuongModel(),
      apiUrl: environment.apiIMineral + ServiceName.DANGKYKHAITHACCHUYENNHUONG
    });
  }

  public checkBeDeleted(id: string) {
    return "ok";
  }

  public getDangKyChuyenNhuongByIdHoSo(idHoSo: any) {
    try {
      return this.httpClient.get(`${this.apiUrl}?idhoso=${idHoSo}`, {
        headers: this.headers,
      });
    } catch (error) {

    }
  }

  public deleteDangKyChuyenNhuongByIdHoSo(idHoSo: string) {
    try {
      this.setServiceInfo({
        apiUrl: environment.apiIMineral + ServiceName.DANGKYKHAITHACCHUYENNHUONG + "/deletebyidhoso"
      });

      return this.httpClient.delete<any>(`${this.apiUrl}?idhoso=${idHoSo}`, {
        headers: this.headers,
      });
    } catch (error) {

    }
  }

}
