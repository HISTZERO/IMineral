import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';

import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";
import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";
import { InputDkThamDoToaDoKhuVucModel, OutputDkThamDoToaDoKhuVucModel } from "src/app/models/admin/dangkyhoatdongkhoangsan/dkthamdotoadokhuvuc.model";

@Injectable({
  providedIn: 'root'
})
export class DkthamdotoadokhuvucService extends RepositoryEloquentService {

  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient,
      inputModelName: null,
      outputModelName: null,
      apiUrl: environment.apiIMineral + ServiceName.DANGKYTHAMDOTOADOKHUVUC
    });
  }

  public checkBeDeleted(id: string) {
    return "ok";
  }

}
