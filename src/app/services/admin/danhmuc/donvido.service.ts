import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";
import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";
import { InputDonvidoModel, OutputDonvidoModel } from "src/app/models/admin/danhmuc/donvido.model";

@Injectable({
  providedIn: "root"
})
export class DonvidoService extends RepositoryEloquentService {

  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient,
      inputModelName: new InputDonvidoModel(),
      outputModelName: new OutputDonvidoModel(),
      apiUrl: environment.apiCategoryURL + ServiceName.DONVIDO
    });
  }

  public checkBeDeleted(id: number) {
    return "ok";
  }
}
