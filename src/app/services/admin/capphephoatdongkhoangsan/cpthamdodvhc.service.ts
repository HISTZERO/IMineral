import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";
import { InputCpThamDoDvhc, OutputCpThamDoDvhc} from "src/app/models/admin/capphephoatdongkhoangsan/cpthamdodvhc.model";
import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";

@Injectable({
  providedIn: 'root'
})
export class CpThamDoDvhcService extends RepositoryEloquentService {

  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient,
      inputModelName: new InputCpThamDoDvhc(),
      outputModelName: new OutputCpThamDoDvhc(),
      apiUrl: environment.apiIMineral + ServiceName.CPTHAMDODVHC
    });
  }

  public checkBeDeleted(id: string) {
    return "ok";
  }

  public getCapPhepThamDoDvhcByIdCapPhepThamDo(idCapPhepThamDo: any) {
    try {
      return this.httpClient.get(`${this.apiUrl}?idcapphepthamdo=${idCapPhepThamDo}`, {
        headers: this.headers,
      });
    } catch (error) {

    }
  }
}
