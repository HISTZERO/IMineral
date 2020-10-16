import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { RepositoryEloquentService } from "src/app/services/data/baserepository.service";
import { environment } from "src/environments/environment";
import { ServiceName } from "src/app/shared/constants/service-name";
import { InputDkKhaiThacTraLaiModel, OutputDkKhaiThacTraLaiModel } from "src/app/models/admin/dangkyhoatdongkhoangsan/dangkytralai/dkkhaithactralai.model";

@Injectable({
  providedIn: 'root'
})
export class DkkhaithactralaiService extends RepositoryEloquentService {

  constructor(public httpClient: HttpClient) {
    super();
    this.setServiceInfo({
      httpClient,
      inputModelName: new InputDkKhaiThacTraLaiModel(),
      outputModelName: new OutputDkKhaiThacTraLaiModel(),
      apiUrl: environment.apiIMineral + ServiceName.DANGKYKHAITHACTRALAI
    });
  }

  public checkBeDeleted(id: string) {
    return "ok";
  }

  // Lấy thông tin đăng ký trả lại giấy phép khai thác từ id giấy phép
  public cloneThongTinDangKyKhaiThacTraLaiFromGiayPhepLS(idGiayPhep: string) {
    try {
      this.setServiceInfo({
        apiUrl: environment.apiIMineral + ServiceName.DANGKYKHAITHACTRALAI + "/clonethongtindangkykhaithacfromgiayphepls"
      });

      return this.httpClient.get<any>(`${this.apiUrl}?idgiayphep=${idGiayPhep}`, {
        headers: this.headers,
      });
    } catch (error) {

    }
  }
}
