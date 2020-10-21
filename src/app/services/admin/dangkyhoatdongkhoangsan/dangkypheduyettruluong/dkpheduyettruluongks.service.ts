import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";
import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";
import { InputDKPheDuyetTruLuongKSModel, OutputDKPheDuyetTruLuongKSModel } from 'src/app/models/admin/dangkyhoatdongkhoangsan/pheduyettruluong/thongTinChiTietPheDuyetTruLuong.model';

@Injectable({
  providedIn: 'root'
})
export class DKPheDuyetTruLuongKhoangSanService extends RepositoryEloquentService {

  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient,
      inputModelName: new InputDKPheDuyetTruLuongKSModel(),
      outputModelName: new OutputDKPheDuyetTruLuongKSModel(),
      apiUrl: environment.apiIMineral + ServiceName.DANGKYPHEDUYETTRULUONGKS
    });
  }
    //Lấy 1 bản ghi
    public getByIdHoSo(idHoSo: any) {
      try {
        return this.httpClient.get(`${this.apiUrl}?idhoso=${idHoSo}`, {
          headers: this.headers,
        });
      } catch (error) {
  
      }
    }
    //Lấy thông tin của 1 giấy phép theo id
    public layThongTinGiayPhepThamDo(id: any){
      try {
        return this.httpClient.get(`${this.apiUrl}/clonethongtindangkypheduyetfromgiayphepls?idgiayphep=${id}`, {
          headers: this.headers,
        });
      } catch (error) {
  
      }
    }
}
