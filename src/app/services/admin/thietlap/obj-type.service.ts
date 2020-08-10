import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";
import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";
import { InputObjTypesModel, OutputObjTypesModel } from "src/app/models/admin/thietlap/objTypes.model";

@Injectable({
  providedIn: 'root'
})
export class ObjTypeService extends RepositoryEloquentService {

  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient: httpClient,
      inputModelName: new InputObjTypesModel(),
      outputModelName: new OutputObjTypesModel(),
      apiUrl: environment.apiCommonURL + ServiceName.OBJTYPES,
    });
  }

  async getListCountOtypeKey(otypeCat: string) {
    this.setServiceInfo({
      apiUrl: `${environment.apiCommonURL}${ServiceName.OBJTYPES}/get-list-count-otypekey/${otypeCat}`,
    });
    const listData = await this.getFetchAll();
    return listData;
  }

  public checkBeDeleted(id: number) {
    return "ok";
  }
}
