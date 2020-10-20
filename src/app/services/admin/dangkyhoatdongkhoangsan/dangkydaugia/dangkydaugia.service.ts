import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";
import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";
import { InputDKDauGiaKhoangSanModel, OutputDKDauGiaKhoangSanModel } from 'src/app/models/admin/dangkyhoatdongkhoangsan/dangkydaugia/dangkydaugia.model';

@Injectable({
  providedIn: 'root'
})
export class DkDauGiaKhoangSanService extends RepositoryEloquentService {

  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient,
      inputModelName: new InputDKDauGiaKhoangSanModel(),
      outputModelName: new OutputDKDauGiaKhoangSanModel(),
      apiUrl: environment.apiIMineral + ServiceName.DANGKYDAUGIAQUYENKHAITHAC
    });
  }

  public checkBeDeleted(id: string) {
    return "ok";
  }
  //Lấy 1 bản ghi
  public getDangKyDauGiaKSByIdHoSo(idHoSo: any) {
    try {
      return this.httpClient.get(`${this.apiUrl}/${idHoSo}`, {
        headers: this.headers,
      });
    } catch (error) {

    }
  }
 //xóa 
  public deleteDangKyDauGiaKSByIdHoSo(idHoSo: string) {
    try {
      return this.httpClient.delete(`${this.apiUrl}/${idHoSo}`, {
        headers: this.headers,
      });
    } catch (error) {

    }
  }
}
