import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";
import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";
import { InputDkTanThuTraLaiModel, OutputDkTanThuTraLaiModel } from "src/app/models/admin/dangkyhoatdongkhoangsan/dktanthutralai.model";


@Injectable({
  providedIn: 'root'
})
export class DktanthutralaiService extends RepositoryEloquentService {

  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient,
      inputModelName: new InputDkTanThuTraLaiModel(),
      outputModelName: new OutputDkTanThuTraLaiModel(),
      apiUrl: environment.apiIMineral + ServiceName.DANGKYTANTHUTRALAI
    });
  }

  public checkBeDeleted(id: string) {
    return "ok";
  }

}
