import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "src/environments/environment";
import {ServiceName} from "src/app/shared/constants/service-name";
import {RepositoryEloquentService} from "src/app/services/data/baserepository.service";
import {
  InputCpDauGiaKhaiThacModel,
  OutputCpDauGiaKhaiThacModel
} from "src/app/models/admin/capphephoatdongkhoangsan/cpdaugiakhaithac/cpdaugiakhaithac.model";

@Injectable({
  providedIn: 'root'
})
export class CpdaugiakhaithacService extends RepositoryEloquentService {

  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient,
      inputModelName: new InputCpDauGiaKhaiThacModel(),
      outputModelName: new OutputCpDauGiaKhaiThacModel(),
      apiUrl: environment.apiIMineral + ServiceName.CPDAUGIAKHAITHAC
    });
  }

  public checkBeDeleted(id: string) {
    return "ok";
  }

  public getCapPhepDauGiaByIdGiayPhep(idGiayPhep: any) {
    try {
      this.setServiceInfo({
        apiUrl: environment.apiIMineral + ServiceName.CPDAUGIAKHAITHAC + "/getbyidgiayphep"
      });

      return this.httpClient.get<any>(`${this.apiUrl}?idgiayphep=${idGiayPhep}`, {
        headers: this.headers,
      });
    } catch (error) {

    }
  }

  public deleteCapPhepDauGiaByIdGiayPhep(idGiayPhep: string) {
    try {
      this.setServiceInfo({
        apiUrl: environment.apiIMineral + ServiceName.CPDAUGIAKHAITHAC + "/deletebyidgiayphep"
      });

      return this.httpClient.delete<any>(`${this.apiUrl}?idgiayphep=${idGiayPhep}`, {
        headers: this.headers,
      });
    } catch (error) {

    }
  }
}
