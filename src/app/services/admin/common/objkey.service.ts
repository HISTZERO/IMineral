import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";
import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";
import {
  InputObjKeyModel,
  OutputObjKeyModel,
} from "src/app/models/admin/common/objKey.model";

@Injectable({
  providedIn: "root",
})
export class ObjkeyService extends RepositoryEloquentService {
  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient: httpClient,
      inputModelName: InputObjKeyModel,
      outputModelName: OutputObjKeyModel,
      apiUrl: environment.apiCommonURL + ServiceName.OBJKEY,
    });
  }

  // get data by id- objKey
  public getDataByIdObjKey(objkey, id) {
    this.setServiceInfo({
      apiUrl:
        environment.apiCommonURL +
        ServiceName.OBJKEY +
        "/get-data-by-id-objKey/" +
        objkey +
        "/" +
        id,
    });
    return this.getFetchAll();
  }

  // get data by module name
  public getDataByModuleName(moduleName) {
    this.setServiceInfo({
      apiUrl:
        environment.apiCommonURL +
        ServiceName.OBJKEY +
        "/get-data-by-module-name/" +
        moduleName,
    });
    return this.getFetchAll();
  }

  // get data coordinate by objkey
  public getDataCoordinateByObjKey(state, param) {
    this.setServiceInfo({
      apiUrl:
        environment.apiCommonURL +
        ServiceName.OBJKEY +
        "/get-data-coordinate-by-objkey",
    });
    return this.getDataFromServer(state, param);
  }

  // get obj name by obj key
  public getObjNameByObjKey(objkey) {
    this.setServiceInfo({
      apiUrl:
        environment.apiCommonURL +
        ServiceName.OBJKEY +
        "/get-obj-name-by-objKey/" +
        objkey,
    });
    return this.getFetchAll();
  }

  public checkBeDeleted(id: number) {
    return "ok";
  }
}
