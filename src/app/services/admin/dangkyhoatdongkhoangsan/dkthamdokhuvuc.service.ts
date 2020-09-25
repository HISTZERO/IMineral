import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';

import { environment } from "src/environments/environment";
import { InputDkThamDoKhuVucModel, OutputDkThamDoKhuVucModel } from "src/app/models/admin/dangkyhoatdongkhoangsan/dkthamsokhuvuc.model";
import { ServiceName } from "src/app/shared/constants/service-name";
import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";

@Injectable({
  providedIn: 'root'
})
export class DkthamdokhuvucService extends RepositoryEloquentService {

  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient,
      inputModelName: new InputDkThamDoKhuVucModel(),
      outputModelName: new OutputDkThamDoKhuVucModel(),
      apiUrl: environment.apiIMineral + ServiceName.DANGKYTHAMDOKHUVUC
    });
  }

  public checkBeDeleted(id: string) {
    return "ok";
  }

}
