import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";
import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";
import { InputDkKhaiThacGiaHanModel, OutputDkKhaiThacGiaHanModel } from "src/app/models/admin/dangkyhoatdongkhoangsan/dangkykhaithac/dkkhaithacgiahan.model";

@Injectable({
  providedIn: 'root'
})
export class DkkhaithacgiahanService extends RepositoryEloquentService {

  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient,
      inputModelName: new InputDkKhaiThacGiaHanModel(),
      outputModelName: new OutputDkKhaiThacGiaHanModel(),
      apiUrl: environment.apiIMineral + ServiceName.DANGKYKHAITHACGIAHAN
    });
  }

  public checkBeDeleted(id: string) {
    return "ok";
  }

  // Lấy thông tin đăng ký khai thác từ id giấy phép
  public cloneThongTinDangKyKhaiThacFromGiayPhepLS(idGiayPhep: string) {
    try {
      this.setServiceInfo({
        apiUrl: environment.apiIMineral + ServiceName.DANGKYKHAITHACGIAHAN + "/clonethongtindangkykhaithacfromgiayphepls"
      });

      return this.httpClient.get<any>(`${this.apiUrl}?idgiayphep=${idGiayPhep}`, {
        headers: this.headers,
      });
    } catch (error) {

    }
  }

}
