import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";
import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";
import { InputKhuVucToaDoModel, OutputKhuVucToaDoModel } from "src/app/models/admin/khuvuckhoangsan/khuvuctoado.model";

@Injectable({
  providedIn: 'root'
})
export class KhuvuctoadoService extends RepositoryEloquentService {

  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient,
      inputModelName: new InputKhuVucToaDoModel(),
      outputModelName: new OutputKhuVucToaDoModel(),
      apiUrl: environment.apiIMineral + ServiceName.KHUVUCTOADO
    });
  }

  public checkBeDeleted(id: string) {
    return "ok";
  }


}
