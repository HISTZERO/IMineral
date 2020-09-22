import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";
import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";
import { InputDkKhaiThacKhoangSanModel, OutputDkKhaiThacKhoangSanModel } from "src/app/models/admin/dangkyhoatdongkhoangsan/dkkhaithackhoangsan.model";

@Injectable({
  providedIn: 'root'
})
export class DkkhaithackhoangsanService extends RepositoryEloquentService {

  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient,
      inputModelName: new InputDkKhaiThacKhoangSanModel(),
      outputModelName: new OutputDkKhaiThacKhoangSanModel(),
      apiUrl: environment.apiIMineral + ServiceName.DANGKYKHAITHACKHOANGSAN
    });
  }

  public checkBeDeleted(id: string) {
    return "ok";
  }

}
