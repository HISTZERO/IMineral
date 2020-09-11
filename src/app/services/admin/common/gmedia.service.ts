import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";
import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";
import { InputGmediaModel, OutputGmediaModel } from "src/app/models/admin/common/gmedia.model";

@Injectable({
  providedIn: "root"
})
export class GmediaService extends RepositoryEloquentService {

  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient: httpClient,
      inputModelName: InputGmediaModel,
      outputModelName: OutputGmediaModel,
      apiUrl: environment.apiIMineral + ServiceName.GMEDIA
    });
  }

  public checkBeDeleted(id: number) {
    return "ok";
  }

  /**
   * Hàm post dùng để xóa mảng id
   * @param body
   */
  public deleteArrayItem(body) {
    this.setServiceInfo({
      apiUrl: environment.apiIMineral + ServiceName.GMEDIA + '/delete'
    });
    return this.addItem(body);
  }

  /**
   * Hàm search item
   * @param params
   */
  public searchItem(params) {
    this.setServiceInfo({
      apiUrl: environment.apiIMineral + ServiceName.GMEDIA + '/search'
    });
    return this.getAll(params);
  }
}
