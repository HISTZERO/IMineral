import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';

import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";
import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";
import {
  InputCpTanThuKhuVucModel,
  OutputCpTanThuKhuVucModel
} from "src/app/models/admin/capphephoatdongkhoangsan/cptanthukhoangsan/cptanthukhuvuc.model";

@Injectable({
  providedIn: 'root'
})
export class CptanthukhuvucService extends RepositoryEloquentService {

  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient,
      inputModelName: new InputCpTanThuKhuVucModel(),
      outputModelName: new OutputCpTanThuKhuVucModel(),
      apiUrl: environment.apiIMineral + ServiceName.CPTANTHUKHUVUC
    });
  }

  // Hàm service thêm mới khu vực và tọa độ
  public insertKhuVucVaToaDo(body: any) {
    this.setServiceInfo({
      apiUrl: environment.apiIMineral + ServiceName.CPTANTHUKHUVUC + "/insertcpkhuvuclisttoado",
    });
    return this.addItem(body);
  }

  // hàm service update khu vực và tọa dộ
  public updateKhuVucVaToaDo(body: any) {
    this.setServiceInfo({
      apiUrl: environment.apiIMineral + ServiceName.CPTANTHUKHUVUC + "/updatecpkhuvuclisttoado",
    });
    return this.updateItem(body);
  }

  public getCapPhepTanThuKhuVucByIdCapPhepTanThu(idCapPhepTanThu: any) {
    try {
      return this.httpClient.get(`${this.apiUrl}/getbyidcappheptanthu?idcappheptanthu=${idCapPhepTanThu}`, {
        headers: this.headers,
      });
    } catch (error) {

    }
  }

  public checkBeDeleted(id: string) {
    return "ok";
  }

}
