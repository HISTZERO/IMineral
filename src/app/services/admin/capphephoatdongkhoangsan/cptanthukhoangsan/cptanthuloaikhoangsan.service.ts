import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {RepositoryEloquentService} from "src/app/services/data/baserepository.service";
import {environment} from "src/environments/environment";
import {ServiceName} from "src/app/shared/constants/service-name";
import {
  InputCpTanThuLoaiKhoangSanModel,
  OutputCpTanThuLoaiKhoangSanModel
} from "src/app/models/admin/capphephoatdongkhoangsan/cptanthukhoangsan/cptanthuloaikhoangsan.model";

@Injectable({
  providedIn: 'root'
})
export class CpTanThuLoaiKhoangSanService extends RepositoryEloquentService {

  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient,
      inputModelName: new InputCpTanThuLoaiKhoangSanModel(),
      outputModelName: new OutputCpTanThuLoaiKhoangSanModel(),
      apiUrl: environment.apiIMineral + ServiceName.CPTANTHULOAIKHOANGSAN
    });
  }

  public checkBeDeleted(id: string) {
    return "ok";
  }

  public getCapPhepTanThuLoaiKhoangSanByIdCapPhepTanThu(idCapPhepTanThu: any) {
    try {
      return this.httpClient.get(`${this.apiUrl}/getbyidcappheptanthu?idcappheptanthu=${idCapPhepTanThu}`, {
        headers: this.headers,
      });
    } catch (error) {

    }
  }
}
