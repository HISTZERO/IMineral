import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";
import { InputKhuVucCamTamCamModel, OutputKhuVucCamTamCamModel } from "src/app/models/admin/khuvuckhoangsan/khuvuccamtamcam.model";
import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";

@Injectable({
  providedIn: 'root'
})
export class KhuvuckhoangsandochaiService extends RepositoryEloquentService {

  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient,
      inputModelName: new InputKhuVucCamTamCamModel(),
      outputModelName: new OutputKhuVucCamTamCamModel(),
      apiUrl: environment.apiIMineral + ServiceName.KHUVUCCAMTAMCAM
    });
  }

  public checkBeDeleted(id: string) {
    return "ok";
  }

}
