import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";
import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";
import { InputDkKhaiThacKhoangSanDuAnModel, OutputDkKhaiThacKhoangSanDuAnModel } from "src/app/models/admin/dangkyhoatdongkhoangsan/dkkhaithackhoangsanduan.model";

@Injectable({
  providedIn: 'root'
})
export class DkkhaithackhoangsanduanService extends RepositoryEloquentService {

  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient,
      inputModelName: new InputDkKhaiThacKhoangSanDuAnModel(),
      outputModelName: new OutputDkKhaiThacKhoangSanDuAnModel(),
      apiUrl: environment.apiIMineral + ServiceName.DANGKYKHAITHACKHOANGSANDUAN
    });
  }

  public checkBeDeleted(id: string) {
    return "ok";
  }

}
