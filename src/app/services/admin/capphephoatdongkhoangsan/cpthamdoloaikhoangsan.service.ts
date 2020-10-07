import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";
import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";
import { InputCpThamDoLoaiKhoangSanModel, OutputCpThamDoLoaiKhoangSanModel } from 'src/app/models/admin/capphephoatdongkhoangsan/cpthamdoloaikhoangsan.model';

@Injectable({
  providedIn: 'root'
})
export class CpThamDoLoaiKhoangSanService extends RepositoryEloquentService {

  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient,
      inputModelName: new InputCpThamDoLoaiKhoangSanModel(),
      outputModelName: new OutputCpThamDoLoaiKhoangSanModel(),
      apiUrl: environment.apiIMineral + ServiceName.CPTHAMDOLOAIKHOANGSAN
    });
  }

  public checkBeDeleted(id: string) {
    return "ok";
  }

  public getCapPhepThamDoLoaiKhoangSanByIdCapPhepThamDo(idCapPhepThamDo: any) {
    try {
      return this.httpClient.get(`${this.apiUrl}/getbyidcapphepthamdo?idcapphepthamdo=${idCapPhepThamDo}`, {
        headers: this.headers,
      });
    } catch (error) {

    }
  }
}
