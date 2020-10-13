import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";
import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";
import { InputTtTinhTienCapQuyenModel, OutputTtTinhTienCapQuyenModel } from 'src/app/models/admin/tinhtiencapquyen/tttinhtiencapquyen.model';

@Injectable({
  providedIn: 'root'
})
export class TinhTienCapQuyenService extends RepositoryEloquentService {

  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient,
      inputModelName: new InputTtTinhTienCapQuyenModel(),
      outputModelName: new OutputTtTinhTienCapQuyenModel(),
      apiUrl: environment.apiIMineral + ServiceName.TTTINHTIENCAPQUYEN
    });
  }

  public checkBeDeleted(id: string) {
    return "ok";
  }

  public getTinhTienCapQuyenByIdGiayPhep(idGiayPhep: any) {
    try {
      return this.httpClient.get(`${this.apiUrl}/getbyidgiayphep?idgiayphep=${idGiayPhep}`, {
        headers: this.headers,
      });
    } catch (error) {

    }
  }
}
