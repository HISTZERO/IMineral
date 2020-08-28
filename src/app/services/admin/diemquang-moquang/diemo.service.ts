import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import {
  InputDiemMoModel,
  OutputDiemMoModel
} from "src/app/models/admin/diemquang-moquang/diemmo.model";
import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";
import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";

@Injectable({
  providedIn: "root"
})
export class DiemMoService extends RepositoryEloquentService {
  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient,
      inputModelName: new InputDiemMoModel(),
      outputModelName: new OutputDiemMoModel(),
      apiUrl: environment.apiIMineral + ServiceName.DIEMMO
    });
  }

  public checkBeDeleted(id: number) {
    return "ok";
  }
}
