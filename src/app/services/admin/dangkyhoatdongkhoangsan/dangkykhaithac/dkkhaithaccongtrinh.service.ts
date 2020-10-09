import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";
import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";
import { InputDkKhaiThacCongTrinh, OutputDkKhaiThacCongTrinh } from "src/app/models/admin/dangkyhoatdongkhoangsan/dangkykhaithac/dkkhaithaccongtrinh.model";


@Injectable({
  providedIn: 'root'
})
export class DkKhaiThacCongTrinhService extends RepositoryEloquentService {

  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient,
      inputModelName: new InputDkKhaiThacCongTrinh(),
      outputModelName: new OutputDkKhaiThacCongTrinh(),
      apiUrl: environment.apiIMineral + ServiceName.DANGKYKHAITHACCONGTRINH
    });
  }

  public checkBeDeleted(id: string) {
    return "ok";
  }

  public getDangKyKhaiThacCongTrinhByIdDangKyKhaiThac(idhoso: any) {
    try {
      return this.httpClient.get(`${this.apiUrl}?iddangkykhaithac=${idhoso}`, {
        headers: this.headers,
      });
    } catch (error) {

    }
  }
}
