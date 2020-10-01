import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";
import {OutputCpTaiLieuModel, InputCpTaiLieuModel } from "src/app/models/admin/hosogiayto/cptailieu.model";
import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";
import { DataStateChangeEventArgs } from '@syncfusion/ej2-angular-grids';

@Injectable({
  providedIn: 'root'
})
export class GiayPhepTaiLieuSerVice extends RepositoryEloquentService {

  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient,
      inputModelName: new InputCpTaiLieuModel(),
      outputModelName: new OutputCpTaiLieuModel(),
      apiUrl: environment.apiIMineral + ServiceName.CPTAILIEU
    });
  }

  public checkBeDeleted(id: string) {
    return "ok";
  }

   /**
    * Lấy về danh sách tài liệu
    */
  public getCpTaiLieuPage(state: DataStateChangeEventArgs, params: object = {}) {
    this.setServiceInfo({
      apiUrl: environment.apiIMineral + ServiceName.CPTAILIEU + "/" + "getcptailieupage"
    });

    this.getDataFromServer(state, params);
  }

  public deleteItemsTaiLieu(params) {
    this.setServiceInfo({
      apiUrl: environment.apiIMineral + ServiceName.CPTAILIEU + '/removelistcptailieu'
    });
    return this.updateItem(params);
  }

  public removeFileCpTaiLieu(params) {
    this.setServiceInfo({
      apiUrl: environment.apiIMineral + ServiceName.CPTAILIEU + '/removefilecptailieu'
    });

    try {
      const queryString = this.convertObjectToQueryString(params);
      return this.httpClient.delete<any>(`${this.apiUrl}?${queryString}`, {
        headers: this.headers,
      });
    } catch (error) {

    }
  }
}
