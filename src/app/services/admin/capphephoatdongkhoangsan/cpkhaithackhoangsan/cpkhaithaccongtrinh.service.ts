import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';

import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";
import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";
import { InputCpKhaiThacCongTrinhModel, OutputCpKhaiThacCongTrinhModel } from "src/app/models/admin/capphephoatdongkhoangsan/cpkhaithackhoangsan/cpkhaithaccongtrinh.model";

@Injectable({
  providedIn: 'root'
})
export class CpkhaithaccongtrinhService extends RepositoryEloquentService {

  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient,
      inputModelName: new InputCpKhaiThacCongTrinhModel(),
      outputModelName: new OutputCpKhaiThacCongTrinhModel(),
      apiUrl: environment.apiIMineral + ServiceName.CPKHAITHACCONGTRINH
    });
  }

  public checkBeDeleted(id: string) {
    return "ok";
  }

  // Hàm lấy dữ liệu cấp phép khai thác công trình theo idcapphepkhaithac
  public getCpKhaiThacCongTrinhByIdCapPhep(idcapphepkhaithac: any) {
    try {
      this.setServiceInfo({
        apiUrl: environment.apiIMineral + ServiceName.CPKHAITHACCONGTRINH + "/getbyidcapphepkhaithac"
      });

      return this.httpClient.get<any>(`${this.apiUrl}?idcapphepkhaithac=${idcapphepkhaithac}`, {
        headers: this.headers,
      });
    } catch (error) {

    }
  }

}
