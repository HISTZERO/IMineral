import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';

import { environment } from "src/environments/environment";
import {InputCpThamDoKhuVucModel, OutputCpThamDoKhuVucModel  } from "src/app/models/admin/capphephoatdongkhoangsan/cpthamdokhuvuc.model";
import { ServiceName } from "src/app/shared/constants/service-name";
import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";

@Injectable({
  providedIn: 'root'
})
export class CpthamdokhuvucService extends RepositoryEloquentService {

  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient,
      inputModelName: new InputCpThamDoKhuVucModel(),
      outputModelName: new OutputCpThamDoKhuVucModel(),
      apiUrl: environment.apiIMineral + ServiceName.CPTHAMDOKHUVUC
    });
  }

  // Hàm service thêm mới khu vực và tọa độ
  public insertKhuVucVaToaDo(body: any) {
    this.setServiceInfo({
      apiUrl: environment.apiIMineral + ServiceName.CPTHAMDOKHUVUC + "/insertcpkhuvuclisttoado",
    });
    return this.addItem(body);
  }

  // hàm service update khu vực và tọa dộ
  public updateKhuVucVaToaDo(body: any) {
    this.setServiceInfo({
      apiUrl: environment.apiIMineral + ServiceName.CPTHAMDOKHUVUC + "/updatecpkhuvuclisttoado",
    });
    return this.updateItem(body);
  }

  public getCapPhepThamDoKhuVucByIdCapPhepThamDo(idCapPhepThamDo: any) {
    try {
      return this.httpClient.get(`${this.apiUrl}/getbyidcapphepthamdo?idcapphepthamdo=${idCapPhepThamDo}`, {
        headers: this.headers,
      });
    } catch (error) {

    }
  }

  public checkBeDeleted(id: string) {
    return "ok";
  }

}
