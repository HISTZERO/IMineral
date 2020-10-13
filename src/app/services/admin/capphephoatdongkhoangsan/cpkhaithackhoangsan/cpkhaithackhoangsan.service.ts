import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";
import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";
import { InputCpKhaiThacKhoangSanModel, OutputCpKhaiThacKhoangSanModel } from "src/app/models/admin/capphephoatdongkhoangsan/cpkhaithackhoangsan/cpkhaithackhoangsan.model";

@Injectable({
  providedIn: 'root'
})
export class CpkhaithackhoangsanService extends RepositoryEloquentService {

  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient,
      inputModelName: new InputCpKhaiThacKhoangSanModel(),
      outputModelName: new OutputCpKhaiThacKhoangSanModel(),
      apiUrl: environment.apiIMineral + ServiceName.CPKHAITHACKHOANGSAN
    });
  }

  public checkBeDeleted(id: string) {
    return "ok";
  }

  public getCapPhepKhaiThacByIdGiayPhep(idGiayPhep: any) {
    try {
      this.setServiceInfo({
        apiUrl: environment.apiIMineral + ServiceName.CPKHAITHACKHOANGSAN + "/getbyidgiayphep"
      });

      return this.httpClient.get<any>(`${this.apiUrl}?idgiayphep=${idGiayPhep}`, {
        headers: this.headers,
      });
    } catch (error) {

    }
  }

  public deleteCapPhepKhaiThacByIdGiayPhep(idGiayPhep: string) {
    try {
      this.setServiceInfo({
        apiUrl: environment.apiIMineral + ServiceName.CPKHAITHACKHOANGSAN + "/deletebyidgiayphep"
      });

      return this.httpClient.delete<any>(`${this.apiUrl}?idgiayphep=${idGiayPhep}`, {
        headers: this.headers,
      });
    } catch (error) {

    }
  }

}
