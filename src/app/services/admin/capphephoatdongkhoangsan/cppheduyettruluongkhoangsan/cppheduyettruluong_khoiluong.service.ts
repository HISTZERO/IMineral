import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";
import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";
import { InputCpPheDuyetTruLuongKhoiTruLuongModel, OutputCpPheDuyetTruLuongKhoiTruLuongModel } from 'src/app/models/admin/capphephoatdongkhoangsan/cppheduyettruluongkhoangsan/cpPheDuyetTruLuongKhoiTruLuong.model';

@Injectable({
  providedIn: 'root'
})
export class CpPheDuyetKhoangSanKhoiLuongTruLuongService extends RepositoryEloquentService {

  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient,
      inputModelName: new InputCpPheDuyetTruLuongKhoiTruLuongModel(),
      outputModelName: new OutputCpPheDuyetTruLuongKhoiTruLuongModel(),
      apiUrl: environment.apiIMineral + ServiceName.CAPPHEPPHEDUYETTLKS_KHOITRULUONG
    });
  }
  //Lấy danh sách Khối lượng trữ lượng
  public layDanhSachKhoiTruLuong(idGiayPhepPD: any) {
    try {
      return this.httpClient.get<any>(`${this.apiUrl}/idpheduyettruluong?idpheduyettruluong=${idGiayPhepPD}`, {
        headers: this.headers,
      });
    } catch (error) {

    }
  }

}
