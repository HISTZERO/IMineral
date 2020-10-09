import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";
import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";
import { InputDkThamDoTraLaiModel, OutputDkThamDoTraLaiModel } from "src/app/models/admin/dangkyhoatdongkhoangsan/dkthamdotralai.model";

@Injectable({
  providedIn: 'root'
})
export class DkthamdotralaiService extends RepositoryEloquentService{

  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient,
      inputModelName: new InputDkThamDoTraLaiModel(),
      outputModelName: new OutputDkThamDoTraLaiModel(),
      apiUrl: environment.apiIMineral + ServiceName.DANGKYTHAMDOTRALAI
    });
  }

  public checkBeDeleted(id: string) {
    return "ok";
  }

}
