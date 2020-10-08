import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";
import { InputCpThamDoDvhcModel, OutputCpThamDoDvhcModel} from "src/app/models/admin/capphephoatdongkhoangsan/cpthamdodvhc.model";
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
      inputModelName: new InputCpThamDoDvhcModel(),
      outputModelName: new OutputCpThamDoDvhcModel(),
      apiUrl: environment.apiIMineral + ServiceName.CPTHAMDODVHC
    });
  }

  public checkBeDeleted(id: string) {
    return "ok";
  }

  public getCapPhepThamDoDvhcByIdCapPhepThamDo(idCapPhepThamDo: any) {
    try {
      return this.httpClient.get(`${this.apiUrl}/getbyidcapphepthamdo?idcapphepthamdo=${idCapPhepThamDo}`, {
        headers: this.headers,
      });
    } catch (error) {

    }
  }
}
