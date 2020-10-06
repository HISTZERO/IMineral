import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";

import {RepositoryEloquentService} from "src/app/services/data/baserepository.service";
import {environment} from "src/environments/environment";
import {ServiceName} from "src/app/shared/constants/service-name";
import {
  InputDkTanThuLoaiKhoangSan,
  OutputDkTanThuLoaiKhoangSan
} from "src/app/models/admin/dangkyhoatdongkhoangsan/dktanthuloaikhoangsan.model";

@Injectable({
  providedIn: 'root'
})
export class DktanthuloaikhoangsanService extends RepositoryEloquentService {

  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient,
      inputModelName: new InputDkTanThuLoaiKhoangSan(),
      outputModelName: new OutputDkTanThuLoaiKhoangSan(),
      apiUrl: environment.apiIMineral + ServiceName.DANGKYTANTHULOAIKHOANGSAN
    });
  }

  public checkBeDeleted(id: string) {
    return "ok";
  }

  public getDangKyTanThuLoaiKhoangSanByIdDangKyTanThu(idhoso: any) {
    try {
      return this.httpClient.get(`${this.apiUrl}?iddangkytanthu=${idhoso}`, {
        headers: this.headers,
      });
    } catch (error) {

    }
  }


}
