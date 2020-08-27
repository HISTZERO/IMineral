import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import {
  InputKhuVucDauGiaModel,
  OutputKhuVucDauGiaModel
} from "src/app/models/admin/khuvuckhoangsan/khuvucdaugia.model";
import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";
import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";

@Injectable({
  providedIn: "root"
})
export class KhuVucDauGiaService extends RepositoryEloquentService {
  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient,
      inputModelName: new InputKhuVucDauGiaModel(),
      outputModelName: new OutputKhuVucDauGiaModel(),
      apiUrl: environment.apiIMineral + ServiceName.KHUVUCDAUGIA
    });
  }

  public checkBeDeleted(id: number) {
    return "ok";
  }
}
