import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';

import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";
import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";
import { InputCpKhaiThacDVHCModel, OutputCpKhaiThacDVHCModel } from "src/app/models/admin/capphephoatdongkhoangsan/cpkhaithackhoangsan/cpkhaithacdvhc.model";

@Injectable({
  providedIn: 'root'
})
export class CpkhaithacdvhcService extends RepositoryEloquentService {

  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient,
      inputModelName: new InputCpKhaiThacDVHCModel(),
      outputModelName: new OutputCpKhaiThacDVHCModel(),
      apiUrl: environment.apiIMineral + ServiceName.CPKHAITHACDVHC
    });
  }

  public checkBeDeleted(id: string) {
    return "ok";
  }

  // Hàm lấy dữ liệu cấp phép khai thác đvhc theo idcapphepkhaithac
  public getCpKhaiThacDVHCByIdCapPhep(idcapphepkhaithac: any) {
    try {
      this.setServiceInfo({
        apiUrl: environment.apiIMineral + ServiceName.CPKHAITHACDVHC + "/getbyidcapphepkhaithac"
      });

      return this.httpClient.get<any>(`${this.apiUrl}?idcapphepkhaithac=${idcapphepkhaithac}`, {
        headers: this.headers,
      });
    } catch (error) {

    }
  }

}
