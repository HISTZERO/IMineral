import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";
import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";

@Injectable({
  providedIn: 'root'
})
export class ObjOptValueService extends RepositoryEloquentService {

  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      inputModelName: null,
      outputModelName: null,
      httpClient: httpClient,
      apiUrl: environment.apiCommonURL + ServiceName.OBJOPTVALUE,
    });
  }

  // get data by id- objKey
  async getAllByOtypeKey(otypeKey: string) {
    this.setServiceInfo({
      apiUrl: `${environment.apiCommonURL}${ServiceName.OBJOPTVALUE}/${otypeKey}`
    });
    const listData = await this.getFetchAll();
    return listData;
  }

  // get geox geoy
  async getGeoxGeoy(toadox: number, toadoy: number, srid: number, kieutoado: string) {
    this.setServiceInfo({
      apiUrl: `${environment.apiCommonURL}${ServiceName.OBJOPTVALUE}/${toadox}/${toadoy}/${srid}/${kieutoado}`
    });
    const listDataGeo = await this.getFetchAll();
    return listDataGeo;
  }

  public checkBeDeleted(id: number) {
    return "ok";
  }
}
