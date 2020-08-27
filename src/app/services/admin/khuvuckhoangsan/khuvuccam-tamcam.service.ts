import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";
import { InputKhuVucCamTamCam, OutputKhuVucCamTamCam } from "src/app/models/admin/khuvuckhoangsan/khuvuccamtamcam.model";
import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";

@Injectable({
  providedIn: 'root'
})
export class KhuvuccamTamcamService extends RepositoryEloquentService {

  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient,
      inputModelName: new InputKhuVucCamTamCam(),
      outputModelName: new OutputKhuVucCamTamCam(),
      apiUrl: environment.apiIMineral + ServiceName.KHUVUCDAUGIA
    });
  }

  public checkBeDeleted(id: number) {
    return "ok";
  }

}
