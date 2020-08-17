import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';

import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";
import { InputCapTruLuongModel, OutputCapTruLuongModel } from "src/app/models/admin/danhmuc/captruluong.model";
import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";

@Injectable({
  providedIn: 'root'
})
export class CaptruluongService extends RepositoryEloquentService {

  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient,
      inputModelName: new InputCapTruLuongModel(),
      outputModelName: new OutputCapTruLuongModel(),
      apiUrl: environment.apiIMineral + ServiceName.CAPTRULUONG
    });
  }

  public checkBeDeleted(id: number) {
    return "ok";
  }


}
