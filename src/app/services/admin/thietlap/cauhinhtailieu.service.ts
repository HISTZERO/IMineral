import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";
import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";
import { InputCauHinhTaiLieuModel, OutputCauHinhTaiLieuModel } from "src/app/models/admin/thietlap/cauhinhtailieu.model";

@Injectable({
  providedIn: 'root'
})
export class CauhinhtailieuService extends RepositoryEloquentService {

  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient: httpClient,
      inputModelName: new InputCauHinhTaiLieuModel(),
      outputModelName: new OutputCauHinhTaiLieuModel(),
      apiUrl: environment.apiIMineral + ServiceName.CAUHINHTAILIEU
    });
  }

  /**
   * Lấy về danh sách loại cấp phép theo trạng thái
   */
  public getAllStatusCauHinhTaiLieu(param: any) {
    this.setServiceInfo({
      apiUrl: environment.apiIMineral + ServiceName.CAUHINHTAILIEU + "/" + ServiceName.STATUSCAUHINHTAILIEU
    });
    return this.getFetchAll(param);
  }

  public checkBeDeleted(id: number) {
    return "ok";
  }

}
