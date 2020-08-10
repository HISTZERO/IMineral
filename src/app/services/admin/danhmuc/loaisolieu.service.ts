import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import {
  InputLoaisolieuModel,
  OutputLoaisolieuModel
} from "src/app/models/admin/danhmuc/loaisolieu.model";
import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";
import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";

@Injectable({
  providedIn: "root"
})
export class LoaisolieuService extends RepositoryEloquentService {
  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient,
      inputModelName: new InputLoaisolieuModel(),
      outputModelName: new OutputLoaisolieuModel(),
      apiUrl: environment.apiCategoryURL + ServiceName.LOAISOLIEU
    });
  }

  public checkBeDeleted(id: number) {
    return "ok";
  }
}
