import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";
import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";
import { InputLoaiKhoangSan_TTDK_PDTL_Model, OutputLoaiKhoangSan_TTDK_PDTL_Model } from 'src/app/models/admin/dangkyhoatdongkhoangsan/pheduyettruluong/pdtl_thongindangky_loaikhoangsan.model';
import { InputPheDuyetTruLuongKS_KhuVucThamDoModel, OutputPheDuyetTruLuongKS_KhuVucThamDoModel } from 'src/app/models/admin/dangkyhoatdongkhoangsan/pheduyettruluong/pdtl_thongtindangky_khuvucthamdo.model';

@Injectable({
  providedIn: 'root'
})
export class CpPheDuyetTLKSKhuVucService extends RepositoryEloquentService {

  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient,
      inputModelName: new InputPheDuyetTruLuongKS_KhuVucThamDoModel(),
      outputModelName: new OutputPheDuyetTruLuongKS_KhuVucThamDoModel(),
      apiUrl: environment.apiIMineral + ServiceName.CAPPHEPPHEDUYETTLKS_KHUVUC
    });
  }
  //Lấy danh sách Khu vực
  public layDSKhuVuc(idGiayPhepPD: any) {
    try {
      return this.httpClient.get<any>(`${this.apiUrl}/getbyidpheduyettruluong?idpheduyettruluong=${idGiayPhepPD}`, {
        headers: this.headers,
      });
    } catch (error) {

    }
  }


   /**
   * Hàm thêm mới item cấp phép Phê duyệt trữ lượng - khu vực
   */
  public insertCapPhepKhaiThacKhuVuc(dataBody: any) {
    try {
      this.setServiceInfo({
        apiUrl: environment.apiIMineral + ServiceName.CAPPHEPPHEDUYETTLKS_KHUVUC + "/insertcpkhuvuclisttoado"
      });

      return this.addItem(dataBody);
    } catch (error) {

    }
  }

     /**
   * Hàm thêm mới item cấp phép khai thác khu vực
   */
  public updateCapPhepKhaiThacKhuVuc(dataBody: any) {
    try {
      this.setServiceInfo({
        apiUrl: environment.apiIMineral + ServiceName.CAPPHEPPHEDUYETTLKS_KHUVUC + "/updatecpkhuvuclisttoado"
      });

      return this.updateItem(dataBody);
    } catch (error) {

    }
  }

}
