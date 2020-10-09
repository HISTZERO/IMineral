import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";
import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";
import {
  InputDkTanThuKhuVucModel,
  OutputDkTanThuKhuVucModel
} from "src/app/models/admin/dangkyhoatdongkhoangsan/dangkytanthu/dktanthukhuvuc.model";

@Injectable({
  providedIn: 'root'
})
export class DktanthukhuvucService extends RepositoryEloquentService {

  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient,
      inputModelName: new InputDkTanThuKhuVucModel(),
      outputModelName: new OutputDkTanThuKhuVucModel(),
      apiUrl: environment.apiIMineral + ServiceName.DANGKYTANTHUKHUVUC
    });
  }

  // Hàm service thêm mới khu vực và tọa độ
  public insertKhuVucVaToaDoTanThu(body: any) {
    this.setServiceInfo({
      apiUrl: environment.apiIMineral + ServiceName.DANGKYTANTHUKHUVUC,
    });
    return this.addItem(body);
  }

  // hàm service update khu vực và tọa dộ
  public updateKhuVucVaToaDoTanThu(body: any) {
    this.setServiceInfo({
      apiUrl: environment.apiIMineral + ServiceName.DANGKYTANTHUKHUVUC,
    });
    return this.updateItem(body);
  }


  public checkBeDeleted(id: string) {
    return "ok";
  }

}
