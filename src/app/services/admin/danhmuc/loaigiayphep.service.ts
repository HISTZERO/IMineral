import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";
import { InputDmLoaiGiayPhepModel, OutputDmLoaiGiayPhepModel } from "src/app/models/admin/danhmuc/loaigiayphep.model";
import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";

@Injectable({
  providedIn: 'root'
})
export class DmLoaigiayphepService extends RepositoryEloquentService {

  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient,
      inputModelName: new InputDmLoaiGiayPhepModel(),
      outputModelName: new OutputDmLoaiGiayPhepModel(),
      apiUrl: environment.apiIMineral + ServiceName.LOAIGIAYPHEP
    });
  }

  public checkBeDeleted(id: string) {
    return "ok";
  }


}
