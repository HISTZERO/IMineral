import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";

import {RepositoryEloquentService} from "src/app/services/data/baserepository.service";
import {environment} from "src/environments/environment";
import {ServiceName} from "src/app/shared/constants/service-name";
import {InputHsCoQuanBanHanhModel, OutputHsCoQuanBanHanhModel} from "src/app/models/admin/thietlap/coquanbanhanh.model";

@Injectable({
  providedIn: 'root'
})
export class CoquanbanhanhService extends RepositoryEloquentService {

  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient: httpClient,
      inputModelName: new InputHsCoQuanBanHanhModel(),
      outputModelName: new OutputHsCoQuanBanHanhModel(),
      apiUrl: environment.apiIMineral + ServiceName.COQUANBANHANH
    });
  }

  /**
   * Lấy về danh sách cơ quan tiếp nhận
   */
  public getAllCoQuanBanHanh(param) {
    this.setServiceInfo({
      apiUrl: environment.apiIMineral + ServiceName.COQUANBANHANH + "/" + ServiceName.GETALLCOQUANBANHANH
    });
    return this.getFetchAll(param);
  }

  public checkBeDeleted(id: string) {
    return "ok";
  }

}
