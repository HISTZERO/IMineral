import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";
import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";
import { InputLoaiKhoangSan_TTDK_PDTL_Model, OutputLoaiKhoangSan_TTDK_PDTL_Model } from 'src/app/models/admin/dangkyhoatdongkhoangsan/pheduyettruluong/pdtl_thongindangky_loaikhoangsan.model';

@Injectable({
  providedIn: 'root'
})
export class CpPheDuyetTLKSLoaiKSService extends RepositoryEloquentService {

  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient,
      inputModelName: new InputLoaiKhoangSan_TTDK_PDTL_Model(),
      outputModelName: new OutputLoaiKhoangSan_TTDK_PDTL_Model(),
      apiUrl: environment.apiIMineral + ServiceName.CAPPHEPPHEDUYETTLKS_LOAIKS
    });
  }
  //Lấy danh sách Loại khoáng sản
  public layDSTruLuongLoaiKhoangSanTheoGiayPhepPheDuyet(idGiayPhepPD: any) {
    try {
      return this.httpClient.get<any>(`${this.apiUrl}/getbyidpheduyettruluong?idpheduyettruluong=${idGiayPhepPD}`, {
        headers: this.headers,
      });
    } catch (error) {

    }
  }
}
