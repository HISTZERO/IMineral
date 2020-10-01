import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";
import {InputDkThamDoDvhc, OutputDkThamDoDvhc } from "src/app/models/admin/dangkyhoatdongkhoangsan/dkthamdodvhc.model";
import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";
import {
  InputDkKhaiThacDvhc,
  OutputDkKhaiThacDvhc
} from "src/app/models/admin/dangkyhoatdongkhoangsan/dkkhaithacdvhc.model";

@Injectable({
  providedIn: 'root'
})
export class DkKhaiThacDvhcService extends RepositoryEloquentService {

  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient,
      inputModelName: new InputDkKhaiThacDvhc(),
      outputModelName: new OutputDkKhaiThacDvhc(),
      apiUrl: environment.apiIMineral + ServiceName.DANGKYKHAITHACDVHC
    });
  }

  public checkBeDeleted(id: string) {
    return "ok";
  }

  public getDangKyKhaiThacDvhcByIdDangKyKhaiThac(idDangKyKhaiThac: any) {
    try {
      return this.httpClient.get(`${this.apiUrl}?iddangkykhaithac=${idDangKyKhaiThac}`, {
        headers: this.headers,
      });
    } catch (error) {

    }
  }

  public getDangKyKhaiThacDvhcById(idKhaiThacDvhc: any) {
    this.setServiceInfo({
      apiUrl: environment.apiIMineral + ServiceName.DANGKYKHAITHACDVHC + "/GetDkKhaiThacDVHCById"
    });

    try {
      return this.httpClient.get(`${this.apiUrl}?idkhaithacdvhc=${idKhaiThacDvhc}`, {
        headers: this.headers,
      });
    } catch (error) {

    }
  }
}
