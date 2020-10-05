import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';

import { environment } from "src/environments/environment";
import { InputDkThamDoKhuVucModel, OutputDkThamDoKhuVucModel } from "src/app/models/admin/dangkyhoatdongkhoangsan/dkthamdokhuvuc.model";
import { ServiceName } from "src/app/shared/constants/service-name";
import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";

@Injectable({
  providedIn: 'root'
})
export class DkthamdokhuvucService extends RepositoryEloquentService {

  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient,
      inputModelName: new InputDkThamDoKhuVucModel(),
      outputModelName: new OutputDkThamDoKhuVucModel(),
      apiUrl: environment.apiIMineral + ServiceName.DANGKYTHAMDOKHUVUC
    });
  }

  // Hàm service thêm mới khu vực và tọa độ
  public insertKhuVucVaToaDo(body: any) {
    this.setServiceInfo({
      apiUrl: environment.apiIMineral + ServiceName.DANGKYTHAMDOKHUVUC + "/insertkhuvuc",
    });
    return this.addItem(body);
  }

  // hàm service update khu vực và tọa dộ
  public updateKhuVucVaToaDo(body: any) {
    this.setServiceInfo({
      apiUrl: environment.apiIMineral + ServiceName.DANGKYTHAMDOKHUVUC + "/updatekhuvucandtoado",
    });
    return this.updateItem(body);
  }
  
  public checkBeDeleted(id: string) {
    return "ok";
  }

}
