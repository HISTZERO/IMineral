import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';

import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";
import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";
import { InputCpKhaiThacThietBiModel, OutputCpKhaiThacThietBiModel } from "src/app/models/admin/capphephoatdongkhoangsan/cpkhaithackhoangsan/cpkhaithacthietbi.model";

@Injectable({
  providedIn: 'root'
})
export class CpkhaithacthietbiService extends RepositoryEloquentService {

  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient,
      inputModelName: new InputCpKhaiThacThietBiModel(),
      outputModelName: new OutputCpKhaiThacThietBiModel(),
      apiUrl: environment.apiIMineral + ServiceName.CPKHAITHACTHIETBI
    });
  }

  public checkBeDeleted(id: string) {
    return "ok";
  }

  // Hàm lấy dữ liệu cấp phép khai thác thiết bị theo idcapphepkhaithac
  public getCpKhaiThacThietBiByIdCapPhep(idcapphepkhaithac: any) {
    try {
      this.setServiceInfo({
        apiUrl: environment.apiIMineral + ServiceName.CPKHAITHACTHIETBI + "/getbyidcapphepkhaithac"
      });

      return this.httpClient.get<any>(`${this.apiUrl}?idcapphepkhaithac=${idcapphepkhaithac}`, {
        headers: this.headers,
      });
    } catch (error) {

    }
  }

}
