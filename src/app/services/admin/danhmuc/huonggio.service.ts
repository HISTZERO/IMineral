import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";
import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";
import { InputHuonggioModel, OutputHuonggioModel } from "src/app/models/admin/danhmuc/huonggio.model";

@Injectable({
  providedIn: "root"
})
export class HuonggioService extends RepositoryEloquentService {

  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient,
      inputModelName: new InputHuonggioModel(),
      outputModelName: new OutputHuonggioModel(),
      apiUrl: environment.apiCategoryURL + ServiceName.HUONGGIO
    });
  }

  public checkBeDeleted(id: number) {
    return "ok";
  }
}
