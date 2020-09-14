import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";
import {OutputHsTaiLieuModel, InputHsTaiLieuModel } from "src/app/models/admin/dangkyhoatdongkhoangsan/tailieu.model";
import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";
import { DataStateChangeEventArgs } from '@syncfusion/ej2-angular-grids';

@Injectable({
  providedIn: 'root'
})
export class TaiLieuSerVice extends RepositoryEloquentService {

  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient,
      inputModelName: new InputHsTaiLieuModel(),
      outputModelName: new OutputHsTaiLieuModel(),
      apiUrl: environment.apiIMineral + ServiceName.TAILIEU
    });
  }

  public checkBeDeleted(id: string) {
    return "ok";
  }

   /**
    * Lấy về danh sách tài liệu
    */
  public getHsTaiLieuPage(state: DataStateChangeEventArgs, params: object = {}) {
    this.setServiceInfo({
      apiUrl: environment.apiIMineral + ServiceName.TAILIEU + "/" + "gethstailieupage"
    });

    this.getDataFromServer(state, params);
  }


}
