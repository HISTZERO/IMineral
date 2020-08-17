import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";
import { InputLoaiBaoCaoModel, OutputLoaiBaoCaoModel } from "src/app/models/admin/danhmuc/loaibaocao.model";
import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";

@Injectable({
  providedIn: 'root'
})
export class LoaibaocaoService extends RepositoryEloquentService {

  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient,
      inputModelName: new InputLoaiBaoCaoModel(),
      outputModelName: new OutputLoaiBaoCaoModel(),
      apiUrl: environment.apiIMineral + ServiceName.LOAIBAOCAO
    });
  }

  public checkBeDeleted(id: number) {
    return "ok";
  }

}
