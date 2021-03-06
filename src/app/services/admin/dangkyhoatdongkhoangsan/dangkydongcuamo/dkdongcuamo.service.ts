import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";
import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";
import {
  InputDkDongCuaMoModel,
  OutputDkDongCuaMoModel
} from "src/app/models/admin/dangkyhoatdongkhoangsan/dangkydongcuamo/dkdongcuamo.model";

@Injectable({
  providedIn: 'root'
})
export class DkdongcuamoService extends RepositoryEloquentService {

  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient,
      inputModelName: new InputDkDongCuaMoModel(),
      outputModelName: new OutputDkDongCuaMoModel(),
      apiUrl: environment.apiIMineral + ServiceName.DANGKYDONGCUAMO
    });
  }

  public checkBeDeleted(id: string) {
    return "ok";
  }

  public getDangKyDongCuaByIdHoSo(idHoSo: any) {
    try {
      return this.httpClient.get(`${this.apiUrl}?idhoso=${idHoSo}`, {
        headers: this.headers,
      });
    } catch (error) {

    }
  }

  public getDangKyDongCuaMoByIdGiayPhep(idGiayPhep: any) {
    try {
      this.setServiceInfo({
        apiUrl: environment.apiIMineral + ServiceName.DANGKYDONGCUAMO + "/getdkkhaithacdongcuamobyidgiayphep"
      });

      return this.httpClient.get(`${this.apiUrl}?idgiayphep=${idGiayPhep}`, {
        headers: this.headers,
      });
    } catch (error) {
    }
  }

}
