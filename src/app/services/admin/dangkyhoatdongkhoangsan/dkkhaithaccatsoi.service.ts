import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";
import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";
import { InputDkKhaiThacCatSoiModel, OutputDkKhaiThacCatSoiModel } from "src/app/models/admin/dangkyhoatdongkhoangsan/dkkhaithaccatsoi.model";

@Injectable({
  providedIn: 'root'
})
export class DkkhaithaccatsoiService extends RepositoryEloquentService {

  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient,
      inputModelName: new InputDkKhaiThacCatSoiModel(),
      outputModelName: new OutputDkKhaiThacCatSoiModel(),
      apiUrl: environment.apiIMineral + ServiceName.DANGKYKHAITHACCATSOI
    });
  }

  public checkBeDeleted(id: string) {
    return "ok";
  }

}
