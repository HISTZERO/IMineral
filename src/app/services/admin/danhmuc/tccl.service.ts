import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import {
  InputTieuchuanchatluongModel,
  OutputTieuchuanchatluongModel
} from "src/app/models/admin/danhmuc/tccl.model";
import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";
import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";

@Injectable({
  providedIn: "root"
})
export class TcclService extends RepositoryEloquentService {
  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient,
      inputModelName: new InputTieuchuanchatluongModel(),
      outputModelName: new OutputTieuchuanchatluongModel(),
      apiUrl: environment.apiCategoryURL + ServiceName.TIEUCHUANCHATLUONG
    });
  }

  public checkBeDeleted(id: number) {
    return "ok";
  }
}
