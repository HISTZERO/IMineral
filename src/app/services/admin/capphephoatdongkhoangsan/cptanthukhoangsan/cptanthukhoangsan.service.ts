import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";

import {RepositoryEloquentService} from "src/app/services/data/baserepository.service";

import {environment} from "src/environments/environment";
import {ServiceName} from "src/app/shared/constants/service-name";
import {
  InputCpTanThuKhoangSanModel,
  OutputCpTanThuKhoangSanModel
} from "src/app/models/admin/capphephoatdongkhoangsan/cptanthukhoangsan/cptanthukhoangsan.model";

@Injectable({
  providedIn: 'root'
})
export class CpTanThuKhoangSanService extends RepositoryEloquentService {

  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient,
      inputModelName: new InputCpTanThuKhoangSanModel(),
      outputModelName: new OutputCpTanThuKhoangSanModel(),
      apiUrl: environment.apiIMineral + ServiceName.CPTANTHUKHOANGSAN
    });
  }

  public checkBeDeleted(id: string) {
    return "ok";
  }

  public getCapPhepTanThuByIdGiayPhep(idGiayPhep: any) {
    try {
      this.setServiceInfo({
        apiUrl: environment.apiIMineral + ServiceName.CPTANTHUKHOANGSAN + "/getbyidgiayphep"
      });

      return this.httpClient.get<any>(`${this.apiUrl}?idgiayphep=${idGiayPhep}`, {
        headers: this.headers,
      });
    } catch (error) {

    }
  }

  public deleteCapPhepTanThuByIdGiayPhep(idGiayPhep: string) {
    try {
      this.setServiceInfo({
        apiUrl: environment.apiIMineral + ServiceName.CPTANTHUKHOANGSAN + "/deletebyidgiayphep"
      });

      return this.httpClient.delete<any>(`${this.apiUrl}?idgiayphep=${idGiayPhep}`, {
        headers: this.headers,
      });
    } catch (error) {

    }
  }
}
