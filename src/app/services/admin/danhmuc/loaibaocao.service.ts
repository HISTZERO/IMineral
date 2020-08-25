import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";
import { InputDmLoaiBaoCaoModel, OutputDmLoaiBaoCaoModel } from "src/app/models/admin/danhmuc/loaibaocao.model";
import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";

@Injectable({
  providedIn: 'root'
})
export class DmLoaibaocaoService extends RepositoryEloquentService {

  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient,
      inputModelName: new InputDmLoaiBaoCaoModel(),
      outputModelName: new OutputDmLoaiBaoCaoModel(),
      apiUrl: environment.apiIMineral + ServiceName.LOAIBAOCAO
    });
  }

  /**
   * Hàm update status
   * @param params
   */
  public updateStatusItemsLoaiBaoCao(params) {
    this.setServiceInfo({
      apiUrl: environment.apiIMineral + ServiceName.LOAIBAOCAO + '/updateliststatus'
    });
    return this.updateItem(params);
  }

  /**
   * Hàm delete array item
   * @param params
   */
  public deleteItemsLoaiBaoCao(params) {
    this.setServiceInfo({
      apiUrl: environment.apiIMineral + ServiceName.LOAIBAOCAO + '/removelist'
    });
    return this.updateItem(params);
  }

  public checkBeDeleted(id: number) {
    return "ok";
  }

}
