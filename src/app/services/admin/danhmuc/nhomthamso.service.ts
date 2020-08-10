import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";
import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";
import {
  InputNhomthamsoModel,
  OutputNhomthamsoModel
} from "src/app/models/admin/danhmuc/nhomthamso.model";

@Injectable({
  providedIn: "root"
})
export class NhomthamsoService extends RepositoryEloquentService {
  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient,
      inputModelName: new InputNhomthamsoModel(),
      outputModelName: new OutputNhomthamsoModel(),
      apiUrl: environment.apiCategoryURL + ServiceName.NHOMTHAMSO
    });
  }

  public checkBeDeleted(id: number) {
    return "ok";
  }
}
