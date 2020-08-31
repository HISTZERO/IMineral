import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";
import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";
import {
  InputThietLapHeThongModel,
  OutputThietLapHeThongModel
} from "src/app/models/admin/thietlap/thietlap-hethong.model";

@Injectable({
  providedIn: 'root'
})
export class ThietlaphethongService extends RepositoryEloquentService {

  public now = new Date();
  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient: httpClient,
      inputModelName: new InputThietLapHeThongModel(),
      outputModelName: new OutputThietLapHeThongModel(),
      apiUrl: environment.apiIMineral + ServiceName.THIETLAPHETHONG
    });
  }

  /**
   * Hàm lấy value từ keySetting
   * @param param
   */
  async getSettingKey(param) {
    if (localStorage.getItem(param.key)) {
      const timePageSize = JSON.parse(localStorage.getItem('getTimePageSize'));
      if (this.now.getTime() < timePageSize) {
        return localStorage.getItem(param.key);
      } else {
        // Nếu thời gian tồn tại của biến localStorage dã hết thì chạy lại từ đầu sét lại biến setTime 4 tiếng
        localStorage.setItem('getTimePageSize', JSON.stringify(this.now.getTime() + 14400000));
        this.setServiceInfo({
          apiUrl: environment.apiIMineral + ServiceName.THIETLAPHETHONG + '/key'
        });
        const valueKey: any = await this.getFetchAll(param);
        localStorage.setItem(param.key, valueKey);
        return this.getFetchAll(param);
      }
    } else {
      // Khi bắt đầu chạy chương trình setTime để cài thời gian tồn tại của biến localStorage là 4 tiếng
      localStorage.setItem('getTimePageSize', JSON.stringify(this.now.getTime() + 14400000));
      this.setServiceInfo({
        apiUrl: environment.apiIMineral + ServiceName.THIETLAPHETHONG + '/key'
      });
      const valueKey: any = await this.getFetchAll(param);
      localStorage.setItem(param.key, valueKey);
      return this.getFetchAll(param);
    }
  }
  public checkBeDeleted(id: number) {
    return "ok";
  }
}
