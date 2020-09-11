import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';

import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";
import { InputTaiLieuModel, OutputTaiLieuModel } from "src/app/models/admin/baocao/tailieudinhkem.model";
import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";

@Injectable({
  providedIn: 'root'
})
export class TailieudinhkemService extends RepositoryEloquentService {

  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
        httpClient,
        inputModelName: new InputTaiLieuModel(),
        outputModelName: new OutputTaiLieuModel(),
        apiUrl: environment.apiIMineral + ServiceName.BCTAILIEU
    });
}

public getAllTaiLieuByIdBaoCao(idbaocao: string) {
  this.setServiceInfo({
    apiUrl: environment.apiIMineral + ServiceName.BCTAILIEU + "/getbctailieubyidbaocao"
  });
  return this.getByid(idbaocao);
}

public checkBeDeleted(id: string) {
    return "ok";
}

}
