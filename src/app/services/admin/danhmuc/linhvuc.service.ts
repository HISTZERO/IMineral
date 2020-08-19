import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import {
  InputLinhvucModel,
  OutputLinhvucModel
} from "src/app/models/admin/danhmuc/linhvuc.model";
import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";
import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";

@Injectable({
  providedIn: "root"
})
export class LinhvucService extends RepositoryEloquentService {
  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient,
      inputModelName: new InputLinhvucModel(),
      outputModelName: new OutputLinhvucModel(),
      apiUrl: environment.apiIMineral + ServiceName.LINHVUC
    });
  }

  public checkBeDeleted(id: number) {
    return "ok";
  }
}
