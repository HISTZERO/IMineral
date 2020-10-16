import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";
import { OutputCpThamDoKhoangSanModel, InputCpThamDoKhoangSanModel} from "src/app/models/admin/capphephoatdongkhoangsan/cpthamdokhoangsan.model";
import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";

@Injectable({
  providedIn: 'root'
})
export class CpThamDoKhoangSanService extends RepositoryEloquentService {

  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient,
      inputModelName: new InputCpThamDoKhoangSanModel(),
      outputModelName: new OutputCpThamDoKhoangSanModel(),
      apiUrl: environment.apiIMineral + ServiceName.CPTHAMDOKHOANGSAN
    });
  }

  public checkBeDeleted(id: string) {
    return "ok";
  }

  public getCapPhepThamDoByIdGiayPhep(idGiayPhep: any) {
    try {
      this.setServiceInfo({
        apiUrl: environment.apiIMineral + ServiceName.CPTHAMDOKHOANGSAN + "/getbyidgiayphep"
      });

      return this.httpClient.get<any>(`${this.apiUrl}?idgiayphep=${idGiayPhep}`, {
        headers: this.headers,
      });
    } catch (error) {

    }
  }

  public deleteCapPhepThamDoByIdGiayPhep(idGiayPhep: string) {
    try {
      this.setServiceInfo({
        apiUrl: environment.apiIMineral + ServiceName.CPTHAMDOKHOANGSAN + "/deletebyidgiayphep"
      });

      return this.httpClient.delete<any>(`${this.apiUrl}?idgiayphep=${idGiayPhep}`, {
        headers: this.headers,
      });
    } catch (error) {

    }
  }
}
