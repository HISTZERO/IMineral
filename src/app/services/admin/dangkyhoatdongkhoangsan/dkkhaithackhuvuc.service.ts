import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";
import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";
import { InputDkKhaiThacKhuVucModel, OutputDkKhaiThacKhuVucModel } from "src/app/models/admin/dangkyhoatdongkhoangsan/dkkhaithackhuvuc.model";

@Injectable({
  providedIn: 'root'
})
export class DkkhaithackhuvucService extends RepositoryEloquentService {

  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient,
      inputModelName: new InputDkKhaiThacKhuVucModel(),
      outputModelName: new OutputDkKhaiThacKhuVucModel(),
      apiUrl: environment.apiIMineral + ServiceName.DANGKYKHAITHACKHUVUC
    });
  }

  public checkBeDeleted(id: string) {
    return "ok";
  }

}
