import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";
import {InputCpThamDoCongTrinhModel, OutputCpThamDoCongTrinhModel } from "src/app/models/admin/capphephoatdongkhoangsan/cpthamdocongtrinh.model";
import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";

@Injectable({
  providedIn: 'root'
})
export class CpPheDuyetTLKSService extends RepositoryEloquentService {

  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient,
      inputModelName: new InputCpThamDoCongTrinhModel(),
      outputModelName: new OutputCpThamDoCongTrinhModel(),
      apiUrl: environment.apiIMineral + ServiceName.CAPPHEPPHEDUYETTLKS
    });
  }

  
  
  /**
   * Lấy thông tin cấp phép phê duyệt theo id giấy phép
   */
  public layThongTinCpPheDuyetTheoIdGiayPhep(idGiayPhep: any) {
    try {
      return this.httpClient.get<any>(`${this.apiUrl}/getbyidgiayphep?idgiayphep=${idGiayPhep}`, {
        headers: this.headers,
      });
    } catch (error) {

    }
  }
}
