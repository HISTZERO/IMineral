import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";

import {RepositoryEloquentService} from "src/app/services/data/baserepository.service";
import {environment} from "src/environments/environment";
import {ServiceName} from "src/app/shared/constants/service-name";
import {
  InputCpTanThuDvhcModel,
  OutputCpTanThuDvhcModel
} from "src/app/models/admin/capphephoatdongkhoangsan/cptanthukhoangsan/cptanthudvhc.model";

@Injectable({
  providedIn: 'root'
})
export class CpTanThuDvhcService extends RepositoryEloquentService {

  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient,
      inputModelName: new InputCpTanThuDvhcModel(),
      outputModelName: new OutputCpTanThuDvhcModel(),
      apiUrl: environment.apiIMineral + ServiceName.CPTANTHUDVHC
    });
  }

  public checkBeDeleted(id: string) {
    return "ok";
  }

  public getCapPhepTanThuDvhcByIdCapPhepTanThu(idCapPhepTanThu: any) {
    try {
      return this.httpClient.get(`${this.apiUrl}/getbyidcappheptanthu?idcappheptanthu=${idCapPhepTanThu}`, {
        headers: this.headers,
      });
    } catch (error) {

    }
  }
}
