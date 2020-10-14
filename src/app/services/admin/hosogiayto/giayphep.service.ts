import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";
import { OutputGiayPhepModel, InputGiayPhepModel } from "src/app/models/admin/hosogiayto/giayphep.model";
import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";
import { DataStateChangeEventArgs } from '@syncfusion/ej2-angular-grids';

@Injectable({
  providedIn: 'root'
})
export class GiayPhepService extends RepositoryEloquentService {

  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient,
      inputModelName: new InputGiayPhepModel(),
      outputModelName: new OutputGiayPhepModel(),
      apiUrl: environment.apiIMineral + ServiceName.GIAYPHEP
    });
  }

  public checkBeDeleted(id: string) {
    return "ok";
  }


  public geAllQuyetDinhTinhTienCapQuyen(state: DataStateChangeEventArgs, params: object = {}): void {
    this.setServiceInfo({
      apiUrl: environment.apiIMineral + ServiceName.GIAYPHEP + "/" + "getallgiaypheptinhtincapquyen"
    });

    this.getDataFromServer(state, params);
  }
}
