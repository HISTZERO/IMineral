import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";
import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";
import { InputDkKhaiThacCatSoiModel, OutputDkKhaiThacCatSoiModel } from "src/app/models/admin/dangkyhoatdongkhoangsan/dkkhaithaccatsoi.model";
import {
  InputDkTanThuKhoangSanModel,
  OutputDkTanThuKhoangSanModel
} from "src/app/models/admin/dangkyhoatdongkhoangsan/dktanthukhoangsan.model";

@Injectable({
  providedIn: 'root'
})
export class DktanthukhoangsanService extends RepositoryEloquentService {

  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient,
      inputModelName: new InputDkTanThuKhoangSanModel(),
      outputModelName: new OutputDkTanThuKhoangSanModel(),
      apiUrl: environment.apiIMineral + ServiceName.DANGKYTANTHUKHOANGSAN
    });
  }

  public checkBeDeleted(id: string) {
    return "ok";
  }

}
