import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";
import { InputLoaiGiayPhepModel, OutputLoaiGiayPhepModel } from "src/app/models/admin/danhmuc/loaigiayphep.model";
import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";

@Injectable({
  providedIn: 'root'
})
export class LoaigiayphepService extends RepositoryEloquentService {

  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient,
      inputModelName: new InputLoaiGiayPhepModel(),
      outputModelName: new OutputLoaiGiayPhepModel(),
      apiUrl: environment.apiIMineral + ServiceName.LOAIGIAYPHEP
    });
  }

  public checkBeDeleted(id: string) {
    return "ok";
  }


}
