import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";
import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";
import { InputDkKhaiThacDieuChinhModel, OutputDkKhaiThacDieuChinhModel } from "src/app/models/admin/dangkyhoatdongkhoangsan/dangkykhaithac/dkkhaithacdieuchinh.model";

@Injectable({
  providedIn: 'root'
})
export class DkkhaithacdieuchinhService extends RepositoryEloquentService {

  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient,
      inputModelName: new InputDkKhaiThacDieuChinhModel(),
      outputModelName: new OutputDkKhaiThacDieuChinhModel(),
      apiUrl: environment.apiIMineral + ServiceName.DANGKYKHAITHACDIEUCHINH
    });
  }

  public checkBeDeleted(id: string) {
    return "ok";
  }

  // Lấy thông tin đăng ký khai thác điều chỉnh từ id giấy phép
  public cloneThongTinDangKyKhaiThacDieuChinhFromGiayPhepLS(idGiayPhep: string) {
    try {
      this.setServiceInfo({
        apiUrl: environment.apiIMineral + ServiceName.DANGKYKHAITHACDIEUCHINH + "/getcpkhaithackhoangsanbyidgiayphep"
      });

      return this.httpClient.get<any>(`${this.apiUrl}?idgiayphep=${idGiayPhep}`, {
        headers: this.headers,
      });
    } catch (error) {

    }
  }
}
