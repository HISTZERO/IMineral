import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import {
  InputKhuVucKhongDauGiaModel,
  OutputKhuVucKhongDauGiaModel
} from "src/app/models/admin/khuvuckhoangsan/khuvuckhongdaugia.model";
import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";
import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";

@Injectable({
  providedIn: "root"
})
export class KhuVucKhongDauGiaService extends RepositoryEloquentService {
  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient,
      inputModelName: new InputKhuVucKhongDauGiaModel(),
      outputModelName: new OutputKhuVucKhongDauGiaModel(),
      apiUrl: environment.apiIMineral + ServiceName.KHUVUCKHONGDAUGIA
    });
  }

  public checkBeDeleted(id: number) {
    return "ok";
  }
}
