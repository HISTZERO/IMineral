import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import {
  InputChudeModel,
  OutputChudeModel,
} from "src/app/models/admin/tinbai/chude.model";
import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";
import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";

@Injectable({
  providedIn: "root",
})
export class TbChudeService extends RepositoryEloquentService {
  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient,
      inputModelName: new InputChudeModel(),
      outputModelName: new OutputChudeModel(),
      apiUrl: environment.apiIMineral + ServiceName.CHUDE,
    });
  }

  public checkBeDeleted(id: number) {
    return "ok";
  }
}
