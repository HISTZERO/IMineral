import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";
import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";
import { InputDkKhaiThacLoaiKhoangSan, OutputDkKhaiThacLoaiKhoangSan } from "src/app/models/admin/dangkyhoatdongkhoangsan/dangkykhaithac/dkkhaithacloaikhoangsan.model";


@Injectable({
  providedIn: 'root'
})
export class DkkhaithacloaikhoangsanService extends RepositoryEloquentService {

  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient,
      inputModelName: new InputDkKhaiThacLoaiKhoangSan(),
      outputModelName: new OutputDkKhaiThacLoaiKhoangSan(),
      apiUrl: environment.apiIMineral + ServiceName.DANGKYKHAITHACLOAIKHOANGSAN
    });
  }

  public checkBeDeleted(id: string) {
    return "ok";
  }

  public getDangKyKhaiThacLoaiKhoangSanByIdDangKyKhaiThac(idhoso: any) {
    try {
      return this.httpClient.get(`${this.apiUrl}?iddangkykhaithac=${idhoso}`, {
        headers: this.headers,
      });
    } catch (error) {

    }
  }
}
