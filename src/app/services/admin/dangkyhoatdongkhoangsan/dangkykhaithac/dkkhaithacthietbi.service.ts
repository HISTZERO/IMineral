import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";
import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";
import { InputDkKhaiThacThietBiModel, OutputDkKhaiThacThietBiModel } from "src/app/models/admin/dangkyhoatdongkhoangsan/dangkykhaithac/dkkhaithacthietbi.model";

@Injectable({
  providedIn: 'root'
})
export class DkkhaithacthietbiService extends RepositoryEloquentService {

  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient,
      inputModelName: new InputDkKhaiThacThietBiModel(),
      outputModelName: new OutputDkKhaiThacThietBiModel(),
      apiUrl: environment.apiIMineral + ServiceName.DANGKYKHAITHACTHIETBI
    });
  }

  public checkBeDeleted(id: string) {
    return "ok";
  }

}
